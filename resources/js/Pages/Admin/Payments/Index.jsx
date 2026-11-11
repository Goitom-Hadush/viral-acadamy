import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useForm } from '@inertiajs/react';
import { memo, useMemo, useState } from 'react';

const receiptUrl = (path) => `/media/${path}`;
const money = (v) => Number(v || 0).toLocaleString();
const when = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—');

function waitingLabel(iso) {
    if (!iso) return '';
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 60) return `${mins}m waiting`;
    const hrs = Math.round(mins / 60);
    if (hrs < 48) return `${hrs}h waiting`;
    return `${Math.round(hrs / 24)}d waiting`;
}

function Price({ etb, usd }) {
    return (
        <div className="flex flex-col items-start gap-1">
            <span className="rounded-full bg-[#f6e7b4] px-2.5 py-0.5 text-xs font-extrabold text-[#3b2d08]">{money(etb)} ETB</span>
            {Number(usd) > 0 && (
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-extrabold text-amber-200">${money(usd)} USD</span>
            )}
        </div>
    );
}

const ReceiptThumb = memo(function ReceiptThumb({ path, onOpen }) {
    if (!path) {
        return <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-400">No file</div>;
    }
    return (
        <button
            type="button"
            onClick={() => onOpen(path)}
            className="block h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 transition hover:ring-2 hover:ring-copper-400"
            title="View receipt"
        >
            <img src={receiptUrl(path)} alt="Receipt" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </button>
    );
});

function Referral({ payment }) {
    if (!payment.referral_code) return <span className="text-slate-300">—</span>;
    return (
        <div className="text-xs">
            <span className="rounded border border-amber-300 bg-amber-100 px-1.5 py-0.5 font-mono font-bold text-amber-900">{payment.referral_code}</span>
            {payment.referrer?.name && <p className="mt-1 truncate text-slate-500" title={payment.referrer.email}>by {payment.referrer.name}</p>}
        </div>
    );
}

