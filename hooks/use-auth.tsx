"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type AuthState, authenticate } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("auth_user")
        const storedToken = localStorage.getItem("auth_token")
        
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser)
          setAuthState({ 
            user, 
            isAuthenticated: true 
          })
        } else {
          setAuthState({ 
            user: null, 
            isAuthenticated: false 
          })
        }
      } catch (error) {
        localStorage.removeItem("auth_user")
        localStorage.removeItem("auth_token")
        setAuthState({ 
          user: null, 
          isAuthenticated: false 
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_user' || e.key === 'auth_token') {
        checkAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      const authResult = await authenticate(email, password)
      if (authResult) {
        localStorage.setItem("auth_user", JSON.stringify(authResult.user))
        localStorage.setItem("auth_token", authResult.token)
                setAuthState({ user: authResult.user, isAuthenticated: true })
        
        setLoading(false)
        return true
      }
      setLoading(false)
      return false
    } catch (error) {
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    } catch (error) {
    } finally {
      setAuthState({ user: null, isAuthenticated: false })
    }
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
