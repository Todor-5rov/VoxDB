"use client"

import { useState, useEffect } from "react"
import { createCheckoutSession } from "@/app/Stripe/stripe"
import { Check } from 'lucide-react'

const plans = [
  {
    name: "Basic",
    price: 29.99,
    features: ["Unlimited database queries", "3 database connections", "Basic query optimization", "Email support"],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
  },
  {
    name: "Pro",
    price: 79.99,
    features: [
      "Everything in Basic, plus:",
      "10 database connections",
      "Advanced query optimization",
      "Priority support",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
  {
    name: "Enterprise",
    price: 199.99,
    features: [
      "Everything in Pro, plus:",
      "Unlimited connections",
      "Custom AI model training",
      "Dedicated account manager",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  },
]

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return "http://localhost:3000"
}

export default function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("Environment check:", {
      baseUrl: getBaseUrl(),
      vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
      publicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      priceIds: {
        basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
        pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
      },
    })
  }, [])

  const handleSubscribe = async (stripePriceId: string | undefined) => {
    setError(null)
    if (!stripePriceId) {
      setError("Invalid price ID. Please contact support.")
      return
    }

    setLoading(stripePriceId)
    try {
      const result = await createCheckoutSession(stripePriceId)
      if (result?.url) {
        window.location.href = result.url
      } else {
        throw new Error("No checkout URL returned")
      }
    } catch (err) {
      console.error("Subscription error:", err)
      setError(err instanceof Error ? err.message : "Failed to start subscription process")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-black bg-opacity-30 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white border-opacity-20 flex flex-col"
          >
            <h2 className="text-2xl font-bold text-white mb-4">{plan.name}</h2>
            <p className="text-3xl md:text-4xl font-bold text-white mb-2">
              ${plan.price}
              <span className="text-lg md:text-xl font-normal">/month</span>
            </p>
            <ul className="mb-6 md:mb-8 flex-grow space-y-2 md:space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-white flex items-start bg-white bg-opacity-10 rounded-md p-2">
                  <Check className="w-5 h-5 mr-2 text-white flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.stripePriceId)}
              disabled={loading === plan.stripePriceId}
              className="w-full bg-accent text-white font-semibold rounded-full py-2 md:py-3 px-4 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition duration-200"
            >
              {loading === plan.stripePriceId ? "Processing..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}