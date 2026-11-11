<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class SiteAnnouncement extends Model
{
    protected $fillable = [
        'badge',
        'title',
        'subtitle',
        'cta_label',
        'cta_url',
        'telegram_url',
        'phone',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function activeForHomepage(): ?array
    {
        if (! Schema::hasTable('site_announcements')) {
            return null;
        }

        $row = static::query()->where('is_active', true)->latest('id')->first();

        if (! $row) {
            return null;
        }

        $phoneDigits = preg_replace('/\D+/', '', (string) $row->phone) ?: null;

        return [
            'id' => $row->id,
            'badge' => $row->badge ?? null,
            'title' => $row->title,
            'subtitle' => $row->subtitle,
            'cta_label' => null,
            'cta_url' => $row->cta_url,
            'telegram_url' => $row->telegram_url,
            'phone' => $row->phone,
            'phone_tel' => $phoneDigits ? 'tel:'.$phoneDigits : null,
        ];
    }
}
