<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('videos', function (Blueprint $table) {
        $table->id();
        
        // 1. Which course does this belong to?
        // If a course is deleted, delete all its videos to free up server space.
        $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
        
        // 2. Video Details
        $table->string('title'); // e.g., "Introduction to Routing"
        
        // 3. THE SECURITY FIELD
        // This will NOT be 'public/videos/xyz.mp4'. 
        // This will be something like 'courses/15/lesson_1.mp4' pointing to storage/app/private
        $table->string('video_path'); 
        
        // 4. Duration in SECONDS (not minutes/seconds format)
        // Why? Databases are bad at calculating "18:30". But they are great at "1110 seconds".
        // We convert seconds back to minutes/seconds on the React frontend.
        $table->integer('duration')->nullable(); 
        
        // 5. The Order
        // This allows the instructor to drag-and-drop lessons to reorder them (1, 2, 3, 4...)
        $table->integer('sequence')->default(0);
        
        $table->timestamps();
        
        // 6. PERFORMANCE INDEX (Crucial for LMS)
        // Every time a student opens a course, the system queries: 
        // "Get all videos where course_id = X, ordered by sequence"
        // This index makes that query lightning fast, even with thousands of videos.
        $table->index(['course_id', 'sequence']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
