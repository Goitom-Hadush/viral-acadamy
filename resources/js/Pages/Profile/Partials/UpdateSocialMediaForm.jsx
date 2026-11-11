import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useT } from '@/hooks/useT';
import SocialMediaDisplay from '@/Components/SocialMediaDisplay';

export default function UpdateSocialMediaForm({ className = '' }) {
    const t = useT();
    const platforms = useMemo(() => [
        { id: 'telegram', label: 'Telegram', icon: '✈️', placeholder: t('profile.social_ph_username_or_tme', '@username or t.me/username'), help: t('profile.social_help_telegram', 'Your Telegram username or link') },
        { id: 'whatsapp', label: 'WhatsApp', icon: '💬', placeholder: '+1234567890', help: t('profile.social_help_whatsapp', 'Phone number with country code') },
        { id: 'instagram', label: 'Instagram', icon: '📷', placeholder: t('profile.social_ph_username_or_username', '@username or username'), help: t('profile.social_help_instagram', 'Your Instagram username') },
        { id: 'facebook', label: 'Facebook', icon: '👥', placeholder: t('profile.social_ph_username_or_url', 'username or profile URL'), help: t('profile.social_help_facebook', 'Your Facebook profile URL or username') },
        { id: 'twitter', label: 'Twitter / X', icon: '𝕏', placeholder: t('profile.social_ph_username_or_username', '@username or username'), help: t('profile.social_help_twitter', 'Your Twitter/X handle') },
        { id: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: t('profile.social_ph_username', 'username'), help: t('profile.social_help_linkedin', 'Your LinkedIn profile username') },
        { id: 'youtube', label: 'YouTube', icon: '▶️', placeholder: t('profile.social_ph_channel', '@channel or channel-name'), help: t('profile.social_help_youtube', 'Your YouTube channel name') },
        { id: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: t('profile.social_ph_username_or_username', '@username or username'), help: t('profile.social_help_tiktok', 'Your TikTok username') },
    ], [t]);
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            social_media: user.social_media || {},
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleSocialMediaChange = (platform, value) => {
        setData({
            ...data,
            social_media: {
                ...data.social_media,
                [platform]: value,
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <p className="text-sm font-semibold text-slate-500 mb-4">
                        {t('profile.social_intro', "Add your social media handles so students can easily contact you. Leave fields empty if you don't use that platform.")}
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        {platforms.map((platform) => (
                            <div key={platform.id}>
                                <InputLabel 
                                    htmlFor={platform.id}
                                    value={`${platform.icon} ${platform.label}`}
                                    className="font-semibold text-slate-700"
                                />

                                <TextInput
                                    id={platform.id}
                                    className="mt-2 block w-full input-modern"
                                    placeholder={platform.placeholder}
                                    value={data.social_media[platform.id] || ''}
                                    onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                                />

                                <p className="mt-1 text-xs text-slate-500">{platform.help}</p>

                                <InputError className="mt-2" message={errors[`social_media.${platform.id}`]} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-700">{t('profile.preview', 'Preview')}</p>
                    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/20 p-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {t('profile.social_preview_caption', 'How your social media will appear')}
                        </p>
                        <div className="rounded-xl bg-slate-900/50 p-4 backdrop-blur">
                            <SocialMediaDisplay 
                                user={{ social_media: data.social_media }}
                                size="lg"
                                layout="horizontal"
                                rounded={true}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>{t('profile.save_social', 'Save Social Media')}</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">
                            {t('profile.saved_successfully', '✓ Saved successfully')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
