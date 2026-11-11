<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentPage;
use App\Models\Interview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Interviews/Index', [
            'page' => ContentPage::forSlug('interviews'),
            'interviews' => Interview::query()->ordered()->get(),
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
            ['slug' => 'interviews'],
            $validated
        );

        return redirect()->back()->with('success', 'Interviews page updated.');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->itemRules($request);

        if ($request->hasFile('video')) {
            $data['video_path'] = $request->file('video')->store('interviews', 'public');
        }

        Interview::create($data);

        return redirect()->back()->with('success', 'Interview added.');
    }

    public function update(Request $request, Interview $interview): RedirectResponse
    {
        $data = $this->itemRules($request, false);

        if ($request->boolean('remove_video') && $interview->video_path) {
            Storage::disk('public')->delete($interview->video_path);
            $data['video_path'] = null;
        }

        if ($request->hasFile('video')) {
            if ($interview->video_path) {
                Storage::disk('public')->delete($interview->video_path);
            }
            $data['video_path'] = $request->file('video')->store('interviews', 'public');
        }

        $interview->update($data);

        return redirect()->back()->with('success', 'Interview updated.');
    }

    public function destroy(Interview $interview): RedirectResponse
    {
        if ($interview->video_path) {
            Storage::disk('public')->delete($interview->video_path);
        }
        if ($interview->image_path) {
            Storage::disk('public')->delete($interview->image_path);
        }

        $interview->delete();

        return redirect()->back()->with('success', 'Interview removed.');
    }

    public function toggle(Interview $interview): RedirectResponse
    {
        $interview->update(['is_published' => ! $interview->is_published]);

        return redirect()->back()->with('success', $interview->is_published ? 'Interview published.' : 'Interview hidden.');
    }

    private function itemRules(Request $request, bool $creating = true): array
    {
        if ($request->input('sort_order') === '') {
            $request->merge(['sort_order' => null]);
        }
        if ($request->input('video_url') === '') {
            $request->merge(['video_url' => null]);
        }

        $validated = $request->validate([
            'guest' => 'required|string|max:160',
            'title' => 'required|string|max:255',
            'topic' => 'nullable|string|max:120',
            'summary' => 'nullable|string|max:2000',
            'body' => 'nullable|string|max:20000',
            'video_url' => 'nullable|url|max:500',
            'video' => 'nullable|file|mimes:mp4,mov,webm|max:512000',
            'remove_video' => 'sometimes|boolean',
            'sort_order' => 'nullable|integer|min:0|max:999',
            'is_published' => 'sometimes|boolean',
        ]);

        unset($validated['video'], $validated['remove_video']);

        $validated['sort_order'] = $validated['sort_order'] ?? (
            $creating ? ((int) Interview::query()->max('sort_order') + 1) : null
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
