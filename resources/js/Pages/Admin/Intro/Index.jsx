import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress, cancelActiveUpload } from '@/Components/UploadProgress';
import { Head, router, useForm, usePage } from '@inertiajs/react';

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

function formatBytes(bytes = 0) {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IntroIndex({ introVideo = null }) {
    const { flash = {} } = usePage().props;
    const form = useForm({ video: null });
    const { progress, start, finish, onProgress, cancel } = useUploadProgress();

    const onFile = (file) => {
        form.clearErrors('video');
        if (file && file.size > MAX_VIDEO_BYTES) {
            form.setData('video', null);
            form.setError('video', 'Intro video must be 500 MB or less.');
            return;
        }
        form.setData('video', file || null);
    };

    const cancelUpload = () => {
        cancelActiveUpload(finish);
        cancel();
    };

    const clearSelection = () => {
        if (form.processing) {
            cancelUpload();
        }
        form.reset();
        form.setData({ video: null });
        form.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        if (!form.data.video) {
            form.setError('video', 'Please choose an introduction video.');
            return;
        }
        if (form.data.video.size > MAX_VIDEO_BYTES) {
            form.setError('video', 'Intro video must be 500 MB or less.');
            return;
        }
        start();
        form.post(route('admin.intro.update'), {
            forceFormData: true,
            onProgress,
            onSuccess: () => {
                finish();
                form.reset();
                form.setData({ video: null });
            },
            onError: finish,
            onCancel: finish,
        });
    };

    return (
        <AdminLayout>
            <Head title="Homepage Intro | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Homepage</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Introduction video</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    This is the Success Life Coaching Academy intro video in the homepage hero. It is separate from course reels.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {flash.success}
                </div>
            ) : null}

            <div className="surface-card space-y-6 p-8">
                <div>
                    <h2 className="text-xl font-black text-slate-900">Current intro video</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Shown under the homepage headline. Course reels stay in the right-side scroller only.
                    </p>
                </div>

                {introVideo?.src ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                        <video
                            src={`${introVideo.src}?t=${introVideo.updated_at || ''}`}
                            controls
                            className="max-h-80 w-full object-contain"
                        />
                    </div>
                ) : (
                    <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                        No introduction video uploaded yet. The homepage hero video area will stay empty until you upload one.
                    </p>
                )}

                <form onSubmit={submit} className="space-y-4 border-t border-slate-100 pt-6">
                    <FormErrors errors={form.errors} />
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            {introVideo ? 'Replace introduction video' : 'Upload introduction video'}
                        </label>
                        <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            onChange={(e) => onFile(e.target.files[0] || null)}
                        />
                        <p className="mt-1 text-xs text-slate-400">MP4, MOV, or WEBM · max 500 MB.</p>
                        {form.data.video ? (
                            <p className="mt-1 text-xs font-medium text-slate-600">
                                Selected: {form.data.video.name} ({formatBytes(form.data.video.size)})
                            </p>
                        ) : null}
                        {form.errors.video ? <p className="mt-1 text-xs text-red-500">{form.errors.video}</p> : null}
                    </div>

                    <UploadProgress
                        show={form.processing}
                        progress={progress}
                        label="Uploading introduction video…"
                        onCancel={cancelUpload}
                    />

                    <div className="flex flex-wrap gap-3">
                        <button type="submit" disabled={form.processing} className="btn-primary">
                            {uploadingLabel(
                                form.processing,
                                progress,
                                introVideo ? 'Replace intro video' : 'Upload intro video'
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={clearSelection}
                        >
                            Cancel
                        </button>
                        {introVideo ? (
                            <button
                                type="button"
                                disabled={form.processing}
                                className="btn-secondary text-rose-600"
                                onClick={() =>
                                    confirm('Remove the homepage introduction video?') &&
                                    router.delete(route('admin.intro.destroy'))
                                }
                            >
                                Remove intro
                            </button>
                        ) : null}
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
