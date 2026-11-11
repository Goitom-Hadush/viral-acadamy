<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageSlideController extends Controller
{
    public function index(): Response
    {
        $slides = Schema::hasTable('homepage_slides')
            ? HomepageSlide::query()->ordered()->get()
            : collect();

        return Inertia::render('Admin/HomepageSlides/Index', [
            'slides' => $slides,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:120',
            'caption' => 'nullable|string|max:200',
            'link_url' => 'nullable|string|max:500',
            'cta_label' => 'nullable|string|max:60',
            'sort_order' => 'nullable|integer|min:0|max:9999',
            'media' => 'required|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:512000',
            'is_active' => 'sometimes|boolean',
        ]);

        $file = $request->file('media');
        $mime = (string) $file->getMimeType();
        $isVideo = str_starts_with($mime, 'video/')
            || in_array(strtolower($file->getClientOriginalExtension()), ['mp4', 'mov', 'webm'], true);

        $path = $file->store('homepage-slides', 'public');

        HomepageSlide::create([
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'link_url' => $validated['link_url'] ?? null,
            'cta_label' => $validated['cta_label'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'media_type' => $isVideo ? 'video' : 'image',
            'media_path' => $path,
            'is_active' => $request->boolean('is_active', true),
        ]);

        cache()->forget('homepage.payload.v5');
        cache()->forget('homepage.payload.v6');

        return redirect()->back()->with('success', 'Homepage slide uploaded.');
    }

    public function update(Request $request, HomepageSlide $slide): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:120',
            'caption' => 'nullable|string|max:200',
            'link_url' => 'nullable|string|max:500',
            'cta_label' => 'nullable|string|max:60',
            'sort_order' => 'nullable|integer|min:0|max:9999',
            'media' => 'nullable|file|mimes:jpg,jpeg,png,webp,mp4,mov,webm|max:512000',
            'is_active' => 'sometimes|boolean',
        ]);

        $data = [
            'title' => $validated['title'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'link_url' => $validated['link_url'] ?? null,
            'cta_label' => $validated['cta_label'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? $slide->sort_order),
        ];

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($request->hasFile('media')) {
            if ($slide->media_path) {
                Storage::disk('public')->delete($slide->media_path);
            }

            $file = $request->file('media');
            $mime = (string) $file->getMimeType();
            $isVideo = str_starts_with($mime, 'video/')
                || in_array(strtolower($file->getClientOriginalExtension()), ['mp4', 'mov', 'webm'], true);

            $data['media_path'] = $file->store('homepage-slides', 'public');
            $data['media_type'] = $isVideo ? 'video' : 'image';
        }

        $slide->update($data);

        cache()->forget('homepage.payload.v5');
        cache()->forget('homepage.payload.v6');

        return redirect()->back()->with('success', 'Homepage slide updated.');
    }

    public function toggle(HomepageSlide $slide): RedirectResponse
    {
        $slide->update(['is_active' => ! $slide->is_active]);

        cache()->forget('homepage.payload.v5');
        cache()->forget('homepage.payload.v6');

        return redirect()->back()->with('success', $slide->is_active
            ? 'Slide is now live on the homepage.'
            : 'Slide hidden from the homepage.');
    }

    public function destroy(HomepageSlide $slide): RedirectResponse
    {
        if ($slide->media_path) {
            Storage::disk('public')->delete($slide->media_path);
        }

        $slide->delete();

        cache()->forget('homepage.payload.v5');
        cache()->forget('homepage.payload.v6');

        return redirect()->back()->with('success', 'Homepage slide deleted.');
    }
}
