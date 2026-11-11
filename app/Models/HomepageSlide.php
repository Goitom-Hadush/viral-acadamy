<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class HomepageSlide extends Model
{
    protected $fillable = [
        'title',
        'media_type',
        'media_path',
        'caption',
        'link_url',
        'cta_label',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('id');
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'media_type' => $this->media_type,
            'media_path' => $this->media_path,
            'media_url' => $this->media_path ? '/media/'.$this->media_path : null,
            'caption' => $this->caption,
            'link_url' => $this->link_url,
            'cta_label' => $this->cta_label,
            'sort_order' => $this->sort_order,
        ];
    }

    public static function homepageCollection(int $limit = 12)
    {
        if (! Schema::hasTable('homepage_slides')) {
            return collect();
        }

        return static::query()
            ->active()
            ->ordered()
            ->limit($limit)
            ->get()
            ->map(fn (self $slide) => $slide->toPublicArray())
            ->values();
    }
}
