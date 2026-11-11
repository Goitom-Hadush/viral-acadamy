import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useT } from '@/hooks/useT';

function absoluteUrl(pathOrUrl, appUrl) {
    if (!pathOrUrl) {
        if (typeof window !== 'undefined') return window.location.href;
        return appUrl || '';
    }
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    const base = (appUrl || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
    return `${base}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export default function SocialShare({
    url = '',
    title = '',
    text = '',
    compact = false,
    className = '',
    label,
}) {
    const { appUrl } = usePage().props;
    const t = useT();
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(!compact);

    const shareUrl = absoluteUrl(url, appUrl);
    const shareTitle = title || 'Success Life Coaching Academy';
    const shareText = text || shareTitle;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const encodedTitle = encodeURIComponent(shareTitle);

    const channels = [
        {
            key: 'facebook',
            label: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            className: 'bg-[#1877F2] text-white hover:brightness-110',
        },
        {
            key: 'telegram',
            label: 'Telegram',
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`,
            className: 'bg-[#229ED9] text-white hover:brightness-110',
        },
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            href: `https://wa.me/?text=${encodedText}`,
            className: 'bg-[#25D366] text-white hover:brightness-110',
        },
        {
            key: 'x',
            label: 'X',
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            className: 'bg-slate-900 text-white hover:brightness-110',
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const nativeShare = async () => {
        if (!navigator.share) {
            setOpen(true);
            return;
        }
        try {
            await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        } catch {
            // user cancelled
        }
    };

    const heading = label || t('share.label', 'Share');

    if (compact) {
        return (
            <div className={`relative ${className}`.trim()}>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (navigator.share) {
                            nativeShare();
                        } else {
                            setOpen((v) => !v);
                        }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
                    aria-label={heading}
                >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                    </svg>
                    {heading}
                </button>

                {open ? (
                    <div
                        className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <div className="grid gap-1.5">
                            {channels.map((channel) => (
                                <a
                                    key={channel.key}
                                    href={channel.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`rounded-xl px-3 py-2 text-left text-xs font-semibold ${channel.className}`}
                                >
                                    {channel.label}
                                </a>
                            ))}
                            <button
                                type="button"
                                onClick={copyLink}
                                className="rounded-xl bg-copper-50 px-3 py-2 text-left text-xs font-semibold text-copper-800"
                            >
                                {copied ? t('share.copied', 'Copied!') : t('share.copy', 'Copy link')}
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    return (
        <div
            className={`rounded-2xl border border-copper-100 bg-white/90 p-4 ${className}`.trim()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">{heading}</p>
                {typeof navigator !== 'undefined' && navigator.share ? (
                    <button
                        type="button"
                        onClick={nativeShare}
                        className="text-xs font-semibold text-copper-700 hover:text-copper-900"
                    >
                        {t('share.more', 'More…')}
                    </button>
                ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
                {channels.map((channel) => (
                    <a
                        key={channel.key}
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold shadow-sm transition ${channel.className}`}
                    >
                        {channel.label}
                    </a>
                ))}
                <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center rounded-full bg-copper-50 px-3.5 py-2 text-xs font-semibold text-copper-800 ring-1 ring-copper-100 transition hover:bg-copper-100"
                >
                    {copied ? t('share.copied', 'Copied!') : t('share.copy', 'Copy link')}
                </button>
            </div>
        </div>
    );
}
