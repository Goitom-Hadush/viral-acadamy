import AdminLayout from '@/Layouts/AdminLayout';
import InstructorLayout from '@/Layouts/InstructorLayout';
import StudentLayout from '@/Layouts/StudentLayout';
import { useT } from '@/hooks/useT';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateSocialMediaForm from './Partials/UpdateSocialMediaForm';

export default function Edit({ mustVerifyEmail, status }) {
    const t = useT();
    const { auth = { user: null } } = usePage().props;
    const user = auth.user;

    const content = (
        <>
            <Head title={t('profile.title', 'Profile')} />

            <div className="space-y-8">
                <section className="hero-gradient overflow-hidden rounded-3xl p-8 text-white shadow-xl shadow-copper-500/25 sm:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-copper-100">{t('profile.account_center', 'Account Center')}</p>
                            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t('profile.manage_profile', 'Manage your profile')}</h1>
                            <p className="mt-3 max-w-2xl text-base leading-7 text-copper-100 sm:text-lg">
                                {t('profile.hero_sub', 'Update your name, email address, password, social media, and account settings from one clean page.')}
                            </p>
                        </div>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-black shadow-lg shadow-black/10">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                            <span className="text-copper-100">{t('profile.name_label', 'Name')}: </span>
                            <span className="font-semibold text-white">{user?.name || t('profile.unknown_user', 'Unknown user')}</span>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                            <span className="text-copper-100">{t('profile.email_label', 'Email')}: </span>
                            <span className="font-semibold text-white">{user?.email || t('profile.no_email', 'No email')}</span>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 capitalize">
                            <span className="text-copper-100">{t('profile.role_label', 'Role')}: </span>
                            <span className="font-semibold text-white">{user?.role || 'user'}</span>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="surface-card p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-500">{t('profile.info_eyebrow', 'Profile Info')}</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('profile.personal_details', 'Personal details')}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t('profile.info_desc', 'Keep your account information up to date so your dashboard stays accurate.')}
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
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{t('profile.social_eyebrow', 'Social Media')}</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('profile.contact_information', 'Contact information')}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t('profile.social_desc', 'Add your social media handles so students can contact you easily. These will be displayed on all your courses.')}
                                </p>
                            </div>
                            <UpdateSocialMediaForm className="max-w-2xl" />
                        </div>

                        <div className="surface-card p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-copper-500">{t('profile.security', 'Security')}</p>
                                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('profile.change_password', 'Change password')}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t('profile.security_desc', 'Use a strong password to keep your account protected.')}
                                </p>
                            </div>
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="surface-card p-6 sm:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">{t('profile.quick_tips', 'Quick Tips')}</p>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">{t('profile.account_overview', 'Account overview')}</h2>
                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-copper-100 bg-copper-50 p-4">
                                    <p className="text-sm font-semibold text-copper-900">{t('profile.visibility_title', 'Profile visibility')}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {t('profile.visibility_desc', 'Your name and email shown here are the same details used across the platform.')}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-copper-100 bg-copper-50 p-4">
                                    <p className="text-sm font-semibold text-copper-900">{t('profile.social_contact_title', 'Social contact')}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {t('profile.social_contact_desc', 'Your social media handles help students reach out with course questions.')}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-copper-100 bg-copper-50 p-4">
                                    <p className="text-sm font-semibold text-copper-900">{t('profile.password_security_title', 'Password security')}</p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        {t('profile.password_security_desc', 'Update your password regularly, especially after sharing devices or network access.')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="surface-card border border-rose-200 p-6 sm:p-8">
                            <div className="mb-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600">{t('profile.danger_zone', 'Danger Zone')}</p>
                                <h2 className="mt-2 text-2xl font-black text-rose-700">{t('profile.delete_account_heading', 'Delete account')}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {t('profile.danger_desc', 'Permanently remove your account and all connected data.')}
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
