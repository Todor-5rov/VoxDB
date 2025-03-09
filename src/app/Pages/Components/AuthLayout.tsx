import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white bg-opacity-10 rounded-3xl shadow-2xl p-8 pt-20 border border-white border-opacity-20 relative">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )
}