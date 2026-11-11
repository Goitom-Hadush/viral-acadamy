import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress, cancelActiveUpload } from '@/Components/UploadProgress';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const MAX_MEDIA_BYTES = 500 * 1024 * 1024;

function formatBytes(bytes = 0) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
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

export default function ReelsIndex({ reels = [], courses = [] }) {
    const { flash = {} } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const editingItem = reels.find((item) => item.id === editingId) ?? null;

    const form = useForm({
        course_id: courses[0]?.id || '',
        caption: '',
        media: null,
        duration: '',
        is_published: true,
    });

    const { progress, start, finish, onProgress } = useUploadProgress();

    const blankItem = () => ({
        course_id: courses[0]?.id || '',
        caption: '',
        media: null,
        duration: '',
        is_published: true,
    });

    const closeModal = () => {
        if (form.processing) cancelActiveUpload(finish);
        setModalOpen(false);
        setEditingId(null);
        finish();
        form.reset();
        form.setData(blankItem());
        form.clearErrors();
    };

    const openCreate = () => {
        setEditingId(null);
        form.setData(blankItem());
        form.clearErrors();
        setModalOpen(true);
    };

    const openEdit = (reel) => {
        setEditingId(reel.id);
        form.setData({
            course_id: reel.course_id || reel.course?.id || '',
            caption: reel.caption || '',
            media: null,
            duration: '',
            is_published: !!reel.is_published,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const onFile = (file) => {
        form.clearErrors('media');
        form.setData('media', file || null);
        form.setData('duration', '');
        if (!file) return;

        if (file.size > MAX_MEDIA_BYTES) {
            form.setData('media', null);
            form.setError('media', 'Reel files must be 500 MB or less.');
            return;
        }

        if (!file.type.startsWith('video/')) return;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            form.setData('duration', String(Math.round(video.duration || 0)));
        };
        video.src = URL.createObjectURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        if (form.data.media?.size > MAX_MEDIA_BYTES) {
            form.setError('media', 'Reel files must be 500 MB or less.');
            return;
        }

        start();
        const options = {
            forceFormData: true,
            onProgress,
            onSuccess: closeModal,
            onError: finish,
            onCancel: finish,
        };

        if (editingId) {
            form.post(route('admin.reels.update', editingId), options);
            return;
        }

        if (!form.data.media) {
            form.setError('media', 'Please choose a photo or video.');
            finish();
            return;
        }

        form.post(route('admin.reels.store'), options);
    };

    return (
        <AdminLayout>
            <Head title="Course Reels | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Reels menu</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Course reels</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    These reels appear on the public Reels page and link to a course. Homepage ads are managed separately under Homepage Ads.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {flash.success}
                </div>
            ) : null}

            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900">All reels</h2>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Add new reel
                </button>
            </div>

            <div className="surface-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="p-5">Preview</th>
                            <th className="p-5">Course</th>
                            <th className="p-5">Type</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reels.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-500">
                                    No reels yet. Click Add new reel to upload one.
                                </td>
                            </tr>
                        ) : (
                            reels.map((reel) => (
                                <tr key={reel.id}>
                                    <td className="p-5">
                                        {reel.media_type === 'video' ? (
                                            <video
                                                src={`/media/${reel.media_path}`}
                                                className="h-20 w-14 rounded-xl bg-black object-cover"
                                                muted
                                            />
                                        ) : (
                                            <img
                                                src={`/media/${reel.media_path}`}
                                                alt=""
                                                className="h-20 w-14 rounded-xl object-cover"
                                            />
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <p className="font-semibold text-slate-900">{reel.course?.title || 'Course'}</p>
                                        {reel.caption ? <p className="text-xs text-slate-500">{reel.caption}</p> : null}
                                    </td>
                                    <td className="p-5 capitalize text-slate-600">
                                        {reel.media_type}
                                        {reel.duration ? ` · ${reel.duration}s` : ''}
                                    </td>
                                    <td className="p-5">{reel.is_published ? 'Published' : 'Hidden'}</td>
                                    <td className="space-x-2 p-5 text-right">
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-copper-700"
                                            onClick={() => openEdit(reel)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-slate-600"
                                            onClick={() => router.patch(route('admin.reels.toggle', reel.id))}
                                        >
                                            Toggle
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-rose-600"
                                            onClick={() =>
                                                confirm('Delete this reel?') &&
                                                router.delete(route('admin.reels.destroy', reel.id))
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit reel' : 'Upload reel'}>
                <form onSubmit={submit} className="space-y-4">
                    <FormErrors errors={form.errors} />

                    <select
                        className="input-modern"
                        value={form.data.course_id}
                        onChange={(e) => form.setData('course_id', e.target.value)}
                    >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>

                    <input
                        className="input-modern"
                        placeholder="Short caption (optional)"
                        value={form.data.caption}
                        onChange={(e) => form.setData('caption', e.target.value)}
                    />

                    {editingItem?.media_path ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            {editingItem.media_type === 'video' ? (
                                <video
                                    src={`/media/${editingItem.media_path}`}
                                    controls
                                    className="max-h-56 w-full bg-black object-contain"
                                />
                            ) : (
                                <img
                                    src={`/media/${editingItem.media_path}`}
                                    alt=""
                                    className="max-h-56 w-full object-contain"
                                />
                            )}
                            <p className="px-4 py-2 text-xs text-slate-500">
                                Current media — upload a new file below to replace it.
                            </p>
                        </div>
                    ) : null}

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            {editingId ? 'Replace photo or video (optional)' : 'Photo or video (max 500 MB)'}
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            onChange={(e) => onFile(e.target.files[0] || null)}
                        />
                        <p className="mt-1 text-xs text-slate-400">
                            JPG, PNG, WEBP, MP4, MOV, or WEBM. Maximum file size is 500 MB.
                        </p>
                        {form.data.duration !== '' && form.data.media?.type?.startsWith('video/') ? (
                            <p className="mt-1 text-xs font-semibold text-emerald-600">
                                Detected length: {form.data.duration}s
                            </p>
                        ) : null}
                        {form.errors.media ? <p className="mt-1 text-xs text-red-500">{form.errors.media}</p> : null}
                    </div>

                    {form.data.media ? (
                        <p className="text-sm font-medium text-slate-600">
                            Selected: {form.data.media.name}
                            {form.data.media.size ? ` (${formatBytes(form.data.media.size)})` : ''}
                        </p>
                    ) : null}

                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                            type="checkbox"
                            checked={!!form.data.is_published}
                            onChange={(e) => form.setData('is_published', e.target.checked)}
                        />
                        Published
                    </label>

                    <UploadProgress
                        show={form.processing}
                        progress={progress}
                        label={editingId ? 'Saving reel…' : 'Uploading reel…'}
                        onCancel={() => cancelActiveUpload(finish)}
                    />

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={form.processing} className="btn-primary">
                            {uploadingLabel(form.processing, progress, editingId ? 'Update reel' : 'Upload reel')}
                        </button>
                        <button type="button" onClick={closeModal} className="btn-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
