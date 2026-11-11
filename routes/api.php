<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Course;
use App\Support\Phone;
use App\Support\Media;

// ─── Public routes (no token needed) ──────────────────────────────────────────

// GET /api/courses/public — published courses list for landing page
Route::get('/courses/public', function () {
    $courses = Course::where('status', 'published')
        ->with(['instructor:id,name,email,phone,avatar,social_media', 'category:id,name'])
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
            'thumbnail'     => Media::thumbnailUrl($c->thumbnail),
            'category'      => $c->category,
            'instructor'    => $c->instructor,
            'videos_count'  => $c->videos_count,
            'rating'        => $c->reviews_avg_rating,
            'reviews_count' => $c->reviews_count,
            'is_purchased'  => false,
        ]);

    return response()->json(['data' => $courses]);
});

// ─── Public content (mirrors website pages for the mobile app) ────────────────
Route::get('/content/home', [App\Http\Controllers\Api\ContentController::class, 'home']);
Route::get('/content/reels', [App\Http\Controllers\Api\ContentController::class, 'reels']);
Route::get('/content/testimonials', [App\Http\Controllers\Api\ContentController::class, 'testimonials']);
Route::get('/content/interviews', [App\Http\Controllers\Api\ContentController::class, 'interviews']);
Route::get('/content/about', [App\Http\Controllers\Api\ContentController::class, 'about']);
Route::get('/content/promo', [App\Http\Controllers\Api\ContentController::class, 'promo']);

// ─── Public: Auth ─────────────────────────────────────────────────────────────

