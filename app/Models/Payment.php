<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'transaction_id',
        'amount',
        'payment_method',
        'referral_code',
        'referrer_id',
        'status',
        'receipt_image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function referrer()
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function referralEarning()
    {
        return $this->hasOne(ReferralEarning::class, 'payment_id');
    }
}
