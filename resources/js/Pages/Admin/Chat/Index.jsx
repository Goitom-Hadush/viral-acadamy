import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

function timeLabel(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString()
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ChatIndex({ settings = null, migrations_missing = false }) {
    const { flash = {} } = usePage().props;

    const [online, setOnline] = useState(!!settings?.is_online);
    const [conversations, setConversations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [replyError, setReplyError] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const threadRef = useRef(null);

    const form = useForm({
        whatsapp_number: settings?.whatsapp_number || '',
        telegram_url: settings?.telegram_url || '',
        welcome_message: settings?.welcome_message || '',
        offline_message: settings?.offline_message || '',
    });

    const load = useCallback(async () => {
        if (migrations_missing) return;
        try {
            const { data } = await axios.get(route('admin.chat.data'), {
                params: { conversation: selectedId || undefined },
            });
            setConversations(data.conversations);
            if (selectedId) setMessages(data.messages);
        } catch {
            /* keep last state on network errors */
        }
    }, [selectedId, migrations_missing]);

    useEffect(() => {
        load();
        const id = setInterval(() => {
            if (!document.hidden) load();
        }, 4000);
        return () => clearInterval(id);
    }, [load]);

    useEffect(() => {
        if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }, [selectedId, messages.length]);

    const selected = conversations.find((c) => c.id === selectedId) || null;

    const toggleOnline = async () => {
        const next = !online;
        setOnline(next);
        try {
            await axios.patch(route('admin.chat.online'), { is_online: next });
        } catch {
            setOnline(!next);
        }
    };

    const sendReply = async (e) => {
        e?.preventDefault();
        const body = reply.trim();
        if (!body || !selectedId || sending) return;

        setSending(true);
        setReplyError('');
        try {
            const { data } = await axios.post(route('admin.chat.reply', selectedId), { body });
            setMessages((m) => [...m, data.message]);
            setReply('');
            load();
        } catch (err) {
            setReplyError(err.response?.data?.message || 'Could not send the reply.');
        } finally {
            setSending(false);
        }
    };

    const removeConversation = async () => {
        if (!selectedId || !window.confirm('Delete this conversation permanently?')) return;
        try {
            await axios.delete(route('admin.chat.destroy', selectedId));
            setSelectedId(null);
            setMessages([]);
            load();
        } catch {
            /* ignore */
        }
    };

    const saveSettings = (e) => {
        e.preventDefault();
        form.put(route('admin.chat.settings'), { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Live Chat | Admin" />

            <div className="mb-6 flex flex-col gap-4 rounded-3xl hero-gradient p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Support</p>
                    <h1 className="mt-2 text-3xl font-black sm:text-4xl">Live Chat Inbox</h1>
                    <p className="mt-2 max-w-xl text-copper-100">
                        Reply to visitors in real time. When you are away, the widget collects messages and points people to WhatsApp and Telegram.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={toggleOnline}
                    disabled={migrations_missing}
                    role="switch"
                    aria-checked={online}
                    className={`inline-flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
                        online ? 'border-emerald-300 bg-emerald-400/20' : 'border-white/30 bg-white/10'
                    }`}
                >
                    <span
                        className={`relative h-6 w-11 rounded-full transition ${online ? 'bg-emerald-400' : 'bg-white/30'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${online ? 'left-[1.375rem]' : 'left-0.5'}`}
                        />
                    </span>
                    {online ? 'I am online' : 'I am away'}
                </button>
            </div>

            {flash.success ? (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {flash.success}
                </div>
            ) : null}

            {migrations_missing ? (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    Run <code className="font-mono">php artisan migrate</code> to enable live chat.
                </div>
            ) : (
                <>
                    {/* Settings */}
                    <div className="surface-card mb-6 overflow-hidden !translate-y-0">
                        <button
                            type="button"
                            onClick={() => setShowSettings((v) => !v)}
                            aria-expanded={showSettings}
                            className="flex w-full items-center justify-between px-6 py-4 text-left"
                        >
                            <span>
                                <span className="block text-base font-bold text-slate-900">Chat settings</span>
                                <span className="block text-xs text-slate-500">WhatsApp number, Telegram link and the messages visitors see</span>
                            </span>
                            <svg
                                className={`h-5 w-5 text-slate-400 transition ${showSettings ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {showSettings && (
                            <form onSubmit={saveSettings} className="space-y-4 border-t border-slate-100 p-6">
                                <FormErrors errors={form.errors} />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">WhatsApp number</label>
                                        <input
                                            className="input-modern"
                                            value={form.data.whatsapp_number}
                                            onChange={(e) => form.setData('whatsapp_number', e.target.value)}
                                            placeholder="0911 000 000 or +251911000000"
                                        />
                                        <p className="mt-1 text-xs text-slate-400">Numbers starting with 0 are converted to +251 automatically.</p>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Telegram</label>
                                        <input
                                            className="input-modern"
                                            value={form.data.telegram_url}
                                            onChange={(e) => form.setData('telegram_url', e.target.value)}
                                            placeholder="@username or https://t.me/username"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Greeting when online</label>
                                    <input
                                        className="input-modern"
                                        maxLength={500}
                                        value={form.data.welcome_message}
                                        onChange={(e) => form.setData('welcome_message', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Message when away</label>
                                    <input
                                        className="input-modern"
                                        maxLength={500}
                                        value={form.data.offline_message}
                                        onChange={(e) => form.setData('offline_message', e.target.value)}
                                    />
                                </div>
                                <button type="submit" disabled={form.processing} className="btn-primary">
                                    {form.processing ? 'Saving…' : 'Save chat settings'}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Inbox */}
                    <div className="surface-card grid h-[34rem] overflow-hidden !translate-y-0 lg:grid-cols-[20rem_1fr]">
                        {/* Conversation list */}
                        <div className={`flex-col border-r border-slate-100 ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
                            <div className="border-b border-slate-100 px-5 py-3.5">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                    Conversations ({conversations.length})
                                </h2>
                            </div>
                            <ul className="scrollbar-thin flex-1 divide-y divide-slate-100 overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <li className="p-8 text-center text-sm text-slate-500">
                                        No messages yet. They will appear here as visitors write in.
                                    </li>
                                ) : (
                                    conversations.map((c) => (
                                        <li key={c.id}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedId(c.id)}
                                                className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-copper-50/60 ${
                                                    c.id === selectedId ? 'bg-copper-50' : ''
                                                }`}
                                            >
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-copper-600 to-bronze text-sm font-bold text-white">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="flex items-center justify-between gap-2">
                                                        <span className="truncate text-sm font-bold text-slate-900">{c.name}</span>
                                                        <span className="shrink-0 text-[11px] text-slate-400">{timeLabel(c.last_message_at)}</span>
                                                    </span>
                                                    <span className="mt-0.5 flex items-center justify-between gap-2">
                                                        <span className={`truncate text-xs ${c.admin_unread ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                                                            {c.preview_sender === 'admin' ? 'You: ' : ''}
                                                            {c.preview}
                                                        </span>
                                                        {c.admin_unread > 0 && (
                                                            <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-black text-white">
                                                                {c.admin_unread}
                                                            </span>
                                                        )}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Thread */}
                        <div className={`min-h-0 flex-col ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
                            {!selected ? (
                                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                                    <div className="mb-3 text-5xl">💬</div>
                                    <p className="font-bold text-slate-800">Select a conversation</p>
                                    <p className="mt-1 text-sm text-slate-500">Choose a visitor on the left to read and reply.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(null)}
                                            aria-label="Back to conversations"
                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-slate-900">
                                                {selected.name}
                                                {selected.is_member && (
                                                    <span className="ml-2 rounded-full bg-copper-100 px-2 py-0.5 text-[10px] font-bold uppercase text-copper-700">
                                                        Member
                                                    </span>
                                                )}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">{selected.contact || 'No contact left'}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeConversation}
                                            className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <div ref={threadRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-copper-50/40 px-5 py-4">
                                        {messages.map((m) => {
                                            const mine = m.sender === 'admin';
                                            return (
                                                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                                    <div
                                                        className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                                            mine
                                                                ? 'rounded-br-md bg-gradient-to-br from-copper-600 to-copper-700 text-white'
                                                                : 'rounded-tl-md border border-copper-100 bg-white text-slate-700'
                                                        }`}
                                                    >
                                                        {m.body}
                                                        <span className={`mt-1 block text-[10px] ${mine ? 'text-copper-100' : 'text-slate-400'}`}>
                                                            {timeLabel(m.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <form onSubmit={sendReply} className="border-t border-slate-100 p-3">
                                        {replyError && <p role="alert" className="mb-2 text-xs font-medium text-rose-600">{replyError}</p>}
                                        <div className="flex items-end gap-2">
                                            <textarea
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) sendReply(e);
                                                }}
                                                rows={1}
                                                maxLength={2000}
                                                placeholder="Write a reply… (Enter to send)"
                                                aria-label="Reply"
                                                className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-copper-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-copper-500/15"
                                            />
                                            <button type="submit" disabled={sending || !reply.trim()} className="btn-primary !min-h-[2.75rem] !px-5">
                                                {sending ? 'Sending…' : 'Send'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
