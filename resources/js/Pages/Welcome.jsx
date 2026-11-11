import AnimatedHeadline from '@/Components/AnimatedHeadline';
import CoursePriceBadges from '@/Components/CoursePriceBadges';
import AnimatedUrl from '@/Components/AnimatedUrl';
import AppDownloads from '@/Components/AppDownloads';
import HeroInfoCard from '@/Components/HeroInfoCard';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useT } from '@/hooks/useT';

const getFeatures = (t) => [
    {
        icon: '🧠',
        title: t('home.feat1_title', 'Proven Mindset Frameworks'),
        description: t('home.feat1_desc', 'Transform self-limiting beliefs into unshakable confidence with actionable coaching engineered for real breakthroughs.'),
        badge: t('home.feat1_badge', 'Mental Mastery')
    },
    {
        icon: '📱',
        title: t('home.feat2_title', 'Mobile-First HD Learning'),
        description: t('home.feat2_desc', 'Watch crystal-clear HD lessons on your phone or computer with low data consumption and automatic progress tracking.'),
        badge: t('home.feat2_badge', 'Learn Anywhere')
    },
    {
        icon: '⚡',
        title: t('home.feat3_title', 'Instant CBE & Telebirr Access'),
        description: t('home.feat3_desc', 'No foreign cards required. Pay safely in Ethiopian Birr with fast verification and zero transaction delays.'),
        badge: t('home.feat3_badge', 'Instant Activation')
    },
    {
        icon: '🏆',
        title: t('home.feat4_title', 'Accredited Certifications'),
        description: t('home.feat4_desc', 'Earn verifiable certificates of completion to validate your skills and boost your professional credentials.'),
        badge: t('home.feat4_badge', 'Career Boost')
    }
];

const getSteps = (t) => [
    {
        step: '01',
        title: t('home.step1_title', 'Choose Your Coaching Program'),
        description: t('home.step1_desc', 'Explore curated courses in mindset, leadership, executive success, and career acceleration.'),
        icon: '🎯'
    },
    {
        step: '02',
        title: t('home.step2_title', 'Instant Activation'),
        description: t('home.step2_desc', 'Complete your one-time tuition safely via Telebirr or CBE with simple receipt upload.'),
        icon: '💳'
    },
    {
        step: '03',
        title: t('home.step3_title', 'Transform & Build Income'),
        description: t('home.step3_desc', 'Watch focused lessons, apply proven habits daily, and unlock your highest earning potential.'),
        icon: '🚀'
    }
];

