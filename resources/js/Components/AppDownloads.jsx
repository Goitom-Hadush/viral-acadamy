import { useT } from '@/hooks/useT';

function AndroidIcon({ className = 'h-6 w-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.6 9.48l1.84-3.18c.16-.28.08-.64-.2-.8-.28-.16-.64-.08-.8.2L16.5 9.05A7.1 7.1 0 0012 7.9c-1.66 0-3.2.43-4.5 1.15L5.56 5.7c-.16-.28-.52-.36-.8-.2-.28.16-.36.52-.2.8L6.4 9.48C3.86 11.1 2.2 13.86 2 17h20c-.2-3.14-1.86-5.9-4.4-7.52zM8.5 14.5a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
    );
}

function AppleIcon({ className = 'h-6 w-6' }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16.37 12.49c.03 3.07 2.69 4.09 2.72 4.1-.02.07-.43 1.46-1.41 2.89-.85 1.24-1.73 2.47-3.12 2.5-1.36.02-1.8-.81-3.36-.81-1.56 0-2.04.78-3.33.83-1.34.05-2.36-1.34-3.22-2.57-1.76-2.55-3.1-7.21-1.3-10.36.9-1.56 2.5-2.55 4.24-2.58 1.32-.03 2.57.89 3.36.89.8 0 2.29-1.1 3.86-.94.66.03 2.5.27 3.69 2.01-.1.06-2.2 1.29-2.13 3.84zM14.7 4.73c.71-.86 1.2-2.06 1.07-3.26-1.03.04-2.28.69-3.02 1.55-.66.76-1.24 1.98-1.08 3.14 1.14.09 2.31-.58 3.03-1.43z" />
        </svg>
    );
}

function DownloadCard({ platform, data, t }) {
    if (!data) return null;

    const isAndroid = platform === 'android';
    const href = data.download_url || data.store_url;
    if (!href) return null;

    const label = isAndroid
        ? t('apps.download_android', 'Download Android')
        : t('apps.download_ios', 'Download iOS');

    const hint = data.download_url
        ? t('apps.install_hint', 'Download & install')
        : t('apps.open_store', 'Open store');

    return (
        <a
            href={href}
            {...(data.download_url ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
            className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                isAndroid
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-white text-emerald-900'
                    : 'border-sky-200 bg-gradient-to-r from-sky-50 to-white text-sky-950'
            }`}
        >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${isAndroid ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                {isAndroid ? <AndroidIcon /> : <AppleIcon />}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-black">{label}</span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                    {hint}
                    {data.version ? ` · v${data.version}` : ''}
                </span>
            </span>
            <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${isAndroid ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                {t('apps.get', 'Get')}
            </span>
        </a>
    );
}

export default function AppDownloads({ appDownloads = null }) {
    const t = useT();

    if (!appDownloads?.android && !appDownloads?.ios) return null;

    return (
        <section className="section-shell mb-3 sm:mb-4" aria-label={t('apps.label', 'Mobile apps')}>
            <div className="rounded-2xl border border-copper-100 bg-white/80 p-3 shadow-[0_10px_30px_-22px_rgba(0,65,1,0.3)] backdrop-blur sm:p-4">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-copper-700">
                            {t('apps.eyebrow', 'Install our app')}
                        </p>
                        <h2 className="text-base font-black text-slate-900 sm:text-lg">
                            {appDownloads.title || t('apps.title', 'Get the Success Life Coaching app')}
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500">
                        {t('apps.sub', 'Download for Android or iOS and start learning on your phone.')}
                    </p>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                    <DownloadCard platform="android" data={appDownloads.android} t={t} />
                    <DownloadCard platform="ios" data={appDownloads.ios} t={t} />
                </div>
            </div>
        </section>
    );
}
