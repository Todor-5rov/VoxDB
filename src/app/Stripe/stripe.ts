"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return "http://localhost:3000" // Fallback for local development
}

export async function createCheckoutSession(priceId: string) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set")
  }

  if (!priceId) {
    throw new Error("Price ID is not provided")
  }

  const baseUrl = getBaseUrl()
  console.log("Creating checkout session with base URL:", baseUrl)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      billing_address_collection: "required",
      allow_promotion_codes: true,
    })

    if (!session?.url) {
      throw new Error("Failed to create checkout session URL")
    }

    return { url: session.url }
  } catch (error) {
    console.error("Stripe error:", error)
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe error: ${error.message}`)
    }
    throw new Error("An unknown error occurred with Stripe")
  }
}

