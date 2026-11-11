import { useT } from '@/hooks/useT';
import { Link } from '@inertiajs/react';

function TelegramIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
    );
}

function PhoneIcon({ className = 'h-5 w-5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.4 21 3 13.6 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.02l-2.2 2.19z" />
        </svg>
    );
}

function HelpIcon() {
    return (
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
            <span className="text-[11px] font-black leading-none">?</span>
        </span>
    );
}

function AndroidIcon({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.6 9.48l1.84-3.18c.16-.28.08-.64-.2-.8-.28-.16-.64-.08-.8.2L16.5 9.05A7.1 7.1 0 0012 7.9c-1.66 0-3.2.43-4.5 1.15L5.56 5.7c-.16-.28-.52-.36-.8-.2-.28.16-.36.52-.2.8L6.4 9.48C3.86 11.1 2.2 13.86 2 17h20c-.2-3.14-1.86-5.9-4.4-7.52zM8.5 14.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    );
}

function AppleIcon({ className = 'h-3.5 w-3.5' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.37 12.49c.03 3.07 2.69 4.09 2.72 4.1-.02.07-.43 1.46-1.41 2.89-.85 1.24-1.73 2.47-3.12 2.5-1.36.02-1.8-.81-3.36-.81-1.56 0-2.04.78-3.33.83-1.34.05-2.36-1.34-3.22-2.57-1.76-2.55-3.1-7.21-1.3-10.36.9-1.56 2.5-2.55 4.24-2.58 1.32-.03 2.57.89 3.36.89.8 0 2.29-1.1 3.86-.94.66.03 2.5.27 3.69 2.01-.1.06-2.2 1.29-2.13 3.84zM14.7 4.73c.71-.86 1.2-2.06 1.07-3.26-1.03.04-2.28.69-3.02 1.55-.66.76-1.24 1.98-1.08 3.14 1.14.09 2.31-.58 3.03-1.43z" />
        </svg>
    );
}

function CtaLink({ href, children, className }) {
    if (!href) {
        return <span className={className}>{children}</span>;
    }

    const external = /^https?:\/\//i.test(href) || href.startsWith('tel:') || href.startsWith('mailto:');
    if (external) {
        return (
            <a href={href} target={href.startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer" className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link href={href} className={className}>
            {children}
        </Link>
    );
}

function MiniAppButton({ platform, data, t }) {
    if (!data) return null;
    const href = data.download_url || data.store_url;
    if (!href) return null;

    const isAndroid = platform === 'android';
    const label = isAndroid ? t('apps.android_short', 'Android') : t('apps.ios_short', 'iOS');

    return (
        <a
            href={href}
            {...(data.download_url ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
            title={label}
            className={`inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold text-white shadow-md transition hover:opacity-90 sm:h-9 sm:gap-1.5 sm:px-3 sm:text-[11px] ${
                isAndroid ? 'bg-emerald-600' : 'bg-slate-900'
            }`}
        >
            {isAndroid ? <AndroidIcon /> : <AppleIcon />}
            <span>{label}</span>
        </a>
    );
}

const btnClass =
    'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-copper-600 px-3 text-[11px] font-bold text-white shadow-md transition hover:bg-copper-700 sm:h-9 sm:px-3.5 sm:text-xs';

const iconBtnClass =
    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-copper-600 text-white shadow-md transition hover:bg-copper-700 sm:h-9 sm:w-9';

/**
 * One banner: enrollment news + apps, with clear space between the two groups.
 */
export default function EnrollmentPromo({ announcement = null, appDownloads = null, sticky = false }) {
    const t = useT();

    const hasAnnouncement = !!announcement?.title;
    const hasApps = !!(appDownloads?.android || appDownloads?.ios);

    if (!hasAnnouncement && !hasApps) return null;

    const howLabel = t('home.how', 'How?');

    return (
        <div
            className={`enrollment-banner flex w-full flex-col gap-3 rounded-2xl px-3 py-2.5 sm:flex-row sm:items-center sm:gap-5 sm:rounded-[18px] sm:px-4 sm:py-3 ${
                sticky ? 'shadow-[0_12px_40px_-16px_rgba(184,115,51,0.55)] ring-1 ring-white/20' : ''
            }`}
        >
            {hasAnnouncement ? (
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1 text-center sm:text-left">
                        <p className="text-balance text-sm font-black tracking-tight text-white sm:text-base">
                            {announcement.title}
                        </p>
                        {announcement.subtitle ? (
                            <p className="mt-0.5 line-clamp-2 text-pretty text-[11px] leading-snug text-white/90 sm:text-xs">
                                {announcement.subtitle}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 sm:justify-end sm:gap-2">
                        <CtaLink href={announcement.cta_url || '/register'} className={btnClass}>
                            <span>{howLabel}</span>
                            <HelpIcon />
                        </CtaLink>

                        {announcement.telegram_url ? (
                            <a
                                href={announcement.telegram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('home.telegram', 'Telegram')}
                                className={iconBtnClass}
                            >
                                <TelegramIcon />
                            </a>
                        ) : null}

                        {announcement.phone_tel ? (
                            <a
                                href={announcement.phone_tel}
                                aria-label={announcement.phone || t('home.phone', 'Phone')}
                                className={iconBtnClass}
                            >
                                <PhoneIcon />
                            </a>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className="min-w-0 flex-1" />
            )}

            {hasApps ? (
                <div
                    className={`flex shrink-0 items-center justify-center gap-2 sm:justify-end ${
                        hasAnnouncement
                            ? 'border-t border-white/25 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0'
                            : ''
                    }`}
                >
                    <MiniAppButton platform="android" data={appDownloads.android} t={t} />
                    <MiniAppButton platform="ios" data={appDownloads.ios} t={t} />
                </div>
            ) : null}
        </div>
    );
}

export function EnrollmentBanner(props) {
    return <EnrollmentPromo {...props} />;
}

export function EnrollmentFabs() {
    return null;
}
