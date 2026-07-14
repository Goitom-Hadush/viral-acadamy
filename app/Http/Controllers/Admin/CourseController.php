<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
    {
        $view = request()->query('view', 'courses');

        if (! in_array($view, ['courses', 'videos', 'reviews'], true)) {
            $view = 'courses';
        }

        $categoryLookup = Category::orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->keyBy('id');

        $courses = Course::with([
                'instructor:id,name',
                'category:id,name,slug',
                'videos:id,course_id,title,video_path,duration,sequence,created_at',
                'reviews' => fn ($reviewQuery) => $reviewQuery
                    ->with('user:id,name')
                    ->latest(),
            ])
            ->withCount(['videos', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get();

        $categories = $courses
            ->groupBy(fn ($course) => $course->category_id ?: 'uncategorized')
            ->map(function ($groupedCourses, $categoryId) use ($categoryLookup) {
                if ($categoryId === 'uncategorized') {
                    return [
                        'id' => 'uncategorized',
                        'name' => 'Uncategorized',
                        'slug' => 'uncategorized',
                        'courses_count' => $groupedCourses->count(),
                        'courses' => $groupedCourses->values(),
                    ];
                }

                $category = $categoryLookup->get((int) $categoryId);

                return [
                    'id' => $category?->id ?? $categoryId,
                    'name' => $category?->name ?? 'Uncategorized',
                    'slug' => $category?->slug ?? 'uncategorized',
                    'courses_count' => $groupedCourses->count(),
                    'courses' => $groupedCourses->values(),
                ];
            })
            ->sortBy('name')
            ->values();

        $stats = [
            'categories' => $categories->count(),
            'courses' => $courses->count(),
            'videos' => $courses->sum('videos_count'),
            'reviews' => $courses->sum('reviews_count'),
        ];

        if (request()->wantsJson() || request()->is('test-courses')) {
            return response()->json([
                'categories' => $categories,
                'courses' => $courses,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Courses/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'view' => $view,
        ]);
    }

    public function destroy(Course $course)
    {
        $course->load('videos:id,course_id,video_path');

        foreach ($course->videos as $video) {
            if ($video->video_path) {
                Storage::disk('private')->delete($video->video_path);
            }
        }

        if ($course->thumbnail && $course->thumbnail !== 'thumbnails/dummy.jpg') {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return redirect()->back()->with('success', 'Course and all related videos/reviews were deleted.');
    }
}
