<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('cta_label')->default('እንዴት?');
            $table->string('cta_url')->nullable();
            $table->string('telegram_url')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        $now = now();
        DB::table('site_announcements')->insert([
            'title' => 'Success Life Coaching Academy enrollment is now open!',
            'subtitle' => 'Secure your spot today and start building your income',
            'cta_label' => 'እንዴት?',
            'cta_url' => '/register',
            'telegram_url' => 'https://t.me/SuccessLifeCoachingAcademy',
            'phone' => '+251900000000',
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_announcements');
    }
};
