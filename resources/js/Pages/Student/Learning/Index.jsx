import StudentLayout from '@/Layouts/StudentLayout';
import { useState, useRef, useEffect } from 'react';
import { router, useForm } from '@inertiajs/react';

export default function LearningIndex({ course = { videos: [] }, progress = {}, reviews = [], auth }) {
    const [currentVideo, setCurrentVideo] = useState(course.videos[0] || null);
    const playerRef = useRef(null);
    const saveIntervalRef = useRef(null);
    const currentVideoIndex = course.videos.findIndex((video) => video.id === currentVideo?.id);
    const previousVideo = currentVideoIndex > 0 ? course.videos[currentVideoIndex - 1] : null;
    const nextVideo = currentVideoIndex >= 0 && currentVideoIndex < course.videos.length - 1
        ? course.videos[currentVideoIndex + 1]
        : null;

    const { data: reviewData, setData: setReviewData, post: postReview, processing: reviewProcessing } = useForm({
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
            <div className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-indigo-900 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-40px_rgba(15,23,42,0.95)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">Learning Tube</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{course.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">Simple video-first learning with focused playback, quick lesson switching, and a clean modern reading flow.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-6">
                    <div className="overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl ring-1 ring-slate-800">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-400"></span>
                                <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                                <span className="h-3 w-3 rounded-full bg-green-400"></span>
                            </div>
                            <div className="min-w-0 flex-1 text-center">
                                <p className="truncate text-xs font-medium text-slate-300 sm:text-sm">
                                    {currentVideo ? `${course.title} / Lesson ${currentVideo.sequence}` : `${course.title} / No lesson selected`}
                                </p>
                            </div>
                            <div className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                                {course.videos.length} lessons
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
                                        <p className="text-lg text-white sm:text-xl">No videos available yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {currentVideo && (
                        <div className="surface-card p-5 sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-500">Now Playing</p>
                                    <h2 className="mt-2 text-2xl font-bold text-gray-900">{currentVideo.title}</h2>
                                    <p className="mt-2 text-gray-600">Lesson {currentVideo.sequence} of {course.videos.length}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => previousVideo && setCurrentVideo(previousVideo)}
                                        disabled={!previousVideo}
                                        className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => nextVideo && setCurrentVideo(nextVideo)}
                                        disabled={!nextVideo}
                                        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next Lesson
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <div className="surface-card p-5 sm:p-6 xl:sticky xl:top-24">
                        <h3 className="mb-6 border-b border-slate-100 pb-4 text-xl font-bold text-slate-900">Course Content</h3>
                        <ul className="scrollbar-thin space-y-3 xl:max-h-[calc(100vh-180px)] xl:overflow-y-auto xl:pr-2">
                            {course.videos.length === 0 ? (
                                <li className="py-4 text-center text-sm text-gray-500">No lessons uploaded.</li>
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
                                                className={`w-full rounded-2xl p-4 text-left text-sm transition-all duration-300 ${
                                                    isActive 
                                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                                                        isActive ? 'bg-white/20' : hasStarted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {video.sequence}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={`truncate font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{video.title}</p>
                                                        <p className={`mt-1 text-xs ${isActive ? 'text-indigo-100' : hasStarted ? 'text-green-500' : 'text-gray-400'}`}>
                                                            {isActive ? 'Currently playing' : hasStarted ? 'Started' : 'Not started'}
                                                        </p>
                                                    </div>
                                                    {hasStarted && !isActive && (
                                                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="surface-card mt-12 p-6 sm:p-8">
                <h3 className="mb-8 border-b border-slate-100 pb-4 text-2xl font-bold text-slate-900">Course Reviews</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Leave a Review Form */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-6">Leave a Review</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            postReview(route('reviews.store', course.id), {
                                onSuccess: () => setReviewData('comment', '')
                            });
                        }}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button"
                                            onClick={() => setReviewData('rating', star)}
                                            className={`text-4xl transition-transform hover:scale-110 ${
                                                star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="ml-4 text-gray-600 font-semibold">({reviewData.rating}/5)</span>
                                </div>
                            </div>
                            
                            <textarea 
                                rows={5} 
                                value={reviewData.comment} 
                                onChange={e => setReviewData('comment', e.target.value)} 
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all mb-6" 
                                placeholder="What did you love about this course?"
                            ></textarea>
                            
                            <button 
                                type="submit" 
                                disabled={reviewProcessing}
                                className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                {reviewProcessing ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    </div>

                    {/* Existing Reviews List */}
                    <div className="scrollbar-thin max-h-[500px] overflow-y-auto pr-4">
                        {!reviews || reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No reviews yet. Be the first!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map(review => {
                                    const safeReview = {
                                        ...review,
                                        user: review.user || { name: 'Unknown' }
                                    };
                                    return (
                                        <div key={safeReview.id} className="p-6 bg-gray-50 rounded-2xl">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="font-bold text-gray-900">{safeReview.user.name}</span>
                                                <div className="flex items-center gap-1 text-yellow-400 text-lg">
                                                    {'★'.repeat(safeReview.rating)}{'☆'.repeat(5 - safeReview.rating)}
                                                </div>
                                            </div>
                                            {safeReview.comment && <p className="text-gray-700 leading-relaxed">{safeReview.comment}</p>}
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
