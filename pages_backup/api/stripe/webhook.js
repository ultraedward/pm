// FILE: pages/api/stripe/webhook.js
import { buffer } from "micro";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

const useMock = process.env.USE_MOCK_DATA === "true";

export default async function handler(req, res) {
  if (useMock) return res.status(200).json({ ok: true, mock: true });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  try {
    stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
