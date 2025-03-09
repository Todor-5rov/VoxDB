"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/shadcn/ui/button"
import { ArrowRight, Database, Sparkles, Lock } from 'lucide-react'
import AppHeader from "@/app//Pages/Components/AppHeader"
import { auth } from "@/app/Firebase/firebase"
import type { User } from "firebase/auth"
import type { ReactNode } from "react"

// Mock function to check if user has an active plan
const hasActivePlan = (user: User | null) => {
  // In a real application, this would check the user's subscription status
  // For now, we'll just return false to always redirect to the pricing page
  return false
}

// Define interfaces for component props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleCtaClick = () => {
    if (!user) {
      router.push("/login")
    } else if (!hasActivePlan(user)) {
      router.push("/pricing")
    } else {
      router.push("/studio")
    }
  }

  return (
    <div className="min-h-screen relative">
      <AppHeader />
      <main>
        {/* Hero Section */}
        <section className="pt-16 bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transform Your Questions into Powerful Database Insights
              </h1>
              <p className="text-xl mb-8">
                VoxDB leverages AI to turn your natural language questions into powerful database queries. Simplify data
                retrieval and boost productivity with our intuitive database interaction platform.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90" onClick={handleCtaClick}>
                <span>
                  Get Started <ArrowRight className="ml-2" />
                </span>
              </Button>
            </div>
            <div className="md:w-1/2 hidden md:block">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Designer-38sf4Vt9iBf4PDPPy2e19u1fdDFgzl.jpeg"
                alt="3D illustration of databases with people interacting through natural language"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose VoxDB?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Database className="w-12 h-12 text-accent" />}
                title="Natural Language Queries"
                description="Interact with your database using plain English. No need to write complex SQL queries manually."
              />
              <FeatureCard
                icon={<Sparkles className="w-12 h-12 text-accent" />}
                title="AI-Powered Conversion"
                description="Our advanced AI translates your natural language into optimized database queries for various database types."
              />
              <FeatureCard
                icon={<Lock className="w-12 h-12 text-accent" />}
                title="Secure & Flexible"
                description="Works with your existing database securely. Supports multiple database types and connections."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How VoxDB Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="1"
                title="Ask Your Question"
                description="Type your data request in natural language, just as you would ask a colleague."
              />
              <StepCard
                number="2"
                title="AI Query Generation"
                description="Our AI interprets your request and generates the appropriate database query."
              />
              <StepCard
                number="3"
                title="Get Instant Results"
                description="VoxDB executes the query and returns the results, saving you time and effort."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Database Interactions?</h2>
            <p className="text-xl mb-8">
              Join thousands of users who have transformed their database queries into simple conversations.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90" onClick={handleCtaClick}>
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary/10 py-8">
        <div className="container mx-auto px-4 text-center text-primary">
          <p>&copy; 2025 VoxDB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-center mb-4">
        <span className="text-4xl font-bold text-accent">{number}</span>
      </div>
      <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}