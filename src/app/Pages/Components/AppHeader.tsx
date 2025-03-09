"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import ProfileMenu from "@/app/Pages/Components/ProfileMenu"
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: "Home", href: "/" },
  { name: "Studio", href: "/studio" },
  { name: "API", href: "/api" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function AppHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false)
  }, [])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto w-full">
        <div className="flex h-16 items-center justify-between w-full px-4">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="sr-only">VoxDB</span>
              <span className="text-2xl font-extrabold text-primary">VoxDB</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-gray-700 hover:text-primary transition-colors duration-200",
                    pathname === item.href && "font-semibold text-primary",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <ProfileMenu buttonClasses="bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50" />
            </div>
            <button
              className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              className="p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-gray-700 hover:text-primary transition-colors duration-200 py-2",
                  pathname === item.href && "font-semibold text-primary",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4">
            <ProfileMenu buttonClasses="w-full bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </header>
  )
}