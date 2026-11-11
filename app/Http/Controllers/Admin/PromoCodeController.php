<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PromoCodeController extends Controller
{
    // List promo codes for a course (returns to Show page with codes)
    public function index(Course $course)
    {
        $course->load([
            'promoCodes' => fn ($q) => $q->withCount('uses')->orderByDesc('created_at'),
            'instructor:id,name,email,phone,avatar,social_media',
            'category:id,name,slug',
            'videos:id,course_id,title,video_path,duration,sequence,created_at',
            'reviews' => fn ($q) => $q->with('user:id,name')->latest(),
        ]);
        $course->loadCount(['videos', 'reviews']);
        $course->loadAvg('reviews', 'rating');

        return redirect()->route('admin.courses.show', $course->id);
    }

    // Generate a new promo code for a course
    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'max_uses' => 'required|integer|min:1|max:10000',
        ]);

        // Generate a unique uppercase code
        do {
            $code = strtoupper(Str::random(20));
        } while (PromoCode::where('code', $code)->exists());

        PromoCode::create([
            'course_id' => $course->id,
            'code'      => $code,
            'max_uses'  => $validated['max_uses'],
            'is_active' => true,
        ]);

        return redirect()->route('admin.courses.show', $course->id)
            ->with('success', "Promo code generated! {$validated['max_uses']} enrollments available.");
    }

    // Activate / deactivate a code
    public function toggle(PromoCode $promoCode)
    {
        $promoCode->update(['is_active' => !$promoCode->is_active]);

        $status = $promoCode->is_active ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Promo code {$status}.");
    }

    // Delete a promo code
    public function destroy(PromoCode $promoCode)
    {
        $courseId = $promoCode->course_id;
        $promoCode->delete();

        return redirect()->route('admin.courses.show', $courseId)
            ->with('success', 'Promo code deleted.');
    }
}
