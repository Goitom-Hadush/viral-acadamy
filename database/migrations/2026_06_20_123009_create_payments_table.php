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
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
        
        // This is the reference ID sent back by Chapa/Telebirr (e.g., "CHAPA_TXN_99382")
        // It must be unique so we don't process the same webhook twice.
        $table->string('transaction_id')->unique();
        
        $table->decimal('amount', 10, 2);
        
        // Which gateway did they use?
        $table->string('payment_method')->default('chapa');        
        // Did the bank actually approve it?
        $table->enum('status', ['success', 'failed', 'pending'])->default('pending');
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
