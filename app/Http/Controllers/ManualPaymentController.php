<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ManualPaymentController extends Controller
{
    // 1. Student uploads the receipt
    public function uploadReceipt(Request $request, Course $course)
    {
        $request->validate([
            'receipt' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB image
        ]);

        // Save the receipt image to storage/app/public/receipts
        $filePath = $request->file('receipt')->store('receipts', 'public');

        // Create a pending payment record
        Payment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
            'transaction_id' => 'MANUAL_' . uniqid(),
            'amount' => $course->price,
            'payment_method' => 'manual_transfer',
            'status' => 'pending', // Stays pending until Admin approves
            'receipt_image' => $filePath,
        ]);

        return redirect()->back()->with('success', 'Receipt uploaded successfully! The admin will review your payment shortly.');
    }

    // 2. Admin approves the payment (This unlocks the course!)
    public function approvePayment(Payment $payment)
    {
        // Update payment status
        $payment->update(['status' => 'success']);

        // UNLOCK THE COURSE (Create the Purchase record)
        \App\Models\Purchase::updateOrCreate(
            [
                'user_id' => $payment->user_id,
                'course_id' => $payment->course_id,
            ],
            [
                'amount' => $payment->amount,
                'status' => 'paid',
            ]
        );

        return redirect()->back()->with('success', 'Payment approved! Course unlocked for the student.');
    }
}