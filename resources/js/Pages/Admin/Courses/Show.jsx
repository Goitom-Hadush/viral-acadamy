import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// ── helpers ─────────────────────────────────────────────────────────────────
const formatPrice = v => `${Number(v || 0).toLocaleString()} ETB`;

// ── confirm delete modal ─────────────────────────────────────────────────────
function ConfirmModal({ message, note, processing, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-8">
                <div className="flex items-start gap-4 rounded-2xl bg-rose-50 p-5 mb-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                        <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{message}</p>
                        <p className="mt-1 text-sm text-slate-500">{note}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel}
                        className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={processing}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                        {processing
                            ? <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>Deleting…</>
                            : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── main page ────────────────────────────────────────────────────────────────
export default function CourseShow({ course }) {
    const { appUrl } = usePage().props;
    if (!course) {
        return (
            <AdminLayout>
                <div className="surface-card p-16 text-center">
                    <p className="text-slate-500">Course not found.</p>
                </div>
            </AdminLayout>
        );
    }

    const averageRating = Number(course.reviews_avg_rating || 0);
    const hasThumb      = course.thumbnail && course.thumbnail !== 'thumbnails/dummy.jpg';
    const instructor    = course.instructor ?? null;
    const social        = instructor?.social_media ?? {};

    // promo code generate form
    const [promoMaxUses, setPromoMaxUses] = useState('');
    const [promoProcessing, setPromoProcessing] = useState(false);
    const [deletePromoTarget, setDeletePromoTarget] = useState(null);
    const [deletePromoProcessing, setDeletePromoProcessing] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const promoCodes = Array.isArray(course.promo_codes)
        ? course.promo_codes
        : Object.values(course.promo_codes ?? {});

    const handleGeneratePromo = (e) => {
        e.preventDefault();
        setPromoProcessing(true);
        router.post(route('admin.promo.store', course.id), { max_uses: promoMaxUses }, {
            onFinish: () => { setPromoProcessing(false); setPromoMaxUses(''); },
        });
    };

    const handleDeletePromo = () => {
        if (!deletePromoTarget) return;
        setDeletePromoProcessing(true);
        router.delete(route('admin.promo.destroy', deletePromoTarget.id), {
            onFinish: () => { setDeletePromoProcessing(false); setDeletePromoTarget(null); },
        });
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        });
    };

    // Build shareable text for a promo code
    const buildShareText = (promo) => {
        const isFree = Number(course.price) === 0;
        const remaining = promo.max_uses - promo.used_count;
        const desc = course.description
            ? course.description.substring(0, 200) + (course.description.length > 200 ? '...' : '')
            : '';
        const baseUrl = appUrl || 'https://www.successlifecoaching.com';
        const url = `${baseUrl}/courses/${course.id}?code=${promo.code}`;

        return `${course.title}\n\n${isFree ? 'FREE' : Number(course.price).toLocaleString() + ' ETB'} — ${remaining} Enrolls Left\n\n${desc}\n\nCoupon Code: ${promo.code}\nEnrolls: ${promo.used_count}/${promo.max_uses}\n\n🔗 ${url}`;
    };

    return (
        <AdminLayout>
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link href={route('admin.courses.index')}
                    className="hover:text-indigo-600 hover:underline transition-colors">Courses</Link>
                <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-slate-700 truncate max-w-xs">{course.title}</span>
            </div>

            {/* ── Course info card ── */}
            <div className="surface-card mb-6 overflow-hidden">
                <div className="flex flex-col gap-6 p-6 sm:p-8 xl:flex-row xl:items-start">
                    {/* Thumbnail */}
                    <div className="h-44 w-full max-w-[240px] shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                        {hasThumb ? (
                            <img src={`/media/${course.thumbnail}`} alt={course.title}
                                className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <img src="/logo.png" className="h-16 w-16 object-contain opacity-40" />
                            </div>
                        )}
                    </div>

                    {/* Course meta */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{course.title}</h1>
                            {course.status === 'published' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Published
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Draft
                                </span>
                            )}
                        </div>

                        <p className="mb-5 max-w-3xl text-sm leading-6 text-slate-600">{course.description}</p>

                        <div className="flex flex-wrap gap-2 text-sm">
                            {[
                                { label: 'Category', value: course.category?.name ?? '—' },
                                { label: 'Price',    value: formatPrice(course.price) },
                                { label: 'Videos',   value: course.videos_count ?? 0 },
                                { label: 'Reviews',  value: course.reviews_count ?? 0 },
                                { label: 'Rating',   value: averageRating > 0 ? averageRating.toFixed(1) + ' / 5' : 'No rating' },
                            ].map(item => (
                                <span key={item.label}
                                    className="rounded-full bg-slate-100 px-3 py-1.5">
                                    {item.label}: <span className="font-semibold text-slate-900">{item.value}</span>
                                </span>
                            ))}
                        </div>

                        {/* Publish / back actions */}
                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href={route('admin.videos.index', course.id)}
                                className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Manage Videos & Materials
                            </Link>
                            <button
                                onClick={() => router.patch(route('admin.courses.publish', course.id))}
                                className={`rounded-2xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                                    course.status === 'draft'
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-amber-500 text-white hover:bg-amber-600'
                                }`}>
                                {course.status === 'draft' ? 'Publish Course' : 'Unpublish Course'}
                            </button>
                            <Link href={route('admin.courses.index')}
                                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                ← Back to Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Instructor profile panel ── */}
            {instructor && (
                <div className="surface-card mb-6 p-6 sm:p-8">
                    <p className="mb-4 text-xs font-bold uppercase tracking-widest text-indigo-500">Instructor Profile</p>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        {/* Avatar */}
                        <div className="shrink-0">
                            {instructor.avatar ? (
                                <img src={`/media/${instructor.avatar}`} alt={instructor.name}
                                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-indigo-100" />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-black text-white">
                                    {instructor.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-3">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{instructor.name}</h2>
                                <p className="text-sm text-slate-500">Instructor</p>
                            </div>

                            {/* Contact info */}
                            <div className="flex flex-wrap gap-3">
                                {instructor.email && (
                                    <a href={`mailto:${instructor.email}`}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {instructor.email}
                                    </a>
                                )}
                                {instructor.phone && (
                                    <a href={`tel:${instructor.phone}`}
                                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {instructor.phone}
                                    </a>
                                )}
                            </div>

                            {/* Social media */}
                            {Object.keys(social).length > 0 && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Social Media</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(social).map(([platform, url]) =>
                                            url ? (
                                                <a key={platform} href={url} target="_blank" rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100 hover:bg-indigo-100 capitalize transition-colors">
                                                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8z" />
                                                    </svg>
                                                    {platform}
                                                </a>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Promo Codes Panel ── */}
            <div id="promo-codes" className="surface-card mt-6 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">Promo Codes</p>
                        <h2 className="mt-0.5 text-lg font-bold text-slate-900">Generate & Share</h2>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                        {promoCodes.length} code{promoCodes.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Generate form */}
                <div className="border-b border-slate-100 p-6">
                    <p className="mb-3 text-sm text-slate-500">
                        Generate a unique promo code. Set the max number of students who can enroll with it. Once all slots are used the code auto-deactivates.
                    </p>
                    <form onSubmit={handleGeneratePromo} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Max Enrollments
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10000"
                                value={promoMaxUses}
                                onChange={e => setPromoMaxUses(e.target.value)}
                                placeholder="e.g. 100"
                                className="input-modern"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={promoProcessing || !promoMaxUses}
                            className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50 transition-colors shrink-0"
                        >
                            {promoProcessing ? (
                                <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                </svg>Generating…</>
                            ) : (
                                <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                </svg>Generate Code</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Codes list */}
                {promoCodes.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-400">
                        No promo codes yet. Generate one above.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {promoCodes.map(promo => {
                            const remaining = promo.max_uses - promo.used_count;
                            const isFull = remaining <= 0;
                            const shareText = buildShareText(promo);

                            return (
                                <div key={promo.id} className="p-5">
                                    {/* Code row */}
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        {/* Code badge */}
                                        <code className="flex-1 min-w-0 rounded-xl bg-slate-900 px-4 py-2.5 font-mono text-sm font-bold text-emerald-400 tracking-widest truncate">
                                            {promo.code}
                                        </code>

                                        {/* Copy button */}
                                        <button
                                            onClick={() => copyToClipboard(promo.code)}
                                            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                                        >
                                            {copiedCode === promo.code ? (
                                                <><svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                </svg>Copied!</>
                                            ) : (
                                                <><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                                </svg>Copy</>
                                            )}
                                        </button>

                                        {/* Status badge */}
                                        {isFull ? (
                                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Full</span>
                                        ) : promo.is_active ? (
                                            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
                                        ) : (
                                            <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Paused</span>
                                        )}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mb-3">
                                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                            <span>Enrolls used</span>
                                            <span className="font-bold text-slate-700">{promo.used_count} / {promo.max_uses}</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full transition-all ${isFull ? 'bg-slate-400' : 'bg-purple-500'}`}
                                                style={{ width: `${Math.min(100, (promo.used_count / promo.max_uses) * 100)}%` }}
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {isFull ? 'All slots used' : `${remaining} enrollment${remaining !== 1 ? 's' : ''} remaining`}
                                        </p>
                                    </div>

                                    {/* Shareable text preview */}
                                    <div className="mb-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Share on Telegram / Social Media</p>
                                        <pre className="whitespace-pre-wrap text-xs text-slate-700 font-sans leading-relaxed">
                                            {shareText}
                                        </pre>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(shareText); setCopiedCode('share_' + promo.id); setTimeout(() => setCopiedCode(null), 2000); }}
                                            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition-colors"
                                        >
                                            {copiedCode === 'share_' + promo.id ? '✓ Copied!' : '📋 Copy Share Text'}
                                        </button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => router.patch(route('admin.promo.toggle', promo.id))}
                                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${promo.is_active && !isFull ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                                        >
                                            {promo.is_active && !isFull ? 'Pause' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => setDeletePromoTarget(promo)}
                                            className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* ── Delete promo confirm ── */}
            {deletePromoTarget && (
                <ConfirmModal
                    message={`Delete promo code "${deletePromoTarget.code}"?`}
                    note="Students who already used this code keep their access. Future use will be blocked."
                    processing={deletePromoProcessing}
                    onConfirm={handleDeletePromo}
                    onCancel={() => setDeletePromoTarget(null)}
                />
            )}
        </AdminLayout>
    );
}
