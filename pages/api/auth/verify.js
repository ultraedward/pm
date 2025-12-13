import { prisma } from "../../../lib/prisma.js";
import { randomToken, setSessionCookie } from "../../../lib/auth.js";

export default async function handler(req, res) {
  const token = String(req.query?.token || "");
  if (!token) return res.status(400).send("Missing token");

  const row = await prisma.magicLinkToken.findUnique({ where: { token } });
  if (!row) return res.status(400).send("Invalid token");
  if (new Date(row.expiresAt).getTime() < Date.now()) return res.status(400).send("Expired token");

  const email = row.email;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email }
  });

  await prisma.magicLinkToken.delete({ where: { token } });

  const sessionToken = randomToken(32);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { userId: user.id, token: sessionToken, expiresAt }
  });

  setSessionCookie(res, sessionToken);
  res.redirect("/account");
}
