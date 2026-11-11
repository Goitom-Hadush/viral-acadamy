<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add referral_code to users table if not exists
        if (!Schema::hasColumn('users', 'referral_code')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('referral_code', 30)->nullable()->unique()->after('status');
            });
        }

        // 2. Add referral tracking columns to payments table if not exists
        if (!Schema::hasColumn('payments', 'referral_code')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->string('referral_code', 30)->nullable()->after('payment_method');
                $table->foreignId('referrer_id')->nullable()->constrained('users')->nullOnDelete()->after('referral_code');
            });
        }

        // 3. Create referral_earnings table
        if (!Schema::hasTable('referral_earnings')) {
            Schema::create('referral_earnings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('referrer_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('referred_user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
                $table->decimal('course_price', 10, 2);
                $table->decimal('commission_rate', 5, 2)->default(2.00); // 2%
                $table->decimal('commission_amount', 10, 2); // 2% of course_price
                $table->string('status', 20)->default('pending'); // pending, credited, cancelled
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_earnings');

        if (Schema::hasColumn('payments', 'referrer_id')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropForeign(['referrer_id']);
                $table->dropColumn(['referrer_id', 'referral_code']);
            });
        }

        if (Schema::hasColumn('users', 'referral_code')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('referral_code');
            });
        }
    }
};
