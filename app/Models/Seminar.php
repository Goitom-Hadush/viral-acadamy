<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seminar extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'tagline',
        'image_path',
        'badge',
        'speaker_name',
        'speaker_title',
        'speaker_initials',
        'date_string',
        'time_string',
        'location_type',
        'venue_name',
        'venue_city',
        'online_link',
        'price_label',
        'entrance_fee',
        'description',
        'topics_json',
        'bank_info',
        'capacity',
        'registered_count',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'entrance_fee' => 'decimal:2',
        'capacity' => 'integer',
        'registered_count' => 'integer',
        'sort_order' => 'integer',
    ];

    public function registrations(): HasMany
    {
        return $this->hasMany(SeminarRegistration::class, 'seminar_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id', 'desc');
    }
}
