import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress, cancelActiveUpload } from '@/Components/UploadProgress';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

const MAX_MB = 50;

// datetime-local inputs need "YYYY-MM-DDTHH:mm"; the server sends ISO / "YYYY-MM-DD HH:mm:ss".
const toLocalInput = (v) => {
    if (!v) return '';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmt = (v) => (v ? new Date(v).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : null);
const sizeMb = (bytes) => (bytes / (1024 * 1024)).toFixed(1);

function statusOf(ad) {
    if (!ad) return null;
    const now = Date.now();
    if (ad.start_at && new Date(ad.start_at).getTime() > now) return { label: 'Scheduled', cls: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' };
    if (ad.end_at && new Date(ad.end_at).getTime() < now) return { label: 'Expired', cls: 'bg-slate-200 text-slate-700', dot: 'bg-slate-500' };
    if (ad.is_active === false) return { label: 'Hidden', cls: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' };
    return { label: 'Live on homepage', cls: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500 animate-pulse' };
}

export default function AdvertisementIndex({ advertisement = null, migrations_missing = false }) {
    const { flash } = usePage().props;
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [localError, setLocalError] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(false);
    const { progress, start, finish, onProgress } = useUploadProgress();

    const form = useForm({
        title: advertisement?.title || '',
        video: null,
        start_at: toLocalInput(advertisement?.start_at),
        end_at: toLocalInput(advertisement?.end_at),
    });

    const status = useMemo(() => statusOf(advertisement), [advertisement]);
    const hasAd = !!advertisement?.video_path;
    const canSubmit = !form.processing && !migrations_missing && (form.data.video || (hasAd && form.isDirty));

    const pickFile = (file) => {
        setLocalError('');
        if (!file) return form.setData('video', null);
        if (!/\.(mp4|mov|webm)$/i.test(file.name)) return setLocalError('Please choose an mp4, mov or webm video.');
        if (file.size > MAX_MB * 1024 * 1024) return setLocalError(`That file is ${sizeMb(file.size)} MB. The limit is ${MAX_MB} MB.`);
        form.setData('video', file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const submit = (e) => {
        e.preventDefault();
        start();
        form.post(route('admin.advertisement.store'), {
            forceFormData: true,
            preserveScroll: true,
            onProgress,
            onSuccess: () => {
                form.setData('video', null);
                if (inputRef.current) inputRef.current.value = '';
                finish();
            },
            onError: finish,
            onCancel: finish,
        });
    };

    const remove = () => {
        router.delete(route('admin.advertisement.destroy', advertisement.id), {
            preserveScroll: true,
            onFinish: () => setConfirmRemove(false),
        });
    };

    const previewUrl = hasAd ? `/media/${advertisement.video_path.replace(/^storage\//, '')}` : null;

    return (
        <AdminLayout>
            <Head title="Homepage Promo | Admin" />

            <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">Homepage promo video</h2>
                <p className="mt-1 text-sm text-slate-500">A short video shown on the homepage. Uploading a new one replaces the current video.</p>
            </div>

            {flash?.success && (
                <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                    <span aria-hidden="true">✓</span> {flash.success}
                </div>
            )}
            {migrations_missing && (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    The advertisements table does not exist yet. Run <code className="font-mono">php artisan migrate</code> to enable this page.
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                {/* ── Current promo ── */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-extrabold text-slate-900">Current promo</h3>
                        {status && (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${status.cls}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} /> {status.label}
                            </span>
                        )}
                    </header>

                    {hasAd ? (
                        <div className="p-5">
                            <div className="overflow-hidden rounded-xl bg-black shadow-inner">
                                <video src={previewUrl} controls muted loop playsInline preload="metadata" className="aspect-video w-full object-contain" />
                            </div>

                            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</dt>
                                    <dd className="mt-0.5 font-bold text-slate-800">{advertisement.title || '—'}</dd>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Starts</dt>
                                    <dd className="mt-0.5 font-semibold text-slate-700">{fmt(advertisement.start_at) || 'Immediately'}</dd>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ends</dt>
                                    <dd className="mt-0.5 font-semibold text-slate-700">{fmt(advertisement.end_at) || 'No end date'}</dd>
                                </div>
                            </dl>

                            <div className="mt-4">
                                {confirmRemove ? (
                                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm">
                                        <span className="flex-1 font-semibold text-rose-800">Remove this video from the homepage?</span>
                                        <button type="button" onClick={() => setConfirmRemove(false)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">Cancel</button>
                                        <button type="button" onClick={remove} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700">Yes, remove</button>
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => setConfirmRemove(true)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100">
                                        Remove promo
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">🎬</span>
                            <h4 className="mt-4 font-bold text-slate-900">No promo video yet</h4>
                            <p className="mt-1 text-sm text-slate-500">Upload one using the form and it goes live right away.</p>
                        </div>
                    )}
                </section>

                {/* ── Upload / settings ── */}
                <form onSubmit={submit} encType="multipart/form-data" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="border-b border-slate-100 px-5 py-4">
                        <h3 className="text-base font-extrabold text-slate-900">{hasAd ? 'Replace or edit' : 'Upload promo'}</h3>
                    </header>

                    <div className="space-y-5 p-5">
                        <FormErrors errors={form.errors} />

                        {/* Drop zone */}
                        <div>
                            <label
                                htmlFor="promo-video"
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={onDrop}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
                                    dragging ? 'border-emerald-500 bg-emerald-50' : form.data.video ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/40'
                                }`}
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow">{form.data.video ? '✅' : '⬆️'}</span>
                                {form.data.video ? (
                                    <>
                                        <p className="mt-3 max-w-full truncate text-sm font-bold text-slate-800">{form.data.video.name}</p>
                                        <p className="text-xs text-slate-500">{sizeMb(form.data.video.size)} MB · click to choose another</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="mt-3 text-sm font-bold text-slate-800">Drop a video here or click to browse</p>
                                        <p className="text-xs text-slate-500">MP4, MOV or WebM · up to {MAX_MB} MB{hasAd ? ' · optional when only editing details' : ''}</p>
                                    </>
                                )}
                            </label>
                            <input
                                ref={inputRef}
                                id="promo-video"
                                type="file"
                                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                                className="sr-only"
                                onChange={(e) => pickFile(e.target.files?.[0])}
                            />
                            {(localError || form.errors.video) && <p className="mt-2 text-sm font-medium text-rose-600">{localError || form.errors.video}</p>}
                        </div>

                        <div>
                            <label htmlFor="promo-title" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                                Title <span className="font-normal normal-case text-slate-400">(optional)</span>
                            </label>
                            <input
                                id="promo-title"
                                type="text"
                                value={form.data.title}
                                onChange={(e) => form.setData('title', e.target.value)}
                                placeholder="e.g. Welcome to Success Life Coaching"
                                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-copper-600 focus:ring-2 focus:ring-copper-200"
                            />
                        </div>

                        <fieldset>
                            <legend className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                                Schedule <span className="font-normal normal-case text-slate-400">(optional · leave empty to show always)</span>
                            </legend>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="promo-start" className="mb-1 block text-[11px] font-semibold text-slate-500">Starts</label>
                                    <input id="promo-start" type="datetime-local" value={form.data.start_at} onChange={(e) => form.setData('start_at', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-copper-600 focus:ring-2 focus:ring-copper-200" />
                                </div>
                                <div>
                                    <label htmlFor="promo-end" className="mb-1 block text-[11px] font-semibold text-slate-500">Ends</label>
                                    <input id="promo-end" type="datetime-local" value={form.data.end_at} min={form.data.start_at || undefined} onChange={(e) => form.setData('end_at', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-copper-600 focus:ring-2 focus:ring-copper-200" />
                                </div>
                            </div>
                            {(form.errors.start_at || form.errors.end_at) && <p className="mt-2 text-sm font-medium text-rose-600">{form.errors.start_at || form.errors.end_at}</p>}
                            {(form.data.start_at || form.data.end_at) && (
                                <button type="button" onClick={() => { form.setData('start_at', ''); form.setData('end_at', ''); }} className="mt-2 text-xs font-bold text-copper-700 hover:underline">
                                    Clear schedule
                                </button>
                            )}
                        </fieldset>

                        <UploadProgress show={form.processing} progress={progress} label="Uploading promo…" onCancel={() => cancelActiveUpload(finish)} />
                    </div>

                    <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
                        <p className="text-xs text-slate-500">{form.data.video ? 'The new video replaces the current one.' : hasAd ? 'Change details or pick a new video.' : `Max ${MAX_MB} MB`}</p>
                        <button type="submit" disabled={!canSubmit} className="btn-primary disabled:opacity-50">
                            {uploadingLabel(form.processing, progress, form.data.video ? 'Upload & publish' : 'Save changes')}
                        </button>
                    </footer>
                </form>
            </div>
        </AdminLayout>
    );
}
