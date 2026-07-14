<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EarningController extends Controller
{
    public function index()
    {
        // Get all courses by this instructor
        $instructorCourses = Course::where('instructor_id', auth()->id())
            ->pluck('id')
            ->toArray();

        // Calculate total earnings
        $totalEarnings = Purchase::whereIn('course_id', $instructorCourses)
            ->where('status', 'paid')
            ->sum('amount');

        // Get earnings by course
        $earningsByCourse = Course::where('instructor_id', auth()->id())
            ->withCount(['purchases as student_count' => function ($query) {
                $query->where('status', 'paid');
            }])
            ->withSum(['purchases as revenue' => function ($query) {
                $query->where('status', 'paid');
            }], 'amount')
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'price' => $course->price,
                    'student_count' => $course->student_count,
                    'revenue' => $course->revenue ?? 0,
                ];
            });

        // Get recent purchases
        $recentPurchases = Purchase::whereIn('course_id', $instructorCourses)
            ->where('status', 'paid')
            ->with(['user:id,name', 'course:id,title'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'student_name' => $purchase->user->name,
                    'course_title' => $purchase->course->title,
                    'amount' => $purchase->amount,
                    'purchased_at' => $purchase->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Instructor/Earnings/Index', [
            'total_earnings' => $totalEarnings,
            'earnings_by_course' => $earningsByCourse,
            'recent_purchases' => $recentPurchases,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
