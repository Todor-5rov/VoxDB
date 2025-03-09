"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/app/Firebase/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthLayout from "@/app/Pages/Components/AuthLayout"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { ArrowLeft } from 'lucide-react'
import { setupInitialUserData } from "@/app/lib/user"
import { getUserData } from "@/app/lib/user"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error) {
      setError("Failed to log in")
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if this is a new user
      if (result.additionalUserInfo?.isNewUser) {
        try {
          await setupInitialUserData(user.uid)
        } catch (error) {
          console.error("Error setting up initial user data:", error)
          setError("Failed to set up user data. Please try again.")
          return
        }
      } else {
        const userData = await getUserData(user.uid)
        if (!userData) {
          try {
            await setupInitialUserData(user.uid)
          } catch (error) {
            console.error("Error setting up initial user data:", error)
            setError("Failed to set up user data. Please try again.")
            return
          }
        }
      }

      router.push("/")
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled. Please try again.")
      } else {
        setError(error.message || "Failed to log in with Google")
      }
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetSent(true)
      setError("")
    } catch (error) {
      setError("Failed to send password reset email")
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <AuthLayout title="Login to VoxDB">
      <Link href="/" className="absolute top-6 left-6 text-white hover:underline flex items-center">
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {resetSent && (
        <p className="text-green-500 mb-4 text-center">Password reset email sent. Please check your inbox.</p>
      )}
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 text-white placeholder-white placeholder-opacity-70 transition duration-150"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white bg-opacity-20 border border-white border-opacity-30 focus:border-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-30 text-white placeholder-white placeholder-opacity-70 transition duration-150"
            placeholder="Password"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-white text-primary font-semibold rounded-full py-3 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-200"
        >
          Log In
        </Button>
      </form>
      <div className="mt-6 relative flex items-center justify-center">
        <div className="w-1/4 border-t border-white border-opacity-20"></div>
        <span className="mx-4 text-white text-opacity-80 text-sm">OR</span>
        <div className="w-1/4 border-t border-white border-opacity-20"></div>
      </div>
      <div className="mt-6">
        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white font-semibold rounded-full py-3 px-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z"
              fill="white"
            />
            <path
              d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
              fill="white"
            />
            <path
              d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z"
              fill="white"
            />
            <path
              d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
              fill="white"
            />
          </svg>
          Log In with Google
        </Button>
      </div>
      <div className="mt-4 text-center">
        <button onClick={handleForgotPassword} className="text-white hover:underline focus:outline-none">
          Forgot Password?
        </button>
      </div>
      <p className="mt-8 text-center text-white text-opacity-80">
        Don't have an account?{" "}
        <Link href="/register" className="text-white hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  )
}