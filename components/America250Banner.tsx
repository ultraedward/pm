import { isPromoActive, AMERICA_250_PROMO } from "@/lib/promo";

interface Props {
  /** sub_id suffix appended to the affiliate URL for placement tracking */
  subId?: string;
}

/**
 * Site-wide promo strip for the Birch Gold America 250 promotion.
 * Renders only when today is within the promo window — returns null otherwise,
 * so there is zero layout impact after July 10.
 */
export function America250Banner({ subId = "banner" }: Props) {
  if (!isPromoActive()) return null;

  const base = process.env.AFFILIATE_BIRCH_URL;
  if (!base) return null;

  const url = `${base}&sub_id=america250_${subId}`;

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        background:
          "linear-gradient(135deg, rgba(0,6,24,0.98) 0%, rgba(8,16,44,0.98) 50%, rgba(0,6,24,0.98) 100%)",
        borderColor: "rgba(212,175,55,0.18)",
      }}
    >
      {/* Decorative stars — purely visual, hidden from assistive tech */}
      <div
        className="pointer-events-none select-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
      >
        <span className="absolute text-[72px] leading-none -top-3 -left-1 text-white">★</span>
        <span className="absolute text-[36px] leading-none top-0.5 right-10 text-white">★</span>
        <span className="absolute text-[18px] leading-none bottom-0.5 left-36 text-white">★</span>
        <span className="absolute text-[18px] leading-none top-1 left-1/2 text-white">★</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Left: flag + copy */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap min-w-0">
          <span aria-hidden="true" className="text-base leading-none flex-shrink-0">🇺🇸</span>

          <span className="text-[11px] sm:text-xs font-bold tracking-wide whitespace-nowrap" style={{ color: "#ffffff" }}>
            {AMERICA_250_PROMO.headline}
          </span>

          <span aria-hidden="true" className="hidden sm:inline text-[10px]" style={{ color: "#aaaaaa" }}>·</span>

          <span className="hidden sm:inline text-[11px] leading-snug" style={{ color: "#eeeeee" }}>
            Free silver round with every $10K at Birch Gold
          </span>

          <span aria-hidden="true" className="hidden md:inline text-[10px]" style={{ color: "#aaaaaa" }}>·</span>

          <span className="hidden md:inline text-[10px] font-mono tracking-wider" style={{ color: "#fbbf24" }}>
            Jun 8 – Jul 10
          </span>
        </div>

        {/* Right: CTA pill */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex-shrink-0 rounded-full border border-amber-500/35 bg-amber-500/10 px-3.5 py-1.5 text-[11px] font-bold text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-all whitespace-nowrap"
        >
          Get details →
        </a>
      </div>
    </div>
  );
}
