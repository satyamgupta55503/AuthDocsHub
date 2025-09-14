"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  userId: string | null
  login: (mobile: string, otp: string) => Promise<{ success: boolean; error?: string }>
  generateOTP: (mobile: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("auth_token")
    const storedUserId = localStorage.getItem("user_id")

    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(storedUserId)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const generateOTP = async (mobile: string) => {
    try {
      const response = await apiClient.generateOTP({ mobile_number: mobile })
      return { success: response.success, error: response.error }
    } catch (error) {
      return { success: false, error: "Failed to generate OTP" }
    }
  }

  const login = async (mobile: string, otp: string) => {
    try {
      const response = await apiClient.validateOTP({ mobile_number: mobile, otp })

      if (response.success && response.data) {
        const { token: authToken, user_id } = response.data

        localStorage.setItem("auth_token", authToken)
        localStorage.setItem("user_id", user_id)

        setToken(authToken)
        setUserId(user_id)
        setIsAuthenticated(true)

        return { success: true }
      }

      return { success: false, error: response.error || "Invalid OTP" }
    } catch (error) {
      return { success: false, error: "Login failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_id")
    setToken(null)
    setUserId(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        userId,
        login,
        generateOTP,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
