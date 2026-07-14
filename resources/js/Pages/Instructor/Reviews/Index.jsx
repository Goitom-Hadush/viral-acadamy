import InstructorLayout from '@/Layouts/InstructorLayout';
import { Link, router } from '@inertiajs/react';

export default function InstructorReviews({ reviews = [], stats = {}, auth }) {
    const handleDelete = (reviewId) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/instructor/reviews/${reviewId}`);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-slate-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <InstructorLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Reviews Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Comments & Ratings</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    View and manage student reviews and ratings for your courses.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 animate-slide-up">
                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Total Reviews</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{stats.total}</p>
                    </div>
                </div>

                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">Average Rating</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{stats.average_rating}</p>
                            <div className="flex">
                                {renderStars(Math.round(stats.average_rating))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">5 Star Reviews</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{stats.five_star}</p>
                    </div>
                </div>

                <div className="surface-card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 group-hover:text-white transition-colors">1 Star Reviews</h3>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-4xl font-black text-slate-900 group-hover:text-white transition-colors">{stats.one_star}</p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="surface-card overflow-hidden animate-slide-up">
                {reviews.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m8-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-slate-900">No reviews yet</h3>
                        <p className="text-slate-500">When students review your courses, they'll appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-6">Student</th>
                                    <th className="p-6">Course</th>
                                    <th className="p-6">Rating</th>
                                    <th className="p-6">Comment</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md">
                                                    {review.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{review.user.name}</p>
                                                    <p className="text-sm text-slate-500">{review.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-700">{review.course.title}</td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 text-sm font-semibold text-slate-700">({review.rating}/5)</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600 max-w-md">{review.comment || '-'}</td>
                                        <td className="p-6 text-slate-500">{new Date(review.created_at).toLocaleDateString()}</td>
                                        <td className="p-6">
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </td>
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
