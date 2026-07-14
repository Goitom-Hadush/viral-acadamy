import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AppLayout({ children }) {
    // Get the authenticated user and current URL from Inertia
    const page = usePage();
    const { auth = { user: null } } = page.props;
    const currentUrl = page.url || '/';
    
    // State to toggle the dropdown menu
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Logout function
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Public Navigation Bar */}
            <nav className="sticky top-0 z-50 border-b border-copper-100 bg-white shadow-sm">
                <div className="section-shell">
                    <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-4">
                        {/* Left Side: Logo and Browse */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="inline-flex items-center">
                                                                <div className="flex h-20 w-52 items-center justify-center overflow-hidden rounded-2xl bg-white px-2">
                                                                    <ApplicationLogo className="h-full w-full object-contain" />
                                                                </div>
                                                            </Link>
                            <div className="hidden sm:flex sm:ml-6">
                                <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-copper-50 hover:text-copper-700">
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                        
                        {/* Right Side: Auth Logic */}
                        <div className="flex items-center">
                            {auth.user ? (
                                /* --- LOGGED IN STATE --- */
                                <div className="relative">
                                    {/* Button showing User's Name */}
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-3 rounded-2xl border border-copper-200 bg-copper-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-copper-100"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-copper-600 to-bronze text-xs font-bold text-white">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </span>
                                        {auth.user.name.split(' ')[0]} {/* Shows first name */}
                                        <svg className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-3xl border border-copper-100 bg-white py-2 shadow-copper-glow">
                                            
                                            {/* User Info (Disabled/Just for display) */}
                                            <div className="border-b border-copper-50 px-5 py-4">
                                                <p className="text-sm font-semibold text-slate-900">{auth.user.name}</p>
                                                <p className="text-xs capitalize text-slate-500">({auth.user.role})</p>
                                            </div>

                                            {/* Go to their specific Dashboard */}
                                            <Link
                                                href={auth.user.role === 'admin' ? route('admin.dashboard') : 
                                                     auth.user.role === 'instructor' ? route('instructor.courses.index') : 
                                                     route('student.dashboard')}
                                                onClick={() => setDropdownOpen(false)}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-copper-50"
                                            >
                                                My Dashboard
                                            </Link>

                                            {/* Change Profile / Password (Built by Breeze) */}
                                            <Link
                                                href={route('profile.edit')}
                                                onClick={() => setDropdownOpen(false)}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-copper-50"
                                            >
                                                Change Profile / Password
                                            </Link>

                                            {/* Divider */}
                                            <div className="my-1 border-t border-copper-50"></div>

                                            {/* Logout Button */}
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full px-5 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* --- GUEST STATE --- */
                                <div className="flex items-center space-x-4">
                                    <Link href={route('login')} className="text-sm font-medium text-slate-700 transition hover:text-copper-700">
                                        Login
                                    </Link>
                                    <Link href={route('register')} className="bg-gradient-to-r from-copper-700 to-bronze text-white rounded-full px-4 py-2.5 text-sm font-semibold shadow-lg transition hover:shadow-copper-glow">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Close dropdown if user clicks outside of it */}
            {dropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
            )}

            {/* Main Page Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-copper-100 bg-white">
                <div className="section-shell py-8">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        {currentUrl !== '/' ? (
                            <Link href="/" className="flex items-center">
                                <div className="flex h-16 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white px-2">
                                    <ApplicationLogo className="h-full w-full object-contain" />
                                </div>
                            </Link>
                        ) : null}
                        <div className="flex flex-col items-center sm:items-end">
                            <p className="text-sm text-slate-600">© {new Date().getFullYear()} Viral Acadamy. All rights reserved.</p>
                            <p className="text-sm text-slate-600 mt-1">Designed and developed by <span className="font-semibold">Goitom Hadush</span></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
