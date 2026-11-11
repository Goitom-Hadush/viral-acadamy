<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Payment;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MockPaymentController extends Controller
{
    public function pay(Request $request, Course $course)
    {
        $user = Auth::user();

        // Check if they already have active access
        $existingPurchase = Purchase::where('user_id', $user->id)
                                    ->where('course_id', $course->id)
                                    ->where('status', 'paid')
                                    ->first();

        if ($existingPurchase && !$existingPurchase->isExpired()) {
            return redirect()->route('student.learning', $course->id)->with('info', 'You already have active 6-month access to this course!');
        }

        // Optional referral code lookup
        $referrer = null;
        $referralCode = null;
        if ($request->filled('referral_code')) {
            $cleanedCode = strtoupper(trim($request->referral_code));
            $foundUser = \App\Models\User::where('referral_code', $cleanedCode)->first();
            if ($foundUser && $foundUser->id !== $user->id) {
                $referrer = $foundUser;
                $referralCode = $cleanedCode;
            }
        }

        // 1. Create a successful Payment record
        $payment = Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'transaction_id' => 'MOCK_TXN_' . uniqid(),
            'amount' => $course->price,
            'payment_method' => 'mock_chapa',
            'referral_code' => $referralCode,
            'referrer_id' => $referrer?->id,
            'status' => 'success',
        ]);

        // 2. UNLOCK THE COURSE (Create or renew the Purchase for 6 months)
        Purchase::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'amount' => $course->price,
                'status' => 'paid',
                'expires_at' => now()->addMonths(6),
            ]
        );

        // 3. Record credited referral earning to inviter
        if ($referrer) {
            $referralSettings = \App\Models\ReferralSetting::getSettings();
            if ($referralSettings->is_active) {
                $commissionRate = $referralSettings->reward_type === 'percentage' ? (float) $referralSettings->reward_value : 0.0;
                $commissionAmount = $referralSettings->reward_type === 'percentage'
                    ? round($course->price * ($referralSettings->reward_value / 100), 2)
                    : (float) $referralSettings->reward_value;

                \App\Models\ReferralEarning::create([
                    'referrer_id' => $referrer->id,
                    'referred_user_id' => $user->id,
                    'course_id' => $course->id,
                    'payment_id' => $payment->id,
                    'course_price' => $course->price,
                    'commission_rate' => $commissionRate,
                    'commission_amount' => $commissionAmount,
                    'status' => 'credited',
                ]);
            }
        }

        // 4. Redirect to the secure learning page
        return redirect()->route('student.learn', $course->id)->with('success', 'Payment successful! Course unlocked.');
    }
}