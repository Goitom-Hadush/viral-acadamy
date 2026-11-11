<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sponsor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SponsorController extends Controller
{
    public function index(): Response
    {
        $sponsors = Sponsor::query()->ordered()->get();

        $stats = [
            'total' => Sponsor::count(),
            'platinum' => Sponsor::where('tier', 'platinum')->count(),
            'gold' => Sponsor::where('tier', 'gold')->count(),
            'silver' => Sponsor::where('tier', 'silver')->count(),
            'bronze' => Sponsor::where('tier', 'bronze')->count(),
            'active' => Sponsor::where('is_active', true)->count(),
        ];

        return Inertia::render('Admin/Sponsors/Index', [
            'sponsors' => $sponsors,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'tier' => 'required|string|in:platinum,gold,silver,bronze',
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'website_url' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $logoPath = $request->file('logo')->store('sponsors', 'public');

        Sponsor::create([
            'name' => $validated['name'],
            'tier' => strtolower($validated['tier']),
            'logo_path' => $logoPath,
            'website_url' => $validated['website_url'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return redirect()->back()->with('success', "{$validated['name']} added to " . ucfirst($validated['tier']) . " sponsors!");
    }

    public function update(Request $request, Sponsor $sponsor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'tier' => 'required|string|in:platinum,gold,silver,bronze',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:5120',
            'website_url' => 'nullable|url|max:255',
            'description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('logo')) {
            if ($sponsor->logo_path && Storage::disk('public')->exists($sponsor->logo_path)) {
                Storage::disk('public')->delete($sponsor->logo_path);
            }
            $sponsor->logo_path = $request->file('logo')->store('sponsors', 'public');
        }

        $sponsor->name = $validated['name'];
        $sponsor->tier = strtolower($validated['tier']);
        $sponsor->website_url = $validated['website_url'] ?? null;
        $sponsor->description = $validated['description'] ?? null;
        $sponsor->sort_order = $validated['sort_order'] ?? $sponsor->sort_order;
        if ($request->has('is_active')) {
            $sponsor->is_active = $request->boolean('is_active');
        }

        $sponsor->save();

        return redirect()->back()->with('success', 'Sponsor details updated successfully!');
    }

    public function toggleActive(Sponsor $sponsor)
    {
        $sponsor->update(['is_active' => !$sponsor->is_active]);
        return redirect()->back()->with('success', 'Sponsor visibility toggled.');
    }

    public function destroy(Sponsor $sponsor)
    {
        if ($sponsor->logo_path && Storage::disk('public')->exists($sponsor->logo_path)) {
            Storage::disk('public')->delete($sponsor->logo_path);
        }
        $sponsor->delete();

        return redirect()->back()->with('success', 'Sponsor logo deleted successfully.');
    }
}
