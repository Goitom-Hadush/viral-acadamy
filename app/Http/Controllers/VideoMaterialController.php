<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoMaterial;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class VideoMaterialController extends Controller
{
    public function download(Request $request, VideoMaterial $material): StreamedResponse
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'You must be logged in to download course materials.');
        }

        $video = $material->video()->with('course')->firstOrFail();

        $this->assertCanAccess($user, $video);

        $disk = Storage::disk('private');

        if (! $disk->exists($material->file_path)) {
            abort(404, 'Material file not found on server.');
        }

        return $disk->download($material->file_path, $material->original_name);
    }

    private function assertCanAccess(User $user, Video $video): void
    {
        $hasPurchased = Purchase::where('user_id', $user->id)
            ->where('course_id', $video->course_id)
            ->where('status', 'paid')
            ->exists();

        $isOwnerOrAdmin = $user->role === 'admin'
            || ($user->role === 'instructor' && $video->course->instructor_id === $user->id);

        if (! $hasPurchased && ! $isOwnerOrAdmin) {
            abort(403, 'Purchase required to download this material.');
        }

        if ($isOwnerOrAdmin) {
            return;
        }

        $previousVideos = $video->course->videos()
            ->where('sequence', '<', $video->sequence)
            ->orderBy('sequence')
            ->get();

        foreach ($previousVideos as $previousVideo) {
            $progress = VideoProgress::where('user_id', $user->id)
                ->where('video_id', $previousVideo->id)
                ->first();
            $watchedSeconds = $progress?->watched_seconds ?? 0;
            $completed = (bool) ($progress?->completed)
                || ($previousVideo->duration
                    && $watchedSeconds >= ceil($previousVideo->duration * 0.9));

            if (! $completed) {
                abort(403, 'Complete the previous lesson to download this material.');
            }
        }
    }
}
