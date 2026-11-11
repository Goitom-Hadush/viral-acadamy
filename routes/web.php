<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ---------------------------------------------------------
// 1. PUBLIC ROUTES
// ---------------------------------------------------------
use App\Models\Course;
use App\Models\Advertisement;
use Illuminate\Support\Facades\Schema;

// Serve uploaded public media without requiring the public/storage symlink.
Route::get('/media/{path}', \App\Http\Controllers\PublicMediaController::class)
    ->where('path', '.*')
    ->name('media.public');

// Robots.txt
Route::get('/robots.txt', function () {
    return response()->view('robots', [], 200)->header('Content-Type', 'text/plain');
})->name('robots.txt');

// Sitemap.xml
Route::get('/sitemap.xml', function () {
    $courses = Course::where('status', 'published')->get();

    $xml  = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Homepage
    $xml .= '  <url>' . "\n";
    $xml .= '    <loc>' . route('home') . '</loc>' . "\n";
    $xml .= '    <lastmod>' . now()->toW3cString() . '</lastmod>' . "\n";
    $xml .= '    <changefreq>weekly</changefreq>' . "\n";
    $xml .= '    <priority>1.0</priority>' . "\n";
    $xml .= '  </url>' . "\n";

    // Course pages
    foreach ($courses as $course) {
        $xml .= '  <url>' . "\n";
        $xml .= '    <loc>' . route('courses.show', $course->id) . '</loc>' . "\n";
        $xml .= '    <lastmod>' . $course->updated_at->toW3cString() . '</lastmod>' . "\n";
        $xml .= '    <changefreq>weekly</changefreq>' . "\n";
        $xml .= '    <priority>0.8</priority>' . "\n";
        $xml .= '  </url>' . "\n";
    }

    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap.xml');

// Locale Switcher (Tigrinya, Amharic, English)
Route::get('/locale/{lang}', function ($lang) {
    if (in_array($lang, ['en', 'am', 'ti'])) {
        session(['locale' => $lang]);
        app()->setLocale($lang);
    }
    return redirect()->back();
})->name('locale.switch');

// ---------------------------------------------------------
// 1. PUBLIC ROUTES (No login required)
// ---------------------------------------------------------
Route::get('/', function () {
    // Only fetch courses that are published, and grab the instructor info + video count
    $courses = Course::where('status', 'published')
                     ->with(['instructor', 'category'])
                     ->withCount('videos')
                     ->orderBy('created_at', 'desc')
                     ->get();

    // Build categories list with course counts (only categories that have published courses)
    $categories = \App\Models\Category::whereHas('courses', function ($q) {
                        $q->where('status', 'published');
                    })
                    ->withCount(['courses' => function ($q) {
                        $q->where('status', 'published');
                    }])
                    ->orderBy('name')
                    ->get();

    // Fetch the currently active homepage advertisement (if any) and respect optional scheduling
    // Guard against missing table (e.g., before running migrations) to avoid QueryException
    try {
        if (Schema::hasTable('advertisements')) {
            $advertisement = Advertisement::where('is_active', true)
                ->where(function ($q) {
                    $q->whereNull('start_at')->orWhere('start_at', '<=', now());
                })
                ->where(function ($q) {
                    $q->whereNull('end_at')->orWhere('end_at', '>=', now());
                })
                ->latest()
                ->first();
        } else {
            $advertisement = null; // migrations not run yet
        }
    } catch (\Throwable $e) {
        // Defensive: if something goes wrong (missing DB file, locked DB, etc.), don't break homepage
        $advertisement = null;
    }

    // Fetch active sponsors for homepage scrolling marquee
    try {
        $sponsors = Schema::hasTable('sponsors')
            ? \App\Models\Sponsor::where('is_active', true)->orderBy('sort_order')->orderBy('id', 'desc')->get()
            : [];
    } catch (\Throwable $e) {
        $sponsors = [];
    }

    // Admin-managed enrollment announcement banner (null when none is active)
    try {
        $announcement = \App\Models\SiteAnnouncement::activeForHomepage();
    } catch (\Throwable $e) {
        $announcement = null;
    }

    // Admin-uploaded APK / IPA (or store links) shown in the "Get the app" section
    try {
        $appDownloads = \App\Models\AppDownload::forHomepage();
    } catch (\Throwable $e) {
        $appDownloads = null;
    }
    return Inertia::render('Welcome', [
        'courses'       => $courses,
        'categories'    => $categories,
        'advertisement' => $advertisement,
        'sponsors'      => $sponsors,
        'announcement'  => $announcement,
        'appDownloads'  => $appDownloads,
    ]);
})->name('home');

// Website chat widget (guests + logged-in users)
Route::get('/chat/state', [\App\Http\Controllers\ChatController::class, 'state'])->middleware('throttle:120,1')->name('chat.state');
Route::post('/chat/messages', [\App\Http\Controllers\ChatController::class, 'send'])->middleware('throttle:20,1')->name('chat.send');

Route::get('/about', [\App\Http\Controllers\PublicPageController::class, 'about'])->name('about');
Route::get('/testimonials', [\App\Http\Controllers\PublicPageController::class, 'testimonials'])->name('testimonials');
Route::get('/interviews', [\App\Http\Controllers\PublicPageController::class, 'interviews'])->name('interviews');
Route::get('/reels', [\App\Http\Controllers\PublicPageController::class, 'reels'])->name('reels');
Route::get('/courses', [\App\Http\Controllers\PublicPageController::class, 'courses'])->name('courses.index');
Route::get('/seminars', [\App\Http\Controllers\PublicPageController::class, 'seminars'])->name('seminars');
Route::post('/seminars/register', [\App\Http\Controllers\PublicPageController::class, 'registerSeminar'])->name('seminars.register');

// Verifiable Completion Certificates
Route::get('/certificates/sample', [\App\Http\Controllers\CertificateController::class, 'sample'])->name('certificates.sample');
Route::get('/certificates/verify/{certificateNumber}', [\App\Http\Controllers\CertificateController::class, 'verify'])->name('certificates.verify');
Route::get('/certificates/{certificateNumber}', [\App\Http\Controllers\CertificateController::class, 'show'])->name('certificates.show');
Route::post('/courses/{course}/claim-certificate', [\App\Http\Controllers\CertificateController::class, 'claim'])->name('courses.claim-certificate')->middleware('auth');

Route::get('/courses/{course}', [App\Http\Controllers\CourseViewController::class, 'show'])->name('courses.show')->middleware('auth');

// Manual Payment Upload (Student)
Route::post('/buy/{course}', [App\Http\Controllers\ManualPaymentController::class, 'uploadReceipt'])->name('manual.pay')->middleware('auth');
Route::post('/courses/{course}/wishlist', [App\Http\Controllers\WishlistController::class, 'toggle'])->name('wishlist.toggle')->middleware('auth');

require __DIR__.'/auth.php';





// 2. AUTHENTICATION ROUTES (Handled automatically by Breeze)
// ---------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ---------------------------------------------------------
// 3. SHARED DASHBOARD ROUTE
// ---------------------------------------------------------
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        if ($user?->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user?->role === 'instructor') {
            return redirect()->route('instructor.dashboard');
        }

        return redirect()->route('student.dashboard');
    })->name('dashboard');
});

