"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "@/components/loading"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Clear any existing auth data and redirect to login
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <Loading title="جاري التحقق من المصادقة..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
