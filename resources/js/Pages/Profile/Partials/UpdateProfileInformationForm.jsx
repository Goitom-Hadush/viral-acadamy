import FormErrors from '@/Components/FormErrors';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const t = useT();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">
                <FormErrors errors={errors} />

                <div>
                    <InputLabel htmlFor="name" value={t('profile.name_label', 'Name')} />
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="input-modern"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value={t('profile.email_label', 'Email')} />
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="input-modern"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
                        <p className="text-amber-800">
                            {t('profile.email_unverified', 'Your email address is unverified.')}
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 inline-flex font-semibold text-copper-700 underline hover:text-copper-900"
                        >
                            {t('profile.resend_verification', 'Click here to re-send the verification email.')}
                        </Link>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-medium text-emerald-700">
                                {t('profile.verification_sent', 'A new verification link has been sent to your email address.')}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('common.save', 'Save')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-slate-600">{t('common.saved', 'Saved.')}</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
