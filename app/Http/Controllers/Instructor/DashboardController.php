<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get courses by this instructor
        $courses = Course::where('instructor_id', auth()->id())
            ->withCount('videos')
            ->withCount(['purchases as students_count' => function ($query) {
                $query->where('status', 'paid');
            }])
            ->withSum(['purchases as revenue' => function ($query) {
                $query->where('status', 'paid');
            }], 'amount')
            ->get();

        // Calculate stats
        $totalCourses = $courses->count();
        $totalStudents = $courses->sum('students_count');
        $totalRevenue = $courses->sum('revenue') ?? 0;
        $publishedCourses = $courses->where('status', 'published')->count();

        // Get recent purchases
        $courseIds = $courses->pluck('id')->toArray();
        $recentPurchases = Purchase::whereIn('course_id', $courseIds)
            ->where('status', 'paid')
            ->with(['user:id,name', 'course:id,title'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'student_name' => $purchase->user->name,
                    'course_title' => $purchase->course->title,
                    'amount' => $purchase->amount,
                    'created_at' => $purchase->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Instructor/Dashboard', [
            'stats' => [
                'courses' => $totalCourses,
                'published' => $publishedCourses,
                'students' => $totalStudents,
                'revenue' => $totalRevenue,
            ],
            'courses' => $courses->take(5),
            'recentPurchases' => $recentPurchases,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
