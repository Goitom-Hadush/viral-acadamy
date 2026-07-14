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
    Schema::create('video_progress', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete();
        
        // The exact second they paused or left the video
        $table->integer('watched_seconds')->default(0);
        
        $table->timestamps();
        
        // CRITICAL: A user can only have ONE progress record per video.
        // We don't want 50 rows of progress for the same video. 
        // updateOrCreate() will use this unique key to overwrite the old time.
        $table->unique(['user_id', 'video_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('video_progress');
    }
};
