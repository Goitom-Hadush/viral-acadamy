import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { useForm, router } from '@inertiajs/react';
import { memo, useMemo, useState } from 'react';

// A stable colour per category so the avatar is easy to recognise at a glance.
const PALETTE = [
    'from-emerald-500 to-emerald-700',
    'from-amber-400 to-orange-600',
    'from-sky-500 to-indigo-600',
    'from-fuchsia-500 to-purple-600',
    'from-rose-500 to-red-600',
    'from-teal-500 to-cyan-600',
];
const colorFor = (id) => PALETTE[Math.abs(Number(id) || 0) % PALETTE.length];

const PencilIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CategoryRow = memo(function CategoryRow({ cat, onEdit, onDelete }) {
    return (
        <tr className="group transition-colors hover:bg-slate-50/80">
            <td className="px-4 py-3.5 sm:px-6">
                <div className="flex items-center gap-3.5">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorFor(cat.id)} text-lg font-black text-white shadow-md ring-4 ring-white`}>
                        {cat.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-base font-bold text-slate-900">{cat.name}</p>
                        <p className="font-mono text-xs text-slate-400 sm:hidden">/{cat.slug}</p>
                    </div>
                </div>
            </td>

            <td className="hidden px-4 py-3.5 sm:table-cell sm:px-6">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">/{cat.slug}</span>
            </td>

            <td className="px-4 py-3.5 sm:px-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {cat.courses_count ?? 0} {(cat.courses_count ?? 0) === 1 ? 'course' : 'courses'}
                </span>
            </td>

            <td className="px-4 py-3.5 sm:px-6">
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(cat)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#004101] to-[#006b02] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                    >
                        <PencilIcon /> <span>Edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(cat)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                    >
                        <TrashIcon /> <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
});

function Modal({ open, onClose, children }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default function CategoryIndex({ categories = [] }) {
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    // Create
    const createForm = useForm({ name: '' });
    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.categories.store'), {
            preserveScroll: true,
            onSuccess: () => createForm.reset('name'),
        });
    };

    // Edit
    const editForm = useForm({ name: '' });
    const openEdit = (cat) => {
        editForm.setData('name', cat.name);
        editForm.clearErrors();
        setEditing(cat);
    };
    const closeEdit = () => {
        if (editForm.processing) return;
        setEditing(null);
        editForm.clearErrors();
    };
    const handleEdit = (e) => {
        e.preventDefault();
        if (!editing) return;
        editForm.put(route('admin.categories.update', editing.id), {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    // Delete
    const confirmDelete = () => {
        if (!deleting) return;
        setDeleteBusy(true);
        router.delete(route('admin.categories.destroy', deleting.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleteBusy(false);
                setDeleting(null);
            },
        });
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? categories.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)) : categories;
    }, [categories, query]);

    const totalCourses = categories.reduce((sum, c) => sum + (c.courses_count || 0), 0);
    const unchanged = editing && editForm.data.name.trim() === editing.name;

    return (
        <AdminLayout>
            {/* Header + quick stats */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Categories</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} · {totalCourses} course{totalCourses === 1 ? '' : 's'} organised
                    </p>
                </div>
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search categories…"
                    aria-label="Search categories"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-copper-500 focus:ring-copper-500 sm:w-72"
                />
            </div>

            {/* Add category */}
            <form onSubmit={handleCreate} className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <label htmlFor="new-category" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Add a new category</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="new-category"
                        type="text"
                        value={createForm.data.name}
                        onChange={(e) => createForm.setData('name', e.target.value)}
                        placeholder="e.g., Mindset, Leadership, Personal Growth…"
                        className="input-modern flex-1"
                    />
                    <button type="submit" disabled={createForm.processing || !createForm.data.name.trim()} className="btn-primary disabled:opacity-60">
                        {createForm.processing ? 'Adding…' : '+ Add category'}
                    </button>
                </div>
                {createForm.errors.name && <p className="mt-2 text-sm font-medium text-rose-600">{createForm.errors.name}</p>}
            </form>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {filtered.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <p className="text-4xl">🏷️</p>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">{categories.length === 0 ? 'No categories yet' : 'No matches'}</h3>
                        <p className="mt-1 text-sm text-slate-500">{categories.length === 0 ? 'Add your first category above.' : 'Try a different search.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 sm:px-6">Name</th>
                                    <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Slug</th>
                                    <th className="px-4 py-3 sm:px-6">Courses</th>
                                    <th className="px-4 py-3 text-right sm:px-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((cat) => (
                                    <CategoryRow key={cat.id} cat={cat} onEdit={openEdit} onDelete={setDeleting} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit modal */}
            <Modal open={!!editing} onClose={closeEdit}>
                {editing && (
                    <form onSubmit={handleEdit}>
                        <div className="bg-gradient-to-r from-[#003301] to-[#006b02] px-6 py-5 text-white">
                            <div className="flex items-center gap-3">
                                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorFor(editing.id)} text-xl font-black shadow-lg ring-4 ring-white/20`}>
                                    {(editForm.data.name || editing.name).charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Edit category</p>
                                    <h3 className="truncate text-lg font-extrabold">{editing.name}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 px-6 py-6">
                            <FormErrors errors={editForm.errors} />

                            <div>
                                <label htmlFor="edit-category" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Category name</label>
                                <input
                                    id="edit-category"
                                    type="text"
                                    autoFocus
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="input-modern"
                                />
                                <p className="mt-2 text-xs text-slate-400">
                                    The link updates automatically{editing.courses_count ? ` and ${editing.courses_count} course${editing.courses_count === 1 ? '' : 's'} keep this category` : ''}.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                            <button type="button" onClick={closeEdit} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={editForm.processing || !editForm.data.name.trim() || unchanged} className="btn-primary disabled:opacity-60">
                                {editForm.processing ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Delete confirmation */}
            <Modal open={!!deleting} onClose={() => !deleteBusy && setDeleting(null)}>
                {deleting && (
                    <div className="p-6">
                        <div className="flex items-start gap-4 rounded-2xl bg-rose-50 p-5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">⚠️</span>
                            <div>
                                <p className="font-bold text-slate-900">Delete “{deleting.name}”?</p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {deleting.courses_count > 0
                                        ? `${deleting.courses_count} course${deleting.courses_count === 1 ? '' : 's'} in this category will also be deleted. This cannot be undone.`
                                        : 'This category has no courses. This cannot be undone.'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end gap-3">
                            <button type="button" onClick={() => setDeleting(null)} disabled={deleteBusy} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button type="button" onClick={confirmDelete} disabled={deleteBusy} className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-60">
                                {deleteBusy ? 'Deleting…' : 'Delete category'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
