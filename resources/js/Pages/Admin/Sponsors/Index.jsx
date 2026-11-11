import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, useForm, router, usePage } from '@inertiajs/react';

export default function SponsorsIndex({ sponsors = [], stats = {} }) {
    const { flash } = usePage().props;
    const [viewMode, setViewMode] = useState('table'); // 'table' (Tabulation Form) or 'grid'
    const [tierFilter, setTierFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        tier: 'platinum',
        logo: null,
        website_url: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    const getLogoSrc = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path.replace('/storage/', '/media/');
        if (path.startsWith('/storage/')) return path.replace('/storage/', '/media/');
        if (path.startsWith('/')) return path;
        if (path.startsWith('images/')) return `/${path}`;
        return `/media/${path.replace(/^media\//, '')}`;
    };

    const openCreateModal = () => {
        setEditingSponsor(null);
        setLogoPreview(null);
        reset();
        setData({
            name: '',
            tier: 'platinum',
            logo: null,
            website_url: '',
            description: '',
            sort_order: sponsors.length ? Math.max(...sponsors.map(s => s.sort_order || 0)) + 1 : 1,
            is_active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (sponsor) => {
        setEditingSponsor(sponsor);
        setLogoPreview(getLogoSrc(sponsor.logo_path));
        setData({
            name: sponsor.name,
            tier: sponsor.tier || 'platinum',
            logo: null,
            website_url: sponsor.website_url || '',
            description: sponsor.description || '',
            sort_order: sponsor.sort_order || 0,
            is_active: Boolean(sponsor.is_active),
        });
        setShowModal(true);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSponsor) {
            post(route('admin.sponsors.update', editingSponsor.id), {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('admin.sponsors.store'), {
                forceFormData: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const toggleActive = (id) => {
        router.patch(route('admin.sponsors.toggle', id), {}, { preserveScroll: true });
    };

    const deleteSponsor = (id, name) => {
        if (confirm(`Are you sure you want to delete the sponsor logo for "${name}"? It will immediately stop appearing on the homepage marquee.`)) {
            router.delete(route('admin.sponsors.destroy', id), { preserveScroll: true });
        }
    };

    const filteredSponsors = sponsors.filter((s) => {
        const matchesTier = tierFilter === 'all' || s.tier?.toLowerCase() === tierFilter.toLowerCase();
        const matchesSearch = !searchQuery || 
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            s.website_url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTier && matchesSearch;
    });

    const getTierBadge = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'platinum':
                return {
                    label: 'Platinum Sponsor',
                    icon: '💎',
                    classes: 'bg-cyan-50 text-cyan-900 border border-cyan-300 shadow-xs shadow-cyan-200/50',
                    dot: 'bg-cyan-500',
                };
            case 'gold':
                return {
                    label: 'Gold Sponsor',
                    icon: '🥇',
                    classes: 'bg-amber-50 text-amber-900 border border-amber-300 shadow-xs shadow-amber-200/50',
                    dot: 'bg-amber-500',
                };
            case 'silver':
                return {
                    label: 'Silver Sponsor',
                    icon: '🥈',
                    classes: 'bg-slate-100 text-slate-800 border border-slate-300',
                    dot: 'bg-slate-500',
                };
            case 'bronze':
                return {
                    label: 'Bronze Sponsor',
                    icon: '🥉',
                    classes: 'bg-amber-100/70 text-amber-950 border border-amber-600/40',
                    dot: 'bg-amber-700',
                };
            default:
                return {
                    label: tier || 'Sponsor',
                    icon: '🤝',
                    classes: 'bg-slate-100 text-slate-700 border border-slate-200',
                    dot: 'bg-slate-400',
                };
        }
    };

    return (
        <AdminLayout>
            <Head title="Sponsor Logos Management | Admin" />

            {/* HERO BANNER & STATS */}
            <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#004101] via-[#005a02] to-copper-900 p-6 sm:p-10 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                                🤝 Partnerships & Alliances
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight">
                            Sponsor Logos Directory
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                            Manage official corporate deals and platform sponsors in tabulation format. Add new sponsor logos, edit tier and URL details, or delete logos. Logos display and scroll on the homepage marquee.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg hover:from-amber-300 hover:to-yellow-400 transition active:scale-95 shrink-0"
                    >
                        <span className="text-base">➕</span>
                        <span>Add New Sponsor Logo</span>
                    </button>
                </div>

                {/* STATS METRIC PILLS */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3.5 border border-white/15">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">Total Deals</p>
                        <p className="text-2xl font-black mt-0.5 font-mono text-white">{stats.total || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-cyan-900/40 backdrop-blur-md p-3.5 border border-cyan-400/30">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-200 flex items-center gap-1">
                            <span>💎</span> Platinum
                        </p>
                        <p className="text-2xl font-black mt-0.5 font-mono text-cyan-200">{stats.platinum || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-900/40 backdrop-blur-md p-3.5 border border-amber-400/30">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1">
                            <span>🥇</span> Gold
                        </p>
                        <p className="text-2xl font-black mt-0.5 font-mono text-amber-200">{stats.gold || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-800/40 backdrop-blur-md p-3.5 border border-slate-400/30">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1">
                            <span>🥈</span> Silver
                        </p>
                        <p className="text-2xl font-black mt-0.5 font-mono text-slate-200">{stats.silver || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-950/40 backdrop-blur-md p-3.5 border border-amber-700/30 col-span-2 sm:col-span-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                            <span>🥉</span> Bronze
                        </p>
                        <p className="text-2xl font-black mt-0.5 font-mono text-amber-300">{stats.bronze || 0}</p>
                    </div>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 flex items-center gap-3 animate-slide-up shadow-sm">
                    <span className="text-xl">✓</span>
                    <p className="font-semibold text-sm">{flash.success}</p>
                </div>
            )}

            {/* CONTROLS: FILTER TABS, SEARCH & VIEW MODE SWITCH */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tier Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white p-1.5 border border-slate-200 shadow-2xs">
                    {[
                        { id: 'all', label: `All (${sponsors.length})` },
                        { id: 'platinum', label: `💎 Platinum (${stats.platinum || 0})` },
                        { id: 'gold', label: `🥇 Gold (${stats.gold || 0})` },
                        { id: 'silver', label: `🥈 Silver (${stats.silver || 0})` },
                        { id: 'bronze', label: `🥉 Bronze (${stats.bronze || 0})` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setTierFilter(tab.id)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                tierFilter === tab.id
                                    ? 'bg-[#004101] text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & View Mode Switch */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search sponsors..."
                            className="rounded-2xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-[#004101] focus:ring-1 focus:ring-[#004101] shadow-2xs w-48 sm:w-56"
                        />
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
                    </div>

                    {/* View Toggle: Table (Tabulation) vs Grid */}
                    <div className="flex items-center rounded-2xl bg-white p-1 border border-slate-200 shadow-2xs">
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                                viewMode === 'table'
                                    ? 'bg-[#004101] text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Tabulation Form (Table)"
                        >
                            <span>📋</span>
                            <span>Table</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                                viewMode === 'grid'
                                    ? 'bg-[#004101] text-white shadow-xs'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            title="Grid Card View"
                        >
                            <span>🔲</span>
                            <span>Grid</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* TABULATION VIEW (PRIMARY) */}
            {viewMode === 'table' ? (
                <div className="surface-card overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md animate-slide-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    <th className="py-4 px-4 text-center w-16"># Order</th>
                                    <th className="py-4 px-4 w-24">Logo</th>
                                    <th className="py-4 px-5">Sponsor & Deal Details</th>
                                    <th className="py-4 px-4">Tier</th>
                                    <th className="py-4 px-4">Official Website</th>
                                    <th className="py-4 px-4 text-center">Homepage Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredSponsors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-4xl mb-2">🤝</span>
                                                <p className="text-base font-bold text-slate-800">No sponsors found</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {searchQuery ? `No sponsors match "${searchQuery}"` : 'Get started by adding your first sponsor logo.'}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={openCreateModal}
                                                    className="mt-4 rounded-xl bg-[#004101] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition"
                                                >
                                                    ➕ Add Sponsor Logo
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSponsors.map((sponsor) => {
                                        const badge = getTierBadge(sponsor.tier);
                                        return (
                                            <tr key={sponsor.id} className="hover:bg-slate-50/80 transition-colors">
                                                {/* Sort Order */}
                                                <td className="py-4 px-4 text-center font-mono text-xs font-bold text-slate-500">
                                                    <span className="rounded-lg bg-slate-100 px-2 py-1 border border-slate-200">
                                                        #{sponsor.sort_order || 0}
                                                    </span>
                                                </td>

                                                {/* Logo Thumbnail */}
                                                <td className="py-4 px-4">
                                                    <div className="h-16 w-28 rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-sm">
                                                        {sponsor.logo_path ? (
                                                            <img
                                                                src={getLogoSrc(sponsor.logo_path)}
                                                                alt={sponsor.name}
                                                                className="max-h-full max-w-full object-contain"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    e.currentTarget.parentElement.innerHTML = `<span class="text-xl">${badge.icon}</span>`;
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-xl">{badge.icon}</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Name & Details */}
                                                <td className="py-4 px-5">
                                                    <div className="max-w-md">
                                                        <p className="font-bold text-slate-900 text-sm sm:text-base">
                                                            {sponsor.name}
                                                        </p>
                                                        {sponsor.description ? (
                                                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 leading-relaxed">
                                                                {sponsor.description}
                                                            </p>
                                                        ) : (
                                                            <p className="text-xs text-slate-400 italic mt-0.5">
                                                                No deal description
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Tier Badge */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge.classes}`}>
                                                        <span>{badge.icon}</span>
                                                        <span>{badge.label}</span>
                                                    </span>
                                                </td>

                                                {/* Website */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    {sponsor.website_url ? (
                                                        <a
                                                            href={sponsor.website_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-xs text-copper-700 hover:text-copper-900 hover:underline font-mono"
                                                        >
                                                            <span>🔗</span>
                                                            <span className="truncate max-w-[160px]">
                                                                {sponsor.website_url.replace(/^https?:\/\//, '')}
                                                            </span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">—</span>
                                                    )}
                                                </td>

                                                {/* Homepage Status Toggle */}
                                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleActive(sponsor.id)}
                                                        className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider transition shadow-2xs ${
                                                            sponsor.is_active
                                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                                                        }`}
                                                        title="Click to toggle live status on homepage marquee"
                                                    >
                                                        {sponsor.is_active ? '● Live on Home' : '○ Hidden'}
                                                    </button>
                                                </td>

                                                {/* Actions: Edit & Delete */}
                                                <td className="py-4 px-6 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(sponsor)}
                                                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition shadow-2xs active:scale-95"
                                                        >
                                                            <span>✏️</span>
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                                                            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition shadow-2xs active:scale-95"
                                                        >
                                                            <span>🗑️</span>
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer Summary */}
                    <div className="border-t border-slate-100 bg-slate-50/70 p-4 px-6 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Showing <strong className="text-slate-800">{filteredSponsors.length}</strong> of <strong className="text-slate-800">{sponsors.length}</strong> total sponsors
                        </span>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="font-bold text-[#004101] hover:underline inline-flex items-center gap-1"
                        >
                            <span>➕</span>
                            <span>Add Another Sponsor</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* GRID CARD VIEW (ALTERNATIVE) */
                filteredSponsors.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                        <span className="text-4xl">🤝</span>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">No sponsor logos found</h3>
                        <p className="text-xs text-slate-500 mt-1">
                            {tierFilter !== 'all' ? `No ${tierFilter} sponsors currently.` : 'Upload your first corporate partner logo.'}
                        </p>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="mt-4 rounded-xl bg-[#004101] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-900 transition"
                        >
                            Upload Sponsor Logo
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                        {filteredSponsors.map((sponsor) => {
                            const badge = getTierBadge(sponsor.tier);
                            return (
                                <div
                                    key={sponsor.id}
                                    className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition group"
                                >
                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${badge.classes}`}>
                                                <span>{badge.icon}</span>
                                                <span>{badge.label}</span>
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => toggleActive(sponsor.id)}
                                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider transition ${
                                                    sponsor.is_active
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                            >
                                                {sponsor.is_active ? '● Live on Home' : '○ Hidden'}
                                            </button>
                                        </div>

                                        <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 p-4 border border-slate-100 group-hover:border-copper-200 transition">
                                            {sponsor.logo_path ? (
                                                <img
                                                    src={getLogoSrc(sponsor.logo_path)}
                                                    alt={sponsor.name}
                                                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement.innerHTML = `<span class="text-3xl">${badge.icon}</span>`;
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-3xl">{badge.icon}</span>
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-copper-700 transition">
                                                {sponsor.name}
                                            </h3>
                                            {sponsor.website_url ? (
                                                <a
                                                    href={sponsor.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-copper-700 hover:underline truncate max-w-full font-mono"
                                                >
                                                    <span>🔗</span>
                                                    <span className="truncate">{sponsor.website_url.replace(/^https?:\/\//, '')}</span>
                                                </a>
                                            ) : (
                                                <p className="text-xs text-slate-400 mt-0.5 italic">No website link provided</p>
                                            )}

                                            {sponsor.description && (
                                                <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                    {sponsor.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 bg-slate-50/80 p-3 px-5 flex items-center justify-between gap-2">
                                        <span className="text-[11px] font-mono text-slate-400">
                                            Order: #{sponsor.sort_order || 0}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(sponsor)}
                                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {/* ========================================================
                MODAL: ADD (UPLOAD) & EDIT SPONSOR LOGO
               ======================================================== */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 my-8 animate-scale-up">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#004101] to-[#005a02] p-6 text-white rounded-t-3xl flex items-center justify-between">
                            <div>
                                <span className="rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                    Corporate Partnerships
                                </span>
                                <h3 className="mt-1 text-xl font-black font-serif">
                                    {editingSponsor ? `Edit Sponsor: ${editingSponsor.name}` : 'Upload New Sponsor Logo'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <FormErrors errors={errors} />

                            {/* Sponsor Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Sponsor / Company Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Commercial Bank of Ethiopia (CBE) / Telebirr"
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-copper-500 focus:ring-1 focus:ring-copper-500"
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                            </div>

                            {/* Sponsorship Tier Selection (Platinum, Gold, Silver, Bronze) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Sponsorship Tier <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { id: 'platinum', label: 'Platinum', icon: '💎', color: 'border-cyan-400 bg-cyan-50/50 text-cyan-900' },
                                        { id: 'gold', label: 'Gold', icon: '🥇', color: 'border-amber-400 bg-amber-50/50 text-amber-900' },
                                        { id: 'silver', label: 'Silver', icon: '🥈', color: 'border-slate-300 bg-slate-50 text-slate-800' },
                                        { id: 'bronze', label: 'Bronze', icon: '🥉', color: 'border-amber-700 bg-amber-100/40 text-amber-950' },
                                    ].map((tier) => (
                                        <button
                                            key={tier.id}
                                            type="button"
                                            onClick={() => setData('tier', tier.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                                                data.tier === tier.id
                                                    ? `${tier.color} ring-2 ring-[#004101] shadow-sm font-black`
                                                    : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold'
                                            }`}
                                        >
                                            <span className="text-xl mb-0.5">{tier.icon}</span>
                                            <span className="text-xs">{tier.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.tier && <p className="text-xs text-rose-500 mt-1">{errors.tier}</p>}
                            </div>

                            {/* Logo File Upload */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Sponsor Logo Image (PNG, SVG, JPEG, WebP) {!editingSponsor && <span className="text-rose-500">*</span>}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,.svg"
                                    required={!editingSponsor}
                                    onChange={handleLogoChange}
                                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100"
                                />
                                {logoPreview && (
                                    <div className="mt-3 flex h-24 w-full items-center justify-center rounded-2xl bg-slate-100 p-2 border border-slate-200">
                                        <img src={logoPreview} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                                    </div>
                                )}
                                {errors.logo && <p className="text-xs text-rose-500 mt-1">{errors.logo}</p>}
                            </div>

                            {/* Website URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Official Website Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={data.website_url}
                                    onChange={(e) => setData('website_url', e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800 font-mono"
                                />
                                <p className="mt-0.5 text-[10px] text-slate-400">Clicking the logo on the homepage ticker will open this website.</p>
                            </div>

                            {/* Description / Deal Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Deal Overview / Highlights (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="e.g. Official banking & digital wallet partner nationwide..."
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                                />
                            </div>

                            {/* Display Order & Active Toggle */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pb-2.5">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded text-emerald-700 focus:ring-emerald-500 border-slate-300"
                                        />
                                        <span>Show on Homepage Marquee</span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gradient-to-r from-[#004101] to-[#005a02] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Saving Sponsor Deal...' : editingSponsor ? 'Update Sponsor Details' : 'Publish Sponsor Logo to Homepage 🚀'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
