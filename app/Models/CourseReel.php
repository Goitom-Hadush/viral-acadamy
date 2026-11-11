<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseReel extends Model
{
    protected $fillable = [
        'course_id',
        'media_type',
        'media_path',
        'caption',
        'duration',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'duration' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
