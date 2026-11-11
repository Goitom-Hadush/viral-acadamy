// Course card price row: Birr (ETB) on the left, Dollar (USD) on the right.
export default function CoursePriceBadges({ price, priceUsd, freeLabel = 'FREE', className = '' }) {
    const etb = Number(price) || 0;
    const usd = Number(priceUsd) || 0;
    const isFree = etb === 0 && usd === 0;

    return (
        <div className={`pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 ${className}`}>
            {/* Left: Birr */}
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold shadow-md sm:text-sm ${isFree ? 'bg-emerald-500 text-white' : 'bg-[#f6e7b4] text-[#3b2d08]'}`}>
                {isFree ? freeLabel : `${etb.toLocaleString()} ETB`}
            </span>

            {/* Right: Dollar (only when the admin entered a USD price) */}
            {usd > 0 && (
                <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-extrabold text-amber-200 shadow-md backdrop-blur sm:text-sm">
                    ${usd.toLocaleString()} USD
                </span>
            )}
        </div>
    );
}
