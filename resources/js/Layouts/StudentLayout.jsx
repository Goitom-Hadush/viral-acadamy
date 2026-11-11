import Footer from '@/Components/Footer';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import PublicMenu from '@/Components/PublicMenu';
import ChatWidget from '@/Components/ChatWidget';
import { useT } from '@/hooks/useT';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const ICONS = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    menu: 'M4 6h16M4 12h16M4 18h16',
    close: 'M6 18L18 6M6 6l12 12',
};

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
        </svg>
    );
}

function FlashMessage({ type, children }) {
    const styles = type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-rose-200 bg-rose-50 text-rose-800';
    return (
        <div role="status" className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold shadow-sm ${styles}`}>
            <span aria-hidden="true">{type === 'success' ? '✓' : '✕'}</span>
            <p>{children}</p>
        </div>
    );
}

export default function StudentLayout({ children }) {
    const { props, url } = usePage();
    const { auth = { user: { name: 'Student' } }, flash } = props;
    const user = auth?.user ?? { name: 'Student' };
    const t = useT();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const navigation = useMemo(() => ([
        {
            label: t('auth.dashboard', 'Dashboard'),
            href: route('student.dashboard'),
            active: url.startsWith('/student/dashboard'),
            icon: 'home',
        },
        {
            label: t('student.my_courses', 'My Courses'),
            href: route('student.courses'),
            active: url.startsWith('/student/my-courses') || url.startsWith('/student/learn'),
            icon: 'book',
        },
        {
            label: t('student.browse_courses', 'Browse Courses'),
            href: route('courses.index'),
            active: url.startsWith('/courses'),
            icon: 'search',
        },
    ]), [url, props.translations]);

    const activeItem = navigation.find((item) => item.active);

    const handleLogout = (e) => {
        e?.preventDefault();
        router.post(route('logout'), {}, {
            onFinish: () => { window.location.href = '/'; },
        });
    };

    // Close drawer + menu on navigation.
    useEffect(() => {
        setSidebarOpen(false);
        setMenuOpen(false);
    }, [url]);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen && window.innerWidth < 1024 ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

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

    const initial = (user.name || 'S').charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-gradient-to-b from-[#003301] via-[#004101] to-[#002a01] text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4">
                    <Link href={route('student.dashboard')} className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                            <img src="/logo.png?v=admin-logo-2" alt={t('common.logo_alt', 'Success Life Coaching Academy logo')} className="h-full w-full object-contain" />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-black leading-tight">Success Life</span>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-300">{t('student.role', 'Student')}</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
                        aria-label={t('common.close_sidebar', 'Close sidebar')}
                    >
                        <Icon name="close" />
                    </button>
                </div>

                {/* Student card */}
                <div className="m-3 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400 text-base font-black text-[#2b2000]">{initial}</span>
                    <span className="min-w-0">
                        <span className="block text-[10px] font-medium uppercase tracking-wider text-white/50">{t('student.signed_in_as', 'Signed in as')}</span>
                        <span className="block truncate text-sm font-bold">{user.name}</span>
                    </span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Student navigation">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={item.active ? 'page' : undefined}
                            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                item.active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {item.active && <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-amber-400" />}
                            <Icon name={item.icon} className={`h-5 w-5 shrink-0 ${item.active ? 'text-amber-300' : ''}`} />
                            <span className="truncate">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="shrink-0 border-t border-white/10 p-3">
                    <Link
                        href={route('profile.edit')}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                            url.startsWith('/profile') ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Icon name="user" className="h-5 w-5 shrink-0" />
                        {t('student.profile_settings', 'Profile Settings')}
                    </Link>
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
                            aria-label={t('common.open_sidebar', 'Open sidebar')}
                        >
                            <Icon name="menu" className="h-6 w-6" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{activeItem?.label ?? 'Success Life Coaching Academy'}</h1>
                            <p className="hidden text-xs text-slate-500 sm:block">{t('dash.student_sub', 'Student learning dashboard')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <PublicMenu className="hidden xl:flex" />
                        <LanguageSwitcher />

                        {/* Single place for Profile + Logout */}
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-colors hover:bg-slate-50"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#004101] to-[#006b02] text-sm font-bold text-white">{initial}</span>
                                <span className="hidden max-w-[130px] truncate text-sm font-semibold text-slate-800 sm:block">{user.name}</span>
                            </button>

                            {menuOpen && (
                                <div role="menu" className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                    <Link href={route('profile.edit')} role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                        <Icon name="user" className="h-4 w-4" /> {t('auth.profile', 'Profile')}
                                    </Link>
                                    <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                                        <Icon name="logout" className="h-4 w-4" /> {t('auth.logout', 'Logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    {flash?.success && <FlashMessage type="success">{flash.success}</FlashMessage>}
                    {flash?.error && <FlashMessage type="error">{flash.error}</FlashMessage>}
                    {children}
                </main>
                <Footer className="border-t border-copper-100 bg-white/95" />
            </div>

            <ChatWidget />
        </div>
    );
}
