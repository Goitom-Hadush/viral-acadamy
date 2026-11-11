<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferralSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'headline',
        'tagline',
        'description',
        'reward_type',
        'reward_value',
        'min_cash_out',
        'cash_out_instructions',
        'is_active',
    ];

    protected $casts = [
        'reward_value' => 'float',
        'min_cash_out' => 'float',
        'is_active' => 'boolean',
    ];

    /**
     * Retrieve the referral settings singleton record.
     */
    public static function getSettings(): self
    {
        $settings = static::first();
        if (!$settings) {
            $settings = static::create([
                'headline' => '🎁 Student Referral Program',
                'tagline' => 'Invite Students & Earn 100 ETB',
                'description' => 'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive 100 ETB instant commission!',
                'reward_type' => 'fixed',
                'reward_value' => 100.00,
                'min_cash_out' => 50.00,
                'cash_out_instructions' => 'Cash out requests are processed to your Telebirr or CBE Bank account within 24-48 business hours.',
                'is_active' => true,
            ]);
        }
        return $settings;
    }
}
