<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seminars', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('tagline');
            $table->decimal('entrance_fee', 10, 2)->default(0)->after('price_label');
            $table->text('bank_info')->nullable()->after('topics_json');
        });

        Schema::table('seminar_registrations', function (Blueprint $table) {
            $table->string('receipt_image')->nullable()->after('ticket_tier');
            $table->decimal('amount_paid', 10, 2)->default(0)->after('receipt_image');
            $table->string('transaction_reference')->nullable()->after('amount_paid');
            $table->string('status')->default('pending_approval')->after('transaction_reference'); // pending_approval, approved, rejected
            $table->text('admin_notes')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('seminars', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'entrance_fee', 'bank_info']);
        });

        Schema::table('seminar_registrations', function (Blueprint $table) {
            $table->dropColumn(['receipt_image', 'amount_paid', 'transaction_reference', 'status', 'admin_notes']);
        });
    }
};
