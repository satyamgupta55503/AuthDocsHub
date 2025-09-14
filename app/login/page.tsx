"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Loader2, Smartphone, Shield } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"mobile" | "otp">("mobile")
  const [mobile, setMobile] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { generateOTP, login } = useAuth()
  const router = useRouter()

  const handleGenerateOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobile.trim()) {
      setError("Please enter your mobile number")
      return
    }

    setLoading(true)
    setError("")

    const result = await generateOTP(mobile)

    if (result.success) {
      setSuccess("OTP sent successfully to your mobile number")
      setStep("otp")
    } else {
      setError(result.error || "Failed to generate OTP")
    }

    setLoading(false)
  }

  const handleValidateOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      setError("Please enter the OTP")
      return
    }

    setLoading(true)
    setError("")

    const result = await login(mobile, otp)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Invalid OTP")
    }

    setLoading(false)
  }

  const handleBackToMobile = () => {
    setStep("mobile")
    setOtp("")
    setError("")
    setSuccess("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Document Manager</h1>
          <p className="text-muted-foreground mt-2">Secure document management system</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === "mobile" ? (
                <>
                  <Smartphone className="h-5 w-5" />
                  Enter Mobile Number
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Verify OTP
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === "mobile" ? "We'll send you a verification code" : `Enter the OTP sent to ${mobile}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}

            {step === "mobile" ? (
              <form onSubmit={handleGenerateOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    disabled={loading}
                    className="text-center"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleValidateOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleBackToMobile}
                    disabled={loading}
                  >
                    Change Mobile Number
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure OTP-based authentication</p>
        </div>
      </div>
    </div>
  )
}
