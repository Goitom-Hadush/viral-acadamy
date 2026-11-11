<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->string('video_path')->nullable()->change();
            $table->string('image_path')->nullable()->after('video_path');
            $table->string('link_url')->nullable()->after('image_path');
            $table->string('tier')->default('platinum')->after('title');
            $table->unsignedInteger('sort_order')->default(0)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'link_url', 'tier', 'sort_order']);
        });
    }
};
