<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_pages', function (Blueprint $table) {
            $table->string('hero_image_path')->nullable();
            $table->string('banner_image_path')->nullable();
            $table->string('section_title')->nullable();
            $table->json('stats')->nullable();
        });

        Schema::table('about_highlights', function (Blueprint $table) {
            $table->string('image_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('about_highlights', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });

        Schema::table('content_pages', function (Blueprint $table) {
            $table->dropColumn(['hero_image_path', 'banner_image_path', 'section_title', 'stats']);
        });
    }
};
