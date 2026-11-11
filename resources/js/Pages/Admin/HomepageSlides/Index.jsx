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

export default function HomepageSlidesIndex({ slides = [] }) {
    const { flash = {} } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const editingItem = slides.find((item) => item.id === editingId) ?? null;

    const form = useForm({
        title: '',
        caption: '',
        link_url: '',
        cta_label: '',
        sort_order: 0,
        media: null,
        is_active: true,
    });

    const { progress, start, finish, onProgress } = useUploadProgress();

    const blankItem = () => ({
        title: '',
        caption: '',
        link_url: '',
        cta_label: '',
        sort_order: slides.length,
        media: null,
        is_active: true,
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

    const openEdit = (slide) => {
        setEditingId(slide.id);
        form.setData({
            title: slide.title || '',
            caption: slide.caption || '',
            link_url: slide.link_url || '',
            cta_label: slide.cta_label || '',
            sort_order: slide.sort_order ?? 0,
            media: null,
            is_active: !!slide.is_active,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const onFile = (file) => {
        form.clearErrors('media');
        form.setData('media', file || null);
        if (!file) return;
        if (file.size > MAX_MEDIA_BYTES) {
            form.setData('media', null);
            form.setError('media', 'Files must be 500 MB or less.');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (form.data.media?.size > MAX_MEDIA_BYTES) {
            form.setError('media', 'Files must be 500 MB or less.');
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
            form.post(route('admin.homepage-slides.update', editingId), options);
            return;
        }

        if (!form.data.media) {
            form.setError('media', 'Please choose a photo or video.');
            finish();
            return;
        }

        form.post(route('admin.homepage-slides.store'), options);
    };

    return (
        <AdminLayout>
            <Head title="Homepage Ads | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Homepage</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Homepage ads / slides</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    Upload pictures and videos for the homepage carousel (auto-scroll every 3 seconds).
                    These are separate from course reels — course reels appear only on the Reels menu page.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {flash.success}
                </div>
            ) : null}

            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900">All slides</h2>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Add new slide
                </button>
            </div>

            <div className="surface-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="p-5">Preview</th>
                            <th className="p-5">Title</th>
                            <th className="p-5">Order</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {slides.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-500">
                                    No homepage slides yet. Upload photos or videos for the homepage carousel.
                                </td>
                            </tr>
                        ) : (
                            slides.map((slide) => (
                                <tr key={slide.id}>
                                    <td className="p-5">
                                        {slide.media_type === 'video' ? (
                                            <video
                                                src={`/media/${slide.media_path}`}
                                                className="h-20 w-28 rounded-xl bg-black object-cover"
                                                muted
                                            />
                                        ) : (
                                            <img
                                                src={`/media/${slide.media_path}`}
                                                alt=""
                                                className="h-20 w-28 rounded-xl object-cover"
                                            />
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <p className="font-semibold text-slate-900">{slide.title || 'Untitled slide'}</p>
                                        {slide.caption ? <p className="text-xs text-slate-500">{slide.caption}</p> : null}
                                        <p className="mt-1 text-xs capitalize text-slate-400">{slide.media_type}</p>
                                    </td>
                                    <td className="p-5 text-slate-600">{slide.sort_order}</td>
                                    <td className="p-5">{slide.is_active ? 'Live' : 'Hidden'}</td>
                                    <td className="space-x-2 p-5 text-right">
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-copper-700"
                                            onClick={() => openEdit(slide)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-slate-600"
                                            onClick={() => router.patch(route('admin.homepage-slides.toggle', slide.id))}
                                        >
                                            Toggle
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-rose-600"
                                            onClick={() =>
                                                confirm('Delete this homepage slide?') &&
                                                router.delete(route('admin.homepage-slides.destroy', slide.id))
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

            <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit slide' : 'Upload slide'}>
                <form onSubmit={submit} className="space-y-4">
                    <FormErrors errors={form.errors} />

                    <input
                        className="input-modern"
                        placeholder="Title (optional)"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                    />

                    <input
                        className="input-modern"
                        placeholder="Caption (optional)"
                        value={form.data.caption}
                        onChange={(e) => form.setData('caption', e.target.value)}
                    />

                    <input
                        className="input-modern"
                        placeholder="Link URL (optional) e.g. /courses or https://…"
                        value={form.data.link_url}
                        onChange={(e) => form.setData('link_url', e.target.value)}
                    />

                    <input
                        className="input-modern"
                        placeholder="Button label (optional) e.g. Learn more"
                        value={form.data.cta_label}
                        onChange={(e) => form.setData('cta_label', e.target.value)}
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Sort order</label>
                        <input
                            type="number"
                            min="0"
                            className="input-modern"
                            value={form.data.sort_order}
                            onChange={(e) => form.setData('sort_order', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-slate-400">Lower numbers appear first.</p>
                    </div>

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
                            checked={!!form.data.is_active}
                            onChange={(e) => form.setData('is_active', e.target.checked)}
                        />
                        Show on homepage
                    </label>

                    <UploadProgress
                        show={form.processing}
                        progress={progress}
                        label={editingId ? 'Saving slide…' : 'Uploading slide…'}
                        onCancel={() => cancelActiveUpload(finish)}
                    />

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={form.processing} className="btn-primary">
                            {uploadingLabel(form.processing, progress, editingId ? 'Update slide' : 'Upload slide')}
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
