import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

const statCards = [
    {
        key: 'categories',
        label: 'Categories',
        accent: 'from-indigo-500 to-indigo-600',
        href: '/admin/categories',
    },
    {
        key: 'courses',
        label: 'Courses',
        accent: 'from-fuchsia-500 to-purple-600',
        href: '/admin/courses',
    },
    {
        key: 'videos',
        label: 'Videos',
        accent: 'from-emerald-500 to-teal-600',
        href: '/admin/courses?view=videos',
    },
    {
        key: 'reviews',
        label: 'Ratings & Comments',
        accent: 'from-amber-500 to-orange-600',
        href: '/admin/courses?view=reviews',
    },
];

function formatPrice(amount) {
    return `${Number(amount || 0).toLocaleString()} ETB`;
}

function formatDate(value) {
    if (!value) {
        return 'No date';
    }

    return new Date(value).toLocaleDateString();
}

function renderStars(rating = 0) {
    return Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < Math.round(rating) ? 'text-amber-400' : 'text-slate-300'}>
            ★
        </span>
    ));
}

export default function CoursesIndex({ categories = [], stats = {}, view = 'courses' }) {
    const totalCourses = stats.courses || 0;
    const viewConfig = {
        courses: {
            eyebrow: 'Course Library Control',
            title: 'Manage Courses Across Every Category',
            description: 'Browse every course by category, review instructors and pricing, and remove full courses when content should no longer stay on the platform.',
        },
        videos: {
            eyebrow: 'Video Library Control',
            title: 'Manage Every Course Video',
            description: 'Open the video-focused admin view to inspect uploaded lessons course by course and remove any lesson that should not remain available.',
        },
        reviews: {
            eyebrow: 'Comments Control',
            title: 'Manage Ratings and Comments',
            description: 'Open the feedback-focused admin view to inspect student ratings and comments for each course and remove inappropriate reviews quickly.',
        },
    };
    const activeView = viewConfig[view] ? view : 'courses';
    const contentIntro = viewConfig[activeView];
    const allCourses = categories.flatMap((category) =>
        (category.courses || []).map((course) => ({
            ...course,
            category_name: course.category?.name || category.name,
            category_slug: course.category?.slug || category.slug,
        })),
    );
    const allVideos = allCourses.flatMap((course) =>
        (course.videos || []).map((video) => ({
            ...video,
            course_title: course.title,
            instructor_name: course.instructor?.name || 'Unknown',
            category_name: course.category_name,
        })),
    );
    const allReviews = allCourses.flatMap((course) =>
        (course.reviews || []).map((review) => ({
            ...review,
            course_title: course.title,
            instructor_name: course.instructor?.name || 'Unknown',
            category_name: course.category_name,
        })),
    );

    const handleDeleteCourse = (courseId, title) => {
        if (confirm(`Delete "${title}" and all its videos, reviews, payments, and purchases?`)) {
            router.delete(route('admin.courses.destroy', courseId), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteVideo = (videoId, title) => {
        if (confirm(`Delete the video "${title}"?`)) {
            router.delete(route('admin.videos.destroy', videoId), {
                preserveScroll: true,
            });
        }
    };

    const handleDeleteReview = (reviewId, studentName) => {
        if (confirm(`Delete ${studentName}'s review?`)) {
            router.delete(route('admin.reviews.destroy', reviewId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">{contentIntro.eyebrow}</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{contentIntro.title}</h1>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-indigo-100">
                    {contentIntro.description}
                </p>
                <div className="mt-5 inline-flex max-w-4xl flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white/90">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">Admin Permission</span>
                    <span>
                        You can view and delete any course, video, or comment uploaded by any instructor from this page.
                    </span>
                </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                    <Link key={card.key} href={card.href} className="surface-card p-5 animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
                        <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-r ${card.accent} px-4 py-2 text-sm font-semibold text-white shadow-lg`}>
                            {card.label}
                        </div>
                        <p className="text-3xl font-black text-slate-900">{stats[card.key] || 0}</p>
                        <p className="mt-2 text-sm text-slate-500">Live totals from the admin content library.</p>
                    </Link>
                ))}
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
                <Link
                    href={route('admin.courses.index', { view: 'courses' })}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        activeView === 'courses'
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                >
                    Courses
                </Link>
                <Link
                    href={route('admin.courses.index', { view: 'videos' })}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        activeView === 'videos'
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                >
                    Videos
                </Link>
                <Link
                    href={route('admin.courses.index', { view: 'reviews' })}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        activeView === 'reviews'
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                    }`}
                >
                    Comments
                </Link>
            </div>

            {totalCourses === 0 ? (
                <div className="surface-card p-16 text-center animate-slide-up">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                        <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">No courses yet</h3>
                    <p className="mt-2 text-slate-500">Courses will appear here once instructors start publishing content.</p>
                </div>
            ) : activeView === 'videos' ? (
                allVideos.length === 0 ? (
                    <div className="surface-card p-16 text-center animate-slide-up">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                            <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h6a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">No videos uploaded yet</h3>
                        <p className="mt-2 text-slate-500">Uploaded course videos will appear here for the admin account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allVideos.map((video) => (
                            <div key={video.id} className="surface-card animate-slide-up p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                                                Lesson {video.sequence || 0}
                                            </span>
                                            <p className="text-lg font-bold text-slate-900">{video.title}</p>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Course: <span className="font-semibold text-slate-900">{video.course_title}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Instructor: <span className="font-semibold text-slate-900">{video.instructor_name}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Category: <span className="font-semibold text-slate-900">{video.category_name}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Added: <span className="font-semibold text-slate-900">{formatDate(video.created_at)}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={route('video.stream', video.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                        >
                                            Watch Video
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVideo(video.id, video.title)}
                                            className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                                        >
                                            Delete Video
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : activeView === 'reviews' ? (
                allReviews.length === 0 ? (
                    <div className="surface-card p-16 text-center animate-slide-up">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                            <svg className="h-10 w-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">No comments yet</h3>
                        <p className="mt-2 text-slate-500">Student ratings and comments will appear here for the admin account.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allReviews.map((review) => (
                            <div key={review.id} className="surface-card animate-slide-up p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <p className="text-lg font-bold text-slate-900">{review.user?.name || 'Student'}</p>
                                            <div className="flex text-sm">{renderStars(review.rating)}</div>
                                            <span className="text-sm font-semibold text-amber-600">{review.rating}/5</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Course: <span className="font-semibold text-slate-900">{review.course_title}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Instructor: <span className="font-semibold text-slate-900">{review.instructor_name}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Category: <span className="font-semibold text-slate-900">{review.category_name}</span>
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1.5">
                                                Submitted: <span className="font-semibold text-slate-900">{formatDate(review.created_at)}</span>
                                            </span>
                                        </div>
                                        <p className="mt-4 text-sm leading-6 text-slate-600">
                                            {review.comment || 'This student left a rating without a written comment.'}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteReview(review.id, review.user?.name || 'this student')}
                                            className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                                        >
                                            Delete Review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="space-y-8">
                    {categories.map((category) => (
                        <section key={category.id} className="surface-card overflow-hidden animate-slide-up">
                            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-5 sm:px-8">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Category</p>
                                        <h2 className="mt-2 text-2xl font-black text-slate-900">{category.name}</h2>
                                        <p className="mt-2 text-sm text-slate-500">
                                            {category.courses_count || category.courses?.length || 0} course{(category.courses_count || category.courses?.length || 0) === 1 ? '' : 's'} in this category.
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                                        Slug: <span className="font-semibold text-slate-900">{category.slug}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8">
                                {!category.courses || category.courses.length === 0 ? (
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                                        No courses inside this category yet.
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {category.courses.map((course) => {
                                            const averageRating = Number(course.reviews_avg_rating || 0);
                                            const hasCustomThumbnail = course.thumbnail && course.thumbnail !== 'thumbnails/dummy.jpg';

                                            return (
                                                <article key={course.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                                                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                                                        <div className="flex flex-1 gap-4">
                                                            <div className="h-24 w-32 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                                                                {hasCustomThumbnail ? (
                                                                    <img
                                                                        src={`/storage/${course.thumbnail}`}
                                                                        alt={course.title}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
                                                                        No image
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <h3 className="text-2xl font-black text-slate-900">{course.title}</h3>
                                                                    <span className={`badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                                                        {course.status === 'published' ? 'Published' : 'Draft'}
                                                                    </span>
                                                                </div>

                                                                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{course.description}</p>

                                                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                                                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium">
                                                                        Instructor: <span className="font-semibold text-slate-900">{course.instructor?.name || 'Unknown'}</span>
                                                                    </span>
                                                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium">
                                                                        Price: <span className="font-semibold text-slate-900">{formatPrice(course.price)}</span>
                                                                    </span>
                                                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium">
                                                                        Videos: <span className="font-semibold text-slate-900">{course.videos_count || course.videos?.length || 0}</span>
                                                                    </span>
                                                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium">
                                                                        Reviews: <span className="font-semibold text-slate-900">{course.reviews_count || course.reviews?.length || 0}</span>
                                                                    </span>
                                                                    <span className="rounded-full bg-amber-50 px-3 py-1.5 font-medium text-amber-700">
                                                                        Rating: <span className="font-semibold">{averageRating > 0 ? averageRating.toFixed(1) : 'No rating'}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 flex-wrap gap-3 xl:w-52 xl:flex-col">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                                                className="rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
                                                            >
                                                                Delete Course
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 grid gap-6 xl:grid-cols-2">
                                                        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                                <div>
                                                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Videos</p>
                                                                    <h4 className="mt-1 text-lg font-bold text-slate-900">All lessons in this course</h4>
                                                                </div>
                                                                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm">
                                                                    {course.videos?.length || 0} total
                                                                </span>
                                                            </div>

                                                            {!course.videos || course.videos.length === 0 ? (
                                                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                                                    No videos uploaded for this course.
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    {course.videos.map((video) => (
                                                                        <div key={video.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                                <div>
                                                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                                                                        Lesson {video.sequence || 0}
                                                                                    </p>
                                                                                    <p className="mt-1 text-base font-semibold text-slate-900">{video.title}</p>
                                                                                    <p className="mt-2 text-xs text-slate-500">
                                                                                        Added {formatDate(video.created_at)}
                                                                                    </p>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteVideo(video.id, video.title)}
                                                                                    className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                                                                                >
                                                                                    Delete Video
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                                <div>
                                                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Ratings & Comments</p>
                                                                    <h4 className="mt-1 text-lg font-bold text-slate-900">Student feedback</h4>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="flex justify-end text-lg leading-none">{renderStars(averageRating)}</div>
                                                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                                                        {averageRating > 0 ? averageRating.toFixed(1) : 'No rating yet'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {!course.reviews || course.reviews.length === 0 ? (
                                                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                                                    No comments or ratings submitted yet.
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    {course.reviews.map((review) => (
                                                                        <div key={review.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                                                <div className="min-w-0 flex-1">
                                                                                    <div className="flex flex-wrap items-center gap-3">
                                                                                        <p className="text-base font-semibold text-slate-900">{review.user?.name || 'Student'}</p>
                                                                                        <div className="flex text-sm">{renderStars(review.rating)}</div>
                                                                                        <span className="text-sm font-semibold text-amber-600">{review.rating}/5</span>
                                                                                    </div>
                                                                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                                                                        {review.comment || 'This student left a rating without a written comment.'}
                                                                                    </p>
                                                                                    <p className="mt-3 text-xs text-slate-500">
                                                                                        Submitted {formatDate(review.created_at)}
                                                                                    </p>
                                                                                </div>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteReview(review.id, review.user?.name || 'this student')}
                                                                                    className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
                                                                                >
                                                                                    Delete Review
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
