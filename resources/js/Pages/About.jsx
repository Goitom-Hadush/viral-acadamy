import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useT } from '@/hooks/useT';
import { useEffect, useRef, useState } from 'react';

export default function About({ page = null, highlights = [] }) {
    const t = useT();
    const eyebrow = page?.eyebrow || t('about.eyebrow', 'About Our Mission');
    const headline = page?.headline || t('about.headline', 'Empowering Growth, Leadership & Sustainable Success in Ethiopia.');
    const intro = page?.intro || t('about.intro', 'Success Life Coaching Academy helps ambitious individuals, professionals, and creators master high-income skills, cultivate confidence, and achieve their goals through practical online learning.');
    const bannerTitle = page?.banner_title || t('about.banner_title', 'Transform your next chapter.');
    const bannerBody = page?.banner_body || t('about.banner_body', 'Build practical skills, grow your confidence, and take the next step with Success Life Coaching Academy.');
    const description = page?.meta_description || t('about.meta_description', 'Learn about Success Life Coaching Academy and our practical courses for learners in Ethiopia and beyond.');
    const stats = (page?.stats || []).filter((stat) => stat?.value && stat?.label);
    const heroImages = page?.hero_images?.length ? page.hero_images : page?.hero_image_path ? [page.hero_image_path] : [];
    const touchStartX = useRef(null);
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        if (heroImages.length < 2) return undefined;
        const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % heroImages.length), 5000);
        return () => window.clearInterval(timer);
    }, [heroImages.length]);

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.about_title', 'About Success Life Coaching Academy | Online Learning in Ethiopia')}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={t('pages.about_title', 'About Success Life Coaching Academy | Online Learning in Ethiopia')} />
                <meta property="og:description" content={description} />
            </Head>

            <main className="pb-20 pt-4 sm:pt-6">
                <div className="section-shell space-y-16 sm:space-y-24">
                    <section className="home-hero relative overflow-hidden rounded-[28px] border border-[#1d4a28] shadow-[0_36px_90px_-40px_rgba(4,24,10,0.85)] sm:rounded-[36px]">
                        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#e4c36a]/10 blur-3xl" />
                        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
                            <div className="relative z-10">
                                <div className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#e4c36a]/35 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3e2ad] backdrop-blur">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#e4c36a]" />
                                    {eyebrow}
                                </div>
                                <h1 className="home-display max-w-xl text-balance text-[2rem] leading-[1.18] text-white sm:text-5xl">{headline}</h1>
                                {intro ? <p className="mt-5 max-w-xl text-sm leading-7 text-emerald-50/75 sm:text-lg sm:leading-8">{intro}</p> : null}
                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <Link href={route('courses.index')} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-8 py-4 text-base font-bold text-[#1a1404] shadow-[0_14px_40px_-16px_rgba(212,175,55,0.8)] transition hover:-translate-y-0.5 hover:brightness-105">
                                        {t('about.explore_courses', 'Explore our courses')}
                                        <span className="ml-2" aria-hidden="true">→</span>
                                    </Link>
                                    <Link href={route('register')} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-[#e4c36a]/50 hover:bg-white/10">
                                        {t('about.join_academy', 'Join the academy')}
                                    </Link>
                                </div>
                            </div>

                            <div className="relative min-h-[260px]">
                                <div className="relative h-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[#f6e7b4] via-[#c9a227] to-[#8a7018] p-[1.5px] shadow-[0_30px_70px_-28px_rgba(0,0,0,0.7)] sm:rounded-[32px]">
                                    <div
                                        className="relative h-[260px] overflow-hidden rounded-[22px] bg-[#06240c] sm:h-[340px] lg:h-[420px] sm:rounded-[30px]"
                                        aria-label={t('about.photos_aria', 'About page photos')}
                                        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
                                        onTouchEnd={(event) => {
                                            if (touchStartX.current === null || heroImages.length < 2) return;
                                            const distance = event.changedTouches[0].clientX - touchStartX.current;
                                            if (Math.abs(distance) > 45) setHeroIndex((index) => (index + (distance < 0 ? 1 : -1) + heroImages.length) % heroImages.length);
                                            touchStartX.current = null;
                                        }}
                                    >
                                        {heroImages.length ? (
                                            <div className="flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none" style={{ transform: `translateX(-${heroIndex * 100}%)` }}>
                                                {heroImages.map((imagePath, index) => (
                                                    <div key={imagePath} className="relative min-w-full">
                                                        <img className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]" src={`/media/${imagePath}`} alt={t('about.photo_alt', '{headline} photo {n}').replace('{headline}', headline).replace('{n}', index + 1)} loading={index === 0 ? 'eager' : 'lazy'} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#04180a]/55 via-transparent to-transparent" />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex h-full items-end bg-gradient-to-br from-[#0d3b16] via-[#06240c] to-[#04180a] p-8">
                                                <div className="max-w-sm text-white">
                                                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f3e2ad]">Success Life Coaching Academy</span>
                                                    <p className="home-display mt-3 text-2xl sm:text-3xl">{t('about.hero_tagline', 'Learn with purpose. Lead with confidence.')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {heroImages.length > 1 ? (
                                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                                {heroImages.map((imagePath, index) => (
                                                    <button key={imagePath} type="button" onClick={() => setHeroIndex(index)} aria-label={t('about.show_photo', 'Show photo {n}').replace('{n}', index + 1)} aria-current={heroIndex === index ? 'true' : undefined} className={`h-2 rounded-full shadow transition-all ${heroIndex === index ? 'w-8 bg-[#f6e7b4]' : 'w-2 bg-white/55 hover:bg-white/80'}`} />
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {stats.length ? (
                        <section aria-label={t('about.facts_aria', 'Academy facts')} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="rounded-[24px] border border-[#eadcb4] bg-[#fffdf6] p-5 shadow-[0_16px_40px_-30px_rgba(154,123,36,0.7)] sm:p-7">
                                    <p className="home-display text-3xl text-[#06240c] sm:text-4xl">{stat.value}</p>
                                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9a7b24]">{stat.label}</p>
                                </div>
                            ))}
                        </section>
                    ) : null}

                    {highlights.length ? (
                        <section>
                            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
                                <div className="max-w-xl">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('about.different', 'What makes us different')}</p>
                                    <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{page?.section_title || t('about.section_title', 'A better way to learn and grow')}</h2>
                                </div>
                            </div>
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {highlights.map((item, index) => (
                                    <article key={item.id} className="group overflow-hidden rounded-[28px] border border-copper-100 bg-white shadow-[0_18px_40px_-28px_rgba(4,36,12,0.45)] transition duration-300 hover:-translate-y-1 hover:border-[#e4c36a]/70">
                                        {item.image_path ? (
                                            <img src={`/media/${item.image_path}`} alt={item.title} className="aspect-[16/10] w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
                                        ) : (
                                            <div className="flex aspect-[16/10] items-end bg-gradient-to-br from-[#0d3b16] via-[#06240c] to-[#04180a] p-6">
                                                <span className="home-display text-4xl text-[#e4c36a]">{String(index + 1).padStart(2, '0')}</span>
                                            </div>
                                        )}
                                        <div className="relative p-6 sm:p-7">
                                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#06240c] via-[#c9a227] to-[#06240c]" />
                                            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#06240c] text-sm font-bold text-[#f6e7b4]">{String(index + 1).padStart(2, '0')}</span>
                                            <h3 className="home-display text-2xl leading-snug text-slate-900">{item.title}</h3>
                                            <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    <section className="home-hero relative overflow-hidden rounded-[32px] border border-[#1d4a28] px-7 py-12 text-white shadow-[0_36px_80px_-40px_rgba(4,24,10,0.8)] sm:rounded-[40px] sm:px-14 sm:py-16">
                        {page?.banner_image_path ? <img src={`/media/${page.banner_image_path}`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" /> : null}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#04180a] via-[#04180a]/92 to-[#06240c]/75" />
                        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#e4c36a]/20 blur-3xl" />
                        <div className="relative z-10 max-w-2xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f3e2ad]">{t('about.next_step', 'Your next step starts here')}</p>
                            <h2 className="home-display mt-4 text-3xl leading-tight sm:text-5xl">{bannerTitle}</h2>
                            {bannerBody ? <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/75 sm:text-lg">{bannerBody}</p> : null}
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href={route('courses.index')} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-8 py-4 text-base font-bold text-[#1a1404] shadow-[0_14px_40px_-16px_rgba(212,175,55,0.85)] transition hover:-translate-y-0.5">
                                    {t('about.browse_courses', 'Browse courses')}
                                    <span className="ml-2" aria-hidden="true">→</span>
                                </Link>
                                <Link href={route('register')} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-[#e4c36a]/50 hover:bg-white/10">
                                    {t('about.create_account', 'Create your account')}
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
