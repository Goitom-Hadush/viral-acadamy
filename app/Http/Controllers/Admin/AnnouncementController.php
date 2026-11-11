<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteAnnouncement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $this->assertAdmin();

        if (! Schema::hasTable('site_announcements')) {
            return Inertia::render('Admin/Announcement/Index', [
                'announcement' => null,
                'migrations_missing' => true,
            ]);
        }

        return Inertia::render('Admin/Announcement/Index', [
            'announcement' => SiteAnnouncement::query()->latest('id')->first(),
            'migrations_missing' => false,
        ]);
    }

    public function update(Request $request)
    {
        $this->assertAdmin();

        if (! Schema::hasTable('site_announcements')) {
            return redirect()->back()->with('error', 'Please run php artisan migrate first.');
        }

        $validated = $request->validate([
            'badge' => 'nullable|string|max:60',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'cta_url' => 'nullable|string|max:500',
            'telegram_url' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:40',
            'is_active' => 'sometimes|boolean',
        ]);

        // Button label is localized in the UI (How? / እንዴት? / ከመይ?)
        $validated['is_active'] = $request->boolean('is_active');

        $announcement = SiteAnnouncement::query()->latest('id')->first();

        if ($announcement) {
            $announcement->update($validated);
        } else {
            SiteAnnouncement::create($validated);
        }

        return redirect()->back()->with('success', 'Homepage announcement updated.');
    }

    private function assertAdmin(): void
    {
        if (! auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Only admins can manage the announcement.');
        }
    }
}
