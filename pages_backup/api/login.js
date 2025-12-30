import prisma from "../../lib/prisma";
import { createSession, setSessionCookie } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const sessionToken = createSession();
  setSessionCookie(res, sessionToken);

  res.status(200).json({ success: true });
}
