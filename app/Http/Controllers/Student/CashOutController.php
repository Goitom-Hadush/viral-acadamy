<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CashOutRequest;
use App\Models\ReferralSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CashOutController extends Controller
{
    /**
     * Submit a cash out request for referral earnings.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $settings = ReferralSetting::getSettings();
        $availableBalance = $user->availableReferralBalance();
        $minCashOut = (float) $settings->min_cash_out;

        $request->validate([
            'amount' => ['required', 'numeric', 'min:' . $minCashOut],
            'payout_method' => ['required', 'string', 'in:telebirr,cbe,bank'],
            'account_number' => ['required', 'string', 'max:100'],
            'account_name' => ['required', 'string', 'max:150'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'student_notes' => ['nullable', 'string', 'max:500'],
        ], [
            'amount.min' => "The minimum cash out amount is " . number_format($minCashOut, 2) . " ETB.",
            'payout_method.required' => 'Please select a payout method (Telebirr, CBE Bank, or Other Bank).',
            'account_number.required' => 'Please enter your account number or phone number.',
            'account_name.required' => 'Please enter the registered account owner name.',
        ]);

        if ($request->amount > $availableBalance) {
            return back()->withErrors([
                'amount' => 'Requested amount (' . number_format($request->amount, 2) . ' ETB) exceeds your available balance of ' . number_format($availableBalance, 2) . ' ETB.',
            ]);
        }

        CashOutRequest::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'payout_method' => $request->payout_method,
            'account_number' => $request->account_number,
            'account_name' => $request->account_name,
            'bank_name' => $request->bank_name ?: ($request->payout_method === 'cbe' ? 'Commercial Bank of Ethiopia (CBE)' : null),
            'student_notes' => $request->student_notes,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your cash out request for ' . number_format($request->amount, 2) . ' ETB has been submitted! Admin will review and process your payment shortly.');
    }
}
