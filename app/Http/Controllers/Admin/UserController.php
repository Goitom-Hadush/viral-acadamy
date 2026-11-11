<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashOutRequest;
use App\Models\Payment;
use App\Models\ReferralEarning;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withCount(['purchasedCourses', 'courses', 'referralEarnings', 'cashOutRequests'])
            ->with([
                'purchasedCourses' => fn ($q) => $q->select('courses.id', 'courses.title', 'courses.price', 'courses.price_usd'),
                'courses' => fn ($q) => $q->select('courses.id', 'courses.instructor_id', 'courses.title', 'courses.price'),
            ])
            ->latest()
            ->get();

        // ── Verified payments (transaction IDs), grouped by student → course. One query. ──
        $payments = Payment::query()
            ->where('status', 'success')
            ->orderBy('updated_at')
            ->get(['id', 'user_id', 'course_id', 'transaction_id', 'amount', 'updated_at'])
            ->groupBy('user_id');

        $pendingByUser = Payment::query()
            ->where('status', 'pending')
            ->selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->pluck('total', 'user_id');

        // ── Referral wallet numbers for ALL users in 2 grouped queries (was 4 queries per user). ──
        $income = ReferralEarning::query()
            ->where('status', 'credited')
            ->selectRaw('referrer_id, SUM(commission_amount) as total')
            ->groupBy('referrer_id')
            ->pluck('total', 'referrer_id');

        $cashOuts = CashOutRequest::query()
            ->whereIn('status', ['approved', 'pending'])
            ->selectRaw('user_id, status, SUM(amount) as total')
            ->groupBy('user_id', 'status')
            ->get()
            ->groupBy('user_id');

        $rows = $users->map(function ($u) use ($payments, $pendingByUser, $income, $cashOuts) {
            $userPayments = $payments->get($u->id, collect());

            $enrollments = $u->purchasedCourses->map(function ($course) use ($userPayments) {
                // Latest verified payment for this course = the transaction that unlocked it.
                $payment = $userPayments->where('course_id', $course->id)->last();
                $expires = $course->pivot?->expires_at ? Carbon::parse($course->pivot->expires_at) : null;

                return [
                    'course_id' => $course->id,
                    'title' => $course->title,
                    'price' => $course->price,
                    'price_usd' => $course->price_usd,
                    'transaction_id' => $payment?->transaction_id,
                    'amount' => $payment?->amount,
                    'verified_at' => $payment?->updated_at?->toIso8601String(),
                    'expires_at' => $expires?->toDateString(),
                    'is_expired' => $expires ? $expires->isPast() : false,
                ];
            })->values();

            $earned = (float) ($income[$u->id] ?? 0);
            $userCashOuts = $cashOuts->get($u->id, collect())->pluck('total', 'status');
            $cashedOut = (float) ($userCashOuts['approved'] ?? 0);
            $pendingOut = (float) ($userCashOuts['pending'] ?? 0);

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role,
                'status' => $u->status,
                'avatar' => $u->avatar,
                'referral_code' => $u->referral_code,
                'created_at' => $u->created_at?->toIso8601String(),
                'email_verified_at' => $u->email_verified_at?->toIso8601String(),
                'purchased_courses_count' => $u->purchased_courses_count,
                'enrollments' => $enrollments,
                'pending_payments' => (int) ($pendingByUser[$u->id] ?? 0),
                'courses_count' => $u->courses_count,
                'courses' => $u->courses->map(fn ($c) => ['id' => $c->id, 'title' => $c->title, 'price' => $c->price])->values(),
                'referral_earnings_count' => $u->referral_earnings_count,
                'total_referral_income' => $earned,
                'available_referral_balance' => max(0.0, round($earned - ($cashedOut + $pendingOut), 2)),
                'total_cashed_out' => $cashedOut,
                'pending_cash_out' => $pendingOut,
            ];
        });

        if (request()->wantsJson()) {
            return response()->json(['users' => $rows]);
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $rows,
        ]);
    }
    public function changeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,instructor,student',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', "User role updated to {$validated['role']} successfully.");
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete your own logged-in admin account.');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->back()->with('success', "User \"{$userName}\" has been deleted successfully.");
    }
}
