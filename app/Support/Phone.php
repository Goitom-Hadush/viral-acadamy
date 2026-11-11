<?php

namespace App\Support;

class Phone
{
    /**
     * Normalize Ethiopian / international phone numbers for storage & lookup.
     * Examples: "+251 914 026 415" / "251914026415" → "0914026415"
     */
    public static function normalize(?string $phone): string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone) ?: '';

        if (str_starts_with($digits, '251') && strlen($digits) >= 12) {
            $digits = '0'.substr($digits, 3);
        }

        return $digits;
    }
}
