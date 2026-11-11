<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    // 1. Show the list of courses AND the creation form
    public function index()
    {
        // Get categories for the dropdown
        $categories = Category::orderBy('name')->get();

        // Get ONLY the courses created by this logged-in instructor, with their videos
        $courses = Course::where('instructor_id', auth()->id())
                         ->with('videos')
                         ->orderBy('created_at', 'desc')
                         ->get();

        return Inertia::render('Instructor/Courses/Index', [
            'categories' => $categories,
            'courses' => $courses,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    // 2. Save the new course
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
        ]);

        // Handle the Thumbnail Upload
        if ($request->hasFile('thumbnail')) {
            // Save to storage/app/public/thumbnails
            $filePath = $request->file('thumbnail')->store('thumbnails', 'public');
            $validated['thumbnail'] = $filePath; // Save the PATH, not the file itself
        }

        // Generate the URL slug
        $validated['slug'] = Str::slug($validated['title']);
        
        // Set the instructor to the currently logged-in user
        $validated['instructor_id'] = auth()->id();
        
        // Set default status to draft
        $validated['status'] = 'draft';

        Course::create($validated);

        return redirect()->back()->with('success', 'Course created successfully! Add videos next.');
    }
    public function togglePublish(Course $course)
{
    // Security: Ensure the instructor owns this course
    if ($course->instructor_id !== auth()->id()) {
        abort(403);
    }

    // Toggle between draft and published
    $newStatus = $course->status === 'draft' ? 'published' : 'draft';
    $course->update(['status' => $newStatus]);

    $message = $newStatus === 'published' ? 'Course published successfully! Students can now see it.' : 'Course unpublished (Draft).';

    return redirect()->back()->with('success', $message);
}

    // No separate edit page: the instructor edits from the courses list.
    public function edit(Course $course)
    {
        abort_unless($course->instructor_id === auth()->id(), 403);

        return redirect()->route('instructor.courses.index');
    }

    public function update(Request $request, Course $course)
    {
        abort_unless($course->instructor_id === auth()->id(), 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail && $course->thumbnail !== 'thumbnails/dummy.jpg') {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($course->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            unset($validated['thumbnail']);
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course)
    {
        abort_unless($course->instructor_id === auth()->id(), 403);

        $course->load('videos.materials');
        foreach ($course->videos as $video) {
            foreach ($video->materials as $material) {
                \Illuminate\Support\Facades\Storage::disk('private')->delete($material->file_path);
            }
            if ($video->video_path) {
                \Illuminate\Support\Facades\Storage::disk('private')->delete($video->video_path);
            }
        }
        if ($course->thumbnail && $course->thumbnail !== 'thumbnails/dummy.jpg') {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->route('instructor.courses.index')->with('success', 'Course deleted.');
    }
}
