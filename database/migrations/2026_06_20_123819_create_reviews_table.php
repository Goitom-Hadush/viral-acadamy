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
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
        
        // tinyInteger is perfect for 1-5 stars. It takes up almost zero database space.
        $table->tinyInteger('rating'); 
        
        $table->text('comment')->nullable();
        
        $table->timestamps();
        
        // One student, one review per course. Prevents spamming the instructor.
        $table->unique(['user_id', 'course_id']);
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
