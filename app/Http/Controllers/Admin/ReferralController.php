<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashOutRequest;
use App\Models\ReferralEarning;
use App\Models\ReferralSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReferralController extends Controller
{
    /**
     * Display the Referrals & Cash Outs management dashboard.
     */
    public function index(Request $request)
    {
        $statusFilter = $request->query('status', 'all');

        $query = CashOutRequest::with(['user:id,name,email,phone', 'processor:id,name'])
                               ->latest();

        if (in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $statusFilter);
        }

        $cashOuts = $query->paginate(20)->withQueryString();

        // Platform-wide metrics
        $metrics = [
            'total_credited_rewards' => (float) ReferralEarning::where('status', 'credited')->sum('commission_amount'),
            'total_cashed_out' => (float) CashOutRequest::where('status', 'approved')->sum('amount'),
            'pending_cash_outs_total' => (float) CashOutRequest::where('status', 'pending')->sum('amount'),
            'pending_requests_count' => CashOutRequest::where('status', 'pending')->count(),
            'approved_requests_count' => CashOutRequest::where('status', 'approved')->count(),
            'total_referrals_count' => ReferralEarning::count(),
        ];

        // Recent referral earnings log (latest 15)
        $recentEarnings = ReferralEarning::with([
            'referrer:id,name,email,referral_code',
            'referredUser:id,name,email',
            'course:id,title,price',
        ])->latest()->take(15)->get();

        return Inertia::render('Admin/Referrals/Index', [
            'settings' => ReferralSetting::getSettings(),
            'cashOuts' => $cashOuts,
            'metrics' => $metrics,
            'recentEarnings' => $recentEarnings,
            'filters' => [
                'status' => $statusFilter,
            ],
        ]);
    }

    /**
     * Update referral program settings (headline, reward number/type, instructions).
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'headline' => ['required', 'string', 'max:255'],
            'tagline' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'reward_type' => ['required', 'string', 'in:fixed,percentage'],
            'reward_value' => ['required', 'numeric', 'min:0'],
            'min_cash_out' => ['required', 'numeric', 'min:1'],
            'cash_out_instructions' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ]);

        $settings = ReferralSetting::getSettings();
        $settings->update([
            'headline' => $request->headline,
            'tagline' => $request->tagline,
            'description' => $request->description,
            'reward_type' => $request->reward_type,
            'reward_value' => $request->reward_value,
            'min_cash_out' => $request->min_cash_out,
            'cash_out_instructions' => $request->cash_out_instructions,
            'is_active' => $request->is_active,
        ]);

        return back()->with('success', 'Referral program settings updated successfully!');
    }

    /**
     * Approve a cash out request and mark as paid.
     */
    public function approveCashOut(Request $request, CashOutRequest $cashOut)
    {
        $request->validate([
            'transaction_reference' => ['nullable', 'string', 'max:150'],
            'admin_notes' => ['nullable', 'string', 'max:500'],
        ]);

        if ($cashOut->status !== 'pending') {
            return back()->withErrors(['general' => 'This request has already been processed.']);
        }

        $cashOut->update([
            'status' => 'approved',
            'transaction_reference' => $request->transaction_reference,
            'admin_notes' => $request->admin_notes,
            'processed_at' => now(),
            'processed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Cash out of ' . number_format($cashOut->amount, 2) . ' ETB approved and marked as paid!');
    }

    /**
     * Reject a cash out request (returns money to student balance).
     */
    public function rejectCashOut(Request $request, CashOutRequest $cashOut)
    {
        $request->validate([
            'admin_notes' => ['required', 'string', 'max:500'],
        ], [
            'admin_notes.required' => 'Please provide a reason or note for rejecting this cash out request.',
        ]);

        if ($cashOut->status !== 'pending') {
            return back()->withErrors(['general' => 'This request has already been processed.']);
        }

        $cashOut->update([
            'status' => 'rejected',
            'admin_notes' => $request->admin_notes,
            'processed_at' => now(),
            'processed_by' => Auth::id(),
        ]);

        return back()->with('success', 'Cash out request rejected. The requested amount has been returned to the student\'s available balance.');
    }
}
