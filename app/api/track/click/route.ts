// /api/track/click — outbound dealer click tracker.
//
// Every CTA on /compare (and later, dealer CTAs in alert emails / digest)
// points here rather than directly at the dealer. We mint a sub-ID, log a
// DealerClick row, then 302 to the (affiliate-wrapped) dealer URL with the
// sub-ID embedded so the affiliate network's click report comes back tagged
// with our identifier. That lets us reconcile their conversion data against
// our click table.
//
// Why server-side redirect rather than client-side beacon:
//   - Adblockers can't strip a server hop the way they strip pixel beacons.
//   - "Open in new tab → close before JS runs" still records the click.
//   - The dealer drops their affiliate cookie on their own first-party
//     domain regardless, so the 50-100ms extra latency has no conversion
//     cost.
//
// Safety: this endpoint does NOT accept a free-form `to` URL parameter.
// Coin and dealer IDs are validated against the catalog and the outbound URL
// is rebuilt server-side. That keeps it from being abused as an open
// redirector.

import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { coinById } from "@/lib/compare/coins";
import { dealerById, buildDealerUrl } from "@/lib/compare/dealers";

export const dynamic = "force-dynamic";

// Allowlist of click sources — anything else is normalized to "compare".
// Keep this in sync with where we add tracked CTAs over time.
const ALLOWED_SOURCES = new Set([
  "compare",
  "alert-email",
  "digest",
  "faq",
  "about",
  "methodology",
]);

function hashIp(ip: string): string {
  // Truncated SHA-256 — enough entropy for unique-click counting + bot
  // fingerprinting, short enough to keep row size sane. Not reversible.
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const coinId = url.searchParams.get("coin") ?? "";
  const dealerId = url.searchParams.get("dealer") ?? "";
  const sourceRaw = url.searchParams.get("source") ?? "compare";
  const source = ALLOWED_SOURCES.has(sourceRaw) ? sourceRaw : "compare";

  // Validate the coin × dealer pair against the catalog. Bad input bounces
  // the user back to /compare rather than 404'ing — a real human shouldn't
  // ever land here with bad params, but a bot or a stale link shouldn't see
  // a hard error either.
  const coin = coinById(coinId);
  const dealer = dealerById(dealerId);
  if (!coin || !dealer) {
    return NextResponse.redirect(new URL("/compare", req.url), 302);
  }

  const slug = coin.slugs[dealer.id];
  if (!slug) {
    // We don't have a verified product page for this combo. Fall back to the
    // /compare page rather than sending the user to a 404 on the dealer site.
    return NextResponse.redirect(new URL("/compare", req.url), 302);
  }

  // Mint a per-click sub-ID. Format is opaque on purpose — the affiliate
  // network just echoes whatever string we send in their report.
  const subId = `lk${crypto.randomBytes(8).toString("base64url")}`;

  const outbound = buildDealerUrl(dealer, slug, subId);
  if (!outbound) {
    return NextResponse.redirect(new URL("/compare", req.url), 302);
  }

  // Best-effort session lookup. Logged-in clicks are disproportionately
  // valuable for cohorting (alert-driven buyers, returning users) so it's
  // worth attaching when we can.
  let userId: string | null = null;
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id ?? null;
    }
  } catch {
    // session lookup failure shouldn't drop the click — log it anonymously
  }

  const ipRaw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "";
  const ipHash = ipRaw ? hashIp(ipRaw) : null;

  // Trim user-agent and referer to bounded sizes — both can be arbitrary
  // long strings from clients, and we don't want a huge UA blowing up row size.
  const userAgent = req.headers.get("user-agent")?.slice(0, 256) ?? null;
  const referer = req.headers.get("referer")?.slice(0, 512) ?? null;

  // We await the insert rather than fire-and-forget. Vercel can shut down
  // the function instance the moment the response goes out, which would
  // race the unawaited promise. ~5ms on an indexed insert is fine; the
  // affiliate cookie still drops the moment the dealer page loads, so this
  // doesn't measurably affect conversion.
  try {
    await prisma.dealerClick.create({
      data: {
        coinId: coin.id,
        dealerId: dealer.id,
        userId,
        subId,
        source,
        userAgent,
        ipHash,
        referer,
      },
    });
  } catch {
    // Logging failure must not block the redirect — the affiliate click is
    // still legitimate even if our analytics layer fell over.
  }

  return NextResponse.redirect(outbound, 302);
}
