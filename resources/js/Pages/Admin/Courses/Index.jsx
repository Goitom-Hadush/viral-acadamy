import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress } from '@/Components/UploadProgress';
import { Link, router, useForm } from '@inertiajs/react';
import { memo, useMemo, useState } from 'react';
import CourseThumbnail from '@/Components/CourseThumbnail';

// ── tiny reusable modal ────────────────────────────────────────────────────
function Modal({ open, onClose, title, wide = false, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}>
            <div className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl`}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="px-8 py-6">{children}</div>
            </div>
        </div>
    );
}

// ── instructor profile card ─────────────────────────────────────────────────
function InstructorCard({ instructor }) {
    if (!instructor) return null;
    const social = instructor.social_media ?? {};
    return (
        <div className="rounded-2xl border border-copper-100 bg-copper-50 p-4">
            <div className="flex items-center gap-3 mb-3">
                {instructor.avatar ? (
                    <img src={`/media/${instructor.avatar}`} alt={instructor.name}
                        className="h-12 w-12 rounded-full object-cover" />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-copper-200 text-lg font-bold text-copper-700">
                        {instructor.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <p className="font-bold text-slate-900">{instructor.name}</p>
                    <p className="text-xs text-slate-500">{instructor.email}</p>
                    {instructor.phone && <p className="text-xs text-slate-500">{instructor.phone}</p>}
                </div>
            </div>
            {/* social media links */}
            {Object.keys(social).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(social).map(([platform, url]) =>
                        url ? (
                            <a key={platform} href={url} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-copper-700 border border-copper-200 hover:bg-copper-100 capitalize">
                                {platform}
                            </a>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
}

// ── course form (create + edit) ─────────────────────────────────────────────
function CourseForm({ categories, instructors, data, setData, errors, processing, progress = 0, onSubmit, submitLabel, isEdit }) {
    const selectedInstructor = instructors.find(i => String(i.id) === String(data.instructor_id)) ?? null;

    return (
        <form onSubmit={onSubmit} className="space-y-5" encType="multipart/form-data">
            <FormErrors errors={errors} />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Title */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Course Title</label>
                    <input type="text" value={data.title}
                        onChange={e => setData('title', e.target.value)}
                        className="input-modern" placeholder="e.g., Complete React Bootcamp" />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Instructor picker */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Instructor</label>
                    <select value={data.instructor_id}
                        onChange={e => setData('instructor_id', e.target.value)}
                        className="input-modern">
                        <option value="">Select instructor…</option>
                        {instructors.map(i => (
                            <option key={i.id} value={i.id}>{i.name} — {i.email}</option>
                        ))}
                    </select>
                    {errors.instructor_id && <p className="mt-1 text-xs text-red-500">{errors.instructor_id}</p>}
                    {/* Show instructor profile once selected */}
                    {selectedInstructor && (
                        <div className="mt-3">
                            <InstructorCard instructor={selectedInstructor} />
                        </div>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                    <select value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="input-modern">
                        <option value="">Select category…</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Price (ETB)</label>
                    <input type="number" step="0.01" min="0" value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className="input-modern" placeholder="0.00" />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                </div>

                {/* Price USD */}
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Equivalent Price (USD) <span className="font-normal text-slate-400">(optional, diaspora)</span></label>
                    <input type="number" step="0.01" min="0" value={data.price_usd ?? ''}
                        onChange={e => setData('price_usd', e.target.value)}
                        className="input-modern" placeholder="e.g. 25" />
                    {errors.price_usd && <p className="mt-1 text-xs text-red-500">{errors.price_usd}</p>}
                </div>
                {/* Thumbnail */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        Thumbnail <span className="font-normal text-slate-400">(optional{isEdit ? ' — leave empty to keep current' : ''})</span>
                    </label>
                    <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
                        onChange={e => setData('thumbnail', e.target.files[0] ?? null)}
                        className="input-modern" />
                    {errors.thumbnail && <p className="mt-1 text-xs text-red-500">{errors.thumbnail}</p>}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Description</label>
                    <textarea rows={4} value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="input-modern resize-none"
                        placeholder="Describe what students will learn…" />
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>
            </div>

            <UploadProgress show={processing} progress={progress} label="Uploading course…" />

            <div className="flex justify-end pt-2">
                <button type="submit" disabled={processing} className="btn-primary min-w-[140px]">
                    {uploadingLabel(processing, progress, submitLabel)}
                </button>
            </div>
        </form>
    );
}


// -- compact table pieces ------------------------------------------------------
const ICON_PATHS = {
    eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    ticket: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    globe: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    eyeoff: 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21',
};

function Ico({ name, className = 'h-4 w-4' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
        </svg>
    );
}

const TONES = {
    slate: 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    green: 'text-emerald-600 hover:bg-emerald-50',
    amber: 'text-amber-600 hover:bg-amber-50',
    red: 'text-slate-400 hover:bg-rose-50 hover:text-rose-600',
};

// One icon button: a link when `href` is given, otherwise a button.
function IconAction({ icon, label, tone = 'slate', href, onClick }) {
    const cls = `inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${TONES[tone]}`;
    return href ? (
        <Link href={href} className={cls} title={label} aria-label={label}><Ico name={icon} /></Link>
    ) : (
        <button type="button" onClick={onClick} className={cls} title={label} aria-label={label}><Ico name={icon} /></button>
    );
}

function PriceCell({ etb, usd }) {
    return (
        <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">{Number(etb || 0).toLocaleString()} <span className="text-[10px] font-semibold text-slate-400">ETB</span></p>
            {Number(usd) > 0 && <p className="text-xs font-semibold text-amber-600">${Number(usd).toLocaleString()} USD</p>}
        </div>
    );
}

const CourseRow = memo(function CourseRow({ course, onEdit, onDelete }) {
    const published = course.status === 'published';

    return (
        <tr className="group transition-colors hover:bg-slate-50/70">
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <CourseThumbnail
                        thumbnail={course.thumbnail}
                        alt={course.title}
                        className="h-12 w-[72px] shrink-0 rounded-lg"
                        imgClassName="h-full w-full object-cover"
                        logoClassName="h-8 w-8 object-contain"
                    />
                    <div className="min-w-0">
                        <Link href={route('admin.courses.show', course.id)} className="block max-w-[260px] truncate text-sm font-bold text-slate-900 hover:text-copper-700">
                            {course.title}
                        </Link>
                        <p className="text-[11px] text-slate-400">{course.category?.name ?? 'Uncategorized'}</p>
                    </div>
                </div>
            </td>

            <td className="hidden px-4 py-3 md:table-cell">
                <p className="max-w-[160px] truncate text-sm font-medium text-slate-700" title={course.instructor?.email}>{course.instructor?.name ?? '-'}</p>
            </td>

            <td className="px-4 py-3"><PriceCell etb={course.price} usd={course.price_usd} /></td>

            <td className="hidden px-4 py-3 text-sm text-slate-600 sm:table-cell">{course.videos_count ?? 0}</td>

            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {published ? 'Published' : 'Draft'}
                </span>
            </td>

            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-0.5">
                    <IconAction icon="eye" label="View details" href={route('admin.courses.show', course.id)} />
                    <IconAction icon="video" label="Manage videos" href={route('admin.videos.index', course.id)} />
                    <IconAction icon="ticket" label="Promo codes" href={route('admin.courses.show', course.id) + '#promo-codes'} />
                    <IconAction
                        icon={published ? 'eyeoff' : 'globe'}
                        tone={published ? 'amber' : 'green'}
                        label={published ? 'Unpublish' : 'Publish'}
                        onClick={() => router.patch(route('admin.courses.publish', course.id), {}, { preserveScroll: true })}
                    />
                    <IconAction icon="edit" label="Edit course" onClick={() => onEdit(course)} />
                    <IconAction icon="trash" tone="red" label="Delete course" onClick={() => onDelete(course)} />
                </div>
            </td>
        </tr>
    );
});

// ── main page ───────────────────────────────────────────────────────────────
export default function CoursesIndex({ courses = [], categories = [], instructors = [], stats = {} }) {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return courses.filter(c =>
            (filter === 'all' || (filter === 'published' ? c.status === 'published' : c.status !== 'published')) &&
            (!q || [c.title, c.instructor?.name, c.instructor?.email, c.category?.name].filter(Boolean).some(v => String(v).toLowerCase().includes(q)))
        );
    }, [courses, query, filter]);

    // ── create modal ───────────────────────────────────────────────
    const [createOpen, setCreateOpen] = useState(false);
    const { data: cData, setData: setCData, post: cPost, processing: cProcessing,
            reset: cReset, errors: cErrors } = useForm({
        title: '', instructor_id: '', category_id: '', description: '', price: '', price_usd: '', thumbnail: null,
    });
    const { progress: cProgress, start: startCreate, finish: finishCreate, onProgress: onCreateProgress } = useUploadProgress();
    const handleCreate = e => {
        e.preventDefault();
        startCreate();
        cPost(route('admin.courses.store'), {
            forceFormData: true,
            onProgress: onCreateProgress,
            onSuccess: () => { finishCreate(); cReset(); setCreateOpen(false); },
            onError: finishCreate,
        });
    };

    // ── edit modal ─────────────────────────────────────────────────
    const [editTarget, setEditTarget] = useState(null);
    const { data: eData, setData: setEData, post: ePost, processing: eProcessing,
            reset: eReset, errors: eErrors } = useForm({
        title: '', instructor_id: '', category_id: '',
        description: '', price: '', price_usd: '', thumbnail: null,
    });
    const openEdit = course => {
        setEData({
            title: course.title,
            instructor_id: String(course.instructor_id),
            category_id: String(course.category_id ?? ''),
            description: course.description ?? '',
            price: course.price,
            price_usd: course.price_usd ?? '',
            thumbnail: null,
        });
        setEditTarget(course);
    };
    const { progress: eProgress, start: startEdit, finish: finishEdit, onProgress: onEditProgress } = useUploadProgress();
    const handleEdit = e => {
        e.preventDefault();
        startEdit();
        ePost(route('admin.courses.update', editTarget.id), {
            forceFormData: true,
            onProgress: onEditProgress,
            onSuccess: () => { finishEdit(); eReset(); setEditTarget(null); },
            onError: finishEdit,
        });
    };

    // ── delete modal ───────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleteProcessing(true);
        router.delete(route('admin.courses.destroy', deleteTarget.id), {
            onFinish: () => { setDeleteProcessing(false); setDeleteTarget(null); },
        });
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Courses</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {stats.courses ?? courses.length} total · {stats.published ?? 0} published · {stats.videos ?? 0} videos · {stats.reviews ?? 0} reviews
                    </p>
                </div>
                <button onClick={() => setCreateOpen(true)} className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New course
                </button>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex rounded-xl bg-slate-100 p-1" role="tablist">
                    {[
                        { id: 'all', label: 'All', count: courses.length },
                        { id: 'published', label: 'Published', count: courses.filter(c => c.status === 'published').length },
                        { id: 'draft', label: 'Drafts', count: courses.filter(c => c.status !== 'published').length },
                    ].map(t => (
                        <button key={t.id} type="button" role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-bold transition ${filter === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.label}
                            <span className="rounded-full bg-slate-200 px-1.5 text-[11px] font-black text-slate-600">{t.count}</span>
                        </button>
                    ))}
                </div>
                <input
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search course, instructor, category..."
                    aria-label="Search courses"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-copper-500 focus:ring-copper-500 sm:w-80"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {visible.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <p className="text-4xl">📚</p>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">{courses.length === 0 ? 'No courses yet' : 'No matches'}</h3>
                        <p className="mt-1 text-sm text-slate-500">{courses.length === 0 ? 'Create the first course.' : 'Try a different search or filter.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Course</th>
                                    <th className="hidden px-4 py-3 md:table-cell">Instructor</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="hidden px-4 py-3 sm:table-cell">Videos</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visible.map(course => (
                                    <CourseRow key={course.id} course={course} onEdit={openEdit} onDelete={setDeleteTarget} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Create Modal ── */}
            <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Course" wide>
                <CourseForm categories={categories} instructors={instructors}
                    data={cData} setData={setCData} errors={cErrors}
                    processing={cProcessing} progress={cProgress} onSubmit={handleCreate}
                    submitLabel="Create Course" isEdit={false} />
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal open={!!editTarget} onClose={() => { setEditTarget(null); eReset(); }} title="Edit Course" wide>
                <CourseForm categories={categories} instructors={instructors}
                    data={eData} setData={setEData} errors={eErrors}
                    processing={eProcessing} progress={eProgress} onSubmit={handleEdit}
                    submitLabel="Save Changes" isEdit />
            </Modal>

            {/* ── Delete Confirm Modal ── */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Course">
                <div className="space-y-5">
                    <div className="flex items-start gap-4 rounded-2xl bg-rose-50 p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                            <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                Delete <span className="text-rose-700">"{deleteTarget?.title}"</span>?
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                This permanently removes the course, all its videos and reviews. Cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteTarget(null)}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button onClick={handleDelete} disabled={deleteProcessing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                            {deleteProcessing ? (
                                <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>Deleting…</>
                            ) : 'Delete Course'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
