<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sponsors')) {
            return;
        }

        $now = now();
        $defaults = [
            [
                'name' => 'Commercial Bank of Ethiopia (CBE)',
                'tier' => 'platinum',
                'logo_path' => '/CBE.jpeg',
                'website_url' => 'https://combanketh.et',
                'description' => 'Payment partner supporting course enrollment through bank transfer.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Telebirr',
                'tier' => 'platinum',
                'logo_path' => '/Telebirr.png',
                'website_url' => 'https://telebirr.et',
                'description' => 'Mobile payment option for course enrollment.',
                'sort_order' => 2,
            ],
        ];

        foreach ($defaults as $sponsor) {
            $exists = DB::table('sponsors')->where('name', $sponsor['name'])->exists();

            if (! $exists) {
                DB::table('sponsors')->insert($sponsor + [
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep admin-managed sponsor records when rolling back this data migration.
    }
};
