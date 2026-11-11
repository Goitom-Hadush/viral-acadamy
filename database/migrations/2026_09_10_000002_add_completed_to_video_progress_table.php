<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('video_progress', function (Blueprint $table) {
            $table->boolean('completed')->default(false)->after('watched_seconds');
        });
    }

    public function down(): void
    {
        Schema::table('video_progress', function (Blueprint $table) {
            $table->dropColumn('completed');
        });
    }
};
