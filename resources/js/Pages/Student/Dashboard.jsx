import StudentLayout from '@/Layouts/StudentLayout';
import { Link, Head } from '@inertiajs/react';

export default function StudentDashboard({ myCourses = [], auth }) {
    return (
        <StudentLayout>
            <Head>
                <title>Student Dashboard | Viral Acadamy</title>
                <meta name="description" content="Access your courses, track your progress, and continue learning on Viral Acadamy's student dashboard." />
                <meta name="keywords" content="student dashboard, online courses, learn online, viral acadamy" />
                <meta property="og:title" content="Student Dashboard | Viral Acadamy" />
                <meta property="og:description" content="Access your courses, track your progress, and continue learning on Viral Acadamy's student dashboard." />
                <meta property="og:type" content="website" />
            </Head>
            
            <div className="mb-10 rounded-3xl bg-gradient-to-r from-copper-700 via-accent to-bronze p-8 text-white shadow-2xl shadow-copper-700/30 sm:p-10 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-lg">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-copper-100 mb-1">Student Dashboard</p>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, {auth.user.name.split(' ')[0]}!</h1>
                        </div>
                    </div>
                    {myCourses.length > 0 && (
                        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-copper-100">
                            Continue your learning journey with {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} in progress.
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10 animate-slide-up">
                <Link href={route('student.courses')} className="block group">
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
                        <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{myCourses.length}</p>
                    </div>
                </div>
                </Link>
                <Link href={route('student.courses')} className="block group">
                <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Lessons</h3>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">
                            {myCourses.reduce((sum, course) => sum + course.videos_count, 0)}
                        </p>
                    </div>
                </div>
                </Link>
                <Link href={route('student.courses')} className="block group">
                <div className="surface-card relative overflow-hidden p-7 rounded-3xl transition-all duration-500 hover:-translate-y-3 shadow-lg hover:shadow-xl border border-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">In Progress</h3>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 group-hover:bg-white/20 group-hover:text-white transition-colors shadow-md">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-5xl font-extrabold text-slate-900 group-hover:text-white transition-colors">{myCourses.length}</p>
                    </div>
                </div>
                </Link>
            </div>

            {/* Recent Courses */}
            {myCourses.length > 0 && (
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900">My Courses</h2>
                        <Link 
                            href={route('student.courses')} 
                            className="text-sm font-semibold text-copper-700 hover:text-copper-900 transition-colors"
                        >
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {myCourses.slice(0, 3).map((course) => (
                            <div key={course.id} className="surface-card card-hover overflow-hidden rounded-3xl shadow-lg border border-slate-100">
                                <div className="relative aspect-video overflow-hidden bg-slate-100">
                                    {course.thumbnail && course.thumbnail !== 'thumbnails/dummy.jpg' ? (
                                        <img 
                                            src={`/storage/${course.thumbnail}`} 
                                            alt={course.title} 
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-copper-200 to-bronze">
                                            <span className="px-4 text-center text-lg font-bold text-white">{course.title}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-white/90 text-slate-800">{course.videos_count} Lessons</span>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        by {course.instructor ? course.instructor.name : 'Unknown Instructor'}
                                    </p>
                                    
                                    <Link 
                                        href={route('student.learn', course.id)} 
                                        className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-copper-700 to-bronze text-white px-5 py-2.5 text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-copper-glow hover:scale-[1.02]"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {myCourses.length === 0 && (
                <div className="surface-card p-12 text-center animate-fade-in rounded-3xl shadow-lg border border-slate-100">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-copper-100">
                        <svg className="h-10 w-10 text-copper-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses yet!</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't purchased any courses yet. Start your learning journey today by browsing our course catalog.</p>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-copper-700 to-bronze text-white px-8 py-3 text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-copper-glow hover:scale-105">
                        Browse Courses
                    </Link>
                </div>
            )}
        </StudentLayout>
    );
}
