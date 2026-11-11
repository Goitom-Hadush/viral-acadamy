<?php

namespace App\Http\Controllers;

use App\Models\CertificateSetting;
use App\Models\Course;
use App\Models\CourseCertificate;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    /**
     * Display the official verifiable certificate.
     */
    public function show(string $certificateNumber): Response
    {
        $certificate = CourseCertificate::where('certificate_number', $certificateNumber)
            ->with(['course', 'user'])
            ->firstOrFail();

        $verificationUrl = route('certificates.verify', $certificate->certificate_number);

        return Inertia::render('Certificate/Show', [
            'certificate' => $certificate,
            'verificationUrl' => $verificationUrl,
            'signature' => CertificateSetting::forDisplay(),
        ]);
    }

    /**
     * Public credential verification page (scanned by QR code or visited via verification URL).
     */
    public function verify(string $certificateNumber): Response
    {
        $certificate = CourseCertificate::where('certificate_number', $certificateNumber)
            ->with(['course', 'user'])
            ->first();

        return Inertia::render('Certificate/Verify', [
            'certificate' => $certificate,
            'queryNumber' => $certificateNumber,
            'isValid' => $certificate ? (bool)$certificate->is_valid : false,
        ]);
    }

    /**
     * Claim / generate completion certificate for a student who finished a course.
     */
    public function claim(Request $request, Course $course)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Verify purchase or admin privilege
        $hasPurchased = Purchase::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'paid')
            ->exists();

        if (!$hasPurchased && $user->role !== 'admin' && $user->role !== 'instructor') {
            return redirect()->route('courses.show', $course->id)
                ->with('error', 'You must be enrolled in this course to claim its completion certificate.');
        }

        $course->load(['instructor', 'category']);

        $certificate = CourseCertificate::firstOrCreate(
            [
                'user_id' => $user->id,
                'course_id' => $course->id,
            ],
            [
                'certificate_number' => CourseCertificate::generateCertificateNumber(),
                'student_name' => $user->name,
                'student_email' => $user->email,
                'course_title' => $course->title,
                'instructor_name' => $course->instructor ? $course->instructor->name : 'Coach Tewelde Mebrahtu',
                'category_name' => $course->category ? $course->category->name : 'Leadership & Personal Development',
                'completion_date' => now()->toDateString(),
                'hours_completed' => max(12, ($course->videos()->count() * 2)),
                'grade_score' => 'Distinction â€¢ 100% Completion',
                'verification_hash' => hash('sha256', $user->id . '-' . $course->id . '-' . config('app.key')),
                'is_valid' => true,
            ]
        );

        return redirect()->route('certificates.show', $certificate->certificate_number)
            ->with('success', 'Congratulations on completing your course! Your certificate has been issued.');
    }

    /**
     * Sample preview certificate for demonstration.
     */
    public function sample(): Response
    {
        $sample = CourseCertificate::first();

        if (!$sample) {
            $sample = new CourseCertificate([
                'id' => 1,
                'certificate_number' => 'SLC-2026-PREVIEW',
                'student_name' => 'Dawit Kebede',
                'student_email' => 'dawit@successlifecoaching.com',
                'course_title' => 'Mindset Mastery & Executive Leadership Masterclass',
                'instructor_name' => 'Coach Tewelde Mebrahtu',
                'category_name' => 'Mindset & Personal Transformation',
                'completion_date' => now()->toDateString(),
                'hours_completed' => 24,
                'grade_score' => 'Distinction â€¢ 100% Completion',
                'verification_hash' => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                'is_valid' => true,
            ]);
        }

        $verificationUrl = route('certificates.verify', $sample->certificate_number);

        return Inertia::render('Certificate/Show', [
            'certificate' => $sample,
            'verificationUrl' => $verificationUrl,
            'isSample' => true,
            'signature' => CertificateSetting::forDisplay(),
        ]);
    }
}
