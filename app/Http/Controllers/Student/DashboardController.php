<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the logged-in student
        $student = Auth::user();

        // Fetch only the courses where a 'paid' purchase exists for this user
        // We also load the instructor info and count the videos for the UI
        $myCourses = $student->purchasedCourses()
                             ->with('instructor')
                             ->withCount('videos')
                             ->get();

        return Inertia::render('Student/Dashboard', [
            'myCourses' => $myCourses
        ]);
    }
}