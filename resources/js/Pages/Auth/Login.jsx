import AuthField from '@/Components/AuthField';
import {
    AcademicCapIcon,
    ArrowRightIcon,
    LockIcon,
    EyeIcon,
    EyeOffIcon,
    ShieldCheckIcon,
    UserIcon,
} from '@/Components/AuthIcons';
import GuestLayout from '@/Layouts/GuestLayout';
import { useT } from '@/hooks/useT';
import { useFormHandler } from '@/hooks/useFormHandler';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Login({ status, canResetPassword }) {
    const t = useT();
    const formRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const { submitForm, focusFirstError } = useFormHandler(
        { data, post, processing, errors, reset },
        {
            onSubmitStart: () => setSubmitAttempted(true),
            onError: () => {
                focusFirstError(formRef.current);
            },
        }
    );

    const submit = (e) => {
        submitForm(e, route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head>
                <title>{t('auth.login_page_title', 'Login | Success Life Coaching')}</title>
                <meta
                    name="description"
                    content={t('auth.login_meta', 'Login to Success Life Coaching to access your courses, track progress, and continue learning.')}
                />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-copper-600">
                    {t('auth.welcome_back', 'Welcome Back')}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-slate-900">
                    {t('auth.login_heading', 'Log in to continue learning')}
                </h2>
                <p className="mt-2.5 text-sm leading-6 text-slate-600">
                    {t('auth.login_sub', 'Access your coaching programs, lessons, and progress from your personal dashboard.')}
                </p>

                {status && (
                    <div className="animate-fade-in mt-5 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {status}
                    </div>
                )}

                <form ref={formRef} onSubmit={submit} className="mt-7 space-y-4" noValidate>
                    {Object.keys(errors).length > 0 && (
                        <div className="animate-fade-in space-y-2 rounded-2xl border border-rose-300 bg-rose-50 p-4 shadow-sm">
                            {Object.entries(errors).map(([field, message]) => (
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
                        id="login"
                        name="login"
                        label={t('auth.email_or_phone', 'Email or Phone Number')}
                        icon={UserIcon}
                        type="text"
                        value={data.login}
                        autoComplete="username"
                        isFocused={true}
                        placeholder="you@example.com"
                        onChange={(e) => setData('login', e.target.value)}
                        error={errors.login}
                    />

                    <AuthField
                        id="password"
                        name="password"
                        label={t('form.password', 'Password')}
                        icon={LockIcon}
                        type={showPassword ? 'text' : 'password'}
                        value={data.password}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
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

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex cursor-pointer select-none items-center gap-2.5">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-copper-600 shadow-sm transition focus:ring-2 focus:ring-copper-500/30 focus:ring-offset-0"
                            />
                            <span className="text-sm text-slate-600">{t('auth.remember_me', 'Remember me')}</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-semibold text-copper-600 underline-offset-4 transition hover:text-copper-800 hover:underline focus:outline-none focus:ring-2 focus:ring-copper-500/30"
                            >
                                {t('auth.forgot_link', 'Forgot your password?')}
                            </Link>
                        )}
                    </div>

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
                                {t('auth.signing_in', 'Signing in…')}
                            </>
                        ) : (
                            <>
                                {t('auth.login_button', 'Log in')}
                                <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {t('auth.new_here', 'New to Success Life Coaching?')}{' '}
                    <Link href={route('register')} className="font-bold text-copper-700 underline-offset-4 transition hover:text-copper-900 hover:underline">
                        {t('auth.create_free', 'Create a free account')}
                    </Link>
                </p>

                {/* Trust signals */}
                <div className="mt-7 flex items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 sm:flex-row">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheckIcon className="h-4 w-4 text-copper-500" />
                        {t('auth.secure_login', 'Secure login')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <AcademicCapIcon className="h-4 w-4 text-copper-500" />
                        {t('auth.progress_saved', 'Your progress is saved')}
                    </span>
                </div>
            </div>
        </GuestLayout>
    );
}
