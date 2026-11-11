<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Public organization / Google search identity
    |--------------------------------------------------------------------------
    |
    | Used for meta tags, JSON-LD, and the footer contact block so Google can
    | show English, Amharic, and Tigrinya descriptions plus address & social.
    |
    */

    'name' => env('SEO_NAME', 'Success Life Coaching Academy'),

    'alternate_names' => [
        'ሰክሰስ ላይፍ ኮቺንግ አካዳሚ',
        'ሰክሰስ ላይፍ ኮቺንግ ኣካዳሚ',
        'Success Life Coaching Academy Ethiopia',
        'Success Life Coaching Academy Mekelle',
        'Success Life Coaching',
        'Segartech Success Life Coaching Academy',
    ],

    'developer' => env('SEO_DEVELOPER', 'Segartech'),

    'designer' => env('SEO_DESIGNER', 'Goitom Hadush'),

    'designer_full_name' => env('SEO_DESIGNER_FULL_NAME', 'Goitom Hadush Gebremichael'),

    'descriptions' => [
        'en' => 'Success Life Coaching Academy by Tewelde Mebrahtu in Mekelle, Tigray, Ethiopia — Life coaching, business coaching, digital marketing, personal development, online courses in Tigrinya and English. Call 0914026415.',
        'am' => 'ሰክሰስ ላይፍ ኮቺንግ አካዳሚ በTewelde Mebrahtu — በመቐለ፣ ትግራይ፤ የሕይወት እና የንግድ ኮቺንግ፣ የትግርኛ ኮርሶች፣ ግራፊክ ዲዛይን እና ሶሻል ሚዲያ ማርኬቲንግ። ስልክ 0914026415።',
        'ti' => 'ሰክሰስ ላይፍ ኮቺንግ ኣካዳሚ ብTewelde Mebrahtu — ኣብ መቐለ፣ ትግራይ፤ ናይ ህይወት ኮቺንግ፣ ናይ ትግርኛ ኮርሳት፣ ግራፊክ ዲዛይንን ሶሻል ሚድያ ማርኬቲንግን። ተሌፎን 0914026415።',
    ],

    'keywords' => [
        'Success Life Coaching Academy',
        'Success Life Coaching',
        'ሰክሰስ ላይፍ ኮቺንግ አካዳሚ',
        'ሰክሰስ ላይፍ ኮቺንግ ኣካዳሚ',
        'Segartech',
        'Goitom Hadush',
        'Goitom Hadush Gebremichael',
        'Goitom Hadush Gebremichal',
        'ጎይቶም ሓዱሽ',
        '0914026415',
        'life coaching Ethiopia',
        'coaching courses',
        'courses in Tigrinya',
        'Tigrinya courses',
        'personal development',
        'TikTok course',
        'Facebook Ads',
        'YouTube Masterclass',
        'graphic design',
        'social media marketing',
        'online courses Mekelle',
        'online learning Ethiopia',
        'ትግርኛ ኮርስ',
        'ግራፊክ ዲዛይን',
        'ሶሻል ሚዲያ ማርኬቲንግ',
    ],

    'courses' => [
        'Success Life Coaching Masterclass',
        'Courses in Tigrinya',
        'TikTok Course',
        'Facebook Ads',
        'YouTube Masterclass',
        'Graphic Design',
        'Social Media Marketing',
    ],

    'address' => [
        'street' => env('SEO_STREET_ADDRESS', ''),
        'locality' => env('SEO_ADDRESS_LOCALITY', 'Mekelle'),
        'region' => env('SEO_ADDRESS_REGION', 'Tigray'),
        'country' => env('SEO_ADDRESS_COUNTRY', 'ET'),
        'postal' => env('SEO_POSTAL_CODE', ''),
        'display' => env('SEO_ADDRESS_DISPLAY', 'Mekelle, Tigray, Ethiopia'),
    ],

    'phone' => env('SEO_PHONE', '+251914026415'),
    'email' => env('SEO_EMAIL', 'info@successlifecoaching.com'),

    'social' => array_filter([
        'telegram' => env('SEO_TELEGRAM', 'https://t.me/SuccessLifeCoachingAcademy'),
        'facebook' => env('SEO_FACEBOOK'),
        'instagram' => env('SEO_INSTAGRAM'),
        'youtube' => env('SEO_YOUTUBE'),
        'tiktok' => env('SEO_TIKTOK'),
        'twitter' => env('SEO_TWITTER'),
        'linkedin' => env('SEO_LINKEDIN'),
    ]),

];
