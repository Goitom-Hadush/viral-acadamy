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
        $locale = $request->session()->get('locale', 'en');
        if (!in_array($locale, ['en', 'am', 'ti'])) {
            $locale = 'en';
        }
        app()->setLocale($locale);

        $translations = [];
        $langFile = base_path("lang/{$locale}.json");
        if (file_exists($langFile)) {
            $translations = json_decode(file_get_contents($langFile), true) ?: [];
        }

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
