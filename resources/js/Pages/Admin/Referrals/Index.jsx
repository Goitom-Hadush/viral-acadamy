import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { memo, useState } from 'react';

const money = (v) => Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (iso) => (iso ? new Date(iso).toLocaleDateString([], { dateStyle: 'medium' }) : '—');

const STATUS = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500 animate-pulse' },
    approved: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', cls: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
    credited: { label: 'Credited', cls: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
};

const METHODS = {
    telebirr: { label: 'Telebirr', icon: '📱', cls: 'bg-sky-50 text-sky-800 border-sky-200' },
    cbe: { label: 'CBE Bank', icon: '🏦', cls: 'bg-purple-50 text-purple-800 border-purple-200' },
};

function Badge({ status }) {
    const s = STATUS[status] || STATUS.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${s.cls}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
        </span>
    );
}

function Stat({ icon, label, value, unit = 'ETB', hint, tone }) {
    const tones = {
        green: 'from-emerald-500 to-emerald-700',
        amber: 'from-amber-400 to-orange-500',
        sky: 'from-sky-500 to-indigo-600',
        violet: 'from-violet-500 to-fuchsia-600',
    };
    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tones[tone]} text-lg text-white shadow`}>{icon}</span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">
                {value} {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
            </p>
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
    );
}

const CashOutRow = memo(function CashOutRow({ req, onAction }) {
    const method = METHODS[req.payout_method] || { label: req.bank_name || 'Bank', icon: '🏛️', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    return (
        <tr className="align-middle hover:bg-slate-50/70">
            <td className="px-4 py-3">
                <p className="text-sm font-bold text-slate-900">{req.user?.name || 'Student'}</p>
                <p className="text-xs text-slate-500">{req.user?.email}</p>
            </td>
            <td className="whitespace-nowrap px-4 py-3">
                <p className="font-mono text-base font-black text-slate-900">{money(req.amount)} <span className="text-[10px] font-bold text-slate-400">ETB</span></p>
                <p className="text-[11px] text-slate-400">{day(req.created_at)}</p>
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-extrabold ${method.cls}`}>{method.icon} {method.label}</span>
            </td>
            <td className="px-4 py-3">
                <p className="select-all font-mono text-xs font-bold text-slate-900">{req.account_number}</p>
                <p className="text-[11px] text-slate-500">{req.account_name}</p>
                {req.student_notes && <p className="mt-0.5 max-w-[200px] truncate text-[11px] italic text-slate-400" title={req.student_notes}>“{req.student_notes}”</p>}
            </td>
            <td className="px-4 py-3">
                <Badge status={req.status} />
                {req.transaction_reference && <p className="mt-1 font-mono text-[10px] font-bold text-emerald-700">Txn {req.transaction_reference}</p>}
                {req.admin_notes && <p className="mt-0.5 max-w-[180px] truncate text-[11px] text-slate-500" title={req.admin_notes}>{req.admin_notes}</p>}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
                {req.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => onAction(req, 'approve')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm hover:bg-emerald-700">✓ Pay</button>
                        <button type="button" onClick={() => onAction(req, 'reject')} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100">✕</button>
                    </div>
                ) : (
                    <span className="text-[11px] text-slate-400">Done</span>
                )}
            </td>
        </tr>
    );
});

