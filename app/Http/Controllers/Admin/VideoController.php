<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Video;
use App\Models\VideoMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VideoController extends Controller
{
    private const VIDEO_RULE = 'file|mimes:mp4,mov,avi,wmv|max:1048576'; // 1 GB

    public function index(Course $course)
    {
        $videos = $course->videos()->with('materials')->get()->map(fn (Video $v) => $this->present($v));

        return Inertia::render('Admin/Courses/Videos', [
            'course' => $course->only(['id', 'title', 'status']),
            'videos' => $videos,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'video_file' => 'required|'.self::VIDEO_RULE,
            'sequence' => 'required|integer|min:1',
            'materials' => 'nullable|array',
            'materials.*' => 'file|max:204800',
        ]);

        $path = $request->file('video_file')->store("courses/{$course->id}", 'private');

        $video = Video::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'video_path' => $path,
            'sequence' => $validated['sequence'],
        ]);

        $this->storeMaterials($request, $video);

        return redirect()->back()->with('success', 'Video uploaded successfully.');
    }

    public function update(Request $request, Course $course, Video $video)
    {
        abort_unless($video->course_id === $course->id, 404);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sequence' => 'required|integer|min:1',
            'video_file' => 'nullable|'.self::VIDEO_RULE,
            'materials' => 'nullable|array',
            'materials.*' => 'file|max:204800',
        ]);

        $data = [
            'title' => $validated['title'],
            'sequence' => $validated['sequence'],
        ];

        if ($request->hasFile('video_file')) {
            if ($video->video_path) {
                Storage::disk('private')->delete($video->video_path);
            }
            $data['video_path'] = $request->file('video_file')->store("courses/{$course->id}", 'private');
        }

        $video->update($data);
        $this->storeMaterials($request, $video);

        return redirect()->back()->with('success', 'Video updated successfully.');
    }

    public function destroy(Course $course, Video $video)
    {
        abort_unless($video->course_id === $course->id, 404);

        $video->load('materials');
        foreach ($video->materials as $material) {
            Storage::disk('private')->delete($material->file_path);
        }
        if ($video->video_path) {
            Storage::disk('private')->delete($video->video_path);
        }

        $video->delete();

        return redirect()->back()->with('success', 'Video deleted successfully.');
    }

    public function destroyMaterial(Course $course, Video $video, VideoMaterial $material)
    {
        abort_unless($video->course_id === $course->id && $material->video_id === $video->id, 404);

        Storage::disk('private')->delete($material->file_path);
        $material->delete();

        return redirect()->back()->with('success', 'Material removed.');
    }

    private function storeMaterials(Request $request, Video $video): void
    {
        foreach ($request->file('materials', []) as $file) {
            $path = $file->store("materials/{$video->id}", 'private');

            $video->materials()->create([
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }
    }

    private function present(Video $video): array
    {
        return [
            'id' => $video->id,
            'title' => $video->title,
            'sequence' => $video->sequence,
            'video_name' => $video->video_path ? basename($video->video_path) : null,
            'has_video' => (bool) $video->video_path,
            'stream_url' => route('video.stream', $video->id),
            'materials' => $video->materials->map(fn (VideoMaterial $m) => [
                'id' => $m->id,
                'original_name' => $m->original_name,
                'file_size' => $m->file_size,
                'download_url' => route('materials.download', $m->id),
            ])->values(),
        ];
    }
}
