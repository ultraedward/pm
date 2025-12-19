import { sendEmail } from "../../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Change this if you want to test another inbox
    const to = "ultra.edward@gmail.com";

    await sendEmail({
      to,
      subject: "✅ Test email from Precious Metals Alerts",
      html: "<p>If you see this, Resend email is working 🎉</p>",
    });

    return res.status(200).json({ ok: true, to });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({ ok: false, error: error.message || "Failed" });
  }
}
