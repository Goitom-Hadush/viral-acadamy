<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class AppDownload extends Model
{
    protected $fillable = [
        'title',
        'android_path',
        'android_original_name',
        'android_version',
        'ios_path',
        'ios_original_name',
        'ios_version',
        'android_store_url',
        'ios_store_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function current(): ?self
    {
        if (! Schema::hasTable('app_downloads')) {
            return null;
        }

        return static::query()->latest('id')->first();
    }

    public static function forHomepage(): ?array
    {
        $row = static::current();

        if (! $row || ! $row->is_active) {
            return null;
        }

        $hasAndroid = $row->android_path || $row->android_store_url;
        $hasIos = $row->ios_path || $row->ios_store_url;

        if (! $hasAndroid && ! $hasIos) {
            return null;
        }

        return [
            'id' => $row->id,
            'title' => $row->title,
            'android' => $hasAndroid ? [
                'version' => $row->android_version,
                'file_name' => $row->android_original_name,
                'download_url' => $row->android_path ? route('apps.download', 'android') : null,
                'store_url' => $row->android_store_url,
            ] : null,
            'ios' => $hasIos ? [
                'version' => $row->ios_version,
                'file_name' => $row->ios_original_name,
                'download_url' => $row->ios_path ? route('apps.download', 'ios') : null,
                'store_url' => $row->ios_store_url,
            ] : null,
        ];
    }

    public function fileExists(string $platform): bool
    {
        $path = $platform === 'ios' ? $this->ios_path : $this->android_path;

        return $path && Storage::disk('public')->exists($path);
    }
}
