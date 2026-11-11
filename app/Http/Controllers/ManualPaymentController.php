<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ManualPaymentController extends Controller
{
    // 1. Student uploads the receipt
    public function uploadReceipt(Request $request, Course $course)
    {
        $request->validate([
            'receipt' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'referral_code' => 'nullable|string|max:30',
        ], [
            'receipt.required' => 'Please select and upload your payment receipt image.',
            'receipt.image' => 'The uploaded file must be an image (JPEG, PNG, JPG, or WEBP).',
            'receipt.max' => 'The receipt image file size must not exceed 5MB.',
        ]);

        // Prevent duplicate active enrollments
        $existingPurchase = \App\Models\Purchase::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->where('status', 'paid')
            ->first();

        if ($existingPurchase && !$existingPurchase->isExpired()) {
            $expiryStr = $existingPurchase->expires_at ? $existingPurchase->expires_at->format('M d, Y') : 'in 6 months';
            return redirect()->back()->withErrors([
                'receipt' => "You already have active 6-month access to this course until {$expiryStr}.",
            ]);
        }

        // Prevent duplicate pending payment submissions
        $pendingPayment = Payment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->first();

        if ($pendingPayment) {
            return redirect()->back()->withErrors([
                'receipt' => 'You already have a pending payment receipt waiting for admin review for this course.',
            ]);
        }

        // Optional referral code lookup
        $referrer = null;
        $referralCode = null;
        if ($request->filled('referral_code')) {
            $cleanedCode = strtoupper(trim($request->referral_code));
            $foundUser = \App\Models\User::where('referral_code', $cleanedCode)->first();
            if (!$foundUser) {
                return redirect()->back()->withErrors([
                    'referral_code' => 'The referral number entered does not exist.',
                ])->withInput();
            }
            if ($foundUser->id === Auth::id()) {
                return redirect()->back()->withErrors([
                    'referral_code' => 'You cannot use your own referral number.',
                ])->withInput();
            }
            $referrer = $foundUser;
            $referralCode = $cleanedCode;
        }

        // Save the receipt image to storage/app/public/receipts
        $filePath = $request->file('receipt')->store('receipts', 'public');

        // Create a pending payment record
        $payment = Payment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
            'transaction_id' => 'MANUAL_' . uniqid(),
            'amount' => $course->price,
            'payment_method' => 'manual_transfer',
            'referral_code' => $referralCode,
            'referrer_id' => $referrer?->id,
            'status' => 'pending', // Stays pending until Admin approves
            'receipt_image' => $filePath,
        ]);

        // Record pending referral commission for the inviter if applicable
        if ($referrer) {
            $referralSettings = \App\Models\ReferralSetting::getSettings();
            if ($referralSettings->is_active) {
                $commissionRate = $referralSettings->reward_type === 'percentage' ? (float) $referralSettings->reward_value : 0.0;
                $commissionAmount = $referralSettings->reward_type === 'percentage'
                    ? round($course->price * ($referralSettings->reward_value / 100), 2)
                    : (float) $referralSettings->reward_value;

                \App\Models\ReferralEarning::create([
                    'referrer_id' => $referrer->id,
                    'referred_user_id' => Auth::id(),
                    'course_id' => $course->id,
                    'payment_id' => $payment->id,
                    'course_price' => $course->price,
                    'commission_rate' => $commissionRate,
                    'commission_amount' => $commissionAmount,
                    'status' => 'pending',
                ]);
            }
        }

        return redirect()->back()->with('success', 'Receipt uploaded successfully! The admin will review your payment shortly.');
    }

    // 2. Admin verifies the payment with the bank/Telebirr transaction ID.
    //    If that transaction ID was already used to register a student, it is rejected.
    public function approvePayment(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'transaction_id' => 'required|string|min:4|max:100',
        ], [
            'transaction_id.required' => 'Please enter the transaction ID from the payment receipt.',
            'transaction_id.min' => 'The transaction ID looks too short. Please check the receipt and try again.',
        ]);

        if ($payment->status !== 'pending') {
            return redirect()->back()->with('error', 'This payment has already been processed.');
        }

        // Normalise so "ft 123 abc" and "FT123ABC" count as the same transaction.
        $transactionId = strtoupper(preg_replace('/\s+/', '', $validated['transaction_id']));

        $existing = Payment::with('user:id,name')
            ->where('id', '!=', $payment->id)
            ->where('status', 'success')
            ->where('transaction_id', $transactionId)
            ->first();

        if ($existing) {
            $name = $existing->user?->name ?? 'Another student';

            return redirect()->back()->withErrors([
                'transaction_id' => "{$name} is already registered by this transaction ID. Please try again.",
            ])->with('payment_error_id', $payment->id);
        }

        try {
            DB::transaction(function () use ($payment, $transactionId) {
                $payment->update([
                    'transaction_id' => $transactionId,
                    'status' => 'success',
                ]);

                // UNLOCK THE COURSE (Create or renew the Purchase record for 6 months)
                \App\Models\Purchase::updateOrCreate(
                    [
                        'user_id' => $payment->user_id,
                        'course_id' => $payment->course_id,
                    ],
                    [
                        'amount' => $payment->amount,
                        'status' => 'paid',
                        'expires_at' => now()->addMonths(6),
                    ]
                );
            });
        } catch (QueryException $e) {
            // The unique index caught a simultaneous duplicate.
            return redirect()->back()->withErrors([
                'transaction_id' => 'This transaction ID is already registered to another student. Please try again.',
            ])->with('payment_error_id', $payment->id);
        }
        // Credit referral earning to the inviter
        if ($payment->referrer_id) {
            $earning = \App\Models\ReferralEarning::where('payment_id', $payment->id)->first();
            if ($earning) {
                $earning->update(['status' => 'credited']);
            } else {
                $referralSettings = \App\Models\ReferralSetting::getSettings();
                if ($referralSettings->is_active) {
                    $commissionRate = $referralSettings->reward_type === 'percentage' ? (float) $referralSettings->reward_value : 0.0;
                    $commissionAmount = $referralSettings->reward_type === 'percentage'
                        ? round($payment->amount * ($referralSettings->reward_value / 100), 2)
                        : (float) $referralSettings->reward_value;

                    \App\Models\ReferralEarning::create([
                        'referrer_id' => $payment->referrer_id,
                        'referred_user_id' => $payment->user_id,
                        'course_id' => $payment->course_id,
                        'payment_id' => $payment->id,
                        'course_price' => $payment->amount,
                        'commission_rate' => $commissionRate,
                        'commission_amount' => $commissionAmount,
                        'status' => 'credited',
                    ]);
                }
            }
        }

        return redirect()->back()->with('success', 'Payment approved! Course unlocked and referral bonus credited.');
    }
}