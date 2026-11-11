<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutHighlight;
use App\Models\Advertisement;
use App\Models\ContentPage;
use App\Models\Course;
use App\Models\CourseReel;
use App\Models\HomepageSlide;
use App\Models\Interview;
use App\Models\SiteAnnouncement;
use App\Models\Testimonial;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class ContentController extends Controller
{
    public function home(): JsonResponse
    {
        $courses = Course::query()
            ->where('status', 'published')
            ->with([
                'instructor:id,name,email,phone,avatar,social_media',
                'category:id,name',
            ])
            ->withCount('videos')
            ->latest()
            ->limit(12)
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
            ])
            ->map(function (Course $course) {
                $data = $course->toArray();
                $data['thumbnail'] = Media::thumbnailUrl($course->thumbnail);

                return $data;
            });

        $homepageSlides = HomepageSlide::homepageCollection(12)
            ->map(function (array $slide) {
                $slide['media_url'] = isset($slide['media_path'])
                    ? Media::publicUrl($slide['media_path'])
                    : ($slide['media_url'] ?? null);

                return $slide;
            })
            ->values();

        return response()->json([
            'data' => [
                'courses' => $courses,
                'homepage_slides' => $homepageSlides,
                // Keep empty reels on home — course reels live on /api/content/reels
                'reels' => [],
                'promo' => $this->activePromo(),
                'advertisements' => $this->activeAds(),
                'announcement' => $this->activeAnnouncement(),
                'intro' => $this->introVideo(),
                'stats' => [
                    ['value' => '100+', 'label' => 'Published learning paths'],
                    ['value' => 'HD', 'label' => 'Video-first lesson streaming'],
                    ['value' => '3', 'label' => 'Simple dashboards by role'],
                ],
            ],
        ]);
    }

    public function reels(): JsonResponse
    {
        return response()->json(['data' => $this->reelsCollection()]);
    }

    public function testimonials(): JsonResponse
    {
        $page = $this->page('testimonials');
        $items = Schema::hasTable('testimonials')
            ? Testimonial::query()->published()->ordered()->get()
            : [];

        return response()->json([
            'data' => [
                'page' => $page,
                'testimonials' => $items,
            ],
        ]);
    }

    public function interviews(): JsonResponse
    {
        $page = $this->page('interviews');
        $items = Schema::hasTable('interviews')
            ? Interview::query()->published()->ordered()->get()
            : [];

        return response()->json([
            'data' => [
                'page' => $page,
                'interviews' => $items,
            ],
        ]);
    }

    public function about(): JsonResponse
    {
        $page = $this->page('about');
        $highlights = Schema::hasTable('about_highlights')
            ? AboutHighlight::query()->published()->ordered()->get()
            : [];

        return response()->json([
            'data' => [
                'page' => $page,
                'highlights' => $highlights,
            ],
        ]);
    }

    public function promo(): JsonResponse
    {
        return response()->json(['data' => $this->activePromo()]);
    }

    private function page(string $slug): ?ContentPage
    {
        if (! Schema::hasTable('content_pages')) {
            return null;
        }

        return ContentPage::forSlug($slug);
    }

    private function reelsCollection()
    {
        if (! Schema::hasTable('course_reels')) {
            return collect();
        }

        return CourseReel::query()
            ->published()
            ->with(['course:id,title,thumbnail'])
            ->latest()
            ->limit(24)
            ->get()
            ->map(function (CourseReel $reel) {
                $data = $reel->toArray();
                $data['media_url'] = Media::publicUrl($reel->media_path);
                if (isset($data['course']['thumbnail'])) {
                    $data['course']['thumbnail'] = Media::thumbnailUrl($data['course']['thumbnail']);
                }

                return $data;
            })
            ->values();
    }

    private function activeAds()
    {
        return Advertisement::homepageCollection()
            ->map(function (array $ad) {
                $ad['image_url'] = ! empty($ad['image_url']) ? url($ad['image_url']) : null;
                $ad['video_url'] = ! empty($ad['video_url']) ? url($ad['video_url']) : null;

                return $ad;
            })
            ->values()
            ->all();
    }

    private function activeAnnouncement(): ?array
    {
        try {
            return SiteAnnouncement::activeForHomepage();
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function activePromo(): ?array
    {
        $ads = Advertisement::homepageCollection();
        $ad = $ads->first();

        if (! $ad) {
            return null;
        }

        return [
            'id' => $ad['id'],
            'title' => $ad['title'],
            'tier' => $ad['tier'],
            'video_path' => $ad['video_url'],
            'video_url' => $ad['video_url'] ? url($ad['video_url']) : null,
            'image_url' => $ad['image_url'] ? url($ad['image_url']) : null,
            'link_url' => $ad['link_url'],
        ];
    }

    private function introVideo(): ?array
    {
        $hasIntro = cache()->remember(
            'intro_welcome_exists',
            now()->addMinutes(10),
            fn () => Storage::disk('public')->exists('intro/welcome.mp4')
        );

        if (! $hasIntro) {
            return null;
        }

        return [
            'src' => url('/media/intro/welcome.mp4'),
            'title' => 'Welcome to Success Life Coaching Academy',
            'caption' => null,
            'poster' => null,
        ];
    }
}
