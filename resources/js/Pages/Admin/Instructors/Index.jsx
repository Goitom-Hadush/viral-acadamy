import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress } from '@/Components/UploadProgress';
import { router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// ─── Social media platform config ───────────────────────────────────────────
const PLATFORMS = [
    { key: 'telegram',  label: 'Telegram',  placeholder: 'https://t.me/username  or  +251912345678' },
    { key: 'whatsapp',  label: 'WhatsApp',  placeholder: 'https://wa.me/251912345678  or  +251912345678' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/username' },
    { key: 'twitter',   label: 'Twitter/X', placeholder: 'https://twitter.com/username' },
    { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/username' },
    { key: 'youtube',   label: 'YouTube',   placeholder: 'https://youtube.com/@channel' },
    { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://tiktok.com/@username' },
];

const EMPTY_SOCIAL = Object.fromEntries(PLATFORMS.map(p => [p.key, '']));

// ─── Modal wrapper ───────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (!open) return;
        const handler = e => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}>
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                    <button onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
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

// ─── Instructor form (shared by create + edit) ───────────────────────────────
function InstructorForm({ data, setData, errors, processing, progress = 0, onSubmit, isEdit }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6" encType="multipart/form-data">
            <FormErrors errors={errors} />

            {/* ── Basic info ── */}
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500">Basic Information</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Name */}
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
                        <input type="text" value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="input-modern" placeholder="e.g., Tewelde Mebrahtu" />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Email <span className="font-normal text-slate-400">(optional)</span>
                        </label>
                        <input type="email" value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="input-modern" placeholder="instructor@example.com" />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</label>
                        <input type="text" value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className="input-modern" placeholder="+251..." />
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Password {isEdit && <span className="font-normal text-slate-400">(leave blank to keep current)</span>}
                        </label>
                        <input type="password" value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="input-modern" placeholder={isEdit ? '••••••••' : 'Min 8 characters'} />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Password confirm */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password</label>
                        <input type="password" value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="input-modern" placeholder="••••••••" />
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                    </div>

                    {/* Avatar */}
                    <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Profile Picture {isEdit && <span className="font-normal text-slate-400">(leave blank to keep current)</span>}
                        </label>
                        <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={e => setData('avatar', e.target.files[0] ?? null)}
                            className="input-modern" />
                        {errors.avatar && <p className="mt-1 text-xs text-red-500">{errors.avatar}</p>}
                    </div>
                </div>
            </div>

            {/* ── Social media ── */}
            <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-500">
                    Social Media &amp; Contact Links
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PLATFORMS.map(p => (
                        <div key={p.key}>
                            <label className="mb-1 block text-sm font-semibold text-slate-700">{p.label}</label>
                            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
                                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <input
                                    type={['telegram','whatsapp'].includes(p.key) ? 'text' : 'url'}
                                    value={data.social_media?.[p.key] ?? ''}
                                    onChange={e => setData('social_media', {
                                        ...data.social_media,
                                        [p.key]: e.target.value,
                                    })}
                                    placeholder={p.placeholder}
                                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300"
                                />
                            </div>
                            {errors[`social_media.${p.key}`] && (
                                <p className="mt-1 text-xs text-red-500">{errors[`social_media.${p.key}`]}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <UploadProgress show={processing} progress={progress} label="Uploading instructor…" />

            <div className="flex justify-end pt-2">
                <button type="submit" disabled={processing} className="btn-primary min-w-[160px]">
                    {uploadingLabel(processing, progress, isEdit ? 'Save Changes' : 'Create Instructor')}
                </button>
            </div>
        </form>
    );
}

// ─── Social media pill list ──────────────────────────────────────────────────
function SocialPills({ social }) {
    if (!social) return null;
    const active = Object.entries(social).filter(([, v]) => v);
    if (!active.length) return <span className="text-xs text-slate-400">No links</span>;
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {active.map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100 hover:bg-indigo-100 capitalize transition-colors">
                    {platform}
                </a>
            ))}
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function InstructorsIndex({ instructors = [], stats = {} }) {

    // ── Create ──────────────────────────────────────────────────────
    const [createOpen, setCreateOpen] = useState(false);
    const { data: cData, setData: setCData, post: cPost,
            processing: cProcessing, reset: cReset, errors: cErrors } = useForm({
        name: '', email: '', phone: '', password: '', password_confirmation: '',
        avatar: null, social_media: { ...EMPTY_SOCIAL },
    });
    const { progress: cProgress, start: startCreate, finish: finishCreate, onProgress: onCreateProgress } = useUploadProgress();
    const handleCreate = e => {
        e.preventDefault();
        startCreate();
        cPost(route('admin.instructors.store'), {
            forceFormData: true,
            onProgress: onCreateProgress,
            onSuccess: () => { finishCreate(); cReset(); setCData('social_media', { ...EMPTY_SOCIAL }); setCreateOpen(false); },
            onError: finishCreate,
        });
    };

    // ── Edit ────────────────────────────────────────────────────────
    const [editTarget, setEditTarget] = useState(null);
    const { data: eData, setData: setEData, post: ePost,
            processing: eProcessing, reset: eReset, errors: eErrors } = useForm({
        _method: 'PUT', name: '', email: '', phone: '',
        password: '', password_confirmation: '',
        avatar: null, social_media: { ...EMPTY_SOCIAL },
    });
    const openEdit = instructor => {
        setEData({
            _method: 'PUT',
            name: instructor.name,
            email: instructor.email ?? '',
            phone: instructor.phone ?? '',
            password: '',
            password_confirmation: '',
            avatar: null,
            social_media: { ...EMPTY_SOCIAL, ...(instructor.social_media ?? {}) },
        });
        setEditTarget(instructor);
    };
    const { progress: eProgress, start: startEdit, finish: finishEdit, onProgress: onEditProgress } = useUploadProgress();
    const handleEdit = e => {
        e.preventDefault();
        startEdit();
        ePost(route('admin.instructors.update', editTarget.id), {
            forceFormData: true,
            onProgress: onEditProgress,
            onSuccess: () => { finishEdit(); eReset(); setEditTarget(null); },
            onError: finishEdit,
        });
    };

    // ── Delete ──────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleteProcessing(true);
        router.delete(route('admin.instructors.destroy', deleteTarget.id), {
            onFinish: () => { setDeleteProcessing(false); setDeleteTarget(null); },
        });
    };

    return (
        <AdminLayout>
            {/* ── Hero header ── */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Instructor Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage Instructors</h1>
                <p className="mt-3 max-w-2xl text-lg text-indigo-100">
                    Add, edit and manage all instructor accounts, profiles, contact info and social media links.
                </p>
            </div>

            {/* ── Stats ── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: 'Total Instructors', value: stats.total    ?? 0, color: 'from-indigo-500 to-indigo-600' },
                    { label: 'Active',             value: stats.active   ?? 0, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Inactive',           value: stats.inactive ?? 0, color: 'from-rose-500 to-rose-600' },
                    { label: 'Total Courses',      value: stats.courses  ?? 0, color: 'from-amber-500 to-orange-600' },
                ].map(s => (
                    <div key={s.label} className="surface-card p-5">
                        <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-r ${s.color} px-4 py-2 text-sm font-semibold text-white shadow`}>
                            {s.label}
                        </div>
                        <p className="text-3xl font-black text-slate-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Table header ── */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">All Instructors</h2>
                <button onClick={() => setCreateOpen(true)}
                    className="btn-primary inline-flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Instructor
                </button>
            </div>

            {/* ── Instructor list ── */}
            {instructors.length === 0 ? (
                <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                        <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No instructors yet</h3>
                    <p className="mt-2 text-sm text-slate-500">Create the first instructor account above.</p>
                </div>
            ) : (
                <div className="surface-card overflow-hidden">

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Social Media</th>
                                    <th className="px-6 py-4">Courses</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {instructors.map(inst => (
                                    <tr key={inst.id} className="hover:bg-slate-50/70 transition-colors">

                                        {/* Avatar + name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {inst.avatar ? (
                                                    <img src={`/media/${inst.avatar}`} alt={inst.name}
                                                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-100" />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-black text-white">
                                                        {inst.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-slate-900">{inst.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        Since {new Date(inst.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            {inst.email && (
                                                <a href={`mailto:${inst.email}`}
                                                    className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {inst.email}
                                                </a>
                                            )}
                                            {inst.phone && (
                                                <a href={`tel:${inst.phone}`}
                                                    className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600">
                                                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {inst.phone}
                                                </a>
                                            )}
                                        </td>

                                        {/* Social media */}
                                        <td className="px-6 py-4 max-w-[180px]">
                                            <SocialPills social={inst.social_media} />
                                        </td>

                                        {/* Courses count */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center rounded-xl bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">
                                                {inst.courses_count ?? 0}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {inst.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Inactive
                                                </span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {/* Toggle active/inactive */}
                                                <button
                                                    onClick={() => router.patch(route('admin.instructors.toggle', inst.id))}
                                                    title={inst.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                        inst.status === 'active'
                                                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    }`}>
                                                    {inst.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                {/* Edit */}
                                                <button onClick={() => openEdit(inst)}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                    title="Edit instructor">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                {/* Delete */}
                                                <button onClick={() => setDeleteTarget(inst)}
                                                    className="rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                                    title="Delete instructor">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="divide-y divide-slate-100 lg:hidden">
                        {instructors.map(inst => (
                            <div key={inst.id} className="p-5 space-y-3">
                                {/* Header row */}
                                <div className="flex items-start gap-3">
                                    {inst.avatar ? (
                                        <img src={`/media/${inst.avatar}`} alt={inst.name}
                                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-indigo-100" />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-black text-white">
                                            {inst.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900">{inst.name}</p>
                                        {inst.email && <p className="text-xs text-slate-500 truncate">{inst.email}</p>}
                                        {inst.phone && <p className="text-xs text-slate-500">{inst.phone}</p>}
                                        <div className="mt-1.5 flex items-center gap-2">
                                            {inst.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Inactive
                                                </span>
                                            )}
                                            <span className="text-xs font-semibold text-indigo-600">{inst.courses_count ?? 0} courses</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Social links */}
                                <SocialPills social={inst.social_media} />

                                {/* Action buttons */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <button onClick={() => router.patch(route('admin.instructors.toggle', inst.id))}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                                            inst.status === 'active'
                                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                        }`}>
                                        {inst.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => openEdit(inst)}
                                        className="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                                        Edit
                                    </button>
                                    <button onClick={() => setDeleteTarget(inst)}
                                        className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Create Modal ── */}
            <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Instructor">
                <InstructorForm
                    data={cData} setData={setCData}
                    errors={cErrors} processing={cProcessing} progress={cProgress}
                    onSubmit={handleCreate} isEdit={false} />
            </Modal>

            {/* ── Edit Modal ── */}
            <Modal open={!!editTarget} onClose={() => { setEditTarget(null); eReset(); }} title="Edit Instructor">
                <InstructorForm
                    data={eData} setData={setEData}
                    errors={eErrors} processing={eProcessing} progress={eProgress}
                    onSubmit={handleEdit} isEdit />
            </Modal>

            {/* ── Delete Confirm Modal ── */}
            {deleteTarget && (
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
                                <p className="font-semibold text-slate-900">
                                    Delete <span className="text-rose-700">"{deleteTarget.name}"</span>?
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    This will permanently remove the instructor account. Their courses will remain but will have no assigned instructor.
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
                                ) : 'Delete Instructor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
