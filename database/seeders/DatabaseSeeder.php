<?php


namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Video;
use App\Models\Purchase;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Wipe ALL tables clean - use delete() for SQLite since it doesn't support FOREIGN_KEY_CHECKS well
        // We'll delete in reverse order to avoid constraint errors
        Payment::query()->delete();
        Purchase::query()->delete();
        Video::query()->delete();
        Course::query()->delete();
        Category::query()->delete();
        User::query()->delete();

        // ---------------------------------------------------------
        // CREATE USERS
        // Password for ALL of them is: password
        // ---------------------------------------------------------
        
        $admin = User::create([
            'name' => 'Viral Admin',
            'email' => 'admin@nati.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active'
        ]);

        $instructor = User::create([
            'name' => 'Goitom Hadush',
            'email' => 'instructor@nati.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'status' => 'active'
        ]);

        $student = User::create([
            'name' => 'Abebe Kebede',
            'email' => 'student@nati.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'status' => 'active'
        ]);

        // ---------------------------------------------------------
        // CREATE CATEGORIES
        // ---------------------------------------------------------
        
        $programming = Category::create([
            'name' => 'Programming',
            'slug' => 'programming'
        ]);

        $marketing = Category::create([
            'name' => 'Marketing',
            'slug' => 'marketing'
        ]);

        $design = Category::create([
            'name' => 'Graphic Design',
            'slug' => 'graphic-design'
        ]);

        // ---------------------------------------------------------
        // CREATE COURSES
        // ---------------------------------------------------------
        
        $laravelCourse = Course::create([
            'instructor_id' => $instructor->id,
            'category_id' => $programming->id,
            'title' => 'Laravel Complete Course',
            'slug' => 'laravel-complete-course',
            'description' => 'Learn how to build enterprise-level applications using Laravel 11, React, and Inertia.',
            'thumbnail' => 'thumbnails/dummy.jpg',
            'price' => 1500.00,
            'status' => 'published'
        ]);
        
        $pythonCourse = Course::create([
            'instructor_id' => $instructor->id,
            'category_id' => $programming->id,
            'title' => 'Python for Beginners',
            'slug' => 'python-for-beginners',
            'description' => 'Start your coding journey with Python - the most popular programming language.',
            'thumbnail' => 'thumbnails/dummy.jpg',
            'price' => 800.00,
            'status' => 'published'
        ]);

        // ---------------------------------------------------------
        // CREATE VIDEOS FOR COURSES
        // ---------------------------------------------------------
        
        // Laravel Course Videos
        Video::create([
            'course_id' => $laravelCourse->id,
            'title' => 'Introduction to Laravel',
            'video_path' => 'courses/1/intro.mp4',
            'duration' => 300,
            'sequence' => 1
        ]);
        Video::create([
            'course_id' => $laravelCourse->id,
            'title' => 'Setup & Installation',
            'video_path' => 'courses/1/setup.mp4',
            'duration' => 600,
            'sequence' => 2
        ]);
        Video::create([
            'course_id' => $laravelCourse->id,
            'title' => 'Routing Basics',
            'video_path' => 'courses/1/routing.mp4',
            'duration' => 900,
            'sequence' => 3
        ]);
        
        // Python Course Videos
        Video::create([
            'course_id' => $pythonCourse->id,
            'title' => 'What is Python?',
            'video_path' => 'courses/2/what-is-python.mp4',
            'duration' => 240,
            'sequence' => 1
        ]);
        Video::create([
            'course_id' => $pythonCourse->id,
            'title' => 'Variables & Data Types',
            'video_path' => 'courses/2/variables.mp4',
            'duration' => 720,
            'sequence' => 2
        ]);

        // ---------------------------------------------------------
        // CREATE PURCHASE & PAYMENT
        // ---------------------------------------------------------
        
        // Student buys Laravel course
        $purchase = Purchase::create([
            'user_id' => $student->id,
            'course_id' => $laravelCourse->id,
            'amount' => $laravelCourse->price,
            'status' => 'paid'
        ]);

        Payment::create([
            'user_id' => $student->id,
            'course_id' => $laravelCourse->id,
            'transaction_id' => 'TXN_' . now()->timestamp,
            'amount' => $laravelCourse->price,
            'payment_method' => 'manual',
            'status' => 'success'
        ]);
    }
}
