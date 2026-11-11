<?php
namespace App\Http\Controllers;

use App\Models\Course;
use Inertia\Inertia;

class CourseViewController extends Controller
{
    public function show(Course $course)
    {
        // Allow admin to see unpublished courses
        if ($course->status !== 'published' && (!auth()->check() || auth()->user()->role !== 'admin')) {
            abort(404);
        }

        // Load the instructor info, video count, and reviews
        $course->load('instructor');
        $course->loadCount('videos');
        
        // Load reviews with user info for public view
        $course->load(['reviews' => function ($query) {
            $query->with('user:id,name')->latest();
        }]);

        // Check enrollment and pending payment state
        $enrollment = null;
        $hasPendingPayment = false;
        if (auth()->check()) {
            $userId = auth()->id();
            $purchase = \App\Models\Purchase::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->where('status', 'paid')
                ->first();

            if ($purchase) {
                $enrollment = [
                    'is_enrolled' => true,
                    'is_expired' => $purchase->isExpired(),
                    'is_active' => $purchase->isActive(),
                    'expires_at' => $purchase->expires_at ? $purchase->expires_at->format('M d, Y') : null,
                    'days_remaining' => $purchase->daysRemaining(),
                ];
            }

            $hasPendingPayment = \App\Models\Payment::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->where('status', 'pending')
                ->exists();
        }

        return Inertia::render('Course/Show', [
            'course' => $course,
            'enrollment' => $enrollment,
            'hasPendingPayment' => $hasPendingPayment,
            'auth' => [
                'user' => auth()->check() ? auth()->user() : null,
            ],
        ]);
    }
}