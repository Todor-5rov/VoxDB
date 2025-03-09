import AppHeader from "@/app/Pages/Components/AppHeader"
import PricingPlans from "@/app/Pages/Pricing/pricing"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4 pt-24">
        <div className="max-w-7xl w-full">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-white text-center mb-12">
            Choose the plan that fits your needs and start transforming your database queries today
          </p>
          <PricingPlans />
        </div>
      </main>
    </div>
  )
}