<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'telebirr_phone',
        'telebirr_name',
        'dollar_bank_name',
        'dollar_account_name',
        'dollar_account_number',
        'instructions',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Retrieve the active payment settings singleton record.
     */
    public static function getSettings(): self
    {
        $settings = static::first();
        if (!$settings) {
            $settings = static::create([
                'bank_name' => 'Commercial Bank of Ethiopia (CBE)',
                'bank_account_name' => 'Success Life Coaching',
                'bank_account_number' => '10000125544',
                'telebirr_phone' => '0914026415',
                'telebirr_name' => 'Success Life Coaching',
                'instructions' => 'Transfer your exact tuition to either the bank account or Telebirr account, then upload your payment slip/screenshot.',
                'is_active' => true,
            ]);
        }
        return $settings;
    }
}
