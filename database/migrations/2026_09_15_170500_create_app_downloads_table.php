<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_downloads', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('android_path')->nullable();
            $table->string('android_original_name')->nullable();
            $table->string('android_version')->nullable();
            $table->string('ios_path')->nullable();
            $table->string('ios_original_name')->nullable();
            $table->string('ios_version')->nullable();
            $table->string('android_store_url')->nullable();
            $table->string('ios_store_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $now = now();
        DB::table('app_downloads')->insert([
            'title' => 'Get the Success Life Coaching Academy app',
            'android_path' => null,
            'ios_path' => null,
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('app_downloads');
    }
};
