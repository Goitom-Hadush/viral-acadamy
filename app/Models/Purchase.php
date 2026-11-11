<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'amount',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Check if 6-month access has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Check if purchase is paid and currently active.
     */
    public function isActive(): bool
    {
        return $this->status === 'paid' && !$this->isExpired();
    }

    /**
     * Days remaining until 6-month expiration.
     */
    public function daysRemaining(): ?int
    {
        if (!$this->expires_at) {
            return null;
        }
        if ($this->isExpired()) {
            return 0;
        }
        return (int) ceil(now()->diffInHours($this->expires_at, false) / 24);
    }

    /**
     * Scope for active paid purchases within 6 months.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'paid')
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    // A purchase belongs to a student
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A purchase belongs to a course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}