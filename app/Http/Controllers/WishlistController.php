<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function toggle(Course $course)
    {
        $user = Auth::user();

        // Check if it's already wishlisted
        $existing = Wishlist::where('user_id', $user->id)->where('course_id', $course->id)->first();

        if ($existing) {
            $existing->delete(); // Remove if clicked again
            return redirect()->back()->with('info', 'Removed from wishlist.');
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
            ]);
            return redirect()->back()->with('success', 'Added to wishlist!');
        }
    }
}