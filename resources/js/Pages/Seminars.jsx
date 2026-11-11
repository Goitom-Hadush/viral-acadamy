import React, { useState, useMemo } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import FormErrors from '@/Components/FormErrors';
import CertificateQrCode from '@/Components/CertificateQrCode';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useT } from '@/hooks/useT';

export default function Seminars({ page = null, seminars = [] }) {
    const t = useT();
    const { flash: pageFlash = {} } = usePage().props;

    const defaultSeminars = [
        {
            id: 1,
            title: t('seminars.d1_title', 'The Executive Leadership & Personal Breakthrough Summit 2026'),
            slug: 'executive-leadership-personal-breakthrough-summit-2026',
            tagline: t('seminars.d1_tagline', 'High-Performance Mindset, Unshakable Confidence & Strategic Vision'),
            badge: t('seminars.d1_badge', 'Featured Flagship Summit'),
            speaker_name: 'Coach Tewelde Mebrahtu',
            speaker_title: t('seminars.d1_speaker_title', 'Founder & Master Executive Leadership Coach'),
            speaker_initials: 'GH',
            date_string: t('seminars.d1_date_string', 'Saturday, Nov 28, 2026'),
            time_string: t('seminars.d1_time_string', '9:00 AM – 4:30 PM EAT'),
            location_type: 'hybrid',
            venue_name: t('seminars.d1_venue_name', 'Ethiopian Skylight Hotel, Grand Ballroom'),
            venue_city: t('seminars.city_addis', 'Addis Ababa'),
            entrance_fee: 500,
            price_label: t('seminars.d1_price_label', 'ETB 500 / Free for Academy Students'),
            description: t('seminars.d1_description', 'A life-altering full-day transformational summit bringing together 350+ ambitious professionals, founders, and students in Addis Ababa. Discover elite mental frameworks to silence imposter syndrome, architect high-conviction decision-making, and command respect in any boardroom.'),
            topics_json: JSON.stringify([
                t('seminars.d1_topic1', 'High-Performance Mindset Blueprint'),
                t('seminars.d1_topic2', 'Strategic Decision-Making Under Market Pressure'),
                t('seminars.d1_topic3', 'Overcoming Limiting Beliefs & Procrastination'),
                t('seminars.d1_topic4', 'Executive Networking & Relationship Capital')
            ]),
            bank_info: 'Telebirr: 0911 234 567 (Success Life Coaching)\nCBE Account: 1000 4567 8901 (Success Life Coaching Academy)',
            capacity: 350,
            registered_count: 284,
            is_published: true,
        },
        {
            id: 2,
            title: t('seminars.d2_title', 'Wealth Architecture & Personal Monetization Masterclass'),
            slug: 'wealth-architecture-monetization-masterclass',
            tagline: t('seminars.d2_tagline', 'Transform Specialized Skills Into Predictable Income Streams in Ethiopia'),
            badge: t('seminars.d2_badge', 'High-Demand Workshop'),
            speaker_name: 'Dr. Almaz Bekele',
            speaker_title: t('seminars.d2_speaker_title', 'Senior Wealth Strategist & Entrepreneurship Coach'),
            speaker_initials: 'AB',
            date_string: t('seminars.d2_date_string', 'Saturday, Dec 12, 2026'),
            time_string: t('seminars.d2_time_string', '2:00 PM – 6:30 PM EAT'),
            location_type: 'in_person',
            venue_name: t('seminars.d2_venue_name', 'Success Life Coaching Academy Conference Hall, Bole'),
            venue_city: t('seminars.city_addis', 'Addis Ababa'),
            online_link: null,
            entrance_fee: 0,
            price_label: t('seminars.free', 'Free'),
            description: t('seminars.d2_description', 'Unpack concrete strategies for financial independence, capital allocation, and digital product creation tailored to Ethiopia’s rapidly digitizing economy with Telebirr, CBE, and international freelance markets.'),
            topics_json: JSON.stringify([
                t('seminars.d2_topic1', 'Building 3 Independent Income Streams'),
                t('seminars.d2_topic2', 'Digital Monetization & Consulting Models'),
                t('seminars.d2_topic3', 'Navigating Modern Banking & Payment Gateways'),
                t('seminars.d2_topic4', 'Pricing Your Services With High-Ticket Confidence')
            ]),
            bank_info: 'Telebirr: 0911 234 567\nCBE: 1000 4567 8901',
            capacity: 200,
            registered_count: 165,
            is_published: true,
        },
        {
            id: 3,
            title: t('seminars.d3_title', 'The Art of Public Speaking & Executive Presence'),
            slug: 'art-of-public-speaking-executive-presence',
            tagline: t('seminars.d3_tagline', 'Command Any Room, Deliver Irresistible Pitches & Lead With Charisma'),
            badge: t('seminars.d3_badge', 'Interactive Virtual Intensive'),
            speaker_name: 'Coach Yohannes Tadesse',
            speaker_title: t('seminars.d3_speaker_title', 'Keynote Speaker & Communications Specialist'),
            speaker_initials: 'YT',
            date_string: t('seminars.d3_date_string', 'Sunday, Jan 10, 2027'),
            time_string: t('seminars.d3_time_string', '10:00 AM – 2:30 PM EAT'),
            location_type: 'virtual',
            venue_name: t('seminars.d3_venue_name', 'Global Live Stream via Academy Virtual Hub'),
            venue_city: null,
            online_link: 'https://zoom.us/j/9482103859',
            entrance_fee: 0,
            price_label: t('seminars.free', 'Free'),
            description: t('seminars.d3_description', 'Whether presenting to corporate boards, rallying your team, or speaking on international stages, this masterclass demystifies body language, vocal modulation, persuasive structure, and conquering public speaking anxiety forever.'),
            topics_json: JSON.stringify([
                t('seminars.d3_topic1', 'Eliminating Stage Fright & Nervous Energy'),
                t('seminars.d3_topic2', 'Vocal Resonance, Pacing & Body Language Mastery'),
                t('seminars.d3_topic3', 'The 3-Act Persuasion Framework for Pitches'),
                t('seminars.d3_topic4', 'Live Feedback Hot-Seats with Attendees')
            ]),
            bank_info: 'Telebirr: 0911 234 567',
            capacity: 500,
            registered_count: 389,
            is_published: true,
        },
        {
            id: 4,
            title: t('seminars.d4_title', 'Women in Leadership & Life Mastery Intensive'),
            slug: 'women-in-leadership-life-mastery-intensive',
            tagline: t('seminars.d4_tagline', 'Empowering Female Executives, Innovators & Community Changemakers'),
            badge: t('seminars.d4_badge', 'Exclusive Masterclass'),
            speaker_name: 'Coach Selamawit Desta',
            speaker_title: t('seminars.d4_speaker_title', 'Executive Mentor & Transformational Life Coach'),
            speaker_initials: 'SD',
            date_string: t('seminars.d4_date_string', 'Saturday, Jan 23, 2027'),
            time_string: t('seminars.d4_time_string', '9:30 AM – 3:30 PM EAT'),
            location_type: 'in_person',
            venue_name: t('seminars.d4_venue_name', 'Haile Grand Hotel, Executive Suite'),
            venue_city: t('seminars.city_addis', 'Addis Ababa'),
            entrance_fee: 350,
            price_label: t('seminars.d4_price_label', 'ETB 350 / VIP ETB 1000'),
            description: t('seminars.d4_description', 'A premier gathering for visionary women across business, technology, NGOs, and academia. Cultivate executive presence, navigate workplace dynamics, achieve work-life integration, and step into senior leadership roles with bold authenticity.'),
            topics_json: JSON.stringify([
                t('seminars.d4_topic1', 'Assertive Communication Without Apology'),
                t('seminars.d4_topic2', 'Emotional Intelligence in High-Stakes Environments'),
                t('seminars.d4_topic3', 'Work-Life Synergy & Sustainable Energy Management'),
                t('seminars.d4_topic4', 'Mentorship Circles & Executive Sisterhood')
            ]),
            bank_info: 'Telebirr: 0911 234 567\nCBE: 1000 4567 8901',
            capacity: 180,
            registered_count: 142,
            is_published: true,
        },
    ];

    const allSeminars = seminars && seminars.length > 0 ? seminars : defaultSeminars;

    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSeminar, setSelectedSeminar] = useState(null);
    const [registeredPass, setRegisteredPass] = useState(pageFlash?.registration_code ? pageFlash : null);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [sharingSeminar, setSharingSeminar] = useState(null);
    const [copiedToast, setCopiedToast] = useState(false);

    const getShareUrl = (seminar) => {
        if (!seminar) return typeof window !== 'undefined' ? window.location.href : 'https://successlifecoaching.et/seminars';
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://successlifecoaching.et';
        return `${origin}/seminars#${seminar.slug || seminar.id}`;
    };

    const getShareText = (seminar) => {
        if (!seminar) return '';
        const isFree = !seminar.entrance_fee || Number(seminar.entrance_fee) === 0;
        const feeText = isFree ? t('seminars.free_entrance', 'Free Entrance') : `ETB ${seminar.entrance_fee}`;
        const locationText = seminar.location_type === 'virtual' ? t('seminars.virtual_stream_emoji', '💻 Virtual Live Stream') : `📍 ${seminar.venue_name}`;
        return t('seminars.share_text', '🔥 Join "{title}" by {speaker}! 📅 {date} • {location} ({fee}). Reserve your seat at Success Life Coaching Academy:')
            .replace('{title}', seminar.title)
            .replace('{speaker}', seminar.speaker_name)
            .replace('{date}', seminar.date_string)
            .replace('{location}', locationText)
            .replace('{fee}', feeText);
    };

    const handleShareModal = (seminar) => {
        setSharingSeminar(seminar);
        setCopiedToast(false);
    };

    const handleCopyLink = (seminar) => {
        const url = getShareUrl(seminar);
        if (navigator?.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                setCopiedToast(true);
                setTimeout(() => setCopiedToast(false), 2500);
            });
        }
    };

    const handleNativeShare = async (seminar) => {
        const url = getShareUrl(seminar);
        const text = getShareText(seminar);
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: seminar.title,
                    text: text,
                    url: url,
                });
            } catch (err) {
                // Cancelled or unsupported
            }
        } else {
            handleCopyLink(seminar);
        }
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        seminar_id: '',
        seminar_title: '',
        attendee_name: '',
        attendee_phone: '',
        attendee_email: '',
        ticket_tier: 'Standard Delegate Pass',
        amount_paid: 0,
        transaction_reference: '',
        receipt: null,
    });

    const openRegisterModal = (seminar) => {
        setSelectedSeminar(seminar);
        setReceiptPreview(null);
        setData({
            seminar_id: seminar.id,
            seminar_title: seminar.title,
            attendee_name: '',
            attendee_phone: '',
            attendee_email: '',
            ticket_tier: 'Standard Delegate Pass',
            amount_paid: seminar.entrance_fee || 0,
            transaction_reference: '',
            receipt: null,
        });
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('receipt', file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post(route('seminars.register'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const flashData = page.props?.flash;
                if (flashData?.registration_code) {
                    setRegisteredPass(flashData);
                } else {
                    const fallbackCode = 'SLC-SEM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
                    setRegisteredPass({
                        registration_code: fallbackCode,
                        attendee_name: data.attendee_name,
                        seminar_title: selectedSeminar.title,
                        ticket_tier: data.ticket_tier,
                        venue_name: selectedSeminar.venue_name,
                        date_string: selectedSeminar.date_string,
                        time_string: selectedSeminar.time_string,
                        status: (selectedSeminar.entrance_fee > 0 || data.receipt) ? 'pending_approval' : 'approved',
                    });
                }
                reset();
            },
        });
    };

    const filteredSeminars = useMemo(() => {
        return allSeminars.filter((item) => {
            const matchesType =
                filterType === 'all'
                    ? true
                    : filterType === 'in_person'
                    ? item.location_type === 'in_person' || item.location_type === 'hybrid'
                    : filterType === 'virtual'
                    ? item.location_type === 'virtual' || item.location_type === 'hybrid'
                    : item.location_type === filterType;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                item.title?.toLowerCase().includes(q) ||
                item.speaker_name?.toLowerCase().includes(q) ||
                item.venue_name?.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q);

            return matchesType && matchesSearch;
        });
    }, [allSeminars, filterType, searchQuery]);

    const tierLabel = (tier) => {
        const map = {
            'Standard Delegate Pass': t('seminars.tier_standard', 'Standard Delegate Pass'),
            'VIP Executive Access': t('seminars.tier_vip', 'VIP Executive Access'),
            'Virtual Live Broadcast': t('seminars.tier_virtual', 'Virtual Live Broadcast'),
        };
        return map[tier] || tier;
    };

    const parseTopics = (topicsField) => {
        if (!topicsField) return [];
        if (Array.isArray(topicsField)) return topicsField;
        try {
            return JSON.parse(topicsField);
        } catch (e) {
            return [];
        }
    };

    return (
        <AppLayout>
            <Head>
                <title>{t('pages.seminars_title', 'Live Seminars & Breakthrough Summits | Success Life Coaching Academy')}</title>
                <meta
                    name="description"
                    content={t('seminars.meta_desc', 'Attend transformative live seminars, executive masterclasses, and leadership summits in Addis Ababa and online with Success Life Coaching Academy.')}
                />
            </Head>

            <div className="pb-24 pt-4 sm:pt-6">
                <section className="section-shell">
                    <div className="home-hero relative overflow-hidden rounded-[28px] border border-[#1d4a28] px-6 py-10 shadow-[0_36px_90px_-40px_rgba(4,24,10,0.85)] sm:rounded-[36px] sm:px-12 sm:py-14">
                        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#e4c36a]/15 blur-3xl" />
                        <div className="relative max-w-3xl">
                            <p className="inline-flex items-center gap-2 rounded-full border border-[#e4c36a]/35 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f3e2ad]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#e4c36a] animate-pulse" />
                                {t('seminars.hero_eyebrow', 'Live rooms and virtual summits')}
                            </p>
                            <h1 className="home-display mt-6 text-balance text-4xl leading-[1.2] text-white sm:text-5xl lg:text-6xl">
                                {t('seminars.hero_heading_new', 'Transform Your Mindset.')} <span className="bg-gradient-to-r from-[#f6e7b4] to-[#e4c36a] bg-clip-text text-transparent">{t('seminars.hero_highlight', 'Build Your Career.')}</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-50/80 sm:text-lg">
                                {t('seminars.hero_intro_new', 'Join world-class executive masterclasses, leadership summits, and breakthrough intensives. Learn from top coaches, network with ambitious leaders, and earn verifiable certificates.')}
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                                <button onClick={() => {
                                    const el = document.querySelector('[data-seminars-list]');
                                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-6 py-3 text-sm font-bold text-[#1a1404] shadow-[0_12px_32px_-8px_rgba(212,175,55,0.9)] transition hover:shadow-[0_16px_40px_-10px_rgba(212,175,55,1)] active:scale-95">
                                    🎯 {t('seminars.browse_upcoming', 'Browse Upcoming')}
                                </button>
                                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-[#f3e2ad]">{allSeminars.length} {t('seminars.seminars_live', 'Live Events')}</p>
                                        <p className="text-xs text-emerald-100/70">{t('seminars.book_your_seat', 'Book now')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="inline-flex overflow-x-auto rounded-full border border-[#eadcb4] bg-[#fffdf6] p-1">
                            {[
                                { id: 'all', label: t('seminars.all', 'All Seminars') },
                                { id: 'in_person', label: t('seminars.tab_in_person', 'In-person') },
                                { id: 'virtual', label: t('seminars.tab_virtual', 'Virtual & hybrid') },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterType(tab.id)}
                                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                                        filterType === tab.id
                                            ? 'bg-[#06240c] text-[#f6e7b4] shadow-sm'
                                            : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full sm:w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('seminars.search_placeholder', 'Search by topic, speaker, venue...')}
                                className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#c9a227] focus:ring-4 focus:ring-[#e4c36a]/25"
                            />
                            <svg className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* SEMINAR LISTING */}
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {filteredSeminars.map((item) => {
                            const topics = parseTopics(item.topics_json);
                            const fillPercentage = Math.min(100, Math.round(((item.registered_count || 0) / (item.capacity || 200)) * 100));
                            const isFree = !item.entrance_fee || Number(item.entrance_fee) === 0;
                            const displayPrice = isFree
                                ? (item.price_label && !item.price_label.toLowerCase().includes('etb 0') && !item.price_label.toLowerCase().includes('0 etb') ? item.price_label : t('seminars.free', 'Free'))
                                : (item.price_label || `ETB ${item.entrance_fee}`);

                            return (
                                <article
                                    key={item.id}
                                    id={item.slug || `seminar-${item.id}`}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-copper-100 bg-white shadow-[0_18px_40px_-28px_rgba(4,36,12,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#e4c36a]/70"
                                >
                                    {/* Uploaded Flyer Banner or Default Header */}
                                    {item.image_path ? (
                                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                                            <img
                                                src={`/storage/${item.image_path}`}
                                                alt={item.title}
                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="rounded-full border border-[#e4c36a]/40 bg-[#06240c]/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#f6e7b4] backdrop-blur">
                                                    {item.badge || t('seminars.badge_default_image', 'Seminar')}
                                                </span>
                                            </div>
                                            <div className="absolute top-3 right-3">
                                                <span className="rounded-full bg-[#f6e7b4] px-3 py-1 text-xs font-extrabold text-[#3b2d08] shadow-md">
                                                    {displayPrice}
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Content Block */}
                                    <div className="relative p-6 pb-4 sm:p-7">
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#06240c] via-[#c9a227] to-[#06240c]" />
                                        {!item.image_path && (
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                <span className="rounded-full border border-[#eadcb4] bg-[#fffdf6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9a7b24]">
                                                    {item.badge || t('seminars.badge_default', 'Upcoming Seminar')}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06240c] px-3 py-1 text-[11px] font-semibold text-[#f6e7b4]">
                                                    <span>{item.location_type === 'virtual' ? t('seminars.loc_virtual', 'Virtual') : item.location_type === 'hybrid' ? t('seminars.loc_hybrid', 'Hybrid') : t('seminars.loc_in_person', 'In person')}</span>
                                                </span>
                                            </div>
                                        )}

                                        <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-[#eadcb4] bg-[#fffdf6] px-3 py-1.5 text-xs font-semibold text-[#3b2d08]">
                                            <svg className="h-4 w-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{item.date_string}</span>
                                            <span>•</span>
                                            <span>{item.time_string}</span>
                                        </div>

                                        {/* Seminar Title & Tagline */}
                                        <h3 className="home-display text-2xl leading-snug text-slate-900 transition group-hover:text-[#17621d] sm:text-[1.7rem]">
                                            {item.title}
                                        </h3>
                                        {item.tagline && (
                                            <p className="mt-2 text-sm font-medium text-[#9a7b24]">
                                                {item.tagline}
                                            </p>
                                        )}

                                        {/* Venue & Location Display (If Virtual Live Stream, hide city and show online stream link) */}
                                        {item.location_type === 'virtual' ? (
                                            <div className="mt-3 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-copper-800 bg-copper-50/90 px-3 py-1.5 rounded-xl border border-copper-200/80 w-fit">
                                                    <span>💻</span>
                                                    <span>{item.venue_name || t('seminars.virtual_stream', 'Virtual Live Stream')}</span>
                                                </div>
                                                {item.online_link && (
                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                        <a
                                                            href={item.online_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-xs group/link"
                                                        >
                                                            <span>🔗</span>
                                                            <span>{t('seminars.join_live_stream', 'Join Live Stream')}</span>
                                                            <svg className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                        <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]" title={item.online_link}>
                                                            {item.online_link}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : item.location_type === 'hybrid' ? (
                                            <div className="mt-3 flex flex-col gap-1.5">
                                                <div className="flex items-start gap-2 text-xs text-slate-600">
                                                    <span className="text-amber-700 font-bold">🌐 {t('seminars.hybrid_label', 'Hybrid:')}</span>
                                                    <span className="font-semibold text-slate-700">{item.venue_name}</span>
                                                    {item.venue_city && <span className="text-slate-400">({item.venue_city})</span>}
                                                </div>
                                                {item.online_link && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <a
                                                            href={item.online_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                                                        >
                                                            <span>🔗 {t('seminars.online_stream_link', 'Online Stream Link')}</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mt-3 flex items-start gap-2 text-xs text-slate-600">
                                                <svg className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-semibold text-slate-700">{item.venue_name}</span>
                                                {item.venue_city && <span className="text-slate-400">({item.venue_city})</span>}
                                            </div>
                                        )}

                                        {/* Description */}
                                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                        {/* Key Topics Tag Cloud */}
                                        {topics.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-1.5">
                                                {topics.map((topic, i) => (
                                                    <span
                                                        key={i}
                                                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 border border-slate-200/60"
                                                    >
                                                        ✓ {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Speaker Profile */}
                                        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#06240c] text-sm font-bold text-[#f6e7b4]">
                                                {item.speaker_initials || 'SL'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-tight">
                                                    {item.speaker_name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {item.speaker_title || t('seminars.default_speaker_title', 'Executive Master Coach')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Action Footer with Capacity Bar */}
                                    <div className="flex flex-col gap-3 border-t border-[#f3e6c2] bg-[#fffdf6] p-6 pt-4 sm:p-7">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-500">
                                                {t('seminars.capacity_status', 'Capacity Status')}: <strong className="text-slate-800">{t('seminars.booked', '{booked} / {capacity} booked').replace('{booked}', item.registered_count || 0).replace('{capacity}', item.capacity)}</strong>
                                            </span>
                                            <span className="font-bold text-copper-700">
                                                {displayPrice}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eadcb4]">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#06240c] to-[#c9a227] transition-all duration-500"
                                                style={{ width: `${fillPercentage}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                            <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                                                <span>✓</span> {t('seminars.certificate_included', 'Includes Certificate of Attendance')}
                                            </p>

                                            <div className="flex items-center gap-2">
                                                {/* Share Button (Telegram, Facebook, WhatsApp, Instagram, etc.) */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleShareModal(item)}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition shadow-2xs active:scale-95"
                                                    title={t('seminars.share_title', 'Share Seminar to Social Media')}
                                                >
                                                    <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                    </svg>
                                                    <span>{t('seminars.share', 'Share')}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => openRegisterModal(item)}
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#f6e7b4] to-[#d4af37] px-5 py-2.5 text-xs font-bold text-[#1a1404] shadow-[0_10px_24px_-14px_rgba(212,175,55,0.9)] transition hover:-translate-y-0.5 active:scale-95"
                                                >
                                                    <span>{isFree ? t('seminars.reserve_seat', 'Reserve Free Seat') : t('seminars.buy_ticket', 'Buy Ticket / Upload Slip')}</span>
                                                    <span aria-hidden="true">→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {filteredSeminars.length === 0 && (
                        <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                            <span className="text-4xl">🏛️</span>
                            <h3 className="mt-3 text-base font-bold text-slate-900">{t('seminars.none_found', 'No seminars found')}</h3>
                            <p className="mt-1 text-xs text-slate-500">{t('seminars.none_found_hint', 'Try adjusting your search query or switching filters.')}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setFilterType('all');
                                    setSearchQuery('');
                                }}
                                className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                            >
                                {t('seminars.reset_filters', 'Reset Filters')}
                            </button>
                        </div>
                    )}

                    {/* WHY ATTEND SECTION */}
                    <div className="relative mt-16 overflow-hidden rounded-[32px] border border-[#eadcb4] bg-[#fffdf6] px-6 py-10 sm:px-10 sm:py-14">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e4c36a]/25 blur-3xl" />
                        <div className="relative max-w-2xl">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9a7b24]">{t('seminars.experience', 'The seminar experience')}</p>
                            <h2 className="home-display mt-2 text-3xl text-slate-900 sm:text-4xl">
                                {t('seminars.why_join', 'Why join a Success Life live seminar')}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {t('seminars.why_join_body', 'These rooms are interactive breakthroughs with mentors and ambitious leaders, not a lecture you sit through.')}
                            </p>
                        </div>

                        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
                            {[
                                { icon: '01', title: t('seminars.why1_title', 'Elite networking'), body: t('seminars.why1_body', 'Meet executives, founders, and peers who are building something serious in Ethiopia.') },
                                { icon: '02', title: t('seminars.why2_title', 'Live hot-seat coaching'), body: t('seminars.why2_body', 'Bring a real bottleneck. Coaches work through mindset and career strategy on stage.') },
                                { icon: '03', title: t('seminars.why3_title', 'A certificate you can show'), body: t('seminars.why3_body', 'Every attendee receives a QR-verifiable certificate of attendance for LinkedIn and a CV.') },
                            ].map((item) => (
                                <div key={item.title} className="rounded-[24px] border border-[#eadcb4] bg-white p-6 shadow-[0_16px_40px_-30px_rgba(154,123,36,0.7)]">
                                    <span className="home-display text-3xl text-[#c9a227]">{item.icon}</span>
                                    <h4 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* ========================================================
                SEMINAR REGISTRATION & PAYMENT RECEIPT MODAL
               ======================================================== */}
            {selectedSeminar && !registeredPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-copper-100 my-8">
                        {/* Header */}
                        <div className="home-hero p-6 text-white">
                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                    {selectedSeminar.entrance_fee > 0 ? t('seminars.ticket_purchase', 'Ticket Purchase & Receipt') : t('seminars.free_registration', 'Free Registration')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSeminar(null)}
                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-sm font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                            <h3 className="mt-3 text-lg sm:text-xl font-bold font-serif leading-tight">
                                {selectedSeminar.title}
                            </h3>
                            <p className="mt-1 text-xs text-emerald-200">
                                📅 {selectedSeminar.date_string} • {selectedSeminar.time_string}
                            </p>
                            {selectedSeminar.location_type === 'virtual' && (
                                <p className="mt-1 text-xs text-amber-300 font-semibold flex items-center gap-1">
                                    <span>💻 {t('seminars.virtual_event', 'Virtual Live Stream Event')}</span>
                                </p>
                            )}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <FormErrors errors={errors} />

                            {/* Attendee Details */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    {t('seminars.full_name', 'Full Name')} <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.attendee_name}
                                    onChange={(e) => setData('attendee_name', e.target.value)}
                                    placeholder={t('seminars.full_name_placeholder', 'Enter your full name (for certificate)')}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800 focus:border-copper-500 focus:ring-1 focus:ring-copper-500"
                                />
                                {errors.attendee_name && <p className="text-xs text-rose-500 mt-1">{errors.attendee_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        {t('seminars.phone_telebirr', 'Phone / Telebirr')} <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.attendee_phone}
                                        onChange={(e) => setData('attendee_phone', e.target.value)}
                                        placeholder="+251 9... / 09..."
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                    {errors.attendee_phone && <p className="text-xs text-rose-500 mt-1">{errors.attendee_phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        {t('seminars.email_optional', 'Email (Optional)')}
                                    </label>
                                    <input
                                        type="email"
                                        value={data.attendee_email}
                                        onChange={(e) => setData('attendee_email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    {t('seminars.ticket_tier', 'Ticket Tier')}
                                </label>
                                <select
                                    value={data.ticket_tier}
                                    onChange={(e) => setData('ticket_tier', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm text-slate-800"
                                >
                                    <option value="Standard Delegate Pass">{t('seminars.tier_standard', 'Standard Delegate Pass')}</option>
                                    <option value="VIP Executive Access">{t('seminars.tier_vip_option', 'VIP Executive Access (Front-Row + Coaching Circle)')}</option>
                                    <option value="Virtual Live Broadcast">{t('seminars.tier_virtual_option', 'Virtual Live Broadcast Stream')}</option>
                                </select>
                            </div>

                            {/* PAYMENT INSTRUCTIONS & RECEIPT UPLOAD (Only If Seminar has Fee > 0) */}
                            {selectedSeminar.entrance_fee > 0 ? (
                                <div className="rounded-2xl bg-amber-50/70 border border-amber-200/90 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                            <span>💳</span> {t('seminars.payment_instructions', 'Payment Instructions')}
                                        </span>
                                        <span className="text-xs font-black text-copper-800">
                                            {t('seminars.fee', 'Fee: ETB {amount}').replace('{amount}', selectedSeminar.entrance_fee)}
                                        </span>
                                    </div>

                                    <div className="rounded-xl bg-white p-3 border border-amber-200 text-xs font-mono text-slate-800 space-y-1">
                                        {selectedSeminar.bank_info ? (
                                            <p className="whitespace-pre-line">{selectedSeminar.bank_info}</p>
                                        ) : (
                                            <>
                                                <p><strong>Telebirr:</strong> 0911 234 567 (Success Life Coaching)</p>
                                                <p><strong>CBE Account:</strong> 1000 4567 8901 (Success Life Coaching)</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Upload Receipt Slip */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                                            {t('seminars.upload_receipt', 'Upload Transfer Receipt / Screenshot')} <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            required
                                            onChange={handleReceiptChange}
                                            className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-copper-700 file:text-white hover:file:bg-copper-800"
                                        />
                                        {receiptPreview && (
                                            <div className="mt-2 h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                <img src={receiptPreview} alt={t('seminars.receipt_preview', 'Receipt preview')} className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        {errors.receipt && <p className="text-xs text-rose-500 mt-1">{errors.receipt}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                                            {t('seminars.txn_ref', 'Transaction Ref / Slip No. (Optional)')}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.transaction_reference}
                                            onChange={(e) => setData('transaction_reference', e.target.value)}
                                            placeholder={t('seminars.txn_placeholder', 'e.g. Telebirr Txn ID or Bank Slip number')}
                                            className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                                        />
                                    </div>
                                </div>
                            ) : (
                                /* IF FREE: Reassuring free admission banner with zero receipt upload required */
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs flex items-start gap-3">
                                    <span className="text-2xl">🎉</span>
                                    <div>
                                        <p className="font-bold text-emerald-950 text-sm">{t('seminars.free_event', 'Free Entrance Event')}</p>
                                        <p className="mt-0.5 text-emerald-800 leading-relaxed">
                                            {t('seminars.free_event_body', 'Admission to this seminar is 100% free. No bank transfer or receipt upload is required. Register your contact details to receive your confirmed delegate boarding pass immediately!')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gradient-to-r from-copper-700 to-copper-900 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-copper-glow transition active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? t('seminars.submitting', 'Submitting Details...') : selectedSeminar.entrance_fee > 0 ? t('seminars.submit_receipt', 'Submit Receipt & Confirm Seat 🎟️') : t('seminars.reserve_my_seat', 'Reserve My Free Seat 🎟️')}
                                </button>
                                <p className="mt-2 text-center text-[10px] text-slate-400">
                                    {selectedSeminar.entrance_fee > 0
                                        ? t('seminars.note_paid', 'Instant pass generated • Admin verifies receipt slip for venue clearance')
                                        : t('seminars.note_free', 'Instant boarding pass generated • Guaranteed free admission')}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                CONFIRMED DIGITAL SEMINAR PASS MODAL
               ======================================================== */}
            {registeredPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#FFFDF9] shadow-2xl border-4 border-[#004101]">
                        {/* Inner Ornate Gold Filigree */}
                        <div className="p-6 border-2 border-[#B8860B]/70 m-2 rounded-2xl relative">
                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => {
                                    setRegisteredPass(null);
                                    setSelectedSeminar(null);
                                }}
                                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-xs font-bold"
                            >
                                ✕
                            </button>

                            <div className="text-center">
                                {registeredPass.status === 'pending_approval' ? (
                                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-900 border border-amber-300">
                                        {t('seminars.receipt_submitted', '⏳ Receipt Submitted (Under Review)')}
                                    </span>
                                ) : (
                                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-900 border border-emerald-300">
                                        {t('seminars.pass_confirmed_badge', '✓ Pass Confirmed')}
                                    </span>
                                )}

                                <h3 className="mt-2 text-lg sm:text-xl font-black text-[#004101] font-serif">
                                    {t('seminars.pass_confirmed', 'Official Seminar Boarding Pass')}
                                </h3>
                                <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                                    Success Life Coaching Academy
                                </p>
                            </div>

                            {/* Pass Ticket Body */}
                            <div className="mt-4 rounded-xl bg-white p-4 border border-copper-100 shadow-xs space-y-2 text-xs">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">{t('seminars.attendee', 'Attendee:')}</span>
                                    <strong className="text-slate-900 font-bold">{registeredPass.attendee_name}</strong>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">{t('seminars.event', 'Event:')}</span>
                                    <strong className="text-slate-900 text-right max-w-[200px] truncate">{registeredPass.seminar_title}</strong>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500">{t('seminars.pass_tier', 'Pass Tier:')}</span>
                                    <span className="font-semibold text-copper-700">{tierLabel(registeredPass.ticket_tier)}</span>
                                </div>

                                {/* If Virtual Stream: Show format and online link on the pass */}
                                {(selectedSeminar?.location_type === 'virtual' || selectedSeminar?.online_link) && (
                                    <div className="border-b border-slate-100 pb-2 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">{t('seminars.format', 'Format:')}</span>
                                            <span className="font-bold text-copper-700">💻 {t('seminars.tier_virtual', 'Virtual Live Broadcast')}</span>
                                        </div>
                                        {selectedSeminar?.online_link && (
                                            <div className="flex flex-col gap-0.5 pt-1">
                                                <span className="text-[10px] font-bold text-emerald-800 uppercase">{t('seminars.stream_url', 'Live Stream URL:')}</span>
                                                <a
                                                    href={selectedSeminar.online_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-emerald-700 font-bold underline text-xs break-all"
                                                >
                                                    {selectedSeminar.online_link}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-slate-500">{t('seminars.ticket_code', 'Ticket Code:')}</span>
                                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                                        {registeredPass.registration_code}
                                    </span>
                                </div>
                            </div>

                            {/* Scannable Check-In QR Code */}
                            <div className="mt-4 flex flex-col items-center justify-center">
                                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                                    <CertificateQrCode
                                        value={`https://successlifecoaching.et/seminars/checkin/${registeredPass.registration_code}`}
                                        size={110}
                                    />
                                </div>
                                <p className="mt-1.5 text-[10px] text-slate-400 font-mono text-center">
                                    {registeredPass.status === 'pending_approval'
                                        ? t('seminars.qr_pending', 'Receipt is being verified by admin • Ticket activates upon approval')
                                        : t('seminars.qr_scan', 'Scan at venue or check-in screen for instant access')}
                                </p>
                            </div>

                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex-1 rounded-xl bg-[#004101] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-900 transition"
                                >
                                    🖨️ {t('seminars.print_pass', 'Print Pass')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRegisteredPass(null);
                                        setSelectedSeminar(null);
                                    }}
                                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                                >
                                    {t('seminars.done', 'Done')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                SOCIAL MEDIA SHARE MODAL (Telegram, Facebook, WhatsApp, Instagram, etc.)
               ======================================================== */}
            {sharingSeminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 animate-scale-in">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#004101] via-[#005a02] to-emerald-900 p-5 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">📢</span>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">
                                        {t('seminars.share_seminar', 'Share Seminar')}
                                    </h3>
                                    <p className="text-[11px] text-emerald-200 truncate max-w-[280px]">
                                        {sharingSeminar.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSharingSeminar(null)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-xs text-slate-600">
                                {t('seminars.invite', 'Invite friends, colleagues, and groups to join this seminar:')}
                            </p>

                            {/* Social Share Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {/* Telegram */}
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(getShareUrl(sharingSeminar))}&text=${encodeURIComponent(getShareText(sharingSeminar))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                    <span>Telegram</span>
                                </a>

                                {/* Facebook */}
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(sharingSeminar))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#1877F2] hover:bg-[#156cdb] text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    <span>Facebook</span>
                                </a>

                                {/* WhatsApp */}
                                <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText(sharingSeminar) + '\n\n' + getShareUrl(sharingSeminar))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 0C5.397 0 .013 5.384.013 12.018a11.95 11.95 0 0 0 1.624 6.024L0 24l6.156-1.614a11.97 11.97 0 0 0 5.875 1.53h.005c6.633 0 12.018-5.384 12.018-12.018A12.007 12.007 0 0 0 12.031 0zm-.005 21.968h-.004a9.96 9.96 0 0 1-5.08-1.393l-.365-.217-3.774.99.1-3.676-.237-.378a9.94 9.94 0 0 1-1.523-5.276c0-5.503 4.478-9.98 9.983-9.98 2.665 0 5.172 1.038 7.056 2.923a9.927 9.927 0 0 1 2.924 7.057c0 5.504-4.478 9.98-9.98 9.98zm5.474-7.476c-.3-.15-1.776-.876-2.052-.976-.275-.1-.476-.15-.676.15-.2.3-.775.976-.95 1.176-.176.2-.351.226-.652.076-.3-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.675-2.083-.175-.3-.019-.462.132-.612.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.233-.244-.587-.492-.507-.676-.516h-.576c-.2 0-.526.075-.801.375s-1.052 1.028-1.052 2.507 1.077 2.908 1.228 3.108c.15.2 2.12 3.238 5.136 4.542.717.31 1.277.496 1.714.635.72.229 1.375.197 1.893.12.578-.087 1.776-.726 2.026-1.428.251-.702.251-1.303.176-1.428-.075-.125-.276-.2-.576-.35z"/></svg>
                                    <span>WhatsApp</span>
                                </a>

                                {/* Instagram */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleCopyLink(sharingSeminar);
                                        window.open('https://www.instagram.com', '_blank');
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    <span>Instagram</span>
                                </button>

                                {/* X (Twitter) */}
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl(sharingSeminar))}&text=${encodeURIComponent(getShareText(sharingSeminar))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-black hover:bg-zinc-800 text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    <span>X (Twitter)</span>
                                </a>

                                {/* LinkedIn */}
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(sharingSeminar))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] text-white p-3 text-xs font-bold transition shadow-xs active:scale-95"
                                >
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    <span>LinkedIn</span>
                                </a>
                            </div>

                            {/* Direct Copy Link Box */}
                            <div className="pt-2">
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    {t('seminars.direct_link', 'Direct Seminar Link')}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={getShareUrl(sharingSeminar)}
                                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 focus:outline-hidden select-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopyLink(sharingSeminar)}
                                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                                            copiedToast
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-[#004101] hover:bg-emerald-900 text-white shadow-xs'
                                        }`}
                                    >
                                        {copiedToast ? t('seminars.copied', '✓ Copied!') : t('seminars.copy_link', 'Copy Link')}
                                    </button>
                                </div>
                                {copiedToast && (
                                    <p className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                        <span>✓</span> {t('seminars.link_copied_share', 'Link copied to clipboard! Share it on Telegram, Instagram, or WhatsApp.')}
                                    </p>
                                )}
                            </div>

                            {/* Device Native Share (If supported) */}
                            {typeof navigator !== 'undefined' && navigator?.share && (
                                <button
                                    type="button"
                                    onClick={() => handleNativeShare(sharingSeminar)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5"
                                >
                                    <span>📱</span>
                                    <span>{t('seminars.share_device', 'Share via Device Apps (More...)')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
