import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({ courses = [], advertisement = null }) {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(false);
    const [showUnmute, setShowUnmute] = useState(false);
    
    const scrollToCourses = (e) => {
        e.preventDefault();
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!advertisement) return;
        const v = videoRef.current;
        if (!v) return;

        // Try to autoplay with sound first. If that fails, autoplay muted and show unmute button.
        const tryPlay = async () => {
            try {
                v.muted = false;
                await v.play();
                setMuted(false);
                setShowUnmute(false);
            } catch (e) {
                try {
                    v.muted = true;
                    await v.play();
                    setMuted(true);
                    setShowUnmute(true);
                } catch (e2) {
                    // Can't autoplay at all — show unmute/play overlay
                    setShowUnmute(true);
                    v.controls = true;
                }
            }
        };

        tryPlay();
    }, [advertisement]);
    const featuredCourses = courses.slice(0, 3);

    return (
        <AppLayout>
            <Head>
                <title>Viral Acadamy | Online Education, Video Tutorials in Ethiopia</title>
                <meta name="description" content="Viral Acadamy offers premium online video courses and tutorials in Ethiopia. Learn new skills with our modern, tube-style learning platform featuring expert instructors and HD video lessons." />
                <meta name="keywords" content="viral skill, viral acadamy, viral skill acadamy, video tutorial in ethiopia, video tutorial, online education, online tutor, online tutorial, ethiopia online courses, ethiopian e-learning" />
                <meta property="og:title" content="Viral Acadamy | Online Education, Video Tutorials in Ethiopia" />
                <meta property="og:description" content="Viral Acadamy offers premium online video courses and tutorials in Ethiopia. Learn new skills with our modern, tube-style learning platform featuring expert instructors and HD video lessons." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Viral Acadamy | Online Education, Video Tutorials in Ethiopia" />
                <meta name="twitter:description" content="Viral Acadamy offers premium online video courses and tutorials in Ethiopia. Learn new skills with our modern, tube-style learning platform featuring expert instructors and HD video lessons." />
            </Head>
            <div className="pb-20 pt-8 sm:pt-12">
                <section className="section-shell">
                    <div className="hero-surface grid items-center gap-10 overflow-hidden rounded-[36px] border border-copper-100 px-6 py-10 shadow-[0_30px_120px_-50px_rgba(184,115,51,0.25)] backdrop-blur-xl sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-14">
                        <div className="relative z-10 hidden sm:block">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-copper-300/30 bg-copper-300/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-copper-800">
                                Modern Video Learning
                            </div>
                            <h1 className="text-balance text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Learn with a clean, attractive, tube-style academy experience.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                                Discover premium courses, watch lessons in a focused player, and enjoy a simpler interface designed for students, instructors, and admins.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <a href="#courses" onClick={scrollToCourses} className="btn-primary px-7 py-4 text-base normal-case tracking-normal">
                                    Explore Courses
                                </a>
                                <Link href={route('register')} className="btn-secondary px-7 py-4 text-base normal-case tracking-normal">
                                    Join the Academy
                                </Link>
                            </div>

                            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="glass-panel p-4 text-slate-900">
                                    <p className="text-3xl font-bold">{courses.length}+</p>
                                    <p className="mt-1 text-sm text-slate-600">Published learning paths</p>
                                </div>
                                <div className="glass-panel p-4 text-slate-900">
                                    <p className="text-3xl font-bold">HD</p>
                                    <p className="mt-1 text-sm text-slate-600">Video-first lesson streaming</p>
                                </div>
                                <div className="glass-panel p-4 text-slate-900">
                                    <p className="text-3xl font-bold">3</p>
                                    <p className="mt-1 text-sm text-slate-600">Simple dashboards by role</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-10 top-0 h-36 w-36 rounded-full bg-copper-500/25 blur-3xl" />
                            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                            <div className="relative rounded-[32px] border border-copper-200 bg-white/80 p-4 shadow-[0_30px_90px_-40px_rgba(184,115,51,0.35)] backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2 rounded-2xl bg-slate-100/80 px-4 py-3">
                                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                                    <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                                    <div className="ml-3 truncate rounded-full bg-white/60 px-4 py-1 text-xs text-slate-700">
                                        learn.nativiralacadamy.com/watch
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-[28px] bg-slate-100">
                                {advertisement ? (
                                    <>
                                        <div className="relative aspect-video">
                                            <video
                                                ref={videoRef}
                                                src={`/storage/${advertisement.video_path}`}
                                                autoPlay
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Unmute / Play overlay */}
                                            {showUnmute && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button
                                                        onClick={async () => {
                                                            const v = videoRef.current;
                                                            if (!v) return;
                                                            try {
                                                                v.muted = false;
                                                                await v.play();
                                                                setMuted(false);
                                                                setShowUnmute(false);
                                                            } catch (e) {
                                                                // still couldn't play with sound; let user use controls
                                                                v.controls = true;
                                                            }
                                                        }}
                                                        className="rounded-full bg-white/90 px-5 py-3 font-semibold shadow-lg"
                                                    >
                                                        Play with sound
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile CTA: Browse Courses under the advertisement video */}
                                        <div className="sm:hidden mt-4 flex justify-center">
                                            <a href="#courses" onClick={scrollToCourses} className="w-full max-w-xs text-center rounded-full bg-gradient-to-r from-copper-700 to-bronze text-white px-6 py-3 font-semibold shadow-lg hover:shadow-2xl transition-all">
                                                Browse Courses
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <div className="aspect-video bg-gradient-to-br from-copper-500 via-accent to-bronze p-6">
                                        <div className="flex h-full flex-col justify-between rounded-[24px] border border-white/30 bg-white/40 p-5 text-slate-900">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[0.3em] text-copper-800">Featured Lesson</p>
                                                    <h2 className="mt-2 text-2xl font-bold">Build smarter with focused learning</h2>
                                                </div>
                                                <div className="rounded-2xl bg-white/60 px-3 py-2 text-sm font-semibold text-copper-800">4K UI</div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-2 rounded-full bg-white/40">
                                                    <div className="h-2 w-2/3 rounded-full bg-copper-600"></div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-slate-700">
                                                    <span>14 lessons</span>
                                                    <span>Modern dashboard flow</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                                {featuredCourses.length > 0 && (
                                    <div className="mt-4 grid gap-3">
                                        {featuredCourses.map((course) => (
                                            <div key={course.id} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 text-slate-900">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-copper-100 text-sm font-bold text-copper-800">
                                                    {course.videos_count || 0}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold">{course.title}</p>
                                                    <p className="text-xs text-slate-600">{course.instructor?.name || 'Expert Instructor'}</p>
                                                </div>
                                                <div className="text-sm font-semibold text-copper-700">{course.price} ETB</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mobile Featured Courses (visible on mobile only) */}
                <section id="courses" className="section-shell mt-8 sm:hidden">
                    <div className="mb-6">
                        <h2 className="page-title">Featured Courses</h2>
                        <p className="page-subtitle">Discover high-value lessons with a cleaner and more attractive course browsing experience.</p>
                        <div className="mt-3 rounded-full border border-copper-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_14px_40px_-28px_rgba(184,115,51,0.35)] backdrop-blur inline-block">
                            {courses.length} courses available
                        </div>
                    </div>

                    <div className="space-y-4">
                        {featuredCourses.map((course) => (
                            <Link key={course.id} href={route('courses.show', course.id)} className="block">
                                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                                    {course.thumbnail ? (
                                        <img src={`/storage/${course.thumbnail}`} alt={course.title} className="h-20 w-28 rounded-md object-cover" />
                                    ) : (
                                        <div className="h-20 w-28 rounded-md bg-slate-100" />
                                    )}
                                    <div className="flex-1">
                                        <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-copper-800 mb-1">Video Course</div>
                                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{course.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{course.description}</p>
                                        <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                                            <span>by {course.instructor?.name || 'Unknown'}</span>
                                            <span className="font-semibold text-copper-700">{course.price} ETB</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Course Grid (hidden on mobile) */}
                <section id="courses" className="section-shell mt-16 hidden sm:block">
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="page-title">Featured Courses</h2>
                            <p className="page-subtitle">Discover high-value lessons with a cleaner and more attractive course browsing experience.</p>
                        </div>
                        <div className="rounded-full border border-copper-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_14px_40px_-28px_rgba(184,115,51,0.35)] backdrop-blur">
                            {courses.length} courses available
                        </div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="surface-card p-16 text-center">
                            <div className="text-6xl text-copper-300">📚</div>
                            <h3 className="mt-6 text-2xl font-semibold text-slate-800">No courses published yet</h3>
                            <p className="mt-3 text-slate-500">Check back soon for exciting new courses.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {courses.map((course) => {
                                const safeCourse = {
                                    ...course,
                                    instructor: course.instructor || { name: 'Unknown Instructor' },
                                    videos_count: course.videos_count || 0
                                };
                                return (
                                    <Link key={safeCourse.id} href={route('courses.show', safeCourse.id)} className="group">
                                        <div className="surface-card flex h-full flex-col overflow-hidden transition duration-500 hover:-translate-y-2 hover:shadow-[0_34px_100px_-35px_rgba(184,115,51,0.45)]">
                                            
                                            {/* Thumbnail */}
                                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-copper-700 via-copper-500 to-bronze">
                                                {safeCourse.thumbnail && safeCourse.thumbnail !== 'thumbnails/dummy.jpg' ? (
                                                    <img 
                                                        src={`/storage/${safeCourse.thumbnail}`} 
                                                        alt={safeCourse.title} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                                                <div className="absolute inset-x-0 bottom-0 p-5">
                                                    <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur">
                                                        Video Course
                                                    </div>
                                                    <p className="mt-3 text-xl font-bold text-white line-clamp-2">{safeCourse.title}</p>
                                                </div>
                                                {/* Price Tag */}
                                                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-copper-700 shadow-lg backdrop-blur">
                                                    {safeCourse.price} ETB
                                                </div>
                                            </div>

                                            <div className="flex flex-grow flex-col p-6">
                                                <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-copper-600 line-clamp-2">
                                                    {safeCourse.title}
                                                </h3>
                                                
                                                <p className="mb-6 flex-grow text-sm leading-7 text-slate-600 line-clamp-3">
                                                    {safeCourse.description}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between border-t border-copper-100 pt-4 text-sm text-slate-500">
                                                    <span>
                                                        by <span className="font-semibold text-slate-800">{safeCourse.instructor.name}</span>
                                                    </span>
                                                    <span className="rounded-full bg-copper-100 px-3 py-1 font-medium text-copper-700">
                                                        {safeCourse.videos_count} Lessons
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
