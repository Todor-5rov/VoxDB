"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/app/Firebase/firebase"
import AppHeader from "@/app/Pages/Components/AppHeader"
import { StudioNavigation } from "@/app/Pages/Components/StudioNavigation"
import { cn } from "@/lib/utils"

interface StudioLayoutProps {
  children: React.ReactNode
}

export function StudioLayout({ children }: StudioLayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedNavState = localStorage.getItem("studioNavCollapsed")
    setIsNavCollapsed(storedNavState === null ? true : storedNavState === "true")

    const checkAuth = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push("/login")
        return
      }
    }

    checkAuth()
  }, [router])

  const handleNavToggle = (collapsed: boolean) => {
    setIsNavCollapsed(collapsed)
    localStorage.setItem("studioNavCollapsed", collapsed.toString())
  }

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-grow flex overflow-hidden">
        <StudioNavigation
          isCollapsed={isNavCollapsed}
          onToggle={handleNavToggle}
          setIsNavCollapsed={setIsNavCollapsed}
        />
        <main
          className={cn(
            "flex-grow overflow-auto transition-all duration-300 ease-in-out",
            isNavCollapsed ? "sm:ml-16" : "sm:ml-64",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

