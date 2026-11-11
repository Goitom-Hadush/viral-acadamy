<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seminars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->string('badge')->default('Upcoming');
            $table->string('speaker_name');
            $table->string('speaker_title')->nullable();
            $table->string('speaker_initials')->default('SL');
            $table->string('date_string'); // e.g. "Saturday, Nov 28, 2026"
            $table->string('time_string'); // e.g. "9:00 AM – 4:30 PM EAT"
            $table->string('location_type')->default('hybrid'); // in_person, virtual, hybrid
            $table->string('venue_name'); // e.g. "Ethiopian Skylight Hotel Grand Ballroom"
            $table->string('venue_city')->default('Addis Ababa');
            $table->string('price_label')->default('Free Registration');
            $table->text('description');
            $table->text('topics_json')->nullable();
            $table->integer('capacity')->default(300);
            $table->integer('registered_count')->default(185);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('seminar_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_code')->unique();
            $table->string('seminar_id');
            $table->string('seminar_title');
            $table->string('attendee_name');
            $table->string('attendee_phone');
            $table->string('attendee_email')->nullable();
            $table->string('ticket_tier')->default('Standard Delegate');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seminar_registrations');
        Schema::dropIfExists('seminars');
    }
};