function Empty({ icon, title, text }) {
    return (
        <div className="px-6 py-16 text-center">
            <p className="text-4xl">{icon}</p>
            <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
        </div>
    );
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-copper-600 focus:ring-2 focus:ring-copper-200';

export default function ReferralsIndex({ settings = {}, cashOuts = { data: [] }, metrics = {}, recentEarnings = [], filters = {} }) {
    const { flash = {} } = usePage().props;
    const [tab, setTab] = useState('cashouts');
    const [selected, setSelected] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [loadingFilter, setLoadingFilter] = useState(false);

    const rows = cashOuts?.data || [];
    const status = filters.status || 'all';

    // ── program settings ──
    const sForm = useForm({
        headline: settings.headline || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        reward_type: settings.reward_type || 'fixed',
        reward_value: settings.reward_value ?? 100,
        min_cash_out: settings.min_cash_out ?? 50,
        cash_out_instructions: settings.cash_out_instructions || '',
        is_active: settings.is_active ?? true,
    });
    const setS = (k) => (e) => sForm.setData(k, e.target.value);
    const saveSettings = (e) => {
        e.preventDefault();
        sForm.post(route('admin.referrals.settings.update'), { preserveScroll: true });
    };

    // ── approve / reject ──
    const aForm = useForm({ transaction_reference: '', admin_notes: '' });
    const openAction = (req, type) => {
        aForm.reset();
        aForm.clearErrors();
        setSelected(req);
        setActionType(type);
    };
    const closeAction = () => {
        if (aForm.processing) return;
        setSelected(null);
        setActionType(null);
        aForm.reset();
    };
    const submitAction = (e) => {
        e.preventDefault();
        if (!selected) return;
        const name = actionType === 'approve' ? 'admin.referrals.cash-outs.approve' : 'admin.referrals.cash-outs.reject';
        aForm.post(route(name, selected.id), { preserveScroll: true, onSuccess: () => { setSelected(null); setActionType(null); aForm.reset(); } });
    };

    const filterStatus = (st) => {
        if (st === status) return;
        router.get(route('admin.referrals.index'), { status: st }, {
            preserveState: true,
            preserveScroll: true,
            only: ['cashOuts', 'filters'],
            onStart: () => setLoadingFilter(true),
            onFinish: () => setLoadingFilter(false),
        });
    };

    const goTo = (url) => url && router.get(url, {}, { preserveState: true, preserveScroll: true, only: ['cashOuts', 'filters'] });

    const rewardLabel = settings.reward_type === 'percentage' ? `${settings.reward_value}%` : `${settings.reward_value}`;
    const pending = metrics.pending_requests_count || 0;

    const TABS = [
        { id: 'cashouts', label: 'Cash outs', badge: pending },
        { id: 'earnings', label: 'Activity', badge: 0 },
        { id: 'settings', label: 'Program settings', badge: 0 },
    ];

    return (
        <AdminLayout>
            <Head title="Referrals & Cash Outs | Admin" />

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Referrals & cash outs</h2>
                    <p className="mt-1 text-sm text-slate-500">Reward students who invite friends and pay out their earnings.</p>
                </div>
                <span className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-bold sm:self-auto ${settings.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    <span className={`h-2 w-2 rounded-full ${settings.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    Program {settings.is_active ? 'active' : 'paused'}
                </span>
            </div>

            {flash.success && (
                <div role="status" className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                    <span aria-hidden="true">✓</span> {flash.success}
                </div>
            )}

            {/* Metrics */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Stat tone="green" icon="🎁" label="Bonuses credited" value={money(metrics.total_credited_rewards)} hint={`${metrics.total_referrals_count || 0} referral rewards`} />
                <Stat tone="amber" icon="⏳" label="Awaiting payout" value={money(metrics.pending_cash_outs_total)} hint={`${pending} request${pending === 1 ? '' : 's'}`} />
                <Stat tone="sky" icon="💸" label="Total paid out" value={money(metrics.total_cashed_out)} hint={`${metrics.approved_requests_count || 0} payouts`} />
                <Stat tone="violet" icon="⭐" label="Current reward" value={rewardLabel} unit={settings.reward_type === 'percentage' ? '' : 'ETB'} hint={settings.reward_type === 'percentage' ? 'Percentage of course price' : 'Fixed per enrollment'} />
            </div>

            {/* Tabs */}
            <div className="mb-4 inline-flex max-w-full overflow-x-auto rounded-xl bg-slate-100 p-1" role="tablist">
                {TABS.map((t) => (
                    <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {t.label}
                        {t.badge > 0 && <span className="min-w-[1.3rem] rounded-full bg-rose-500 px-1.5 text-center text-[11px] font-black text-white">{t.badge}</span>}
                    </button>
                ))}
            </div>

            {/* ── Cash outs ── */}
            {tab === 'cashouts' && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                            {['all', 'pending', 'approved', 'rejected'].map((st) => (
                                <button key={st} type="button" onClick={() => filterStatus(st)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${status === st ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'}`}>
                                    {st === 'approved' ? 'paid' : st}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-slate-500">{loadingFilter ? 'Loading…' : `${cashOuts?.total ?? rows.length} request${(cashOuts?.total ?? rows.length) === 1 ? '' : 's'}`}</span>
                    </div>

                    {rows.length === 0 ? (
                        <Empty icon="💸" title="No cash out requests" text={status === 'all' ? 'Requests from students will appear here.' : 'Nothing matches this filter.'} />
                    ) : (
                        <div className={`overflow-x-auto transition-opacity ${loadingFilter ? 'opacity-50' : ''}`}>
                            <table className="w-full min-w-[820px] text-left">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Student</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Method</th>
                                        <th className="px-4 py-3">Account</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((req) => <CashOutRow key={req.id} req={req} onAction={openAction} />)}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(cashOuts?.prev_page_url || cashOuts?.next_page_url) && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
                            <button type="button" disabled={!cashOuts.prev_page_url} onClick={() => goTo(cashOuts.prev_page_url)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">← Previous</button>
                            <span>Page {cashOuts.current_page} of {cashOuts.last_page}</span>
                            <button type="button" disabled={!cashOuts.next_page_url} onClick={() => goTo(cashOuts.next_page_url)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold disabled:opacity-40">Next →</button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Activity ── */}
            {tab === 'earnings' && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {recentEarnings.length === 0 ? (
                        <Empty icon="📊" title="No referral activity yet" text="When a student joins with someone’s code, it shows up here." />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Inviter</th>
                                        <th className="px-4 py-3">Referred student</th>
                                        <th className="px-4 py-3">Course</th>
                                        <th className="px-4 py-3">Reward</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentEarnings.map((e) => (
                                        <tr key={e.id} className="hover:bg-slate-50/70">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-slate-900">{e.referrer?.name || 'Inviter'}</p>
                                                <p className="font-mono text-[11px] font-bold text-copper-700">{e.referrer?.referral_code}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-slate-900">{e.referred_user?.name || 'Student'}</p>
                                                <p className="text-xs text-slate-500">{e.referred_user?.email}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800">{e.course?.title || 'Course'}</p>
                                                <p className="text-[11px] text-slate-400">{money(e.course_price)} ETB</p>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-black text-emerald-700">+{money(e.commission_amount)} ETB</td>
                                            <td className="px-4 py-3"><Badge status={e.status} /></td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{day(e.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Settings ── */}
            {tab === 'settings' && (
                <form onSubmit={saveSettings} className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <FormErrors errors={sForm.errors} />

                    <button
                        type="button"
                        role="switch"
                        aria-checked={sForm.data.is_active}
                        onClick={() => sForm.setData('is_active', !sForm.data.is_active)}
                        className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left"
                    >
                        <span>
                            <span className="block text-sm font-extrabold text-slate-900">Referral program</span>
                            <span className="text-xs text-slate-500">When on, students can share their code and earn rewards.</span>
                        </span>
                        <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${sForm.data.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${sForm.data.is_active ? 'left-[22px]' : 'left-0.5'}`} />
                        </span>
                    </button>

                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600">Reward type</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                { id: 'fixed', title: 'Fixed amount', text: 'An exact Birr amount per referred enrollment.' },
                                { id: 'percentage', title: 'Percentage', text: 'A share of the course price.' },
                            ].map((o) => (
                                <button key={o.id} type="button" onClick={() => sForm.setData('reward_type', o.id)}
                                    className={`rounded-2xl border p-4 text-left transition ${sForm.data.reward_type === o.id ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                                    <span className="block text-sm font-extrabold text-slate-900">{o.title}</span>
                                    <span className="mt-0.5 block text-xs text-slate-500">{o.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">{sForm.data.reward_type === 'fixed' ? 'Reward (ETB)' : 'Reward (%)'}</label>
                            <input type="number" step="0.01" min="0" required className={inputCls} value={sForm.data.reward_value} onChange={setS('reward_value')} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Minimum cash out (ETB)</label>
                            <input type="number" step="0.01" min="1" required className={inputCls} value={sForm.data.min_cash_out} onChange={setS('min_cash_out')} />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Headline</label>
                        <input required className={inputCls} value={sForm.data.headline} onChange={setS('headline')} placeholder="🎁 Student Referral Program" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Tagline</label>
                        <input required className={inputCls} value={sForm.data.tagline} onChange={setS('tagline')} placeholder="Invite Students & Earn 100 ETB" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                        <textarea rows={3} className={inputCls} value={sForm.data.description} onChange={setS('description')} />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Cash out terms</label>
                        <textarea rows={2} className={inputCls} value={sForm.data.cash_out_instructions} onChange={setS('cash_out_instructions')} />
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500">{sForm.isDirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
                        <button type="submit" disabled={sForm.processing || !sForm.isDirty} className="btn-primary disabled:opacity-50">
                            {sForm.processing ? 'Saving…' : 'Save settings'}
                        </button>
                    </div>
                </form>
            )}

            {/* ── Approve / reject modal ── */}
            {selected && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={closeAction}>
                    <form onSubmit={submitAction} onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className={`px-6 py-5 text-white ${actionType === 'approve' ? 'bg-gradient-to-r from-[#003301] to-[#006b02]' : 'bg-gradient-to-r from-rose-700 to-rose-500'}`}>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">{actionType === 'approve' ? 'Pay cash out' : 'Reject cash out'}</p>
                            <h3 className="mt-0.5 text-xl font-black">{money(selected.amount)} ETB</h3>
                            <p className="text-sm text-white/80">{selected.user?.name}</p>
                        </div>

                        <div className="space-y-4 p-6">
                            <FormErrors errors={aForm.errors} />

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-extrabold uppercase text-slate-800">{selected.payout_method}</span></div>
                                <div className="mt-1 flex justify-between"><span className="text-slate-500">Account</span><span className="select-all font-mono font-bold text-slate-900">{selected.account_number}</span></div>
                                <div className="mt-1 flex justify-between"><span className="text-slate-500">Name</span><span className="font-bold text-slate-900">{selected.account_name}</span></div>
                            </div>

                            {actionType === 'approve' ? (
                                <>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Transaction reference</label>
                                        <input autoFocus className={`${inputCls} font-mono`} value={aForm.data.transaction_reference} onChange={(e) => aForm.setData('transaction_reference', e.target.value)} placeholder="Telebirr or bank reference" />
                                        <p className="mt-1 text-[11px] text-slate-400">The student sees this in their cash out history.</p>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Note <span className="font-normal normal-case text-slate-400">(optional)</span></label>
                                        <textarea rows={2} className={inputCls} value={aForm.data.admin_notes} onChange={(e) => aForm.setData('admin_notes', e.target.value)} />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Reason <span className="text-rose-500">*</span></label>
                                    <textarea autoFocus rows={3} required className={inputCls} value={aForm.data.admin_notes} onChange={(e) => aForm.setData('admin_notes', e.target.value)} placeholder="e.g. invalid phone number or name mismatch" />
                                    <p className="mt-1 text-[11px] text-slate-400">{money(selected.amount)} ETB returns to the student’s balance.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <button type="button" onClick={closeAction} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                            <button type="submit" disabled={aForm.processing} className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 ${actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                                {aForm.processing ? 'Processing…' : actionType === 'approve' ? 'Confirm & mark paid' : 'Confirm rejection'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}
