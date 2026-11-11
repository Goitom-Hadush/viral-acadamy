<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Seminar;
use App\Models\SeminarRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SeminarController extends Controller
{
    public function index(Request $request): Response
    {
        $seminars = Seminar::query()
            ->withCount('registrations')
            ->orderBy('id', 'desc')
            ->get();

        $registrations = SeminarRegistration::query()
            ->with('seminar:id,title,date_string')
            ->orderBy('id', 'desc')
            ->get();

        $stats = [
            'total_seminars' => Seminar::count(),
            'published_seminars' => Seminar::where('is_published', true)->count(),
            'total_registrations' => SeminarRegistration::count(),
            'pending_receipts' => SeminarRegistration::where('status', 'pending_approval')->count(),
            'approved_tickets' => SeminarRegistration::where('status', 'approved')->count(),
        ];

        return Inertia::render('Admin/Seminars/Index', [
            'seminars' => $seminars,
            'registrations' => $registrations,
            'stats' => $stats,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:100',
            'speaker_name' => 'required|string|max:150',
            'speaker_title' => 'nullable|string|max:200',
            'date_string' => 'required|string|max:100',
            'time_string' => 'required|string|max:100',
            'location_type' => 'required|string|in:in_person,virtual,hybrid',
            'venue_name' => 'required|string|max:255',
            'venue_city' => 'nullable|string|max:100',
            'online_link' => 'nullable|string|max:500',
            'entrance_fee' => 'nullable|numeric|min:0',
            'price_label' => 'nullable|string|max:100',
            'description' => 'required|string',
            'topics' => 'nullable|string',
            'bank_info' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('seminars', 'public');
        }

        $slug = Str::slug($validated['title']);
        $count = Seminar::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug .= '-' . ($count + 1);
        }

        // Speaker Initials
        $words = explode(' ', trim($validated['speaker_name']));
        $initials = '';
        foreach (array_slice($words, 0, 2) as $w) {
            $initials .= strtoupper(substr($w, 0, 1));
        }

        // Topics JSON
        $topicsArray = [];
        if (!empty($validated['topics'])) {
            $topicsArray = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', $validated['topics']))));
        }

        $entranceFee = floatval($validated['entrance_fee'] ?? 0);
        $rawPriceLabel = trim($validated['price_label'] ?? '');
        $priceLabel = $rawPriceLabel !== ''
            ? $rawPriceLabel
            : ($entranceFee > 0 ? "ETB " . number_format($entranceFee, 0) : 'Free');

        // If virtual, hide/clear city
        $venueCity = $validated['location_type'] === 'virtual' ? null : ($validated['venue_city'] ?: 'Addis Ababa');

        Seminar::create([
            'title' => $validated['title'],
            'slug' => $slug,
            'tagline' => $validated['tagline'] ?? null,
            'image_path' => $imagePath,
            'badge' => $validated['badge'] ?: 'Upcoming Seminar',
            'speaker_name' => $validated['speaker_name'],
            'speaker_title' => $validated['speaker_title'] ?? null,
            'speaker_initials' => $initials ?: 'SL',
            'date_string' => $validated['date_string'],
            'time_string' => $validated['time_string'],
            'location_type' => $validated['location_type'],
            'venue_name' => $validated['venue_name'],
            'venue_city' => $venueCity,
            'online_link' => $validated['online_link'] ?? null,
            'price_label' => $priceLabel,
            'entrance_fee' => $entranceFee,
            'description' => $validated['description'],
            'topics_json' => json_encode($topicsArray),
            'bank_info' => $validated['bank_info'] ?? null,
            'capacity' => $validated['capacity'] ?: 250,
            'registered_count' => 0,
            'sort_order' => 0,
            'is_published' => true,
        ]);

        return redirect()->back()->with('success', 'New seminar published successfully!');
    }

    public function update(Request $request, Seminar $seminar)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'badge' => 'nullable|string|max:100',
            'speaker_name' => 'required|string|max:150',
            'speaker_title' => 'nullable|string|max:200',
            'date_string' => 'required|string|max:100',
            'time_string' => 'required|string|max:100',
            'location_type' => 'required|string|in:in_person,virtual,hybrid',
            'venue_name' => 'required|string|max:255',
            'venue_city' => 'nullable|string|max:100',
            'online_link' => 'nullable|string|max:500',
            'entrance_fee' => 'nullable|numeric|min:0',
            'price_label' => 'nullable|string|max:100',
            'description' => 'required|string',
            'topics' => 'nullable|string',
            'bank_info' => 'nullable|string',
            'capacity' => 'nullable|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($seminar->image_path && Storage::disk('public')->exists($seminar->image_path)) {
                Storage::disk('public')->delete($seminar->image_path);
            }
            $seminar->image_path = $request->file('image')->store('seminars', 'public');
        }

        if (isset($validated['topics'])) {
            $topicsArray = array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', $validated['topics']))));
            $seminar->topics_json = json_encode($topicsArray);
        }

        $entranceFee = floatval($validated['entrance_fee'] ?? 0);
        $rawPriceLabel = trim($validated['price_label'] ?? '');
        $priceLabel = $rawPriceLabel !== ''
            ? $rawPriceLabel
            : ($entranceFee > 0 ? "ETB " . number_format($entranceFee, 0) : 'Free');

        $seminar->title = $validated['title'];
        $seminar->tagline = $validated['tagline'] ?? $seminar->tagline;
        $seminar->badge = $validated['badge'] ?? $seminar->badge;
        $seminar->speaker_name = $validated['speaker_name'];
        $seminar->speaker_title = $validated['speaker_title'] ?? $seminar->speaker_title;
        $seminar->date_string = $validated['date_string'];
        $seminar->time_string = $validated['time_string'];
        $seminar->location_type = $validated['location_type'];
        $seminar->venue_name = $validated['venue_name'];
        $seminar->venue_city = $validated['location_type'] === 'virtual' ? null : ($validated['venue_city'] ?? $seminar->venue_city);
        $seminar->online_link = $validated['online_link'] ?? null;
        $seminar->entrance_fee = $entranceFee;
        $seminar->price_label = $priceLabel;
        $seminar->description = $validated['description'];
        $seminar->bank_info = $validated['bank_info'] ?? $seminar->bank_info;
        $seminar->capacity = $validated['capacity'] ?? $seminar->capacity;

        $seminar->save();

        return redirect()->back()->with('success', 'Seminar details updated successfully!');
    }

    public function togglePublished(Seminar $seminar)
    {
        $seminar->update(['is_published' => !$seminar->is_published]);
        return redirect()->back()->with('success', 'Seminar publication status updated.');
    }

    public function destroy(Seminar $seminar)
    {
        if ($seminar->image_path && Storage::disk('public')->exists($seminar->image_path)) {
            Storage::disk('public')->delete($seminar->image_path);
        }
        $seminar->delete();

        return redirect()->back()->with('success', 'Seminar deleted successfully.');
    }

    public function approveRegistration(SeminarRegistration $registration)
    {
        $registration->update(['status' => 'approved']);

        if ($registration->seminar_id) {
            Seminar::where('id', $registration->seminar_id)->increment('registered_count');
        }

        return redirect()->back()->with('success', "Payment approved for {$registration->attendee_name}! Ticket #{$registration->registration_code} is active.");
    }

    public function rejectRegistration(Request $request, SeminarRegistration $registration)
    {
        $notes = $request->input('admin_notes', 'Receipt could not be verified.');
        $registration->update([
            'status' => 'rejected',
            'admin_notes' => $notes,
        ]);

        return redirect()->back()->with('success', "Registration for {$registration->attendee_name} rejected.");
    }
}
