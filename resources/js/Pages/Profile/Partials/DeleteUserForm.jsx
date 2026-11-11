import DangerButton from '@/Components/DangerButton';
import FormErrors from '@/Components/FormErrors';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useT } from '@/hooks/useT';

export default function DeleteUserForm({ className = '' }) {
    const t = useT();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-5 ${className}`}>
            <DangerButton onClick={confirmUserDeletion}>
                {t('profile.delete_account', 'Delete Account')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <FormErrors errors={errors} />

                    <h2 className="text-lg font-bold text-rose-700">
                        {t('profile.delete_confirm_title', 'Are you sure you want to delete your account?')}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t('profile.delete_confirm_body', 'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.')}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={t('profile.password', 'Password')}
                            className="sr-only"
                        />

                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            isFocused
                            placeholder={t('profile.password', 'Password')}
                            className="input-modern"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {t('common.cancel', 'Cancel')}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {t('profile.delete_account', 'Delete Account')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
