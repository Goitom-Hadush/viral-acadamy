<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $student = Auth::user();
        $myCourses = $student->purchasedCourses()
                             ->with('instructor')
                             ->withCount('videos')
                             ->get();

        return Inertia::render('Student/Courses/Index', [
            'myCourses' => $myCourses
        ]);
    }
}