// ---------------------------------------------------------
// 3. STUDENT ROUTES 
// ---------------------------------------------------------
Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-courses', [App\Http\Controllers\Student\CourseController::class, 'index'])->name('courses');
    
    // UPDATE THIS: Make sure it matches the React route() call
    Route::get('/learn/{course}', [App\Http\Controllers\Student\LearningController::class, 'index'])->name('learn');
    
    Route::post('/progress', [App\Http\Controllers\Student\ProgressController::class, 'update'])->name('progress.update');

    // Referral Cash Out
    Route::post('/cash-out', [App\Http\Controllers\Student\CashOutController::class, 'store'])->name('cash-out.store');
});
Route::post('/student/courses/{course}/reviews', [App\Http\Controllers\Student\ReviewController::class, 'store'])
    ->middleware(['auth', 'role:student'])
    ->name('reviews.store');
// 4. INSTRUCTOR ROUTES (Must be logged in AND be an instructor)
Route::middleware(['auth', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Instructor\DashboardController::class, 'index'])->name('dashboard');
    
    // Course Management
    Route::get('/courses', [App\Http\Controllers\Instructor\CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [App\Http\Controllers\Instructor\CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}/edit', [App\Http\Controllers\Instructor\CourseController::class, 'edit'])->name('courses.edit');
    Route::put('/courses/{course}', [App\Http\Controllers\Instructor\CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [App\Http\Controllers\Instructor\CourseController::class, 'destroy'])->name('courses.destroy');
    Route::patch('/courses/{course}/publish', [App\Http\Controllers\Instructor\CourseController::class, 'togglePublish'])->name('courses.publish');
    // Video management
    Route::get('/courses/{course}/videos', [App\Http\Controllers\Instructor\VideoController::class, 'index'])->name('videos.index');
    Route::post('/courses/{course}/videos', [App\Http\Controllers\Instructor\VideoController::class, 'store'])->name('videos.store');
    Route::post('/courses/{course}/videos/{video}', [App\Http\Controllers\Instructor\VideoController::class, 'update'])->name('videos.update');
    Route::delete('/courses/{course}/videos/{video}', [App\Http\Controllers\Instructor\VideoController::class, 'destroy'])->name('videos.destroy');
    Route::delete('/courses/{course}/videos/{video}/materials/{material}', [App\Http\Controllers\Instructor\VideoController::class, 'destroyMaterial'])->name('videos.materials.destroy');
    
    // Students Management
    Route::get('/students', [App\Http\Controllers\Instructor\StudentController::class, 'index'])->name('students');
    
    // Reviews/Comments Management
    Route::get('/reviews', [App\Http\Controllers\Instructor\ReviewController::class, 'index'])->name('reviews');
    Route::delete('/reviews/{review}', [App\Http\Controllers\Instructor\ReviewController::class, 'destroy'])->name('reviews.destroy');
});

// ---------------------------------------------------------
// TEST ROUTES (for debugging) — REMOVED FOR PRODUCTION
// ---------------------------------------------------------
// Route::get('/test-users', ...);     // removed
// Route::get('/test-categories', ...); // removed
// Route::get('/test-courses', ...);    // removed
// Route::get('/test-dashboard', ...);  // removed

// ---------------------------------------------------------
// 5. ADMIN ROUTES
// ---------------------------------------------------------
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/about', [App\Http\Controllers\Admin\AboutController::class, 'index'])->name('about.index');
    Route::post('/about', [App\Http\Controllers\Admin\AboutController::class, 'update'])->name('about.update');
    Route::post('/about/highlights', [App\Http\Controllers\Admin\AboutController::class, 'storeHighlight'])->name('about.highlights.store');
    Route::post('/about/highlights/{highlight}', [App\Http\Controllers\Admin\AboutController::class, 'updateHighlight'])->name('about.highlights.update');
    Route::patch('/about/highlights/{highlight}/toggle', [App\Http\Controllers\Admin\AboutController::class, 'toggleHighlight'])->name('about.highlights.toggle');
    Route::delete('/about/highlights/{highlight}', [App\Http\Controllers\Admin\AboutController::class, 'destroyHighlight'])->name('about.highlights.destroy');
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'changeRole'])->name('users.role');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
    
    Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class)->except(['create', 'edit', 'show']);

    // Advertisement management (admin)
    Route::get('/advertisement', [App\Http\Controllers\Admin\AdvertisementController::class, 'index'])->name('advertisement.index');
    Route::post('/advertisement', [App\Http\Controllers\Admin\AdvertisementController::class, 'store'])->name('advertisement.store');
    Route::delete('/advertisement/{advertisement}', [App\Http\Controllers\Admin\AdvertisementController::class, 'destroy'])->name('advertisement.destroy');
    
    // Course management (admin): list, create, view, edit, publish, delete
    Route::get('/courses', [App\Http\Controllers\Admin\CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [App\Http\Controllers\Admin\CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [App\Http\Controllers\Admin\CourseController::class, 'show'])->name('courses.show');
    Route::post('/courses/{course}', [App\Http\Controllers\Admin\CourseController::class, 'update'])->name('courses.update');
    Route::patch('/courses/{course}/publish', [App\Http\Controllers\Admin\CourseController::class, 'togglePublish'])->name('courses.publish');
    Route::delete('/courses/{course}', [App\Http\Controllers\Admin\CourseController::class, 'destroy'])->name('courses.destroy');

    // Course videos & lesson materials (admin)
    Route::get('/courses/{course}/videos', [App\Http\Controllers\Admin\VideoController::class, 'index'])->name('videos.index');
    Route::post('/courses/{course}/videos', [App\Http\Controllers\Admin\VideoController::class, 'store'])->name('videos.store');
    Route::post('/courses/{course}/videos/{video}', [App\Http\Controllers\Admin\VideoController::class, 'update'])->name('videos.update');
    Route::delete('/courses/{course}/videos/{video}', [App\Http\Controllers\Admin\VideoController::class, 'destroy'])->name('videos.destroy');
    Route::delete('/courses/{course}/videos/{video}/materials/{material}', [App\Http\Controllers\Admin\VideoController::class, 'destroyMaterial'])->name('videos.materials.destroy');

    // Promo codes (free-enrollment coupons per course)
    Route::post('/courses/{course}/promo-codes', [App\Http\Controllers\Admin\PromoCodeController::class, 'store'])->name('promo.store');
    Route::patch('/promo-codes/{promoCode}/toggle', [App\Http\Controllers\Admin\PromoCodeController::class, 'toggle'])->name('promo.toggle');
    Route::delete('/promo-codes/{promoCode}', [App\Http\Controllers\Admin\PromoCodeController::class, 'destroy'])->name('promo.destroy');
    Route::delete('/reviews/{review}', [App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('reviews.destroy');
    
    // Payment Management
    Route::get('/payments', [App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
    // Approve route
    Route::post('/payments/{payment}/approve', [App\Http\Controllers\ManualPaymentController::class, 'approvePayment'])->name('payments.approve');
    // Payment Accounts Settings (Admin only: Bank Name, Book Owner, Book Number, Telebirr Phone & Name)
    Route::get('/payment-settings', [App\Http\Controllers\Admin\PaymentSettingController::class, 'index'])->name('payment-settings.index');
    Route::post('/payment-settings', [App\Http\Controllers\Admin\PaymentSettingController::class, 'update'])->name('payment-settings.update');

    // Seminar & Registration Management
    Route::get('/seminars', [App\Http\Controllers\Admin\SeminarController::class, 'index'])->name('seminars.index');
    Route::post('/seminars', [App\Http\Controllers\Admin\SeminarController::class, 'store'])->name('seminars.store');
    Route::post('/seminars/{seminar}', [App\Http\Controllers\Admin\SeminarController::class, 'update'])->name('seminars.update');
    Route::patch('/seminars/{seminar}/toggle', [App\Http\Controllers\Admin\SeminarController::class, 'togglePublished'])->name('seminars.toggle');
    Route::delete('/seminars/{seminar}', [App\Http\Controllers\Admin\SeminarController::class, 'destroy'])->name('seminars.destroy');
    Route::post('/seminars/registrations/{registration}/approve', [App\Http\Controllers\Admin\SeminarController::class, 'approveRegistration'])->name('seminars.registrations.approve');
    Route::post('/seminars/registrations/{registration}/reject', [App\Http\Controllers\Admin\SeminarController::class, 'rejectRegistration'])->name('seminars.registrations.reject');

    // Sponsor Logos Management (Admin only)
    Route::get('/sponsors', [App\Http\Controllers\Admin\SponsorController::class, 'index'])->name('sponsors.index');
    Route::post('/sponsors', [App\Http\Controllers\Admin\SponsorController::class, 'store'])->name('sponsors.store');
    Route::post('/sponsors/{sponsor}', [App\Http\Controllers\Admin\SponsorController::class, 'update'])->name('sponsors.update');
    Route::patch('/sponsors/{sponsor}/toggle', [App\Http\Controllers\Admin\SponsorController::class, 'toggleActive'])->name('sponsors.toggle');
    Route::delete('/sponsors/{sponsor}', [App\Http\Controllers\Admin\SponsorController::class, 'destroy'])->name('sponsors.destroy');

    // Website chat inbox (Admin only)
    Route::get('/chat', [App\Http\Controllers\Admin\ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/data', [App\Http\Controllers\Admin\ChatController::class, 'data'])->name('chat.data');
    Route::put('/chat/settings', [App\Http\Controllers\Admin\ChatController::class, 'updateSettings'])->name('chat.settings');
    Route::patch('/chat/online', [App\Http\Controllers\Admin\ChatController::class, 'toggleOnline'])->name('chat.online');
    Route::post('/chat/{conversation}/reply', [App\Http\Controllers\Admin\ChatController::class, 'reply'])->name('chat.reply');
    Route::delete('/chat/{conversation}', [App\Http\Controllers\Admin\ChatController::class, 'destroy'])->name('chat.destroy');

    // Instructors
    Route::get('/instructors', [App\Http\Controllers\Admin\InstructorController::class, 'index'])->name('instructors.index');
    Route::post('/instructors', [App\Http\Controllers\Admin\InstructorController::class, 'store'])->name('instructors.store');
    Route::post('/instructors/{user}', [App\Http\Controllers\Admin\InstructorController::class, 'update'])->name('instructors.update');
    Route::patch('/instructors/{user}/toggle', [App\Http\Controllers\Admin\InstructorController::class, 'toggleStatus'])->name('instructors.toggle');
    Route::delete('/instructors/{user}', [App\Http\Controllers\Admin\InstructorController::class, 'destroy'])->name('instructors.destroy');

    // Homepage hero slides
    Route::get('/homepage-slides', [App\Http\Controllers\Admin\HomepageSlideController::class, 'index'])->name('homepage-slides.index');
    Route::post('/homepage-slides', [App\Http\Controllers\Admin\HomepageSlideController::class, 'store'])->name('homepage-slides.store');
    Route::post('/homepage-slides/{slide}', [App\Http\Controllers\Admin\HomepageSlideController::class, 'update'])->name('homepage-slides.update');
    Route::patch('/homepage-slides/{slide}/toggle', [App\Http\Controllers\Admin\HomepageSlideController::class, 'toggle'])->name('homepage-slides.toggle');
    Route::delete('/homepage-slides/{slide}', [App\Http\Controllers\Admin\HomepageSlideController::class, 'destroy'])->name('homepage-slides.destroy');

    // Homepage intro video
    Route::get('/intro', [App\Http\Controllers\Admin\HomepageIntroController::class, 'index'])->name('intro.index');
    Route::post('/intro', [App\Http\Controllers\Admin\HomepageIntroController::class, 'update'])->name('intro.update');
    Route::delete('/intro', [App\Http\Controllers\Admin\HomepageIntroController::class, 'destroy'])->name('intro.destroy');

    // Course reels
    Route::get('/reels', [App\Http\Controllers\Admin\CourseReelController::class, 'index'])->name('reels.index');
    Route::post('/reels', [App\Http\Controllers\Admin\CourseReelController::class, 'store'])->name('reels.store');
    Route::post('/reels/{reel}', [App\Http\Controllers\Admin\CourseReelController::class, 'update'])->name('reels.update');
    Route::patch('/reels/{reel}/toggle', [App\Http\Controllers\Admin\CourseReelController::class, 'toggle'])->name('reels.toggle');
    Route::delete('/reels/{reel}', [App\Http\Controllers\Admin\CourseReelController::class, 'destroy'])->name('reels.destroy');

    // Testimonials
    Route::get('/testimonials', [App\Http\Controllers\Admin\TestimonialController::class, 'index'])->name('testimonials.index');
    Route::put('/testimonials/page', [App\Http\Controllers\Admin\TestimonialController::class, 'updatePage'])->name('testimonials.page');
    Route::post('/testimonials', [App\Http\Controllers\Admin\TestimonialController::class, 'store'])->name('testimonials.store');
    Route::post('/testimonials/{testimonial}', [App\Http\Controllers\Admin\TestimonialController::class, 'update'])->name('testimonials.update');
    Route::patch('/testimonials/{testimonial}/toggle', [App\Http\Controllers\Admin\TestimonialController::class, 'toggle'])->name('testimonials.toggle');
    Route::delete('/testimonials/{testimonial}', [App\Http\Controllers\Admin\TestimonialController::class, 'destroy'])->name('testimonials.destroy');

    // Interviews
    Route::get('/interviews', [App\Http\Controllers\Admin\InterviewController::class, 'index'])->name('interviews.index');
    Route::put('/interviews/page', [App\Http\Controllers\Admin\InterviewController::class, 'updatePage'])->name('interviews.page');
    Route::post('/interviews', [App\Http\Controllers\Admin\InterviewController::class, 'store'])->name('interviews.store');
    Route::post('/interviews/{interview}', [App\Http\Controllers\Admin\InterviewController::class, 'update'])->name('interviews.update');
    Route::patch('/interviews/{interview}/toggle', [App\Http\Controllers\Admin\InterviewController::class, 'toggle'])->name('interviews.toggle');
    Route::delete('/interviews/{interview}', [App\Http\Controllers\Admin\InterviewController::class, 'destroy'])->name('interviews.destroy');

    // Mobile app downloads
    Route::get('/apps', [App\Http\Controllers\Admin\AppDownloadController::class, 'index'])->name('apps.index');
    Route::post('/apps', [App\Http\Controllers\Admin\AppDownloadController::class, 'update'])->name('apps.update');
    // Certificate signature (Admin only)
Route::get('/certificate-settings', [App\Http\Controllers\Admin\CertificateSettingController::class, 'index'])->name('certificate-settings.index');
Route::post('/certificate-settings', [App\Http\Controllers\Admin\CertificateSettingController::class, 'update'])->name('certificate-settings.update');
Route::delete('/certificate-settings/signature', [App\Http\Controllers\Admin\CertificateSettingController::class, 'destroySignature'])->name('certificate-settings.signature.destroy');

// Homepage enrollment announcement banner (Admin only)
    Route::get('/announcement', [App\Http\Controllers\Admin\AnnouncementController::class, 'index'])->name('announcement.index');
    Route::put('/announcement', [App\Http\Controllers\Admin\AnnouncementController::class, 'update'])->name('announcement.update');

    // Referral Program & Student Cash Outs (Admin only)
    Route::get('/referrals', [App\Http\Controllers\Admin\ReferralController::class, 'index'])->name('referrals.index');
    Route::post('/referrals/settings', [App\Http\Controllers\Admin\ReferralController::class, 'updateSettings'])->name('referrals.settings.update');
    Route::post('/referrals/cash-outs/{cashOut}/approve', [App\Http\Controllers\Admin\ReferralController::class, 'approveCashOut'])->name('referrals.cash-outs.approve');
    Route::post('/referrals/cash-outs/{cashOut}/reject', [App\Http\Controllers\Admin\ReferralController::class, 'rejectCashOut'])->name('referrals.cash-outs.reject');
});
// ---------------------------------------------------------
// 6. SECURE VIDEO STREAM ROUTE
// Must be inside auth middleware so session is available for cookie-based auth
// ---------------------------------------------------------
Route::get('/materials/{material}/download', [App\Http\Controllers\VideoMaterialController::class, 'download'])
    ->middleware('auth')
    ->name('materials.download');

Route::get('/stream/{video}', [App\Http\Controllers\VideoStreamController::class, 'stream'])
    ->middleware('auth')
    ->name('video.stream');

// ---------------------------------------------------------
// 7. ANDROID APP DOWNLOAD ROUTE
// ---------------------------------------------------------
Route::get('/apps/download/{platform}', \App\Http\Controllers\AppFileDownloadController::class)
    ->whereIn('platform', ['android', 'ios'])
    ->name('apps.download');

// Legacy fixed-path APK (used only if a file exists in public/downloads)
Route::get('/apps/download/android', function () {
    $primary = public_path('downloads/SuccessLifeCoachingAcademy.apk');
    $fallback = public_path('downloads/SuccessLifeCoachingAcademy.apk');
    $apkPath = file_exists($primary) ? $primary : $fallback;
    if (file_exists($apkPath)) {
        return response()->download($apkPath, 'SuccessLifeCoachingAcademy.apk', [
            'Content-Type' => 'application/vnd.android.package-archive',
        ]);
    }
    return redirect()->route('register');
})->name('apps.download.android');

