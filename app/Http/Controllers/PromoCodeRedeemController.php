<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\PromoCode;
use App\Models\PromoCodeUse;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PromoCodeRedeemController extends Controller
{
    public function redeem(Request $request, Course $course)
    {
        $request->validate([
            'code' => 'required|string|max:32',
        ]);

        $user = Auth::user();

        // Already enrolled?
        if (Purchase::where('user_id', $user->id)->where('course_id', $course->id)->exists()) {
            return redirect()->route('student.learn', $course->id)
                ->with('info', 'You are already enrolled in this course!');
        }

        // Find the code for this course
        $promo = PromoCode::where('code', trim(strtoupper($request->code)))
                          ->where('course_id', $course->id)
                          ->first();

        if (!$promo) {
            return redirect()->back()
                ->withErrors(['code' => 'Invalid promo code for this course.'])
                ->withInput();
        }

        if (!$promo->is_active) {
            return redirect()->back()
                ->withErrors(['code' => 'This promo code has been deactivated.'])
                ->withInput();
        }

        if ($promo->used_count >= $promo->max_uses) {
            return redirect()->back()
                ->withErrors(['code' => 'This promo code has reached its maximum enrollments.'])
                ->withInput();
        }

        // Already used this specific code?
        if (PromoCodeUse::where('promo_code_id', $promo->id)->where('user_id', $user->id)->exists()) {
            return redirect()->back()
                ->withErrors(['code' => 'You have already used this promo code.'])
                ->withInput();
        }

        // All checks passed — enroll atomically
        DB::transaction(function () use ($promo, $user, $course) {
            // Record the use
            PromoCodeUse::create([
                'promo_code_id' => $promo->id,
                'user_id'       => $user->id,
            ]);

            // Increment used count
            $promo->increment('used_count');

            // Deactivate if now full
            if ($promo->used_count >= $promo->max_uses) {
                $promo->update(['is_active' => false]);
            }

            // Create purchase record
            Purchase::create([
                'user_id'   => $user->id,
                'course_id' => $course->id,
                'amount'    => 0,
                'status'    => 'paid',
            ]);
        });

        return redirect()->route('student.learn', $course->id)
            ->with('success', '🎉 Promo code applied! You are now enrolled. Enjoy the course!');
    }
}
