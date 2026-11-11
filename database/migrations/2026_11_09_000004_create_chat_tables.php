<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('chat_settings')) {
            Schema::create('chat_settings', function (Blueprint $table) {
                $table->id();
                $table->boolean('is_online')->default(false);
                $table->string('whatsapp_number', 40)->nullable();
                $table->string('telegram_url', 500)->nullable();
                $table->string('welcome_message', 500)->nullable();
                $table->string('offline_message', 500)->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('chat_conversations')) {
            Schema::create('chat_conversations', function (Blueprint $table) {
                $table->id();
                $table->uuid('visitor_token')->unique();
                $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
                $table->string('name', 100)->nullable();
                $table->string('contact', 120)->nullable();
                $table->unsignedInteger('admin_unread')->default(0);
                $table->unsignedInteger('visitor_unread')->default(0);
                $table->timestamp('last_message_at')->nullable()->index();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('chat_messages')) {
            Schema::create('chat_messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('chat_conversation_id')->constrained()->cascadeOnDelete();
                $table->string('sender', 10); // 'visitor' or 'admin'
                $table->text('body');
                $table->timestamps();

                $table->index(['chat_conversation_id', 'id']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_conversations');
        Schema::dropIfExists('chat_settings');
    }
};
