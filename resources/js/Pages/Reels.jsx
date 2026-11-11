import AppLayout from '@/Layouts/AppLayout';
import SocialShare from '@/Components/SocialShare';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useT } from '@/hooks/useT';

function reelPoster(reel) {
    const thumbnail = reel?.course?.thumbnail;
    if (!thumbnail || thumbnail === 'thumbnails/dummy.jpg') return undefined;
    return `/media/${thumbnail}`;
}

function ReelCard({ reel }) {
    const t = useT();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const src = `/media/${reel.media_path}`;
    const courseTitle = reel.course?.title || t('home.course', 'Course');

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video || reel.media_type !== 'video') return;

        if (video.paused) {
            video.muted = false;
            video.play().then(() => setIsPlaying(true)).catch(() => {
                video.muted = true;
                video.play().then(() => setIsPlaying(true)).catch(() => {});
            });
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    return (
        <article id={`reel-${reel.id}`} className="overflow-hidden rounded-3xl border border-copper-100 bg-white shadow-sm hover:shadow-md transition">
            <div className="relative aspect-[9/14] max-h-[70vh] bg-slate-950 sm:aspect-[9/12]">
                {reel.media_type === 'video' ? (
                    <>
                        <video
                            ref={videoRef}
                            src={src}
                            poster={reelPoster(reel)}
                            className="h-full w-full object-cover"
                            loop
                            playsInline
                            preload="metadata"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onClick={togglePlay}
                        />
                        {!isPlaying ? (
                            <button
                                type="button"
                                onClick={togglePlay}
                                aria-label={t('reels.play', 'Play reel')}
                                className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                            >
                                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-emerald-700/80 text-white shadow-xl backdrop-blur-md transition hover:scale-110 active:scale-95">
                                    <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                            </button>
                        ) : null}
                    </>
                ) : (
                    <img src={src} alt={courseTitle} className="h-full w-full object-cover" loading="lazy" />
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-5 pt-16">
                    <span className="mb-2 inline-flex rounded-full bg-emerald-500/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        {reel.media_type === 'video' ? t('home.reel', 'Reel') : t('home.photo', 'Photo')}
                    </span>
                    <Link href={route('courses.show', reel.course_id)} className="pointer-events-auto group block">
                        <h2 className="text-xl font-black text-white underline-offset-2 transition group-hover:underline">
                            {courseTitle}
                        </h2>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-copper-200 group-hover:text-white">
                            {t('home.reel_click', 'View full masterclass')}
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                    {reel.caption ? <p className="mt-2 text-sm text-white/85">{reel.caption}</p> : null}
                </div>
            </div>

            <div className="p-4 border-t border-copper-50 bg-slate-50/50">
                <SocialShare
                    url={`/reels#reel-${reel.id}`}
                    title={courseTitle}
                    text={`${courseTitle}${reel.caption ? ` — ${reel.caption}` : ''} | Success Life Coaching Reels`}
                />
            </div>
        </article>
    );
}

export default function Reels({ reels = [] }) {
    const t = useT();

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.reels_title', 'Video Reels & Stories | Success Life Coaching Academy')}</title>
                <meta
                    name="description"
                    content={t('pages.reels_desc', 'Watch short video stories and course reels from Success Life Coaching Academy.')}
                />
                <meta property="og:title" content={t('reels.og_title', 'Video Reels & Stories | Success Life Coaching')} />
                <meta property="og:description" content={t('reels.og_desc', 'Watch short course reels from Success Life Coaching Academy.')} />
            </Head>

            <div className="pb-20 pt-6 sm:pt-10">
                <section className="section-shell">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 mb-3">
                            <span>🎬</span>
                            <span>{t('reels.eyebrow', 'Video Reels')}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                            {t('pages.reels_heading', 'Course Reels & Highlights')}
                        </h1>
                        <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                            {t('pages.reels_intro', 'Watch concise bite-sized masterclasses, success tips, and preview clips. Tap any clip to open the full course.')}
                        </p>
                    </div>

                    <div className="mt-6 max-w-xl">
                        <SocialShare
                            url="/reels"
                            title="Success Life Coaching Reels"
                            text={t('share.reels', 'Watch course reels on Success Life Coaching Academy')}
                        />
                    </div>

                    {reels.length === 0 ? (
                        <div className="mt-10 overflow-hidden rounded-3xl border border-copper-100 bg-white p-8 sm:p-14 text-center shadow-sm">
                            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-copper-100/80 text-3xl mb-4">
                                🎬
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {t('reels.coming_soon', 'Fresh Reels Coming Soon!')}
                            </h3>
                            <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {t('reels.coming_soon_body', 'Our instructors and coaches are preparing new vertical video masterclasses for you. In the meantime, browse our full course catalog!')}
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link 
                                    href={route('courses.index')} 
                                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-copper-700 to-copper-900 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow hover:shadow-copper-glow transition active:scale-95"
                                >
                                    {t('reels.browse_all', 'Browse All Courses')}
                                </Link>
                                <a 
                                    href="/apps/download/android" 
                                    className="inline-flex items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-2.5 text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-100 transition active:scale-95"
                                >
                                    {t('reels.download_android', '📱 Download Android App')}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
                            {reels.map((reel) => (
                                <ReelCard key={reel.id} reel={reel} />
                            ))}
                        </div>
                    )}

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link 
                            href={route('courses.index')} 
                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-copper-700 to-copper-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-copper-glow transition active:scale-95 w-full sm:w-auto"
                        >
                            {t('home.explore', 'Explore All Courses')}
                        </Link>
                        <Link 
                            href={route('home')} 
                            className="inline-flex items-center justify-center rounded-2xl border border-copper-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-copper-50 transition active:scale-95 w-full sm:w-auto"
                        >
                            {t('reels.return_home', 'Return to Home')}
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
