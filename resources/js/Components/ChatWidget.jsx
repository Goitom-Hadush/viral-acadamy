import { useT } from '@/hooks/useT';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

const TOKEN_KEY = 'slc_chat_token';
const NAME_KEY = 'slc_chat_name';
const CONTACT_KEY = 'slc_chat_contact';

function makeUuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    (crypto?.getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256))));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const h = [...bytes].map((b) => b.toString(16).padStart(2, '0'));
    return `${h.slice(0, 4).join('')}-${h.slice(4, 6).join('')}-${h.slice(6, 8).join('')}-${h.slice(8, 10).join('')}-${h.slice(10).join('')}`;
}

// Invitation popup state lives in memory, so a full page refresh always starts fresh
// (popup shows again), while clicking between pages inside the site respects a dismissal.
const invite = { silenced: false, shown: 0 };

function readStore(key) {
    try {
        return window.localStorage.getItem(key) || '';
    } catch {
        return '';
    }
}

function writeStore(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        /* storage may be blocked; chat still works for this page view */
    }
}

const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" />
    </svg>
);

const TelegramIcon = ({ className = 'h-5 w-5' }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.78 15.6l-.4 4.2c.57 0 .82-.25 1.12-.54l2.7-2.58 5.6 4.1c1.03.57 1.76.27 2.04-.95l3.7-17.3c.34-1.52-.55-2.12-1.55-1.75L1.2 10.1c-1.48.58-1.46 1.4-.27 1.77l5.6 1.75L19.5 5.4c.6-.4 1.16-.18.7.22L9.78 15.6z" />
    </svg>
);

function Channels({ whatsapp, telegram, big = false }) {
    if (!whatsapp && !telegram) return null;

    const base = big
        ? 'flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 active:scale-95'
        : 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 active:scale-95';

    return (
        <div className={big ? 'flex gap-2' : 'flex flex-wrap items-center gap-2'}>
            {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${base} bg-[#25D366]`}>
                    <WhatsAppIcon className={big ? 'h-5 w-5' : 'h-4 w-4'} />
                    WhatsApp
                </a>
            ) : null}
            {telegram ? (
                <a href={telegram} target="_blank" rel="noopener noreferrer" className={`${base} bg-[#229ED9]`}>
                    <TelegramIcon className={big ? 'h-5 w-5' : 'h-4 w-4'} />
                    Telegram
                </a>
            ) : null}
        </div>
    );
}

