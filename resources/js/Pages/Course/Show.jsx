import AppLayout from '@/Layouts/AppLayout';
import FormErrors from '@/Components/FormErrors';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useT } from '@/hooks/useT';

export default function CourseShow({ 
    course = { title: 'Untitled Course', instructor: { name: 'Unknown Instructor' }, price: 0, videos_count: 0, description: '' }, 
    enrollment = null,
    hasPendingPayment = false,
    auth 
}) {
    const t = useT();
    const { payment_settings: customPaymentSettings, referral_settings: customReferralSettings } = usePage().props;
    const paymentSettings = customPaymentSettings || {
        bank_name: 'Commercial Bank of Ethiopia (CBE)',
        bank_account_name: 'Success Life Coaching',
        bank_account_number: '10000125544',
        telebirr_phone: '0914026415',
        telebirr_name: 'Success Life Coaching',
    };
    const referralSettings = customReferralSettings || {
        reward_type: 'fixed',
        reward_value: 100,
        is_active: true,
    };
    const rewardLabel = referralSettings.reward_type === 'percentage'
        ? `${referralSettings.reward_value}%`
        : `${referralSettings.reward_value} ETB`;

    const [copiedField, setCopiedField] = useState(null);
    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const initialReferral = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('ref') || '') : '';

    const { data, setData, post, processing, errors } = useForm({
        receipt: null,
        referral_code: initialReferral,
    });

    const handleReceiptSubmit = (e) => {
        e.preventDefault();
        post(route('manual.pay', course.id), {
            forceFormData: true,
            onSuccess: () => setData('receipt', null),
        });
    };

    const metaDescription = course.description?.substring(0, 160) || t('course.meta_desc_fallback', 'Learn {title} with Success Life Coaching, premier online coaching and learning platform.').replace('{title}', course.title);
    const coachParts = t('course.coach', 'Coach: {name}').split('{name}');
    const enrolledParts = t('course.access_active_until', 'Your 6-month access is active until {date}').split('{date}');
    const expiredParts = t('course.access_expired_on', 'Your 6-month access expired on {date}. Renew your access for another 6 months below.').split('{date}');
    const hasUsd = Number(course.price_usd) > 0;
    const sendParts = t('course.send_to_accounts', 'Send {price} to one of the following official accounts, then upload your receipt.').split('{price}');

    return (
        <AppLayout>
            <Head title={`${course.title} | Success Life Coaching`}>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={`${course.title}, success life coaching, life coaching, success coaching, personal growth, video tutorial`} />
                <meta property="og:title" content={`${course.title} | Success Life Coaching`} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={course.thumbnail ? `/storage/${course.thumbnail}` : '/logo.png'} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${course.title} | Success Life Coaching`} />
                <meta name="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={course.thumbnail ? `/storage/${course.thumbnail}` : '/logo.png'} />
            </Head>
            <div className="section-shell py-6 sm:py-14 pb-28 sm:pb-14">
                <div className="grid gap-6 sm:gap-8 xl:grid-cols-[minmax(0,1.15fr)_380px]">
                    <div className="surface-card overflow-hidden">
                        <div className="relative">
                            <div className="flex h-60 items-center justify-center overflow-hidden bg-gradient-to-br from-copper-800 via-copper-600 to-bronze text-white sm:h-80 md:h-96">
                                {course.thumbnail ? (
                                    <img 
                                        src={`/storage/${course.thumbnail}`} 
                                        alt={course.title} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <h1 className="px-6 text-center text-2xl font-bold sm:text-4xl md:text-5xl">{course.title}</h1>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
                                <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
                                    {t('course.badge', 'Video Coaching Experience')}
                                </div>
                                <h1 className="mt-2.5 text-balance text-2xl font-black text-white sm:text-4xl lg:text-5xl leading-tight">{course.title}</h1>
                                <p className="mt-2 text-xs text-slate-200 sm:text-base">
                                    {coachParts[0]}<span className="font-semibold text-white">{course.instructor ? course.instructor.name : t('course.default_coach', 'Success Coach')}</span>{coachParts[1]}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 p-4 sm:p-8">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                                <div className="rounded-2xl bg-copper-50/60 p-3 sm:p-4 border border-copper-100/60">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('course.price', 'Price')}</p>
                                    <p className="mt-1 text-xl sm:text-2xl font-black text-copper-800">{course.price} ETB</p>
                                    {hasUsd && <p className="text-sm font-bold text-amber-700">{t('course.or', 'or')} ${course.price_usd} USD</p>}
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('course.lessons', 'Lessons')}</p>
                                    <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">{course.videos_count || 0}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('course.format', 'Format')}</p>
                                    <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">{t('course.hd_video', 'HD Video')}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-3 sm:p-4 border border-slate-100">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{t('course.access', 'Access')}</p>
                                    <p className="mt-1 text-xl sm:text-2xl font-black text-copper-800">{t('course.six_months', '6 Months')}</p>
                                </div>
                            </div>

                            <div className="rounded-[28px] border border-copper-100 bg-white p-1">
                                <div className="rounded-[24px] bg-slate-50 p-6 sm:p-8">
                                    <h2 className="text-2xl font-bold text-slate-900">{t('course.description', 'Course Description')}</h2>
                                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">{course.description}</p>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="rounded-[28px] border border-copper-100 bg-white p-1">
                                <div className="rounded-[24px] bg-slate-50 p-6 sm:p-8">
                                    <h2 className="text-2xl font-bold text-slate-900">{t('course.student_reviews', 'Student Reviews')}</h2>
                                    {course.reviews && course.reviews.length > 0 ? (
                                        <div className="mt-6 space-y-4">
                                            {course.reviews.map((review) => (
                                                <div key={review.id} className="rounded-2xl bg-white p-4 shadow-sm border border-copper-50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-copper-500 to-bronze text-white font-bold">
                                                                {review.user?.name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{review.user?.name || t('course.anonymous', 'Anonymous')}</p>
                                                                <div className="flex items-center gap-1">
                                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-300'}>
                                                                            ★
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="mt-2 text-slate-600">{review.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-slate-500">{t('course.no_reviews', 'No reviews yet. Be the first to review!')}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                {auth.user && (
                                    <button 
                                        onClick={() => router.post(route('wishlist.toggle', course.id))} 
                                        className="btn-secondary w-full gap-2 text-base normal-case tracking-normal sm:w-auto"
                                    >
                                        <span className="text-xl">♥</span>
                                        {t('course.save_wishlist', 'Save to Wishlist')}
                                    </button>
                                )}
                                <Link href="/" className="btn-secondary w-full text-base normal-case tracking-normal sm:w-auto">
                                    {t('course.back_to_courses', 'Back to Courses')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 xl:sticky xl:top-28 xl:self-start">
                        <div className="surface-card overflow-hidden p-6 sm:p-8">
                            <div className="rounded-[28px] bg-gradient-to-br from-copper-600 via-accent to-bronze p-6 text-white shadow-[0_24px_80px_-36px_rgba(0,65,1,0.5)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-copper-100">{t('course.enroll_now', 'Enroll Now')}</p>
                                <p className="mt-4 text-4xl font-black">
                                    {course.price} ETB
                                    {hasUsd && <span className="block sm:inline text-2xl sm:text-3xl font-bold text-amber-200"> {t('course.or', 'or')} ${course.price_usd} USD</span>}
                                </p>
                                <p className="mt-2 text-sm text-copper-100">{t('course.lessons_included', '{count} lessons included').replace('{count}', course.videos_count || 0)}</p>
                            </div>

                            <div className="mt-6 rounded-[28px] border border-copper-100 bg-slate-50 p-5">
                                <h3 className="text-lg font-bold text-slate-900">{t('course.what_you_get', 'What you get')}</h3>
                                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        {t('course.benefit_access', 'Full 6-month access to stream all lessons and modules')}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        {t('course.benefit_progress', 'Continue from your saved progress anytime')}
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
                                        {t('course.benefit_certificate', 'Verifiable certificate upon completing the program')}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div id="purchase" className="surface-card p-6 sm:p-8 scroll-mt-24">
                            {auth.user ? (
                                enrollment && enrollment.is_active ? (
                                    <div className="text-center py-4">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 text-3xl mb-4 shadow-sm border border-emerald-200">
                                            ✓
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{t('course.enrolled', 'You Are Enrolled!')}</h3>
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                            {enrolledParts[0]}<strong className="font-bold text-emerald-700">{enrollment.expires_at}</strong>{enrolledParts[1]}
                                            {enrollment.days_remaining !== null && (
                                                <span className="block mt-1 font-semibold text-slate-700">
                                                    {t('course.days_remaining', '({count} days remaining)').replace('{count}', enrollment.days_remaining)}
                                                </span>
                                            )}
                                        </p>
                                        <Link 
                                            href={route('student.learn', course.id)} 
                                            className="btn-primary w-full mt-6 text-base normal-case tracking-normal py-3.5 shadow-md shadow-copper-700/20 inline-flex items-center justify-center gap-2"
                                        >
                                            {t('course.continue_learning', 'Continue Learning →')}
                                        </Link>
                                    </div>
                                ) : hasPendingPayment ? (
                                    <div className="text-center py-4">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-3xl mb-4 shadow-sm border border-amber-200">
                                            ⏳
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900">{t('course.payment_review', 'Payment Under Review')}</h3>
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                            {t('course.payment_review_body', 'We received your bank payment receipt! Our team is verifying your deposit. Your 6-month course access will unlock immediately once approved.')}
                                        </p>
                                        <Link 
                                            href={route('student.dashboard')} 
                                            className="btn-secondary w-full mt-6 text-sm normal-case tracking-normal py-3 inline-flex items-center justify-center gap-2"
                                        >
                                            {t('course.go_dashboard', 'Go to Student Dashboard')}
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        {enrollment && enrollment.is_expired && (
                                            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 p-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">⚠️</span>
                                                    <div>
                                                        <h4 className="font-bold text-rose-900 text-sm">{t('course.enrollment_expired', 'Enrollment Expired')}</h4>
                                                        <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                                                            {expiredParts[0]}<strong>{enrollment.expires_at}</strong>{expiredParts[1]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                            {enrollment && enrollment.is_expired ? t('course.renew_access', 'Renew 6-Month Access') : t('course.purchase_access', 'Purchase 6-Month Access')}
                                        </h3>
                                        <p className="mt-2 text-sm sm:text-base text-slate-600">
                                            {sendParts[0]}<strong className="text-copper-700">{course.price} ETB{hasUsd ? ` ${t('course.or', 'or')} $${course.price_usd} USD` : ''}</strong>{sendParts[1]}
                                        </p>
                                        
                                        <div className="mt-5 grid grid-cols-1 gap-3.5">
                                            {/* Bank Card (Dynamic) */}
                                            <div className="rounded-2xl border border-copper-200 bg-copper-50/50 p-4 shadow-sm flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                                        🇪🇹 {t('course.local_birr', 'Local · Birr (ETB)')}
                                                    </span>
                                                    <br />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-copper-800 line-clamp-1">
                                                        {paymentSettings.bank_name}
                                                    </span>
                                                    <p className="mt-1 text-xl font-mono font-black text-slate-900 select-all tracking-wide">
                                                        {paymentSettings.bank_account_number}
                                                    </p>
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        {t('course.book_owner', 'Book Owner:')} <span className="font-semibold text-slate-900">{paymentSettings.bank_account_name}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(paymentSettings.bank_account_number, 'bank')}
                                                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-copper-300 text-copper-800 hover:bg-copper-100 transition-colors shadow-sm active:scale-95"
                                                >
                                                    {copiedField === 'bank' ? t('course.copied', '✓ Copied') : t('course.copy_number', 'Copy Number')}
                                                </button>
                                            </div>

                                            {/* Telebirr Card (Dynamic) */}
                                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                                        🇪🇹 {t('course.local_birr', 'Local · Birr (ETB)')}
                                                    </span>
                                                    <br />
                                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                                        {t('course.telebirr_wallet', 'Telebirr Mobile Wallet')}
                                                    </span>
                                                    <p className="mt-1 text-xl font-mono font-black text-slate-900 select-all tracking-wide">
                                                        {paymentSettings.telebirr_phone}
                                                    </p>
                                                    <p className="text-xs text-slate-600 mt-1">
                                                        {t('course.account_name', 'Account Name:')} <span className="font-semibold text-slate-900">{paymentSettings.telebirr_name}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(paymentSettings.telebirr_phone, 'telebirr')}
                                                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm active:scale-95"
                                                >
                                                    {copiedField === 'telebirr' ? t('course.copied', '✓ Copied') : t('course.copy_phone', 'Copy Phone')}
                                                </button>
                                            </div>

                                            {/* Dollar Account for Diaspora Students (Dynamic) */}
                                            {paymentSettings.dollar_account_number && (
                                                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                                                            🌍 {t('course.diaspora_dollar', 'Diaspora · Dollar (USD)')}
                                                        </span>
                                                        <br />
                                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 line-clamp-1">
                                                            {paymentSettings.dollar_bank_name}
                                                        </span>
                                                        <p className="mt-1 text-xl font-mono font-black text-slate-900 select-all tracking-wide break-all">
                                                            {paymentSettings.dollar_account_number}
                                                        </p>
                                                        <p className="text-xs text-slate-600 mt-1">
                                                            {t('course.book_owner', 'Book Owner:')} <span className="font-semibold text-slate-900">{paymentSettings.dollar_account_name}</span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(paymentSettings.dollar_account_number, 'dollar')}
                                                        className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 transition-colors shadow-sm active:scale-95"
                                                    >
                                                        {copiedField === 'dollar' ? t('course.copied', '✓ Copied') : t('course.copy_number', 'Copy Number')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {paymentSettings.instructions && (
                                            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-600 flex items-start gap-2">
                                                <span className="text-sm">ℹ️</span>
                                                <p className="leading-relaxed">{paymentSettings.instructions}</p>
                                            </div>
                                        )}

                                        <form onSubmit={handleReceiptSubmit} className="mt-6 flex flex-col gap-4">
                                            <FormErrors errors={errors} />

                                            {/* Optional Referral Code Input */}
                                            {referralSettings.is_active && (
                                                <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                                            {t('course.referral_number', 'Referral Number')} <span className="text-[11px] font-normal text-slate-400 lowercase">{t('course.optional', '(optional)')}</span>
                                                        </label>
                                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                            {t('course.inviter_bonus', '🎁 {reward} Inviter Bonus').replace('{reward}', rewardLabel)}
                                                        </span>
                                                    </div>
                                                    <div className="relative">
                                                        <input 
                                                            type="text" 
                                                            value={data.referral_code}
                                                            onChange={e => setData('referral_code', e.target.value.toUpperCase())}
                                                            placeholder={t('course.referral_placeholder', 'e.g. SL-590740')}
                                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-mono uppercase tracking-wider text-slate-900 placeholder-slate-400 focus:border-copper-600 focus:ring-copper-600"
                                                        />
                                                        {data.referral_code && (
                                                            <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-bold">
                                                                {t('course.code_entered', '✓ Code Entered')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                                                        {t('course.referral_help', 'Were you invited by another student? Enter their referral number so they earn a {reward} bonus when your enrollment is confirmed.').replace('{reward}', rewardLabel)}
                                                    </p>
                                                    {errors.referral_code && <p className="text-red-500 text-xs mt-1 font-medium">{errors.referral_code}</p>}
                                                </div>
                                            )}

                                            <div className="w-full">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">{t('course.upload_receipt', 'Upload Payment Receipt')}</label>
                                                <div className="relative rounded-2xl border-2 border-dashed border-copper-200 bg-copper-50/20 p-4 text-center hover:bg-copper-50/50 transition-colors">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={e => setData('receipt', e.target.files[0])} 
                                                        className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-copper-700 file:text-white hover:file:bg-copper-800 cursor-pointer"
                                                    />
                                                </div>
                                                {errors.receipt && <p className="text-red-500 text-xs mt-2 font-medium">{errors.receipt}</p>}
                                            </div>
                                            <button 
                                                type="submit" 
                                                disabled={processing}
                                                className="btn-primary w-full text-base normal-case tracking-normal py-3.5 shadow-md shadow-copper-700/20"
                                            >
                                                {processing ? t('course.submitting', 'Submitting receipt...') : t('course.submit_receipt', 'Confirm & Submit Receipt')}
                                            </button>
                                        </form>
                                    </>
                                )
                            ) : (
                                <div className="text-center py-4">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-copper-100 text-copper-800 text-2xl mb-4">
                                        🔒
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{t('course.sign_in_enroll', 'Sign in to Enroll')}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{t('course.sign_in_body', 'Create an account or login to purchase this coaching course and get 6-month access.')}</p>
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <Link href={route('login')} className="btn-primary w-full text-base normal-case tracking-normal py-3">
                                            {t('course.login_purchase', 'Login to Purchase')}
                                        </Link>
                                        <Link href={route('register')} className="btn-secondary w-full text-base normal-case tracking-normal py-3">
                                            {t('course.create_account', 'Create Account')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Enrollment Bar */}
            <div className="xl:hidden fixed bottom-16 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-copper-200/80 px-4 py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{t('course.course_price', 'Course Price')}</p>
                    <p className="text-lg font-black text-copper-800">{course.price} <span className="text-xs font-bold text-slate-600">ETB</span>{hasUsd && <span className="text-xs font-bold text-amber-700"> {t('course.or', 'or')} ${course.price_usd} USD</span>}</p>
                </div>
                {auth.user ? (
                    enrollment && enrollment.is_active ? (
                        <Link 
                            href={route('student.learn', course.id)} 
                            className="btn-primary py-2.5 px-6 text-sm font-bold shadow-md shadow-copper-700/20 active:scale-95 transition-transform"
                        >
                            {t('course.continue_learning', 'Continue Learning →')}
                        </Link>
                    ) : (
                        <a 
                            href="#purchase" 
                            className="btn-primary py-2.5 px-6 text-sm font-bold shadow-md shadow-copper-700/20 active:scale-95 transition-transform"
                        >
                            {enrollment && enrollment.is_expired ? t('course.renew_short', 'Renew Access') : t('course.enroll_now', 'Enroll Now')}
                        </a>
                    )
                ) : (
                    <Link 
                        href={route('login')} 
                        className="btn-primary py-2.5 px-6 text-sm font-bold shadow-md shadow-copper-700/20 active:scale-95 transition-transform"
                    >
                        {t('course.login_enroll', 'Login to Enroll')}
                    </Link>
                )}
            </div>
        </AppLayout>
    );
}
