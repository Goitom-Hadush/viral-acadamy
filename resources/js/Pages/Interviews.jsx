import AppLayout from '@/Layouts/AppLayout';
import SocialShare from '@/Components/SocialShare';
import { Head, Link } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export default function Interviews({ page = null, interviews = [] }) {
    const t = useT();
    const eyebrow = page?.eyebrow || t('interviews.eyebrow', 'Expert Conversations');
    const headline = page?.headline || t('interviews.headline', 'Interviews & Leadership Insights.');
    const intro = page?.intro || t('interviews.intro', 'Inspiring dialogues with executive coaches, mindset mentors, and high-performing entrepreneurs who share their playbook for success.');
    const description = page?.meta_description || t('interviews.meta_description', 'Interviews with coaches and leaders at Success Life Coaching Academy in Ethiopia.');

    const defaultInterviews = [
        {
            id: 'int-1',
            topic: t('interviews.d1_topic', 'MINDSET BREAKTHROUGHS'),
            title: t('interviews.d1_title', 'Mastering Mental Resilience in Fast-Moving Markets'),
            guest: t('interviews.d1_guest', 'Coach Tewelde Mebrahtu'),
            summary: t('interviews.d1_summary', 'A deep dive into building unshakable self-discipline, silencing imposter syndrome, and maintaining laser focus during tough economic periods.')
        },
        {
            id: 'int-2',
            topic: t('interviews.d2_topic', 'INCOME STRATEGY'),
            title: t('interviews.d2_title', 'From Passion to Profit: Building Online Revenue in Ethiopia'),
            guest: t('interviews.d2_guest', 'Executive Mentor Roundtable'),
            summary: t('interviews.d2_summary', 'Practical tips on monetizing specialized knowledge, taking advantage of local payment tools like Telebirr & CBE, and scaling your brand.')
        }
    ];

    const displayInterviews = interviews.length > 0 ? interviews : defaultInterviews;

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.interviews_title', 'Expert Interviews | Success Life Coaching Academy')}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={t('interviews.og_title', 'Expert Interviews | Success Life Coaching')} />
                <meta property="og:description" content={description} />
            </Head>

            <div className="pb-20 pt-6 sm:pt-10">
                <section className="section-shell">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 mb-3">
                            <span>🎙️</span>
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
                            url="/interviews"
                            title="Success Life Coaching Interviews"
                            text={t('share.interviews', 'Watch inspiring coaching interviews on Success Life Coaching Academy')}
                        />
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        {displayInterviews.map((item) => (
                            <article 
                                id={`interview-${item.id}`} 
                                key={item.id} 
                                className="flex flex-col justify-between overflow-hidden rounded-3xl border border-copper-100 bg-white shadow-sm hover:shadow-md transition"
                            >
                                <div>
                                    {item.video_path ? (
                                        <div className="bg-slate-950 aspect-video w-full">
                                            <video
                                                src={`/media/${item.video_path}`}
                                                controls
                                                playsInline
                                                preload="metadata"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                    ) : item.image_path ? (
                                        <img src={`/media/${item.image_path}`} alt={item.title} className="h-48 w-full object-cover" />
                                    ) : (
                                        <div className="h-44 bg-gradient-to-br from-copper-900 via-copper-800 to-emerald-900 p-6 flex flex-col justify-end text-white">
                                            <span className="text-xs uppercase tracking-widest text-emerald-300 font-bold">{t('interviews.featured_dialogue', 'Featured Dialogue')}</span>
                                            <span className="text-lg font-bold text-white mt-1">{t('interviews.masterclass_series', 'Success Life Masterclass Series')}</span>
                                        </div>
                                    )}

                                    <div className="p-6 sm:p-7">
                                        {item.topic ? (
                                            <span className="inline-flex rounded-full bg-copper-50 border border-copper-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-copper-800">
                                                {item.topic}
                                            </span>
                                        ) : null}
                                        <h2 className="mt-3 text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                                            {item.title}
                                        </h2>
                                        {item.guest ? (
                                            <p className="mt-2 text-xs sm:text-sm font-semibold text-copper-700 flex items-center gap-1.5">
                                                <span>👤</span> {item.guest}
                                            </p>
                                        ) : null}
                                        {item.summary ? (
                                            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                                                {item.summary}
                                            </p>
                                        ) : null}
                                        {item.body ? (
                                            <p className="mt-3 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-slate-600">
                                                {item.body}
                                            </p>
                                        ) : null}
                                        {item.video_url && !item.video_path ? (
                                            <a 
                                                href={item.video_url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="mt-4 inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-copper-700 hover:text-copper-900"
                                            >
                                                <span>{t('interviews.watch_youtube', 'Watch full interview on YouTube')}</span>
                                                <span>➜</span>
                                            </a>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="border-t border-copper-100 p-6 sm:p-7 pt-4 bg-slate-50/50">
                                    <SocialShare
                                        url={`/interviews#interview-${item.id}`}
                                        title={item.title}
                                        text={`${item.title} — ${item.guest || 'Success Life'} | Success Life Coaching Academy`}
                                    />
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link 
                            href={route('testimonials')} 
                            className="inline-flex items-center justify-center rounded-2xl border border-copper-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-copper-50 transition w-full sm:w-auto"
                        >
                            {t('interviews.read_testimonials', 'Read Student Testimonials')}
                        </Link>
                        <Link 
                            href={route('courses.index')} 
                            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-copper-700 to-copper-900 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-copper-glow transition w-full sm:w-auto"
                        >
                            {t('interviews.explore_masterclasses', 'Explore Available Masterclasses')}
                        </Link>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
