<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferralEarning extends Model
{
    use HasFactory;

    protected $table = 'referral_earnings';

    protected $fillable = [
        'referrer_id',
        'referred_user_id',
        'course_id',
        'payment_id',
        'course_price',
        'commission_rate',
        'commission_amount',
        'status',
    ];

    protected $casts = [
        'course_price' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
    ];

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referredUser()
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }
}
