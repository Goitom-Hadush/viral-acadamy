import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, router } from '@inertiajs/react';

export default function ReferralsIndex({ settings = {}, cashOuts = { data: [] }, metrics = {}, recentEarnings = [], filters = {} }) {
    const [currentTab, setCurrentTab] = useState('cashouts'); // 'cashouts' | 'settings' | 'earnings'
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'

    // Admin Settings Form
    const { data: settingsData, setData: setSettingsData, post: postSettings, processing: isSavingSettings, errors: settingsErrors } = useForm({
        headline: settings.headline || '🎁 Student Referral Program',
        tagline: settings.tagline || 'Invite Students & Earn 100 ETB',
        description: settings.description || 'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive 100 ETB instant commission!',
        reward_type: settings.reward_type || 'fixed',
        reward_value: settings.reward_value ?? 100,
        min_cash_out: settings.min_cash_out ?? 50,
        cash_out_instructions: settings.cash_out_instructions || 'Cash out requests are processed to your Telebirr or CBE Bank account within 24-48 business hours.',
        is_active: settings.is_active ?? true,
    });

    // Approve / Reject Form
    const { data: actionData, setData: setActionData, post: postAction, processing: isProcessingAction, errors: actionErrors, reset: resetAction } = useForm({
        transaction_reference: '',
        admin_notes: '',
    });

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings(route('admin.referrals.settings.update'));
    };

    const handleOpenAction = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        resetAction();
    };

    const handleCloseAction = () => {
        setSelectedRequest(null);
        setActionType(null);
        resetAction();
    };

    const handleActionSubmit = (e) => {
        e.preventDefault();
        if (!selectedRequest) return;

        if (actionType === 'approve') {
            postAction(route('admin.referrals.cash-outs.approve', selectedRequest.id), {
                onSuccess: () => handleCloseAction(),
            });
        } else if (actionType === 'reject') {
            postAction(route('admin.referrals.cash-outs.reject', selectedRequest.id), {
                onSuccess: () => handleCloseAction(),
            });
        }
    };

    const handleFilterStatus = (status) => {
        router.get(route('admin.referrals.index'), { status }, { preserveState: true });
    };

    const requestsList = cashOuts?.data || [];

    return (
        <AdminLayout>
            <Head title="Referral Program & Cash Outs | Admin" />

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
                        <span>🎁 Referral System & Payouts</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Student Referral Program & Cash Outs
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage referral rewards, set bonus amounts, and approve student Birr cash out requests.
                    </p>
                </div>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Total Bonuses Credited</span>
                    <p className="mt-2 text-2xl font-black text-slate-900">
                        {(metrics.total_credited_rewards || 0).toFixed(2)} <span className="text-xs font-bold text-slate-500">ETB</span>
                    </p>
                    <span className="mt-1 block text-xs text-slate-400">{metrics.total_referrals_count || 0} referral rewards</span>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-800">Pending Cash Outs</span>
                    <p className="mt-2 text-2xl font-black text-amber-900">
                        {(metrics.pending_cash_outs_total || 0).toFixed(2)} <span className="text-xs font-bold text-amber-700">ETB</span>
                    </p>
                    <span className="mt-1 block text-xs font-bold text-amber-700">
                        {metrics.pending_requests_count || 0} requests awaiting payout
                    </span>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
                    <span className="block text-xs font-bold uppercase tracking-wider text-emerald-800">Total Paid Out</span>
                    <p className="mt-2 text-2xl font-black text-emerald-900">
                        {(metrics.total_cashed_out || 0).toFixed(2)} <span className="text-xs font-bold text-emerald-700">ETB</span>
                    </p>
                    <span className="mt-1 block text-xs font-bold text-emerald-700">
                        {metrics.approved_requests_count || 0} successful payouts
                    </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Current Program Reward</span>
                    <p className="mt-2 text-2xl font-black text-copper-800">
                        {settings.reward_type === 'percentage' ? `${settings.reward_value}%` : `${settings.reward_value} ETB`}
                    </p>
                    <span className="mt-1 block text-xs text-slate-500">
                        Type: {settings.reward_type === 'percentage' ? 'Percentage commission' : 'Fixed Birr reward'}
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                <button
                    onClick={() => setCurrentTab('cashouts')}
                    type="button"
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                        currentTab === 'cashouts'
                            ? 'bg-copper-700 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    💸 Cash Out Requests {metrics.pending_requests_count > 0 && (
                        <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-black">
                            {metrics.pending_requests_count}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setCurrentTab('settings')}
                    type="button"
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                        currentTab === 'settings'
                            ? 'bg-copper-700 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    ⚙️ Referral Settings & Reward Number
                </button>
                <button
                    onClick={() => setCurrentTab('earnings')}
                    type="button"
                    className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
                        currentTab === 'earnings'
                            ? 'bg-copper-700 text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                    📊 Referral Activity Log ({recentEarnings.length})
                </button>
            </div>

            {/* ========================================================
                TAB 1: CASH OUT REQUESTS TABULATION TABLE
               ======================================================== */}
            {currentTab === 'cashouts' && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                    {/* Filter Pills */}
                    <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                            {['all', 'pending', 'approved', 'rejected'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => handleFilterStatus(st)}
                                    type="button"
                                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                                        (filters.status || 'all') === st
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                            Showing {requestsList.length} request{requestsList.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Table */}
                    {requestsList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <th className="py-3.5 px-4">Student</th>
                                        <th className="py-3.5 px-4">Amount</th>
                                        <th className="py-3.5 px-4">Payout Method</th>
                                        <th className="py-3.5 px-4">Account / Phone Details</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Txn Ref / Admin Note</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {requestsList.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Student */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-slate-900 text-sm">{req.user?.name || 'Student'}</div>
                                                <div className="text-[11px] text-slate-500">{req.user?.email}</div>
                                                {req.user?.phone && <div className="text-[11px] text-slate-400">{req.user.phone}</div>}
                                            </td>

                                            {/* Amount */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="font-black text-slate-900 text-base font-mono">
                                                    {req.amount.toFixed(2)} <span className="text-xs font-bold text-slate-500">ETB</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400">{new Date(req.created_at).toLocaleDateString()}</div>
                                            </td>

                                            {/* Method */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                                    req.payout_method === 'telebirr'
                                                        ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                                        : req.payout_method === 'cbe'
                                                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                }`}>
                                                    {req.payout_method === 'telebirr' ? '📱 Telebirr' : req.payout_method === 'cbe' ? '🏦 CBE Bank' : '🏛️ ' + (req.bank_name || 'Bank')}
                                                </span>
                                            </td>

                                            {/* Account Details */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-mono font-bold text-slate-900 text-xs select-all">
                                                    {req.account_number}
                                                </div>
                                                <div className="text-slate-600 text-[11px] font-medium">
                                                    Owner: <strong>{req.account_name}</strong>
                                                </div>
                                                {req.student_notes && (
                                                    <div className="text-[11px] text-slate-400 italic mt-0.5">
                                                        "{req.student_notes}"
                                                    </div>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    req.status === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : req.status === 'rejected'
                                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                }`}>
                                                    {req.status === 'approved' ? '✓ Paid & Approved' : req.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                                                </span>
                                            </td>

                                            {/* Txn Ref & Notes */}
                                            <td className="py-3.5 px-4">
                                                {req.transaction_reference && (
                                                    <div className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                                                        Txn: {req.transaction_reference}
                                                    </div>
                                                )}
                                                {req.admin_notes && (
                                                    <div className="text-[11px] text-slate-600 mt-1">
                                                        {req.admin_notes}
                                                    </div>
                                                )}
                                                {!req.transaction_reference && !req.admin_notes && (
                                                    <span className="text-slate-400 italic">—</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                {req.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenAction(req, 'approve')}
                                                            type="button"
                                                            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 shadow-xs transition cursor-pointer"
                                                        >
                                                            ✓ Approve / Pay
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenAction(req, 'reject')}
                                                            type="button"
                                                            className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-2.5 py-1.5 transition cursor-pointer"
                                                        >
                                                            ✕ Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[11px] text-slate-400">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 text-sm">
                            No cash out requests match the selected filter.
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================
                TAB 2: REFERRAL SETTINGS & REWARD NUMBER FORM
               ======================================================== */}
            {currentTab === 'settings' && (
                <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="mb-6 pb-4 border-b border-slate-100">
                        <h2 className="text-lg font-black text-slate-900">🎁 Referral Program Configuration</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Set the referral reward amount, headline, description, and minimum withdrawal threshold.
                        </p>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-5">
                        <FormErrors errors={settingsErrors} />

                        {/* Program Active Toggle */}
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-4">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                                    Referral Program Status
                                </span>
                                <span className="text-xs text-slate-500">
                                    When enabled, students can share their code and earn rewards on course purchases.
                                </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settingsData.is_active}
                                    onChange={(e) => setSettingsData('is_active', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        {/* Reward Type (Fixed Birr vs Percentage) */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                Reward Calculation Type *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                                    settingsData.reward_type === 'fixed'
                                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}>
                                    <input
                                        type="radio"
                                        name="reward_type"
                                        value="fixed"
                                        checked={settingsData.reward_type === 'fixed'}
                                        onChange={() => setSettingsData('reward_type', 'fixed')}
                                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-extrabold text-slate-900">
                                            Fixed Birr Amount (Recommended)
                                        </span>
                                        <span className="block text-xs text-slate-500 mt-0.5">
                                            Students earn an exact number of Birr (e.g. 100 ETB) per referred enrollment.
                                        </span>
                                    </div>
                                </label>

                                <label className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                                    settingsData.reward_type === 'percentage'
                                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                                        : 'border-slate-200 bg-white hover:bg-slate-50'
                                }`}>
                                    <input
                                        type="radio"
                                        name="reward_type"
                                        value="percentage"
                                        checked={settingsData.reward_type === 'percentage'}
                                        onChange={() => setSettingsData('reward_type', 'percentage')}
                                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-extrabold text-slate-900">
                                            Percentage Commission (%)
                                        </span>
                                        <span className="block text-xs text-slate-500 mt-0.5">
                                            Students earn a percentage (e.g. 2%) of the purchased course price.
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Reward Value & Min Cash Out in 2 cols */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    {settingsData.reward_type === 'fixed' ? 'Reward Amount (ETB Number) *' : 'Reward Percentage (%) *'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={settingsData.reward_value}
                                        onChange={(e) => setSettingsData('reward_value', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        placeholder="e.g. 100"
                                        required
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">
                                        {settingsData.reward_type === 'fixed' ? 'ETB' : '%'}
                                    </span>
                                </div>
                                <span className="block text-[11px] text-slate-400 mt-1">
                                    {settingsData.reward_type === 'fixed'
                                        ? 'Each time a student enters a referral number, the inviter receives this Birr amount.'
                                        : 'Percentage of the course price credited to the inviter.'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Minimum Cash Out (ETB) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        value={settingsData.min_cash_out}
                                        onChange={(e) => setSettingsData('min_cash_out', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        placeholder="e.g. 50"
                                        required
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">ETB</span>
                                </div>
                                <span className="block text-[11px] text-slate-400 mt-1">
                                    Students must accumulate at least this amount before submitting a cash out request.
                                </span>
                            </div>
                        </div>

                        {/* Headline */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Program Headline *
                            </label>
                            <input
                                type="text"
                                value={settingsData.headline}
                                onChange={(e) => setSettingsData('headline', e.target.value)}
                                placeholder="🎁 Student Referral Program"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                required
                            />
                        </div>

                        {/* Tagline */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Program Tagline *
                            </label>
                            <input
                                type="text"
                                value={settingsData.tagline}
                                onChange={(e) => setSettingsData('tagline', e.target.value)}
                                placeholder="Invite Students & Earn 100 ETB"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Program Description *
                            </label>
                            <textarea
                                rows="3"
                                value={settingsData.description}
                                onChange={(e) => setSettingsData('description', e.target.value)}
                                placeholder="Share your personal referral number with friends..."
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                required
                            />
                        </div>

                        {/* Cash out instructions */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Cash Out Terms & Payout Instructions
                            </label>
                            <textarea
                                rows="2"
                                value={settingsData.cash_out_instructions}
                                onChange={(e) => setSettingsData('cash_out_instructions', e.target.value)}
                                placeholder="Cash out requests are processed to your Telebirr or CBE Bank account within 24-48 business hours."
                                className="w-full rounded-xl border border-slate-300 px-4 py-2 text-xs text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                            />
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={isSavingSettings}
                                className="rounded-xl bg-copper-700 hover:bg-copper-800 disabled:opacity-50 text-white font-extrabold text-xs px-6 py-3 shadow-md shadow-copper-700/20 transition hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                {isSavingSettings ? 'Saving Settings...' : 'Save Referral Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ========================================================
                TAB 3: RECENT REFERRAL EARNINGS LOG
               ======================================================== */}
            {currentTab === 'earnings' && (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Recent Student Referrals & Bonuses
                        </h3>
                    </div>

                    {recentEarnings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <th className="py-3 px-4">Inviter (Referrer)</th>
                                        <th className="py-3 px-4">Referred Student</th>
                                        <th className="py-3 px-4">Course Enrolled</th>
                                        <th className="py-3 px-4">Reward Amount</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentEarnings.map((earning) => (
                                        <tr key={earning.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900">{earning.referrer?.name || 'Inviter'}</div>
                                                <div className="font-mono text-[11px] text-copper-700 font-bold">{earning.referrer?.referral_code}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-900">{earning.referred_user?.name || 'Student'}</div>
                                                <div className="text-[11px] text-slate-500">{earning.referred_user?.email}</div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-bold text-slate-800">{earning.course?.title || 'Course'}</div>
                                                <div className="text-[11px] text-slate-400">Price: {earning.course_price} ETB</div>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className="font-black text-emerald-700 font-mono text-sm">
                                                    +{parseFloat(earning.commission_amount).toFixed(2)} ETB
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    earning.status === 'credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {earning.status === 'credited' ? '✓ Credited' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                                                {new Date(earning.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500 text-xs">
                            No student referral earnings recorded yet.
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================
                APPROVE / REJECT MODAL
               ======================================================== */}
            {selectedRequest && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    {actionType === 'approve' ? '✓ Approve & Mark Cash Out as Paid' : '✕ Reject Cash Out Request'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Student: <strong>{selectedRequest.user?.name}</strong> • Amount: <strong>{selectedRequest.amount.toFixed(2)} ETB</strong>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseAction}
                                type="button"
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleActionSubmit} className="mt-4 space-y-4">
                            <FormErrors errors={actionErrors} />

                            {/* Payout destination recap */}
                            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Method:</span>
                                    <span className="font-extrabold text-slate-800 uppercase">{selectedRequest.payout_method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Account / Phone:</span>
                                    <span className="font-mono font-bold text-slate-900">{selectedRequest.account_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Account Name:</span>
                                    <span className="font-bold text-slate-900">{selectedRequest.account_name}</span>
                                </div>
                            </div>

                            {actionType === 'approve' ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Transaction Reference ID / Confirmation Code
                                        </label>
                                        <input
                                            type="text"
                                            value={actionData.transaction_reference}
                                            onChange={(e) => setActionData('transaction_reference', e.target.value)}
                                            placeholder="e.g. Telebirr Txn ID or CBE Ref #"
                                            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        />
                                        <span className="text-[10px] text-slate-400 mt-1 block">
                                            The student will see this reference in their cash out history.
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Admin Notes (optional)
                                        </label>
                                        <textarea
                                            rows="2"
                                            value={actionData.admin_notes}
                                            onChange={(e) => setActionData('admin_notes', e.target.value)}
                                            placeholder="e.g. Sent via Telebirr merchant..."
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Rejection Reason *
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={actionData.admin_notes}
                                        onChange={(e) => setActionData('admin_notes', e.target.value)}
                                        placeholder="Explain why this request is rejected (e.g. invalid phone number, account name mismatch)..."
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        required
                                    />
                                    <span className="text-[10px] text-slate-400 mt-1 block">
                                        The requested {selectedRequest.amount.toFixed(2)} ETB will be returned to the student's available balance.
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseAction}
                                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessingAction}
                                    className={`rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-xs transition cursor-pointer ${
                                        actionType === 'approve'
                                            ? 'bg-emerald-600 hover:bg-emerald-700'
                                            : 'bg-rose-600 hover:bg-rose-700'
                                    }`}
                                >
                                    {isProcessingAction
                                        ? 'Processing...'
                                        : actionType === 'approve'
                                        ? 'Confirm & Mark Paid'
                                        : 'Confirm Rejection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
