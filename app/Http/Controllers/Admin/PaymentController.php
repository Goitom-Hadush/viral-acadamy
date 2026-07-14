<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $pendingPayments = Payment::with(['user', 'course'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/Payments/Index', [
            'payments' => $pendingPayments
        ]);
    }
}