import { getStripe } from "../../../lib/stripe.js";
import { getSessionFromReq } from "../../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSessionFromReq(req);
  if (!session?.user?.email) return res.status(401).json({ ok: false });

  const stripe = getStripe();
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Premium Alerts (lifetime)" },
          unit_amount: 2900
        },
        quantity: 1
      }
    ],
    success_url: `${base}/account?paid=1`,
    cancel_url: `${base}/pricing`
  });

  res.status(200).json({ url: checkout.url });
}
