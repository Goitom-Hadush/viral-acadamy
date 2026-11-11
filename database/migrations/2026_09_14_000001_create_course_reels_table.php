<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_reels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->string('media_type'); // image | video
            $table->string('media_path');
            $table->string('caption')->nullable();
            $table->unsignedSmallInteger('duration')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['is_published', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_reels');
    }
};
