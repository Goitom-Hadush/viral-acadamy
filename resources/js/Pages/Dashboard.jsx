import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useT } from '@/hooks/useT';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const t = useT();
    const { auth = { user: null } } = usePage().props;
    const user = auth.user;
    const firstName = user?.name?.split(' ')[0] || t('dash.there', 'there');
    const role = user?.role || 'student';

    const home =
        role === 'admin'
            ? route('admin.dashboard')
            : role === 'instructor'
              ? route('instructor.courses.index')
              : route('student.dashboard');

    const links =
        role === 'admin'
            ? [
                  {
                      href: route('admin.users.index'),
                      label: t('dash.manage_users', 'Manage Users'),
                      desc: t('dash.manage_users_desc', 'View members, roles and referrals'),
                      icon: '👥',
                  },
                  {
                      href: route('admin.courses.index'),
                      label: t('dash.manage_courses', 'Manage Courses'),
                      desc: t('dash.manage_courses_desc', 'Oversee the full course catalog'),
                      icon: '📚',
                  },
                  {
                      href: route('admin.payments.index'),
                      label: t('dash.review_payments', 'Review Payments'),
                      desc: t('dash.review_payments_desc', 'Approve enrolment receipts'),
                      icon: '💳',
                  },
              ]
            : role === 'instructor'
              ? [
                    {
                        href: route('instructor.courses.index'),
                        label: t('dash.my_courses', 'My Courses'),
                        desc: t('dash.my_courses_instr_desc', 'Create and manage your courses'),
                        icon: '📚',
                    },
                    {
                        href: '/instructor/students',
                        label: t('dash.my_students', 'My Students'),
                        desc: t('dash.my_students_desc', 'See who enrolled in your courses'),
                        icon: '🎓',
                    },
                    {
                        href: '/instructor/earnings',
                        label: t('dash.my_earnings', 'My Earnings'),
                        desc: t('dash.my_earnings_desc', 'Track your course revenue'),
                        icon: '💰',
                    },
                ]
              : [
                    {
                        href: route('student.dashboard'),
                        label: t('dash.my_dashboard', 'My Dashboard'),
                        desc: t('dash.my_dashboard_desc', 'Referrals, wallet and progress'),
                        icon: '🏠',
                    },
                    {
                        href: route('student.courses'),
                        label: t('dash.my_courses', 'My Courses'),
                        desc: t('dash.my_courses_student_desc', 'Continue learning where you left off'),
                        icon: '📚',
                    },
                    {
                        href: route('courses.index'),
                        label: t('dash.browse_courses', 'Browse Courses'),
                        desc: t('dash.browse_courses_desc', 'Discover new coaching programs'),
                        icon: '🔍',
                    },
                ];

    return (
        <AuthenticatedLayout>
            <Head title={t('auth.dashboard', 'Dashboard')} />

            <div className="py-10 sm:py-12">
                <div className="section-shell">
                    {/* Welcome hero */}
                    <div className="hero-gradient relative overflow-hidden rounded-3xl p-8 text-white shadow-xl shadow-copper-900/20 sm:p-12 animate-fade-in">
                        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-copper-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                {t('dash.role_account', '{role} account').replace('{role}', role)}
                            </span>
                            <h1 className="mt-4 font-heading text-3xl font-black tracking-tight sm:text-4xl">
                                {t('dash.welcome_back', 'Welcome back, {name} 👋').replace('{name}', firstName)}
                            </h1>
                            <p className="mt-3 text-base leading-7 text-copper-100 sm:text-lg">
                                {t('dash.hub_intro', 'This is your central hub. Jump straight into your {workspace} workspace below.').replace(
                                    '{workspace}',
                                    role === 'instructor'
                                        ? t('dash.ws_teaching', 'teaching')
                                        : role === 'admin'
                                          ? t('dash.ws_management', 'management')
                                          : t('dash.ws_learning', 'learning'),
                                )}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href={home} className="btn-primary">
                                    {t('dash.go_to_dashboard', 'Go to my {role} dashboard').replace('{role}', role)}
                                </Link>
                                <Link
                                    href={route('profile.edit')}
                                    className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                                >
                                    {t('dash.edit_profile', 'Edit profile')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-slide-up">
                        {links.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="surface-card group block p-6 sm:p-7"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-50 text-2xl text-copper-700 transition group-hover:bg-copper-700 group-hover:text-white">
                                    {l.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {l.label}
                                </h3>
                                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                                    {l.desc}
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-copper-700 transition group-hover:gap-2">
                                    {t('dash.open', 'Open')} <span aria-hidden="true">→</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
