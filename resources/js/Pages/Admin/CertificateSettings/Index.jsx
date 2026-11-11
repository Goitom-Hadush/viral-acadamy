import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CertificateSettingsIndex({ settings, migrations_missing = false }) {
    const { flash = {} } = usePage().props;
    const [preview, setPreview] = useState(null);
    const form = useForm({
        signer_name: settings?.signer_name || '',
        signer_title: settings?.signer_title || '',
        organization: settings?.organization || '',
        signature: null,
    });

    const submit = (e) => {
        e.preventDefault();
        form.post(route('admin.certificate-settings.update'), {
            forceFormData: true,
            onSuccess: () => {
                setPreview(null);
                form.setData('signature', null);
            },
        });
    };

    // Turn a white/light paper background into real transparency and save as PNG.
    const removeWhiteBackground = (file) =>
        new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxW = 900;
                const scale = Math.min(1, maxW / img.naturalWidth);
                canvas.width = Math.round(img.naturalWidth * scale);
                canvas.height = Math.round(img.naturalHeight * scale);
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const px = data.data;
                const low = 150; // fully ink below this brightness
                const high = 235; // fully transparent above this brightness
                for (let i = 0; i < px.length; i += 4) {
                    const min = Math.min(px[i], px[i + 1], px[i + 2]);
                    let alpha = 255;
                    if (min >= high) alpha = 0;
                    else if (min > low) alpha = Math.round(((high - min) / (high - low)) * 255);
                    px[i + 3] = Math.min(px[i + 3], alpha);
                }
                ctx.putImageData(data, 0, 0);
                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(url);
                    if (!blob) return resolve(file);
                    resolve(new File([blob], 'signature.png', { type: 'image/png' }));
                }, 'image/png');
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve(file);
            };
            img.src = url;
        });

    const onFile = async (e) => {
        const original = e.target.files?.[0] || null;
        if (!original) {
            form.setData('signature', null);
            setPreview(null);
            return;
        }
        const file = await removeWhiteBackground(original);
        form.setData('signature', file);
        setPreview(URL.createObjectURL(file));
    };

    const removeSignature = () => {
        if (confirm('Remove the signature image?')) {
            router.delete(route('admin.certificate-settings.signature.destroy'), { preserveScroll: true });
        }
    };

    const shown = preview || settings?.signature_url;

    return (
        <AdminLayout>
            <Head title="Certificate Signature | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Certificates</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Certificate Signature</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    Upload the signature image and set the name and title printed under it on every certificate.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{flash.success}</div>
            ) : null}
            {flash.error ? (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flash.error}</div>
            ) : null}
            {migrations_missing ? (
                <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    Run <code className="font-mono">php artisan migrate</code> to enable this feature.
                </div>
            ) : null}

            <form onSubmit={submit} className="surface-card space-y-4 p-8">
                <FormErrors errors={form.errors} />

                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live preview</p>
                    <div className="mx-auto mt-3 flex h-20 items-end justify-center">
                        {shown ? (
                            <img src={shown} alt="Signature preview" className="max-h-20 max-w-[220px] object-contain mix-blend-multiply" />
                        ) : (
                            <span className="font-serif text-2xl font-bold italic text-[#004101]">{form.data.signer_name}</span>
                        )}
                    </div>
                    <div className="mx-auto mb-1 h-0.5 w-40 bg-slate-400/80"></div>
                    <p className="text-sm font-bold text-slate-900">{form.data.signer_name}</p>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{form.data.signer_title}</p>
                    <p className="text-[10px] font-semibold text-emerald-800">{form.data.organization}</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Signature image</label>
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="input-modern" />
                    <p className="mt-1 text-xs text-slate-400">PNG with a transparent background works best. Max 3 MB.</p>
                    {settings?.signature_url ? (
                        <button type="button" onClick={removeSignature} className="mt-2 text-sm font-semibold text-red-600 hover:underline">
                            Remove current signature
                        </button>
                    ) : null}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
                    <input className="input-modern" value={form.data.signer_name} onChange={(e) => form.setData('signer_name', e.target.value)} />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Title</label>
                    <input className="input-modern" value={form.data.signer_title} onChange={(e) => form.setData('signer_title', e.target.value)} />
                </div>
                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Organization</label>
                    <input className="input-modern" value={form.data.organization} onChange={(e) => form.setData('organization', e.target.value)} />
                </div>

                <button type="submit" disabled={form.processing || migrations_missing} className="btn-primary">
                    {form.processing ? 'Saving…' : 'Save signature'}
                </button>
            </form>
        </AdminLayout>
    );
}