// POST /api/login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email'    => 'required|string',
        'password' => 'required|string',
    ], [
        'email.required' => 'Please enter your email or phone number.',
        'password.required' => 'Please enter your password.',
    ]);

    $login = trim((string) $request->email);
    $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
    $value = $field === 'email' ? strtolower($login) : Phone::normalize($login);
    $user  = User::where($field, $value)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => [__('auth.failed')],
        ]);
    }

    if (($user->status ?? 'active') !== 'active') {
        throw ValidationException::withMessages([
            'email' => [__('auth.inactive')],
        ]);
    }

    try {
        $user->tokens()->where('name', 'mobile')->delete();
        $token = $user->createToken('mobile')->plainTextToken;
    } catch (\Exception $e) {
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
    $email = $request->input('email');
    $email = is_string($email) && trim($email) !== '' ? strtolower(trim($email)) : null;
    $phone = Phone::normalize($request->input('phone'));

    $request->merge([
        'email' => $email,
        'phone' => $phone,
    ]);

    $request->validate([
        'name'                  => 'required|string|max:255',
        'email'                 => 'nullable|email|max:255|unique:users,email',
        'phone'                 => 'required|string|min:9|max:20|unique:users,phone',
        'password'              => 'required|string|min:8|confirmed',
    ], [
        'name.required' => 'Please enter your full name.',
        'phone.required' => 'Please enter your phone number.',
        'phone.min' => 'Please enter a valid phone number.',
        'phone.unique' => 'This phone number is already registered.',
        'email.email' => 'Please enter a valid email address.',
        'email.unique' => 'This email is already registered.',
        'password.required' => 'Please enter your password.',
        'password.min' => 'Password must be at least 8 characters.',
        'password.confirmed' => 'Passwords do not match.',
    ]);

    $user = User::create([
        'name'     => $request->name,
        'email'    => $email,
        'phone'    => $phone,
        'password' => $request->password,
        'role'     => 'student',
        'status'   => 'active',
        // Same as the website register (RegisteredUserController)
        'referral_code' => User::generateUniqueReferralCode(),
    ]);

    try {
        $token = $user->createToken('mobile')->plainTextToken;
    } catch (\Exception $e) {
        $user->delete();
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

// GET /api/payment-info — the same admin-managed accounts the website shows in
// its menu, footer and course pages (Admin → Payment Settings).
Route::get('/payment-info', function () {
    $s = \App\Models\PaymentSetting::getSettings();

    return response()->json([
        'accounts' => [
            [
                'bank'           => $s->bank_name,
                'account_number' => $s->bank_account_number,
                'account_name'   => $s->bank_account_name,
                'currency'       => 'ETB',
                'audience'       => 'local',
            ],
            [
                'bank'           => 'Telebirr',
                'account_number' => $s->telebirr_phone,
                'account_name'   => $s->telebirr_name,
                'currency'       => 'ETB',
                'audience'       => 'local',
            ],
            ...($s->dollar_account_number ? [[
                'bank'           => $s->dollar_bank_name,
                'account_number' => $s->dollar_account_number,
                'account_name'   => $s->dollar_account_name,
                'currency'       => 'USD',
                'audience'       => 'diaspora',
            ]] : []),
        ],
        'instructions' => $s->instructions
            ?: 'Transfer the exact course amount to one of the accounts above, then upload your receipt photo below.',
    ]);
});

// ─── Public courses (like the website: guests can browse) ─────────────────────
// A Sanctum bearer token is optional. When present, `is_purchased` and lesson
// stream URLs reflect that student; guests always get is_purchased=false and
// no stream URLs.

// GET /api/courses  — all published courses
Route::get('/courses', function (Request $request) {
    $user = $request->user('sanctum');
    $purchasedIds = $user
        ? $user->purchasedCourses()->pluck('courses.id')->all()
        : [];

    $courses = Course::where('status', 'published')
        ->with(['instructor:id,name,email,phone,avatar,social_media', 'category:id,name'])
        ->withCount('videos')
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->orderByDesc('created_at')
        ->get()
        ->map(fn (Course $c) => array_merge($c->toArray(), [
            'thumbnail'      => Media::thumbnailUrl($c->thumbnail),
            'videos_count'   => $c->videos_count,
            'rating'         => $c->reviews_avg_rating,
            'reviews_count'  => $c->reviews_count,
            'is_purchased'   => in_array($c->id, $purchasedIds, true),
        ]));

    return response()->json(['data' => $courses]);
});

// GET /api/courses/{id}  — single course with lessons list
Route::get('/courses/{course}', function (Request $request, Course $course) {
    if ($course->status !== 'published') {
        return response()->json(['message' => 'Course not found.'], 404);
    }

    $user = $request->user('sanctum');

    $course->load(['instructor:id,name,email,phone,avatar,social_media', 'category:id,name']);
    $course->loadCount(['videos', 'reviews']);
    $course->loadAvg('reviews', 'rating');

    $isPurchased = $user
        ? $user->purchasedCourses()->where('courses.id', $course->id)->exists()
        : false;

    $hasPendingPayment = $user && ! $isPurchased
        ? \App\Models\Payment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'pending')
            ->exists()
        : false;

    // Only expose lesson video URLs to enrolled students
    $progressByVideo = $user
        ? $user->videoProgress()
            ->whereHas('video', fn ($query) => $query->where('course_id', $course->id))
            ->get()
            ->keyBy('video_id')
        : collect();

    $lessons = $course->videos()
        ->with('materials')
        ->orderBy('sequence')
        ->get()
        ->map(function ($video) use ($isPurchased, $progressByVideo, $course) {
            $progress = $progressByVideo->get($video->id);
            $watchedSeconds = $progress?->watched_seconds ?? 0;
            $isCompleted = (bool) ($progress?->completed)
                || ($video->duration && $watchedSeconds >= ceil($video->duration * 0.9));

            return [
                'id'             => (string) $video->id,
                'title'          => $video->title,
                'courseTitle'    => $course->title,
                'remoteUrl'      => $isPurchased
                    ? url("/api/videos/{$video->id}/stream")
                    : null,
                'duration'       => $video->duration ?? null,
                'sort_order'     => $video->sequence ?? 0,
                'isDownloaded'   => false,
                'progressSeconds'=> $watchedSeconds,
                'isCompleted'    => $isCompleted,
                'materials'      => $isPurchased
                    ? $video->materials->map(fn ($material) => [
                        'id'   => (string) $material->id,
                        'name' => $material->original_name,
                        'size' => $material->file_size,
                        'url'  => url("/api/video-materials/{$material->id}/download"),
                    ])->values()
                    : [],
            ];
        });

    return response()->json([
        'data' => array_merge($course->toArray(), [
            'thumbnail'           => Media::thumbnailUrl($course->thumbnail),
            'videos_count'        => $course->videos_count,
            'rating'              => $course->reviews_avg_rating,
            'reviews_count'       => $course->reviews_count,
            'is_purchased'        => $isPurchased,
            'has_pending_payment' => $hasPendingPayment,
            'lessons'             => $lessons,
        ]),
    ]);
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

    // Authenticated native-app stream. The Flutter video player sends its
    // Sanctum bearer token in the Authorization header.
    Route::get('/videos/{video}/stream', [App\Http\Controllers\VideoStreamController::class, 'stream']);
    Route::get('/video-materials/{material}/download', [App\Http\Controllers\VideoMaterialController::class, 'download']);

    // (GET /api/courses and /api/courses/{course} are public — see above.)

    // GET /api/student/courses  — enrolled courses for the current user
    Route::get('/student/courses', function (Request $request) {
        $courses = $request->user()
            ->purchasedCourses()
            ->with(['instructor:id,name,email,phone,avatar,social_media', 'category:id,name'])
            ->withCount('videos')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->get()
            ->map(fn ($c) => array_merge($c->toArray(), [
                'thumbnail'     => Media::thumbnailUrl($c->thumbnail),
                'is_purchased'  => true,
                'videos_count'  => $c->videos_count,
                'rating'        => $c->reviews_avg_rating,
                'reviews_count' => $c->reviews_count,
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

    // ── Payment (Manual Receipt Upload) ───────────────────────────────────────

    // (GET /api/payment-info is public — see above.)

    // POST /api/courses/{id}/pay — upload receipt image (multipart/form-data)
    Route::post('/courses/{course}/pay', function (Request $request, Course $course) {
        $request->validate([
            'receipt' => 'required|file|mimes:jpeg,png,jpg|max:4096',
        ]);

        $user = $request->user();

        // Prevent duplicate pending payments
        $existing = \App\Models\Payment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->whereIn('status', ['pending', 'success'])
            ->first();

        if ($existing && $existing->status === 'success') {
            return response()->json(['message' => 'Already enrolled.'], 409);
        }

        $filePath = $request->file('receipt')->store('receipts', 'public');

        $payment = \App\Models\Payment::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            [
                'transaction_id' => 'MOBILE_' . \Illuminate\Support\Str::uuid(),
                'amount'         => $course->price,
                'payment_method' => 'manual_transfer',
                'status'         => 'pending',
                'receipt_image'  => $filePath,
            ]
        );

        return response()->json([
            'message'    => 'Receipt uploaded. Waiting for admin verification.',
            'payment_id' => $payment->id,
            'status'     => 'pending',
        ]);
    });

    // GET /api/courses/{id}/payment-status — poll for approval
    Route::get('/courses/{course}/payment-status', function (Request $request, Course $course) {
        $user    = $request->user();
        $payment = \App\Models\Payment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->latest()
            ->first();

        if (! $payment) {
            return response()->json(['status' => 'none']);
        }

        $isEnrolled = $user->purchasedCourses()
            ->where('courses.id', $course->id)
            ->exists();

        return response()->json([
            'status'      => $payment->status, // pending | success | failed
            'is_enrolled' => $isEnrolled,
        ]);
    });
});

// ─── Seminars (mobile app) ────────────────────────────────────────────────────

$seminarToArray = function (\App\Models\Seminar $s): array {
    return [
        'id'               => $s->id,
        'title'            => $s->title,
        'tagline'          => $s->tagline,
        'description'      => $s->description,
        'image'            => $s->image_path ? Media::publicUrl($s->image_path) : null,
        'badge'            => $s->badge,
        'speaker_name'     => $s->speaker_name,
        'speaker_title'    => $s->speaker_title,
        'speaker_initials' => $s->speaker_initials,
        'online_link'      => $s->online_link,
        'topics'           => array_values(array_filter((array) (json_decode((string) $s->topics_json, true) ?: []), 'is_string')),
        'date_string'      => $s->date_string,
        'time_string'      => $s->time_string,
        'location_type'    => $s->location_type,
        'venue_name'       => $s->venue_name,
        'venue_city'       => $s->venue_city,
        'price_label'      => $s->price_label,
        'entrance_fee'     => (float) $s->entrance_fee,
        'capacity'         => (int) $s->capacity,
        'registered_count' => (int) $s->registered_count,
    ];
};

// GET /api/seminars — published seminars
Route::get('/seminars', function () use ($seminarToArray) {
    $seminars = \App\Models\Seminar::published()->ordered()->get()->map($seminarToArray);

    return response()->json(['data' => $seminars]);
});

// GET /api/seminars/{seminar}
Route::get('/seminars/{seminar}', function (\App\Models\Seminar $seminar) use ($seminarToArray) {
    if (! $seminar->is_published) {
        return response()->json(['message' => 'Seminar not found.'], 404);
    }

    return response()->json(['data' => $seminarToArray($seminar)]);
});

// POST /api/seminars/{seminar}/register — reserve a seat for the logged-in user.
// Mirrors PublicPageController::registerSeminar (paid seminars stay pending until an admin approves).
Route::middleware('auth:sanctum')->post('/seminars/{seminar}/register', function (Request $request, \App\Models\Seminar $seminar) {
    if (! $seminar->is_published) {
        return response()->json(['message' => 'Seminar not found.'], 404);
    }

    $user = $request->user();

    $alreadyRegistered = \App\Models\SeminarRegistration::where('seminar_id', (string) $seminar->id)
        ->where('attendee_phone', $user->phone)
        ->whereIn('status', ['pending_approval', 'approved'])
        ->exists();

    if ($alreadyRegistered) {
        return response()->json(['message' => 'You are already registered for this seminar.'], 409);
    }

    if ($seminar->capacity > 0 && $seminar->registered_count >= $seminar->capacity) {
        return response()->json(['message' => 'This seminar is fully booked.'], 422);
    }

    $status = (float) $seminar->entrance_fee > 0 ? 'pending_approval' : 'approved';
    $code = 'SLC-SEM-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

    \App\Models\SeminarRegistration::create([
        'registration_code' => $code,
        'seminar_id'        => (string) $seminar->id,
        'seminar_title'     => $seminar->title,
        'attendee_name'     => $user->name,
        'attendee_phone'    => $user->phone,
        'attendee_email'    => $user->email,
        'ticket_tier'       => 'Standard Delegate Pass',
        'amount_paid'       => $seminar->entrance_fee ?? 0,
        'status'            => $status,
    ]);

    if ($status === 'approved') {
        $seminar->increment('registered_count');
    }

    return response()->json([
        'message' => $status === 'approved'
            ? 'Your seminar seat has been reserved.'
            : 'Registration received. Please pay the entrance fee; an admin will approve your seat.',
        'registration_code' => $code,
        'status'            => $status,
    ], 201);
});
