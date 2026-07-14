<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class AdvertisementController extends Controller
{
    public function index()
    {
        // If migrations haven't been run, avoid querying the missing table to prevent exceptions
        if (! Schema::hasTable('advertisements')) {
            return Inertia::render('Admin/Advertisement', [
                'advertisement' => null,
                'migrations_missing' => true,
            ]);
        }

        return Inertia::render('Admin/Advertisement', [
            'advertisement' => Advertisement::query()->latest()->first(),
            'migrations_missing' => false,
        ]);
    }

    public function store(Request $request)
    {
        // Guard: ensure table exists before attempting to write
        if (! Schema::hasTable('advertisements')) {
            return redirect()->back()->with('error', 'Advertisements table not found. Please run php artisan migrate.');
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'video' => 'required|file|mimes:mp4,mov,webm|max:51200',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
        ]);

        $existingAdvertisement = Advertisement::query()->latest()->first();

        if ($existingAdvertisement?->video_path) {
            Storage::disk('public')->delete($existingAdvertisement->video_path);
        }

        $videoPath = $request->file('video')->store('advertisements', 'public');

        $data = [
            'title' => $validated['title'] ?? null,
            'video_path' => $videoPath,
            'is_active' => true,
            'start_at' => $validated['start_at'] ?? null,
            'end_at' => $validated['end_at'] ?? null,
        ];

        if ($existingAdvertisement) {
            $existingAdvertisement->update($data);
        } else {
            Advertisement::create($data);
        }

        return redirect()->back()->with('success', 'Homepage advertisement updated successfully.');
    }

    public function destroy(Advertisement $advertisement)
    {
        // Guard: ensure table exists before attempting to delete
        if (! Schema::hasTable('advertisements')) {
            return redirect()->back()->with('error', 'Advertisements table not found. Please run php artisan migrate.');
        }

        if ($advertisement->video_path) {
            Storage::disk('public')->delete($advertisement->video_path);
        }

        $advertisement->delete();

        return redirect()->back()->with('success', 'Homepage advertisement removed.');
    }
}
