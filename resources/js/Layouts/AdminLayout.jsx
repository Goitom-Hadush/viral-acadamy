import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

// One tiny icon component instead of a repeated <svg> block per menu item.
function Icon({ d, className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={d} />
        </svg>
    );
}

const ICONS = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    wallet: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    gift: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    chat: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    megaphone: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    play: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    mic: 'M19 11a7 7 0 01-14 0m7 7v4m-4 0h8M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z',
    image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    quote: 'M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
    phone: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    pen: 'M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5 0 113.536 3.536L12.536 16.536 8 18l1-5zM4 21h16',
    building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 18L18 6M6 6l12 12',
    chevron: 'M11 19l-7-7 7-7m8 14l-7-7 7-7',
    external: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
};

export default function AdminLayout({ children }) {
    const { props, url } = usePage();
    const { auth = { user: { name: 'Admin', role: 'admin' } } } = props;
    const user = auth?.user ?? { name: 'Admin', role: 'admin' };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        try { return localStorage.getItem('admin.sidebar.collapsed') === '1'; } catch { return false; }
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Grouped navigation: every page appears exactly once.
    const groups = useMemo(() => ([
        {
            title: 'Overview',
            items: [
                { label: 'Dashboard', href: route('admin.dashboard'), match: '/admin/dashboard', icon: 'home' },
            ],
        },
        {
            title: 'Learning',
            items: [
                { label: 'Courses', href: route('admin.courses.index'), match: '/admin/courses', icon: 'book' },
                { label: 'Categories', href: route('admin.categories.index'), match: '/admin/categories', icon: 'tag' },
                { label: 'Users', href: route('admin.users.index'), match: '/admin/users', icon: 'users' },
                { label: 'Instructors', href: route('admin.instructors.index'), match: '/admin/instructors', icon: 'users' },
                { label: 'Seminars & Tickets', href: route('admin.seminars.index'), match: '/admin/seminars', icon: 'calendar' },
            ],
        },
        {
            title: 'Sales',
            items: [
                { label: 'Payments', href: route('admin.payments.index'), match: '/admin/payments', icon: 'card', badge: Number(props.pending_payments) || 0 },
                { label: 'Payment Accounts', href: route('admin.payment-settings.index'), match: '/admin/payment-settings', icon: 'wallet' },
                { label: 'Referrals & Cashouts', href: route('admin.referrals.index'), match: '/admin/referrals', icon: 'gift' },
                { label: 'Certificate Signature', href: route('admin.certificate-settings.index'), match: '/admin/certificate-settings', icon: 'pen' },
            ],
        },
        {
            title: 'Website',
            items: [
                { label: 'Homepage Promo', href: route('admin.advertisement.index'), match: '/admin/advertisement', icon: 'play' },
                { label: 'Homepage Notice', href: route('admin.announcement.index'), match: '/admin/announcement', icon: 'megaphone' },
                { label: 'Hero Slides', href: route('admin.homepage-slides.index'), match: '/admin/homepage-slides', icon: 'image' },
                { label: 'Intro Video', href: route('admin.intro.index'), match: '/admin/intro', icon: 'play' },
                { label: 'Course Reels', href: route('admin.reels.index'), match: '/admin/reels', icon: 'play' },
                { label: 'Testimonials', href: route('admin.testimonials.index'), match: '/admin/testimonials', icon: 'quote' },
                { label: 'Interviews', href: route('admin.interviews.index'), match: '/admin/interviews', icon: 'mic' },
                { label: 'About Page', href: route('admin.about.index'), match: '/admin/about', icon: 'info' },
                { label: 'App Downloads', href: route('admin.apps.index'), match: '/admin/apps', icon: 'phone' },
                { label: 'Sponsor Logos', href: route('admin.sponsors.index'), match: '/admin/sponsors', icon: 'building' },
            ],
        },
        {
            title: 'Support',
            items: [
                { label: 'Live Chat', href: route('admin.chat.index'), match: '/admin/chat', icon: 'chat', badge: Number(props.chat_unread) || 0 },
            ],
        },
    ]), [props.chat_unread, props.pending_payments]);

    const path = url.split('?')[0];
    const isActive = (item) => path === item.match || path.startsWith(item.match + '/');
    const activeItem = groups.flatMap((g) => g.items).find(isActive);

    const handleLogout = (e) => {
        e?.preventDefault();
        router.post(route('logout'), {}, {
            onFinish: () => { window.location.href = '/'; },
        });
    };

    const toggleCollapsed = () => {
        setCollapsed((prev) => {
            const next = !prev;
            try { localStorage.setItem('admin.sidebar.collapsed', next ? '1' : '0'); } catch { /* ignore */ }
            return next;
        });
    };

    // Refresh the red badges (pending payments + unread chat) every 30s while the tab is visible.
    useEffect(() => {
        const timer = setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.reload({ only: ['pending_payments', 'chat_unread'], preserveScroll: true, preserveState: true });
            }
        }, 30000);
        return () => clearInterval(timer);
    }, []);

    // Close mobile drawer + user menu on navigation.
    useEffect(() => {
        setSidebarOpen(false);
        setMenuOpen(false);
    }, [url]);

    // Lock body scroll while the mobile drawer is open.
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    // Close user menu on outside click / Escape.
    useEffect(() => {
        if (!menuOpen) return undefined;
        const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [menuOpen]);

    const initial = (user.name || 'A').charAt(0).toUpperCase();
    const compact = collapsed; // desktop only (mobile drawer is always full width)

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-gradient-to-b from-[#003301] via-[#004101] to-[#002a01] text-white shadow-2xl transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:max-w-none lg:translate-x-0 lg:shadow-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } ${compact ? 'lg:w-[76px]' : 'lg:w-72'}`}
            >
                {/* Brand */}
                <div className={`flex h-16 shrink-0 items-center border-b border-white/10 px-4 ${compact ? 'lg:justify-center' : 'justify-between'}`}>
                    <Link href={route('admin.dashboard')} className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                            <img src="/logo.png?v=slc-1" alt="Success Life Coaching" className="h-full w-full object-contain" />
                        </span>
                        <span className={`min-w-0 ${compact ? 'lg:hidden' : ''}`}>
                            <span className="block truncate text-sm font-black leading-tight">Success Life</span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-300">Admin Panel</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label="Close menu"
                    >
                        <Icon d={ICONS.close} className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 [scrollbar-width:thin]" aria-label="Admin navigation">
                    {groups.map((group) => (
                        <div key={group.title}>
                            <p className={`mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 ${compact ? 'lg:hidden' : ''}`}>
                                {group.title}
                            </p>
                            {compact && <div className="mx-3 mb-2 hidden border-t border-white/10 lg:block" />}
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const active = isActive(item);
                                    return (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                title={compact ? item.label : undefined}
                                                aria-current={active ? 'page' : undefined}
                                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                                    compact ? 'lg:justify-center' : ''
                                                } ${
                                                    active
                                                        ? 'bg-white/15 text-white'
                                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {active && <span className="absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-amber-400" />}
                                                <Icon d={ICONS[item.icon]} className={`h-5 w-5 shrink-0 ${active ? 'text-amber-300' : ''}`} />
                                                <span className={`truncate ${compact ? 'lg:hidden' : ''}`}>{item.label}</span>
                                                {item.badge > 0 && (
                                                    <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-black text-white ${compact ? 'lg:absolute lg:right-1 lg:top-1 lg:h-4 lg:min-w-[1rem] lg:px-1 lg:text-[9px]' : 'ml-auto'}`}>
                                                        {item.badge > 99 ? '99+' : item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Footer: view site + collapse */}
                <div className="shrink-0 space-y-1 border-t border-white/10 p-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        title={compact ? 'View website' : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white ${compact ? 'lg:justify-center' : ''}`}
                    >
                        <Icon d={ICONS.external} className="h-5 w-5 shrink-0" />
                        <span className={compact ? 'lg:hidden' : ''}>View website</span>
                    </a>
                    <button
                        type="button"
                        onClick={toggleCollapsed}
                        title={compact ? 'Expand menu' : 'Collapse menu'}
                        className={`hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:flex ${compact ? 'justify-center' : ''}`}
                    >
                        <Icon d={ICONS.chevron} className={`h-5 w-5 shrink-0 transition-transform ${compact ? 'rotate-180' : ''}`} />
                        {!compact && <span>Collapse menu</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
                            aria-label="Open menu"
                        >
                            <Icon d={ICONS.menu} className="h-6 w-6" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{activeItem?.label ?? 'Admin'}</h1>
                            <p className="hidden text-xs text-slate-500 sm:block">Success Life Coaching · Administrator</p>
                        </div>
                    </div>

                    {/* User menu (single place for Profile + Logout) */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#004101] to-[#006b02] text-sm font-bold text-white">
                                {initial}
                            </span>
                            <span className="hidden text-left sm:block">
                                <span className="block max-w-[140px] truncate text-sm font-semibold leading-tight text-slate-800">{user.name}</span>
                                <span className="block text-[11px] capitalize leading-tight text-slate-500">{user.role}</span>
                            </span>
                        </button>

                        {menuOpen && (
                            <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
                                    <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                                    <p className="text-xs capitalize text-slate-500">{user.role}</p>
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    role="menuitem"
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <Icon d={ICONS.user} className="h-4 w-4" /> Profile settings
                                </Link>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                    <Icon d={ICONS.logout} className="h-4 w-4" /> Log out
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
