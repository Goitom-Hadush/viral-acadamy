import AdminLayout from '@/Layouts/AdminLayout';
import InstructorLayout from '@/Layouts/InstructorLayout';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth = { user: null } } = usePage().props;
    const user = auth.user;

    const content = (
        <>
            <Head title="Profile" />

            <div className="space-y-8">
                <section className="hero-gradient overflow-hidden rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Account Center</p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Manage your profile</h1>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                                Update your name, email address, password, and account settings from one clean page.
                            </p>
                        </div>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-black shadow-lg shadow-black/10">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                            <span className="text-indigo-100">Name: </span>
                            <span className="font-semibold text-white">{user?.name || 'Unknown user'}</span>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                            <span className="text-indigo-100">Email: </span>
                            <span className="font-semibold text-white">{user?.email || 'No email'}</span>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 capitalize">
                            <span className="text-indigo-100">Role: </span>
                            <span className="font-semibold text-white">{user?.role || 'user'}</span>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="surface-card p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">Profile Info</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">Personal details</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Keep your account information up to date so your dashboard stays accurate.
                                </p>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>

                        <div className="surface-card p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-500">Security</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">Change password</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Use a strong password to keep your account protected.
                                </p>
                            </div>
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="surface-card p-6 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">Quick Tips</p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">Account overview</h2>
                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm font-semibold text-slate-900">Profile visibility</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Your name and email shown here are the same details used across the platform.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm font-semibold text-slate-900">Password security</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Update your password regularly, especially after sharing devices or network access.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm font-semibold text-slate-900">Need to leave?</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Account deletion is permanent, so use it only when you are sure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="surface-card border border-red-100 p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500">Danger Zone</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">Delete account</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Permanently remove your account and all connected data.
                                </p>
                            </div>
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );

    if (user?.role === 'admin') {
        return <AdminLayout>{content}</AdminLayout>;
    }

    if (user?.role === 'instructor') {
        return <InstructorLayout>{content}</InstructorLayout>;
    }

    return <StudentLayout>{content}</StudentLayout>;
}
