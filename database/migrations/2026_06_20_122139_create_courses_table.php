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
    Schema::create('courses', function (Blueprint $table) {
        $table->id();
        
        // 1. The Owner (Who created this course?)
        // This creates a foreign key linking to the 'users' table.
        // cascadeOnDelete means: IF we delete the instructor, DELETE their courses too.
        $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
        
        // 2. The Category (Where does this belong?)
        $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
        
        // 3. Product Details
        $table->string('title');
        $table->string('slug')->unique(); // SEO friendly URL: /course/laravel-master-class
        $table->text('description'); // Long text for the course overview
        
        // 4. Media & Money
        $table->string('thumbnail'); // Path to the cover image
        
        // WHY decimal(10,2)? Never use FLOAT for money. Decimal ensures exact precision.
        // 10,2 means up to 99,999,999.99 ETB. Perfect for your pricing.
        $table->decimal('price', 10, 2); 
        
        // 5. Status Control
        // Instructors can save drafts before officially publishing to students
        $table->enum('status', ['draft', 'published'])->default('draft');
        
        $table->timestamps();
        
        // Indexing for speed: If students search by category, this makes it lightning fast
        $table->index(['category_id', 'status']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
