<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        // Double check they own the course
        $hasPurchased = $user->purchasedCourses()->where('course_id', $course->id)->exists();
        if (!$hasPurchased) {
            abort(403, 'You must purchase this course to leave a review.');
        }

        // updateOrCreate prevents a student from leaving multiple reviews.
        // If a review exists, it updates it. If not, it creates it.
        Review::updateOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return redirect()->back()->with('success', 'Thank you for your review!');
    }
}