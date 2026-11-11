<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class Media
{
    /**
     * Normalize a course/media thumbnail for API and UI use.
     * Empty/dummy values become null; relative paths become /media/... URLs
     * (avoids /storage 403 when the public symlink is missing on shared hosting).
     */
    public static function thumbnailUrl(?string $thumbnail): ?string
    {
        $value = is_string($thumbnail) ? trim($thumbnail) : '';
        if ($value === '' || $value === 'thumbnails/dummy.jpg' || str_ends_with($value, '/dummy.jpg')) {
            return null;
        }

        // Already absolute or app-relative — rewrite legacy /storage/ to /media/
        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return str_replace('/storage/', '/media/', $value);
        }

        if (str_starts_with($value, '/')) {
            $value = ltrim(preg_replace('#^/storage/#', '', $value) ?? $value, '/');
            $value = ltrim(preg_replace('#^media/#', '', $value) ?? $value, '/');

            return $value !== '' ? url('/media/'.$value) : null;
        }

        return url('/media/'.$value);
    }

    public static function publicUrl(?string $path): ?string
    {
        $value = is_string($path) ? trim($path) : '';
        if ($value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return str_replace('/storage/', '/media/', $value);
        }

        $value = ltrim(preg_replace('#^/?storage/#', '', $value) ?? $value, '/');

        return url('/media/'.$value);
    }

    public static function existsOnPublicDisk(?string $path): bool
    {
        $value = is_string($path) ? trim($path) : '';
        if ($value === '') {
            return false;
        }

        $value = ltrim(preg_replace('#^/?storage/#', '', $value) ?? $value, '/');
        $value = ltrim(preg_replace('#^/?media/#', '', $value) ?? $value, '/');

        return $value !== '' && Storage::disk('public')->exists($value);
    }
}
