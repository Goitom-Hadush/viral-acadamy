import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function CourseShow({ course = { title: 'Untitled Course', instructor: { name: 'Unknown Instructor' }, price: 0, videos_count: 0, description: '' }, auth }) {

    const { data, setData, post, processing, errors } = useForm({
        receipt: null,
    });

    const handleReceiptSubmit = (e) => {
        e.preventDefault();
        post(route('manual.pay', course.id), {
            forceFormData: true,
            onSuccess: () => setData('receipt', null),
        });
    };

    return (
        <AppLayout>
            <Head>
                <title>{course.title} | Viral Acadamy</title>
                <meta name="description" content={course.description?.substring(0, 160) || `Learn ${course.title} with Viral Acadamy, Ethiopia's premium online learning platform.`} />
                <meta name="keywords" content={`${course.title}, viral skill, viral acadamy, video tutorial in ethiopia, online course ethiopia, ethiopian e-learning`} />
                <meta property="og:title" content={`${course.title} | Viral Acadamy`} />
                <meta property="og:description" content={course.description?.substring(0, 160) || `Learn ${course.title} with Viral Acadamy, Ethiopia's premium online learning platform.`} />
                <meta property="og:type" content="website" />
                {course.thumbnail && <meta property="og:image" content={`/storage/${course.thumbnail}`} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${course.title} | Viral Acadamy`} />
                <meta name="twitter:description" content={course.description?.substring(0, 160) || `Learn ${course.title} with Viral Acadamy, Ethiopia's premium online learning platform.`} />
                {course.thumbnail && <meta name="twitter:image" content={`/storage/${course.thumbnail}`} />}
            </Head>
            <div className="section-shell py-10 sm:py-14">
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                    <div className="surface-card overflow-hidden">
                        <div className="relative">
                            <div className="flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-copper-800 via-copper-600 to-bronze text-white md:h-96">
                                {course.thumbnail ? (
                                    <img 
                                        src={`/storage/${course.thumbnail}`} 
                                        alt={course.title} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <h1 className="px-8 text-center text-3xl font-bold md:text-5xl">{course.title}</h1>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur">
                                    Video Learning Experience
                                </div>
                                <h1 className="mt-4 text-balance text-3xl font-black text-white sm:text-4xl lg:text-5xl">{course.title}</h1>
                                <p className="mt-3 text-base text-slate-200 sm:text-lg">
                                    by <span className="font-semibold text-white">{course.instructor ? course.instructor.name : 'Unknown Instructor'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 sm:p-8">
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Price</p>
                                    <p className="mt-3 text-2xl font-bold text-copper-700">{course.price} ETB</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Lessons</p>
                                    <p className="mt-3 text-2xl font-bold text-slate-900">{course.videos_count || 0}</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Format</p>
                                    <p className="mt-3 text-2xl font-bold text-slate-900">Video</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Access</p>
                                    <p className="mt-3 text-2xl font-bold text-slate-900">Anytime</p>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-copper-100 bg-white p-1">
                                <div className="rounded-[24px] bg-slate-50 p-6 sm:p-8">
                                    <h2 className="text-2xl font-bold text-slate-900">Course Description</h2>
                                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">{course.description}</p>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="rounded-[28px] border border-copper-100 bg-white p-1">
                                <div className="rounded-[24px] bg-slate-50 p-6 sm:p-8">
                                    <h2 className="text-2xl font-bold text-slate-900">Student Reviews</h2>
                                    {course.reviews && course.reviews.length > 0 ? (
                                        <div className="mt-6 space-y-4">
                                            {course.reviews.map((review) => (
                                                <div key={review.id} className="rounded-2xl bg-white p-4 shadow-sm border border-copper-50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-copper-500 to-bronze text-white font-bold">
                                                                {review.user?.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{review.user?.name || 'Anonymous'}</p>
                                                                <div className="flex items-center gap-1">
                                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-300'}>
                                                                            ★
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="mt-2 text-slate-600">{review.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-slate-500">No reviews yet. Be the first to review!
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                {auth.user && (
                                    <button 
                                        onClick={() => router.post(route('wishlist.toggle', course.id))} 
                                        className="btn-secondary w-full gap-2 text-base normal-case tracking-normal sm:w-auto"
                                    >
                                        <span className="text-xl">♥</span>
                                        Save to Wishlist
                                    </button>
                                )}
                                <Link href="/" className="btn-secondary w-full text-base normal-case tracking-normal sm:w-auto">
                                    Back to Courses
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                        <div className="surface-card overflow-hidden p-6 sm:p-8">
                            <div className="rounded-[28px] bg-gradient-to-br from-copper-600 via-accent to-bronze p-6 text-white shadow-[0_24px_80px_-36px_rgba(184,115,51,0.95)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-copper-100">Enroll Now</p>
                                <p className="mt-4 text-4xl font-black">{course.price} ETB</p>
                                <p className="mt-2 text-sm text-copper-100">{course.videos_count || 0} lessons included</p>
                            </div>

                            <div className="mt-6 rounded-[28px] border border-copper-100 bg-slate-50 p-5">
                                <h3 className="text-lg font-bold text-slate-900">What you get</h3>
                                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        Stream your lessons in a focused learning player
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        Continue from your saved progress
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        Access simple course navigation and reviews
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="surface-card p-6 sm:p-8">
                            {auth.user ? (
                                <>
                                    <h3 className="text-2xl font-bold text-slate-900">Purchase This Course</h3>
                                    <p className="mt-3 text-slate-600">Send <strong className="text-copper-700">{course.price} ETB</strong> to one of the following accounts, then upload your receipt.</p>
                                    
                                    <div className="mt-6 grid grid-cols-1 gap-4">
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                            <span className="text-sm font-semibold text-slate-500">CBE</span>
                                            <p className="mt-1 text-lg font-mono text-slate-800">10000125544</p>
                                        </div>
                                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                            <span className="text-sm font-semibold text-slate-500">Telebirr</span>
                                            <p className="mt-1 text-lg font-mono text-slate-800">0914026415</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleReceiptSubmit} className="mt-6 flex flex-col gap-4">
                                        <div className="w-full">
                                            <label className="block text-sm font-semibold tracking-wide text-slate-700 mb-2">Upload Receipt</label>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => setData('receipt', e.target.files[0])} 
                                                className="input-modern"
                                            />
                                            {errors.receipt && <p className="text-red-500 text-xs mt-2">{errors.receipt}</p>}
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="btn-primary w-full text-base normal-case tracking-normal"
                                        >
                                            {processing ? 'Uploading...' : 'Submit Receipt'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-lg text-slate-700">Login to purchase this course and start learning.</p>
                                    <Link href={route('login')} className="btn-primary mt-6 w-full text-base normal-case tracking-normal">
                                        Login to Purchase
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
