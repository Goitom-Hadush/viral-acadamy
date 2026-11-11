import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function AnnouncementIndex({ announcement = null, migrations_missing = false }) {
    const { flash = {} } = usePage().props;
    const form = useForm({
        badge: announcement?.badge || 'Enrollment Open',
        title: announcement?.title || 'Success Life Coaching Academy enrollment is now open!',
        subtitle: announcement?.subtitle || 'Secure your spot today and start building your income',
        cta_url: announcement?.cta_url || '/register',
        telegram_url: announcement?.telegram_url || '',
        phone: announcement?.phone || '',
        is_active: announcement?.is_active !== false,
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(route('admin.announcement.update'));
    };

    return (
        <AdminLayout>
            <Head title="Homepage Announcement | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Homepage</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">Enrollment Announcement</h1>
                <p className="mt-3 max-w-2xl text-copper-100">
                    Control the banner text, How button, Telegram, and phone on the homepage. The How button label follows the site language (English / Amharic / Tigrinya).
                </p>
            </div>

            {flash.success ? (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{flash.success}</div>
            ) : null}

            {migrations_missing ? (
                <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    Run <code className="font-mono">php artisan migrate</code> to enable this feature.
                </div>
            ) : null}

            <form onSubmit={submit} className="surface-card space-y-4 p-8">
                <FormErrors errors={form.errors} />

                <div className="rounded-2xl bg-gradient-to-r from-[#004101] to-[#003301] p-4 text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Live preview</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {form.data.badge || 'Notice'}
                    </span>
                    <p className="mt-2 text-sm font-black">{form.data.title || 'Your headline appears here'}</p>
                    {form.data.subtitle ? <p className="mt-0.5 text-xs font-semibold text-amber-200">{form.data.subtitle}</p> : null}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Badge label</label>
                    <input className="input-modern" maxLength={60} value={form.data.badge} onChange={(e) => form.setData('badge', e.target.value)} placeholder="Enrollment Open" />
                    <p className="mt-1 text-xs text-slate-400">Small pill shown before the headline, e.g. Enrollment Open, New Seminar, Notice.</p>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Headline</label>
                    <input className="input-modern" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="Success Life Coaching Academy enrollment is now open!" />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Subtitle</label>
                    <input className="input-modern" value={form.data.subtitle} onChange={(e) => form.setData('subtitle', e.target.value)} placeholder="Secure your spot today and start building your income" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">How button link</label>
                        <input className="input-modern" value={form.data.cta_url} onChange={(e) => form.setData('cta_url', e.target.value)} placeholder="/register or https://..." />
                        <p className="mt-1 text-xs text-slate-400">Button text is automatic: How? / እንዴት? / ከመይ?</p>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Telegram URL</label>
                        <input className="input-modern" value={form.data.telegram_url} onChange={(e) => form.setData('telegram_url', e.target.value)} placeholder="https://t.me/SuccessLifeCoachingAcademy" />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</label>
                    <input className="input-modern" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} placeholder="+2519..." />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={!!form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} />
                    Show on homepage
                </label>

                <button type="submit" disabled={form.processing || migrations_missing} className="btn-primary">
                    {form.processing ? 'Saving…' : 'Save announcement'}
                </button>
            </form>
        </AdminLayout>
    );
}
