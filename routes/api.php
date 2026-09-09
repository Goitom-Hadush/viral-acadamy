<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Course;

// ─── Public routes (no token needed) ──────────────────────────────────────────

// GET /api/courses/public — published courses list for landing page
Route::get('/courses/public', function () {
    $courses = Course::where('status', 'published')
        ->with(['instructor:id,name', 'category:id,name'])
        ->withCount('videos')
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->orderByDesc('created_at')
        ->get()
        ->map(fn ($c) => [
            'id'            => $c->id,
            'title'         => $c->title,
            'description'   => $c->description,
            'price'         => $c->price,
            'thumbnail'     => $c->thumbnail,
            'category'      => $c->category,
            'instructor'    => $c->instructor,
            'videos_count'  => $c->videos_count,
            'rating'        => $c->reviews_avg_rating,
            'reviews_count' => $c->reviews_count,
            'is_purchased'  => false,
        ]);

    return response()->json(['data' => $courses]);
});

// ─── Public: Auth ─────────────────────────────────────────────────────────────

// POST /api/login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|string',
        'password' => 'required|string',
    ]);

    // Support login by email OR phone
    $field = filter_var($request->email, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
    $user  = User::where($field, $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The credentials you entered are incorrect.'],
        ]);
    }

    try {
        // Revoke old mobile tokens to keep things clean
        $user->tokens()->where('name', 'mobile')->delete();
        $token = $user->createToken('mobile')->plainTextToken;
    } catch (\Exception $e) {
        // personal_access_tokens table may not exist yet — run: php artisan migrate --force
        return response()->json([
            'message' => 'Token creation failed. Please run database migrations on the server: php artisan migrate --force',
        ], 500);
    }

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role'  => $user->role,
        ],
    ]);
});

// POST /api/register
Route::post('/register', function (Request $request) {
    $request->validate([
        'name'                  => 'required|string|max:255',
        'email'                 => 'nullable|email|max:255|unique:users,email',
        'phone'                 => 'required|string|max:30|unique:users,phone',
        'password'              => 'required|string|min:8|confirmed',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $request->email ?? null,
        'phone'    => $request->phone,
        'password' => Hash::make($request->password),
        'role'     => 'student',
        'status'   => 'active',
    ]);

    try {
        $token = $user->createToken('mobile')->plainTextToken;
    } catch (\Exception $e) {
        $user->delete(); // rollback user creation
        return response()->json([
            'message' => 'Token creation failed. Please run: php artisan migrate --force on the server.',
        ], 500);
    }

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role'  => $user->role,
        ],
    ], 201);
});

// ─── Protected: Require Sanctum token ─────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // POST /api/logout
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    });

    // GET /api/user  — returns current authenticated user
    Route::get('/user', function (Request $request) {
        return response()->json(['data' => $request->user()]);
    });

    // ── Courses ────────────────────────────────────────────────────────────────

    // GET /api/courses  — all published courses
    Route::get('/courses', function (Request $request) {
        $courses = Course::where('status', 'published')
            ->with(['instructor:id,name', 'category:id,name'])
            ->withCount('videos')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (Course $c) use ($request) {
                $isPurchased = $request->user()
                    ->purchasedCourses()
                    ->where('courses.id', $c->id)
                    ->exists();
                return array_merge($c->toArray(), [
                    'videos_count'   => $c->videos_count,
                    'rating'         => $c->reviews_avg_rating,
                    'reviews_count'  => $c->reviews_count,
                    'is_purchased'   => $isPurchased,
                ]);
            });

        return response()->json(['data' => $courses]);
    });

    // GET /api/courses/{id}  — single course with lessons list
    Route::get('/courses/{course}', function (Request $request, Course $course) {
        if ($course->status !== 'published') {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        $course->load(['instructor:id,name', 'category:id,name']);
        $course->loadCount(['videos', 'reviews']);
        $course->loadAvg('reviews', 'rating');

        $isPurchased = $request->user()
            ->purchasedCourses()
            ->where('courses.id', $course->id)
            ->exists();

        // Only expose lesson video URLs to enrolled students
        $lessons = $course->videos()
            ->orderBy('sequence')
            ->get()
            ->map(function ($video) use ($isPurchased) {
                return [
                    'id'             => (string) $video->id,
                    'title'          => $video->title,
                    'courseTitle'    => $video->course?->title ?? '',
                    'remoteUrl'      => $isPurchased
                        ? url("/stream/{$video->id}")
                        : null,
                    'duration'       => $video->duration ?? null,
                    'sort_order'     => $video->sequence ?? 0,
                    'isDownloaded'   => false,
                    'progressSeconds'=> 0,
                ];
            });

        return response()->json([
            'data' => array_merge($course->toArray(), [
                'videos_count'   => $course->videos_count,
                'rating'         => $course->reviews_avg_rating,
                'reviews_count'  => $course->reviews_count,
                'is_purchased'   => $isPurchased,
                'lessons'        => $lessons,
            ]),
        ]);
    });

    // GET /api/student/courses  — enrolled courses for the current user
    Route::get('/student/courses', function (Request $request) {
        $courses = $request->user()
            ->purchasedCourses()
            ->with(['instructor:id,name', 'category:id,name'])
            ->withCount('videos')
            ->get()
            ->map(fn ($c) => array_merge($c->toArray(), [
                'is_purchased' => true,
            ]));

        return response()->json(['data' => $courses]);
    });

    // POST /api/courses/{id}/enroll  — free enroll (paid handled via web)
    Route::post('/courses/{course}/enroll', function (Request $request, Course $course) {
        if ($course->status !== 'published') {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        $user = $request->user();

        $alreadyEnrolled = $user->purchasedCourses()
            ->where('courses.id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json(['message' => 'Already enrolled.'], 409);
        }

        if ((float) $course->price > 0) {
            // Create a pending purchase so the user can pay via web
            $existing = \App\Models\Purchase::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();

            if (! $existing) {
                \App\Models\Purchase::create([
                    'user_id'   => $user->id,
                    'course_id' => $course->id,
                    'amount'    => $course->price,
                    'status'    => 'pending',
                ]);
            }

            return response()->json([
                'message'      => 'Payment required. Please complete payment in your browser.',
                'payment_url'  => url("/buy/{$course->id}"),
                'price'        => $course->price,
                'requires_payment' => true,
            ], 402);
        }

        // Free course — create a paid purchase record
        \App\Models\Purchase::create([
            'user_id'   => $user->id,
            'course_id' => $course->id,
            'amount'    => 0,
            'status'    => 'paid',
        ]);

        return response()->json(['message' => 'Enrolled successfully.']);
    });

    // POST /api/progress  — sync offline progress updates
    Route::post('/progress', function (Request $request) {
        $request->validate([
            'updates'                    => 'required|array',
            'updates.*.lessonId'         => 'required|string',
            'updates.*.progressSeconds'  => 'required|integer|min:0',
            'updates.*.completed'        => 'required|boolean',
        ]);

        $user = $request->user();

        foreach ($request->updates as $update) {
            $video = \App\Models\Video::find($update['lessonId']);
            if (! $video) continue;

            \App\Models\VideoProgress::updateOrCreate(
                ['user_id' => $user->id, 'video_id' => $video->id],
                [
                    'watched_seconds' => $update['progressSeconds'],
                    'completed'       => $update['completed'],
                ]
            );
        }

        return response()->json(['message' => 'Progress synced.']);
    });
});
