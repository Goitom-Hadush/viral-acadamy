import React, { memo, useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import FormErrors from '@/Components/FormErrors';
import { Link, Head, useForm } from '@inertiajs/react';
import { useT } from '@/hooks/useT';
import CourseThumbnail from '@/Components/CourseThumbnail';


// ── small presentational pieces (memoised so re-renders stay cheap) ─────────
const ICONS = {
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    play: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
    badge: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
};

function Icon({ name, className = 'h-5 w-5' }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name]} />
        </svg>
    );
}

const STAT_TONES = {
    green: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
};

const StatCard = memo(function StatCard({ href, icon, tone, label, value, hint }) {
    return (
        <Link href={href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-copper-200 hover:shadow-md sm:p-5">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${STAT_TONES[tone]}`}>
                <Icon name={icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0">
                <span className="block truncate text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
                <span className="block text-2xl font-black leading-tight text-slate-900">{value}</span>
                {hint ? <span className="block truncate text-[11px] text-slate-400">{hint}</span> : null}
            </span>
        </Link>
    );
});

function ProgressBar({ value, done = false }) {
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
            <div
                className={`h-full rounded-full transition-[width] duration-700 ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#004101] to-emerald-500'}`}
                style={{ width: `${value > 0 ? Math.max(value, 4) : 0}%` }}
            />
        </div>
    );
}

const CourseCard = memo(function CourseCard({ course, t }) {
    const done = course.progress >= 100 && course.videos_count > 0;
    const expiringSoon = !course.is_expired && course.days_left !== null && course.days_left <= 14;

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg">
            <Link href={course.is_expired ? route('courses.show', course.id) : route('student.learn', course.id)} className="group relative block aspect-video">
                <CourseThumbnail thumbnail={course.thumbnail} alt={course.title} className="absolute inset-0" imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-[#004101] shadow">
                    {done ? t('student.completed_badge', '✓ Completed') : `${course.progress}%`}
                </span>
                {course.is_expired ? (
                    <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow">{t('student.expired', 'Expired')}</span>
                ) : expiringSoon ? (
                    <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-black text-white shadow">
                        {t('student.days_left', '{count} days left').replace('{count}', course.days_left)}
                    </span>
                ) : null}
            </Link>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">{course.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{t('student.by_instructor_cap', 'By {name}').replace('{name}', course.instructor?.name || '—')}</p>

                <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{t('student.lessons_progress', '{done} of {total} lessons').replace('{done}', course.completed_count).replace('{total}', course.videos_count)}</span>
                        <span className="text-slate-700">{course.progress}%</span>
                    </div>
                    <ProgressBar value={course.progress} done={done} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
                    {course.is_expired ? (
                        <Link href={route('courses.show', course.id)} className="inline-flex flex-1 items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">
                            {t('student.renew', 'Renew access')}
                        </Link>
                    ) : (
                        <Link href={route('student.learn', course.id)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#004101] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#003301]">
                            {course.progress > 0 && !done ? t('student.continue_short', 'Continue') : done ? t('student.review_course', 'Review') : t('student.start', 'Start')}
                            <span aria-hidden="true">→</span>
                        </Link>
                    )}
                    {course.certificate_number ? (
                        <Link href={route('certificates.show', course.certificate_number)} className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-100" title={t('student.certificate', 'Certificate')}>
                            🎓
                        </Link>
                    ) : null}
                </div>
            </div>
        </article>
    );
});

// Course whose receipt is uploaded and waiting for the administrator to verify it.
const PendingCourseCard = memo(function PendingCourseCard({ course, t }) {
    const submitted = course.submitted_at ? new Date(course.submitted_at).toLocaleDateString() : null;

    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <div className="relative block aspect-video">
                <CourseThumbnail thumbnail={course.thumbnail} alt={course.title} className="absolute inset-0" imgClassName="h-full w-full object-cover opacity-80" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-black text-[#2b2000] shadow">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2b2000]" />
                    {t('student.pending_badge', 'Pending verification')}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">{course.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{t('student.by_instructor_cap', 'By {name}').replace('{name}', course.instructor?.name || '—')}</p>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                    <p className="font-bold">
                        {course.is_renewal
                            ? t('student.pending_renewal_title', '⏳ Renewal waiting for admin')
                            : t('student.pending_title', '⏳ Waiting for the administrator to verify your payment')}
                    </p>
                    <p className="mt-1 text-amber-800">
                        {t('student.pending_text', 'Your receipt was received. The course unlocks automatically as soon as it is verified.')}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between pt-1 text-xs text-slate-500">
                    <span>{submitted ? t('student.submitted_on', 'Submitted {date}').replace('{date}', submitted) : ''}</span>
                    <span className="flex items-center gap-2">
                        <span className="rounded-full bg-[#f6e7b4] px-2.5 py-1 text-[11px] font-extrabold text-[#3b2d08]">
                            {Number(course.amount).toLocaleString()} ETB
                        </span>
                        {Number(course.amount_usd) > 0 && (
                            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-extrabold text-amber-200">
                                ${Number(course.amount_usd).toLocaleString()} USD
                            </span>
                        )}
                    </span>
                </div>

                <button type="button" disabled className="mt-4 inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-400">
                    🔒 {t('student.locked_until_verified', 'Locked until verified')}
                </button>
            </div>
        </article>
    );
});

function HubSkeleton() {
    return (
        <div className="mb-10 animate-pulse rounded-3xl border border-slate-100 bg-white p-6 sm:p-8" aria-hidden="true">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                    <div className="h-6 w-48 rounded-full bg-slate-100" />
                    <div className="h-8 w-3/4 rounded-lg bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-14 w-64 rounded-2xl bg-slate-100" />
                </div>
                <div className="h-48 rounded-3xl bg-slate-100" />
            </div>
        </div>
    );
}


export default function StudentDashboard({ myCourses = [], pendingCourses = [], stats = {}, continue: continueCourse = null, referral, auth }) {
    // Referral data is deferred by the server so the dashboard paints first.
    const referralLoaded = referral !== undefined;
    const t = useT();
    // Splits a translated string on a token and renders a node in its place (keeps word order flexible per language).
    const withNode = (text, token, node) => {
        const [before, after = ''] = text.split(token);
        return <>{before}{node}{after}</>;
    };
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isCashOutOpen, setIsCashOutOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('earnings'); // 'earnings' | 'cashouts'

    const settings = referral?.settings || {
        headline: t('referral.default_headline', '🎁 Student Referral Program'),
        tagline: t('referral.default_tagline', 'Invite Students & Earn 100 ETB'),
        description: t('referral.default_description', 'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive a commission!'),
        reward_type: 'fixed',
        reward_value: 100,
        min_cash_out: 50,
        cash_out_instructions: t('referral.default_cash_out_instructions', 'Cash out requests are processed to your Telebirr or CBE Bank account within 24-48 business hours.'),
        is_active: true,
    };

    const code = referral?.code || auth.user?.referral_code || 'SL-000000';
    const totalIncome = typeof referral?.income === 'number' ? referral.income : parseFloat(referral?.income || 0);
    const availableBalance = typeof referral?.available_balance === 'number' ? referral.available_balance : parseFloat(referral?.available_balance || 0);
    const pendingCashOut = typeof referral?.pending_cash_out === 'number' ? referral.pending_cash_out : parseFloat(referral?.pending_cash_out || 0);
    const totalCashedOut = typeof referral?.total_cashed_out === 'number' ? referral.total_cashed_out : parseFloat(referral?.total_cashed_out || 0);
    const pendingIncome = typeof referral?.pending_income === 'number' ? referral.pending_income : parseFloat(referral?.pending_income || 0);
    const referralsCount = referral?.referrals_count || 0;
    const dealsCount = referral?.deals_count || 0;
    const referralUrl = referral?.referral_url || (typeof window !== 'undefined' ? `${window.location.origin}/?ref=${code}` : `?ref=${code}`);
    const history = referral?.history || [];
    const cashOuts = referral?.cash_outs || [];

    const rewardBadge = settings.reward_type === 'percentage'
        ? `${settings.reward_value}%`
        : `${settings.reward_value} ETB`;

    // Cash Out Form
    const { data: cashOutData, setData: setCashOutData, post: postCashOut, processing: isSubmittingCashOut, errors: cashOutErrors, reset: resetCashOut } = useForm({
        amount: availableBalance >= (settings.min_cash_out || 50) ? availableBalance : '',
        payout_method: 'telebirr',
        account_number: '',
        account_name: auth.user?.name || '',
        bank_name: '',
        student_notes: '',
    });

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
    };

    const shareTelegram = () => {
        const text = encodeURIComponent(t('referral.share_telegram_text', 'Join Success Life Coaching Academy using my referral number {code} to master high-value skills! Enroll here: {url}').replace('{code}', code).replace('{url}', referralUrl));
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`, '_blank');
    };

    const shareWhatsApp = () => {
        const text = encodeURIComponent(t('referral.share_whatsapp_text', 'Join Success Life Coaching Academy with my referral code {code}: {url}').replace('{code}', code).replace('{url}', referralUrl));
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    const handleOpenCashOut = () => {
        setCashOutData(prev => ({
            ...prev,
            amount: availableBalance >= (settings.min_cash_out || 50) ? availableBalance : (settings.min_cash_out || 50),
        }));
        setIsCashOutOpen(true);
    };

    const handleCashOutSubmit = (e) => {
        e.preventDefault();
        postCashOut(route('student.cash-out.store'), {
            onSuccess: () => {
                setIsCashOutOpen(false);
                resetCashOut();
                setActiveTab('cashouts');
            },
        });
    };

    return (
        <StudentLayout>
            <Head>
                <title>{t('student.seo_title', 'Student Dashboard | Success Life Coaching')}</title>
                <meta name="description" content={t('student.seo_description', "Access your coaching programs, track your progress, and continue learning on Success Life Coaching's student dashboard.")} />
                <meta name="keywords" content="student dashboard, success life coaching, personal development, online coaching" />
                <meta property="og:title" content={t('student.seo_title', 'Student Dashboard | Success Life Coaching')} />
                <meta property="og:description" content={t('student.seo_description', "Access your coaching programs, track your progress, and continue learning on Success Life Coaching's student dashboard.")} />
                <meta property="og:type" content="website" />
            </Head>
            {/* ───────── Hero: greeting, overall progress, continue learning ───────── */}
            <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#003301] via-[#004101] to-[#006b02] p-6 text-white shadow-lg sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-300/10" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">{t('student.dashboard', 'Student Dashboard')}</p>
                        <h1 className="mt-1 text-2xl font-black leading-tight sm:text-4xl">
                            {t('student.welcome_back', 'Welcome back, {name}!').replace('{name}', (auth?.user?.name || '').split(' ')[0])}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
                            {myCourses.length === 0
                                ? t('student.empty_hint', 'Pick your first course and start learning today.')
                                : t('student.overall_hint', 'You have completed {done} of {total} lessons across your courses.').replace('{done}', stats.lessons_done ?? 0).replace('{total}', stats.lessons_total ?? 0)}
                        </p>

                        {continueCourse ? (
                            <Link
                                href={route('student.learn', continueCourse.id)}
                                className="mt-5 inline-flex max-w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#004101] shadow-md transition hover:shadow-xl"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#004101] text-white">
                                    <Icon name="play" className="h-5 w-5" />
                                </span>
                                <span className="min-w-0 text-left">
                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('student.continue_learning', 'Continue learning')}</span>
                                    <span className="block truncate text-sm font-extrabold">{continueCourse.title}</span>
                                    {continueCourse.last_lesson ? <span className="block truncate text-[11px] text-slate-500">{continueCourse.last_lesson}</span> : null}
                                </span>
                                <span className="ml-1 shrink-0 text-lg" aria-hidden="true">→</span>
                            </Link>
                        ) : myCourses.length === 0 ? (
                            <Link href={route('courses.index')} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#2b2000] shadow-md hover:bg-amber-300">
                                {t('student.browse_courses', 'Browse Courses')} <span aria-hidden="true">→</span>
                            </Link>
                        ) : null}
                    </div>

                    {/* Overall progress ring (pure CSS, no chart library) */}
                    {myCourses.length > 0 && (
                        <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/10 p-4">
                            <div
                                className="relative flex h-24 w-24 items-center justify-center rounded-full"
                                style={{ background: `conic-gradient(#fbbf24 ${(stats.overall_progress ?? 0) * 3.6}deg, rgba(255,255,255,0.18) 0deg)` }}
                                role="img"
                                aria-label={`${stats.overall_progress ?? 0}%`}
                            >
                                <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#004101]">
                                    <span className="text-xl font-black">{stats.overall_progress ?? 0}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">{t('student.overall_progress', 'Overall progress')}</p>
                                <p className="text-sm text-white/80">{t('student.completed_courses', '{count} completed').replace('{count}', stats.completed ?? 0)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* ───────── Stats ───────── */}
            <section className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <StatCard href={route('student.courses')} icon="book" tone="green" label={t('student.total_courses', 'Total Courses')} value={stats.courses ?? myCourses.length} />
                <StatCard href={route('student.courses')} icon="play" tone="violet" label={t('student.lessons_done', 'Lessons done')} value={`${stats.lessons_done ?? 0}/${stats.lessons_total ?? 0}`} />
                <StatCard href={route('student.courses')} icon="bolt" tone="amber" label={t('student.in_progress', 'In Progress')} value={stats.in_progress ?? 0} />
                <StatCard href={route('certificates.sample')} icon="badge" tone="sky" label={t('student.certificates', 'Certificates')} value={stats.certificates ?? 0} hint={t('student.verifiable_qr', 'Verifiable QR')} />
            </section>

            {/* ───────── My courses ───────── */}
            <section className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{t('student.my_courses', 'My Courses')}</h2>
                    {myCourses.length > 0 && (
                        <Link href={route('student.courses')} className="text-sm font-semibold text-copper-700 hover:text-copper-900">
                            {t('student.view_all', 'View All →')}
                        </Link>
                    )}
                </div>

                {myCourses.length === 0 && pendingCourses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <p className="text-4xl">📚</p>
                        <h3 className="mt-3 text-lg font-bold text-slate-900">{t('student.no_courses_title', 'No courses yet')}</h3>
                        <p className="mt-1 text-sm text-slate-500">{t('student.no_courses_text', 'Enroll in a course and it will show up here with your progress.')}</p>
                        <Link href={route('courses.index')} className="mt-5 inline-flex rounded-xl bg-[#004101] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#003301]">
                            {t('student.browse_courses', 'Browse Courses')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                        {pendingCourses.map((course) => (
                            <PendingCourseCard key={`pending-${course.payment_id}`} course={course} t={t} />
                        ))}
                        {myCourses.slice(0, 6).map((course) => (
                            <CourseCard key={course.id} course={course} t={t} />
                        ))}
                    </div>
                )}
            </section>

            {/* Referral hub loads after first paint (deferred prop) */}
            {!referralLoaded && <HubSkeleton />}
            {/* ========================================================
                DYNAMIC REFERRAL HUB & STUDENT INCOME + CASHOUT CARD
               ======================================================== */}
            {referralLoaded && settings.is_active && (
                <div className="mb-10 overflow-hidden rounded-3xl border border-copper-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-copper-900/5 animate-slide-up">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                        {/* Left: Dynamic Referral Program Info & Code */}
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
                                <span>{settings.headline || t('referral.default_headline', '🎁 Student Referral Program')}</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                                {settings.tagline || t('referral.fallback_tagline', 'Invite Students & Earn {reward}').replace('{reward}', rewardBadge)}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                {settings.description || t('referral.fallback_description', 'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive a {reward} instant reward!').replace('{reward}', rewardBadge)}
                            </p>

                            {/* Referral Number Display with Copy Action */}
                            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-copper-300 bg-copper-50/50 px-4 py-2.5 sm:px-5 sm:py-3 shadow-inner">
                                    <div>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('referral.my_number', 'My Referral Number')}</span>
                                        <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-copper-900 select-all">{code}</span>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        type="button"
                                        className={`rounded-xl px-3.5 py-2 text-xs font-black shadow-xs transition-all ${
                                            copiedCode
                                                ? 'bg-emerald-600 text-white scale-95'
                                                : 'bg-copper-700 hover:bg-copper-800 text-white hover:scale-105 active:scale-95'
                                        }`}
                                    >
                                        {copiedCode ? t('referral.copied', '✓ Copied!') : t('referral.copy_code', 'Copy Code')}
                                    </button>
                                </div>

                                {/* Copy Full Link Button */}
                                <button
                                    onClick={handleCopyLink}
                                    type="button"
                                    className={`rounded-2xl border px-4 py-3 text-xs font-bold transition-all ${
                                        copiedLink
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    {copiedLink ? t('referral.link_copied', '✓ Link Copied!') : t('referral.copy_link', '🔗 Copy Direct Link')}
                                </button>
                            </div>

                            {/* Social Share Buttons */}
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400">{t('referral.quick_share', 'Quick share:')}</span>
                                <button
                                    onClick={shareTelegram}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 hover:bg-sky-100 transition"
                                >
                                    <span>✈️ Telegram</span>
                                </button>
                                <button
                                    onClick={shareWhatsApp}
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                                >
                                    <span>💬 WhatsApp</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Available Balance & Cash Out Card */}
                        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-copper-50/50 p-6 sm:p-7 shadow-sm">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t('referral.student_wallet', 'Student Wallet')}</span>
                                    <h3 className="text-base font-extrabold text-slate-900">{t('referral.balance_payout', 'Referral Balance & Payout')}</h3>
                                </div>
                                <span className="text-2xl">💸</span>
                            </div>

                            {/* Primary Available Balance Display */}
                            <div className="rounded-2xl bg-white border border-emerald-200 p-5 shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                        {t('referral.available_to_cash_out', 'Available to Cash Out')}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                        {t('referral.ready', 'Ready')}
                                    </span>
                                </div>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-black text-slate-900">{availableBalance.toFixed(2)}</span>
                                    <span className="text-sm font-bold text-emerald-700">ETB</span>
                                </div>

                                {/* Pending cash out notice */}
                                {pendingCashOut > 0 && (
                                    <div className="mt-2 text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                                        <span>⏳</span>
                                        <span>{withNode(t('referral.pending_review', '{amount} cash out currently under review by admin'), '{amount}', <strong>{pendingCashOut.toFixed(2)} ETB</strong>)}</span>
                                    </div>
                                )}

                                {/* Cash Out Action Button */}
                                <div className="mt-4 pt-3 border-t border-slate-100">
                                    {availableBalance >= (settings.min_cash_out || 50) ? (
                                        <button
                                            onClick={handleOpenCashOut}
                                            type="button"
                                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-sm py-3 px-4 shadow-md shadow-emerald-700/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                                        >
                                            <span>💸</span>
                                            <span>{t('referral.request_cash_out', 'Request Cash Out')}</span>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <button
                                                disabled
                                                type="button"
                                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs py-2.5 px-4 cursor-not-allowed border border-slate-200"
                                            >
                                                <span>{t('referral.cash_out_locked', '🔒 Cash Out Locked')}</span>
                                            </button>
                                            <p className="text-[11px] text-center text-slate-500">
                                                {withNode(t('referral.minimum_cash_out', 'Minimum cash out is {amount}. Invite more students to withdraw!'), '{amount}', <strong>{(settings.min_cash_out || 50).toFixed(2)} ETB</strong>)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Metrics */}
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-xl bg-white/80 border border-slate-200/80 p-2.5">
                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">{t('referral.total_earned', 'Total Earned')}</span>
                                    <span className="mt-0.5 block text-sm font-extrabold text-slate-900">{totalIncome.toFixed(0)} ETB</span>
                                </div>
                                <div className="rounded-xl bg-white/80 border border-slate-200/80 p-2.5">
                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">{t('referral.cashed_out', 'Cashed Out')}</span>
                                    <span className="mt-0.5 block text-sm font-extrabold text-copper-800">{totalCashedOut.toFixed(0)} ETB</span>
                                </div>
                                <div className="rounded-xl bg-white/80 border border-slate-200/80 p-2.5">
                                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">{t('referral.invited', 'Invited')}</span>
                                    <span className="mt-0.5 block text-sm font-extrabold text-slate-900">{referralsCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========================================================
                        REFERRAL ACTIVITY TABS: EARNINGS vs CASH OUT REQUESTS
                       ======================================================== */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab('earnings')}
                                type="button"
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                    activeTab === 'earnings'
                                        ? 'bg-copper-700 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {t('referral.tab_earnings', '🎁 Referral Earnings ({count})').replace('{count}', history.length)}
                            </button>
                            <button
                                onClick={() => setActiveTab('cashouts')}
                                type="button"
                                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                    activeTab === 'cashouts'
                                        ? 'bg-copper-700 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {t('referral.tab_cashouts', '💸 Cash Out History ({count})').replace('{count}', cashOuts.length)}
                            </button>
                        </div>

                        {/* Tab 1: Referral Earnings */}
                        {activeTab === 'earnings' && (
                            history.length > 0 ? (
                                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden">
                                    {history.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 sm:px-4 text-xs">
                                            <div>
                                                <p className="font-bold text-slate-900">{item.course?.title || t('referral.coaching_course', 'Coaching Course')}</p>
                                                <p className="text-slate-500 text-[11px]">
                                                    {t('referral.student_line', 'Student: {name}').replace('{name}', item.referred_user?.name || t('referral.referred_student', 'Referred Student'))} • {new Date(item.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    item.status === 'credited' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {item.status === 'credited' ? t('referral.credited', '✓ Credited') : t('referral.pending', '⏳ Pending')}
                                                </span>
                                                <span className="font-black text-emerald-700 font-mono text-sm">
                                                    +{parseFloat(item.commission_amount).toFixed(2)} ETB
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 text-slate-500 text-xs">
                                    {withNode(t('referral.no_earnings', 'No referral earnings yet. Share your referral number {code} to start earning!'), '{code}', <strong>{code}</strong>)}
                                </div>
                            )
                        )}

                        {/* Tab 2: Cash Out Requests History */}
                        {activeTab === 'cashouts' && (
                            cashOuts.length > 0 ? (
                                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden">
                                    {cashOuts.map((request) => (
                                        <div key={request.id} className="p-3.5 sm:px-4 text-xs">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-slate-900 text-sm">
                                                            {request.amount.toFixed(2)} ETB
                                                        </span>
                                                        <span className="text-[11px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-md uppercase">
                                                            {request.payout_method === 'telebirr' ? '📱 Telebirr' : request.payout_method === 'cbe' ? '🏦 CBE Bank' : t('referral.bank_transfer', '🏛️ Bank Transfer')}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-500 text-[11px] mt-0.5">
                                                        {t('referral.account_label', 'Account')}: <strong className="text-slate-700">{request.account_number}</strong> ({request.account_name}) • {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                        request.status === 'approved'
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                            : request.status === 'rejected'
                                                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    }`}>
                                                        {request.status === 'approved' ? t('referral.paid_approved', '✓ Paid & Approved') : request.status === 'rejected' ? t('referral.rejected', '✕ Rejected') : t('referral.pending_admin_review', '⏳ Pending Admin Review')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Transaction Ref or Notes if available */}
                                            {request.transaction_reference && (
                                                <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2 font-mono">
                                                    {t('referral.txn_ref', '✓ Payout Txn Ref')}: <strong>{request.transaction_reference}</strong>
                                                </div>
                                            )}
                                            {request.admin_notes && (
                                                <div className="mt-1 text-[11px] text-slate-600 bg-white border border-slate-200 rounded-lg p-2">
                                                    {t('referral.admin_note', 'Admin Note')}: {request.admin_notes}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 text-slate-500 text-xs">
                                    {t('referral.no_cash_outs', 'You have not submitted any cash out requests yet.')}
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* ========================================================
                CASH OUT REQUEST MODAL
               ======================================================== */}
            {isCashOutOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-copper-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">{t('referral.modal_title', '💸 Request Birr Cash Out')}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{t('referral.modal_sub', 'Withdraw your referral commission to your account')}</p>
                            </div>
                            <button
                                onClick={() => setIsCashOutOpen(false)}
                                type="button"
                                aria-label={t('common.close', 'Close')}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCashOutSubmit} className="mt-5 space-y-4">
                            <FormErrors errors={cashOutErrors} />

                            {/* Available Balance Box */}
                            <div className="flex items-center justify-between rounded-2xl bg-emerald-50/80 border border-emerald-200 px-4 py-3">
                                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">{t('referral.available_balance', 'Available Balance')}</span>
                                <span className="text-lg font-black text-emerald-800 font-mono">{availableBalance.toFixed(2)} ETB</span>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('referral.amount_label', 'Cash Out Amount (ETB) *')}</label>
                                    <button
                                        type="button"
                                        onClick={() => setCashOutData('amount', availableBalance)}
                                        className="text-[11px] font-bold text-copper-700 hover:text-copper-800 underline cursor-pointer"
                                    >
                                        {t('referral.withdraw_max', 'Withdraw Max ({amount} ETB)').replace('{amount}', availableBalance.toFixed(0))}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min={settings.min_cash_out || 50}
                                        max={availableBalance}
                                        value={cashOutData.amount}
                                        onChange={(e) => setCashOutData('amount', e.target.value)}
                                        placeholder={t('referral.min_placeholder', 'Min {amount} ETB').replace('{amount}', (settings.min_cash_out || 50).toFixed(0))}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        required
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs font-black text-slate-400">ETB</span>
                                </div>
                                <span className="block text-[11px] text-slate-400 mt-1">
                                    {t('referral.min_max_hint', 'Min cash out: {min} ETB • Max: {max} ETB').replace('{min}', (settings.min_cash_out || 50).toFixed(2)).replace('{max}', availableBalance.toFixed(2))}
                                </span>
                            </div>

                            {/* Payout Method */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">{t('referral.payout_method', 'Payout Method *')}</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'telebirr', label: '📱 Telebirr' },
                                        { id: 'cbe', label: '🏦 CBE Bank' },
                                        { id: 'bank', label: t('referral.other_bank', '🏛️ Other Bank') },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setCashOutData('payout_method', m.id)}
                                            className={`rounded-xl border p-2.5 text-xs font-extrabold text-center transition-all cursor-pointer ${
                                                cashOutData.payout_method === m.id
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bank Name (only if 'bank' is selected) */}
                            {cashOutData.payout_method === 'bank' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">{t('referral.bank_name', 'Bank Name *')}</label>
                                    <input
                                        type="text"
                                        value={cashOutData.bank_name}
                                        onChange={(e) => setCashOutData('bank_name', e.target.value)}
                                        placeholder={t('referral.bank_name_ph', 'e.g. Awash Bank, Dashen Bank, Abyssinia')}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                        required
                                    />
                                </div>
                            )}

                            {/* Account / Phone Number */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    {cashOutData.payout_method === 'telebirr' ? t('referral.telebirr_phone', 'Telebirr Phone Number *') : t('referral.bank_account_number', 'Bank Account Number *')}
                                </label>
                                <input
                                    type="text"
                                    value={cashOutData.account_number}
                                    onChange={(e) => setCashOutData('account_number', e.target.value)}
                                    placeholder={cashOutData.payout_method === 'telebirr' ? '09XXXXXXXX or 07XXXXXXXX' : t('referral.account_number_ph', 'e.g. 1000XXXXXXXX')}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                    required
                                />
                            </div>

                            {/* Account Owner Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">{t('referral.account_owner', 'Account Owner Full Name *')}</label>
                                <input
                                    type="text"
                                    value={cashOutData.account_name}
                                    onChange={(e) => setCashOutData('account_name', e.target.value)}
                                    placeholder={t('referral.account_owner_ph', 'e.g. Abebe Bikila')}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                    required
                                />
                            </div>

                            {/* Student Note */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">{t('referral.notes_label', 'Notes / Instructions (optional)')}</label>
                                <textarea
                                    rows="2"
                                    value={cashOutData.student_notes}
                                    onChange={(e) => setCashOutData('student_notes', e.target.value)}
                                    placeholder={t('referral.notes_ph', 'Any message or instructions for the admin...')}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-xs text-slate-900 focus:border-copper-600 focus:ring-copper-600"
                                />
                            </div>

                            {/* Instructions notice */}
                            {settings.cash_out_instructions && (
                                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                    ℹ️ {settings.cash_out_instructions}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsCashOutOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                                >
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingCashOut || availableBalance < (settings.min_cash_out || 50)}
                                    className="rounded-xl bg-copper-700 hover:bg-copper-800 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2.5 shadow-md shadow-copper-700/20 transition hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    {isSubmittingCashOut ? t('learn.submitting', 'Submitting...') : t('referral.confirm_cash_out', 'Confirm Cash Out Request')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </StudentLayout>
    );
}
