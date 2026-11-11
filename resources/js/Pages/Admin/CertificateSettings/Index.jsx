import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const MAX_MB = 3;

// Turn a white / light-grey paper background into real transparency and return a PNG file.
// Runs in the browser, so the server only ever stores the clean signature.
function removeWhiteBackground(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, 900 / img.naturalWidth);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.naturalWidth * scale);
            canvas.height = Math.round(img.naturalHeight * scale);
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const px = image.data;
            const low = 150; // darker than this = solid ink
            const high = 235; // lighter than this = fully transparent
            for (let i = 0; i < px.length; i += 4) {
                const lightest = Math.min(px[i], px[i + 1], px[i + 2]);
                let alpha = 255;
                if (lightest >= high) alpha = 0;
                else if (lightest > low) alpha = Math.round(((high - lightest) / (high - low)) * 255);
                px[i + 3] = Math.min(px[i + 3], alpha);
            }
            ctx.putImageData(image, 0, 0);
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(url);
                resolve(blob ? new File([blob], 'signature.png', { type: 'image/png' }) : file);
            }, 'image/png');
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };
        img.src = url;
    });
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 transition focus:border-copper-600 focus:ring-2 focus:ring-copper-200';

// Mini version of the certificate footer so the admin sees exactly what gets printed.
function CertificatePreview({ signatureSrc, name, title, org }) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#996515] p-1.5 shadow-lg">
            <div className="rounded-xl bg-gradient-to-br from-[#003301] to-[#004101] p-1.5">
                <div className="rounded-lg bg-white px-5 pb-6 pt-5 text-center">
                    <p className="font-serif text-[11px] font-black uppercase tracking-[0.25em] text-[#004101]">Certificate of Completion</p>
                    <div className="mx-auto my-2 h-px w-24 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
                    <p className="font-serif text-lg font-bold italic text-slate-800">Student Name</p>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="flex h-20 w-full items-end justify-center">
                            {signatureSrc ? (
                                <img src={signatureSrc} alt="Signature preview" className="max-h-20 max-w-[220px] object-contain mix-blend-multiply" draggable={false} />
                            ) : (
                                <span className="font-serif text-2xl font-bold italic text-[#004101]">{name || 'Your name'}</span>
                            )}
                        </div>
                        <div className="my-1.5 h-px w-48 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
                        <p className="text-sm font-black text-slate-900">{name || 'Your name'}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B8860B]">{title || 'Title'}</p>
                        <p className="mt-0.5 text-[10px] font-semibold text-emerald-800">{org || 'Organization'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CertificateSettingsIndex({ settings, migrations_missing = false }) {
    const { flash = {} } = usePage().props;
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [busy, setBusy] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [fileError, setFileError] = useState('');
    const [confirmRemove, setConfirmRemove] = useState(false);

    const form = useForm({
        signer_name: settings?.signer_name || '',
        signer_title: settings?.signer_title || '',
        organization: settings?.organization || '',
        signature: null,
    });

    // Free the temporary preview URL when it changes or the page closes.
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    const shown = preview || settings?.signature_url || null;
    const hasSaved = !!settings?.signature_url;

    const pickFile = async (original) => {
        setFileError('');
        if (!original) return;
        if (!/^image\/(png|jpe?g|webp)$/i.test(original.type)) return setFileError('Please choose a PNG, JPG or WebP image.');
        if (original.size > MAX_MB * 1024 * 1024) return setFileError(`That image is ${(original.size / 1048576).toFixed(1)} MB. The limit is ${MAX_MB} MB.`);

        setBusy(true);
        const clean = await removeWhiteBackground(original);
        setBusy(false);
        form.setData('signature', clean);
        setPreview(URL.createObjectURL(clean));
    };

    const clearPicked = () => {
        form.setData('signature', null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.certificate-settings.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: clearPicked,
        });
    };

    const removeSaved = () => {
        router.delete(route('admin.certificate-settings.signature.destroy'), {
            preserveScroll: true,
            onFinish: () => setConfirmRemove(false),
        });
    };

    const set = (k) => (e) => form.setData(k, e.target.value);
    const canSave = !form.processing && !busy && !migrations_missing && form.isDirty && form.data.signer_name.trim() && form.data.signer_title.trim() && form.data.organization.trim();

    return (
        <AdminLayout>
            <Head title="Certificate Signature | Admin" />

            <form onSubmit={submit} className="pb-24">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Certificate signature</h2>
                    <p className="mt-1 text-sm text-slate-500">The signature, name and title printed at the bottom of every certificate.</p>
                </div>

                {flash.success && (
                    <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <span aria-hidden="true">✓</span> {flash.success}
                    </div>
                )}
                {flash.error && <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{flash.error}</div>}
                {migrations_missing && (
                    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Run <code className="font-mono">php artisan migrate</code> to enable this page.
                    </div>
                )}
                <FormErrors errors={form.errors} />

                <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
                    {/* ── Controls ── */}
                    <div className="space-y-5">
                        {/* Signature image */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-3 text-sm font-extrabold text-slate-900">Signature image</h3>

                            <label
                                htmlFor="signature-file"
                                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files?.[0]); }}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
                                    dragging ? 'border-emerald-500 bg-emerald-50' : form.data.signature ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/40'
                                }`}
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow">
                                    {busy ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" /> : form.data.signature ? '✅' : '✍️'}
                                </span>
                                <p className="mt-3 text-sm font-bold text-slate-800">
                                    {busy ? 'Cleaning the background…' : form.data.signature ? 'Signature ready · click to change' : 'Drop your signature here or click to browse'}
                                </p>
                                <p className="text-xs text-slate-500">PNG, JPG or WebP · up to {MAX_MB} MB · white background is removed automatically</p>
                            </label>
                            <input
                                ref={inputRef}
                                id="signature-file"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="sr-only"
                                onChange={(e) => pickFile(e.target.files?.[0])}
                            />
                            {(fileError || form.errors.signature) && <p className="mt-2 text-sm font-medium text-rose-600">{fileError || form.errors.signature}</p>}

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                {form.data.signature && (
                                    <button type="button" onClick={clearPicked} className="font-bold text-slate-500 hover:text-slate-800 hover:underline">Cancel new image</button>
                                )}
                                {hasSaved && !form.data.signature && (
                                    confirmRemove ? (
                                        <span className="flex flex-wrap items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-800">
                                            Remove the saved signature?
                                            <button type="button" onClick={removeSaved} className="rounded-md bg-rose-600 px-2.5 py-1 font-bold text-white hover:bg-rose-700">Yes, remove</button>
                                            <button type="button" onClick={() => setConfirmRemove(false)} className="font-bold text-slate-500">Cancel</button>
                                        </span>
                                    ) : (
                                        <button type="button" onClick={() => setConfirmRemove(true)} className="font-bold text-rose-600 hover:underline">Remove saved signature</button>
                                    )
                                )}
                            </div>
                        </section>

                        {/* Text details */}
                        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-extrabold text-slate-900">Printed under the signature</h3>
                            <div>
                                <label htmlFor="signer_name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Name</label>
                                <input id="signer_name" className={inputCls} value={form.data.signer_name} onChange={set('signer_name')} maxLength={150} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="signer_title" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Title</label>
                                    <input id="signer_title" className={inputCls} value={form.data.signer_title} onChange={set('signer_title')} maxLength={150} />
                                </div>
                                <div>
                                    <label htmlFor="organization" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Organization</label>
                                    <input id="organization" className={inputCls} value={form.data.organization} onChange={set('organization')} maxLength={150} />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ── Live preview ── */}
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live preview</p>
                                {preview && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">New signature</span>}
                            </div>
                            <CertificatePreview signatureSrc={shown} name={form.data.signer_name} title={form.data.signer_title} org={form.data.organization} />
                            <p className="mt-3 text-center text-xs text-slate-400">Shown on every certificate, including ones already issued.</p>
                        </div>
                    </aside>
                </div>

                {/* Sticky save bar */}
                <div
                    className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 lg:left-72 ${form.isDirty ? 'translate-y-0' : 'translate-y-full'}`}
                    aria-hidden={!form.isDirty}
                >
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Unsaved changes
                        </p>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => { form.reset(); clearPicked(); }} disabled={form.processing} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Discard
                            </button>
                            <button type="submit" disabled={!canSave} className="btn-primary disabled:opacity-60">
                                {form.processing ? 'Saving…' : 'Save signature'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
