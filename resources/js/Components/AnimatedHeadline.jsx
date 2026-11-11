/**
 * AnimatedHeadline — reveals a headline word by word (rise + un-blur), then
 * keeps a gold shimmer moving across the last `highlightLast` words.
 *
 * Works with any language (splits on spaces) and re-plays when the text changes,
 * e.g. when the visitor switches between English / Amharic / Tigrinya.
 * Screen readers get the full sentence via aria-label; motion is disabled for
 * visitors who prefer reduced motion (see app.css).
 */
export default function AnimatedHeadline({
    text = '',
    as: Tag = 'h1',
    className = '',
    highlightLast = 2,
    startDelay = 250,
    step = 75,
}) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const highlightFrom = Math.max(0, words.length - highlightLast);

    return (
        <Tag className={className} aria-label={text}>
            {words.map((word, i) => {
                const highlighted = i >= highlightFrom;
                return (
                    <span key={`${i}-${word}`}>
                        <span
                            aria-hidden="true"
                            className={`hero-word ${highlighted ? 'hero-word-gold' : ''}`}
                            style={{ animationDelay: `${startDelay + i * step}ms` }}
                        >
                            {word}
                        </span>
                        {i < words.length - 1 ? ' ' : null}
                    </span>
                );
            })}
        </Tag>
    );
}
