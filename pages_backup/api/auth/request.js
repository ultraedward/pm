import { prisma } from "../../../lib/prisma.js";
import { randomToken } from "../../../lib/auth.js";
import { sendMagicLink } from "../../../lib/mailer.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return res.status(400).json({ ok: false });

  const token = randomToken(24);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.magicLinkToken.create({
    data: { email, token, expiresAt }
  });

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${base}/api/auth/verify?token=${token}`;

  await sendMagicLink({ to: email, url });

  res.status(200).json({ ok: true });
}
