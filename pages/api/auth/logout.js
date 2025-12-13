import { prisma } from "../../../lib/prisma.js";
import { clearSessionCookie, sessionCookieName } from "../../../lib/auth.js";

export default async function handler(req, res) {
  const cookie = req.headers.cookie || "";
  const name = sessionCookieName();
  const match = cookie.match(new RegExp(`${name}=([^;]+)`));
  const token = match?.[1];

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  clearSessionCookie(res);
  res.redirect("/");
}
