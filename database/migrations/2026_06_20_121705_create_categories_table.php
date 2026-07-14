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
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        
        // 1. The display name (e.g., "Programming")
        $table->string('name');
        
        // 2. The URL slug (e.g., "programming")
        // Why? Instead of yourdomain.com/category/1, you get yourdomain.com/category/programming
        // This is much better for SEO and looks professional.
        $table->string('slug')->unique();
        
        // 3. An icon class or image path (e.g., 'fa-code' for Font Awesome)
        $table->string('icon')->nullable();
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
