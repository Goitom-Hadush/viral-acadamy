<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    // Allow mass assignment for these fields when creating/updating a course
    protected $fillable = [
        'instructor_id',
        'category_id',
        'title',
        'slug',
        'description',
        'thumbnail',
        'price',
        'status',
    ];

    // RELATIONSHIP 1: A course belongs to ONE Instructor (User)
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    // RELATIONSHIP 2: A course belongs to ONE Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // RELATIONSHIP 3: A course will HAVE MANY Videos (We build this table next!)
    public function videos()
    {
        return $this->hasMany(Video::class)->orderBy('sequence', 'asc');
    }

    // RELATIONSHIP 4: A course will HAVE MANY Purchases (Students who bought it)
    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    // RELATIONSHIP 4b: A course will HAVE MANY Payments (transaction records)
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    // A course has many text reviews
public function reviews()
{
    return $this->hasMany(Review::class);
}

// A course can be wishlisted by many students
public function wishlists()
{
    return $this->hasMany(Wishlist::class);
}
}