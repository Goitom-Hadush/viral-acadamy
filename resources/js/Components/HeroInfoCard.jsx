import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';

const SLIDE_MS = 4500;

/**
 * HeroInfoCard — small rotating "why start today" card that floats on the hero video.
 * Uses real numbers from the site (programs / lessons) and links to registration.
 * Auto-rotates, pauses on hover/focus, and can be driven with the dots.
 */
export default function HeroInfoCard({ programs = 0, lessons = 0, ctaHref, ctaLabel, className = '' }) {
    const t = useT();
    const joinLabel = ctaLabel || t('home.join_free', 'Join free');
    const slides = useMemo(
        () => [
            {
                icon: '📚',
                title:
                    programs > 0
                        ? programs === 1
                            ? t('home.hero_card_program_one', '{count} coaching program').replace('{count}', programs)
                            : t('home.hero_card_program_many', '{count} coaching programs').replace('{count}', programs)
                        : t('home.hero_card_video_programs', 'Video coaching programs'),
                text:
                    lessons > 0
                        ? t('home.hero_card_lessons', '{count} video lessons ready to watch today.').replace('{count}', lessons)
                        : t('home.hero_card_practical', 'Practical video lessons you can start today.'),
            },
            {
                icon: '💳',
                title: t('home.hero_card_pay_title', 'Simple local payment'),
                text: t('home.hero_card_pay_text', 'Pay by bank or Telebirr, upload your receipt, start once approved.'),
            },
            {
                icon: '🎓',
                title: t('home.hero_card_cert_title', 'Certificate you can prove'),
                text: t('home.hero_card_cert_text', 'Finish a course and get a certificate anyone can verify by QR code.'),
            },
            {
                icon: '💬',
                title: t('home.hero_card_help_title', 'Real people to help'),
                text: t('home.hero_card_help_text', 'Questions? Chat with us, or message on WhatsApp or Telegram.'),
            },
        ],
        [programs, lessons, t],
    );

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        setReduceMotion(!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    }, []);

    useEffect(() => {
        if (paused || reduceMotion) return undefined;
        const id = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
        return () => clearTimeout(id);
    }, [index, paused, reduceMotion, slides.length]);

    const slide = slides[index];

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={`hero-info-card relative w-[19rem] overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-xl backdrop-blur ${className}`}
        >
            <div className="flex items-start gap-3 p-3.5">
                <div
                    key={`icon-${index}`}
                    className="hero-card-swap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#06240c] to-[#0f4a1c] text-xl shadow-inner"
                    aria-hidden="true"
                >
                    {slide.icon}
                </div>

                <div key={`text-${index}`} className="hero-card-swap min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7b24]">{t('home.hero_card_start', 'Start today')}</p>
                    <p className="truncate text-sm font-bold text-slate-900">{slide.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-600">{slide.text}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-3.5 py-2">
                <div className="flex items-center gap-1.5" role="group" aria-label={t('home.hero_card_highlights', 'Highlights')}>
                    {slides.map((s, i) => (
                        <button
                            key={s.title}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={t('home.hero_card_show', 'Show highlight {n}: {title}').replace('{n}', i + 1).replace('{title}', s.title)}
                            aria-current={i === index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === index ? 'w-5 bg-[#c9a227]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                            }`}
                        />
                    ))}
                </div>

                <Link
                    href={ctaHref}
                    className="group inline-flex items-center gap-1 rounded-full bg-[#06240c] px-3 py-1.5 text-[11px] font-bold text-[#f6e7b4] transition hover:bg-[#0b3515] active:scale-95"
                >
                    {joinLabel}
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </Link>
            </div>

            {/* Progress bar for the current slide (pauses with hover) */}
            {!reduceMotion && (
                <span
                    key={`bar-${index}`}
                    aria-hidden="true"
                    className="hero-card-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-[#c9a227] to-[#f6e7b4]"
                    style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                />
            )}
        </div>
    );
}
