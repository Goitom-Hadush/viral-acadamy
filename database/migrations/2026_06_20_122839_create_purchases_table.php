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
    Schema::create('purchases', function (Blueprint $table) {
        $table->id();
        
        // Who bought it?
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        
        // What did they buy?
        $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
        
        // How much did they pay at the time of purchase? 
        // (We save this here because the instructor might raise the price to 2000 ETB next year, 
        // but this student bought it for 1500 ETB. We need a historical record).
        $table->decimal('amount', 10, 2);
        
        $table->enum('status', ['paid', 'pending'])->default('pending');
        
        $table->timestamps();
        
        // CRITICAL BUSINESS LOGIC: Prevent a student from buying the exact same course twice.
        // This creates a strict rule in the database: (user_id + course_id) must be totally unique.
        $table->unique(['user_id', 'course_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
