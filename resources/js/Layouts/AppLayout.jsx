import ApplicationLogo from '@/Components/ApplicationLogo';
import ChatWidget from '@/Components/ChatWidget';
import PublicMenu from '@/Components/PublicMenu';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useT } from '@/hooks/useT';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AppLayout({ children }) {
    // Get the authenticated user and current URL from Inertia
    const page = usePage();
    const t = useT();
    const { auth = { user: null }, payment_settings: customPaymentSettings } = page.props;
    const currentUrl = page.url || '/';

    const paymentSettings = customPaymentSettings || {
        bank_name: 'Commercial Bank of Ethiopia (CBE)',
        bank_account_name: 'Success Life Coaching',
        bank_account_number: '10000125544',
        telebirr_phone: '0914026415',
        telebirr_name: 'Success Life Coaching',
    };
    
    // States to toggle dropdown and mobile menu drawer
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Logout function
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    // Dashboard route based on role
    const getDashboardRoute = () => {
        if (!auth.user) return route('login');
        if (auth.user.role === 'admin') return route('admin.dashboard');
        if (auth.user.role === 'instructor') return route('instructor.courses.index');
        return route('student.dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col pb-16 sm:pb-0 bg-slate-50/40">
            {/* ========================================================
                1. TOP STICKY NAVIGATION BAR (DESKTOP & MOBILE HEADER)
               ======================================================== */}
            <nav className="sticky top-0 z-50 border-b border-copper-100/90 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="section-shell">
                    <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
                        
                        {/* Left Side: Logo & Brand Name */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3 group">
                                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1 border border-copper-200/80 shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0">
                                    <ApplicationLogo className="h-full w-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                                        Success <span className="text-copper-700">Life</span>
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-copper-600 mt-0.5">
                                        Coaching Academy
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Center: The 6 Public Menus (Desktop - visible on lg+) */}
                        <div className="hidden lg:flex items-center justify-center flex-1 px-4">
                            <PublicMenu variant="header" />
                        </div>
                        
                        {/* Right Side: Language Switcher + Auth Logic + Mobile Toggle */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {/* Multilingual Selector (Desktop) */}
                            <LanguageSwitcher className="hidden sm:inline-block" />

                            {auth.user ? (
                                /* --- LOGGED IN USER STATE --- */
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-copper-200 bg-copper-50/80 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-copper-100 touch-manipulation"
                                    >
                                        <span className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-copper-700 to-copper-900 text-xs font-bold text-white shadow-sm">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="max-w-[80px] sm:max-w-none truncate">{auth.user.name.split(' ')[0]}</span>
                                        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-copper-100 bg-white py-2 shadow-copper-glow">
                                            <div className="border-b border-copper-50 px-5 py-4">
                                                <p className="truncate text-sm font-semibold text-slate-900">{auth.user.name}</p>
                                                <p className="text-xs capitalize text-slate-500">({auth.user.role})</p>
                                            </div>

                                            <Link
                                                href={getDashboardRoute()}
                                                onClick={() => setDropdownOpen(false)}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-copper-50"
                                            >
                                                {t('layout.my_dashboard', 'My Dashboard')}
                                            </Link>

                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setDropdownOpen(false)}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-copper-50"
                                            >
                                                {t('layout.change_profile', 'Change Profile / Password')}
                                            </Link>

                                            <div className="my-1 border-t border-copper-50"></div>

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                            >
                                                {t('layout.logout', 'Logout')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* --- GUEST STATE --- */
                                <div className="flex items-center gap-1.5 sm:gap-3">
                                    <Link 
                                        href={route('login')} 
                                        className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:text-copper-700"
                                    >
                                        {t('layout.login', 'Login')}
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="bg-gradient-to-r from-copper-700 to-copper-900 text-white rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-md transition hover:shadow-copper-glow active:scale-95 touch-manipulation"
                                    >
                                        {t('layout.join_free', 'Join Free')}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger Button (visible on mobile / tablet < lg) */}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-2xl border border-copper-200 bg-copper-50/60 text-slate-700 hover:bg-copper-100 hover:text-copper-800 active:scale-95 transition touch-manipulation focus:outline-none"
                                aria-label={t('layout.toggle_drawer', 'Toggle navigation drawer')}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Close dropdown on backdrop click */}
            {dropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
            )}

            {/* ========================================================
                2. MOBILE SLIDE-OUT DRAWER (MOBILE-FIRST NAVIGATION)
               ======================================================== */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Content */}
                    <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl overflow-y-auto animate-fade-in">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-copper-100 p-5 bg-gradient-to-r from-copper-50 to-white">
                            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 border border-copper-200 shadow-sm">
                                    <ApplicationLogo className="h-full w-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                                        Success <span className="text-copper-700">Life</span>
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-copper-600 mt-0.5">
                                        Coaching Academy
                                    </span>
                                </div>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95 transition"
                                aria-label={t('layout.close_menu', 'Close menu')}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation List: Multilingual Selector + Public Menus */}
                        <div className="p-4 flex-1">
                            {/* Multilingual Selector in Mobile Drawer */}
                            <div className="mb-4 rounded-2xl bg-copper-50/70 border border-copper-200/80 p-3">
                                <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-copper-800 flex items-center justify-between">
                                    <span>🌐 {t('lang.label', 'Language')} / ቋንቋ</span>
                                    <span className="text-[10px] text-slate-400 font-normal">Tigrigna • Amharic • English</span>
                                </p>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {[
                                        { code: 'ti', label: 'ትግርኛ', flag: '🇪🇹' },
                                        { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
                                        { code: 'en', label: 'English', flag: '🇬🇧' },
                                    ].map((lang) => {
                                        const active = (page.props.locale || 'en') === lang.code;
                                        return (
                                            <Link
                                                key={lang.code}
                                                href={route('locale.switch', lang.code)}
                                                preserveScroll
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`flex items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-bold transition ${
                                                    active
                                                        ? 'bg-gradient-to-r from-copper-700 to-copper-900 text-white shadow-xs'
                                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                <span>{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {t('layout.public_menus', 'Public Menus')}
                            </p>
                            <PublicMenu variant="mobile" onNavigate={() => setMobileMenuOpen(false)} />

                            {/* Android App Download Banner */}
                            <div className="mt-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-copper-800 p-4 text-white shadow-md">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl">📱</span>
                                    <h4 className="text-sm font-bold">{t('layout.official_app', 'Official Android App')}</h4>
                                </div>
                                <p className="text-xs text-copper-100 mb-3">
                                    {t('layout.app_blurb', 'Enjoy smooth, data-efficient offline-ready video masterclasses right from your phone.')}
                                </p>
                                <a
                                    href="/apps/download/android"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2 px-3 text-xs font-bold text-emerald-900 shadow transition hover:bg-emerald-50 active:scale-95"
                                >
                                    <span>{t('layout.download_apk_btn', 'Download Free APK (v1.0.4)')}</span>
                                </a>
                            </div>

                            {/* Payment Notice */}
                            <div className="mt-4 rounded-xl border border-copper-200/80 bg-copper-50/60 p-3 text-xs text-slate-600">
                                <p className="font-semibold text-copper-900 flex items-center gap-1.5">
                                    <span>🔒</span> {t('layout.direct_payment', 'Direct Payment Support')}
                                </p>
                                <p className="mt-1 text-[11px]">
                                    {paymentSettings.bank_name.split(' ')[0]}: <strong>{paymentSettings.bank_account_number}</strong> | Telebirr: <strong>{paymentSettings.telebirr_phone}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Drawer Bottom Actions */}
                        <div className="border-t border-copper-100 p-4 bg-slate-50">
                            {auth.user ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={getDashboardRoute()}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-primary w-full justify-center text-center py-2.5 text-xs font-bold"
                                    >
                                        {t('layout.go_dashboard', 'Go to My Dashboard')}
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            setMobileMenuOpen(false);
                                            handleLogout(e);
                                        }}
                                        className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
                                    >
                                        {t('layout.log_out', 'Log Out')}
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-secondary w-full justify-center text-center py-2.5 text-xs font-bold"
                                    >
                                        {t('layout.login', 'Login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="btn-primary w-full justify-center text-center py-2.5 text-xs font-bold"
                                    >
                                        {t('layout.join_free', 'Join Free')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                3. MAIN PAGE CONTENT
               ======================================================== */}
            <main className="flex-grow">
                {children}
            </main>

            {/* ========================================================
                4. FOOTER (WITH ALL 6 MENUS & BRAND INFO)
               ======================================================== */}
            <footer className="border-t border-copper-100 bg-white mb-16 sm:mb-0">
                <div className="section-shell py-10 sm:py-14">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-copper-100">
                        {/* Brand Column */}
                        <div className="md:col-span-2">
                            <Link href="/" className="inline-flex items-center gap-3 group">
                                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 border border-copper-200/80 shadow-sm transition-transform duration-200 group-hover:scale-105">
                                    <ApplicationLogo className="h-full w-full object-contain" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                                        Success <span className="text-copper-700">Life</span>
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-copper-600 mt-1">
                                        Coaching Academy
                                    </span>
                                </div>
                            </Link>
                            <p className="mt-3.5 max-w-sm text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {t('layout.footer_about', "Ethiopia's premier coaching and online learning platform. Empowering ambitious individuals with transformative mindset, leadership, and income-generating skills.")}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80">
                                <span>🔒</span>
                                <span>{t('layout.instant_pay', 'Instant {bank} ({account}) & Telebirr ({telebirr})').replace('{bank}', paymentSettings.bank_name.split(' ')[0]).replace('{account}', paymentSettings.bank_account_number).replace('{telebirr}', paymentSettings.telebirr_phone)}</span>
                            </div>
                        </div>

                        {/* Navigation Links: The 6 Public Menus */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                                {t('layout.platform_nav', 'Platform Navigation')}
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                                <li>
                                    <Link href="/" className="hover:text-copper-700 transition-colors">{t('layout.nav_home', 'Home')}</Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:text-copper-700 transition-colors">{t('layout.nav_about', 'About Success Life')}</Link>
                                </li>
                                <li>
                                    <Link href="/courses" className="hover:text-copper-700 transition-colors">{t('layout.nav_courses', 'Courses & Masterclasses')}</Link>
                                </li>
                                <li>
                                    <Link href="/seminars" className="hover:text-copper-700 transition-colors font-semibold text-emerald-700 flex items-center gap-1.5">
                                        <span>🏛️</span> {t('layout.nav_seminars', 'Live Seminars & Summits')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reels" className="hover:text-copper-700 transition-colors">{t('layout.nav_reels', 'Video Reels')}</Link>
                                </li>
                                <li>
                                    <Link href="/testimonials" className="hover:text-copper-700 transition-colors">{t('layout.nav_testimonials', 'Student Testimonials')}</Link>
                                </li>
                            </ul>
                        </div>

                        {/* App & Student Support */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                                {t('layout.app_support', 'App & Support')}
                            </h4>
                            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                                <li>
                                    <a href="/apps/download/android" className="hover:text-copper-700 transition-colors font-semibold text-emerald-700 flex items-center gap-1.5">
                                        <span>📱</span> {t('layout.download_apk', 'Download Android APK')}
                                    </a>
                                </li>
                                <li>
                                    <Link href={route('register')} className="hover:text-copper-700 transition-colors">{t('layout.create_account', 'Create Free Account')}</Link>
                                </li>
                                <li>
                                    <Link href={route('login')} className="hover:text-copper-700 transition-colors">{t('layout.student_signin', 'Student Sign In')}</Link>
                                </li>
                                <li>{t('layout.lifetime', 'Lifetime Access Included')}</li>
                                <li>{t('layout.verifiable_cert', 'Verifiable Completion Certificate')}</li>
                                <li className="pt-2 text-xs text-slate-500">
                                    {t('layout.developed_by', 'Developed by')} <span className="font-bold text-slate-900">Goitom Hadush</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher dropUp />
                            <p>© {new Date().getFullYear()} Success Life Coaching Academy. {t('footer.rights', 'All rights reserved.')}</p>
                        </div>
                        <p className="text-slate-500">{t('footer.motto', 'Empowering Minds, Transforming Futures in Ethiopia & Beyond.')}</p>
                    </div>
                </div>
            </footer>

            {/* ========================================================
                5. MOBILE BOTTOM NAVIGATION BAR (HIGH-CONVERTING MOBILE UX)
               ======================================================== */}
            <nav 
                aria-label={t('layout.bottom_nav', 'Mobile Bottom Navigation')} 
                className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-copper-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] sm:hidden pb-[env(safe-area-inset-bottom)]"
            >
                <div className="grid grid-cols-5 h-16 items-center px-1">
                    {/* 1. Home */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center h-full py-1 transition-colors touch-manipulation ${
                            currentUrl === '/' ? 'text-copper-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <svg className="h-5 w-5 mb-1" fill={currentUrl === '/' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px] leading-tight">{t('layout.tab_home', 'Home')}</span>
                    </Link>

                    {/* 2. Courses */}
                    <Link
                        href="/courses"
                        className={`flex flex-col items-center justify-center h-full py-1 transition-colors touch-manipulation ${
                            currentUrl.startsWith('/courses') ? 'text-copper-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <svg className="h-5 w-5 mb-1" fill={currentUrl.startsWith('/courses') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-[10px] leading-tight">{t('layout.tab_courses', 'Courses')}</span>
                    </Link>

                    {/* 3. Reels */}
                    <Link
                        href="/reels"
                        className={`flex flex-col items-center justify-center h-full py-1 transition-colors touch-manipulation ${
                            currentUrl.startsWith('/reels') ? 'text-copper-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <svg className="h-5 w-5 mb-1" fill={currentUrl.startsWith('/reels') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] leading-tight">{t('layout.tab_reels', 'Reels')}</span>
                    </Link>

                    {/* 4. Testimonials */}
                    <Link
                        href="/testimonials"
                        className={`flex flex-col items-center justify-center h-full py-1 transition-colors touch-manipulation ${
                            currentUrl.startsWith('/testimonials') ? 'text-copper-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <svg className="h-5 w-5 mb-1" fill={currentUrl.startsWith('/testimonials') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-[10px] leading-tight">{t('layout.tab_reviews', 'Reviews')}</span>
                    </Link>

                    {/* 5. More / Menu Drawer Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className={`flex flex-col items-center justify-center h-full py-1 transition-colors touch-manipulation ${
                            mobileMenuOpen || currentUrl.startsWith('/about')
                                ? 'text-copper-700 font-bold' 
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <svg className="h-5 w-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="text-[10px] leading-tight">{t('layout.tab_menu', 'Menu')}</span>
                    </button>
                </div>
            </nav>

            {/* Live chat / leave a message / WhatsApp & Telegram */}
            <ChatWidget />
        </div>
    );
}