const getTestimonials = (t) => [
    {
        name: 'Dawit Kebede',
        role: t('home.tm1_role', 'Digital Entrepreneur & Creator'),
        location: t('home.loc_addis', 'Addis Ababa'),
        avatar: 'DK',
        avatarBg: 'from-emerald-600 to-copper-800',
        rating: 5,
        quote: t('home.tm1_quote', 'Success Life Coaching completely changed how I approach goal setting and daily discipline. The video masterclasses are crisp, practical, and tailored for our reality in Ethiopia.')
    },
    {
        name: 'Selamawit Bekele',
        role: t('home.tm2_role', 'Executive Marketing Lead'),
        location: t('home.loc_hawassa', 'Hawassa'),
        avatar: 'SB',
        avatarBg: 'from-copper-700 to-accent',
        rating: 5,
        quote: t('home.tm2_quote', 'Paying through Telebirr took less than a minute, and I was learning on my phone right away. The mindset shift alone doubled my workplace performance.')
    },
    {
        name: 'Yonas Abebe',
        role: t('home.tm3_role', 'Tech Lead & Freelancer'),
        location: t('home.loc_mekelle', 'Mekelle'),
        avatar: 'YA',
        avatarBg: 'from-bronze to-copper-700',
        rating: 5,
        quote: t('home.tm3_quote', 'The video lessons cut straight to the point without fluff. I especially appreciate the mobile experience and how easy it is to track watched lessons.')
    }
];
export default function Welcome({ courses = [], categories = [], advertisement = null, sponsors: dbSponsors = [], announcement = null, appDownloads = null }) {
    const t = useT();
    const features = useMemo(() => getFeatures(t), [t]);
    const steps = useMemo(() => getSteps(t), [t]);
    const testimonials = useMemo(() => getTestimonials(t), [t]);
    const { payment_settings: customPaymentSettings } = usePage().props;
    const paymentSettings = customPaymentSettings || {
        bank_name: 'Commercial Bank of Ethiopia (CBE)',
        bank_account_name: 'Success Life Coaching',
        bank_account_number: '10000125544',
        telebirr_phone: '0914026415',
        telebirr_name: 'Success Life Coaching',
    };

    const seoTitle = t('home.seo_title', 'Success Life Coaching | Empowering Growth, Leadership & Success');
    const seoDescription = t('home.seo_description', 'Success Life Coaching offers transformative online courses, leadership programs, and video masterclasses. Elevate your personal and professional growth with expert guidance.');

    const videoRef = useRef(null);
    const [muted, setMuted] = useState(false);
    const [showUnmute, setShowUnmute] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [showEnrollmentPopup, setShowEnrollmentPopup] = useState(true);

    // Admin-managed announcement (Admin → Homepage Announcement). Banner is hidden when none is active.
    const hasAnnouncement = !!announcement?.title;
    const announcementBadge = announcement?.badge || t('home.enrollment_open', 'Enrollment Open');
    const announcementCta = announcement?.cta_url || '/register';
    const announcementCtaIsExternal = /^https?:\/\//i.test(announcementCta);
    const announcementCtaClass = 'inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-[#004101] border border-emerald-200 px-4 sm:px-5 py-2 text-xs sm:text-sm font-black shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer';

    const faqs = useMemo(() => [
        {
            q: t('home.faq1_q', 'How do I access my coaching courses after payment?'),
            a: t('home.faq1_a', 'Once you transfer the course tuition via {bank} ({account}) or Telebirr ({telebirr}) and upload your payment receipt screenshot, our system approves your enrollment and unlocks immediate 6-month access to all lessons in your student dashboard.').replace('{bank}', paymentSettings.bank_name).replace('{account}', paymentSettings.bank_account_number).replace('{telebirr}', paymentSettings.telebirr_phone)
        },
        {
            q: t('home.faq2_q', 'Can I watch lessons on my mobile phone?'),
            a: t('home.faq2_a', 'Yes! The entire platform is built mobile-first for Ethiopia. You can stream seamlessly on mobile browsers with data-optimized video playback, or download our official Android app directly.')
        },
        {
            q: t('home.faq3_q', 'How long do I get access to the courses I purchase?'),
            a: t('home.faq3_a', 'All course enrollments include full 6-month streaming access from the moment of purchase approval. You can watch anytime, learn at your own pace, and re-watch key lessons.')
        },
        {
            q: t('home.faq4_q', 'Do I receive a certificate of completion?'),
            a: t('home.faq4_a', 'Yes! Upon completing all lessons in a course, you will be issued a verified Success Life Coaching completion certificate to showcase on your CV, portfolio, or LinkedIn.')
        },
        {
            q: t('home.faq5_q', 'How do I download the Android app?'),
            a: t('home.faq5_a', 'Tap the "Android" button on the banner at the top of the homepage or use the download link in the footer to get the official APK directly onto your phone.')
        }
    ], [paymentSettings, t]);

    const tierName = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'platinum':
                return t('home.tier_name_platinum', 'platinum');
            case 'gold':
                return t('home.tier_name_gold', 'gold');
            case 'silver':
                return t('home.tier_name_silver', 'silver');
            case 'bronze':
                return t('home.tier_name_bronze', 'bronze');
            default:
                return tier;
        }
    };

    const tierBadge = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'platinum':
                return t('home.badge_platinum', 'PLATINUM SPONSOR');
            case 'gold':
                return t('home.badge_gold', 'GOLD SPONSOR');
            case 'silver':
                return t('home.badge_silver', 'SILVER SPONSOR');
            case 'bronze':
                return t('home.badge_bronze', 'BRONZE SPONSOR');
            default:
                return t('home.badge_generic', '{tier} SPONSOR').replace('{tier}', String(tier).toUpperCase());
        }
    };

    const activeSponsorsList = useMemo(() => {
        if (dbSponsors && dbSponsors.length > 0) {
            return dbSponsors.map((s) => ({
                id: s.id,
                name: s.name,
                tier: s.tier || 'gold',
                badge: s.tier ? tierBadge(s.tier) : t('home.badge_official', 'OFFICIAL PARTNER'),
                logo: s.logo_path
                    ? s.logo_path.startsWith('http://') || s.logo_path.startsWith('https://')
                        ? s.logo_path.replace('/storage/', '/media/')
                        : s.logo_path.startsWith('/storage/')
                            ? s.logo_path.replace('/storage/', '/media/')
                            : s.logo_path.startsWith('/')
                                ? s.logo_path
                                : s.logo_path.startsWith('images/')
                                    ? `/${s.logo_path}`
                                    : `/media/${s.logo_path.replace(/^(storage|media)\//, '')}`
                    : null,
                icon: '🤝',
                website_url: s.website_url,
                description: s.description || t('home.sponsor_default_desc', 'Verified corporate deal partner supporting Success Life Coaching Academy.'),
                highlight: s.website_url ? s.website_url.replace(/^https?:\/\//, '') : t('home.sponsor_default_highlight', 'Verified Corporate Deal'),
            }));
        }
        return [
            {
                id: 1,
                name: paymentSettings.bank_name || 'Commercial Bank of Ethiopia (CBE)',
                tier: 'platinum',
                badge: t('home.badge_platinum', 'PLATINUM SPONSOR'),
                logo: '/images/sponsors/cbe.jpeg',
                website_url: 'https://combanketh.et',
                description: t('home.sponsor_cbe_desc', 'Direct institutional payment processing, {bank} deposits, and automatic receipt verification for all course enrollments.').replace('{bank}', paymentSettings.bank_name),
                highlight: t('home.sponsor_cbe_highlight', 'Account: {account} ({name})').replace('{account}', paymentSettings.bank_account_number).replace('{name}', paymentSettings.bank_account_name)
            },
            {
                id: 2,
                name: 'Telebirr',
                tier: 'platinum',
                badge: t('home.badge_platinum', 'PLATINUM SPONSOR'),
                logo: '/images/sponsors/telebirr.png',
                website_url: 'https://telebirr.et',
                description: t('home.sponsor_tele_desc', 'Instant mobile payments and instant activation for coaching programs from your smartphone nationwide.'),
                highlight: `Telebirr: ${paymentSettings.telebirr_phone} (${paymentSettings.telebirr_name})`
            },
            {
                id: 3,
                name: 'Awash Bank',
                tier: 'gold',
                badge: t('home.badge_gold', 'GOLD SPONSOR'),
                logo: null,
                icon: '🏦',
                website_url: 'https://awashbank.com',
                description: t('home.sponsor_awash_desc', 'Leading private financial institution backing entrepreneurial education and leadership development programs.'),
                highlight: t('home.sponsor_awash_highlight', 'Corporate Financial Sponsor')
            },
            {
                id: 4,
                name: 'Ethiopian Airlines',
                tier: 'silver',
                badge: t('home.badge_silver', 'SILVER SPONSOR'),
                logo: null,
                icon: '✈️',
                website_url: 'https://ethiopianairlines.com',
                description: t('home.sponsor_eal_desc', 'Pan-African flagship carrier sponsoring executive transport and regional youth leadership masterclasses.'),
                highlight: t('home.sponsor_eal_highlight', 'Aviation & Youth Leadership')
            },
            {
                id: 5,
                name: 'Success Life Global',
                tier: 'bronze',
                badge: t('home.badge_bronze', 'BRONZE SPONSOR'),
                logo: null,
                icon: '🌟',
                website_url: 'https://successlifecoaching.et',
                description: t('home.sponsor_global_desc', 'Accrediting premium success frameworks, high-impact life leadership curriculums, and certified coach masterclasses.'),
                highlight: t('home.sponsor_global_highlight', 'Leadership & Personal Growth')
            }
        ];
    }, [dbSponsors, paymentSettings, t]);

    const getTierColor = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'platinum':
                return {
                    badgeBg: 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-xs shadow-cyan-300/30',
                    border: 'border-cyan-200/80 hover:border-cyan-400',
                    icon: '💎',
                    label: t('home.tier_platinum', 'Platinum Sponsor'),
                };
            case 'gold':
                return {
                    badgeBg: 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs shadow-amber-300/30',
                    border: 'border-amber-200/80 hover:border-amber-400',
                    icon: '🥇',
                    label: t('home.tier_gold', 'Gold Sponsor'),
                };
            case 'silver':
                return {
                    badgeBg: 'bg-slate-100 border-slate-300 text-slate-800',
                    border: 'border-slate-200 hover:border-slate-400',
                    icon: '🥈',
                    label: t('home.tier_silver', 'Silver Sponsor'),
                };
            case 'bronze':
                return {
                    badgeBg: 'bg-amber-100/70 border-amber-600/40 text-amber-950',
                    border: 'border-amber-200 hover:border-amber-600',
                    icon: '🥉',
                    label: t('home.tier_bronze', 'Bronze Sponsor'),
                };
            default:
                return {
                    badgeBg: 'bg-slate-100 border-slate-200 text-slate-700',
                    border: 'border-slate-200',
                    icon: '🤝',
                    label: t('home.tier_official', 'Official Sponsor'),
                };
        }
    };

    const scrollToCourses = (e) => {
        e.preventDefault();
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!advertisement) return;
        const v = videoRef.current;
        if (!v) return;

        const tryPlay = async () => {
            try {
                v.muted = false;
                await v.play();
                setMuted(false);
                setShowUnmute(false);
            } catch (e) {
                try {
                    v.muted = true;
                    await v.play();
                    setMuted(true);
                    setShowUnmute(true);
                } catch (e2) {
                    setShowUnmute(true);
                    v.controls = true;
                }
            }
        };

        tryPlay();
    }, [advertisement]);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory =
                selectedCategory === 'all' ||
                course.category?.slug === selectedCategory ||
                String(course.category_id) === String(selectedCategory);

            const matchesSearch =
                searchQuery.trim() === '' ||
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (course.instructor && course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [courses, selectedCategory, searchQuery]);

    return (
        <AppLayout>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content="success life coaching, life coaching, success coaching, personal growth, leadership training, executive coaching, online courses, video masterclass" />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
            </Head>

            {/* ========================================================
                SMART TRANSPARENT ENROLLMENT OPEN NOW PILL (TWO LINES - DOCKED AT BOTTOM OF SCREEN)
               ======================================================== */}
            {!hasAnnouncement ? null : showEnrollmentPopup ? (
                <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[96vw] max-w-5xl pointer-events-none">
                    <div className="pointer-events-auto animate-slide-up relative flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 overflow-hidden rounded-3xl md:rounded-full border border-emerald-400/40 bg-gradient-to-r from-[#004101]/95 via-copper-950/95 to-[#003301]/95 backdrop-blur-2xl px-4 sm:px-7 py-3 sm:py-3.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(16,185,129,0.35)] animate-banner-glow transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_50px_rgba(245,158,11,0.45)]">
                        {/* Ambient glow lights inside the transparent glass */}
                        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-emerald-400/30 blur-2xl animate-pulse"></div>
                        <div className="pointer-events-none absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-amber-400/25 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                        {/* Left: Icon & Live Badge */}
                        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/15 border border-white/20 text-base sm:text-lg shadow-inner shrink-0">
                                📣
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 whitespace-nowrap shrink-0 shadow-2xs">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>{announcementBadge}</span>
                            </span>
                        </div>

                        {/* Center: The Announcement Text in TWO LINES - Centered, Highly Attractive & Animated */}
                        <div className="relative z-10 min-w-0 flex-1 px-2 sm:px-4 text-center flex flex-col items-center justify-center">
                            {/* Line 1: Main Announcement */}
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                <span className="font-black text-xs sm:text-sm md:text-base text-white tracking-tight drop-shadow-sm">
                                    {announcement.title}
                                </span>
                                <span className="inline-block animate-bounce text-xs sm:text-sm" role="img" aria-label={t('home.sparkle', 'sparkle')}>
                                    ✨
                                </span>
                            </div>

                            {/* Line 2: Action message with shimmering golden text & breathing beacon */}
                            {announcement.subtitle ? (
                                <div className="mt-1 flex items-center justify-center gap-1.5">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
                                    <p className="text-[11px] sm:text-xs md:text-sm font-extrabold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent tracking-wide drop-shadow-xs animate-text-shimmer">
                                        {announcement.subtitle}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* Right: Inline Action Buttons & Close Control */}
                        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 shrink-0">
                            {announcementCtaIsExternal ? (
                                <a href={announcementCta} target="_blank" rel="noopener noreferrer" className={announcementCtaClass}>
                                    <span>{t('banner.how', 'How??')}</span>
                                    <span className="text-emerald-700 font-black animate-pulse">➜</span>
                                </a>
                            ) : (
                                <Link href={announcementCta} className={announcementCtaClass}>
                                    <span>{t('banner.how', 'How??')}</span>
                                    <span className="text-emerald-700 font-black animate-pulse">➜</span>
                                </Link>
                            )}

                            {announcement.telegram_url ? (
                                <a
                                    href={announcement.telegram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t('home.telegram', 'Telegram')}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/90 text-white shadow-md transition hover:scale-105 hover:bg-sky-400 active:scale-95 shrink-0"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M9.78 15.6l-.4 4.2c.57 0 .82-.25 1.12-.54l2.7-2.58 5.6 4.1c1.03.57 1.76.27 2.04-.95l3.7-17.3c.34-1.52-.55-2.12-1.55-1.75L1.2 10.1c-1.48.58-1.46 1.4-.27 1.77l5.6 1.75L19.5 5.4c.6-.4 1.16-.18.7.22L9.78 15.6z" />
                                    </svg>
                                </a>
                            ) : null}

                            {announcement.phone_tel ? (
                                <a
                                    href={announcement.phone_tel}
                                    aria-label={announcement.phone || t('home.phone', 'Phone')}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-md transition hover:scale-105 hover:bg-emerald-400 active:scale-95 shrink-0"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.336a12.09 12.09 0 01-5.378-5.378c-.207-.441-.04-.928.336-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102A1.125 1.125 0 005.872 2.25H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </a>
                            ) : null}

                            <a
                                href="/apps/download/android"
                                className="hidden md:inline-flex items-center gap-1.5 justify-center rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 border border-emerald-400/40 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-emerald-600 hover:scale-105 active:scale-95 transition-all whitespace-nowrap shrink-0"
                            >
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5516.4482-1.0002.9993-1.0002.5516 0 .9997.4486.9997 1.0002 0 .5516-.4481 1.0002-.9997 1.0002m-11.046 0c-.5516 0-.9997-.4486-.9997-1.0002 0-.5516.4481-1.0002.9997-1.0002.5511 0 .9993.4486.9993 1.0002 0 .5516-.4482 1.0002-.9993 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.411 13.8566 8.1 12 8.1c-1.8566 0-3.5902.311-5.1368.8497L4.8409 5.4467a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.741h24c-.3432-4.0821-2.6889-7.5543-6.1185-9.4196"/>
                                </svg>
                                <span>{t('banner.android', 'Android')}</span>
                            </a>

                            <button
                                onClick={() => setShowEnrollmentPopup(false)}
                                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition text-xs font-bold shrink-0 ml-0.5 cursor-pointer"
                                title={t('home.minimize', 'Minimize')}
                                aria-label={t('home.minimize_banner', 'Minimize Enrollment Banner')}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Minimized Floating Pill Trigger */
                <button
                    onClick={() => setShowEnrollmentPopup(true)}
                    className="fixed bottom-24 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center gap-2 rounded-full border border-emerald-400/50 bg-[#004101]/90 backdrop-blur-xl px-4 py-2 text-xs font-black text-white shadow-2xl hover:scale-105 transition-all duration-200"
                    title={t('home.open_announcement', 'Open Enrollment Announcement')}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>📣 {announcementBadge}</span>
                    <span className="text-emerald-300 text-[10px]">▲</span>
                </button>
            )}

            <div className="pb-20 pt-2 sm:pt-4">
                {/* ========================================================
                    TOP SCREEN: INFINITE SCROLLING SPONSOR LOGOS TICKER
                   ======================================================== */}
                <section className="mb-4 sm:mb-6 overflow-hidden">
                    <div className="relative w-full overflow-hidden border-y border-copper-100/90 bg-gradient-to-r from-[#f6faf7] via-white to-[#f6faf7] py-3 sm:py-3.5 shadow-xs">
                        {/* Gradient edge masks for sleek fade out effect */}
                        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-28 bg-gradient-to-r from-[#f7faf8] via-[#f7faf8]/80 to-transparent"></div>
                        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-28 bg-gradient-to-l from-[#f7faf8] via-[#f7faf8]/80 to-transparent"></div>

                        <div className="flex items-center gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused]">
                            {[...activeSponsorsList, ...activeSponsorsList].map((s, idx) => {
                                const tierMeta = getTierColor(s.tier);
                                const CardWrapper = s.website_url ? 'a' : 'div';
                                const cardProps = s.website_url ? { href: s.website_url, target: '_blank', rel: 'noopener noreferrer' } : {};

                                return (
                                    <CardWrapper
                                        key={`top-marquee-${s.id || idx}-${idx}`}
                                        {...cardProps}
                                        className="group relative flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-copper-400 shrink-0 cursor-pointer"
                                    >
                                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white border border-slate-100 p-2 overflow-hidden shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                            {s.logo ? (
                                                <img 
                                                    src={s.logo} 
                                                    alt={s.name} 
                                                    className="h-full w-full object-contain"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.parentElement.innerHTML = `<span class="text-base font-black text-copper-800">${s.name.substring(0, 2).toUpperCase()}</span>`;
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-lg">{tierMeta.icon || '🤝'}</span>
                                            )}
                                        </div>
                                        <div className="text-left pr-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${tierMeta.badgeBg}`}>
                                                    <span>{tierMeta.icon}</span>
                                                    <span>{s.tier ? tierName(s.tier) : t('home.sponsor_word', 'SPONSOR')}</span>
                                                </span>
                                            </div>
                                            <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-copper-800 transition-colors max-w-[160px] sm:max-w-[200px] truncate">
                                                {s.name}
                                            </p>
                                        </div>
                                    </CardWrapper>
                                );
                            })}
                        </div>
                    </div>
                </section>



                {/* ========================================================
                    2. ULTRA-MODERN HERO SECTION
                   ======================================================== */}
                <section className="section-shell">
                    <div className="home-hero relative overflow-hidden rounded-[28px] border border-[#1d4a28] shadow-[0_36px_90px_-40px_rgba(4,24,10,0.85)] sm:rounded-[36px]">
                        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '56px 56px' }}></div>
                        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#e4c36a]/10 blur-3xl"></div>

                        <div className="relative grid items-center gap-8 p-6 sm:p-9 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:p-12">
                        <div className="relative z-10 flex flex-col justify-center">
                            <div className="hero-fade-down mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-[#e4c36a]/35 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3e2ad] backdrop-blur">
                                <span className="hero-dot-pulse h-1.5 w-1.5 rounded-full bg-[#e4c36a]"></span>
                                {t('home.badge', "ETHIOPIA'S PREMIER LEADERSHIP & COACHING ACADEMY")}
                            </div>

                            <AnimatedHeadline
                                text={t('home.hero_title', 'Transform your mindset, master high-value skills & build real success.')}
                                className="home-display text-balance text-[2rem] leading-[1.18] text-white sm:text-5xl lg:text-[3.35rem]"
                            />

                            <p style={{ animationDelay: '1000ms' }} className="hero-fade-up mt-5 max-w-xl text-sm leading-7 text-emerald-50/75 sm:mt-6 sm:text-lg sm:leading-8">
                                {t('home.hero_sub', 'Learn from accredited mentors through focused, high-definition video masterclasses. Designed for ambitious professionals, creators, and leaders across Ethiopia.')}
                            </p>

                            <div style={{ animationDelay: '1200ms' }} className="hero-fade-up mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-3.5">
                                <a
                                    href="#courses"
                                    onClick={scrollToCourses}
                                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-8 py-4 text-base font-bold text-[#1a1404] shadow-[0_14px_40px_-16px_rgba(212,175,55,0.8)] transition hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98] sm:w-auto"
                                >
                                    {t('home.explore_courses', 'Explore All Courses')}
                                    <span className="ml-2" aria-hidden="true">→</span>
                                </a>
                                <Link
                                    href="/seminars"
                                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-[#e4c36a]/50 hover:bg-white/10 sm:w-auto"
                                >
                                    {t('home.reserve_seminar', 'Live Seminars')}
                                </Link>
                            </div>

                            <div style={{ animationDelay: '1400ms' }} className="hero-fade-up mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-6 sm:gap-4">
                                {[
                                    { value: '4.9', label: t('home.stat_rating', 'Student rating') },
                                    { value: '1,200+', label: t('home.stat_graduates', 'Graduates') },
                                    { value: t('home.stat_access_value', '6 mo'), label: t('home.stat_access', 'Full access') },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <p className="home-display text-xl text-[#f3e2ad] sm:text-2xl">{stat.value}</p>
                                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-100/55 sm:text-xs">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative flex min-h-[42vh] min-w-0 w-full flex-col justify-center gap-3 lg:min-h-0">
                            <AnimatedUrl
                                href="https://www.successlifecoachingacademy.com"
                                text="www.successlifecoachingacademy.com"
                            />
                            <div className="relative flex h-full w-full flex-1 rounded-[24px] bg-gradient-to-br from-[#f6e7b4] via-[#c9a227] to-[#8a7018] p-[1.5px] shadow-[0_30px_70px_-28px_rgba(0,0,0,0.7)] sm:rounded-[32px]">
                                {/* Video or Spotlight Media */}
                                <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-slate-950 sm:rounded-[30px] lg:aspect-auto lg:min-h-[calc(100svh-19rem)]">
                                    {advertisement ? (
                                        <>
                                            <div key={`${advertisement.id}-${advertisement.video_path}`} className="absolute inset-0 animate-fade-in">
                                                <video
                                                    ref={videoRef}
                                                    src={`/media/${advertisement.video_path?.replace(/^storage\//, '')}`}
                                                    autoPlay
                                                    loop
                                                    playsInline
                                                    className="block h-full w-full object-cover"
                                                />

                                                {showUnmute && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                                                        <button
                                                            onClick={async () => {
                                                                const v = videoRef.current;
                                                                if (!v) return;
                                                                try {
                                                                    v.muted = false;
                                                                    await v.play();
                                                                    setMuted(false);
                                                                    setShowUnmute(false);
                                                                } catch (e) {
                                                                    v.controls = true;
                                                                }
                                                            }}
                                                            className="rounded-full bg-white/95 px-5 py-2.5 font-bold shadow-xl text-xs sm:text-sm text-copper-900 active:scale-95 transition-transform"
                                                        >
                                                            {t('home.unmute', '🔊 Unmute Promo')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-full w-full animate-fade-in bg-gradient-to-br from-copper-800 via-copper-700 to-copper-950 p-5 sm:p-7 text-white flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                                            <div className="flex items-start justify-between gap-4 relative z-10">
                                                <div>
                                                    <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-copper-100 backdrop-blur">
                                                        {t('home.featured_masterclass', 'Featured Masterclass')}
                                                    </span>
                                                    <h3 className="mt-2 text-xl sm:text-2xl font-black text-white">{t('home.empowering', 'Empowering Leaders & Creators')}</h3>
                                                </div>
                                                <div className="rounded-xl bg-white/15 px-3 py-1 text-xs font-bold text-copper-100 border border-white/20">
                                                    4K HD
                                                </div>
                                            </div>

                                            <div className="space-y-3 relative z-10">
                                                <p className="text-xs sm:text-sm text-copper-100/90 leading-relaxed">
                                                    {t('home.masterclass_blurb', "Master personal discipline, earn online income, and build lasting success with Ethiopia's premier coaching team.")}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-copper-200 border-t border-white/20 pt-2.5">
                                                    <span>{t('home.check_instant', '✓ Instant CBE & Telebirr')}</span>
                                                    <span>{t('home.check_lifetime', '✓ 100% Lifetime Access')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Floating Social Proof Badge 1 */}
                                <HeroInfoCard
                                    className="absolute -bottom-4 left-4 hidden sm:block"
                                    programs={courses.length}
                                    lessons={courses.reduce((sum, c) => sum + (Number(c.videos_count) || 0), 0)}
                                    ctaHref={route('register')}
                                    ctaLabel={t('home.join_free', 'Join free')}
                                />

                                <div className="absolute -top-3 right-4 hidden items-center gap-2 rounded-full border border-[#e4c36a]/40 bg-[#06240c]/90 px-3.5 py-2 text-xs font-semibold text-[#f6e7b4] shadow-xl sm:flex">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#7ddea0]"></span>
                                    {t('home.enrollment_today', 'Enrollment open today')}
                                </div>

                            </div>
                        </div>
                        </div>
                    </div>
                </section>



                {/* Admin-uploaded Android / iOS app downloads */}
                <div className="mt-8 sm:mt-10">
                    <AppDownloads appDownloads={appDownloads} />
                </div>

                {/* ========================================================
                    4. VALUE PILLARS (Why Success Life Coaching?)
                   ======================================================== */}
                <section className="section-shell mt-16 sm:mt-24">
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-12 sm:flex-row sm:items-end">
                        <div className="max-w-xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('home.advantage_eyebrow', 'The academy advantage')}</p>
                            <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{t('home.advantage_title', 'Why ambitious people learn here')}</h2>
                        </div>
                        <p className="max-w-sm text-sm leading-7 text-slate-600">{t('home.advantage_sub', 'Practical coaching, local payments, and lessons built for professionals across Ethiopia.')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feat, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-[28px] border border-copper-100 bg-white p-6 shadow-[0_18px_40px_-28px_rgba(4,36,12,0.45)] transition duration-300 hover:-translate-y-1 hover:border-[#e4c36a]/70"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#06240c] via-[#c9a227] to-[#06240c] opacity-80"></div>
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06240c] text-xl text-white shadow-inner">
                                        {feat.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7b24]">{feat.badge}</span>
                                </div>
                                <h3 className="home-display text-xl leading-snug text-slate-900">{feat.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">{feat.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========================================================
                    5. HOW IT WORKS (3-STEP JOURNEY)
                   ======================================================== */}
                <section className="section-shell mt-16 sm:mt-24">
                    <div className="relative overflow-hidden rounded-[32px] border border-[#e7d7a4] bg-[#fffdf6] px-6 py-10 sm:px-10 sm:py-14">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e4c36a]/25 blur-3xl"></div>
                        <div className="relative mb-10 max-w-xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('home.steps_eyebrow', 'Three calm steps')}</p>
                            <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{t('home.steps_title', 'From payment to a verified certificate')}</h2>
                        </div>
                        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
                            {steps.map((st) => (
                                <div key={st.step} className="rounded-[24px] border border-[#eadcb4] bg-white p-6 shadow-[0_16px_40px_-30px_rgba(154,123,36,0.7)]">
                                    <div className="mb-5 flex items-center justify-between">
                                        <span className="home-display text-3xl text-[#c9a227]">{st.step}</span>
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06240c] text-lg">{st.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">{st.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{st.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    6. COURSES SECTION WITH SEARCH & CATEGORY FILTER
                   ======================================================== */}
                <section id="courses" className="section-shell mt-14 sm:mt-20">
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('home.catalog_eyebrow', 'Academy catalog')}</p>
                            <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{t('home.catalog_title', 'Featured coaching programs')}</h2>
                            <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">{t('home.catalog_sub', 'High-impact video programs with lessons you can use the same day.')}</p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full sm:w-72">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('home.search_placeholder', 'Search programs...')}
                                    className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-[#c9a227] focus:ring-4 focus:ring-[#e4c36a]/25"
                                />
                                <svg className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {categories.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    selectedCategory === 'all'
                                        ? 'bg-[#06240c] text-[#f6e7b4] shadow-md'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:border-[#e4c36a] hover:bg-[#fffdf6]'
                                }`}
                            >
                                {t('home.all_programs', 'All Programs')} ({courses.length})
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.slug || String(cat.id))}
                                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                        selectedCategory === (cat.slug || String(cat.id))
                                            ? 'bg-[#06240c] text-[#f6e7b4] shadow-md'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:border-[#e4c36a] hover:bg-[#fffdf6]'
                                    }`}
                                >
                                    {cat.name} {cat.courses_count ? `(${cat.courses_count})` : ''}
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredCourses.length === 0 ? (
                        <div className="surface-card p-10 sm:p-16 text-center">
                            <div className="text-5xl sm:text-6xl text-copper-300">📚</div>
                            <h3 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-slate-800">{t('home.no_match_title', 'No programs match your search')}</h3>
                            <p className="mt-2 text-sm text-slate-500">{t('home.no_match_sub', 'Try adjusting your keyword or switch category filters.')}</p>
                            {searchQuery && (
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                                    className="btn-secondary mt-5 py-2.5 px-6 text-xs font-bold"
                                >
                                    {t('home.reset_filters', 'Reset Filters')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                            {filteredCourses.map((course) => {
                                const safeCourse = {
                                    ...course,
                                    instructor: course.instructor || { name: t('home.default_instructor', 'Success Coach') },
                                    videos_count: course.videos_count || 0
                                };
                                return (
                                    <Link 
                                        key={safeCourse.id} 
                                        href={route('courses.show', safeCourse.id)} 
                                        className="group block touch-manipulation focus:outline-none"
                                    >
                                        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-copper-100 bg-white shadow-[0_18px_40px_-28px_rgba(4,36,12,0.5)] transition duration-300 active:scale-[0.98] sm:hover:-translate-y-1.5 sm:hover:border-[#e4c36a]/80 sm:hover:shadow-[0_28px_50px_-24px_rgba(4,36,12,0.45)]">
                                            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#06240c] via-copper-700 to-[#0d3b16]">
                                                {safeCourse.thumbnail && safeCourse.thumbnail !== 'thumbnails/dummy.jpg' ? (
                                                    <img 
                                                        src={`/storage/${safeCourse.thumbnail}`} 
                                                        alt={safeCourse.title} 
                                                        className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>
                                                <div className="absolute inset-x-0 bottom-0 p-4">
                                                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                                                        {t('home.coaching_course', 'Coaching Course')}
                                                    </span>
                                                    <p className="mt-1.5 text-base sm:text-lg font-bold text-white line-clamp-1">{safeCourse.title}</p>
                                                </div>
                                                {/* Price Badge */}
                                                <CoursePriceBadges price={safeCourse.price} priceUsd={safeCourse.price_usd} freeLabel={t('courses.free', 'FREE')} />
                                            </div>

                                            <div className="flex flex-grow flex-col p-4 sm:p-5">
                                                <h3 className="mb-2 text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-copper-700 line-clamp-2">
                                                    {safeCourse.title}
                                                </h3>
                                                
                                                <p className="mb-4 flex-grow text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2 sm:line-clamp-3">
                                                    {safeCourse.description}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between border-t border-copper-100 pt-3 text-xs sm:text-sm text-slate-500">
                                                    <span className="truncate pr-2">
                                                        {t('home.by_instructor', 'by {name}').split('{name}').reduce((acc, part, i) => (i === 0 ? [part] : [...acc, <span key={i} className="font-semibold text-slate-800">{safeCourse.instructor.name}</span>, part]), [])}
                                                    </span>
                                                    <span className="rounded-full bg-copper-100/80 px-2.5 py-1 text-[11px] font-semibold text-copper-800 shrink-0">
                                                        {t('home.lessons_count', '{count} Lessons').replace('{count}', safeCourse.videos_count)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ========================================================
                    7. STUDENT SUCCESS STORIES (TESTIMONIALS)
                   ======================================================== */}
                <section className="section-shell mt-16 sm:mt-24">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('home.stories_eyebrow', 'Student stories')}</p>
                        <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{t('home.stories_title', 'Loved by learners across Ethiopia')}</h2>
                        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{t('home.stories_sub', 'Graduates who changed their confidence, career, and income.')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {testimonials.map((story, index) => (
                            <figure key={index} className="flex h-full flex-col justify-between rounded-[28px] border border-copper-100 bg-white p-7 shadow-[0_18px_40px_-28px_rgba(4,36,12,0.45)]">
                                <div>
                                    <div className="home-display text-5xl leading-none text-[#e4c36a]">“</div>
                                    <div className="mt-2 text-sm tracking-[0.2em] text-[#c9a227]">{'★'.repeat(story.rating)}</div>
                                    <blockquote className="mt-4 text-sm leading-7 text-slate-700">
                                        {story.quote}
                                    </blockquote>
                                </div>
                                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${story.avatarBg} text-sm font-bold text-white`}>
                                        {story.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">{story.name}</p>
                                        <p className="truncate text-[11px] text-slate-500">{story.role} · {story.location}</p>
                                    </div>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                {/* ========================================================
                    8. FREQUENTLY ASKED QUESTIONS (ACCORDION)
                   ======================================================== */}
                <section className="section-shell mt-16 sm:mt-24">
                    <div className="mx-auto mb-10 max-w-2xl text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('home.faq_eyebrow', 'Questions')}</p>
                        <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">{t('home.faq_title', 'Frequently Asked Questions')}</h2>
                        <p className="mt-3 text-sm text-slate-600 sm:text-base">{t('home.faq_subtitle', 'Everything you need to know about getting started and studying with us.')}</p>
                    </div>

                    <div className="mx-auto max-w-3xl space-y-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div key={idx} className={`overflow-hidden rounded-2xl border bg-white transition ${isOpen ? 'border-[#e4c36a] shadow-[0_16px_36px_-24px_rgba(154,123,36,0.55)]' : 'border-slate-200/80'}`}>
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-copper-800 sm:p-5 sm:text-base"
                                    >
                                        <span>{faq.q}</span>
                                        <span className={`ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${isOpen ? 'bg-[#06240c] text-[#f6e7b4]' : 'bg-[#fff8e8] text-[#9a7b24]'}`}>
                                            {isOpen ? '–' : '+'}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="animate-fade-in border-t border-[#f3e6c2] px-4 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5 sm:pb-6">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ========================================================
                    9. FINAL HIGH-CONVERTING CTA BANNER (PRE-FOOTER)
                   ======================================================== */}
                <section className="section-shell mt-16 sm:mt-24">
                    <div className="home-hero relative overflow-hidden rounded-[32px] border border-[#1d4a28] px-6 py-12 text-center text-white shadow-[0_36px_80px_-40px_rgba(4,24,10,0.8)] sm:rounded-[40px] sm:px-14 sm:py-16">
                        <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-[#e4c36a]/20 blur-3xl"></div>
                        <div className="pointer-events-none absolute -bottom-16 right-0 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl"></div>

                        <div className="relative z-10 mx-auto max-w-2xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f3e2ad]">{t('home.cta_eyebrow', 'Begin your transformation')}</p>
                            <h2 className="home-display mt-4 text-3xl leading-tight sm:text-5xl">
                                {t('home.cta_title', 'Ready to build real success and unlock your potential?')}
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-50/75 sm:text-lg">
                                {t('home.cta_sub', 'Join graduates across Ethiopia who are mastering high-income skills and a stronger executive mindset.')}
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-9 py-4 text-base font-bold text-[#1a1404] shadow-[0_14px_40px_-16px_rgba(212,175,55,0.85)] transition hover:-translate-y-0.5 sm:w-auto"
                                >
                                    {t('home.cta_start', 'Get started free')}
                                    <span className="ml-2" aria-hidden="true">→</span>
                                </Link>
                                <a
                                    href="/apps/download/android"
                                    className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:border-[#e4c36a]/50 hover:bg-white/10 sm:w-auto"
                                >
                                    {t('home.cta_download', 'Download the Android app')}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
