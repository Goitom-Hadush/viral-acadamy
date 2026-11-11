<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create referral_settings table
        if (!Schema::hasTable('referral_settings')) {
            Schema::create('referral_settings', function (Blueprint $table) {
                $table->id();
                $table->string('headline')->default('🎁 Student Referral Program');
                $table->string('tagline')->default('Invite Students & Earn 100 ETB');
                $table->text('description')->nullable();
                $table->string('reward_type', 20)->default('fixed'); // 'fixed' (Birr amount) or 'percentage'
                $table->decimal('reward_value', 10, 2)->default(100.00); // 100 ETB or %
                $table->decimal('min_cash_out', 10, 2)->default(50.00); // Minimum amount to request cash out
                $table->text('cash_out_instructions')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });

            // Seed default settings row
            DB::table('referral_settings')->insert([
                'headline' => '🎁 Student Referral Program',
                'tagline' => 'Invite Students & Earn 100 ETB',
                'description' => 'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive 100 ETB instant commission!',
                'reward_type' => 'fixed',
                'reward_value' => 100.00,
                'min_cash_out' => 50.00,
                'cash_out_instructions' => 'Cash out requests are processed to your Telebirr or CBE Bank account within 24-48 business hours.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Create cash_out_requests table
        if (!Schema::hasTable('cash_out_requests')) {
            Schema::create('cash_out_requests', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->decimal('amount', 10, 2);
                $table->string('payout_method', 50); // 'telebirr', 'cbe', 'bank'
                $table->string('account_number', 100);
                $table->string('account_name', 150);
                $table->string('bank_name', 100)->nullable();
                $table->text('student_notes')->nullable();
                $table->string('status', 20)->default('pending'); // 'pending', 'approved', 'rejected'
                $table->string('transaction_reference', 150)->nullable();
                $table->text('admin_notes')->nullable();
                $table->timestamp('processed_at')->nullable();
                $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_out_requests');
        Schema::dropIfExists('referral_settings');
    }
};
