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

// Robots.txt
Route::get('/robots.txt', function () {
    return response()->view('robots', [], 200)->header('Content-Type', 'text/plain');
})->name('robots.txt');

// Sitemap.xml
Route::get('/sitemap.xml', function () {
    $courses = Course::where('status', 'published')->get();
    return response()->view('sitemap', ['courses' => $courses], 200)->header('Content-Type', 'application/xml');
})->name('sitemap.xml');

// ---------------------------------------------------------
// 1. PUBLIC ROUTES (No login required)
// ---------------------------------------------------------
Route::get('/', function () {
    // Only fetch courses that are published, and grab the instructor info + video count
    $courses = Course::where('status', 'published')
                     ->with('instructor')
                     ->withCount('videos')
                     ->orderBy('created_at', 'desc')
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

    return Inertia::render('Welcome', [
        'courses' => $courses,
        'advertisement' => $advertisement,
    ]);
})->name('home');

Route::get('/courses/{course}', [App\Http\Controllers\CourseViewController::class, 'show'])->name('courses.show');

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
// 3. STUDENT ROUTES 
// ---------------------------------------------------------
Route::middleware(['auth', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-courses', [App\Http\Controllers\Student\CourseController::class, 'index'])->name('courses');
    
    // UPDATE THIS: Make sure it matches the React route() call
    Route::get('/learn/{course}', [App\Http\Controllers\Student\LearningController::class, 'index'])->name('learn');
    
    Route::post('/progress', [App\Http\Controllers\Student\ProgressController::class, 'update'])->name('progress.update');

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
    Route::patch('/courses/{course}/publish', [App\Http\Controllers\Instructor\CourseController::class, 'togglePublish'])->name('courses.publish');
    // Video upload route (we build this next)
    Route::post('/courses/{course}/videos', [App\Http\Controllers\Instructor\VideoController::class, 'store'])->name('videos.store');
    
    // Students Management
    Route::get('/students', [App\Http\Controllers\Instructor\StudentController::class, 'index'])->name('students');
    
    // Reviews/Comments Management
    Route::get('/reviews', [App\Http\Controllers\Instructor\ReviewController::class, 'index'])->name('reviews');
    Route::delete('/reviews/{review}', [App\Http\Controllers\Instructor\ReviewController::class, 'destroy'])->name('reviews.destroy');
});

// ---------------------------------------------------------
// TEST ROUTES (for debugging)
// ---------------------------------------------------------
Route::get('/test-users', function () {
    $users = \App\Models\User::orderBy('created_at', 'desc')->get();
    return response()->json(['users' => $users, 'count' => count($users)]);
});

Route::get('/test-categories', function () {
    $categories = \App\Models\Category::orderBy('name', 'asc')->get();
    return response()->json(['categories' => $categories, 'count' => count($categories)]);
});

Route::get('/test-courses', function () {
    $courses = \App\Models\Course::with(['instructor', 'category'])->withCount('videos')->orderBy('created_at', 'desc')->get();
    return response()->json(['courses' => $courses, 'count' => count($courses)]);
});

Route::get('/test-dashboard', function () {
    $totalStudents = \App\Models\User::where('role', 'student')->count();
    $totalCourses = \App\Models\Course::count();
    $totalRevenue = \App\Models\Payment::where('status', 'success')->sum('amount');
    $averagePrice = \App\Models\Course::avg('price') ?? 0;
    
    $courses = \App\Models\Course::withCount(['purchases as students_count' => function ($query) {
                $query->where('status', 'paid');
            }])
            ->withSum(['payments as revenue' => function ($query) {
                $query->where('status', 'success');
            }], 'amount')
            ->get(['id', 'title', 'price', 'thumbnail'])
            ->sortByDesc('students_count')
            ->take(10)
            ->values()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'price' => $course->price,
                    'thumbnail' => $course->thumbnail,
                    'students_count' => $course->students_count,
                    'revenue' => $course->revenue ?? 0,
                ];
            });

    $recentPayments = \App\Models\Payment::with(['user:id,name,email', 'course:id,title'])
        ->where('status', 'success')
        ->latest()
        ->take(8)
        ->get()
        ->map(function ($payment) {
            return [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'student_name' => $payment->user->name ?? 'Unknown',
                'course_title' => $payment->course->title ?? 'Unknown',
                'created_at' => $payment->created_at->diffForHumans(),
            ];
        });

    return response()->json([
        'stats' => [
            'students' => $totalStudents,
            'courses' => $totalCourses,
            'revenue' => $totalRevenue,
            'average_price' => round($averagePrice, 2),
        ],
        'courses' => $courses,
        'recentPayments' => $recentPayments,
    ]);
});

// ---------------------------------------------------------
// 5. ADMIN ROUTES
// ---------------------------------------------------------
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [App\Http\Controllers\Admin\UserController::class, 'changeRole'])->name('users.role');
    
    Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class)->except(['create', 'edit', 'show', 'update']);

    // Advertisement management (admin)
    Route::get('/advertisement', [App\Http\Controllers\Admin\AdvertisementController::class, 'index'])->name('advertisement.index');
    Route::post('/advertisement', [App\Http\Controllers\Admin\AdvertisementController::class, 'store'])->name('advertisement.store');
    Route::delete('/advertisement/{advertisement}', [App\Http\Controllers\Admin\AdvertisementController::class, 'destroy'])->name('advertisement.destroy');
    
    Route::get('/courses', [App\Http\Controllers\Admin\CourseController::class, 'index'])->name('courses.index');
    Route::delete('/courses/{course}', [App\Http\Controllers\Admin\CourseController::class, 'destroy'])->name('courses.destroy');
    Route::delete('/videos/{video}', [App\Http\Controllers\Admin\VideoController::class, 'destroy'])->name('videos.destroy');
    Route::delete('/reviews/{review}', [App\Http\Controllers\Admin\ReviewController::class, 'destroy'])->name('reviews.destroy');
    
    // Payment Management
    Route::get('/payments', [App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
    // Approve route
    Route::post('/payments/{payment}/approve', [App\Http\Controllers\ManualPaymentController::class, 'approvePayment'])->name('payments.approve');
});
// ---------------------------------------------------------
// 6. SECURE VIDEO STREAM ROUTE
// Used by the React Video Player (Must be logged in, role checked inside controller)
// ---------------------------------------------------------
Route::get('/stream/{video}', [App\Http\Controllers\VideoStreamController::class, 'stream'])
    ->name('video.stream');
