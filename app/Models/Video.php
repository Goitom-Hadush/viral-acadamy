<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'video_path',
        'duration',
        'sequence',
    ];

    // RELATIONSHIP 1: A video belongs to ONE Course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // RELATIONSHIP 2: A video will have MANY progress records (One for each student who watches it)
    public function progress()
    {
        return $this->hasMany(VideoProgress::class);
    }
}