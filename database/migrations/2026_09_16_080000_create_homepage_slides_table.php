<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('homepage_slides', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('media_type', 20); // image | video
            $table->string('media_path');
            $table->string('caption')->nullable();
            $table->string('link_url')->nullable();
            $table->string('cta_label')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_slides');
    }
};
