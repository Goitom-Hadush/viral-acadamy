import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, usePage } from '@inertiajs/react';
import { memo, useState } from 'react';

const THEMES = {
    bank: { grad: 'from-[#003301] to-[#006b02]', chip: 'bg-emerald-100 text-emerald-800', ring: 'focus:border-emerald-600 focus:ring-emerald-200' },
    telebirr: { grad: 'from-sky-700 to-indigo-700', chip: 'bg-sky-100 text-sky-800', ring: 'focus:border-sky-600 focus:ring-sky-200' },
    usd: { grad: 'from-amber-500 to-orange-600', chip: 'bg-amber-100 text-amber-800', ring: 'focus:border-amber-500 focus:ring-amber-200' },
};

// A single labelled input (kept tiny so each account form stays easy to read).
function Field({ label, required, error, mono, theme, ...props }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input
                {...props}
                required={required}
                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 transition focus:ring-2 ${mono ? 'font-mono' : ''} ${
                    error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : `border-slate-300 ${THEMES[theme].ring}`
                }`}
            />
            {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
        </div>
    );
}

// Looks like the card students see at checkout.
const PreviewCard = memo(function PreviewCard({ theme, badge, title, number, owner, copied, onCopy }) {
    const empty = !number;
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${THEMES[theme].grad} p-5 text-white shadow-lg`}>
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-white/5" />
            <div className="relative">
                <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">{badge}</span>
                    <button
                        type="button"
                        onClick={onCopy}
                        disabled={empty}
                        className="rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold hover:bg-white/30 disabled:opacity-40"
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
                <p className="mt-4 truncate text-xs font-semibold text-white/80">{title || 'Bank name'}</p>
                <p className="mt-0.5 break-all font-mono text-xl font-black tracking-wider sm:text-2xl">{number || '•••• •••• ••••'}</p>
                <p className="mt-3 text-xs text-white/80">
                    Account holder: <span className="font-bold text-white">{owner || '—'}</span>
                </p>
            </div>
        </div>
    );
});

function AccountSection({ theme, icon, title, hint, tag, children, preview }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${THEMES[theme].grad} text-lg text-white shadow`}>{icon}</span>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
                    <p className="truncate text-xs text-slate-500">{hint}</p>
                </div>
                {tag && <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${THEMES[theme].chip}`}>{tag}</span>}
            </header>
            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">
                <div className="space-y-4">{children}</div>
                <div className="lg:pt-1">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">What students see</p>
                    {preview}
                </div>
            </div>
        </section>
    );
}

