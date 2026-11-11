<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('certificate_number')->unique()->index();
            $table->string('student_name');
            $table->string('student_email')->nullable();
            $table->string('course_title');
            $table->string('instructor_name')->default('Coach Tewelde Mebrahtu');
            $table->string('category_name')->nullable();
            $table->date('completion_date');
            $table->unsignedInteger('hours_completed')->default(15);
            $table->string('grade_score')->default('Distinction • 100% Completed');
            $table->string('verification_hash')->unique();
            $table->boolean('is_valid')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_certificates');
    }
};
