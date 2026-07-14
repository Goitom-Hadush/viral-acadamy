import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router } from '@inertiajs/react';

export default function CategoryIndex({ categories = [], auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => reset('name'),
        });
    };

    const handleDelete = (categoryId) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', categoryId));
        }
    };

    return (
        <AdminLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Category Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage Categories</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    Organize your courses into different categories. You have {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}.
                </p>
            </div>

            {/* Add Category Form */}
            <div className="surface-card p-8 mb-8 animate-slide-up">
                <h2 className="text-xl font-black text-slate-900 mb-6">Add New Category</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g., Programming, Marketing, Design..."
                            className="input-modern"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-3">{errors.name}</p>}
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            </div>

            {/* Categories Table */}
            <div className="surface-card overflow-hidden animate-slide-up">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-6">Name</th>
                                <th className="p-6">Slug</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="p-12 text-center text-slate-500 text-lg">
                                        No categories yet. Add one above!
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md">
                                                    {cat.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-semibold text-slate-900 text-lg">{cat.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600">{cat.slug}</td>
                                        <td className="p-6 text-right">
                                            <button 
                                                onClick={() => handleDelete(cat.id)}
                                                className="rounded-2xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 hover:shadow-md"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
