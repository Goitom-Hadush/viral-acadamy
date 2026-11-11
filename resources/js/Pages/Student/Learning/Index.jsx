import StudentLayout from '@/Layouts/StudentLayout';
import FormErrors from '@/Components/FormErrors';
import { useState, useRef, useEffect } from 'react';
import { router, useForm, Link } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export default function LearningIndex({ course = { videos: [] }, progress = {}, reviews = [], auth }) {
    const t = useT();
    const [currentVideo, setCurrentVideo] = useState(course.videos[0] || null);
    const playerRef = useRef(null);
    const saveIntervalRef = useRef(null);
    const currentVideoIndex = course.videos.findIndex((video) => video.id === currentVideo?.id);
    const previousVideo = currentVideoIndex > 0 ? course.videos[currentVideoIndex - 1] : null;
    const nextVideo = currentVideoIndex >= 0 && currentVideoIndex < course.videos.length - 1
        ? course.videos[currentVideoIndex + 1]
        : null;

    const totalLessons = course.videos ? course.videos.length : 0;
    const completedLessons = course.videos
        ? course.videos.filter((v) => (progress[v.id]?.watched_seconds || 0) > 0).length
        : 0;
    const isCompleted = totalLessons > 0 && completedLessons === totalLessons;
    const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const { data: reviewData, setData: setReviewData, post: postReview, processing: reviewProcessing, errors: reviewErrors } = useForm({
        rating: 5,
        comment: '',
    });

    const streamUrl = currentVideo ? route('video.stream', currentVideo.id) : '';

    useEffect(() => {
        if (course.videos.length === 0) {
            setCurrentVideo(null);
            return;
        }

        if (!currentVideo || !course.videos.some((video) => video.id === currentVideo.id)) {
            setCurrentVideo(course.videos[0]);
        }
    }, [course.videos, currentVideo]);

    useEffect(() => {
        if (!currentVideo) {
            return;
        }

        const video = playerRef.current;

        if (!video) {
            return;
        }

        const resumeTime = progress[currentVideo.id]?.watched_seconds || 0;

        const restorePlaybackPosition = () => {
            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            video.currentTime = duration > 0 ? Math.min(resumeTime, duration) : resumeTime;
        };

        if (video.readyState >= 1) {
            restorePlaybackPosition();
            return;
        }

        video.addEventListener('loadedmetadata', restorePlaybackPosition, { once: true });

        return () => {
            video.removeEventListener('loadedmetadata', restorePlaybackPosition);
        };
    }, [currentVideo?.id, progress]);

    useEffect(() => {
        if (!currentVideo) {
            return;
        }

        saveIntervalRef.current = setInterval(() => {
            const watchedSeconds = Math.floor(playerRef.current?.currentTime || 0);

            if (watchedSeconds < 2) {
                return;
            }

            router.post(route('student.progress.update'), {
                video_id: currentVideo.id,
                watched_seconds: watchedSeconds,
            }, {
                preserveScroll: true,
                preserveState: true,
                onError: () => {}
            });
        }, 10000);

        return () => clearInterval(saveIntervalRef.current);
    }, [currentVideo?.id]);

    return (
        <StudentLayout>
            <div className="mb-6 rounded-[28px] bg-gradient-to-r from-slate-950 via-copper-900 to-copper-700 p-5 sm:p-8 text-white shadow-[0_24px_60px_-30px_rgba(0,65,1,0.5)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-copper-200 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t('learn.interactive_classroom', 'Interactive Classroom')}
                </div>
                <h1 className="mt-2.5 text-2xl font-black tracking-tight sm:text-4xl text-balance">{course.title}</h1>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-200 sm:text-base">{t('learn.hero_sub', 'Focus on personal development with uninterrupted high-definition coaching sessions.')}</p>
            </div>

            {/* Verifiable Certificate Banner (Visible when completed or accessible to claim) */}
            <div className={`mb-6 rounded-3xl p-5 sm:p-6 text-white shadow-lg border transition-all ${
                isCompleted 
                    ? 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-copper-900 border-emerald-400/50 shadow-emerald-900/20'
                    : 'bg-gradient-to-r from-copper-900 via-copper-800 to-slate-900 border-copper-700/60'
            }`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 border border-white/30 text-2xl shadow-inner">
                            🎓
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200 mb-1">
                                <span>{isCompleted ? t('learn.course_completed', '✓ Course Completed') : t('learn.course_progress', 'Course Progress: {percent}%').replace('{percent}', completionPercent)}</span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                                {isCompleted ? t('learn.cert_ready_title', 'Your Verifiable Completion Certificate is Ready!') : t('learn.cert_earn_title', 'Earn Your Verifiable Certificate of Completion')}
                            </h3>
                            <p className="text-xs text-copper-100 font-normal">
                                {isCompleted
                                    ? t('learn.cert_ready_body', 'Congratulations! Claim your accredited certificate with scannable QR code and shareable digital credential.')
                                    : t('learn.cert_earn_body', 'Watch all lessons to unlock your official verified certificate accredited by Success Life Coaching Academy.')
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <form method="POST" action={route('courses.claim-certificate', course.id)}>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-copper-900 shadow-md hover:bg-copper-50 transition active:scale-95 touch-manipulation"
                            >
                                <span>🎓</span>
                                <span>{isCompleted ? t('learn.view_certificate', 'View Official Certificate') : t('learn.claim_certificate', 'Claim Certificate')}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] pb-16">
                <div className="min-w-0 space-y-5">
                    <div className="overflow-hidden rounded-2xl sm:rounded-[28px] bg-slate-950 shadow-2xl ring-1 ring-slate-800">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-3 py-2.5 sm:px-5 sm:py-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                                <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
                            </div>
                            <div className="min-w-0 flex-1 px-2 text-center">
                                <p className="truncate text-xs font-semibold text-slate-300 sm:text-sm">
                                    {currentVideo ? t('learn.lesson_title', 'Lesson {number}: {title}').replace('{number}', currentVideo.sequence).replace('{title}', currentVideo.title) : `${course.title}`}
                                </p>
                            </div>
                            <div className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-bold text-copper-200">
                                {t('learn.lessons_count', '{count} lessons').replace('{count}', course.videos.length)}
                            </div>
                        </div>

                        <div className="bg-black">
                            <div className="aspect-video w-full">
                                {currentVideo ? (
                                    <video
                                        key={currentVideo.id}
                                        ref={playerRef}
                                        src={streamUrl}
                                        controls
                                        controlsList="nodownload noplaybackrate noremoteplayback"
                                        disablePictureInPicture
                                        disableRemotePlayback
                                        playsInline
                                        preload="metadata"
                                        className="block h-full w-full bg-black object-contain"
                                        onContextMenu={(e) => e.preventDefault()}
                                        onError={(e) => {
                                            console.error('Video playback error:', e.target?.error);
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-6 text-center">
                                        <p className="text-base text-white sm:text-xl">{t('learn.no_lessons_available', 'No lessons available yet.')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {currentVideo && (
                        <div className="surface-card p-4 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-copper-700 bg-copper-50 px-2 py-0.5 rounded-md border border-copper-100">
                                        {t('learn.lesson_of', 'Lesson {number} of {total}').replace('{number}', currentVideo.sequence).replace('{total}', course.videos.length)}
                                    </span>
                                    <h2 className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-900">{currentVideo.title}</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-2 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => previousVideo && setCurrentVideo(previousVideo)}
                                        disabled={!previousVideo}
                                        className="btn-secondary py-2.5 px-4 text-xs sm:text-sm normal-case font-bold disabled:opacity-40"
                                    >
                                        {t('learn.prev', '← Prev')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => nextVideo && setCurrentVideo(nextVideo)}
                                        disabled={!nextVideo}
                                        className="btn-primary py-2.5 px-4 text-xs sm:text-sm normal-case font-bold disabled:opacity-40 shadow-sm"
                                    >
                                        {t('learn.next', 'Next →')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <div className="surface-card p-4 sm:p-6 xl:sticky xl:top-24">
                        <div className="flex items-center justify-between mb-4 border-b border-copper-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">{t('learn.course_lessons', 'Course Lessons')}</h3>
                            <span className="text-xs font-semibold text-slate-500">{t('learn.total_count', '{count} Total').replace('{count}', course.videos.length)}</span>
                        </div>
                        <ul className="scrollbar-thin space-y-2 xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pr-1">
                            {course.videos.length === 0 ? (
                                <li className="py-4 text-center text-sm text-slate-500">{t('learn.no_lessons_uploaded', 'No lessons uploaded yet.')}</li>
                            ) : (
                                course.videos.map((video) => {
                                    const vidProgress = progress[video.id]?.watched_seconds || 0;
                                    const hasStarted = vidProgress > 0;
                                    const isActive = currentVideo?.id === video.id;

                                    return (
                                        <li key={video.id}>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentVideo(video)}
                                                className={`w-full rounded-2xl p-3 sm:p-3.5 text-left text-sm transition-all duration-200 border ${
                                                    isActive 
                                                        ? 'bg-copper-700 border-copper-700 text-white shadow-md shadow-copper-900/20' 
                                                        : 'bg-white hover:bg-copper-50/50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                                                        isActive ? 'bg-white/20 text-white' : hasStarted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {video.sequence}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`truncate text-xs sm:text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>{video.title}</p>
                                                        <p className={`mt-0.5 text-[11px] ${isActive ? 'text-copper-100' : hasStarted ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                                                            {isActive ? t('learn.playing_now', 'Playing now') : hasStarted ? t('learn.in_progress', '✓ In progress') : t('learn.not_started', 'Not started')}
                                                        </p>
                                                    </div>
                                                    {hasStarted && !isActive && (
                                                        <svg className="h-4 w-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>

                        {/* Certificate & Completion Box */}
                        <div className="mt-4 pt-3.5 border-t border-copper-100">
                            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                                <span className="text-slate-600">{t('learn.overall_progress', 'Overall Progress')}</span>
                                <span className="text-copper-700">{completionPercent}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mb-3">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-copper-700 transition-all duration-500"
                                    style={{ width: `${completionPercent}%` }}
                                />
                            </div>
                            <form method="POST" action={route('courses.claim-certificate', course.id)}>
                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-copper-50 border border-copper-200/80 py-2.5 px-3 text-xs font-bold text-copper-800 hover:bg-copper-100 transition active:scale-95 shadow-xs"
                                >
                                    <span>🎓</span>
                                    <span>{isCompleted ? t('learn.view_certificate', 'View Official Certificate') : t('learn.claim_completion_certificate', 'Claim Completion Certificate')}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="surface-card p-5 sm:p-8 mb-12">
                <h3 className="mb-6 border-b border-copper-100 pb-3 text-xl sm:text-2xl font-bold text-slate-900">{t('learn.student_reviews', 'Student Reviews')}</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Leave a Review Form */}
                    <div>
                        <h4 className="font-bold text-base sm:text-lg text-slate-800 mb-4">{t('learn.leave_review', 'Leave Your Review')}</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            postReview(route('reviews.store', course.id), {
                                onSuccess: () => setReviewData('comment', '')
                            });
                        }}>
                            <FormErrors errors={reviewErrors} />
                            <div className="mb-4">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t('learn.rating', 'Rating')}</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button"
                                            aria-label={t('learn.rate_stars', '{count} stars').replace('{count}', star)}
                                            onClick={() => setReviewData('rating', star)}
                                            className={`text-3xl transition-transform hover:scale-110 active:scale-95 ${
                                                star <= reviewData.rating ? 'text-amber-400' : 'text-slate-300'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="ml-3 text-sm text-slate-600 font-bold">({reviewData.rating}/5)</span>
                                </div>
                            </div>
                            
                            <textarea 
                                rows={4} 
                                value={reviewData.comment} 
                                onChange={e => setReviewData('comment', e.target.value)} 
                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-copper-500 focus:ring-2 focus:ring-copper-200 outline-none transition-all mb-4 text-sm" 
                                placeholder={t('learn.review_placeholder', 'Share your experience with this coaching course...')}
                            ></textarea>
                            
                            <button 
                                type="submit" 
                                disabled={reviewProcessing}
                                className="btn-primary w-full sm:w-auto py-3 px-6 text-sm font-bold shadow-md shadow-copper-700/20"
                            >
                                {reviewProcessing ? t('learn.submitting', 'Submitting...') : t('learn.post_review', 'Post Review')}
                            </button>
                        </form>
                    </div>

                    {/* Existing Reviews List */}
                    <div className="scrollbar-thin max-h-[440px] overflow-y-auto pr-2">
                        {!reviews || reviews.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm">{t('learn.no_reviews', 'No reviews yet. Be the first to review this course!')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => {
                                    const safeReview = {
                                        ...review,
                                        user: review.user || { name: t('learn.unknown_user', 'Unknown') }
                                    };
                                    return (
                                        <div key={safeReview.id} className="p-4 bg-slate-50 rounded-2xl border border-copper-100/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-sm text-slate-900">{safeReview.user.name}</span>
                                                <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                                                    {'★'.repeat(safeReview.rating)}{'☆'.repeat(5 - safeReview.rating)}
                                                </div>
                                            </div>
                                            {safeReview.comment && <p className="text-slate-600 text-sm leading-relaxed">{safeReview.comment}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
