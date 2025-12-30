import { prisma } from "../../../lib/prisma";
import { createSession } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name:
          typeof name === "string" && name.trim()
            ? name.trim()
            : undefined,
      },
      create: {
        email: normalizedEmail,
        name:
          typeof name === "string" && name.trim()
            ? name.trim()
            : null,
      },
    });

    await createSession(res, user.id);

    return res.status(200).json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}
