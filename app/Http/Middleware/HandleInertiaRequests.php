<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * All UI strings for one language as a flat "group.key" => text map.
     * Merges lang/{locale}/ui.php (nested) with lang/{locale}.json (flat; wins on conflicts),
     * and caches the result until either file changes.
     */
    private function translationsFor(string $locale): array
    {
        static $memo = [];

        $json = base_path("lang/{$locale}.json");
        $php = base_path("lang/{$locale}/ui.php");
        $version = (file_exists($json) ? filemtime($json) : 0).'-'.(file_exists($php) ? filemtime($php) : 0);
        $cacheKey = "ui-translations:{$locale}:{$version}";

        if (isset($memo[$cacheKey])) {
            return $memo[$cacheKey];
        }

        $build = function () use ($json, $php) {
            $flat = [];
            if (file_exists($php)) {
                $nested = require $php;
                $walk = function (array $items, string $prefix) use (&$walk, &$flat) {
                    foreach ($items as $key => $value) {
                        is_array($value) ? $walk($value, $prefix.$key.'.') : $flat[$prefix.$key] = $value;
                    }
                };
                if (is_array($nested)) {
                    $walk($nested, '');
                }
            }
            if (file_exists($json)) {
                $flat = array_merge($flat, json_decode(file_get_contents($json), true) ?: []);
            }

            return $flat;
        };

        try {
            $result = \Illuminate\Support\Facades\Cache::rememberForever($cacheKey, $build);
        } catch (\Throwable $e) {
            $result = $build();
        }

        return $memo[$cacheKey] = $result;
    }

    private function pendingPaymentsFor(Request $request): int
    {
        if ($request->user()?->role !== 'admin') {
            return 0;
        }

        try {
            return \App\Models\Payment::where('status', 'pending')->count();
        } catch (\Throwable $e) {
            return 0;
        }
    }
    private function chatUnreadFor(Request $request): int
    {
        if ($request->user()?->role !== 'admin') {
            return 0;
        }

        try {
            return \Illuminate\Support\Facades\Schema::hasTable('chat_conversations')
                ? (int) \App\Models\ChatConversation::sum('admin_unread')
                : 0;
        } catch (\Throwable $e) {
            return 0;
        }
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // SetLocale (runs first) already picked the language from the session or the saved cookie.
        $locale = app()->getLocale();
        if (! in_array($locale, ['en', 'am', 'ti'], true)) {
            $locale = 'en';
            app()->setLocale($locale);
        }

        $translations = $this->translationsFor($locale);

        return [
            ...parent::share($request),
            'locale' => $locale,
            'translations' => $translations,
            'auth' => [
                'user' => $request->user(),
            ],
            
            // --- Smart Redirect Logic for Ziggy/Inertia ---
            'ziggy' => [
                'location' => $request->url(),
                'defaultRoute' => $request->user() ? match($request->user()->role) {
                    'admin' => route('admin.dashboard'),
                    'instructor' => route('instructor.dashboard'),
                    'student' => route('student.dashboard'),
                    default => route('home'),
                } : route('home'),
            ],
            
            // --- Flash messages ---
            'flash' => [
                'success' => $request->session()->get('success') ?? $request->session()->get('status'),
                'error' => $request->session()->get('error'),
            ],
            'status' => $request->session()->get('status') ?? $request->session()->get('success'),

            // --- Dynamic Payment Accounts (Bank & Telebirr) ---
            'payment_settings' => \App\Models\PaymentSetting::getSettings(),

            // --- Unread website-chat count (admins only, drives the sidebar badge) ---
            'chat_unread' => $this->chatUnreadFor($request),

            // --- Receipts waiting for admin verification (admins only, drives the Payments badge) ---
            'pending_payments' => fn () => $this->pendingPaymentsFor($request),

            // --- Dynamic Student Referral Program Settings ---
            'referral_settings' => \App\Models\ReferralSetting::getSettings(),
        ];
    }
}
