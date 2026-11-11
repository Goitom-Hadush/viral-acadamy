<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutHighlight;
use App\Models\ContentPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/About/Index', [
            'page' => ContentPage::forSlug('about'),
            'highlights' => AboutHighlight::query()->ordered()->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'eyebrow' => 'nullable|string|max:120',
            'headline' => 'required|string|max:255',
            'intro' => 'nullable|string|max:5000',
            'banner_title' => 'nullable|string|max:255',
            'banner_body' => 'nullable|string|max:5000',
            'meta_description' => 'nullable|string|max:320',
            'section_title' => 'nullable|string|max:255',
            'stats' => 'nullable|array|max:6',
            'stats.*.value' => 'nullable|string|max:60',
            'stats.*.label' => 'nullable|string|max:100',
            'hero_images' => 'nullable|array|max:10',
            'hero_images.*' => 'image|max:5120',
            'banner_image' => 'nullable|image|max:5120',
        ]);

        unset($validated['hero_images'], $validated['banner_image']);
        $page = ContentPage::forSlug('about');
        $currentHeroImages = $page?->hero_images ?? array_filter([$page?->hero_image_path]);
        $removedHeroImages = $request->input('remove_hero_images', []);
        if (is_array($removedHeroImages) && count($removedHeroImages)) {
            foreach (array_intersect($currentHeroImages, $removedHeroImages) as $path) Storage::disk('public')->delete($path);
            $currentHeroImages = array_values(array_diff($currentHeroImages, $removedHeroImages));
        }
        foreach (($request->file('hero_images') ?? []) as $image) $currentHeroImages[] = $image->store('about', 'public');
        $validated['hero_images'] = array_values($currentHeroImages);
        $validated['hero_image_path'] = $currentHeroImages[0] ?? null;
        foreach (['banner_image'] as $field) {
            $removeField = 'remove_' . $field;
            $pathField = $field . '_path';
            if ($request->boolean($removeField) && $page?->{$pathField}) {
                Storage::disk('public')->delete($page->{$pathField});
                $validated[$pathField] = null;
            }
            if ($request->hasFile($field)) {
                if ($page?->{$pathField}) Storage::disk('public')->delete($page->{$pathField});
                $validated[$pathField] = $request->file($field)->store('about', 'public');
            }
        }

        ContentPage::query()->updateOrCreate(
            ['slug' => 'about'],
            $validated
        );

        return redirect()->back()->with('success', 'About page updated.');
    }

    public function storeHighlight(Request $request): RedirectResponse
    {
        $validated = $this->highlightRules($request);
        if ($request->hasFile('image')) $validated['image_path'] = $request->file('image')->store('about/highlights', 'public');

        AboutHighlight::create($validated);

        return redirect()->back()->with('success', 'Highlight added.');
    }

    public function updateHighlight(Request $request, AboutHighlight $highlight): RedirectResponse
    {
        $validated = $this->highlightRules($request, false);
        if ($request->hasFile('image')) {
            if ($highlight->image_path) Storage::disk('public')->delete($highlight->image_path);
            $validated['image_path'] = $request->file('image')->store('about/highlights', 'public');
        }
        $highlight->update($validated);

        return redirect()->back()->with('success', 'Highlight updated.');
    }

    public function destroyHighlight(AboutHighlight $highlight): RedirectResponse
    {
        if ($highlight->image_path) Storage::disk('public')->delete($highlight->image_path);
        $highlight->delete();

        return redirect()->back()->with('success', 'Highlight removed.');
    }

    public function toggleHighlight(AboutHighlight $highlight): RedirectResponse
    {
        $highlight->update(['is_published' => ! $highlight->is_published]);

        return redirect()->back()->with('success', $highlight->is_published ? 'Highlight published.' : 'Highlight hidden.');
    }

    private function highlightRules(Request $request, bool $creating = true): array
    {
        if ($request->input('sort_order') === '') {
            $request->merge(['sort_order' => null]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:120',
            'body' => 'required|string|max:2000',
            'sort_order' => 'nullable|integer|min:0|max:999',
            'is_published' => 'sometimes|boolean',
            'image' => 'nullable|image|max:5120',
        ]);
        unset($validated['image']);

        $validated['sort_order'] = $validated['sort_order'] ?? (
            $creating ? ((int) AboutHighlight::query()->max('sort_order') + 1) : null
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
