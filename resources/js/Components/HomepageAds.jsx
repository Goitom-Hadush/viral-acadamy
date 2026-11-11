import { useT } from '@/hooks/useT';

const TIER_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

function TinyLogo({ ad, t }) {
    if (ad.image_url) {
        return (
            <img
                src={ad.image_url}
                alt={ad.title || t('home.partner', 'Partner')}
                className="h-6 w-auto max-w-[100px] object-contain sm:h-7 sm:max-w-[120px]"
                loading="lazy"
                decoding="async"
                draggable={false}
            />
        );
    }

    if (ad.video_url) {
        // Static preview only — no autoplay in the strip (saves CPU/bandwidth)
        return (
            <video
                src={ad.video_url}
                muted
                playsInline
                preload="metadata"
                className="h-6 w-auto max-w-[100px] rounded object-contain sm:h-7 sm:max-w-[120px]"
                draggable={false}
            />
        );
    }

    return null;
}

export default function HomepageAds({ advertisements = [] }) {
    const t = useT();

    const ads = (Array.isArray(advertisements) ? advertisements : [])
        .filter((ad) => ad.image_url || ad.video_url)
        .sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

    if (ads.length === 0) return null;

    const loopAds = ads.length > 1 ? [...ads, ...ads] : ads;
    const animate = ads.length > 1;

    return (
        <section
            className="section-shell mb-2 sm:mb-3"
            aria-label={t('home.ads', 'Advertisements')}
        >
            <div className="overflow-hidden rounded-2xl border border-copper-100/80 bg-white/80 p-1.5 shadow-[0_8px_24px_-18px_rgba(184,115,51,0.28)] sm:p-2">
                <div className={`ad-marquee-mask ${animate ? 'ad-marquee-mask--animate' : ''}`}>
                    <div className={`ad-marquee-track flex items-center gap-6 px-1 sm:gap-10 ${animate ? 'ad-marquee-track--animate' : ''}`}>
                        {loopAds.map((ad, i) => {
                            const Wrapper = ad.link_url ? 'a' : 'div';
                            const wrapperProps = ad.link_url
                                ? { href: ad.link_url, target: '_blank', rel: 'noopener noreferrer' }
                                : {};

                            return (
                                <Wrapper
                                    key={`${ad.id}-${i}`}
                                    {...wrapperProps}
                                    className="flex shrink-0 items-center opacity-90 transition hover:opacity-100"
                                    title={ad.title || undefined}
                                >
                                    <TinyLogo ad={ad} t={t} />
                                </Wrapper>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
