// app/api/stripe/portal/route.ts
// FULL SHEET — COPY / PASTE

import Stripe from "stripe"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { email: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Find Stripe customer by email
  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  })

  if (customers.data.length === 0) {
    return NextResponse.json(
      { error: "No Stripe customer found" },
      { status: 404 }
    )
  }

  const portalSession =
    await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    })

  return NextResponse.json({ url: portalSession.url })
}