export default function PaymentSettingsIndex({ settings = {} }) {
    const { flash } = usePage().props;
    const initial = {
        bank_name: settings.bank_name || '',
        bank_account_name: settings.bank_account_name || '',
        bank_account_number: settings.bank_account_number || '',
        telebirr_phone: settings.telebirr_phone || '',
        telebirr_name: settings.telebirr_name || '',
        dollar_bank_name: settings.dollar_bank_name || '',
        dollar_account_name: settings.dollar_account_name || '',
        dollar_account_number: settings.dollar_account_number || '',
        instructions: settings.instructions || '',
    };

    const { data, setData, post, processing, errors, isDirty, reset } = useForm(initial);
    const [copied, setCopied] = useState(null);

    const copy = (value, key) => {
        if (!value) return;
        navigator.clipboard?.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 1800);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.payment-settings.update'), { preserveScroll: true });
    };

    const set = (key) => (e) => setData(key, e.target.value);

    const usdFilled = [data.dollar_bank_name, data.dollar_account_name, data.dollar_account_number].filter((v) => v.trim()).length;
    const usdActive = usdFilled === 3;

    return (
        <AdminLayout>
            <Head title="Payment Accounts | Admin" />

            <form onSubmit={submit} className="pb-24">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Payment accounts</h2>
                        <p className="mt-1 text-sm text-slate-500">Where students send their payment. Changes appear instantly on the homepage and at checkout.</p>
                    </div>
                    <span className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:self-auto">
                        🔒 Admin only
                    </span>
                </div>

                {flash?.success && (
                    <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                        <span aria-hidden="true">✓</span> {flash.success}
                    </div>
                )}
                <FormErrors errors={errors} />

                <div className="space-y-5">
                    {/* Bank (ETB) */}
                    <AccountSection
                        theme="bank"
                        icon="🏦"
                        title="Bank account"
                        hint="Local bank transfer or branch deposit"
                        tag="Birr · ETB"
                        preview={
                            <PreviewCard
                                theme="bank"
                                badge="🇪🇹 Local · Birr"
                                title={data.bank_name}
                                number={data.bank_account_number}
                                owner={data.bank_account_name}
                                copied={copied === 'bank'}
                                onCopy={() => copy(data.bank_account_number, 'bank')}
                            />
                        }
                    >
                        <Field theme="bank" label="Bank name" required value={data.bank_name} onChange={set('bank_name')} placeholder="e.g. Commercial Bank of Ethiopia (CBE)" error={errors.bank_name} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field theme="bank" label="Book owner" required value={data.bank_account_name} onChange={set('bank_account_name')} placeholder="Account holder name" error={errors.bank_account_name} />
                            <Field theme="bank" label="Book number" required mono value={data.bank_account_number} onChange={set('bank_account_number')} placeholder="e.g. 10000125544" error={errors.bank_account_number} />
                        </div>
                    </AccountSection>

                    {/* Telebirr */}
                    <AccountSection
                        theme="telebirr"
                        icon="📱"
                        title="Telebirr"
                        hint="Instant mobile-wallet transfer"
                        tag="Birr · ETB"
                        preview={
                            <PreviewCard
                                theme="telebirr"
                                badge="🇪🇹 Local · Birr"
                                title="Telebirr Mobile Wallet"
                                number={data.telebirr_phone}
                                owner={data.telebirr_name}
                                copied={copied === 'tele'}
                                onCopy={() => copy(data.telebirr_phone, 'tele')}
                            />
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field theme="telebirr" label="Phone number" required mono value={data.telebirr_phone} onChange={set('telebirr_phone')} placeholder="09XXXXXXXX" error={errors.telebirr_phone} />
                            <Field theme="telebirr" label="Account name" required value={data.telebirr_name} onChange={set('telebirr_name')} placeholder="Name on the wallet" error={errors.telebirr_name} />
                        </div>
                    </AccountSection>

                    {/* Dollar */}
                    <AccountSection
                        theme="usd"
                        icon="$"
                        title="Dollar account"
                        hint={usdActive ? 'Shown to students paying from abroad' : 'Optional · fill all three fields to show it'}
                        tag={usdActive ? 'Visible' : 'Hidden'}
                        preview={
                            <PreviewCard
                                theme="usd"
                                badge="🌍 Diaspora · USD"
                                title={data.dollar_bank_name}
                                number={data.dollar_account_number}
                                owner={data.dollar_account_name}
                                copied={copied === 'usd'}
                                onCopy={() => copy(data.dollar_account_number, 'usd')}
                            />
                        }
                    >
                        <Field theme="usd" label="Bank name" value={data.dollar_bank_name} onChange={set('dollar_bank_name')} placeholder="e.g. Bank of Abyssinia (USD)" error={errors.dollar_bank_name} />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field theme="usd" label="Book owner" value={data.dollar_account_name} onChange={set('dollar_account_name')} placeholder="Account holder name" error={errors.dollar_account_name} />
                            <Field theme="usd" label="Book number" mono value={data.dollar_account_number} onChange={set('dollar_account_number')} placeholder="Dollar account number" error={errors.dollar_account_number} />
                        </div>
                        {usdFilled > 0 && usdFilled < 3 && (
                            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Fill all three fields, or clear them, to save.</p>
                        )}
                    </AccountSection>

                    {/* Instructions */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <label htmlFor="instructions" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Checkout note for students <span className="font-normal normal-case text-slate-400">(optional)</span>
                        </label>
                        <textarea
                            id="instructions"
                            rows={3}
                            maxLength={1000}
                            value={data.instructions}
                            onChange={set('instructions')}
                            placeholder="Shown under the payment boxes, e.g. send the exact amount, then upload your receipt."
                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-copper-600 focus:ring-2 focus:ring-copper-200"
                        />
                        <p className="mt-1 text-right text-[11px] text-slate-400">{data.instructions.length}/1000</p>
                    </section>
                </div>

                {/* Sticky save bar: appears only when something changed */}
                <div
                    className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur transition-transform duration-300 lg:left-72 ${
                        isDirty ? 'translate-y-0' : 'translate-y-full'
                    }`}
                    aria-hidden={!isDirty}
                >
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> You have unsaved changes
                        </p>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => reset()} disabled={processing} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Discard
                            </button>
                            <button type="submit" disabled={processing || !isDirty} className="btn-primary disabled:opacity-60">
                                {processing ? 'Saving…' : 'Save & publish'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
