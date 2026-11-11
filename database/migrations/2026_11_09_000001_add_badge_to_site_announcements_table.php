<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('site_announcements') && ! Schema::hasColumn('site_announcements', 'badge')) {
            Schema::table('site_announcements', function (Blueprint $table) {
                $table->string('badge', 60)->nullable()->after('id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('site_announcements') && Schema::hasColumn('site_announcements', 'badge')) {
            Schema::table('site_announcements', function (Blueprint $table) {
                $table->dropColumn('badge');
            });
        }
    }
};
