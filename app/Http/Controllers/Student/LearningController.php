<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningController extends Controller
{
public function index(Course $course)
{
    $user = Auth::user();

    $purchase = Purchase::where('user_id', $user->id)
                        ->where('course_id', $course->id)
                        ->where('status', 'paid')
                        ->first();

    if ($user->role !== 'admin' && (!$purchase || $purchase->isExpired())) {
        if ($purchase && $purchase->isExpired()) {
            return redirect()->route('courses.show', $course->id)->with('error', 'Your 6-month access to this course has expired. Please renew your enrollment to continue.');
        }
        abort(403, 'You have not enrolled in this course.');
    }

    $course->load('videos');

    $progress = $user->videoProgress()
                     ->whereHas('video', function($query) use ($course) {
                         $query->where('course_id', $course->id);
                     })
                     ->get()
                     ->keyBy('video_id');

    // --- ADD THIS: Get all reviews for this course with the user who wrote it ---
    $reviews = $course->reviews()->with('user')->orderBy('created_at', 'desc')->get();
    // -------------------------------------------------------------------------

    return Inertia::render('Student/Learning/Index', [
        'course' => $course,
        'progress' => $progress,
        'reviews' => $reviews // Pass to React
    ]);
}
}