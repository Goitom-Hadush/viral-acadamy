<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Purchase;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalCourses = Course::count();
        $totalRevenue = Payment::where('status', 'success')->sum('amount');
        $averagePrice = Course::avg('price') ?? 0;

        
        $courses = Course::withCount(['purchases as students_count' => function ($query) {
                $query->where('status', 'paid');
            }])
            ->withSum(['payments as revenue' => function ($query) {
                $query->where('status', 'success');
            }], 'amount')
            ->get(['id', 'title', 'price', 'thumbnail'])
            ->sortByDesc('students_count')
            ->take(10)
            ->values()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'price' => $course->price,
                    'thumbnail' => $course->thumbnail,
                    'students_count' => $course->students_count,
                    'revenue' => $course->revenue ?? 0,
                ];
            });

        // Recent successful payments (latest activity)
        $recentPayments = Payment::with(['user:id,name,email', 'course:id,title'])
            ->where('status', 'success')
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'student_name' => $payment->user->name ?? 'Unknown',
                    'course_title' => $payment->course->title ?? 'Unknown',
                    'created_at' => $payment->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'students' => $totalStudents,
                'courses' => $totalCourses,
                'revenue' => $totalRevenue,
                'average_price' => round($averagePrice, 2),
            ],
            'courses' => $courses,
            'recentPayments' => $recentPayments,
        ]);
    }
}