import AdminLayout from '@/Layouts/AdminLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AboutAdmin({ page = null, highlights = [] }) {
    const { flash = {} } = usePage().props;
    const [editingId, setEditingId] = useState(null);

    const pageForm = useForm({
        eyebrow: page?.eyebrow || '',
        headline: page?.headline || '',
        intro: page?.intro || '',
        banner_title: page?.banner_title || '',
        banner_body: page?.banner_body || '',
        meta_description: page?.meta_description || '',
        section_title: page?.section_title || 'Why learners choose our academy',
        stats: page?.stats || [],
        hero_images: [],
        banner_image: null,
        remove_hero_images: [],
        remove_banner_image: false,
    });

    const itemForm = useForm({
        title: '',
        body: '',
        sort_order: '',
        is_published: true,
        image: null,
    });

    const submitPage = (e) => {
        e.preventDefault();
        pageForm.post(route('admin.about.update'), { forceFormData: true });
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        itemForm.setData({
            title: item.title,
            body: item.body,
            sort_order: item.sort_order ?? '',
            is_published: !!item.is_published,
            image: null,
        });
        itemForm.clearErrors();
    };

    const resetItem = () => {
        setEditingId(null);
        itemForm.reset();
        itemForm.setData({ title: '', body: '', sort_order: '', is_published: true });
    };

    const submitItem = (e) => {
        e.preventDefault();
        if (editingId) {
            itemForm.post(route('admin.about.highlights.update', editingId), { forceFormData: true, onSuccess: resetItem });
        } else {
            itemForm.post(route('admin.about.highlights.store'), { forceFormData: true, onSuccess: resetItem });
        }
    };

    return (
        <AdminLayout>
            <Head title="About page | Admin" />

            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">Public content</p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">About page</h1>
                <p className="mt-3 max-w-2xl text-copper-100">Edit the story, mission cards, and banner shown on /about.</p>
            </div>

            {flash.success ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{flash.success}</div> : null}

            <form onSubmit={submitPage} className="surface-card mb-8 space-y-4 p-8">
                <h2 className="text-xl font-black text-slate-900">Page copy</h2>
                <FormErrors errors={pageForm.errors} />
                <input className="input-modern" placeholder="Eyebrow" value={pageForm.data.eyebrow} onChange={(e) => pageForm.setData('eyebrow', e.target.value)} />
                <input className="input-modern" placeholder="Headline" value={pageForm.data.headline} onChange={(e) => pageForm.setData('headline', e.target.value)} />
                <textarea className="input-modern min-h-28" placeholder="Intro" value={pageForm.data.intro} onChange={(e) => pageForm.setData('intro', e.target.value)} />
                <input className="input-modern" placeholder="Banner title" value={pageForm.data.banner_title} onChange={(e) => pageForm.setData('banner_title', e.target.value)} />
                <textarea className="input-modern min-h-24" placeholder="Banner body" value={pageForm.data.banner_body} onChange={(e) => pageForm.setData('banner_body', e.target.value)} />
                <input className="input-modern" placeholder="SEO description" value={pageForm.data.meta_description} onChange={(e) => pageForm.setData('meta_description', e.target.value)} />
                <input className="input-modern" placeholder="Highlights section heading" value={pageForm.data.section_title} onChange={(e) => pageForm.setData('section_title', e.target.value)} />
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3 text-sm font-semibold text-slate-700 sm:col-span-2">
                        <label className="block">About hero images (select multiple)
                            <input className="input-modern mt-2" type="file" accept="image/*" multiple onChange={(e) => pageForm.setData('hero_images', Array.from(e.target.files || []))} />
                        </label>
                        {((page?.hero_images?.length ? page.hero_images : page?.hero_image_path ? [page.hero_image_path] : [])).length > 0 ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {(page.hero_images?.length ? page.hero_images : [page.hero_image_path]).map((path) => <label key={path} className="space-y-2 rounded-xl border border-slate-200 p-2 font-normal">
                                <img className="aspect-video w-full rounded-lg bg-slate-100 object-contain" src={`/media/${path}`} alt="About slide" />
                                <span className="flex items-center gap-2"><input type="checkbox" checked={pageForm.data.remove_hero_images.includes(path)} onChange={(e) => pageForm.setData('remove_hero_images', e.target.checked ? [...pageForm.data.remove_hero_images, path] : pageForm.data.remove_hero_images.filter((item) => item !== path))} /> Remove image</span>
                            </label>)}
                        </div> : null}
                    </div>
                    <label className="block space-y-2 text-sm font-semibold text-slate-700">Callout banner image
                        <input className="input-modern" type="file" accept="image/*" onChange={(e) => pageForm.setData('banner_image', e.target.files?.[0] || null)} />
                        {page?.banner_image_path ? <img className="aspect-video w-full rounded-xl bg-slate-100 object-contain" src={`/media/${page.banner_image_path}`} alt="Current banner" /> : null}
                        {page?.banner_image_path ? <span className="flex items-center gap-2 font-normal"><input type="checkbox" checked={pageForm.data.remove_banner_image} onChange={(e) => pageForm.setData('remove_banner_image', e.target.checked)} /> Remove current image</span> : null}
                    </label>
                </div>
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                    <h3 className="font-bold">Optional statistics</h3>
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="grid gap-3 sm:grid-cols-2">
                            <input className="input-modern" placeholder={`Statistic ${index + 1} value`} value={pageForm.data.stats[index]?.value || ''} onChange={(e) => { const stats = [...pageForm.data.stats]; stats[index] = { ...stats[index], value: e.target.value }; pageForm.setData('stats', stats); }} />
                            <input className="input-modern" placeholder="Label" value={pageForm.data.stats[index]?.label || ''} onChange={(e) => { const stats = [...pageForm.data.stats]; stats[index] = { ...stats[index], label: e.target.value }; pageForm.setData('stats', stats); }} />
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={pageForm.processing} className="btn-primary">{pageForm.processing ? 'Saving...' : 'Save about page'}</button>
            </form>

            <form onSubmit={submitItem} className="surface-card mb-8 space-y-4 p-8">
                <h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit highlight' : 'Add highlight'}</h2>
                <FormErrors errors={itemForm.errors} />
                <input className="input-modern" placeholder="Title" value={itemForm.data.title} onChange={(e) => itemForm.setData('title', e.target.value)} />
                <textarea className="input-modern min-h-24" placeholder="Body" value={itemForm.data.body} onChange={(e) => itemForm.setData('body', e.target.value)} />
                <label className="block space-y-2 text-sm font-semibold text-slate-700">Highlight picture<input className="input-modern" type="file" accept="image/*" onChange={(e) => itemForm.setData('image', e.target.files?.[0] || null)} /></label>
                <input className="input-modern" type="number" min="0" placeholder="Sort order" value={itemForm.data.sort_order} onChange={(e) => itemForm.setData('sort_order', e.target.value)} />
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={!!itemForm.data.is_published} onChange={(e) => itemForm.setData('is_published', e.target.checked)} />
                    Published
                </label>
                <div className="flex gap-3">
                    <button type="submit" disabled={itemForm.processing} className="btn-primary">{editingId ? 'Update highlight' : 'Add highlight'}</button>
                    {editingId ? <button type="button" onClick={resetItem} className="btn-secondary">Cancel</button> : null}
                </div>
            </form>

            <div className="surface-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <th className="p-5">Highlight</th>
                            <th className="p-5">Order</th>
                            <th className="p-5">Status</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {highlights.length === 0 ? (
                            <tr><td colSpan="4" className="p-10 text-center text-slate-500">No highlights yet.</td></tr>
                        ) : highlights.map((item) => (
                            <tr key={item.id}>
                                <td className="p-5">
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    {item.image_path ? <img className="mt-2 aspect-video w-24 rounded-lg bg-slate-100 object-contain" src={`/media/${item.image_path}`} alt="" /> : null}
                                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.body}</p>
                                </td>
                                <td className="p-5 text-slate-600">{item.sort_order}</td>
                                <td className="p-5">{item.is_published ? 'Published' : 'Hidden'}</td>
                                <td className="space-x-2 p-5 text-right">
                                    <button type="button" className="text-sm font-semibold text-copper-700" onClick={() => startEdit(item)}>Edit</button>
                                    <button type="button" className="text-sm font-semibold text-slate-600" onClick={() => router.patch(route('admin.about.highlights.toggle', item.id))}>Toggle</button>
                                    <button type="button" className="text-sm font-semibold text-rose-600" onClick={() => confirm('Delete this highlight?') && router.delete(route('admin.about.highlights.destroy', item.id))}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
