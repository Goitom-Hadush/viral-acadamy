import AppLayout from '@/Layouts/AppLayout';
import CoursePriceBadges from '@/Components/CoursePriceBadges';
import CourseThumbnail from '@/Components/CourseThumbnail';
import SocialShare from '@/Components/SocialShare';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useT';

export default function CoursesIndex({ courses = [], categories = [] }) {
    const { auth } = usePage().props;
    const t = useT();
    const isLoggedIn = !!auth?.user;
    const [activeCategory, setActiveCategory] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const filteredCourses = activeCategory === 'all'
        ? courses
        : courses.filter((c) => c.category?.id === activeCategory);

    const selectedLabel = activeCategory === 'all'
        ? t('home.all_courses', 'All Courses')
        : categories.find((c) => c.id === activeCategory)?.name ?? t('home.all_courses', 'All Courses');

    const selectedCount = activeCategory === 'all'
        ? courses.length
        : categories.find((c) => c.id === activeCategory)?.courses_count ?? 0;

    const byParts = t('courses.by_instructor', 'by {name}').split('{name}');

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.courses_title', 'Online Courses & Masterclasses | Success Life Coaching Academy')}</title>
                <meta
                    name="description"
                    content={t('pages.courses_desc', 'Browse Success Life Coaching online courses and video masterclasses in mindset elevation, leadership, personal growth, and practical income creation in Ethiopia.')}
                />
                <meta property="og:title" content={t('courses.og_title', 'Online Courses & Masterclasses | Success Life Coaching')} />
                <meta property="og:description" content={t('courses.og_desc', 'Online learning and video masterclasses from Success Life Coaching Academy.')} />
            </Head>

            <div className="pb-20 pt-6 sm:pt-10">
                <section className="section-shell">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 mb-3">
                                <span>📚</span>
                                <span>{t('pages.courses_eyebrow', 'Catalog')}</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                                {t('pages.courses_heading', 'Transformative Masterclasses')}
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                                {t('pages.courses_intro', 'Explore our published learning paths, master actionable skills, and start streaming immediately.')}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-copper-200/90 bg-white/95 px-4 py-2 text-xs sm:text-sm font-bold text-copper-800 shadow-sm backdrop-blur shrink-0 inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{t('courses.count_of', '{shown} of {total} courses available').replace('{shown}', filteredCourses.length).replace('{total}', courses.length)}</span>
                        </div>
                    </div>

                    {categories.length > 0 && (
                        <div className="mb-10 flex items-center gap-4">
                            <span className="hidden text-sm font-semibold text-slate-500 sm:inline">{t('home.filter', 'Filter by:')}</span>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen((o) => !o)}
                                    className="inline-flex min-w-[220px] items-center justify-between gap-3 rounded-2xl border border-copper-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-copper-400 hover:shadow-md"
                                >
                                    <span className="flex items-center gap-2">
                                        {selectedLabel}
                                        <span className="rounded-full bg-copper-100 px-2 py-0.5 text-xs font-bold text-copper-700">
                                            {selectedCount}
                                        </span>
                                    </span>
                                    <svg className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-copper-100 bg-white shadow-2xl">
                                        <button
                                            type="button"
                                            onClick={() => { setActiveCategory('all'); setDropdownOpen(false); }}
                                            className={`flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors ${
                                                activeCategory === 'all' ? 'bg-copper-50 text-copper-700' : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {t('home.all_courses', 'All Courses')}
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{courses.length}</span>
                                        </button>
                                        <div className="border-t border-slate-100" />
                                        {categories.map((cat, i) => (
                                            <div key={cat.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setActiveCategory(cat.id); setDropdownOpen(false); }}
                                                    className={`flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors ${
                                                        activeCategory === cat.id ? 'bg-copper-50 text-copper-700' : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {cat.name}
                                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{cat.courses_count}</span>
                                                </button>
                                                {i < categories.length - 1 && <div className="border-t border-slate-50" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {filteredCourses.length === 0 ? (
                        <div className="overflow-hidden rounded-3xl border border-copper-100 bg-white p-12 sm:p-16 text-center shadow-sm">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-copper-100 text-3xl mb-4">
                                📚
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">{t('courses.empty_title', 'No courses in this category yet')}</h3>
                            <p className="mt-2 text-sm text-slate-500">{t('courses.empty_body', 'Try selecting a different category or check back soon.')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {filteredCourses.map((course) => {
                                const safeCourse = {
                                    ...course,
                                    instructor: course.instructor || { name: t('courses.default_instructor', 'Success Life Coach') },
                                    videos_count: course.videos_count || 0,
                                };

                                return (
                                    <article key={safeCourse.id} className="course-card group">
                                        <Link href={route('courses.show', safeCourse.id)} prefetch className="block">
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <CourseThumbnail
                                                    thumbnail={safeCourse.thumbnail}
                                                    alt={safeCourse.title}
                                                    className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                                                    imgClassName="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                                                {safeCourse.category ? (
                                                    <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-copper-800 backdrop-blur shadow-sm">
                                                        {safeCourse.category.name}
                                                    </div>
                                                ) : null}
                                                {(Number(safeCourse.price) === 0 || isLoggedIn) && (
                                                    <CoursePriceBadges
                                                        price={safeCourse.price}
                                                        priceUsd={safeCourse.price_usd}
                                                        freeLabel={t('courses.free', 'FREE')}
                                                        className={safeCourse.category ? 'top-12' : ''}
                                                    />
                                                )}
                                            </div>

                                            <div className="p-6 pb-0">
                                                <h3 className="mb-2 line-clamp-2 text-lg sm:text-xl font-bold text-slate-900 transition-colors group-hover:text-copper-700 leading-snug">
                                                    {safeCourse.title}
                                                </h3>
                                                <p className="mb-5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                                                    {safeCourse.description}
                                                </p>
                                                <div className="flex items-center justify-between border-t border-copper-100 pt-4 text-xs sm:text-sm text-slate-500">
                                                    <span>
                                                        {byParts[0]}<span className="font-semibold text-slate-800">{safeCourse.instructor.name}</span>{byParts[1]}
                                                    </span>
                                                    {isLoggedIn && safeCourse.videos_count > 0 ? (
                                                        <span className="font-semibold text-copper-700">{safeCourse.videos_count} {t('home.videos', 'lessons')}</span>
                                                    ) : (
                                                        <span className="font-bold text-copper-700 flex items-center gap-1">
                                                            <span>{t('home.view_course', 'Start Watching')}</span>
                                                            <span>➜</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="p-6 pt-4 border-t border-copper-50 mt-4 bg-slate-50/50">
                                            <SocialShare
                                                url={`/courses/${safeCourse.id}`}
                                                title={safeCourse.title}
                                                text={t('courses.share_text', 'Check out “{title}” on Success Life Coaching Academy').replace('{title}', safeCourse.title)}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
