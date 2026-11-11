<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CourseCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'certificate_number',
        'student_name',
        'student_email',
        'course_title',
        'instructor_name',
        'category_name',
        'completion_date',
        'hours_completed',
        'grade_score',
        'verification_hash',
        'is_valid',
    ];

    protected $casts = [
        'completion_date' => 'date',
        'is_valid' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public static function generateCertificateNumber(): string
    {
        do {
            $num = 'SLC-' . date('Y') . '-' . strtoupper(Str::random(6));
        } while (self::where('certificate_number', $num)->exists());

        return $num;
    }
}
