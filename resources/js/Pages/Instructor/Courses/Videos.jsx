import InstructorLayout from '@/Layouts/InstructorLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress, cancelActiveUpload } from '@/Components/UploadProgress';
import { useForm, router, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------
function Modal({ open, onClose, title, children }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

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
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close modal"
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

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function Videos({ course, videos = [], auth }) {
    // ── upload modal ──────────────────────────────────────────────
    const [uploadOpen, setUploadOpen] = useState(false);
    const { progress: uploadProgress, start: startUpload, finish: finishUpload, onProgress } = useUploadProgress();
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        title:      '',
        video_file: null,
        materials:  [],
        sequence:   (videos.length + 1),
    });

    // keep default sequence in sync if videos list changes
    useEffect(() => {
        if (!uploadOpen) {
            setData('sequence', videos.length + 1);
        }
    }, [videos.length, uploadOpen]);

    const openUpload = () => {
        reset();
        startUpload();
        setData('sequence', videos.length + 1);
        setUploadOpen(true);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        startUpload();
        post(route('instructor.videos.store', course.id), {
            forceFormData: true,
            onProgress,
            onSuccess: () => {
                reset();
                finishUpload();
                setUploadOpen(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: finishUpload,
            onCancel: finishUpload,
        });
    };

    const cancelUploadModal = () => {
        if (processing) cancelActiveUpload(finishUpload);
        setUploadOpen(false);
    };

    // ── delete ────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const editForm = useForm({
        title: '',
        sequence: 1,
        video_file: null,
        materials: [],
    });
    const { progress: editProgress, start: startEditUpload, finish: finishEditUpload, onProgress: onEditProgress } = useUploadProgress();
    const activeEdit = editTarget
        ? (videos.find((item) => item.id === editTarget.id) ?? editTarget)
        : null;

    const openEdit = (video) => {
        setEditTarget(video);
        editForm.setData({
            title: video.title,
            sequence: video.sequence,
            video_file: null,
            materials: [],
        });
        editForm.clearErrors();
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!editTarget) return;
        startEditUpload();
        editForm.post(route('instructor.videos.update', { course: course.id, video: editTarget.id }), {
            forceFormData: true,
            onProgress: onEditProgress,
            onSuccess: () => {
                finishEditUpload();
                setEditTarget(null);
            },
            onError: finishEditUpload,
            onCancel: finishEditUpload,
        });
    };

    const cancelEditModal = () => {
        if (editForm.processing) cancelActiveUpload(finishEditUpload);
        setEditTarget(null);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        setDeleteProcessing(true);
        router.delete(route('instructor.videos.destroy', { course: course.id, video: deleteTarget.id }), {
            onFinish: () => {
                setDeleteProcessing(false);
                setDeleteTarget(null);
            },
        });
    };

    // ── render ────────────────────────────────────────────────────
    return (
        <InstructorLayout>
            {/* Breadcrumb + header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {/* Breadcrumb */}
                    <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            href={route('instructor.courses.index')}
                            className="hover:text-indigo-600 hover:underline transition-colors"
                        >
                            My Courses
                        </Link>
                        <svg className="h-4 w-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                            {course.title}
                        </span>
                    </div>

                    <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Videos</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {videos.length} video{videos.length !== 1 ? 's' : ''} in this course
                    </p>
                </div>

                <button
                    onClick={openUpload}
                    className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload New Video
                </button>
            </div>

            {/* Video list */}
            {videos.length === 0 ? (
                <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                        <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-slate-900">No videos yet</h3>
                    <p className="mb-6 max-w-sm text-sm text-slate-500">
                        Upload your first video to get this course started.
                    </p>
                    <button onClick={openUpload} className="btn-primary inline-flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload New Video
                    </button>
                </div>
            ) : (
                <div className="surface-card overflow-hidden">
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <th className="px-6 py-4 w-16">#</th>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {videos.map((video) => (
                                    <tr key={video.id} className="group transition-colors hover:bg-slate-50/70">
                                        {/* Sequence */}
                                        <td className="px-6 py-4">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">
                                                {video.sequence}
                                            </div>
                                        </td>

                                        {/* Title */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <span className="font-medium text-slate-900">{video.title}</span>
                                                {video.materials?.length ? (
                                                    <span className="ml-2 text-xs text-slate-400">{video.materials.length} files</span>
                                                ) : null}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(video)}
                                                    title="Edit video"
                                                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(video)}
                                                    title="Delete video"
                                                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile list */}
                    <div className="divide-y divide-slate-100 sm:hidden">
                        {videos.map((video) => (
                            <div key={video.id} className="flex items-center gap-4 p-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-600">
                                    {video.sequence}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate">{video.title}</p>
                                </div>
                                <button
                                    onClick={() => setDeleteTarget(video)}
                                    className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 flex-shrink-0"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Upload Video Modal ───────────────────────────────────── */}
            <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload New Video">
                <form onSubmit={handleUpload} className="space-y-5" encType="multipart/form-data">
                    {/* Error summary */}
                    <FormErrors errors={errors} />

                    {/* Course label (read-only context) */}
                    <div className="rounded-2xl bg-indigo-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-0.5">Course</p>
                        <p className="font-semibold text-slate-800">{course.title}</p>
                    </div>

                    {/* Video title */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Video Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="input-modern"
                            placeholder="e.g., Introduction to Variables"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    {/* Sequence */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Sequence / Order</label>
                        <input
                            type="number"
                            min="1"
                            value={data.sequence}
                            onChange={(e) => setData('sequence', e.target.value)}
                            className="input-modern"
                        />
                        {errors.sequence && <p className="mt-1 text-xs text-red-500">{errors.sequence}</p>}
                    </div>

                    {/* Video file */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Video File</label>
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50">
                            <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {data.video_file ? data.video_file.name : 'Click to choose a video'}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">MP4, MOV, AVI or WMV · max 1 GB</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,.mp4,.mov,.avi,.wmv"
                                className="sr-only"
                                onChange={(e) => setData('video_file', e.target.files[0] ?? null)}
                            />
                        </label>
                        {errors.video_file && <p className="mt-1 text-xs text-red-500">{errors.video_file}</p>}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Course materials (optional, multiple)</label>
                        <input
                            type="file"
                            multiple
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            onChange={(e) => setData('materials', Array.from(e.target.files || []))}
                        />
                        <p className="mt-1 text-xs text-slate-400">PDF, Word, ZIP, APK, EXE and other lesson files.</p>
                    </div>

                    <UploadProgress
                        show={processing}
                        progress={uploadProgress}
                        label="Uploading video…"
                        onCancel={() => cancelActiveUpload(finishUpload)}
                    />

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={cancelUploadModal}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary inline-flex min-w-[140px] items-center justify-center gap-2"
                        >
                            {uploadingLabel(processing, uploadProgress, 'Upload Video')}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!activeEdit} onClose={() => setEditTarget(null)} title="Edit Video">
                <form onSubmit={handleEdit} className="space-y-5" encType="multipart/form-data">
                    <FormErrors errors={editForm.errors} />
                    <input className="input-modern" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} />
                    <input className="input-modern" type="number" min="1" value={editForm.data.sequence} onChange={(e) => editForm.setData('sequence', e.target.value)} />
                    <input type="file" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,.mp4,.mov,.avi,.wmv" onChange={(e) => editForm.setData('video_file', e.target.files[0] ?? null)} />
                    {(activeEdit?.materials ?? []).map((material) => (
                        <div key={material.id} className="flex items-center justify-between text-sm">
                            <span className="truncate">{material.original_name}</span>
                            <button type="button" className="text-rose-600" onClick={() => router.delete(route('instructor.videos.materials.destroy', { course: course.id, video: activeEdit.id, material: material.id }), { preserveScroll: true })}>Remove</button>
                        </div>
                    ))}
                    <input type="file" multiple onChange={(e) => editForm.setData('materials', Array.from(e.target.files || []))} />
                    <UploadProgress
                        show={editForm.processing}
                        progress={editProgress}
                        label="Uploading video…"
                        onCancel={() => cancelActiveUpload(finishEditUpload)}
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={cancelEditModal} className="rounded-2xl border px-5 py-2.5 text-sm font-semibold">Cancel</button>
                        <button type="submit" disabled={editForm.processing} className="btn-primary">
                            {uploadingLabel(editForm.processing, editProgress, 'Save changes')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Delete Confirm Modal ─────────────────────────────────── */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Video">
                <div className="space-y-5">
                    <div className="flex items-start gap-4 rounded-2xl bg-rose-50 p-5">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                            <svg className="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                Delete <span className="text-rose-700">"{deleteTarget?.title}"</span>?
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                The video file will be permanently removed. This cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setDeleteTarget(null)}
                            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteProcessing}
                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
                        >
                            {deleteProcessing ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Deleting…
                                </>
                            ) : 'Delete Video'}
                        </button>
                    </div>
                </div>
            </Modal>
        </InstructorLayout>
    );
}
