<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PromoCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'code',
        'max_uses',
        'used_count',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function uses()
    {
        return $this->hasMany(PromoCodeUse::class);
    }

    // Is the code still usable?
    public function isValid(): bool
    {
        return $this->is_active && $this->used_count < $this->max_uses;
    }

    // Slots remaining
    public function remaining(): int
    {
        return max(0, $this->max_uses - $this->used_count);
    }
}
