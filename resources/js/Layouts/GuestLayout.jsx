import ApplicationLogo from '@/Components/ApplicationLogo';
import ChatWidget from '@/Components/ChatWidget';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import PublicMenu from '@/Components/PublicMenu';
import { useT } from '@/hooks/useT';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function isRoute(name) {
    try {
        return !!route().current(name);
    } catch {
        return false;
    }
}

/** Glass navigation bar used on every sign-in / sign-up style page. */
function GuestNav({ onLogin, onRegister }) {
    const t = useT();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const closeMenu = () => setOpen(false);

    return (
        <header className="hero-fade-down relative z-30 px-3 pt-3 sm:px-6 sm:pt-5">
            <div className="mx-auto max-w-6xl">
                <div className="flex h-16 items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:px-4">
                    {/* Brand */}
                    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Success Life Coaching Academy">
                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md ring-1 ring-[#e4c36a]/50 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <ApplicationLogo className="h-full w-full" />
                        </span>
                        <span className="hidden flex-col leading-none sm:flex">
                            <span className="text-base font-black tracking-tight text-white">
                                Success <span className="text-[#e4c36a]">Life</span>
                            </span>
                            <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-emerald-100/70">
                                Coaching Academy
                            </span>
                        </span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden flex-1 justify-center lg:flex">
                        <PublicMenu variant="header" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher className="hidden sm:inline-block" />

                        {onLogin ? (
                            <Link
                                href={route('register')}
                                className="inline-flex items-center rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-4 py-2 text-xs font-extrabold text-[#1a1404] shadow-[0_8px_24px_-10px_rgba(212,175,55,0.9)] transition hover:-translate-y-0.5 hover:brightness-105 active:scale-95 sm:text-sm"
                            >
                                {t('auth.register', 'Join Free')}
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold transition active:scale-95 sm:text-sm ${
                                    onRegister
                                        ? 'border-[#e4c36a]/60 bg-[#e4c36a]/15 text-[#f6e7b4] hover:bg-[#e4c36a]/25'
                                        : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {t('auth.login', 'Login')}
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-label={t('auth.toggle_menu', 'Toggle navigation menu')}
                            aria-expanded={open}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 active:scale-95 lg:hidden"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {open && (
                    <>
                        <div className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden" onClick={closeMenu} aria-hidden="true" />
                        <div className="chat-popup-in absolute inset-x-3 top-full z-30 mt-2 max-h-[75vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-4 shadow-2xl sm:inset-x-6 lg:hidden">
                            <PublicMenu variant="mobile" onNavigate={closeMenu} />
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                <LanguageSwitcher dropUp />
                                <div className="flex gap-2">
                                    <Link
                                        href={route('login')}
                                        onClick={closeMenu}
                                        className="btn-secondary !min-h-0 !px-4 !py-2 text-xs"
                                    >
                                        {t('auth.login', 'Login')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={closeMenu}
                                        className="btn-primary !min-h-0 !px-4 !py-2 text-xs"
                                    >
                                        {t('auth.register', 'Join Free')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default function GuestLayout({ children }) {
    const t = useT();
    const onLogin = isRoute('login');
    const onRegister = isRoute('register');

    const perks = [
        t('auth.perk_1', 'Premium video masterclasses, step by step'),
        t('auth.perk_2', 'Track your progress and milestones'),
        t('auth.perk_3', 'Verified certificate when you finish'),
        t('auth.perk_4', 'Pay simply with bank transfer or Telebirr'),
    ];

    return (
        <div className="home-hero relative flex min-h-screen flex-col overflow-hidden">
            {/* Background decoration */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                }}
            />
            <div className="animate-float pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#e4c36a]/15 blur-3xl" />
            <div className="animate-float-delayed pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />

            <GuestNav onLogin={onLogin} onRegister={onRegister} />

            {/* Main card */}
            <main className="relative z-10 flex flex-1 items-center justify-center px-3 py-6 sm:px-6 sm:py-10">
                <div className="animate-slide-up grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[36px]">
                    {/* Branding panel (desktop) */}
                    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#06240c] via-[#0a3a17] to-[#04180a] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#e4c36a]/20" />
                        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-[#e4c36a]/25" />
                        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#e4c36a]/10 blur-3xl" />

                        <div className="relative">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#e4c36a]/35 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3e2ad]">
                                <span className="hero-dot-pulse h-1.5 w-1.5 rounded-full bg-[#e4c36a]" />
                                {t('auth.platform', 'Learning Platform')}
                            </span>

                            <h2 className="home-display mt-6 text-balance text-4xl leading-[1.15] xl:text-[2.6rem]">
                                {t('auth.guest_heading', 'Learn faster. Grow further.')}{' '}
                                <span className="gold-text">{t('auth.guest_highlight', 'Build real success.')}</span>
                            </h2>

                            <p className="mt-5 max-w-md text-base leading-7 text-emerald-50/75">
                                {t(
                                    'auth.guest_body',
                                    'Join thousands of ambitious learners across Ethiopia growing with focused video coaching.',
                                )}
                            </p>

                            <ul className="mt-8 space-y-3.5">
                                {perks.map((perk, i) => (
                                    <li
                                        key={perk}
                                        className="hero-fade-up flex items-start gap-3 text-sm text-emerald-50/90"
                                        style={{ animationDelay: `${400 + i * 120}ms` }}
                                    >
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f6e7b4] to-[#d4af37] text-[#1a1404]">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                        </span>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                            {[
                                { val: 'HD', label: t('auth.stat_video', 'Video lessons') },
                                { val: '24/7', label: t('auth.stat_access', 'Access anytime') },
                                { val: '✓', label: t('auth.stat_cert', 'Verified certificate') },
                            ].map((s) => (
                                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/10">
                                    <p className="home-display text-xl text-[#f3e2ad]">{s.val}</p>
                                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-100/60">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Form panel */}
                    <section className="flex flex-col bg-white">
                        <div className="flex-1 p-5 sm:p-8 lg:p-10">
                            <div className="mx-auto w-full max-w-md">
                                {children}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-1 border-t border-copper-100/80 px-6 py-4 text-center text-xs text-slate-500 sm:flex-row">
                            <p>© {new Date().getFullYear()} Success Life Coaching Academy</p>
                            <Link href="/" className="font-semibold text-copper-700 transition hover:text-copper-900 hover:underline">
                                ← {t('auth.back_home', 'Back to homepage')}
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <ChatWidget />
        </div>
    );
}
