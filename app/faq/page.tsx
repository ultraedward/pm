import { FaqClient } from "./FaqClient";

export const metadata = {
  title: "Precious Metals FAQ — Spot Prices, Troy Ounces, Junk Silver & More",
  description:
    "Answers to common questions about precious metals and about Lode: what spot price means, how gold prices are set, troy oz vs regular oz, what junk silver is, how price alerts work, and more.",
  alternates: {
    canonical: "https://lode.rocks/faq",
  },
  openGraph: {
    title: "Precious Metals FAQ — Spot Prices, Troy Ounces, Junk Silver & More",
    description:
      "What is spot price? How is the gold price set? What's a troy ounce? What is junk silver? Direct answers to common precious metals questions.",
    url: "https://lode.rocks/faq",
  },
};

// FAQ structured data — enables Google FAQ rich results (expandable Q&As in SERP)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lode.rocks" },
        { "@type": "ListItem", "position": 2, "name": "FAQ",  "item": "https://lode.rocks/faq" },
      ],
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is spot price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot price is the current market price to buy or sell one troy ounce of a metal for immediate delivery. It is set continuously by futures markets (primarily COMEX in the US) based on supply, demand, and the nearest active futures contract. The 'spot price' you see on Lode reflects the front-month futures price from Yahoo Finance — it is not a dealer price. Dealers add a premium above spot to cover minting, shipping, and profit margin.",
          },
        },
        {
          "@type": "Question",
          "name": "What is a troy ounce?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A troy ounce (ozt) is the unit of weight used for precious metals worldwide. It equals 31.1035 grams. A standard avoirdupois ounce (the one used for food and everyday items) is 28.3495 grams — about 9.7% lighter. When a dealer or price quote says 'per ounce' for gold or silver, they always mean a troy ounce.",
          },
        },
        {
          "@type": "Question",
          "name": "How is the gold price determined?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gold's spot price is driven primarily by COMEX futures trading in New York and the London Bullion Market Association (LBMA) benchmark set twice daily in London. The price reflects supply and demand across physical gold (mining output, central bank buying and selling, jewelry demand) and financial gold (ETFs, futures contracts, options). Macroeconomic factors — inflation expectations, real interest rates, the US dollar's strength, and geopolitical uncertainty — also move the price significantly.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between spot price and melt value?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Spot price is the per-troy-ounce market price for pure (.999+) metal. Melt value is what a specific coin or bar is intrinsically worth based on its actual metal content. A pre-1965 US quarter contains 0.18084 troy oz of silver — its melt value is 0.18084 × the silver spot price. If a coin has numismatic (collector) value, it may sell for more than melt. Dealers typically buy scrap silver at 90–97% of melt value.",
          },
        },
        {
          "@type": "Question",
          "name": "What is junk silver?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Junk silver refers to pre-1965 US dimes, quarters, and half dollars that are 90% silver. 'Junk' does not mean low quality — it means no numismatic premium. These coins trade purely on their silver content. One dollar of face value in 90% silver coins contains approximately 0.715 troy ounces of silver (adjusted for average coin wear). The Lode junk silver calculator at lode.rocks/junk-silver-calculator lets you calculate melt value by face value or by individual coin count.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the gold-to-silver ratio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The gold-to-silver ratio is how many troy ounces of silver it takes to buy one troy ounce of gold. If gold is $3,000/ozt and silver is $30/ozt, the ratio is 100. Historically the ratio has ranged from about 15:1 (bimetallic standard era) to over 120:1 (COVID-era spike). Precious metals investors use the ratio to decide whether gold or silver appears relatively cheap or expensive versus the other.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the premium over spot?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Premium over spot is the markup dealers charge above the spot price. For example, if silver spot is $30/ozt and an American Silver Eagle sells for $35, the premium is $5 (about 16.7%). Premiums cover fabrication, distribution, dealer margin, and market liquidity. Generic rounds carry lower premiums than government-minted coins. The Lode compare page at lode.rocks/compare tracks dealer premiums in real time.",
          },
        },
        {
          "@type": "Question",
          "name": "What is the difference between gold bullion and numismatic coins?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bullion coins (American Gold Eagles, Canadian Maple Leafs, Krugerrands) are purchased primarily for their gold content and trade near spot price plus a modest premium. Numismatic coins are valued for rarity, condition, and collector demand — a rare date Morgan dollar in top grade may sell for many times its silver melt value. Most first-time precious metals buyers stick to bullion because the pricing is transparent and the exit market is straightforward.",
          },
        },
        {
          "@type": "Question",
          "name": "Is Lode legit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Lode is an independent precious metals price tracker. It does not buy, sell, or broker metal — no funds ever move through the site. Spot prices come from Yahoo Finance futures data, routed through a Cloudflare Worker, and can be cross-checked against Kitco or any broker terminal. Data collection and usage are documented in the Privacy Policy at lode.rocks/privacy.",
          },
        },
        {
          "@type": "Question",
          "name": "Where does the spot price data come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Live spot prices come from Yahoo Finance futures data (GC=F, SI=F, PL=F, PA=F), routed through a Cloudflare Worker. Full methodology is published at lode.rocks/methodology.",
          },
        },
        {
          "@type": "Question",
          "name": "How fresh are the precious metals prices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prices are fetched live when you load a page, cached on Lode's servers for up to 10 minutes, then refetched. During active market hours the displayed price is at most a few minutes old. On weekends and holidays the price reflects the last traded value — markets are closed.",
          },
        },
        {
          "@type": "Question",
          "name": "How do gold and silver price alerts work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You set a target price (e.g. 'alert me when gold goes above $2,400/ozt'). When the spot price Lode fetches crosses that threshold, one email is sent to your account address. Alerts are checked once per day. Email is the only notification channel — no SMS, no push notifications.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I use Lode without creating an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The price dashboard, coin melt calculator, gram converter, and portfolio tracker all work without signing in. If you use the portfolio tracker anonymously, holdings are stored only in your browser's localStorage and never sent to Lode's servers. An account is only required for email price alerts or cross-device portfolio sync.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Lode sell precious metals?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Lode is not a dealer, broker, or exchange. It does not hold metal, sell metal, or take commissions from dealers. It is a price tracking and comparison tool only.",
          },
        },
        {
          "@type": "Question",
          "name": "Does Lode sell user data or show ads?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Lode does not run advertising, sell user data, or use third-party tracking cookies. The only third-party services used are those operationally required to run the site (Google OAuth, Resend, Neon, Vercel), documented in the Privacy Policy.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Lode make money?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Affiliate commissions on dealer outbound clicks from the compare page at lode.rocks/compare. When you click through to APMEX, JM Bullion, SD Bullion, or Money Metals and buy, Lode may earn a referral fee at no cost to you. Commissions do not affect rankings — the compare page sorts by estimated total cost.",
          },
        },
        {
          "@type": "Question",
          "name": "Is the information on Lode financial advice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Everything on Lode is informational — spot prices, calculations, and alerts are tools to help you see market data, not recommendations to buy, sell, or hold anything. Consult a qualified financial professional for investment decisions.",
          },
        },
      ],
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </>
  );
}
