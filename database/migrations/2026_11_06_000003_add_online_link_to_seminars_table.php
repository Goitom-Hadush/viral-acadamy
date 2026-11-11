<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('seminars', function (Blueprint $table) {
            $table->string('online_link', 500)->nullable()->after('venue_city');
        });
    }

    public function down(): void
    {
        Schema::table('seminars', function (Blueprint $table) {
            $table->dropColumn('online_link');
        });
    }
};
