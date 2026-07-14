import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function AdminLayout({ children }) {
    const { props, url } = usePage();
    const { auth = { user: { name: 'Admin', role: 'admin' } } } = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentContentView = useMemo(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');
        const view = params.get('view');

        return ['courses', 'videos', 'reviews'].includes(view) ? view : 'courses';
    }, [url]);
    const navigation = useMemo(() => ([
        {
            label: 'Dashboard',
            href: route('admin.dashboard'),
            active: url.startsWith('/admin/dashboard'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            label: 'Manage Users',
            href: route('admin.users.index'),
            active: url.startsWith('/admin/users'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
        {
            label: 'Categories',
            href: route('admin.categories.index'),
            active: url.startsWith('/admin/categories'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            ),
        },
        {
            label: 'Manage Courses',
            href: route('admin.courses.index'),
            active: url.startsWith('/admin/courses'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            label: 'Videos',
            href: route('admin.courses.index', { view: 'videos' }),
            active: url.startsWith('/admin/courses') && currentContentView === 'videos',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h6a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2zm-4 0H3a1 1 0 01-1-1v-4a1 1 0 011-1h2" />
                </svg>
            ),
        },
        {
            label: 'Comments',
            href: route('admin.courses.index', { view: 'reviews' }),
            active: url.startsWith('/admin/courses') && currentContentView === 'reviews',
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Homepage Promo',
            href: route('admin.advertisement.index'),
            active: url.startsWith('/admin/advertisement'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M7 7v10M4 7v10M20 7v10" />
                </svg>
            ),
        },
        {
            label: 'Payments',
            href: route('admin.payments.index'),
            active: url.startsWith('/admin/payments'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },

        {
            label: 'Profile Settings',
            href: route('profile.edit'),
            active: url.startsWith('/profile'),
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ]), [currentContentView, url]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'), {}, {
            onFinish: () => {
                window.location.href = '/';
            },
        });
    };

    useEffect(() => {
        setSidebarOpen(false);
    }, [url]);

    useEffect(() => {
        if (!sidebarOpen) {
            document.body.style.overflow = '';
            return;
        }

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen lg:flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-copper-100 bg-white transform transition-transform duration-300 lg:static lg:w-72 lg:max-w-none lg:translate-x-0 lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="flex items-center justify-between border-b border-copper-100 p-6">
                    <div className="flex items-center">
                        <img
                            src="/logo.png?v=admin-logo-2"
                            alt="Viral Acadamy logo"
                            className="h-20 w-52 rounded-2xl object-contain bg-white p-1"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-copper-50 hover:text-copper-600 lg:hidden transition-colors"
                        aria-label="Close sidebar"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Profile */}
                <div className="border-b border-copper-100 px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-copper-600 to-bronze text-white font-bold text-lg shadow-copper-glow">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">Logged in as</p>
                            <p className="truncate text-base font-semibold text-slate-900">{auth.user.name}</p>
                            <p className="text-xs capitalize text-slate-500">{auth.user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1 space-y-2 px-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            preserveState={false}
                            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                item.active
                                    ? 'bg-gradient-to-r from-copper-600 to-bronze text-white shadow-lg shadow-copper-500/25'
                                    : 'text-slate-600 hover:bg-copper-50 hover:text-slate-900'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-copper-100">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-100 hover:shadow-md"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex min-h-screen flex-1 flex-col lg:min-w-0 bg-slate-50">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-copper-100 bg-white px-4 py-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="rounded-2xl p-2.5 text-slate-700 hover:bg-copper-50 lg:hidden transition-colors"
                                type="button"
                                aria-label="Open sidebar"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="min-w-0">
                                <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl">Viral Acadamy</h1>
                                <p className="hidden text-sm text-slate-500 sm:block">Administrator control panel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-700">{auth.user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{auth.user.role}</p>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                className="rounded-2xl border border-copper-200 bg-copper-50 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-copper-100 hover:shadow-md"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition-all duration-200 hover:bg-rose-100 hover:shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
