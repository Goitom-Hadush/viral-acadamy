<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeminarRegistration extends Model
{
    protected $fillable = [
        'registration_code',
        'seminar_id',
        'seminar_title',
        'attendee_name',
        'attendee_phone',
        'attendee_email',
        'ticket_tier',
        'receipt_image',
        'amount_paid',
        'transaction_reference',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
    ];

    public function seminar(): BelongsTo
    {
        return $this->belongsTo(Seminar::class, 'seminar_id');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }
}
