<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CourseController extends Controller
{
    /** List every course (all instructors) plus the data the create/edit forms need. */
    public function index()
    {
        $courses = Course::with([
                'instructor:id,name,email,phone,avatar,social_media',
                'category:id,name,slug',
            ])
            ->withCount(['videos', 'reviews'])
            ->latest()
            ->get();

        $stats = [
            'courses' => $courses->count(),
            'published' => $courses->where('status', 'published')->count(),
            'videos' => $courses->sum('videos_count'),
            'reviews' => $courses->sum('reviews_count'),
        ];

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
            'instructors' => $this->instructors(),
            'stats' => $stats,
        ]);
    }

    /** Course detail page (view). */
    public function show(Course $course)
    {
        $course->load([
            'instructor:id,name,email,phone,avatar,social_media',
            'category:id,name,slug',
            'promoCodes' => fn ($q) => $q->orderByDesc('created_at'),
        ]);
        $course->loadCount(['videos', 'reviews']);
        $course->loadAvg('reviews', 'rating');

        return Inertia::render('Admin/Courses/Show', [
            'course' => $course,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'instructor_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['status'] = 'draft';

        Course::create($validated);

        return redirect()->back()->with('success', 'Course created as a draft. Add videos, then publish it.');
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'instructor_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('thumbnail')) {
            $this->deleteThumbnail($course);
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        if ($validated['title'] !== $course->title) {
            $validated['slug'] = $this->uniqueSlug($validated['title'], $course->id);
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully.');
    }

    public function togglePublish(Course $course)
    {
        $newStatus = $course->status === 'published' ? 'draft' : 'published';
        $course->update(['status' => $newStatus]);

        return redirect()->back()->with(
            'success',
            $newStatus === 'published' ? 'Course published. Students can now see it.' : 'Course unpublished (draft).'
        );
    }

    public function destroy(Course $course)
    {
        $course->load('videos.materials');

        foreach ($course->videos as $video) {
            foreach ($video->materials as $material) {
                Storage::disk('private')->delete($material->file_path);
            }
            if ($video->video_path) {
                Storage::disk('private')->delete($video->video_path);
            }
        }

        $this->deleteThumbnail($course);

        $course->delete();

        return redirect()->route('admin.courses.index')
            ->with('success', 'Course and all related videos/reviews were deleted.');
    }

    private function instructors()
    {
        return User::whereIn('role', ['instructor', 'admin'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'phone', 'avatar', 'social_media']);
    }

    private function deleteThumbnail(Course $course): void
    {
        if ($course->thumbnail && $course->thumbnail !== 'thumbnails/dummy.jpg') {
            Storage::disk('public')->delete($course->thumbnail);
        }
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'course';
        $slug = $base;
        $i = 2;

        while (Course::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