export default function ChatWidget() {
    const t = useT();
    const { url = '/', announcement = null } = usePage().props;
    const pageUrl = usePage().url || url;

    const [token, setToken] = useState('');
    const [open, setOpen] = useState(false);
    const [rendered, setRendered] = useState(false); // stays true briefly after closing so the exit animation can play
    const [teaser, setTeaser] = useState(false);
    const [state, setState] = useState(null);
    const [draft, setDraft] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const listRef = useRef(null);
    const closeTimer = useRef(null);
    const openedAt = useRef(0);

    const openChat = () => {
        clearTimeout(closeTimer.current);
        openedAt.current = Date.now();
        setTeaser(false);
        invite.silenced = true;
        setError('');
        setRendered(true);
        setOpen(true);
    };

    const closeChat = () => {
        setOpen(false);
        closeTimer.current = setTimeout(() => setRendered(false), 220);
    };

    // Once the visitor closes the invitation or opens the chat, stop inviting them until the next refresh.
    const silenceInvite = () => {
        setTeaser(false);
        invite.silenced = true;
    };

    const dismissTeaser = silenceInvite;

    // Quick topic buttons: open the chat with a ready-to-send question.
    const askAbout = (question) => {
        setDraft(question);
        openChat();
    };

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    // One-time browser setup: visitor token + remembered name/contact.
    useEffect(() => {
        let tk = readStore(TOKEN_KEY);
        if (!/^[0-9a-f-]{36}$/i.test(tk)) {
            tk = makeUuid();
            writeStore(TOKEN_KEY, tk);
        }
        setToken(tk);
        setName(readStore(NAME_KEY));
        setContact(readStore(CONTACT_KEY));
    }, []);

    const load = useCallback(
        async (isOpen) => {
            if (!token) return;
            try {
                const { data } = await axios.get(route('chat.state'), {
                    params: { token, open: isOpen ? 1 : 0 },
                });
                setState(data);
            } catch {
                /* network hiccup: keep the last known state */
            }
        },
        [token],
    );

    const hasConversation = !!state?.has_conversation;

    // Poll: fast while open, slow in the background so the unread badge stays fresh.
    useEffect(() => {
        if (!token) return undefined;
        const tick = () => {
            if (!document.hidden) load(open);
        };
        tick();
        const id = setInterval(tick, open ? 4000 : hasConversation ? 20000 : 60000);
        return () => clearInterval(id);
    }, [token, open, hasConversation, load]);

    // Invitation popup: shown on EVERY page load/refresh, for new and returning visitors alike.
    // Appears shortly after load, stays 20s, and returns (max 3 times per load) until the visitor
    // closes it or opens the chat.
    const chatEnabled = !!state?.enabled;
    useEffect(() => {
        if (!chatEnabled || open || invite.silenced || invite.shown >= 3) return undefined;

        const timers = [];
        for (let k = 0; k < 3 - invite.shown; k += 1) {
            const showAt = 2500 + k * 80000;
            timers.push(
                setTimeout(() => {
                    if (invite.silenced) return;
                    invite.shown += 1;
                    setTeaser(true);
                }, showAt),
            );
            timers.push(setTimeout(() => setTeaser(false), showAt + 20000));
        }

        return () => timers.forEach(clearTimeout);
    }, [chatEnabled, open]);

    // Keep the newest message in view.
    useEffect(() => {
        if (open && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [open, state?.messages?.length]);

    const send = async (e) => {
        e?.preventDefault();
        const body = draft.trim();
        if (!body || sending) return;

        setSending(true);
        setError('');
        try {
            const { data } = await axios.post(route('chat.send'), {
                token,
                body,
                name: (name || state?.prefill?.name || '').trim(),
                contact: (contact || state?.prefill?.contact || '').trim(),
            });
            setState(data);
            setDraft('');
            if (name) writeStore(NAME_KEY, name.trim());
            if (contact) writeStore(CONTACT_KEY, contact.trim());
        } catch (err) {
            const errors = err.response?.data?.errors;
            const first = errors ? Object.values(errors)[0]?.[0] : null;
            setError(first || err.response?.data?.message || t('chat.error', 'Could not send. Please try again.'));
        } finally {
            setSending(false);
        }
    };

    if (!state || state.enabled === false) return null;

    const online = !!state.online;
    const unread = !open ? state.unread || 0 : 0;
    const needsIdentity = !hasConversation;
    const askName = needsIdentity && !state.prefill?.name;
    const askContact = needsIdentity && !state.prefill?.contact;
    const intro = online ? state.welcome_message : state.offline_message;
    const messages = state.messages || [];

    // Sit above the homepage enrollment banner so we never cover its close button.
    const lifted = pageUrl === '/' && !!announcement?.title;
    const pos = lifted ? 'bottom-[9.5rem] sm:bottom-28' : 'bottom-20 sm:bottom-6';
    const panelPos = lifted ? 'bottom-[14.5rem] sm:bottom-44' : 'bottom-36 sm:bottom-24';

    return (
        <>
            {rendered && (
                <div
                    role="dialog"
                    aria-label={t('chat.title', 'Chat with us')}
                    className={`fixed right-4 sm:right-6 ${panelPos} z-[60] flex max-h-[min(34rem,calc(100vh-9rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-copper-200 bg-white shadow-[0_24px_70px_-20px_rgba(0,65,1,0.45)] ${open ? 'chat-pop-in' : 'chat-pop-out pointer-events-none'} sm:w-[24rem]`}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-copper-700 via-copper-600 to-bronze px-4 py-3.5 text-white">
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg">
                            💬
                            {online && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 animate-ping rounded-full bg-emerald-300 opacity-70 motion-reduce:animate-none" />
                            )}
                            <span
                                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-copper-700 ${online ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">Success Life Coaching</p>
                            <p className="text-xs text-copper-100">
                                {online
                                    ? t('chat.online', 'Online · replies here')
                                    : t('chat.offline', 'Away · leave a message')}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeChat}
                            aria-label={t('chat.close', 'Close chat')}
                            className="group flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
                        >
                            <svg className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={listRef}
                        aria-live="polite"
                        className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-copper-50/40 px-4 py-4"
                    >
                        {intro ? (
                            <div
                                className="chat-msg-in-left max-w-[88%] rounded-2xl rounded-tl-md border border-copper-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm"
                                style={{ animationDelay: '120ms' }}
                            >
                                {intro}
                            </div>
                        ) : null}

                        {!online && (
                            <div
                                className="chat-msg-in-left rounded-2xl border border-copper-100 bg-white p-3 shadow-sm"
                                style={{ animationDelay: '240ms' }}
                            >
                                <p className="mb-2 text-xs font-semibold text-slate-600">
                                    {t('chat.direct', 'Need a faster reply? Message us directly:')}
                                </p>
                                <Channels whatsapp={state.whatsapp_url} telegram={state.telegram_url} big />
                            </div>
                        )}

                        {messages.map((m, i) => {
                            const mine = m.sender === 'visitor';
                            // Stagger history only while the panel is first opening; later messages pop in instantly.
                            const stagger = Date.now() - openedAt.current < 700 ? 300 + Math.min(i, 8) * 55 : 0;
                            return (
                                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        style={{ animationDelay: `${stagger}ms` }}
                                        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                                            mine
                                                ? 'chat-msg-in-right rounded-br-md bg-gradient-to-br from-copper-600 to-copper-700 text-white'
                                                : 'chat-msg-in-left rounded-tl-md border border-copper-100 bg-white text-slate-700'
                                        }`}
                                    >
                                        {m.body}
                                        <span className={`mt-1 block text-[10px] ${mine ? 'text-copper-100' : 'text-slate-400'}`}>
                                            {m.created_at
                                                ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {hasConversation && !online && messages.length > 0 && (
                            <p className="text-center text-xs text-slate-400">
                                {t('chat.sent_note', 'Message received. We will reply here and on your contact.')}
                            </p>
                        )}
                    </div>

                    {/* Composer */}
                    <form onSubmit={send} className="border-t border-copper-100 bg-white p-3">
                        {(askName || askContact) && (
                            <div className="mb-2 grid gap-2 sm:grid-cols-2">
                                {askName && (
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        maxLength={100}
                                        placeholder={t('chat.name', 'Your name')}
                                        aria-label={t('chat.name', 'Your name')}
                                        autoComplete="name"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-copper-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-copper-500/15"
                                    />
                                )}
                                {askContact && (
                                    <input
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        maxLength={120}
                                        placeholder={
                                            online
                                                ? t('chat.contact_optional', 'Phone or email (optional)')
                                                : t('chat.contact', 'Phone or email')
                                        }
                                        aria-label={t('chat.contact', 'Phone or email')}
                                        autoComplete="tel"
                                        className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-copper-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-copper-500/15 ${askName ? '' : 'sm:col-span-2'}`}
                                    />
                                )}
                            </div>
                        )}

                        {error && (
                            <p role="alert" className="mb-2 text-xs font-medium text-rose-600">
                                {error}
                            </p>
                        )}

                        <div className="flex items-end gap-2">
                            <textarea
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) send(e);
                                }}
                                rows={1}
                                maxLength={1000}
                                placeholder={t('chat.placeholder', 'Type your message…')}
                                aria-label={t('chat.placeholder', 'Type your message…')}
                                className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-copper-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-copper-500/15"
                            />
                            <button
                                type="submit"
                                disabled={sending || !draft.trim()}
                                aria-label={t('chat.send', 'Send')}
                                className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-copper-600 to-copper-800 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sending ? (
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-disabled:translate-x-0 group-disabled:translate-y-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {online && (state.whatsapp_url || state.telegram_url) && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-400">
                                    {t('chat.or', 'Or message us on')}
                                </span>
                                <Channels whatsapp={state.whatsapp_url} telegram={state.telegram_url} />
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Floating launcher + teaser */}
            <div className={`fixed right-4 sm:right-6 ${pos} z-[60] flex flex-col items-end gap-3`}>
                {teaser && !open && (
                    <div
                        role="dialog"
                        aria-label={t('chat.invite_label', 'Chat invitation')}
                        className="chat-popup-in relative w-[18rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-copper-100 bg-white shadow-[0_18px_50px_-12px_rgba(0,65,1,0.45)]"
                    >
                        <div className="flex items-center gap-2.5 bg-gradient-to-r from-copper-700 to-bronze px-4 py-2.5 pr-11 text-white">
                            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-base" aria-hidden="true">
                                💬
                                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-copper-700 ${online ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-xs font-bold">Success Life Coaching</span>
                                <span className="block text-[10px] text-copper-100">
                                    {online ? t('chat.online_short', 'Online now') : t('chat.offline_short', 'Away · we reply soon')}
                                </span>
                            </span>
                        </div>

                        <div className="space-y-3 p-4">
                            <p className="text-sm font-semibold leading-relaxed text-slate-800">
                                <span className="mr-1 inline-block animate-bounce motion-reduce:animate-none" aria-hidden="true">👋</span>
                                {hasConversation
                                    ? t('chat.invite_back', 'Welcome back! Need any more information? Continue your chat with us.')
                                    : online
                                      ? t('chat.invite_online', 'Hi! Need any information? Chat with us, we are online and happy to help.')
                                      : t('chat.invite_offline', 'Hi! Need any information? Leave us a message and we will get back to you soon.')}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { label: t('chat.topic_courses', '📚 Course info'), q: 'Hello, I would like some information about your courses.' },
                                    { label: t('chat.topic_pay', '💳 How to pay'), q: 'Hello, how can I pay and enroll in a course?' },
                                    { label: t('chat.topic_cert', '🎓 Certificate'), q: 'Hello, how do I get a certificate after finishing a course?' },
                                ].map((topic) => (
                                    <button
                                        key={topic.q}
                                        type="button"
                                        onClick={() => askAbout(topic.q)}
                                        className="rounded-full border border-copper-200 bg-copper-50 px-3 py-1.5 text-xs font-semibold text-copper-800 transition hover:-translate-y-0.5 hover:border-copper-400 hover:bg-copper-100 active:scale-95"
                                    >
                                        {topic.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={openChat}
                                className="w-full rounded-xl bg-gradient-to-r from-copper-600 to-copper-800 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                            >
                                {hasConversation
                                    ? t('chat.open_chat', 'Open chat')
                                    : online
                                      ? t('chat.start_now', 'Start chat')
                                      : t('chat.leave_msg', 'Leave a message')}
                            </button>
                        </div>

                        <button
                            type="button"
                            aria-label={t('chat.dismiss', 'Dismiss')}
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissTeaser();
                            }}
                            className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="chat-launcher-in relative">
                    {/* Soft pulsing ring to draw the eye while the chat is closed */}
                    {!open && (unread > 0 || online) && (
                        <span
                            aria-hidden="true"
                            className="chat-ring pointer-events-none absolute inset-0 rounded-full bg-copper-500"
                        />
                    )}

                <button
                type="button"
                onClick={open ? closeChat : openChat}
                aria-label={open ? t('chat.close', 'Close chat') : t('chat.title', 'Chat with us')}
                aria-expanded={open}
                className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-copper-600 to-copper-800 px-4 py-3.5 text-white shadow-[0_14px_40px_-10px_rgba(0,65,1,0.65)] ring-4 ring-white/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-8px_rgba(0,65,1,0.75)] active:scale-95"
            >
                <span
                    className={`relative flex h-6 w-6 items-center justify-center ${
                        !open && (unread > 0 || !hasConversation) ? 'chat-wiggle' : ''
                    }`}
                >
                    <svg
                        className={`absolute h-6 w-6 transition-all duration-300 ${open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <svg
                        className={`absolute h-6 w-6 transition-all duration-300 ${open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
                <span className="hidden text-sm font-bold sm:inline">
                    {open ? t('chat.hide', 'Hide') : t('chat.title', 'Chat with us')}
                </span>

                {!open && (
                    <span
                        className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${online ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    />
                )}
                {unread > 0 && (
                    <span
                        key={unread}
                        className="chat-badge-pop absolute -left-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-black text-white shadow"
                    >
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>
                </div>
            </div>
        </>
    );
}
