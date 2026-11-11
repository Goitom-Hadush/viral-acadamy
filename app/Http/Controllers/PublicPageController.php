<?php

namespace App\Http\Controllers;

use App\Models\AboutHighlight;
use App\Models\Category;
use App\Models\ContentPage;
use App\Models\Course;
use App\Models\CourseReel;
use App\Models\Interview;
use App\Models\Seminar;
use App\Models\SeminarRegistration;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('About', [
            'page' => $this->contentPage('about'),
            'highlights' => $this->publishedList(AboutHighlight::class),
        ]);
    }

    public function testimonials(): Response
    {
        return Inertia::render('Testimonials', [
            'page' => $this->contentPage('testimonials'),
            'testimonials' => $this->publishedList(Testimonial::class),
        ]);
    }

    public function interviews(): Response
    {
        return Inertia::render('Interviews', [
            'page' => $this->contentPage('interviews'),
            'interviews' => $this->publishedList(Interview::class),
        ]);
    }

    public function reels(): Response
    {
        $reels = [];

        if (Schema::hasTable('course_reels')) {
            $reels = CourseReel::query()
                ->published()
                ->with(['course:id,title,thumbnail'])
                ->latest()
                ->get();
        }

        return Inertia::render('Reels', [
            'reels' => $reels,
        ]);
    }

    public function seminars(): Response
    {
        $seminars = [];

        if (Schema::hasTable('seminars')) {
            $seminars = Seminar::query()
                ->where('is_published', true)
                ->orderBy('sort_order')
                ->orderBy('id', 'desc')
                ->get();
        }

        return Inertia::render('Seminars', [
            'page' => $this->contentPage('seminars'),
            'seminars' => $seminars,
            'flash' => session('flash', []),
        ]);
    }

    public function registerSeminar(Request $request)
    {
        $validated = $request->validate([
            'seminar_id' => 'required',
            'seminar_title' => 'required|string',
            'attendee_name' => 'required|string|max:120',
            'attendee_phone' => 'required|string|max:30',
            'attendee_email' => 'nullable|email|max:120',
            'ticket_tier' => 'nullable|string|max:60',
            'amount_paid' => 'nullable|numeric|min:0',
            'transaction_reference' => 'nullable|string|max:100',
            'receipt' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $ticketCode = 'SLC-SEM-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('seminar_receipts', 'public');
        }

        $seminar = Seminar::find($validated['seminar_id']);
        $hasFee = ($seminar && $seminar->entrance_fee > 0) || ($validated['amount_paid'] ?? 0) > 0 || $receiptPath !== null;
        $status = $hasFee ? 'pending_approval' : 'approved';

        if (Schema::hasTable('seminar_registrations')) {
            SeminarRegistration::create([
                'registration_code' => $ticketCode,
                'seminar_id' => (string) $validated['seminar_id'],
                'seminar_title' => $validated['seminar_title'],
                'attendee_name' => $validated['attendee_name'],
                'attendee_phone' => $validated['attendee_phone'],
                'attendee_email' => $validated['attendee_email'] ?? null,
                'ticket_tier' => $validated['ticket_tier'] ?? 'Standard Delegate Pass',
                'receipt_image' => $receiptPath,
                'amount_paid' => $validated['amount_paid'] ?? ($seminar ? $seminar->entrance_fee : 0),
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'status' => $status,
            ]);

            if ($status === 'approved') {
                Seminar::where('id', $validated['seminar_id'])->increment('registered_count');
            }
        }

        $message = $status === 'pending_approval'
            ? 'Payment receipt submitted successfully! Our academy admin will review your receipt and approve your official seat pass.'
            : 'Congratulations! Your seminar seat has been reserved successfully.';

        return back()->with('flash', [
            'type' => 'success',
            'message' => $message,
            'registration_code' => $ticketCode,
            'attendee_name' => $validated['attendee_name'],
            'seminar_title' => $validated['seminar_title'],
            'ticket_tier' => $validated['ticket_tier'] ?? 'Standard Delegate Pass',
            'status' => $status,
            'has_receipt' => $receiptPath !== null,
            'amount_paid' => $validated['amount_paid'] ?? ($seminar ? $seminar->entrance_fee : 0),
        ]);
    }

    public function courses(): Response
    {
        $courses = Course::query()
            ->where('status', 'published')
            ->with([
                'instructor:id,name',
                'category:id,name',
            ])
            ->withCount('videos')
            ->latest()
            ->get([
                'id',
                'title',
                'description',
                'price',
                'price_usd',
                'thumbnail',
                'instructor_id',
                'category_id',
                'created_at',
            ]);

        $categories = Category::query()
            ->whereHas('courses', fn ($q) => $q->where('status', 'published'))
            ->withCount(['courses' => fn ($q) => $q->where('status', 'published')])
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
        ]);
    }

    private function contentPage(string $slug): ?ContentPage
    {
        if (! Schema::hasTable('content_pages')) {
            return null;
        }

        return ContentPage::forSlug($slug);
    }

    private function publishedList(string $model)
    {
        $table = (new $model)->getTable();

        if (! Schema::hasTable($table)) {
            return [];
        }

        return $model::query()->published()->ordered()->get();
    }
}
