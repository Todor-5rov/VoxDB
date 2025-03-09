"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/app/Firebase/firebase"
import type { User } from "firebase/auth"
import { Button } from "@/shadcn/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/Pages/Components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar"
import { LogOut } from 'lucide-react'

interface ProfileMenuProps {
  buttonClasses?: string
}

export default function ProfileMenu({ buttonClasses = "" }: ProfileMenuProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Failed to sign out", error)
    }
  }

  if (!user) {
    return (
      <Button
        asChild
        variant="outline"
        className={cn(
          "border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200",
          buttonClasses,
        )}
      >
        <Link href="/login">Sign In</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user.photoURL || undefined} alt="Profile picture" />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}