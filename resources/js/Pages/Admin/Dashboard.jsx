import AdminLayout from '@/Layouts/AdminLayout';
import { Link, Head } from '@inertiajs/react';

export default function AdminDashboard({
    stats = { students: 0, courses: 0, revenue: 0, average_price: 0 },
    courses = [],
    recentPayments = [],
    auth
}) {
    return (
        <AdminLayout>
            <Head>
                <title>Admin Dashboard | Viral Acadamy</title>
                <meta name="description" content="Manage students, courses, payments, and platform revenue from Viral Acadamy's admin dashboard." />
                <meta name="keywords" content="admin dashboard, online course platform, viral acadamy, manage courses" />
                <meta property="og:title" content="Admin Dashboard | Viral Acadamy" />
                <meta property="og:description" content="Manage students, courses, payments, and platform revenue from Viral Acadamy's admin dashboard." />
                <meta property="og:type" content="website" />
            </Head>
            
            {/* Hero Section */}
            <div className="mb-10 rounded-3xl bg-gradient-to-r from-copper-700 via-accent to-bronze p-8 text-white shadow-2xl shadow-copper-700/30 sm:p-10 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper-100 mb-1">Admin Dashboard</p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {auth.user.name.split(' ')[0]}!</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10 animate-slide-up">
                <Link href="/admin/users" className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Students</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{stats.students}</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/courses" className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Courses</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{stats.courses}</p>
                            <p className="text-sm font-semibold text-slate-500 group-hover:text-emerald-100 mt-2 transition-colors">Avg price: {Number(stats.average_price).toLocaleString()} ETB</p>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/payments" className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Revenue</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{Number(stats.revenue).toLocaleString()} ETB</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                {/* Course list with price/enrollment/revenue */}
                <div className="surface-card lg:col-span-2 p-8 rounded-3xl shadow-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900">Courses</h2>
                        <Link href="/admin/courses" className="text-sm font-semibold text-copper-700 hover:text-copper-900 transition-colors">
                            View All →
                        </Link>
                    </div>
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
                                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No courses yet</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Courses will appear here once instructors create them!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                                        <th className="py-4 px-6">Course</th>
                                        <th className="py-4 px-6">Price</th>
                                        <th className="py-4 px-6">Students</th>
                                        <th className="py-4 px-6">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-slate-900">{course.title}</td>
                                            <td className="py-4 px-6 text-slate-700">
                                                {Number(course.price).toLocaleString()} ETB
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">{course.students_count}</td>
                                            <td className="py-4 px-6 text-slate-700 font-semibold">
                                                {Number(course.revenue).toLocaleString()} ETB
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Recent activity */}
                <div className="surface-card p-8 rounded-3xl shadow-lg border border-slate-100">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Recent Payments</h2>
                    {recentPayments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
                                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No payments yet</h3>
                            <p className="text-slate-500 text-sm">Payments will appear here once students enroll!</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {recentPayments.map((payment) => (
                                <li key={payment.id} className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{payment.student_name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{payment.course_title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{payment.created_at}</p>
                                        </div>
                                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                                            {Number(payment.amount).toLocaleString()} ETB
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
