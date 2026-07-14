<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoStreamController extends Controller
{
    public function stream(Video $video)
    {
        // Handle CORS preflight request
        if (request()->method() === 'OPTIONS') {
            return response('', 200, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
                'Access-Control-Allow-Headers' => 'Range, Content-Type',
            ]);
        }
        // 1. Check Login
        $user = Auth::user();
        if (!$user) {
            \Log::warning('Video stream attempt by unauthenticated user', ['video_id' => $video->id]);
            abort(401, 'You must be logged in to watch videos.');
        }

        \Log::info('Video stream attempt', ['video_id' => $video->id, 'user_id' => $user->id, 'user_role' => $user->role]);

        // 2. Check Purchase (The Gatekeeper Logic)
        $hasPurchased = Purchase::where('user_id', $user->id)
                                ->where('course_id', $video->course_id)
                                ->where('status', 'paid')
                                ->exists();

        // Bypass purchase check for Admins, or the Instructor who owns the course
        $isOwnerOrAdmin = ($user->role === 'admin') || 
                          ($user->role === 'instructor' && $video->course->instructor_id === $user->id);

        if (!$hasPurchased && !$isOwnerOrAdmin) {
            // ACCESS DENIED - They haven't paid!
            abort(403, 'Purchase required to access this video.');
        }

        // 3. Check if file actually exists in the private vault
        $disk = Storage::disk('private');
        $filePath = $video->video_path;

        if (!$disk->exists($filePath)) {
            \Log::error('Video file not found', ['path' => $filePath, 'video_id' => $video->id]);
            abort(404, 'Video file not found on server.');
        }

        $fileSize = $disk->size($filePath);
        $stream = $disk->readStream($filePath);

        if (!$stream) {
            \Log::error('Failed to open video stream', ['path' => $filePath, 'video_id' => $video->id]);
            abort(500, 'Failed to open video file.');
        }

        // Detect actual MIME type from file
        $mimeType = 'video/mp4';
        $fullPath = storage_path('app/private/' . $filePath);
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $detectedMime = finfo_file($finfo, $fullPath);
            finfo_close($finfo);
            if ($detectedMime) {
                $mimeType = $detectedMime;
                \Log::info('Detected MIME type', ['path' => $filePath, 'mime' => $mimeType]);
            }
        }

        // 4. Handle Range Requests for seeking
        $start = 0;
        $end = $fileSize - 1;

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'private, no-store, no-cache, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'Cross-Origin-Resource-Policy' => 'same-origin',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => 'Range',
        ];

        $code = 200;

        if (request()->hasHeader('Range')) {
            $range = request()->header('Range');
            $range = explode('=', $range);
            $range = explode('-', $range[1]);
            $start = (int) $range[0];
            if (isset($range[1]) && $range[1] !== '') {
                $end = (int) $range[1];
            }

            $code = 206; // Partial Content
            $headers['Content-Range'] = "bytes $start-$end/$fileSize";
            $headers['Content-Length'] = $end - $start + 1;
        } else {
            $headers['Content-Length'] = $fileSize;
        }

        // Clear any buffered output before streaming binary content.
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // Seek to the start position
        fseek($stream, $start);

        // Stream the response
        $response = new StreamedResponse(function() use ($stream, $start, $end) {
            while (ob_get_level() > 0) {
                ob_end_clean();
            }

            $bufferSize = 1024 * 8; // 8KB buffers
            $bytesRemaining = $end - $start + 1;

            while (!feof($stream) && $bytesRemaining > 0) {
                $bytesToRead = min($bufferSize, $bytesRemaining);
                echo fread($stream, $bytesToRead);
                flush();
                $bytesRemaining -= $bytesToRead;
            }

            fclose($stream);
        }, $code, $headers);

        return $response;
    }
}
