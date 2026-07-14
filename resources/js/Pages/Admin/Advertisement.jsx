import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function AdvertisementIndex({ advertisement = null, migrations_missing = false, auth }) {
    const form = useForm({ title: advertisement?.title || '', video: null, start_at: advertisement?.start_at || '', end_at: advertisement?.end_at || '' });

    function handleSubmit(e) {
        e.preventDefault();
        form.post(route('admin.advertisement.store'), {
            forceFormData: true,
            onSuccess: () => {
                form.reset('video');
            }
        });
    }

    function handleDelete() {
        if (!advertisement) return;
        if (!confirm('Remove the current homepage advertisement?')) return;
        router.delete(route('admin.advertisement.destroy', advertisement.id));
    }

    return (
        <AdminLayout>
            <Head>
                <title>Homepage Promo | Admin</title>
            </Head>

            <div className="surface-card rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Homepage Promo / Advertisement</h2>
                <p className="text-sm text-slate-600 mb-6">Upload a short promo video to show on the homepage. Uploading a new video replaces the existing one.</p>

                {migrations_missing ? (
                    <div className="mb-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800">
                        The advertisements table does not exist yet. Please run <code className="font-mono">php artisan migrate</code> to enable this feature.
                    </div>
                ) : null}

                {advertisement ? (
                    <div className="mb-6">
                        <div className="mb-2 text-sm font-semibold">Current Promo</div>
                        <div className="rounded-lg overflow-hidden border bg-slate-50">
                            <video
                                src={`/storage/${advertisement.video_path}`}
                                controls
                                muted
                                loop
                                playsInline
                                className="w-full h-64 object-cover"
                            />
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                            <button onClick={handleDelete} className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 border border-rose-200">Remove</button>
                            <div className="text-sm text-slate-500">Title: <span className="font-medium text-slate-700">{advertisement.title || '—'}</span></div>
                        </div>
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Video (mp4, webm, mov)</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => form.setData('video', e.target.files[0])}
                            className="w-full rounded-lg border p-2"
                        />
                        {form.errors.video && <div className="text-rose-600 text-sm mt-1">{form.errors.video}</div>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Title (optional)</label>
                        <input
                            type="text"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            className="w-full rounded-lg border p-2"
                        />
                        {form.errors.title && <div className="text-rose-600 text-sm mt-1">{form.errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start (optional)</label>
                            <input
                                type="datetime-local"
                                value={form.data.start_at}
                                onChange={(e) => form.setData('start_at', e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                            {form.errors.start_at && <div className="text-rose-600 text-sm mt-1">{form.errors.start_at}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End (optional)</label>
                            <input
                                type="datetime-local"
                                value={form.data.end_at}
                                onChange={(e) => form.setData('end_at', e.target.value)}
                                className="w-full rounded-lg border p-2"
                            />
                            {form.errors.end_at && <div className="text-rose-600 text-sm mt-1">{form.errors.end_at}</div>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" className="rounded-2xl bg-copper-600 px-4 py-2 text-sm font-semibold text-white">Upload / Replace</button>
                        <div className="text-sm text-slate-500">Max size: 50MB</div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
