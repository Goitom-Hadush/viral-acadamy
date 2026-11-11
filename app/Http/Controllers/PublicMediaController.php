<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Serves public disk files without relying on the public/storage symlink.
 * Shared hosting often breaks that symlink; /storage/* then hits Laravel's
 * private-disk "serve" route and returns 403 — which breaks Flutter images.
 */
class PublicMediaController extends Controller
{
    public function __invoke(Request $request, string $path): StreamedResponse
    {
        $path = ltrim(str_replace('\\', '/', $path), '/');

        if ($path === '' || str_contains($path, '..')) {
            abort(404);
        }

        if (! Storage::disk('public')->exists($path)) {
            abort(404);
        }

        return Storage::disk('public')->response($path);
    }
}
