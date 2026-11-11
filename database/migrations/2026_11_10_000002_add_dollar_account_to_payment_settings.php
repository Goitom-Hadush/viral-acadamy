<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_settings', function (Blueprint $table) {
            $table->string('dollar_bank_name')->nullable();
            $table->string('dollar_account_name')->nullable();
            $table->string('dollar_account_number')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('payment_settings', function (Blueprint $table) {
            $table->dropColumn(['dollar_bank_name', 'dollar_account_name', 'dollar_account_number']);
        });
    }
};
