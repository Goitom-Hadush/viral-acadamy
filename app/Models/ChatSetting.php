<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class ChatSetting extends Model
{
    protected $fillable = [
        'is_online',
        'whatsapp_number',
        'telegram_url',
        'welcome_message',
        'offline_message',
    ];

    protected $casts = [
        'is_online' => 'boolean',
    ];

    /**
     * Singleton settings row. Seeds Telegram/phone from the homepage announcement when available.
     */
    public static function getSettings(): self
    {
        $settings = static::first();

        if ($settings) {
            return $settings;
        }

        $telegram = null;
        $phone = null;

        try {
            if (Schema::hasTable('site_announcements')) {
                $row = SiteAnnouncement::query()->latest('id')->first();
                $telegram = $row?->telegram_url;
                $phone = $row?->phone;
            }
        } catch (\Throwable $e) {
            // Ignore: defaults below are fine.
        }

        return static::create([
            'is_online' => false,
            'whatsapp_number' => $phone,
            'telegram_url' => $telegram,
            'welcome_message' => 'Hi 👋 How can we help you today? Send us a message and we will reply here.',
            'offline_message' => 'We are away right now. Leave your message and contact details and we will get back to you soon, or reach us directly on WhatsApp or Telegram.',
        ]);
    }

    /** wa.me link built from the stored number (Ethiopian 09… numbers become 2519…). */
    public function whatsappUrl(): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $this->whatsapp_number);

        if (! $digits) {
            return null;
        }

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        } elseif (str_starts_with($digits, '0')) {
            $digits = '251'.substr($digits, 1);
        }

        return 'https://wa.me/'.$digits.'?text='.rawurlencode('Hello Success Life Coaching, I need some help.');
    }

    /** Accepts @username, t.me/username or a full URL. */
    public function telegramLink(): ?string
    {
        $value = trim((string) $this->telegram_url);

        if ($value === '') {
            return null;
        }

        if (str_starts_with($value, '@')) {
            return 'https://t.me/'.ltrim($value, '@');
        }

        if (! preg_match('#^https?://#i', $value)) {
            return 'https://'.ltrim($value, '/');
        }

        return $value;
    }
}
