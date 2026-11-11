import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, router, useForm } from '@inertiajs/react';

export default function SeminarsIndex({ seminars = [], registrations = [], stats = {} }) {
    const [activeTab, setActiveTab] = useState('seminars'); // 'seminars' or 'registrations'
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingSeminar, setEditingSeminar] = useState(null);
    const [previewReceiptUrl, setPreviewReceiptUrl] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    // Create / Edit Seminar Form
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        tagline: '',
        badge: 'Upcoming Seminar',
        speaker_name: '',
        speaker_title: '',
        date_string: '',
        time_string: '',
        location_type: 'in_person',
        venue_name: '',
        venue_city: 'Addis Ababa',
        entrance_fee: 0,
        price_label: 'Free Registration',
        capacity: 250,
        description: '',
        topics: '',
        bank_info: 'Telebirr: 0911 234 567 (Success Life Coaching)\nCBE Account: 1000 4567 8901 (Success Life Coaching)',
        image: null,
    });

    const openCreate = () => {
        setEditingSeminar(null);
        reset();
        setData({
            title: '',
            tagline: '',
            badge: 'Upcoming Seminar',
            speaker_name: 'Coach Tewelde Mebrahtu',
            speaker_title: 'Master Executive Life Coach',
            date_string: 'Saturday, Dec 20, 2026',
            time_string: '9:00 AM – 4:00 PM EAT',
            location_type: 'in_person',
            venue_name: 'Ethiopian Skylight Hotel Grand Ballroom',
            venue_city: 'Addis Ababa',
            online_link: '',
            entrance_fee: 0,
            price_label: 'Free',
            capacity: 300,
            description: '',
            topics: 'Leadership Psychology, Wealth Mastery, Career Breakthrough, High-Stakes Public Speaking',
            bank_info: 'Telebirr: 0911 234 567 (Success Life Coaching)\nCBE Account: 1000 4567 8901 (Success Life Coaching)',
            image: null,
        });
        setShowCreateModal(true);
    };

    const openEdit = (sem) => {
        setEditingSeminar(sem);
        let parsedTopics = '';
        if (sem.topics_json) {
            try {
                const arr = JSON.parse(sem.topics_json);
                if (Array.isArray(arr)) parsedTopics = arr.join(', ');
            } catch (e) {
                parsedTopics = sem.topics_json;
            }
        }

        const isFree = !sem.entrance_fee || Number(sem.entrance_fee) === 0;

        setData({
            title: sem.title,
            tagline: sem.tagline || '',
            badge: sem.badge || 'Upcoming Seminar',
            speaker_name: sem.speaker_name,
            speaker_title: sem.speaker_title || '',
            date_string: sem.date_string,
            time_string: sem.time_string,
            location_type: sem.location_type || 'in_person',
            venue_name: sem.venue_name,
            venue_city: sem.venue_city || '',
            online_link: sem.online_link || '',
            entrance_fee: sem.entrance_fee || 0,
            price_label: sem.price_label || (isFree ? 'Free' : `ETB ${sem.entrance_fee}`),
            capacity: sem.capacity || 250,
            description: sem.description,
            topics: parsedTopics,
            bank_info: sem.bank_info || '',
            image: null,
        });
        setShowCreateModal(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingSeminar) {
            post(route('admin.seminars.update', editingSeminar.id), {
                forceFormData: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    setEditingSeminar(null);
                    reset();
                },
            });
        } else {
            post(route('admin.seminars.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setShowCreateModal(false);
                    reset();
                },
            });
        }
    };

    const togglePublish = (id) => {
        router.patch(route('admin.seminars.toggle', id), {}, { preserveScroll: true });
    };

    const deleteSeminar = (id, title) => {
        if (confirm(`Are you sure you want to permanently delete the seminar "${title}"?`)) {
            router.delete(route('admin.seminars.destroy', id), { preserveScroll: true });
        }
    };

    const approveRegistration = (regId, name) => {
        if (confirm(`Approve payment receipt for ${name} and issue official ticket?`)) {
            router.post(route('admin.seminars.registrations.approve', regId), {}, { preserveScroll: true });
        }
    };

    const rejectRegistration = (regId, name) => {
        const note = prompt(`Enter reason for rejecting ${name}'s payment receipt:`, 'Receipt image could not be verified or payment incomplete.');
        if (note !== null) {
            router.post(route('admin.seminars.registrations.reject', regId), { admin_notes: note }, { preserveScroll: true });
        }
    };

    const filteredRegistrations = (registrations || []).filter((r) => {
        if (statusFilter === 'all') return true;
        return r.status === statusFilter;
    });

    return (
        <AdminLayout>
            <Head title="Seminars & Tickets Management | Admin" />

            {/* HERO BANNER & STATS */}
            <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#004101] via-[#005a02] to-copper-900 p-6 sm:p-10 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                                🏛️ Event Directorate
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight">
                            Seminars & Ticket Receipts
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-emerald-100 max-w-xl">
                            Post and manage live summits, masterclasses, and workshops. Review attendee payment receipts (Telebirr/CBE) to confirm attendance tickets.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 shadow-lg hover:bg-amber-300 transition active:scale-95"
                        >
                            <span>➕</span>
                            <span>Post New Seminar</span>
                        </button>
                    </div>
                </div>

                {/* METRICS CARDS */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-white/15 text-slate-900">
                    <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Seminars</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-black text-[#004101]">{stats.total_seminars || seminars.length}</p>
                    </div>

                    <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Published</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-700">{stats.published_seminars || 0}</p>
                    </div>

                    <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registrations</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-black text-copper-700">{stats.total_registrations || registrations.length}</p>
                    </div>

                    <div className="rounded-2xl bg-white/95 p-4 backdrop-blur-md relative overflow-hidden">
                        {(stats.pending_receipts || 0) > 0 && (
                            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        )}
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Receipts</p>
                        <p className="mt-1 text-2xl sm:text-3xl font-black text-rose-600">{stats.pending_receipts || 0}</p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="mb-6 flex border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('seminars')}
                    className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
                        activeTab === 'seminars'
                            ? 'border-[#004101] text-[#004101]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span>🏛️</span>
                    <span>All Seminars ({seminars.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('registrations')}
                    className={`pb-3 px-5 text-sm font-bold border-b-2 transition flex items-center gap-2 relative ${
                        activeTab === 'registrations'
                            ? 'border-[#004101] text-[#004101]'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span>🎟️</span>
                    <span>Attendee Tickets & Receipts ({registrations.length})</span>
                    {(stats.pending_receipts || 0) > 0 && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.2 text-[10px] font-black text-white">
                            {stats.pending_receipts} new
                        </span>
                    )}
                </button>
            </div>

            {/* ========================================================
                TAB 1: SEMINARS DIRECTORY
               ======================================================== */}
            {activeTab === 'seminars' && (
                <div className="space-y-6">
                    {seminars.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                            <span className="text-4xl">🏛️</span>
                            <h3 className="mt-3 text-lg font-bold text-slate-900">No seminars posted yet</h3>
                            <p className="text-xs text-slate-500 mt-1">Click "Post New Seminar" to publish your first summit or workshop.</p>
                            <button
                                type="button"
                                onClick={openCreate}
                                className="mt-4 rounded-xl bg-[#004101] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition"
                            >
                                Post First Seminar
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {seminars.map((sem) => (
                                <div
                                    key={sem.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image Flyer */}
                                        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                                            {sem.image_path ? (
                                                <img
                                                    src={`/storage/${sem.image_path}`}
                                                    alt={sem.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#004101] to-[#012702] text-white p-4 text-center">
                                                    <span className="text-3xl mb-1">🏛️</span>
                                                    <p className="font-serif font-black text-lg text-amber-300">{sem.title}</p>
                                                    <p className="text-[11px] text-emerald-200 mt-0.5">{sem.speaker_name}</p>
                                                </div>
                                            )}

                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    sem.is_published ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                                                }`}>
                                                    {sem.is_published ? '✓ Published Live' : 'Draft'}
                                                </span>
                                                <span className="rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                                                    {sem.badge || 'Seminar'}
                                                </span>
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-xs font-black text-slate-900 shadow-sm">
                                                    {(!sem.entrance_fee || Number(sem.entrance_fee) === 0) ? (sem.price_label || 'Free') : (sem.price_label || `ETB ${sem.entrance_fee}`)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-5">
                                            <p className="text-xs font-semibold text-emerald-800">
                                                📅 {sem.date_string} • {sem.time_string}
                                            </p>
                                            <h3 className="mt-1 text-lg font-black text-slate-900 font-serif leading-snug">
                                                {sem.title}
                                            </h3>
                                            
                                            {/* Venue / Online details */}
                                            <div className="mt-1 text-xs text-slate-500 space-y-1">
                                                {sem.location_type === 'virtual' ? (
                                                    <div>
                                                        <p className="text-indigo-700 font-semibold flex items-center gap-1">
                                                            <span>💻 Virtual Live Stream:</span> <span>{sem.venue_name || 'Online Platform'}</span>
                                                        </p>
                                                        {sem.online_link && (
                                                            <p className="text-[11px] text-slate-500 font-mono truncate">
                                                                Link: <a href={sem.online_link} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">{sem.online_link}</a>
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : sem.location_type === 'hybrid' ? (
                                                    <div>
                                                        <p>🌐 Hybrid: {sem.venue_name} {sem.venue_city ? `(${sem.venue_city})` : ''}</p>
                                                        {sem.online_link && (
                                                            <p className="text-[11px] text-slate-500 font-mono truncate">
                                                                Stream: <a href={sem.online_link} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-medium">{sem.online_link}</a>
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p>📍 In-Person: {sem.venue_name} {sem.venue_city ? `(${sem.venue_city})` : ''}</p>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                                {sem.description}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                                                <span className="text-slate-600">
                                                    Speaker: <strong className="text-slate-900">{sem.speaker_name}</strong>
                                                </span>
                                                <span className="text-slate-600">
                                                    Capacity: <strong className="text-emerald-800">{sem.registered_count || 0} / {sem.capacity}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(sem.id)}
                                                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                                    sem.is_published
                                                        ? 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                                                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                                                }`}
                                            >
                                                {sem.is_published ? 'Unpublish' : 'Publish Live'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openEdit(sem)}
                                                className="rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-300 transition"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => deleteSeminar(sem.id, sem.title)}
                                            className="rounded-xl text-rose-600 hover:bg-rose-50 px-3 py-1.5 text-xs font-bold transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================
                TAB 2: ATTENDEE TICKETS & RECEIPT REVIEW
               ======================================================== */}
            {activeTab === 'registrations' && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 font-serif">Attendee Registrations & Payment Slips</h2>
                            <p className="text-xs text-slate-500">
                                Click on any receipt to review the transfer slip. Approving confirms the attendee's ticket.
                            </p>
                        </div>

                        {/* Status Filter */}
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'pending_approval', label: 'Pending Review' },
                                { id: 'approved', label: 'Approved' },
                                { id: 'rejected', label: 'Rejected' },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setStatusFilter(f.id)}
                                    className={`px-3 py-1.5 rounded-lg transition ${
                                        statusFilter === f.id
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredRegistrations.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <span className="text-3xl">🎟️</span>
                            <p className="mt-2 text-sm font-semibold">No attendee registrations in this category</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                                        <th className="py-3 px-2">Ticket Code</th>
                                        <th className="py-3 px-2">Attendee Details</th>
                                        <th className="py-3 px-2">Seminar</th>
                                        <th className="py-3 px-2">Tier / Amount</th>
                                        <th className="py-3 px-2">Payment Receipt</th>
                                        <th className="py-3 px-2">Status</th>
                                        <th className="py-3 px-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                                            <td className="py-3 px-2 font-mono font-bold text-copper-700">
                                                {reg.registration_code}
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="font-bold text-slate-900">{reg.attendee_name}</p>
                                                <p className="text-slate-500 text-[11px] font-mono">{reg.attendee_phone}</p>
                                                {reg.attendee_email && (
                                                    <p className="text-slate-400 text-[10px]">{reg.attendee_email}</p>
                                                )}
                                            </td>
                                            <td className="py-3 px-2 max-w-[200px]">
                                                <p className="font-semibold text-slate-800 truncate" title={reg.seminar_title}>
                                                    {reg.seminar_title}
                                                </p>
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="font-semibold text-slate-700">{reg.ticket_tier}</p>
                                                <p className="text-emerald-700 font-bold text-[11px]">
                                                    {reg.amount_paid > 0 ? `ETB ${reg.amount_paid}` : 'Free'}
                                                </p>
                                                {reg.transaction_reference && (
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        Ref: {reg.transaction_reference}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                {reg.receipt_image ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewReceiptUrl(`/storage/${reg.receipt_image}`)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-copper-200 bg-copper-50 px-2.5 py-1 text-[11px] font-bold text-copper-800 hover:bg-copper-100 transition shadow-2xs"
                                                    >
                                                        <span>📷</span>
                                                        <span>View Receipt</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 italic text-[11px]">No receipt (Free/Standard)</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                {reg.status === 'approved' ? (
                                                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                                        ✓ Approved
                                                    </span>
                                                ) : reg.status === 'rejected' ? (
                                                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                                                        ✕ Rejected
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                                                        ⏳ Pending Review
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {reg.status !== 'approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => approveRegistration(reg.id, reg.attendee_name)}
                                                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition"
                                                            title="Approve & Validate Ticket"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {reg.status !== 'rejected' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => rejectRegistration(reg.id, reg.attendee_name)}
                                                            className="rounded-lg bg-rose-100 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200 transition"
                                                            title="Reject Registration"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ========================================================
                MODAL: CREATE / EDIT SEMINAR
               ======================================================== */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 my-8">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#004101] to-[#005a02] p-6 text-white rounded-t-3xl flex items-center justify-between">
                            <div>
                                <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                    Seminar Creator
                                </span>
                                <h3 className="mt-1 text-xl font-black font-serif">
                                    {editingSeminar ? 'Edit Seminar Details' : 'Post New Academy Seminar'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <FormErrors errors={errors} />

                            {/* Title & Tagline */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Seminar Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. The Executive Leadership & Breakthrough Summit 2026"
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-copper-500 focus:ring-1 focus:ring-copper-500"
                                />
                                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Tagline / Subtitle
                                </label>
                                <input
                                    type="text"
                                    value={data.tagline}
                                    onChange={(e) => setData('tagline', e.target.value)}
                                    placeholder="e.g. High-Performance Mindset & Personal Influence Blueprint"
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-copper-500 focus:ring-1 focus:ring-copper-500"
                                />
                            </div>

                            {/* Flyer Banner Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Seminar Flyer / Banner Image (JPEG, PNG, WebP)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
                                />
                                {editingSeminar?.image_path && !data.image && (
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        Current flyer: <span className="font-mono text-emerald-700">/storage/{editingSeminar.image_path}</span>
                                    </p>
                                )}
                            </div>

                            {/* Speaker Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Keynote Speaker Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.speaker_name}
                                        onChange={(e) => setData('speaker_name', e.target.value)}
                                        placeholder="e.g. Coach Tewelde Mebrahtu"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Speaker Title / Credential
                                    </label>
                                    <input
                                        type="text"
                                        value={data.speaker_title}
                                        onChange={(e) => setData('speaker_title', e.target.value)}
                                        placeholder="e.g. Master Executive Life Coach"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Date, Time & Location Type */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Date String <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.date_string}
                                        onChange={(e) => setData('date_string', e.target.value)}
                                        placeholder="e.g. Saturday, Dec 28, 2026"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Time String <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.time_string}
                                        onChange={(e) => setData('time_string', e.target.value)}
                                        placeholder="e.g. 9:00 AM – 4:00 PM EAT"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Format / Type <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.location_type}
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                location_type: newType,
                                                venue_city: newType === 'virtual' ? '' : (prev.venue_city || 'Addis Ababa'),
                                                venue_name: newType === 'virtual' && (!prev.venue_name || prev.venue_name.includes('Skylight')) ? 'Zoom / Online Hub Live Stream' : prev.venue_name
                                            }));
                                        }}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    >
                                        <option value="in_person">In-Person Only</option>
                                        <option value="virtual">Virtual Live Stream</option>
                                        <option value="hybrid">Hybrid (Both)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Venue & City & Online Stream Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        {data.location_type === 'virtual' ? 'Virtual Platform / Host Name' : 'Venue Name / Hotel / Hall'} <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.venue_name}
                                        onChange={(e) => setData('venue_name', e.target.value)}
                                        placeholder={data.location_type === 'virtual' ? 'e.g. Zoom Live Stream / Google Meet' : 'e.g. Ethiopian Skylight Hotel Grand Ballroom'}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>

                                {/* IF VIRTUAL: Hide city and show Online Stream Link */}
                                {data.location_type === 'virtual' ? (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                            <span>🔗</span> Online Live Stream Link <span className="text-emerald-700 font-semibold">(Zoom / Meet / Live URL)</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={data.online_link}
                                            onChange={(e) => setData('online_link', e.target.value)}
                                            placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                                            className="w-full rounded-xl border border-emerald-300 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                        />
                                        <p className="mt-1 text-[10px] text-slate-400">Attendees will receive this link to join the virtual broadcast.</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            City / Region
                                        </label>
                                        <input
                                            type="text"
                                            value={data.venue_city}
                                            onChange={(e) => setData('venue_city', e.target.value)}
                                            placeholder="Addis Ababa"
                                            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* If Hybrid: Also show online stream link */}
                            {data.location_type === 'hybrid' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                        <span>🔗</span> Online Live Stream Link for Virtual Attendees
                                    </label>
                                    <input
                                        type="url"
                                        value={data.online_link}
                                        onChange={(e) => setData('online_link', e.target.value)}
                                        placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                            )}

                            {/* Entrance Fee & Price Label & Capacity */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Entrance Fee (ETB)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.entrance_fee}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setData((prev) => {
                                                const num = parseFloat(val);
                                                let newPriceLabel = prev.price_label;
                                                if (isNaN(num) || num <= 0) {
                                                    if (!prev.price_label || prev.price_label.startsWith('ETB') || prev.price_label === 'Free Admission') {
                                                        newPriceLabel = 'Free';
                                                    }
                                                } else {
                                                    if (prev.price_label === 'Free' || !prev.price_label) {
                                                        newPriceLabel = `ETB ${num}`;
                                                    }
                                                }
                                                return {
                                                    ...prev,
                                                    entrance_fee: val,
                                                    price_label: newPriceLabel
                                                };
                                            });
                                        }}
                                        placeholder="0 for free"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                    <p className="mt-0.5 text-[10px] text-slate-400">Set 0 for free entrance.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Display Price Label
                                    </label>
                                    <input
                                        type="text"
                                        value={data.price_label}
                                        onChange={(e) => setData('price_label', e.target.value)}
                                        placeholder="Free"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                    <p className="mt-0.5 text-[10px] text-slate-400">Defaults to "Free" if fee is 0.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Seating Capacity
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Bank Payment Info (For Telebirr / CBE transfers) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Payment Instructions & Bank / Telebirr Accounts (Shown to attendees)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.bank_info}
                                    onChange={(e) => setData('bank_info', e.target.value)}
                                    placeholder="Telebirr: 09... | Commercial Bank of Ethiopia (CBE): 1000..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-mono"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Detailed Seminar Description <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Full agenda and overview of this seminar..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                />
                            </div>

                            {/* Topics */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Key Topics (Comma or newline separated)
                                </label>
                                <input
                                    type="text"
                                    value={data.topics}
                                    onChange={(e) => setData('topics', e.target.value)}
                                    placeholder="Executive Mindset, Wealth Architecture, Speaking Charisma"
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                />
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gradient-to-r from-[#004101] to-[#005a02] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-800 transition active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : editingSeminar ? 'Save Seminar Changes' : 'Publish Seminar Live 🚀'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                RECEIPT LIGHTBOX PREVIEW MODAL
               ======================================================== */}
            {previewReceiptUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
                    <div className="relative max-w-xl w-full bg-white rounded-3xl p-4 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                📷 Payment Slip / Receipt Inspection
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewReceiptUrl(null)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="mt-3 overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center max-h-[70vh]">
                            <img
                                src={previewReceiptUrl}
                                alt="Payment Receipt"
                                className="object-contain max-h-[68vh] w-full"
                            />
                        </div>
                        <div className="mt-3 flex justify-between items-center text-xs">
                            <a
                                href={previewReceiptUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-copper-700 hover:underline"
                            >
                                Open Full Image in New Tab ↗
                            </a>
                            <button
                                type="button"
                                onClick={() => setPreviewReceiptUrl(null)}
                                className="rounded-xl bg-slate-200 px-4 py-1.5 font-bold text-slate-800 hover:bg-slate-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
