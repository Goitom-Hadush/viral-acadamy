import { useEffect, useState } from 'react';

/**
 * AnimatedUrl — the website address pill shown above the homepage video.
 *
 * Sequence: pill floats in -> address types out with a caret -> gold shimmer on
 * the text + a light sheen sweeping across the pill, globe icon gently pulsing.
 * The full address is always laid out (invisible) so nothing jumps while typing.
 * Visitors who prefer reduced motion simply see the finished pill.
 */
export default function AnimatedUrl({
    href,
    text,
    startDelay = 1100,
    speed = 55,
    className = '',
}) {
    const [count, setCount] = useState(0);
    const [caret, setCaret] = useState(true);
    const done = count >= text.length;

    useEffect(() => {
        const reduce =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduce) {
            setCount(text.length);
            setCaret(false);
            return undefined;
        }

        setCount(0);
        setCaret(true);

        let interval;
        const start = setTimeout(() => {
            interval = setInterval(() => {
                setCount((c) => {
                    if (c >= text.length) {
                        clearInterval(interval);
                        return c;
                    }
                    return c + 1;
                });
            }, speed);
        }, startDelay);

        return () => {
            clearTimeout(start);
            clearInterval(interval);
        };
    }, [text, startDelay, speed]);

    // Let the caret blink for a moment after typing finishes, then hide it.
    useEffect(() => {
        if (!done || !caret) return undefined;
        const hide = setTimeout(() => setCaret(false), 2200);
        return () => clearTimeout(hide);
    }, [done, caret]);

    return (
        <div style={{ animationDelay: '800ms' }} className={`hero-fade-up self-center ${className}`}>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={text}
                className="url-pill group relative inline-flex min-h-10 max-w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-[#e4c36a]/30 bg-white/8 px-3 py-2 text-[10px] font-semibold tracking-wide text-[#f6e7b4] transition duration-300 hover:-translate-y-0.5 hover:border-[#e4c36a]/80 hover:bg-white/10 hover:shadow-[0_10px_30px_-10px_rgba(228,195,106,0.55)] sm:px-4 sm:text-sm"
            >
                {/* Light sheen sweeping across the pill */}
                <span aria-hidden="true" className="url-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3" />

                <svg
                    className="url-globe relative h-4 w-4 shrink-0 text-[#e4c36a]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                    <path strokeWidth="1.8" strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>

                <span className="relative inline-block" aria-hidden="true">
                    {/* Reserves the final width so the pill never resizes while typing */}
                    <span className="invisible whitespace-nowrap">{text}</span>
                    <span className={`absolute inset-0 whitespace-nowrap text-left ${done ? 'url-shimmer' : ''}`}>
                        {text.slice(0, count)}
                        {caret && <span className="url-caret" />}
                    </span>
                </span>
            </a>
        </div>
    );
}
