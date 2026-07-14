<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Course;

class ReviewController extends Controller
{
    public function index()
    {
        // Get all reviews for courses owned by this instructor
        $reviews = Review::whereHas('course', function ($query) {
            $query->where('instructor_id', auth()->id());
        })
        ->with(['user:id,name,email', 'course:id,title'])
        ->orderBy('created_at', 'desc')
        ->get();

        // Calculate stats
        $totalReviews = $reviews->count();
        $averageRating = $reviews->avg('rating') ?? 0;
        $fiveStarReviews = $reviews->where('rating', 5)->count();
        $fourStarReviews = $reviews->where('rating', 4)->count();
        $threeStarReviews = $reviews->where('rating', 3)->count();
        $twoStarReviews = $reviews->where('rating', 2)->count();
        $oneStarReviews = $reviews->where('rating', 1)->count();

        return Inertia::render('Instructor/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => [
                'total' => $totalReviews,
                'average_rating' => round($averageRating, 1),
                'five_star' => $fiveStarReviews,
                'four_star' => $fourStarReviews,
                'three_star' => $threeStarReviews,
                'two_star' => $twoStarReviews,
                'one_star' => $oneStarReviews,
            ],
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function destroy(Request $request, Review $review)
    {
        // Check if the review belongs to a course owned by this instructor
        if ($review->course->instructor_id !== auth()->id()) {
            abort(403, 'You do not have permission to delete this review.');
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
