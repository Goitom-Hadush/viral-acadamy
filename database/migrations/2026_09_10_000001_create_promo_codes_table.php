<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promo_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('code', 32)->unique();
            $table->unsignedInteger('max_uses');       // max number of students
            $table->unsignedInteger('used_count')->default(0); // how many used so far
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Track which student used which promo code
        Schema::create('promo_code_uses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_code_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['promo_code_id', 'user_id']); // one use per student per code
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_code_uses');
        Schema::dropIfExists('promo_codes');
    }
};
