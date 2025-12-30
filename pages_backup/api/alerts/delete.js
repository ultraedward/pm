import prisma from "../../../lib/prisma.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing alert id" });
  }

  try {
    await prisma.alert.delete({
      where: { id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete alert error:", error);
    res.status(500).json({ error: "Failed to delete alert" });
  }
}
