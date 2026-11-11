<?php

namespace App\Http\Controllers;

use App\Models\AppDownload;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AppFileDownloadController extends Controller
{
    public function __invoke(string $platform): StreamedResponse
    {
        if (! in_array($platform, ['android', 'ios'], true)) {
            abort(404);
        }

        $row = AppDownload::current();

        if (! $row || ! $row->is_active || ! $row->fileExists($platform)) {
            abort(404, 'App file not available.');
        }

        $path = $platform === 'ios' ? $row->ios_path : $row->android_path;
        $name = $platform === 'ios'
            ? ($row->ios_original_name ?: 'SuccessLifeCoachingAcademy.ipa')
            : ($row->android_original_name ?: 'SuccessLifeCoachingAcademy.apk');

        return Storage::disk('public')->download($path, $name);
    }
}
