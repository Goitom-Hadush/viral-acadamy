import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import UploadProgress, { uploadingLabel, useUploadProgress } from '@/Components/UploadProgress';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function AppDownloadsIndex({ appDownload = null, migrations_missing = false }) {
    const { flash = {} } = usePage().props;
    const { progress, start, finish, onProgress } = useUploadProgress();

    const form = useForm({
        title: appDownload?.title || 'Get the Success Life Coaching Academy app',
        android_version: appDownload?.android_version || '',
        ios_version: appDownload?.ios_version || '',
        android_store_url: appDownload?.android_store_url || '',
        ios_store_url: appDownload?.ios_store_url || '',
        android_file: null,
        ios_file: null,
        remove_android: false,
        remove_ios: false,
        is_active: appDownload?.is_active !== false,
    });

    const submit = (e) => {
        e.preventDefault();
        start();
        form.post(route('admin.apps.update'), {
            forceFormData: true,
            onProgress,
            onSuccess: finish,
            onError: finish,
        });
    };

    return (
        <AdminLayout>
            <Head title="App Downloads | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Homepage</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Android & iOS Apps</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    Upload the Success Life Coaching Academy app files so visitors can download and install them above the sponsor logos.
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{flash.success}</div>
            ) : null}

            {migrations_missing ? (
                <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    Run <code className="font-mono">php artisan migrate</code> first.
                </div>
            ) : null}

            <form onSubmit={submit} encType="multipart/form-data" className="surface-card space-y-6 p-8">
                <FormErrors errors={form.errors} />

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Section title</label>
                    <input
                        className="input-modern"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder="Get the Success Life Coaching Academy app"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Android */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                        <h3 className="text-lg font-black text-slate-900">Android (.apk)</h3>
                        <p className="mt-1 text-xs text-slate-500">Visitors download and install on Android phones.</p>

                        {appDownload?.android_path && !form.data.remove_android ? (
                            <div className="mt-3 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700">
                                Current: <span className="font-semibold">{appDownload.android_original_name || 'Android app'}</span>
                            </div>
                        ) : null}

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Upload APK</label>
                                <input
                                    type="file"
                                    accept=".apk,application/vnd.android.package-archive"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                                    onChange={(e) => form.setData('android_file', e.target.files[0] || null)}
                                />
                                {form.data.android_file ? (
                                    <p className="mt-1 text-xs font-medium text-slate-600">Selected: {form.data.android_file.name}</p>
                                ) : null}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Version (optional)</label>
                                <input className="input-modern" value={form.data.android_version} onChange={(e) => form.setData('android_version', e.target.value)} placeholder="1.0.0" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Play Store link (optional)</label>
                                <input className="input-modern" type="url" value={form.data.android_store_url} onChange={(e) => form.setData('android_store_url', e.target.value)} placeholder="https://play.google.com/..." />
                            </div>
                            {appDownload?.android_path ? (
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <input type="checkbox" checked={!!form.data.remove_android} onChange={(e) => form.setData('remove_android', e.target.checked)} />
                                    Remove current Android file
                                </label>
                            ) : null}
                        </div>
                    </div>

                    {/* iOS */}
                    <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
                        <h3 className="text-lg font-black text-slate-900">iOS (.ipa)</h3>
                        <p className="mt-1 text-xs text-slate-500">Upload IPA and/or App Store link for iPhone users.</p>

                        {appDownload?.ios_path && !form.data.remove_ios ? (
                            <div className="mt-3 rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700">
                                Current: <span className="font-semibold">{appDownload.ios_original_name || 'iOS app'}</span>
                            </div>
                        ) : null}

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Upload IPA</label>
                                <input
                                    type="file"
                                    accept=".ipa"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                                    onChange={(e) => form.setData('ios_file', e.target.files[0] || null)}
                                />
                                {form.data.ios_file ? (
                                    <p className="mt-1 text-xs font-medium text-slate-600">Selected: {form.data.ios_file.name}</p>
                                ) : null}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">Version (optional)</label>
                                <input className="input-modern" value={form.data.ios_version} onChange={(e) => form.setData('ios_version', e.target.value)} placeholder="1.0.0" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-slate-700">App Store link (optional)</label>
                                <input className="input-modern" type="url" value={form.data.ios_store_url} onChange={(e) => form.setData('ios_store_url', e.target.value)} placeholder="https://apps.apple.com/..." />
                            </div>
                            {appDownload?.ios_path ? (
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <input type="checkbox" checked={!!form.data.remove_ios} onChange={(e) => form.setData('remove_ios', e.target.checked)} />
                                    Remove current iOS file
                                </label>
                            ) : null}
                        </div>
                    </div>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={!!form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                    Show download buttons on homepage
                </label>

                <UploadProgress show={form.processing} progress={progress} label="Uploading app files…" />

                <button type="submit" disabled={form.processing || migrations_missing} className="btn-primary">
                    {uploadingLabel(form.processing, progress, 'Save app downloads')}
                </button>
            </form>
        </AdminLayout>
    );
}
