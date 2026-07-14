<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function store(Request $request, Course $course)
    {
        // 1. SECURITY CHECK: Ensure the logged-in user actually owns this course!
        if ($course->instructor_id !== auth()->id()) {
            abort(403, 'Unauthorized to upload videos to this course.');
        }

        // 2. Quick debug logging: record whether the file arrived and its client-reported metadata
        try {
            if ($request->hasFile('video_file')) {
                $file = $request->file('video_file');
                \Log::info('Video upload received', [
                    'original_name' => $file->getClientOriginalName(),
                    'client_mime' => $file->getClientMimeType(),
                    'client_extension' => $file->getClientOriginalExtension(),
                    'size' => $file->getSize(),
                ]);
            } else {
                \Log::info('Video upload: no file present in request');
            }
        } catch (\Exception $e) {
            \Log::error('Video upload logging failed: '.$e->getMessage());
        }

        // 3. Validate the video file (mp4, mov, avi, max 500MB)
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            // Accept by extension AND common MIME types to avoid client-side/OS MIME quirks
            'video_file' => 'required|file|mimes:mp4,mov,avi,wmv|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv|max:512000', // 500MB max
            'sequence' => 'required|integer|min:1',
        ]);

        // 3. Store securely in the PRIVATE disk
        // Path will look like: courses/1/video_123456.mp4 inside storage/app/private
        $filePath = $request->file('video_file')->store("courses/{$course->id}", 'private');

        // 4. Create the database record
        Video::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'video_path' => $filePath,
            'sequence' => $validated['sequence'],
        ]);

        return redirect()->back()->with('success', 'Video uploaded securely to the vault!');
    }
}
