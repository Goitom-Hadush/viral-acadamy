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

        return Inertia::render('Course/Show', [
            'course' => $course,
            'auth' => [
                'user' => auth()->check() ? auth()->user() : null,
            ],
        ]);
    }
}