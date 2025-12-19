import prisma from "../../../lib/prisma.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, direction, target } = req.body;

  if (!id || !direction || typeof target !== "number") {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    await prisma.alert.update({
      where: { id },
      data: {
        direction,
        target,
        triggered: false, // re-arm on edit (important UX choice)
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update alert error:", error);
    res.status(500).json({ error: "Failed to update alert" });
  }
}
