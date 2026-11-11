<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashOutRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'payout_method',
        'account_number',
        'account_name',
        'bank_name',
        'student_notes',
        'status',
        'transaction_reference',
        'admin_notes',
        'processed_at',
        'processed_by',
    ];

    protected $casts = [
        'amount' => 'float',
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function processor()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
