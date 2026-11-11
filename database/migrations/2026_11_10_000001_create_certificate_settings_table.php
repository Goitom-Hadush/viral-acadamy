<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_settings', function (Blueprint $table) {
            $table->id();
            $table->string('signer_name')->default('Tewelde Mebrahtu');
            $table->string('signer_title')->default('Executive Coach & Founder');
            $table->string('organization')->default('Success Life Coaching');
            $table->string('signature_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_settings');
    }
};
