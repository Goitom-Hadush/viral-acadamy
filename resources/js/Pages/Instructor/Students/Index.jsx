import InstructorLayout from '@/Layouts/InstructorLayout';
import { Link } from '@inertiajs/react';

export default function StudentIndex({ students = [], total_students = 0, auth }) {
    return (
        <InstructorLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Student Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Students</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    View students enrolled in your courses. You have {total_students} unique student{total_students !== 1 ? 's' : ''}.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8 animate-slide-up">
                <Link href="/instructor/earnings" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Students</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{total_students}</p>
                    </div>
                </div>
                </Link>

                <Link href="/instructor/courses" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Enrollments</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{students.length}</p>
                    </div>
                </div>
                </Link>

                <Link href="/instructor/courses" className="block">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Active Courses</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">Coming Soon</p>
                    </div>
                </div>
                </Link>
            </div>

            {/* Students List */}
            <div className="surface-card overflow-hidden animate-slide-up">
                {students.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-slate-900">No students yet</h3>
                        <p className="text-slate-500">When students enroll in your courses, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-6">Student</th>
                                    <th className="p-6">Email</th>
                                    <th className="p-6">Course</th>
                                    <th className="p-6">Amount</th>
                                    <th className="p-6">Purchased</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, index) => (
                                    <tr key={`${student.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{student.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600">{student.email}</td>
                                        <td className="p-6 text-slate-700">{student.course_title}</td>
                                        <td className="p-6 font-semibold text-slate-900">{student.amount} ETB</td>
                                        <td className="p-6 text-slate-500">{student.purchased_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </InstructorLayout>
    );
}
