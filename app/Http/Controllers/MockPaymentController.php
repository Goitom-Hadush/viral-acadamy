<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Payment;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MockPaymentController extends Controller
{
    public function pay(Course $course)
    {
        $user = Auth::user();

        // Check if they already bought it
        $alreadyPurchased = Purchase::where('user_id', $user->id)
                                    ->where('course_id', $course->id)
                                    ->exists();

        if ($alreadyPurchased) {
            return redirect()->route('student.learn', $course->id)->with('info', 'You already own this course!');
        }

        // 1. Create a fake successful Payment record
        Payment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'transaction_id' => 'MOCK_TXN_' . uniqid(),
            'amount' => $course->price,
            'payment_method' => 'mock_chapa',
            'status' => 'success',
        ]);

        // 2. UNLOCK THE COURSE (Create the Purchase)
        Purchase::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $course->price,
            'status' => 'paid', // THE MAGIC KEY
        ]);

        // 3. Redirect to the secure learning page
        return redirect()->route('student.learn', $course->id)->with('success', 'Payment successful! Course unlocked.');
    }
}