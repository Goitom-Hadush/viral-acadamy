import StudentLayout from '@/Layouts/StudentLayout';
import { Link } from '@inertiajs/react';

export default function MyCourses({ myCourses = [], auth }) {
    return (
        <StudentLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Student Library</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Courses</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    You have {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} available for learning.
                </p>
            </div>

            {myCourses.length === 0 ? (
                <div className="surface-card p-12 text-center animate-fade-in">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                        <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses yet!</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't purchased any courses yet. Start your learning journey today by browsing our course catalog.</p>
                    <Link href="/" className="btn-primary">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                    {myCourses.map((course) => (
                        <div key={course.id} className="surface-card card-hover overflow-hidden">
                            <div className="relative aspect-video overflow-hidden bg-slate-100">
                                {course.thumbnail && course.thumbnail !== 'thumbnails/dummy.jpg' ? (
                                    <img 
                                        src={`/storage/${course.thumbnail}`} 
                                        alt={course.title} 
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                                        <span className="px-4 text-center text-lg font-bold text-slate-500">{course.title}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="badge badge-success">{course.videos_count} Lessons</span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    by {course.instructor ? course.instructor.name : 'Unknown Instructor'}
                                </p>
                                
                                <Link 
                                    href={route('student.learn', course.id)} 
                                    className="btn-primary w-full"
                                >
                                    Continue Learning
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}
