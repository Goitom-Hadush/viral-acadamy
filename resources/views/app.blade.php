<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
        <meta name="theme-color" content="#004101">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="Success Life Coaching Academy">
        <meta name="format-detection" content="telephone=no">

        <title inertia>{{ config('app.name', 'Success Life Coaching Academy') }}</title>

        <!-- CSRF Token for fetch() calls -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="icon" type="image/png" href="{{ asset('logo.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('logo.png') }}">

        @php
            $seoUrl = rtrim(config('app.url'), '/');
            $seoLocale = app()->getLocale();
            $seoDescriptions = config('seo.descriptions', []);
            $seoDescEn = $seoDescriptions['en'] ?? 'Success Life Coaching Academy is an online coaching and learning platform in Mekelle, Ethiopia.';
            $seoDescAm = $seoDescriptions['am'] ?? '';
            $seoDescTi = $seoDescriptions['ti'] ?? '';
            $seoDesc = $seoDescriptions[$seoLocale] ?? $seoDescEn;
            $seoCombined = trim(implode(' | ', array_filter([$seoDescEn, $seoDescAm, $seoDescTi])));
            $seoAddress = config('seo.address', []);
            $seoPhone = config('seo.phone');
            $seoEmail = config('seo.email');
            $seoDeveloper = config('seo.developer', 'Segartech');
            $seoDesigner = config('seo.designer', 'Goitom Hadush');
            $seoDesignerFull = config('seo.designer_full_name', 'Goitom Hadush Gebremichael');
            $seoKeywords = config('seo.keywords', []);
            $seoCourses = config('seo.courses', []);
            $seoSocial = array_values(array_filter(config('seo.social', [])));
            $seoSameAs = array_values(array_unique(array_filter(array_merge([$seoUrl], $seoSocial))));
            $seoPostal = array_filter([
                '@type' => 'PostalAddress',
                'streetAddress' => $seoAddress['street'] ?? null,
                'addressLocality' => $seoAddress['locality'] ?? 'Mekelle',
                'addressRegion' => $seoAddress['region'] ?? 'Tigray',
                'postalCode' => $seoAddress['postal'] ?? null,
                'addressCountry' => $seoAddress['country'] ?? 'ET',
            ]);
            $ogLocaleMap = ['en' => 'en_ET', 'am' => 'am_ET', 'ti' => 'ti_ET'];
            $ogLocale = $ogLocaleMap[$seoLocale] ?? 'en_ET';
            $seoCourseOffers = array_map(static function (string $courseName) use ($seoUrl) {
                return [
                    '@type' => 'Course',
                    'name' => $courseName,
                    'provider' => [
                        '@type' => 'EducationalOrganization',
                        'name' => config('seo.name', 'Success Life Coaching Academy'),
                        'url' => $seoUrl,
                    ],
                    'inLanguage' => ['en', 'ti', 'am'],
                ];
            }, $seoCourses);
            $seoSchema = [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'EducationalOrganization',
                        '@id' => $seoUrl.'/#organization',
                        'name' => config('seo.name', 'Success Life Coaching Academy'),
                        'alternateName' => config('seo.alternate_names', []),
                        'url' => $seoUrl,
                        'logo' => asset('logo.png'),
                        'image' => asset('logo.png'),
                        'description' => $seoDescEn,
                        'disambiguatingDescription' => $seoCombined,
                        'keywords' => implode(', ', $seoKeywords),
                        'knowsAbout' => $seoCourses,
                        'hasOfferCatalog' => [
                            '@type' => 'OfferCatalog',
                            'name' => 'Success Life Coaching Academy Courses',
                            'itemListElement' => array_map(static function (string $courseName) {
                                return [
                                    '@type' => 'Offer',
                                    'itemOffered' => [
                                        '@type' => 'Course',
                                        'name' => $courseName,
                                    ],
                                ];
                            }, $seoCourses),
                        ],
                        'address' => $seoPostal,
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Ethiopia',
                        ],
                        'availableLanguage' => ['en', 'am', 'ti'],
                        'telephone' => $seoPhone,
                        'email' => $seoEmail,
                        'sameAs' => $seoSameAs,
                        'founder' => [
                            '@type' => 'Person',
                            'name' => $seoDesignerFull,
                            'alternateName' => [$seoDesigner, 'Goitom Hadush Gebremichal'],
                            'worksFor' => [
                                '@type' => 'Organization',
                                'name' => $seoDeveloper,
                            ],
                        ],
                        'creator' => [
                            '@type' => 'Person',
                            'name' => $seoDesignerFull,
                            'alternateName' => [$seoDesigner, 'Goitom Hadush Gebremichal'],
                            'telephone' => $seoPhone,
                            'worksFor' => [
                                '@type' => 'Organization',
                                'name' => $seoDeveloper,
                            ],
                        ],
                        'contactPoint' => array_values(array_filter([
                            $seoPhone ? [
                                '@type' => 'ContactPoint',
                                'telephone' => $seoPhone,
                                'contactType' => 'customer service',
                                'areaServed' => 'ET',
                                'availableLanguage' => ['English', 'Amharic', 'Tigrinya'],
                            ] : null,
                            $seoEmail ? [
                                '@type' => 'ContactPoint',
                                'email' => $seoEmail,
                                'contactType' => 'customer service',
                                'areaServed' => 'ET',
                                'availableLanguage' => ['English', 'Amharic', 'Tigrinya'],
                            ] : null,
                        ])),
                    ],
                    [
                        '@type' => 'WebSite',
                        '@id' => $seoUrl.'/#website',
                        'url' => $seoUrl,
                        'name' => config('seo.name', 'Success Life Coaching Academy'),
                        'alternateName' => config('seo.alternate_names', []),
                        'description' => $seoCombined,
                        'keywords' => implode(', ', $seoKeywords),
                        'publisher' => ['@id' => $seoUrl.'/#organization'],
                        'creator' => [
                            '@type' => 'Person',
                            'name' => $seoDesignerFull,
                            'alternateName' => [$seoDesigner, 'Goitom Hadush Gebremichal'],
                        ],
                        'inLanguage' => ['en', 'ti', 'am'],
                    ],
                    [
                        '@type' => 'WebPage',
                        '@id' => $seoUrl.request()->getPathInfo().'#webpage',
                        'url' => $seoUrl.request()->getPathInfo(),
                        'name' => config('seo.name', 'Success Life Coaching Academy'),
                        'isPartOf' => ['@id' => $seoUrl.'/#website'],
                        'about' => ['@id' => $seoUrl.'/#organization'],
                        'description' => $seoDesc,
                        'keywords' => implode(', ', $seoKeywords),
                        'author' => [
                            '@type' => 'Person',
                            'name' => $seoDesignerFull,
                        ],
                        'inLanguage' => $seoLocale,
                    ],
                    [
                        '@type' => 'ItemList',
                        '@id' => $seoUrl.'/#featured-courses',
                        'name' => 'Success Life Coaching Academy featured courses',
                        'itemListElement' => array_map(static function (array $course, int $index) {
                            return [
                                '@type' => 'ListItem',
                                'position' => $index + 1,
                                'item' => $course,
                            ];
                        }, $seoCourseOffers, array_keys($seoCourseOffers)),
                    ],
                    [
                        '@type' => 'Person',
                        '@id' => $seoUrl.'/#designer',
                        'name' => $seoDesignerFull,
                        'alternateName' => [
                            $seoDesigner,
                            'Goitom Hadush Gebremichal',
                            'ጎይቶም ሓዱሽ',
                        ],
                        'jobTitle' => 'Designer and Developer',
                        'worksFor' => [
                            '@type' => 'Organization',
                            'name' => $seoDeveloper,
                        ],
                        'telephone' => $seoPhone,
                        'url' => $seoUrl,
                        'description' => $seoDesignerFull.' designed and developed Success Life Coaching Academy (Segartech) — coaching and online courses in Tigrinya and English.',
                    ],
                    [
                        '@type' => 'Organization',
                        '@id' => $seoUrl.'/#developer',
                        'name' => $seoDeveloper,
                        'founder' => ['@id' => $seoUrl.'/#designer'],
                        'telephone' => $seoPhone,
                        'url' => $seoUrl,
                        'description' => $seoDeveloper.' / '.$seoDesignerFull.' developed Success Life Coaching Academy — coaching and online courses in Tigrinya and English.',
                    ],
                ],
            ];
        @endphp

        <!-- Global SEO -->
        <meta name="author" content="{{ $seoDesignerFull }}, {{ $seoDeveloper }}, Success Life Coaching Academy">
        <meta name="designer" content="{{ $seoDesignerFull }}">
        <meta name="developer" content="{{ $seoDesignerFull }}, {{ $seoDeveloper }}">
        <meta name="description" content="{{ $seoCombined }}">
        <meta name="keywords" content="{{ implode(', ', $seoKeywords) }}">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="googlebot" content="index, follow">
        <meta name="geo.region" content="ET-TI">
        <meta name="geo.placename" content="{{ $seoAddress['display'] ?? 'Mekelle, Tigray, Ethiopia' }}">
        <meta name="language" content="English, Amharic, Tigrinya">
        <meta name="revisit-after" content="3 days">
        @if ($seoPhone)
            <meta name="telephone" content="{{ $seoPhone }}">
        @endif
        @if (config('app.google_site_verification'))
            <meta name="google-site-verification" content="{{ config('app.google_site_verification') }}">
        @endif

        <!-- Open Graph defaults -->
        <meta property="og:site_name" content="Success Life Coaching Academy">
        <meta property="og:locale" content="{{ $ogLocale }}">
        <meta property="og:locale:alternate" content="en_ET">
        <meta property="og:locale:alternate" content="am_ET">
        <meta property="og:locale:alternate" content="ti_ET">
        <meta property="og:image" content="{{ asset('logo.png') }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $seoUrl }}{{ request()->getPathInfo() === '/' ? '/' : request()->getPathInfo() }}">

        <!-- Twitter defaults -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:image" content="{{ asset('logo.png') }}">

        <!-- Language hints for Google -->
        <link rel="alternate" hreflang="en" href="{{ $seoUrl }}{{ request()->getPathInfo() }}">
        <link rel="alternate" hreflang="am" href="{{ $seoUrl }}{{ request()->getPathInfo() }}">
        <link rel="alternate" hreflang="ti" href="{{ $seoUrl }}{{ request()->getPathInfo() }}">
        <link rel="alternate" hreflang="x-default" href="{{ $seoUrl }}{{ request()->getPathInfo() }}">

        <!-- Canonical -->
        <link rel="canonical" href="{{ $seoUrl }}{{ request()->getPathInfo() }}">

        <script type="application/ld+json">{!! json_encode($seoSchema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
