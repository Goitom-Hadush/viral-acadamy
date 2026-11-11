<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $relations = [
            'user:id,name,email,phone',
            'course:id,title,price_usd',
            'referrer:id,name,email',
            'referralEarning:id,payment_id,commission_amount',
        ];

        $pending = Payment::with($relations)
            ->where('status', 'pending')
            ->oldest()            // oldest receipts first: they have waited the longest
            ->get();

        // Recently verified payments (read-only history, shows the transaction ID).
        $verified = Payment::with($relations)
            ->where('status', 'success')
            ->latest('updated_at')
            ->limit(100)
            ->get();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $pending,
            'verified' => $verified,
        ]);
    }
}
