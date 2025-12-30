import { prisma } from "../../lib/prisma";
import { createSession } from "../../lib/auth";

export default async function handler(req, res) {
  const { token } = req.query;

  const record = await prisma.magicLinkToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    return res.redirect("/login");
  }

  let user = await prisma.user.findUnique({
    where: { email: record.email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: { email: record.email }
    });
  }

  await prisma.magicLinkToken.delete({ where: { token } });
  await createSession(res, user.id);

  res.redirect("/account");
}
