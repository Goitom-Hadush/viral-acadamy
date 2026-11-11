<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\CourseCertificate;
use App\Models\Payment;
use App\Models\User;
use App\Models\VideoProgress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $student = Auth::user();

        // Ensure student has a referral code
        if (! $student->referral_code) {
            $student->referral_code = User::generateUniqueReferralCode();
            $student->save();
        }

        // Paid courses with only the columns the dashboard needs.
        $courses = $student->purchasedCourses()
            ->select('courses.id', 'courses.title', 'courses.thumbnail', 'courses.instructor_id')
            ->with('instructor:id,name')
            ->withCount('videos')
            ->get();

        $courseIds = $courses->pluck('id');

        // Completed lessons per course in ONE query (instead of one per course).
        $completedByCourse = $courseIds->isEmpty()
            ? collect()
            : VideoProgress::query()
                ->join('videos', 'videos.id', '=', 'video_progress.video_id')
                ->where('video_progress.user_id', $student->id)
                ->where('video_progress.completed', true)
                ->whereIn('videos.course_id', $courseIds)
                ->groupBy('videos.course_id')
                ->select('videos.course_id', DB::raw('COUNT(*) as done'))
                ->pluck('done', 'course_id');

        // Most recently watched lesson, used for the "Continue learning" card.
        $lastProgress = $courseIds->isEmpty()
            ? null
            : VideoProgress::query()
                ->join('videos', 'videos.id', '=', 'video_progress.video_id')
                ->where('video_progress.user_id', $student->id)
                ->whereIn('videos.course_id', $courseIds)
                ->orderByDesc('video_progress.updated_at')
                ->select('videos.course_id', 'videos.title as video_title')
                ->first();

        $certificates = CourseCertificate::where('user_id', $student->id)
            ->pluck('certificate_number', 'course_id');

        $myCourses = $courses->map(function ($course) use ($completedByCourse, $certificates) {
            $total = (int) $course->videos_count;
            $done = min((int) ($completedByCourse[$course->id] ?? 0), $total);
            $expiresAt = $course->pivot->expires_at ?? null;
            $expires = $expiresAt ? \Illuminate\Support\Carbon::parse($expiresAt) : null;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'thumbnail' => $course->thumbnail,
                'instructor' => ['name' => $course->instructor?->name],
                'videos_count' => $total,
                'completed_count' => $done,
                'progress' => $total > 0 ? (int) round($done / $total * 100) : 0,
                'certificate_number' => $certificates[$course->id] ?? null,
                'expires_at' => $expires?->toDateString(),
                'days_left' => $expires ? (int) max(0, ceil(now()->diffInHours($expires, false) / 24)) : null,
                'is_expired' => $expires ? $expires->isPast() : false,
            ];
        })->values();

        $totalLessons = $myCourses->sum('videos_count');
        $doneLessons = $myCourses->sum('completed_count');

        $stats = [
            'courses' => $myCourses->count(),
            'lessons_total' => $totalLessons,
            'lessons_done' => $doneLessons,
            'in_progress' => $myCourses->filter(fn ($c) => $c['progress'] > 0 && $c['progress'] < 100)->count(),
            'completed' => $myCourses->filter(fn ($c) => $c['progress'] >= 100 && $c['videos_count'] > 0)->count(),
            'certificates' => $certificates->count(),
            'overall_progress' => $totalLessons > 0 ? (int) round($doneLessons / $totalLessons * 100) : 0,
        ];

        $continue = null;
        if ($lastProgress) {
            $continueCourse = $myCourses->firstWhere('id', (int) $lastProgress->course_id);
            if ($continueCourse && ! $continueCourse['is_expired'] && $continueCourse['progress'] < 100) {
                $continue = $continueCourse + ['last_lesson' => $lastProgress->video_title];
            }
        }
        if (! $continue) {
            $next = $myCourses->first(fn ($c) => ! $c['is_expired'] && $c['progress'] < 100 && $c['videos_count'] > 0);
            $continue = $next ? $next + ['last_lesson' => null] : null;
        }

        // Receipts uploaded and waiting for an admin to verify the transaction.
        $pendingCourses = Payment::with('course:id,title,thumbnail,instructor_id,price_usd', 'course.instructor:id,name')
            ->where('user_id', $student->id)
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->filter(fn ($payment) => $payment->course)
            ->map(fn ($payment) => [
                'payment_id' => $payment->id,
                'course_id' => $payment->course->id,
                'title' => $payment->course->title,
                'thumbnail' => $payment->course->thumbnail,
                'instructor' => ['name' => $payment->course->instructor?->name],
                'amount' => $payment->amount,
                'amount_usd' => $payment->course->price_usd,
                'submitted_at' => $payment->created_at?->toIso8601String(),
                'is_renewal' => $myCourses->contains('id', $payment->course_id),
            ])
            ->values();
        return Inertia::render('Student/Dashboard', [
            'myCourses' => $myCourses,
            'pendingCourses' => $pendingCourses,
            'stats' => $stats,
            'continue' => $continue,
            // Referral numbers need ~10 queries: load them after the page is already visible.
            'referral' => Inertia::defer(fn () => $this->referralData($student)),
        ]);
    }

    private function referralData(User $student): array
    {
        return [
            'code' => $student->referral_code,
            'income' => $student->totalReferralIncome(),
            'available_balance' => $student->availableReferralBalance(),
            'pending_cash_out' => $student->pendingCashOut(),
            'total_cashed_out' => $student->totalCashedOut(),
            'pending_income' => (float) $student->referralEarnings()->where('status', 'pending')->sum('commission_amount'),
            'referrals_count' => $student->referralEarnings()->distinct('referred_user_id')->count('referred_user_id'),
            'deals_count' => $student->referralEarnings()->where('status', 'credited')->count(),
            'referral_url' => url('/').'?ref='.$student->referral_code,
            'history' => $student->referralEarnings()
                ->with(['referredUser:id,name,email', 'course:id,title,price'])
                ->latest()
                ->take(10)
                ->get(),
            'cash_outs' => $student->cashOutRequests()->latest()->take(10)->get(),
            'settings' => \App\Models\ReferralSetting::getSettings(),
        ];
    }
}
