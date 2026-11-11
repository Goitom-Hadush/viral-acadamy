import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, usePage } from '@inertiajs/react';

const BADGE_PRESETS = ['Enrollment Open', 'New Course', 'New Seminar', 'Limited Seats', 'Notice'];
const BUTTON_LABELS = [
    ['EN', 'How?'],
    ['አማ', 'እንዴት?'],
    ['ትግ', 'ከመይ?'],
];

function Field({ label, hint, error, counter, children, htmlFor }) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
                {counter && <span className="text-[11px] text-slate-400">{counter}</span>}
            </div>
            {children}
            {error ? <p className="mt-1 text-xs font-medium text-rose-600">{error}</p> : hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
    );
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 transition focus:border-copper-600 focus:ring-2 focus:ring-copper-200';

// Same look as the banner on the homepage, so what you see is what visitors get.
function BannerPreview({ data }) {
    const off = !data.is_active;
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003301] via-[#004101] to-[#006b02] p-5 text-center text-white shadow-lg transition ${off ? 'opacity-50 grayscale' : ''}`}>
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <span className="relative inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                {data.badge || 'Notice'}
            </span>
            <p className="relative mt-3 text-base font-black leading-snug sm:text-lg">{data.title || 'Your headline appears here'}</p>
            {data.subtitle && <p className="relative mt-1 text-sm font-semibold text-amber-200">{data.subtitle}</p>}

            <div className="relative mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="rounded-full bg-white px-4 py-1.5 text-xs font-black text-[#004101] shadow">How? →</span>
                {data.telegram_url && <span className="rounded-full bg-sky-500/90 px-3 py-1.5 text-xs font-bold">✈ Telegram</span>}
                {data.phone && <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">📞 {data.phone}</span>}
            </div>

            {off && <p className="relative mt-3 text-[11px] font-bold uppercase tracking-widest text-amber-300">Hidden from the homepage</p>}
        </div>
    );
}

export default function AnnouncementIndex({ announcement = null, migrations_missing = false }) {
    const { flash = {} } = usePage().props;

    const { data, setData, put, processing, errors, isDirty, reset } = useForm({
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
        put(route('admin.announcement.update'), { preserveScroll: true });
    };

    const set = (key) => (e) => setData(key, e.target.value);

    return (
        <AdminLayout>
            <Head title="Homepage Announcement | Admin" />

            <form onSubmit={submit} className="pb-24">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Homepage announcement</h2>
                        <p className="mt-1 text-sm text-slate-500">The banner at the top of the homepage. Changes go live as soon as you save.</p>
                    </div>

                    {/* Show / hide switch */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={data.is_active}
                        onClick={() => setData('is_active', !data.is_active)}
                        className={`inline-flex items-center gap-3 self-start rounded-full border px-3 py-2 text-sm font-bold transition sm:self-auto ${
                            data.is_active ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}
                    >
                        <span className={`relative h-6 w-11 rounded-full transition ${data.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${data.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                        </span>
                        {data.is_active ? 'Showing on homepage' : 'Hidden'}
                    </button>
                </div>

                {flash.success && (
                    <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <span aria-hidden="true">✓</span> {flash.success}
                    </div>
                )}
                {migrations_missing && (
                    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Run <code className="font-mono">php artisan migrate</code> to enable this feature.
                    </div>
                )}
                <FormErrors errors={errors} />

                <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                    {/* Form */}
                    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <Field label="Badge" htmlFor="badge" error={errors.badge}>
                            <input id="badge" className={inputCls} maxLength={60} value={data.badge} onChange={set('badge')} placeholder="Enrollment Open" />
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {BADGE_PRESETS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setData('badge', p)}
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${data.badge === p ? 'bg-[#004101] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <Field label="Headline" htmlFor="title" error={errors.title} counter={`${data.title.length}/255`}>
                            <input id="title" className={inputCls} maxLength={255} value={data.title} onChange={set('title')} placeholder="Success Life Coaching Academy enrollment is now open!" />
                        </Field>

                        <Field label="Subtitle" htmlFor="subtitle" error={errors.subtitle} counter={`${data.subtitle.length}/255`}>
                            <input id="subtitle" className={inputCls} maxLength={255} value={data.subtitle} onChange={set('subtitle')} placeholder="Secure your spot today and start building your income" />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Button link" htmlFor="cta" error={errors.cta_url} hint="A page like /register or a full https:// link.">
                                <input id="cta" className={inputCls} value={data.cta_url} onChange={set('cta_url')} placeholder="/register" />
                            </Field>
                            <Field label="Telegram link" htmlFor="telegram" error={errors.telegram_url}>
                                <input id="telegram" className={inputCls} value={data.telegram_url} onChange={set('telegram_url')} placeholder="https://t.me/…" />
                            </Field>
                        </div>

                        <Field label="Phone" htmlFor="phone" error={errors.phone}>
                            <input id="phone" className={inputCls} value={data.phone} onChange={set('phone')} placeholder="+2519…" inputMode="tel" />
                        </Field>
                    </div>

                    {/* Live preview */}
                    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Live preview</p>
                            <BannerPreview data={data} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Button text follows the visitor’s language</p>
                            <div className="grid grid-cols-3 gap-2">
                                {BUTTON_LABELS.map(([lang, label]) => (
                                    <div key={lang} className="rounded-xl bg-slate-50 p-3 text-center">
                                        <p className="text-[10px] font-bold text-slate-400">{lang}</p>
                                        <p className="mt-0.5 text-sm font-black text-[#004101]">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Sticky save bar (only when something changed) */}
                <div
                    className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 lg:left-72 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}
                    aria-hidden={!isDirty}
                >
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Unsaved changes
                        </p>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => reset()} disabled={processing} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Discard
                            </button>
                            <button type="submit" disabled={processing || migrations_missing || !data.title.trim()} className="btn-primary disabled:opacity-60">
                                {processing ? 'Saving…' : 'Save announcement'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
