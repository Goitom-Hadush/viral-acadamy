import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress, cancelActiveUpload } from '@/Components/UploadProgress';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

function Modal({ open, onClose, title, children }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
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

export default function InterviewsAdmin({ page = null, interviews = [] }) {
    const { flash = {} } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const editingItem = interviews.find((item) => item.id === editingId) ?? null;

    const pageForm = useForm({
        eyebrow: page?.eyebrow || '',
        headline: page?.headline || '',
        intro: page?.intro || '',
        meta_description: page?.meta_description || '',
    });

    const form = useForm({
        guest: '',
        title: '',
        topic: '',
        summary: '',
        body: '',
        video_url: '',
        video: null,
        remove_video: false,
        sort_order: '',
        is_published: true,
    });

    const { progress, start, finish, onProgress } = useUploadProgress();

    const blankItem = () => ({
        guest: '',
        title: '',
        topic: '',
        summary: '',
        body: '',
        video_url: '',
        video: null,
        remove_video: false,
        sort_order: '',
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

    const openEdit = (item) => {
        setEditingId(item.id);
        form.setData({
            guest: item.guest,
            title: item.title,
            topic: item.topic || '',
            summary: item.summary || '',
            body: item.body || '',
            video_url: item.video_url || '',
            video: null,
            remove_video: false,
            sort_order: item.sort_order ?? '',
            is_published: !!item.is_published,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const onVideo = (file) => {
        form.clearErrors('video');
        if (file && file.size > MAX_VIDEO_BYTES) {
            form.setData('video', null);
            form.setError('video', 'Video must be 500 MB or less.');
            return;
        }
        form.setData('video', file || null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (form.data.video?.size > MAX_VIDEO_BYTES) {
            form.setError('video', 'Video must be 500 MB or less.');
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
            form.post(route('admin.interviews.update', editingId), options);
        } else {
            form.post(route('admin.interviews.store'), options);
        }
    };

    return (
        <AdminLayout>
            <Head title="Interviews | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Public content</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Interviews</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    Manage interviews on /interviews. Video optional · max 500 MB.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {flash.success}
                </div>
            ) : null}

            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-900">All interviews</h2>
                <button type="button" onClick={openCreate} className="btn-primary">
                    Add new interview
                </button>
            </div>

            <div className="surface-card mb-8 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="p-5">Interview</th>
                            <th className="p-5">Video</th>
                            <th className="p-5">Order</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {interviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-slate-500">
                                    No interviews yet. Click Add new interview to create one.
                                </td>
                            </tr>
                        ) : (
                            interviews.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-5">
                                        <p className="font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500">
                                            {item.guest}
                                            {item.topic ? ` · ${item.topic}` : ''}
                                        </p>
                                    </td>
                                    <td className="p-5 text-sm text-slate-600">
                                        {item.video_path ? 'Uploaded' : item.video_url ? 'External URL' : '—'}
                                    </td>
                                    <td className="p-5 text-slate-600">{item.sort_order}</td>
                                    <td className="p-5">{item.is_published ? 'Published' : 'Hidden'}</td>
                                    <td className="space-x-2 p-5 text-right">
                                        <button type="button" className="text-sm font-semibold text-copper-700" onClick={() => openEdit(item)}>
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-slate-600"
                                            onClick={() => router.patch(route('admin.interviews.toggle', item.id))}
                                        >
                                            Toggle
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-rose-600"
                                            onClick={() =>
                                                confirm('Delete this interview?') &&
                                                router.delete(route('admin.interviews.destroy', item.id))
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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    pageForm.put(route('admin.interviews.page'));
                }}
                className="surface-card space-y-4 p-8"
            >
                <h2 className="text-xl font-black text-slate-900">Page copy</h2>
                <FormErrors errors={pageForm.errors} />
                <input className="input-modern" placeholder="Eyebrow" value={pageForm.data.eyebrow} onChange={(e) => pageForm.setData('eyebrow', e.target.value)} />
                <input className="input-modern" placeholder="Headline" value={pageForm.data.headline} onChange={(e) => pageForm.setData('headline', e.target.value)} />
                <textarea className="input-modern min-h-24" placeholder="Intro" value={pageForm.data.intro} onChange={(e) => pageForm.setData('intro', e.target.value)} />
                <input className="input-modern" placeholder="SEO description" value={pageForm.data.meta_description} onChange={(e) => pageForm.setData('meta_description', e.target.value)} />
                <button type="submit" disabled={pageForm.processing} className="btn-primary">
                    {pageForm.processing ? 'Saving...' : 'Save page copy'}
                </button>
            </form>

            <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit interview' : 'Add interview'}>
                <form onSubmit={submit} className="space-y-4">
                    <FormErrors errors={form.errors} />
                    <input className="input-modern" placeholder="Guest" value={form.data.guest} onChange={(e) => form.setData('guest', e.target.value)} />
                    <input className="input-modern" placeholder="Title" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} />
                    <input className="input-modern" placeholder="Topic" value={form.data.topic} onChange={(e) => form.setData('topic', e.target.value)} />
                    <textarea className="input-modern min-h-24" placeholder="Summary" value={form.data.summary} onChange={(e) => form.setData('summary', e.target.value)} />
                    <textarea className="input-modern min-h-32" placeholder="Full conversation (optional)" value={form.data.body} onChange={(e) => form.setData('body', e.target.value)} />
                    <input className="input-modern" placeholder="External video URL (optional)" value={form.data.video_url} onChange={(e) => form.setData('video_url', e.target.value)} />

                    {editingItem?.video_path && !form.data.remove_video ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                            <video src={`/media/${editingItem.video_path}`} controls className="max-h-56 w-full object-contain" />
                        </div>
                    ) : null}

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            {editingId ? 'Replace interview video (optional)' : 'Interview video (optional)'}
                        </label>
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            onChange={(e) => onVideo(e.target.files[0] || null)}
                        />
                        <p className="mt-1 text-xs text-slate-400">MP4, MOV, or WEBM · max 500 MB.</p>
                        {form.data.video ? <p className="mt-1 text-xs font-medium text-slate-600">Selected: {form.data.video.name}</p> : null}
                        {form.errors.video ? <p className="mt-1 text-xs text-red-500">{form.errors.video}</p> : null}
                    </div>

                    {editingItem?.video_path ? (
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <input type="checkbox" checked={!!form.data.remove_video} onChange={(e) => form.setData('remove_video', e.target.checked)} />
                            Remove current video
                        </label>
                    ) : null}

                    <input className="input-modern" type="number" min="0" placeholder="Sort order" value={form.data.sort_order} onChange={(e) => form.setData('sort_order', e.target.value)} />
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={!!form.data.is_published} onChange={(e) => form.setData('is_published', e.target.checked)} />
                        Published
                    </label>

                    <UploadProgress
                        show={form.processing}
                        progress={progress}
                        label="Uploading interview…"
                        onCancel={() => cancelActiveUpload(finish)}
                    />

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={form.processing} className="btn-primary">
                            {uploadingLabel(form.processing, progress, editingId ? 'Update interview' : 'Add interview')}
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
