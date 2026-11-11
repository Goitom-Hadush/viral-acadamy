<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentPage extends Model
{
    protected $fillable = [
        'slug',
        'eyebrow',
        'headline',
        'intro',
        'banner_title',
        'banner_body',
        'meta_description',
        'hero_image_path',
        'hero_images',
        'banner_image_path',
        'section_title',
        'stats',
    ];

    protected $casts = ['stats' => 'array', 'hero_images' => 'array'];

    public static function forSlug(string $slug): ?self
    {
        return static::query()->where('slug', $slug)->first();
    }
}
