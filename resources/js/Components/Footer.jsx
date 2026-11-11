import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import PublicMenu from '@/Components/PublicMenu';
import { Link, usePage } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

const SOCIAL_LABELS = {
    telegram: 'Telegram',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    twitter: 'X / Twitter',
    linkedin: 'LinkedIn',
};

export default function Footer({ className = '' }) {
    const { url = '/', seo = {} } = usePage().props;
    const t = useT();
    const showLogo = url !== '/';
    const socialEntries = Object.entries(seo?.social || {}).filter(([, href]) => !!href);

    return (
        <footer className={`border-t border-copper-100 bg-gradient-to-b from-white/90 to-[#fff8f1] backdrop-blur-xl ${className}`.trim()}>
            <div className="section-shell py-12">
                <div className="flex flex-col items-center gap-7">
                    {showLogo ? (
                        <Link href="/" className="flex items-center" prefetch>
                            <div className="flex h-14 w-36 items-center justify-center overflow-hidden rounded-2xl bg-white px-2 shadow-sm ring-1 ring-copper-100">
                                <ApplicationLogo className="h-full w-full object-contain" />
                            </div>
                        </Link>
                    ) : (
                        <p className="font-heading text-xl font-black tracking-tight text-copper-800">Success Life Coaching</p>
                    )}
                    <PublicMenu variant="footer" />
                    <LanguageSwitcher dropUp />

                    {socialEntries.length > 0 ? (
                        <p className="flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-slate-600">
                            <span className="font-semibold text-slate-800">{t('footer.social_label', 'Social')}:</span>
                            {socialEntries.map(([key, href]) => (
                                <a
                                    key={key}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer me"
                                    className="text-copper-800 hover:underline"
                                >
                                    {SOCIAL_LABELS[key] || key}
                                </a>
                            ))}
                        </p>
                    ) : null}

                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-copper-300 to-transparent" />
                    <div className="flex flex-col items-center text-center">
                        <p className="text-sm text-slate-600">© {new Date().getFullYear()} Success Life Coaching Academy. {t('footer.rights', 'All rights reserved.')}</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {t('footer.designed', 'Designed and developed by')}{' '}
                            <span className="font-semibold text-slate-700">
                                {seo?.designer || 'Goitom Hadush'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
