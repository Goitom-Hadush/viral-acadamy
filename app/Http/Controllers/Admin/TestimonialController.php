<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Testimonials/Index', [
            'page' => ContentPage::forSlug('testimonials'),
            'testimonials' => Testimonial::query()->ordered()->get(),
        ]);
    }

    public function updatePage(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow' => 'nullable|string|max:120',
            'headline' => 'required|string|max:255',
            'intro' => 'nullable|string|max:5000',
            'meta_description' => 'nullable|string|max:320',
        ]);

        ContentPage::query()->updateOrCreate(
            ['slug' => 'testimonials'],
            $validated
        );

        return redirect()->back()->with('success', 'Testimonials page updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->itemRules($request);

        if ($request->hasFile('video')) {
            $data['video_path'] = $request->file('video')->store('testimonials', 'public');
        }

        Testimonial::create($data);

        return redirect()->back()->with('success', 'Testimonial added.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $data = $this->itemRules($request, false);

        if ($request->boolean('remove_video') && $testimonial->video_path) {
            Storage::disk('public')->delete($testimonial->video_path);
            $data['video_path'] = null;
        }

        if ($request->hasFile('video')) {
            if ($testimonial->video_path) {
                Storage::disk('public')->delete($testimonial->video_path);
            }
            $data['video_path'] = $request->file('video')->store('testimonials', 'public');
        }

        $testimonial->update($data);

        return redirect()->back()->with('success', 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        if ($testimonial->video_path) {
            Storage::disk('public')->delete($testimonial->video_path);
        }

        $testimonial->delete();

        return redirect()->back()->with('success', 'Testimonial removed.');
    }

    public function toggle(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['is_published' => ! $testimonial->is_published]);

        return redirect()->back()->with('success', $testimonial->is_published ? 'Testimonial published.' : 'Testimonial hidden.');
    }

    private function itemRules(Request $request, bool $creating = true): array
    {
        if ($request->input('sort_order') === '') {
            $request->merge(['sort_order' => null]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'role' => 'nullable|string|max:160',
            'quote' => 'required|string|max:2000',
            'video' => 'nullable|file|mimes:mp4,mov,webm|max:512000',
            'remove_video' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0|max:999',
            'is_published' => 'sometimes|boolean',
        ]);

        unset($validated['video'], $validated['remove_video']);

        $validated['sort_order'] = $validated['sort_order'] ?? (
            $creating ? ((int) Testimonial::query()->max('sort_order') + 1) : null
        );

        if ($validated['sort_order'] === null) {
            unset($validated['sort_order']);
        }

        if ($request->has('is_published')) {
            $validated['is_published'] = $request->boolean('is_published');
        } elseif ($creating) {
            $validated['is_published'] = true;
        } else {
            unset($validated['is_published']);
        }

        return $validated;
    }
}
