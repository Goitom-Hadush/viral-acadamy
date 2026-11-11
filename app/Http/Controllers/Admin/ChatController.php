<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

/**
 * Admin inbox for the website chat. Route group already enforces auth + role:admin.
 */
class ChatController extends Controller
{
    public function index()
    {
        $ready = Schema::hasTable('chat_settings');

        return Inertia::render('Admin/Chat/Index', [
            'settings' => $ready ? ChatSetting::getSettings() : null,
            'migrations_missing' => ! $ready,
        ]);
    }

    /** Polled by the inbox: conversation list plus the open thread. */
    public function data(Request $request): JsonResponse
    {
        $conversations = ChatConversation::with('latestMessage')
            ->orderByDesc('last_message_at')
            ->limit(100)
            ->get()
            ->map(fn (ChatConversation $c) => [
                'id' => $c->id,
                'name' => $c->name ?: 'Visitor',
                'contact' => $c->contact,
                'is_member' => (bool) $c->user_id,
                'admin_unread' => $c->admin_unread,
                'preview' => $c->latestMessage?->body,
                'preview_sender' => $c->latestMessage?->sender,
                'last_message_at' => $c->last_message_at?->toIso8601String(),
            ]);

        $messages = [];
        $selectedId = $request->integer('conversation');

        if ($selectedId) {
            $selected = ChatConversation::find($selectedId);

            if ($selected) {
                if ($selected->admin_unread > 0) {
                    $selected->forceFill(['admin_unread' => 0])->save();
                }

                $messages = $selected->messages()->orderBy('id')->limit(300)->get()
                    ->map(fn ($m) => $m->toPayload())->all();
            }
        }

        return response()->json([
            'conversations' => $conversations,
            'messages' => $messages,
            'total_unread' => (int) ChatConversation::sum('admin_unread'),
        ]);
    }

    public function reply(Request $request, ChatConversation $conversation): JsonResponse
    {
        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        $message = $conversation->messages()->create([
            'sender' => 'admin',
            'body' => trim($data['body']),
        ]);

        $conversation->increment('visitor_unread');
        $conversation->forceFill(['last_message_at' => now(), 'admin_unread' => 0])->save();

        return response()->json(['message' => $message->toPayload()]);
    }

    public function destroy(ChatConversation $conversation)
    {
        $conversation->delete();

        return response()->json(['deleted' => true]);
    }

    public function toggleOnline(Request $request): JsonResponse
    {
        $data = $request->validate(['is_online' => ['required', 'boolean']]);

        $settings = ChatSetting::getSettings();
        $settings->update(['is_online' => $data['is_online']]);

        return response()->json(['is_online' => $settings->is_online]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'whatsapp_number' => ['nullable', 'string', 'max:40'],
            'telegram_url' => ['nullable', 'string', 'max:500'],
            'welcome_message' => ['nullable', 'string', 'max:500'],
            'offline_message' => ['nullable', 'string', 'max:500'],
        ]);

        ChatSetting::getSettings()->update($data);

        return redirect()->back()->with('success', 'Chat settings saved.');
    }
}
