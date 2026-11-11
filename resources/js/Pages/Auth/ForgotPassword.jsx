import FormErrors from '@/Components/FormErrors';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useT } from '@/hooks/useT';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const t = useT();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={t('auth.forgot_title', 'Forgot Password')} />

            <div className="mb-4 text-sm text-gray-600">
                {t(
                    'auth.forgot_intro',
                    'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
                )}
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <FormErrors errors={errors} />

                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {t('auth.email_reset_link', 'Email Password Reset Link')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
