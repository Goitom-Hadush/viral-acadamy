import AuthField from '@/Components/AuthField';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    CheckIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    MailIcon,
    PhoneIcon,
    SparklesIcon,
    UserIcon,
} from '@/Components/AuthIcons';
import GuestLayout from '@/Layouts/GuestLayout';
import { useT } from '@/hooks/useT';
import { useFormHandler } from '@/hooks/useFormHandler';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState, useRef } from 'react';

/** Returns a strength score from 0–4 for a given password. */
function scorePassword(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return Math.min(score, 4);
}

const STRENGTH = [
    { color: 'bg-rose-400', text: 'text-rose-600' },
    { color: 'bg-amber-400', text: 'text-amber-600' },
    { color: 'bg-yellow-400', text: 'text-yellow-600' },
    { color: 'bg-lime-500', text: 'text-lime-600' },
    { color: 'bg-emerald-500', text: 'text-emerald-600' },
];

export default function Register({ status }) {
    const { props } = usePage();
    const flash = props?.flash || {};
    const successMsg = status || flash.success;
    const errorMsg = flash.error;
    const t = useT();
    const formRef = useRef(null);

    const benefits = [
        t('auth.benefit_1', 'Unlock premium masterclasses & courses'),
        t('auth.benefit_2', 'Track your milestones and learning progress'),
        t('auth.benefit_3', 'Access your personal dashboard 24/7'),
        t('auth.benefit_4', 'Earn shareable completion certificates'),
    ];
    const strengthLabels = [
        t('auth.strength_too_weak', 'Too weak'),
        t('auth.strength_weak', 'Weak'),
        t('auth.strength_fair', 'Fair'),
        t('auth.strength_good', 'Good'),
        t('auth.strength_strong', 'Strong'),
    ];
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const strength = useMemo(() => scorePassword(data.password), [data.password]);
    const strengthInfo = STRENGTH[strength] || STRENGTH[0];
    const strengthLabel = strengthLabels[strength] || strengthLabels[0];

    const errorSummaryRef = useRef(null);
    const [clientErrors, setClientErrors] = useState({});
    const [serverFailure, setServerFailure] = useState('');

    const { submitForm } = useFormHandler(
        { data, post, processing, errors, reset },
        {
            onSubmitStart: () => {
                setSubmitAttempted(true);
                setServerFailure('');
            },
        }
    );

    const allErrors = { ...clientErrors, ...errors };
    const errorKeys = Object.keys(allErrors);
    const errorSignature = errorKeys.join('|') + (serverFailure ? '|server' : '');

    // Bring the error summary into view whenever new errors appear.
    useEffect(() => {
        if (!submitAttempted || !errorSignature) return;
        errorSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const first = errorKeys[0];
        const el = first ? formRef.current?.querySelector(`[name="${first}"]`) : null;
        el?.focus({ preventScroll: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorSignature, submitAttempted]);

    const validateClient = () => {
        const v = {};
        if (!data.name.trim()) v.name = t('auth.err_name_required', 'Full name is required.');
        if (!data.phone.trim()) v.phone = t('auth.err_phone_required', 'Phone number is required.');
        if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
            v.email = t('auth.err_email_invalid', 'Please enter a valid email address.');
        }
        if (!data.password) {
            v.password = t('auth.err_password_required', 'Password is required.');
        } else if (data.password.length < 8) {
            v.password = t('auth.err_password_min', 'Password must be at least 8 characters.');
        }
        if (data.password !== data.password_confirmation) {
            v.password_confirmation = t('auth.err_password_mismatch', 'Passwords do not match.');
        }
        return v;
    };

    const submit = (e) => {
        e.preventDefault();
        const v = validateClient();
        setClientErrors(v);
        if (Object.keys(v).length > 0) {
            setSubmitAttempted(true);
            return;
        }
        submitForm(e, route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head>
                <title>{t('auth.register_page_title', 'Register | Success Life Coaching')}</title>
                <meta
                    name="description"
                    content={t('auth.register_meta', 'Create your Success Life Coaching account to start transformative coaching and courses. Register with phone number or email.')}
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-copper-600">
                    {t('auth.create_account_eyebrow', 'Create Account')}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
                    {t('auth.register_heading', 'Start your personal growth journey')}
                </h2>
                <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {t('auth.register_sub', 'Join Success Life Coaching to unlock premium masterclasses, track milestones, and access your personal dashboard.')}
                </p>

                {successMsg && (
                    <div className="animate-fade-in mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {successMsg}
                    </div>
                )}

                <form ref={formRef} onSubmit={submit} className="mt-7 space-y-4" noValidate>
                    {(errorKeys.length > 0 || serverFailure || errorMsg) && (
                        <div ref={errorSummaryRef} role="alert" className="animate-fade-in space-y-2 rounded-2xl border border-rose-300 bg-rose-50 p-4 shadow-sm">
                            {(errorMsg || serverFailure) && (
                                <p className="text-sm font-medium text-rose-700">{errorMsg || serverFailure}</p>
                            )}
                            {Object.entries(allErrors).map(([field, message]) => (
                                <p key={field} className="flex items-center gap-2.5 text-sm font-medium text-rose-700">
                                    <svg className="h-5 w-5 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008Zm9-3.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    {message}
                                </p>
                            ))}
                        </div>
                    )}

                    <AuthField
                        id="name"
                        name="name"
                        label={t('auth.full_name', 'Full Name')}
                        icon={UserIcon}
                        type="text"
                        value={data.name}
                        autoComplete="name"
                        isFocused={true}
                        placeholder={t('auth.full_name_ph', 'Your full name')}
                        onChange={(e) => setData('name', e.target.value)}
                        error={allErrors.name}
                        required
                    />

                    <AuthField
                        id="phone"
                        name="phone"
                        label={t('auth.phone_number', 'Phone Number')}
                        icon={PhoneIcon}
                        type="tel"
                        value={data.phone}
                        autoComplete="tel"
                        placeholder="09xxxxxxxx"
                        onChange={(e) => setData('phone', e.target.value)}
                        error={allErrors.phone}
                        required
                    />

                    <div>
                        <AuthField
                            id="email"
                            name="email"
                            label={t('auth.email_optional', 'Email (Optional)')}
                            icon={MailIcon}
                            type="email"
                            value={data.email}
                            autoComplete="email"
                            placeholder="you@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                            error={allErrors.email}
                        />
                    </div>

                    <div>
                        <AuthField
                            id="password"
                            name="password"
                            label={t('form.password', 'Password')}
                            icon={LockIcon}
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            autoComplete="new-password"
                            placeholder={t('auth.password_ph', 'Create a strong password')}
                            onChange={(e) => setData('password', e.target.value)}
                            error={allErrors.password}
                            required
                            trailing={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? t('form.hide_password', 'Hide password') : t('form.show_password', 'Show password')}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-copper-50 hover:text-copper-700 focus:outline-none focus:ring-2 focus:ring-copper-500/30"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            }
                        />

                        {/* Password strength meter */}
                        {data.password && (
                            <div className="mt-2">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2, 3].map((i) => (
                                        <span
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                                i < strength ? strengthInfo.color : 'bg-slate-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className={`mt-1.5 text-xs font-medium ${strengthInfo.text}`}>
                                    {t('auth.password_strength', 'Password strength: {label}').replace('{label}', strengthLabel)}
                                </p>
                            </div>
                        )}
                    </div>

                    <AuthField
                        id="password_confirmation"
                        name="password_confirmation"
                        label={t('form.confirm_password', 'Confirm Password')}
                        icon={LockIcon}
                        type={showConfirm ? 'text' : 'password'}
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        placeholder={t('auth.confirm_password_ph', 'Re-enter your password')}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={allErrors.password_confirmation}
                        required
                        trailing={
                            <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                tabIndex={-1}
                                aria-label={showConfirm ? t('form.hide_password', 'Hide password') : t('form.show_password', 'Show password')}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-copper-50 hover:text-copper-700 focus:outline-none focus:ring-2 focus:ring-copper-500/30"
                            >
                                {showConfirm ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        }
                    />

                    {/* Benefits checklist */}
                    <ul className="grid grid-cols-1 gap-2.5 rounded-2xl border border-copper-100 bg-copper-50/40 p-4 sm:grid-cols-2">
                        {benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-copper-600 text-white">
                                    <CheckIcon className="h-2.5 w-2.5" />
                                </span>
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <button
                        type="submit"
                        disabled={processing}
                        className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-copper-700 via-accent to-bronze px-6 sm:px-5 py-4 sm:py-3.5 text-base sm:text-sm font-bold uppercase tracking-[0.18em] text-white shadow-copper-glow transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-20px_rgba(0,65,1,0.7)] focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {t('auth.creating_account', 'Creating account…')}
                            </>
                        ) : (
                            <>
                                {t('auth.create_account_button', 'Create account')}
                                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs leading-5 text-slate-400">
                        {t('auth.terms_notice', 'By creating an account, you agree to our Terms of Service and Privacy Policy.')}
                    </p>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {t('auth.already_member', 'Already a member?')}{' '}
                    <Link href={route('login')} className="font-bold text-copper-700 underline-offset-4 transition hover:text-copper-900 hover:underline">
                        {t('auth.sign_in_instead', 'Sign in instead')}
                    </Link>
                </p>

                {/* Trust signals */}
                <div className="mt-7 flex items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 sm:flex-row">
                    <span className="flex items-center gap-1.5">
                        <SparklesIcon className="h-4 w-4 text-copper-500" />
                        {t('auth.free_to_start', 'Free to start')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <AcademicCapIcon className="h-4 w-4 text-copper-500" />
                        {t('auth.own_pace', 'Learn at your own pace')}
                    </span>
                </div>
            </div>
        </GuestLayout>
    );
}
