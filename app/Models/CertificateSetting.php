<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class CertificateSetting extends Model
{
    protected $fillable = ['signer_name', 'signer_title', 'organization', 'signature_path'];

    /** Singleton settings row. */
    public static function getSettings(): self
    {
        return static::first() ?? static::create([]);
    }

    /** Props passed to certificate pages (safe when the table is not migrated yet). */
    public static function forDisplay(): array
    {
        $defaults = [
            'signer_name' => 'Tewelde Mebrahtu',
            'signer_title' => 'Executive Coach & Founder',
            'organization' => 'Success Life Coaching',
            'signature_url' => null,
        ];

        try {
            if (! Schema::hasTable('certificate_settings')) {
                return $defaults;
            }

            $s = static::getSettings();

            return [
                'signer_name' => $s->signer_name ?: $defaults['signer_name'],
                'signer_title' => $s->signer_title ?: $defaults['signer_title'],
                'organization' => $s->organization ?: $defaults['organization'],
                'signature_url' => $s->signature_path ? '/media/'.$s->signature_path : null,
            ];
        } catch (\Throwable $e) {
            return $defaults;
        }
    }
}
