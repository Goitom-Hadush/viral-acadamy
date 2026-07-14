<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'status',
    ];

    /**
     * The attributes that should be hidden.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casting
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // Tell Laravel: "One User (Instructor) HAS MANY Courses"
public function courses()
{
    return $this->hasMany(Course::class, 'instructor_id');
}
// Get all courses this student has successfully purchased
public function purchasedCourses()
{
    return $this->belongsToMany(Course::class, 'purchases')
                ->withPivot('amount', 'status') // Include the pivot table data
                ->wherePivot('status', 'paid') // ONLY return paid courses
                ->withTimestamps();
}

public function reviews() { return $this->hasMany(Review::class); }
public function wishlists() { return $this->hasMany(Wishlist::class); }
public function videoProgress() { return $this->hasMany(VideoProgress::class); }
}