<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('site_announcements')) {
            return;
        }

        DB::table('site_announcements')
            ->where(function ($query) {
                $query->whereIn('telegram_url', [
                    'https://t.me/successlifecoaching',
                    'http://t.me/successlifecoaching',
                    't.me/successlifecoaching',
                    '@successlifecoaching',
                ])
                    ->orWhereNull('telegram_url')
                    ->orWhere('telegram_url', '');
            })
            ->update([
                'telegram_url' => 'https://t.me/SuccessLifeCoachingAcademy',
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        //
    }
};
