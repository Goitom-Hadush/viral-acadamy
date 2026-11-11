import { Link } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export function getPublicNavItems(t) {
    const isCurrent = (name, path) => {
        try {
            if (typeof route !== 'undefined' && route().current) {
                if (name === 'courses.index') {
                    return route().current('courses.index') || route().current('courses.show');
                }
                if (name === 'seminars') {
                    return route().current('seminars') || route().current('seminars.*');
                }
                return route().current(name);
            }
        } catch (e) {}

        if (typeof window !== 'undefined') {
            if (path === '/') return window.location.pathname === '/';
            return window.location.pathname === path || window.location.pathname.startsWith(`${path}/`);
        }
        return false;
    };

    const getHref = (name, fallback) => {
        try {
            if (typeof route !== 'undefined') {
                return route(name);
            }
        } catch (e) {}
        return fallback;
    };

    return [
        {
            label: t('nav.home', 'Home'),
            href: getHref('home', '/'),
            current: isCurrent('home', '/'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: t('nav.about', 'About'),
            href: getHref('about', '/about'),
            current: isCurrent('about', '/about'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: t('nav.courses', 'Courses'),
            href: getHref('courses.index', '/courses'),
            current: isCurrent('courses.index', '/courses'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            label: t('nav.seminars', 'Seminars'),
            href: getHref('seminars', '/seminars'),
            current: isCurrent('seminars', '/seminars'),
            badge: t('nav.live', 'Live'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            label: t('nav.reels', 'Reels'),
            href: getHref('reels', '/reels'),
            current: isCurrent('reels', '/reels'),
            badge: t('nav.new', 'New'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            label: t('nav.testimonials', 'Testimonials'),
            href: getHref('testimonials', '/testimonials'),
            current: isCurrent('testimonials', '/testimonials'),
            icon: (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
    ];
}

export default function PublicMenu({
    variant = 'header',
    onNavigate,
    className = '',
}) {
    const t = useT();
    const items = getPublicNavItems(t);

    if (variant === 'footer') {
        return (
            <nav className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`.trim()} aria-label={t('layout.footer_menu', 'Footer Menu')}>
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        prefetch
                        cacheFor="30s"
                        onClick={onNavigate}
                        className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition ${
                            item.current
                                ? 'bg-copper-700 text-white font-semibold shadow-sm'
                                : 'text-slate-600 hover:text-copper-700 hover:bg-copper-50'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        );
    }

    if (variant === 'mobile') {
        return (
            <nav className={`flex flex-col gap-1.5 ${className}`.trim()} aria-label={t('layout.mobile_nav', 'Mobile Navigation')}>
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        prefetch
                        cacheFor="30s"
                        onClick={onNavigate}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] touch-manipulation ${
                            item.current
                                ? 'bg-gradient-to-r from-copper-700 to-copper-900 text-white shadow-md'
                                : 'text-slate-700 hover:bg-copper-50 hover:text-copper-900 bg-white/70 border border-slate-100'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                                item.current ? 'bg-white/20 text-white' : 'bg-copper-50 text-copper-700'
                            }`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold">{item.label}</span>
                        </div>
                        {item.badge ? (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                item.current 
                                    ? 'bg-white/25 text-white' 
                                    : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700'
                            }`}>
                                {item.badge}
                            </span>
                        ) : (
                            <svg className={`h-4 w-4 ${item.current ? 'text-white/70' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </Link>
                ))}
            </nav>
        );
    }

    // Default: Desktop Header Menu
    return (
        <nav className={`inline-flex items-center gap-0.5 xl:gap-1 rounded-full border border-copper-100/90 bg-white/90 p-1 shadow-sm backdrop-blur-md ${className}`.trim()} aria-label={t('layout.header_menu', 'Header Menu')}>
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    cacheFor="30s"
                    onClick={onNavigate}
                    className={`relative rounded-full px-2.5 py-1.5 xl:px-3.5 xl:py-1.5 text-xs xl:text-sm font-semibold transition whitespace-nowrap ${
                        item.current
                            ? 'bg-gradient-to-r from-copper-700 to-copper-900 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-copper-50 hover:text-copper-800'
                    }`}
                >
                    {item.label}
                    {item.badge && (
                        <span className="ml-1 xl:ml-1.5 rounded-full bg-emerald-500 px-1.5 py-0.2 text-[8px] xl:text-[9px] font-bold uppercase text-white">
                            {item.badge}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}
