<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseReel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class CourseReelController extends Controller
{
    public function index(): Response
    {
        $reels = Schema::hasTable('course_reels')
            ? CourseReel::query()->with('course:id,title')->latest()->get()
            : collect();

        return Inertia::render('Admin/Reels/Index', [
            'reels' => $reels,
            'courses' => Course::query()->orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'caption' => 'nullable|string|max:120',
            'media' => 'required|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:512000',
            'duration' => 'nullable|numeric|min:0|max:65535',
        ]);

        $file = $request->file('media');
        $mime = (string) $file->getMimeType();
        $isVideo = str_starts_with($mime, 'video/')
            || in_array(strtolower($file->getClientOriginalExtension()), ['mp4', 'mov', 'webm'], true);

        $path = $file->store('reels', 'public');

        CourseReel::create([
            'course_id' => $validated['course_id'],
            'media_type' => $isVideo ? 'video' : 'image',
            'media_path' => $path,
            'caption' => $validated['caption'] ?? null,
            'duration' => $isVideo ? (int) round((float) ($validated['duration'] ?? 0)) : null,
            'is_published' => true,
        ]);

        return redirect()->back()->with('success', 'Course reel uploaded. It appears on the Reels page.');
    }

    public function update(Request $request, CourseReel $reel): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'caption' => 'nullable|string|max:120',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:512000',
            'duration' => 'nullable|numeric|min:0|max:65535',
            'is_published' => 'sometimes|boolean',
        ]);

        $data = [
            'course_id' => $validated['course_id'],
            'caption' => $validated['caption'] ?? null,
        ];

        if ($request->has('is_published')) {
            $data['is_published'] = $request->boolean('is_published');
        }

        if ($request->hasFile('media')) {
            if ($reel->media_path) {
                Storage::disk('public')->delete($reel->media_path);
            }

            $file = $request->file('media');
            $mime = (string) $file->getMimeType();
            $isVideo = str_starts_with($mime, 'video/')
                || in_array(strtolower($file->getClientOriginalExtension()), ['mp4', 'mov', 'webm'], true);

            $data['media_type'] = $isVideo ? 'video' : 'image';
            $data['media_path'] = $file->store('reels', 'public');
            $data['duration'] = $isVideo ? (int) round((float) ($validated['duration'] ?? 0)) : null;
        }

        $reel->update($data);

        return redirect()->back()->with('success', 'Reel updated.');
    }

    public function toggle(CourseReel $reel): RedirectResponse
    {
        $reel->update(['is_published' => ! $reel->is_published]);

        return redirect()->back()->with('success', $reel->is_published ? 'Reel published.' : 'Reel hidden.');
    }

    public function destroy(CourseReel $reel): RedirectResponse
    {
        if ($reel->media_path) {
            Storage::disk('public')->delete($reel->media_path);
        }

        $reel->delete();

        return redirect()->back()->with('success', 'Reel removed.');
    }
}
