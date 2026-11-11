<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

/**
 * Visitor-facing chat (floating widget). Works for guests and logged-in users.
 * A visitor is identified by a random UUID token kept in their browser.
 */
class ChatController extends Controller
{
    public function state(Request $request): JsonResponse
    {
        if (! Schema::hasTable('chat_settings')) {
            return response()->json(['enabled' => false]);
        }

        $token = $this->cleanToken($request->query('token'));
        $conversation = $token
            ? ChatConversation::where('visitor_token', $token)->first()
            : null;

        // Widget is open: the visitor has now seen the admin's replies.
        if ($conversation && $request->boolean('open') && $conversation->visitor_unread > 0) {
            $conversation->forceFill(['visitor_unread' => 0])->save();
        }

        return response()->json($this->payload(ChatSetting::getSettings(), $conversation, $request));
    }

    public function send(Request $request): JsonResponse
    {
        if (! Schema::hasTable('chat_settings')) {
            abort(503, 'Chat is not available yet.');
        }

        $data = $request->validate([
            'token' => ['required', 'uuid'],
            'body' => ['required', 'string', 'max:1000'],
            'name' => ['nullable', 'string', 'max:100'],
            'contact' => ['nullable', 'string', 'max:120'],
        ]);

        $body = trim($data['body']);
        if ($body === '') {
            throw ValidationException::withMessages(['body' => 'Please type a message.']);
        }

        $settings = ChatSetting::getSettings();
        $user = $request->user();

        $conversation = DB::transaction(function () use ($data, $body, $settings, $user) {
            $conversation = ChatConversation::where('visitor_token', $data['token'])->lockForUpdate()->first();

            if (! $conversation) {
                $name = trim((string) ($data['name'] ?? '')) ?: ($user?->name);
                $contact = trim((string) ($data['contact'] ?? '')) ?: ($user?->phone ?: $user?->email);

                if (! $name) {
                    throw ValidationException::withMessages(['name' => 'Please tell us your name.']);
                }

                // Offline messages need a way to reach the visitor.
                if (! $settings->is_online && ! $contact) {
                    throw ValidationException::withMessages([
                        'contact' => 'Please add your phone or email so we can reply.',
                    ]);
                }

                $conversation = ChatConversation::create([
                    'visitor_token' => $data['token'],
                    'user_id' => $user?->id,
                    'name' => $name,
                    'contact' => $contact,
                    'admin_unread' => 0,
                    'visitor_unread' => 0,
                ]);
            }

            $conversation->messages()->create(['sender' => 'visitor', 'body' => $body]);

            $conversation->increment('admin_unread');
            $conversation->forceFill(['last_message_at' => now()])->save();

            return $conversation;
        });

        return response()->json($this->payload($settings, $conversation->fresh(), $request));
    }

    private function payload(ChatSetting $settings, ?ChatConversation $conversation, Request $request): array
    {
        $user = $request->user();

        return [
            'enabled' => true,
            'online' => (bool) $settings->is_online,
            'welcome_message' => $settings->welcome_message,
            'offline_message' => $settings->offline_message,
            'whatsapp_url' => $settings->whatsappUrl(),
            'telegram_url' => $settings->telegramLink(),
            'prefill' => [
                'name' => $user?->name,
                'contact' => $user ? ($user->phone ?: $user->email) : null,
            ],
            'has_conversation' => (bool) $conversation,
            'unread' => $conversation?->visitor_unread ?? 0,
            'messages' => $conversation
                ? $conversation->messages()->latest('id')->limit(100)->get()->reverse()->values()
                    ->map(fn ($m) => $m->toPayload())->all()
                : [],
        ];
    }

    private function cleanToken(mixed $token): ?string
    {
        return is_string($token) && preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $token)
            ? strtolower($token)
            : null;
    }
}
