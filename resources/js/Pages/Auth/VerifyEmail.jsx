import FormErrors from '@/Components/FormErrors';
import PrimaryButton from '@/Components/PrimaryButton';
import { useT } from '@/hooks/useT';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const t = useT();
    const { post, processing, errors } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={t('auth.verify_title', 'Email Verification')} />

            <div className="mb-4 text-sm text-gray-600">
                {t(
                    'auth.verify_intro',
                    "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.",
                )}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {t(
                        'auth.verify_sent',
                        'A new verification link has been sent to the email address you provided during registration.',
                    )}
                </div>
            )}

            <form onSubmit={submit}>
                <FormErrors errors={errors} />

                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {t('auth.resend_verification', 'Resend Verification Email')}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-xl text-sm font-medium text-copper-700 underline hover:text-copper-900 focus:outline-none focus:ring-2 focus:ring-copper-500 focus:ring-offset-2"
                    >
                        {t('auth.logout', 'Log Out')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
