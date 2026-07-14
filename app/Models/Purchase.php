<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'course_id', 'amount', 'status'];

    // A purchase belongs to a student
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A purchase belongs to a course
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}