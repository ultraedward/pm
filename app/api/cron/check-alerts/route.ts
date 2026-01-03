import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    return Response.json({
      status: "ok",
      message: "cron route is alive",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
