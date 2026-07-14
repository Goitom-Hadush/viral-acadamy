import InstructorLayout from '@/Layouts/InstructorLayout';
import { Link, Head } from '@inertiajs/react';

export default function InstructorDashboard({ stats = { courses: 0, published: 0, students: 0, revenue: 0 }, courses = [], recentPurchases = [], auth }) {
    return (
        <InstructorLayout>
            <Head>
                <title>Instructor Dashboard | Viral Acadamy</title>
                <meta name="description" content="Manage your courses, track student progress, and monitor your earnings on Viral Acadamy's instructor dashboard." />
                <meta name="keywords" content="instructor dashboard, online courses, teach online, viral acadamy" />
                <meta property="og:title" content="Instructor Dashboard | Viral Acadamy" />
                <meta property="og:description" content="Manage your courses, track student progress, and monitor your earnings on Viral Acadamy's instructor dashboard." />
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper-100 mb-1">Instructor Dashboard</p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {auth.user.name.split(' ')[0]}!</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10 animate-slide-up">
                <Link href={route('instructor.courses.index')} className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Courses</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{stats.courses}</p>
                        </div>
                    </div>
                </Link>

                <Link href={route('instructor.courses.index')} className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Published</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{stats.published}</p>
                        </div>
                    </div>
                </Link>

                <Link href={route('instructor.students')} className="block group">
                    <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Students</h3>
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{stats.students}</p>
                        </div>
                    </div>
                </Link>

                <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-copper-500 to-bronze opacity-0 transition-opacity duration-500 hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-white transition-colors">Total Revenue</h3>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-50 text-copper-600 hover:bg-white/20 hover:text-white transition-colors shadow-md">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-5xl font-extrabold text-slate-900 hover:text-white transition-colors">{Number(stats.revenue).toLocaleString()} ETB</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                {/* Course list */}
                <div className="surface-card lg:col-span-2 p-8 rounded-3xl shadow-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900">My Courses</h2>
                        <Link href={route('instructor.courses.index')} className="text-sm font-semibold text-copper-700 hover:text-copper-900 transition-colors">
                            View All →
                        </Link>
                    </div>
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-copper-50 text-copper-600 mb-4">
                                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No courses yet</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Create your first course and start sharing your knowledge with students!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr className="border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                                        <th className="py-4 px-6">Course</th>
                                        <th className="py-4 px-6">Videos</th>
                                        <th className="py-4 px-6">Students</th>
                                        <th className="py-4 px-6">Revenue</th>
                                        <th className="py-4 px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <Link href={route('instructor.courses.index')} className="font-semibold text-slate-900 hover:text-copper-700 transition-colors">
                                                    {course.title}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">{course.videos_count}</td>
                                            <td className="py-4 px-6 text-slate-700">{course.students_count}</td>
                                            <td className="py-4 px-6 text-slate-700 font-semibold">{Number(course.revenue || 0).toLocaleString()} ETB</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                                                    course.status === 'published' 
                                                        ? 'bg-emerald-100 text-emerald-700' 
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {course.status}
                                                </span>
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
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Recent Sales</h2>
                    {recentPurchases.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
                                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">No sales yet</h3>
                            <p className="text-slate-500 text-sm">Your first sale will appear here!</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {recentPurchases.map((purchase) => (
                                <li key={purchase.id} className="rounded-2xl bg-slate-50 p-4 transition-all hover:bg-slate-100 hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{purchase.student_name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{purchase.course_title}</p>
                                            <p className="text-xs text-slate-400 mt-1">{purchase.created_at}</p>
                                        </div>
                                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                                            {Number(purchase.amount).toLocaleString()} ETB
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </InstructorLayout>
    );
}
