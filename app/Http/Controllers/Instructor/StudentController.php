<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        // Get all courses by this instructor
        $instructorCourses = Course::where('instructor_id', auth()->id())
            ->pluck('id')
            ->toArray();

        // Get all students who purchased this instructor's courses
        $students = Purchase::whereIn('course_id', $instructorCourses)
            ->where('status', 'paid')
            ->with(['user:id,name,email', 'course:id,title'])
            ->latest()
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->user->id,
                    'name' => $purchase->user->name,
                    'email' => $purchase->user->email,
                    'course_title' => $purchase->course->title,
                    'amount' => $purchase->amount,
                    'purchased_at' => $purchase->created_at->diffForHumans(),
                ];
            });

        // Get unique students count
        $uniqueStudents = Purchase::whereIn('course_id', $instructorCourses)
            ->where('status', 'paid')
            ->distinct('user_id')
            ->count('user_id');

        return Inertia::render('Instructor/Students/Index', [
            'students' => $students,
            'total_students' => $uniqueStudents,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
