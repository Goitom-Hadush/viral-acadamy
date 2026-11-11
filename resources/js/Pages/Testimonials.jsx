import AppLayout from '@/Layouts/AppLayout';
import SocialShare from '@/Components/SocialShare';
import { Head, Link } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export default function Testimonials({ page = null, testimonials = [] }) {
    const t = useT();
    const eyebrow = page?.eyebrow || t('testimonials.eyebrow', 'Student Breakthroughs');
    const headline = page?.headline || t('testimonials.headline', 'What Our Learners & Leaders Say.');
    const intro = page?.intro || t('testimonials.intro', 'Real feedback from people who transformed their mindset, built consistent habits, and opened new income opportunities with Success Life Coaching.');
    const description = page?.meta_description || t('testimonials.meta_description', 'Student reviews and testimonials for Success Life Coaching Academy in Ethiopia.');

    const defaultReviews = [
        {
            id: 'd-1',
            name: 'Dawit Kebede',
            role: t('testimonials.d1_role', 'Digital Creator & Entrepreneur'),
            location: t('testimonials.d1_location', 'Addis Ababa'),
            rating: 5,
            quote: t('testimonials.d1_quote', 'Success Life Coaching completely changed how I approach goal setting and daily discipline. The video masterclasses are crisp, practical, and tailored for our reality in Ethiopia. Paying via Telebirr took under 60 seconds!')
        },
        {
            id: 'd-2',
            name: 'Selamawit Bekele',
            role: t('testimonials.d2_role', 'Marketing Lead'),
            location: t('testimonials.d2_location', 'Hawassa'),
            rating: 5,
            quote: t('testimonials.d2_quote', 'The mindset shift alone doubled my workplace performance. Being able to watch lessons directly on my phone with zero lag is fantastic. Highly recommended for anyone ready to level up!')
        },
        {
            id: 'd-3',
            name: 'Yonas Abebe',
            role: t('testimonials.d3_role', 'Freelancer & Tech Consultant'),
            location: t('testimonials.d3_location', 'Mekelle'),
            rating: 5,
            quote: t('testimonials.d3_quote', 'The video lessons cut straight to the point without fluff. I especially appreciate the mobile experience, the direct receipt verification, and the actionable business insights.')
        }
    ];

    const displayTestimonials = testimonials.length > 0 ? testimonials : defaultReviews;

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.testimonials_title', 'Student Testimonials | Success Life Coaching Academy')}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={t('testimonials.og_title', 'Student Testimonials | Success Life Coaching')} />
                <meta property="og:description" content={description} />
            </Head>

            <div className="pb-20 pt-6 sm:pt-10">
                <section className="section-shell">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 mb-3">
                            <span>💬</span>
                            <span>{eyebrow}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                            {headline}
                        </h1>
                        {intro ? (
                            <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                                {intro}
                            </p>
                        ) : null}
                    </div>

                    <div className="mt-6 max-w-xl">
                        <SocialShare
                            url="/testimonials"
                            title="Success Life Coaching Testimonials"
                            text={t('share.testimonials', 'See what learners say about Success Life Coaching Academy')}
                        />
                    </div>

                    {/* Testimonials Grid */}
                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {displayTestimonials.map((item) => (
                            <blockquote
                                id={`testimonial-${item.id}`}
                                key={item.id}
                                className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-copper-100/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition"
                            >
                                <div>
                                    {/* Star Rating */}
                                    <div className="flex items-center gap-1 text-amber-400 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    {item.video_path ? (
                                        <div className="mb-4 overflow-hidden rounded-2xl bg-slate-950">
                                            <video
                                                src={`/media/${item.video_path}`}
                                                controls
                                                playsInline
                                                preload="metadata"
                                                className="aspect-video w-full object-contain"
                                            />
                                        </div>
                                    ) : null}

                                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 italic">
                                        “{item.quote}”
                                    </p>
                                </div>

                                <div className="mt-6 border-t border-copper-100 pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-copper-700 to-copper-900 text-sm font-bold text-white shadow-sm">
                                            {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {item.role || t('testimonials.verified_student', 'Verified Student')} {item.location ? `• ${item.location}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <SocialShare
                                            url={`/testimonials#testimonial-${item.id}`}
                                            title={`${item.name} — Success Life Coaching`}
                                            text={`“${item.quote}” — ${item.name} | Success Life Coaching Academy`}
                                        />
                                    </div>
                                </div>
                            </blockquote>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center">
                        <Link 
                            href={route('courses.index')} 
                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-copper-700 to-copper-900 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-copper-glow transition active:scale-95"
                        >
                            {t('testimonials.browse_all', 'Browse All Coaching Masterclasses ➜')}
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
