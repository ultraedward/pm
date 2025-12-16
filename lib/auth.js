import { prisma } from "./prisma";
import { serialize, parse } from "cookie";

const SESSION_NAME = "session_id";

export async function createSession(res, userId) {
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  res.setHeader(
    "Set-Cookie",
    serialize(SESSION_NAME, session.id, {
      path: "/",
      httpOnly: true,
      sameSite: "lax"
    })
  );
}

export async function getSessionFromReq(req) {
  const cookies = parse(req.headers.cookie || "");
  const sessionId = cookies[SESSION_NAME];
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session;
}
