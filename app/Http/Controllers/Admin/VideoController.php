<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function destroy(Video $video)
    {
        if ($video->video_path) {
            Storage::disk('private')->delete($video->video_path);
        }

        $video->delete();

        return redirect()->back()->with('success', 'Video deleted successfully.');
    }
}
