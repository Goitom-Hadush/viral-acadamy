<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('bank_name')->default('Commercial Bank of Ethiopia (CBE)');
            $table->string('bank_account_name')->default('Success Life Coaching'); // Book Owner
            $table->string('bank_account_number')->default('10000125544'); // Book Number
            $table->string('telebirr_phone')->default('0914026415');
            $table->string('telebirr_name')->default('Success Life Coaching');
            $table->text('instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial default payment configuration
        DB::table('payment_settings')->insert([
            'bank_name' => 'Commercial Bank of Ethiopia (CBE)',
            'bank_account_name' => 'Success Life Coaching',
            'bank_account_number' => '10000125544',
            'telebirr_phone' => '0914026415',
            'telebirr_name' => 'Success Life Coaching',
            'instructions' => 'Transfer your exact tuition to either the bank account or Telebirr account, then upload your payment slip/screenshot.',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
