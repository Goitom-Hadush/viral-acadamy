import React, { memo, useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

const PAGE_SIZE = 25;

// Courses a student is enrolled in, each with the transaction ID that unlocked it.
const Enrollments = memo(function Enrollments({ user, onOpen, onCopy, copiedField }) {
    if (user.role !== 'student') return <span className="text-slate-300">—</span>;

    const list = user.enrollments || [];
    const shown = list.slice(0, 2);
    const extra = list.length - shown.length;

    if (list.length === 0 && !user.pending_payments) {
        return <span className="text-xs text-slate-400">No enrollments</span>;
    }

    return (
        <div className="space-y-1.5">
            {shown.map((e) => (
                <div key={e.course_id} className="flex items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${e.is_expired ? 'bg-rose-500' : 'bg-emerald-500'}`} title={e.is_expired ? 'Access expired' : 'Active'} />
                    <span className="max-w-[180px] truncate text-xs font-bold text-slate-800" title={e.title}>{e.title}</span>
                    {e.transaction_id ? (
                        <button
                            type="button"
                            onClick={() => onCopy(e.transaction_id, `tx-${user.id}-${e.course_id}`)}
                            title="Copy transaction ID"
                            className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 hover:border-copper-300 hover:bg-copper-50"
                        >
                            {copiedField === `tx-${user.id}-${e.course_id}` ? '✓ Copied' : e.transaction_id}
                        </button>
                    ) : (
                        <span className="text-[10px] italic text-slate-400">no transaction ID</span>
                    )}
                </div>
            ))}
            {extra > 0 && (
                <button type="button" onClick={() => onOpen(user)} className="text-[11px] font-bold text-copper-700 hover:underline">
                    +{extra} more
                </button>
            )}
            {user.pending_payments > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
                    ⏳ {user.pending_payments} pending verification
                </span>
            )}
        </div>
    );
});
export default function UserIndex({ users = [], auth }) {
    const [viewingUser, setViewingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [copiedField, setCopiedField] = useState(null);
    const [limit, setLimit] = useState(PAGE_SIZE);

    const handleRoleChange = (e, userId) => {
        const newRole = e.target.value;
        router.patch(route('admin.users.role', userId), {
            role: newRole
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (viewingUser && viewingUser.id === userId) {
                    setViewingUser(prev => ({ ...prev, role: newRole }));
                }
            }
        });
    };

    const handleConfirmDelete = () => {
        if (!deletingUser) return;
        setIsDeleting(true);
        router.delete(route('admin.users.destroy', deletingUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingUser(null);
                if (viewingUser?.id === deletingUser.id) {
                    setViewingUser(null);
                }
            },
            onFinish: () => {
                setIsDeleting(false);
            }
        });
    };

    const handleCopy = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Filtered users list
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const query = searchQuery.toLowerCase().trim();
            const matchesQuery = !query || 
                (user.name && user.name.toLowerCase().includes(query)) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (user.phone && user.phone.toLowerCase().includes(query)) ||
                (user.referral_code && user.referral_code.toLowerCase().includes(query)) ||
                (user.enrollments || []).some(e => (e.title && e.title.toLowerCase().includes(query)) || (e.transaction_id && e.transaction_id.toLowerCase().includes(query)));
            return matchesRole && matchesQuery;
        });
    }, [users, roleFilter, searchQuery]);

    const currentAdminId = auth?.user?.id;

    return (
        <AdminLayout>
            <Head title="User Management | Admin" />

            {/* Hero Section */}
            <div className="mb-8 rounded-3xl bg-gradient-to-r from-copper-700 via-accent to-bronze p-6 sm:p-10 text-white shadow-xl shadow-copper-700/25 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-md">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">User Management</p>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Manage Users</h1>
                        <p className="mt-2 max-w-2xl text-sm sm:text-base text-copper-100">
                            View registered user details, manage role assignments, and delete accounts. You have {users.length} registered user{users.length !== 1 ? 's' : ''}.
                        </p>
                    </div>

                    {/* Quick Count Badges */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
                        <div className="px-3 py-1.5 text-center">
                            <span className="block text-lg font-black">{users.filter(u => u.role === 'student').length}</span>
                            <span className="text-[10px] uppercase font-bold text-copper-200">Students</span>
                        </div>
                        <div className="h-8 w-px bg-white/20"></div>
                        <div className="px-3 py-1.5 text-center">
                            <span className="block text-lg font-black">{users.filter(u => u.role === 'instructor').length}</span>
                            <span className="text-[10px] uppercase font-bold text-copper-200">Instructors</span>
                        </div>
                        <div className="h-8 w-px bg-white/20"></div>
                        <div className="px-3 py-1.5 text-center">
                            <span className="block text-lg font-black">{users.filter(u => u.role === 'admin').length}</span>
                            <span className="text-[10px] uppercase font-bold text-copper-200">Admins</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                {/* Search Input */}
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name, email, phone, course or transaction ID..."
                        className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-copper-600 focus:ring-copper-600"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                            ✕ Clear
                        </button>
                    )}
                </div>

                {/* Role Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Role:</span>
                    {[
                        { id: 'all', label: 'All Users' },
                        { id: 'student', label: 'Students' },
                        { id: 'instructor', label: 'Instructors' },
                        { id: 'admin', label: 'Admins' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setRoleFilter(tab.id)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                roleFilter === tab.id
                                    ? 'bg-copper-700 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="surface-card overflow-hidden animate-slide-up rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                                <th className="py-4 px-4 sm:px-6">Name</th>
                                <th className="py-4 px-4 sm:px-6">Email / Phone</th>
                                <th className="py-4 px-4 sm:px-6">Courses & Transaction ID</th>
                                <th className="py-4 px-4 sm:px-6">Status</th>
                                <th className="py-4 px-4 sm:px-6">Assign Role</th>
                                <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-slate-400 text-sm">
                                        No users found matching your search or filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.slice(0, limit).map((user) => {
                                    const isSelf = user.id === currentAdminId;
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                            {/* Name & Avatar */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-copper-600 to-copper-800 text-white font-extrabold text-sm sm:text-base shadow-sm flex-shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-extrabold text-slate-900 text-sm">{user.name}</p>
                                                            {isSelf && (
                                                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            ID: #{user.id} {user.referral_code ? `• ${user.referral_code}` : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email / Phone */}
                                            <td className="py-4 px-4 sm:px-6 text-slate-600">
                                                <div className="font-medium text-slate-800">{user.email || 'No email'}</div>
                                                {user.phone && <div className="text-[11px] text-slate-500 font-mono mt-0.5">{user.phone}</div>}
                                            </td>

                                            {/* Courses & transaction IDs */}
                                            <td className="py-4 px-4 sm:px-6"><Enrollments user={user} onOpen={setViewingUser} onCopy={handleCopy} copiedField={copiedField} /></td>

                                            {/* Status */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                    user.status === 'active' 
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>

                                            {/* Assign Role Dropdown */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <select 
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(e, user.id)}
                                                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-copper-600 focus:ring-copper-600 cursor-pointer shadow-2xs"
                                                >
                                                    <option value="student">Student</option>
                                                    <option value="instructor">Instructor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>

                                            {/* Actions: View and Delete */}
                                            <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* View Detail Button */}
                                                    <button
                                                        onClick={() => setViewingUser(user)}
                                                        type="button"
                                                        title="View user detailed information"
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-copper-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                                                    >
                                                        <svg className="w-4 h-4 text-copper-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>View</span>
                                                    </button>

                                                    {/* Delete Button */}
                                                    {isSelf ? (
                                                        <span 
                                                            title="You cannot delete your own admin account" 
                                                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 text-slate-400 px-2.5 py-1.5 text-[11px] font-bold cursor-not-allowed border border-slate-200"
                                                        >
                                                            <span>🔒 Self</span>
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeletingUser(user)}
                                                            type="button"
                                                            title="Delete this user permanently"
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 hover:border-rose-300 px-3 py-1.5 text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer stats */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                        Showing {Math.min(limit, filteredUsers.length)} of {filteredUsers.length} matching ({users.length} total users)
                        {filteredUsers.length > limit && (<button type="button" onClick={() => setLimit(l => l + PAGE_SIZE)} className="ml-3 rounded-lg bg-copper-700 px-3 py-1 text-[11px] font-bold text-white hover:bg-copper-800">Show {Math.min(PAGE_SIZE, filteredUsers.length - limit)} more</button>)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                        Changes to user roles take effect immediately.
                    </span>
                </div>
            </div>

            {/* ========================================================
                1. USER DETAIL INFO MODAL (VIEW BUTTON)
               ======================================================== */}
            {viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-copper-100 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-copper-600 to-copper-800 text-white font-black text-xl shadow-md">
                                    {viewingUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900">{viewingUser.name}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            viewingUser.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                : viewingUser.role === 'instructor'
                                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                        }`}>
                                            {viewingUser.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                        User ID: #{viewingUser.id} • Registered {viewingUser.created_at ? new Date(viewingUser.created_at).toLocaleDateString() : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingUser(null)}
                                type="button"
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-6 space-y-6">
                            {/* Personal Details Grid */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Personal & Account Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-slate-400">Email Address</span>
                                        <span className="font-semibold text-slate-800 text-sm select-all">{viewingUser.email || 'No email address'}</span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-slate-400">Phone Number</span>
                                        <span className="font-semibold text-slate-800 text-sm font-mono select-all">{viewingUser.phone || 'Not provided'}</span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-slate-400">Account Status</span>
                                        <span className="font-bold text-emerald-700 capitalize">{viewingUser.status || 'active'}</span>
                                    </div>

                                    <div className="rounded-xl border border-copper-200 bg-copper-50/40 p-3 flex items-center justify-between">
                                        <div>
                                            <span className="block text-[10px] font-bold uppercase text-copper-700">Referral Number</span>
                                            <span className="font-black text-copper-900 font-mono text-sm select-all">
                                                {viewingUser.referral_code || 'SL-000000'}
                                            </span>
                                        </div>
                                        {viewingUser.referral_code && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(viewingUser.referral_code, 'modal_ref')}
                                                className="rounded-lg bg-copper-700 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-copper-800 transition"
                                            >
                                                {copiedField === 'modal_ref' ? '✓ Copied' : 'Copy'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Referral Wallet Activity */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Referral Earnings & Wallet
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-emerald-800">Total Earned</span>
                                        <span className="mt-1 block text-base font-black text-slate-900">
                                            {(viewingUser.total_referral_income || 0).toFixed(0)} <span className="text-[10px] font-normal text-slate-500">ETB</span>
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-emerald-200 bg-white p-3 shadow-2xs">
                                        <span className="block text-[10px] font-bold uppercase text-emerald-700">Available</span>
                                        <span className="mt-1 block text-base font-black text-emerald-700">
                                            {(viewingUser.available_referral_balance || 0).toFixed(0)} <span className="text-[10px] font-normal text-slate-500">ETB</span>
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-slate-500">Cashed Out</span>
                                        <span className="mt-1 block text-base font-black text-copper-800">
                                            {(viewingUser.total_cashed_out || 0).toFixed(0)} <span className="text-[10px] font-normal text-slate-500">ETB</span>
                                        </span>
                                    </div>

                                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
                                        <span className="block text-[10px] font-bold uppercase text-amber-800">Pending Out</span>
                                        <span className="mt-1 block text-base font-black text-amber-900">
                                            {(viewingUser.pending_cash_out || 0).toFixed(0)} <span className="text-[10px] font-normal text-slate-500">ETB</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Enrolled Courses / Created Courses */}
                            {viewingUser.role === 'student' && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Enrolled Coaching Programs ({viewingUser.purchased_courses_count || 0})
                                        </h4>
                                        <span className="text-[11px] font-bold text-copper-700">6-Month Access</span>
                                    </div>

                                    {viewingUser.enrollments && viewingUser.enrollments.length > 0 ? (
                                        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden text-xs">
                                            {viewingUser.enrollments.map((course) => (
                                                <div key={course.course_id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="font-extrabold text-slate-900">{course.title}</p>
                                                        <p className="text-[11px] text-slate-500">
                                                            {course.price} ETB{Number(course.price_usd) > 0 ? ` · $${course.price_usd} USD` : ''}
                                                            {course.verified_at && ` • Verified ${new Date(course.verified_at).toLocaleDateString()}`}
                                                            {course.expires_at && ` • Valid until ${new Date(course.expires_at).toLocaleDateString()}`}
                                                        </p>
                                                        {course.transaction_id && (
                                                            <button type="button" onClick={() => handleCopy(course.transaction_id, `m-${course.course_id}`)} className="mt-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600 hover:bg-copper-50">
                                                                TXN: {copiedField === `m-${course.course_id}` ? '✓ Copied' : course.transaction_id}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <span className={`shrink-0 self-start sm:self-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${course.is_expired ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                                                        {course.is_expired ? 'Expired' : '✓ Paid & Enrolled'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
                                            No enrolled courses for this student yet.
                                        </div>
                                    )}
                                </div>
                            )}

                            {viewingUser.role === 'instructor' && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                                        Authored Programs ({viewingUser.courses_count || 0})
                                    </h4>
                                    {viewingUser.courses && viewingUser.courses.length > 0 ? (
                                        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden text-xs">
                                            {viewingUser.courses.map((course) => (
                                                <div key={course.id} className="p-3 flex items-center justify-between gap-2">
                                                    <p className="font-extrabold text-slate-900">{course.title}</p>
                                                    <span className="font-bold text-copper-800">{course.price} ETB</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
                                            No courses authored yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Change Role:</span>
                                <select 
                                    value={viewingUser.role}
                                    onChange={(e) => handleRoleChange(e, viewingUser.id)}
                                    className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-copper-600 focus:ring-copper-600 cursor-pointer"
                                >
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => setViewingUser(null)}
                                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 transition cursor-pointer"
                            >
                                Close Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                2. USER DELETE CONFIRMATION MODAL (DELETE BUTTON)
               ======================================================== */}
            {deletingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-rose-100 animate-slide-up">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-black text-slate-900">Delete User Account</h3>
                                <p className="text-xs text-slate-400">This action is permanent and cannot be undone</p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <p className="text-slate-600 leading-relaxed">
                                Are you sure you want to permanently delete user <strong className="text-slate-900">{deletingUser.name}</strong>?
                            </p>

                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3 space-y-1 font-mono text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Email:</span>
                                    <span className="font-bold text-slate-800">{deletingUser.email || 'N/A'}</span>
                                </div>
                                {deletingUser.phone && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Phone:</span>
                                        <span className="font-bold text-slate-800">{deletingUser.phone}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Current Role:</span>
                                    <span className="font-bold text-copper-800 uppercase">{deletingUser.role}</span>
                                </div>
                            </div>

                            <p className="text-rose-600 text-[11px] leading-relaxed">
                                ⚠️ All associated enrollments, video progress, reviews, and referral records for this user will be removed.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeletingUser(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2 shadow-md shadow-rose-600/20 transition hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Permanently Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
