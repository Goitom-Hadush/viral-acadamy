import InstructorLayout from '@/Layouts/InstructorLayout';
import { Link } from '@inertiajs/react';

export default function EarningIndex({ total_earnings = 0, earnings_by_course = [], recent_purchases = [], auth }) {
    return (
        <InstructorLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Earnings Overview</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Earnings</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    Track your revenue from course sales. Total earnings: {Number(total_earnings).toLocaleString()} ETB.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8 animate-slide-up">
                <Link href="/instructor/students" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Earnings</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{Number(total_earnings).toLocaleString()} ETB</p>
                    </div>
                </div>
                </Link>

                <Link href="/instructor/courses" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Active Courses</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{earnings_by_course.length}</p>
                    </div>
                </div>
                </Link>

                <Link href="/instructor/students" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Sales</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{earnings_by_course.reduce((sum, course) => sum + course.student_count, 0)}</p>
                    </div>
                </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                {/* Earnings by Course */}
                <div className="surface-card p-6">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Earnings by Course</h2>
                    {earnings_by_course.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                            No earnings data yet. Publish your courses to start earning!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {earnings_by_course.map((course) => (
                                <div key={course.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{course.title}</p>
                                        <p className="text-sm text-slate-500">{course.student_count} students</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-600">{Number(course.revenue).toLocaleString()} ETB</p>
                                        <p className="text-xs text-slate-500">{course.price} ETB/course</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Purchases */}
                <div className="surface-card p-6">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Recent Purchases</h2>
                    {recent_purchases.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                            No recent purchases yet.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {recent_purchases.map((purchase) => (
                                <li key={purchase.id} className="flex items-start justify-between rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{purchase.student_name}</p>
                                        <p className="text-xs text-slate-500">{purchase.course_title}</p>
                                        <p className="text-xs text-slate-400">{purchase.purchased_at}</p>
                                    </div>
                                    <span className="badge badge-success">
                                        {Number(purchase.amount).toLocaleString()} ETB
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}