export default function PaymentIndex({ payments = [], verified = [] }) {
    const [tab, setTab] = useState('pending');
    const [query, setQuery] = useState('');
    const [verifyTarget, setVerifyTarget] = useState(null);
    const [preview, setPreview] = useState(null);
    const form = useForm({ transaction_id: '' });

    const rows = tab === 'pending' ? payments : verified;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((p) =>
            [p.user?.name, p.user?.email, p.user?.phone, p.course?.title, p.transaction_id, p.referral_code]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q))
        );
    }, [rows, query]);

    const openVerify = (payment) => {
        form.reset();
        form.clearErrors();
        setVerifyTarget(payment);
    };

    const closeVerify = () => {
        if (form.processing) return;
        setVerifyTarget(null);
        form.reset();
        form.clearErrors();
    };

    const submitVerify = (e) => {
        e.preventDefault();
        if (!verifyTarget) return;
        form.post(route('admin.payments.approve', verifyTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyTarget(null);
                form.reset();
            },
        });
    };

    const isPending = tab === 'pending';

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Payments</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Check each receipt, enter its transaction ID and unlock the course.
                    </p>
                </div>
                <Link
                    href={route('admin.payment-settings.index')}
                    className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 sm:self-auto"
                >
                    💳 Payment accounts
                </Link>
            </div>

            {/* Toolbar: tabs + search */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex rounded-xl bg-slate-100 p-1" role="tablist">
                    {[
                        { id: 'pending', label: 'Pending', count: payments.length },
                        { id: 'verified', label: 'Verified', count: verified.length },
                    ].map((t) => (
                        <button
                            key={t.id}
                            role="tab"
                            aria-selected={tab === t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                                tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {t.label}
                            <span className={`min-w-[1.4rem] rounded-full px-1.5 py-0.5 text-center text-[11px] font-black ${
                                t.id === 'pending' && t.count > 0 ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                                {t.count}
                            </span>
                        </button>
                    ))}
                </div>

                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search student, course, transaction ID…"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-copper-500 focus:ring-copper-500 sm:w-80"
                    aria-label="Search payments"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <p className="text-4xl">{isPending ? '✅' : '🧾'}</p>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">
                            {query ? 'No matches' : isPending ? 'No pending payments' : 'No verified payments yet'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {query ? 'Try a different search.' : isPending ? 'All receipts have been processed.' : 'Verified payments will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Receipt</th>
                                    <th className="px-4 py-3">Student</th>
                                    <th className="px-4 py-3">Course</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Referral</th>
                                    <th className="px-4 py-3">{isPending ? 'Submitted' : 'Transaction ID'}</th>
                                    <th className="px-4 py-3 text-right">{isPending ? 'Action' : 'Verified'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="align-middle hover:bg-slate-50/70">
                                        <td className="px-4 py-3"><ReceiptThumb path={p.receipt_image} onOpen={setPreview} /></td>

                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-900">{p.user?.name ?? 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{p.user?.email}</p>
                                            {p.user?.phone && <p className="text-xs text-slate-400">{p.user.phone}</p>}
                                        </td>

                                        <td className="max-w-[220px] px-4 py-3">
                                            <p className="line-clamp-2 font-semibold text-slate-800">{p.course?.title ?? 'Unknown course'}</p>
                                        </td>

                                        <td className="px-4 py-3"><Price etb={p.amount} usd={p.course?.price_usd} /></td>

                                        <td className="px-4 py-3"><Referral payment={p} /></td>

                                        {isPending ? (
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <p className="text-xs font-semibold text-slate-700">{when(p.created_at)}</p>
                                                <p className="text-[11px] font-bold text-amber-600">{waitingLabel(p.created_at)}</p>
                                            </td>
                                        ) : (
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs font-bold text-slate-800">{p.transaction_id}</span>
                                            </td>
                                        )}

                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            {isPending ? (
                                                <button type="button" onClick={() => openVerify(p)} className="rounded-xl bg-[#004101] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#003301]">
                                                    Verify & unlock
                                                </button>
                                            ) : (
                                                <div>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">✓ Verified</span>
                                                    <p className="mt-1 text-[11px] text-slate-400">{when(p.updated_at)}</p>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Receipt preview */}
            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreview(null)}>
                    <div className="relative max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
                        <img src={receiptUrl(preview)} alt="Receipt" className="max-h-[85vh] rounded-xl bg-white object-contain shadow-2xl" />
                        <div className="mt-3 flex justify-center gap-3">
                            <a href={receiptUrl(preview)} target="_blank" rel="noreferrer" className="rounded-lg bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-white">Open full size</a>
                            <button type="button" onClick={() => setPreview(null)} className="rounded-lg bg-white/20 px-4 py-2 text-xs font-bold text-white hover:bg-white/30">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify modal: transaction ID is required */}
            {verifyTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={closeVerify}>
                    <form onSubmit={submitVerify} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                        <h3 className="text-xl font-extrabold text-slate-900">Verify payment</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {verifyTarget.user?.name} • {verifyTarget.course?.title} • {money(verifyTarget.amount)} ETB
                        </p>

                        {verifyTarget.receipt_image && (
                            <img src={receiptUrl(verifyTarget.receipt_image)} alt="Receipt" className="mt-4 max-h-48 w-full rounded-xl border border-slate-200 object-contain" />
                        )}

                        <label htmlFor="transaction_id" className="mt-5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                            Transaction ID <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="transaction_id"
                            type="text"
                            autoFocus
                            autoComplete="off"
                            value={form.data.transaction_id}
                            onChange={(e) => form.setData('transaction_id', e.target.value)}
                            placeholder="e.g. FT26314ABCD or Telebirr ref"
                            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 font-mono text-sm font-bold uppercase text-slate-900 focus:ring-2 ${
                                form.errors.transaction_id ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-300 focus:border-copper-600 focus:ring-copper-200'
                            }`}
                        />
                        {form.errors.transaction_id ? (
                            <p role="alert" className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
                                {form.errors.transaction_id}
                            </p>
                        ) : (
                            <p className="mt-1.5 text-xs text-slate-400">Copy it from the receipt. It is checked against every verified payment before the student is unlocked.</p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={closeVerify} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={form.processing || !form.data.transaction_id.trim()} className="btn-primary disabled:opacity-60">
                                {form.processing ? 'Checking…' : 'Verify & Unlock'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}
