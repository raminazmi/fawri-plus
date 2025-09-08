"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowRight, Truck } from "lucide-react"
import Image from "next/image"
import logoImg from "../public/images/logo.svg"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "حدث خطأ في إرسال طلب إعادة تعيين كلمة المرور")
      }
    } catch (error) {
      setError("حدث خطأ في الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <Card className="glass-dark border-0 shadow-modern-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-modern-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">تم الإرسال!</CardTitle>
              <CardDescription className="text-gray-400">
                تحقق من بريدك الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <Alert className="border-green-500/50 bg-green-500/10">
                <AlertDescription className="text-green-200">
                  إذا كان البريد الإلكتروني <strong>{email}</strong> موجوداً في نظامنا، 
                  ستتلقى رابط إعادة تعيين كلمة المرور خلال دقائق قليلة.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.href = "/login"}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-modern hover:shadow-modern-lg"
                >
                  العودة لتسجيل الدخول
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSuccess(false)
                    setEmail("")
                  }}
                  className="w-full h-12 border-gray-600 text-gray-300 hover:bg-gray-800/50"
                >
                  إرسال طلب آخر
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slide-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-modern-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Fawri Plus</h1>
                <p className="text-purple-200">استعادة كلمة المرور</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              لا تقلق، يمكننا مساعدتك في استعادة كلمة المرور الخاصة بك
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="glass rounded-xl p-4 hover-lift">
              <Mail className="h-8 w-8 text-blue-400 mb-2" />
              <h3 className="text-white font-semibold">إرسال آمن</h3>
              <p className="text-gray-400 text-sm">رابط آمن لإعادة تعيين كلمة المرور</p>
            </div>
            <div className="glass rounded-xl p-4 hover-lift">
              <ArrowRight className="h-8 w-8 text-green-400 mb-2" />
              <h3 className="text-white font-semibold">سهل وسريع</h3>
              <p className="text-gray-400 text-sm">عملية بسيطة لاستعادة الوصول</p>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full max-w-md mx-auto animate-scale-in">
          <Card className="glass-dark border-0 shadow-modern-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-modern-lg">
                <Image
                  src={logoImg} 
                  alt="Company Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white">نسيت كلمة المرور؟</CardTitle>
              <CardDescription className="text-gray-400">
                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-modern hover:shadow-modern-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال رابط الإعادة"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  تذكرت كلمة المرور؟{" "}
                  <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                    سجل دخولك
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
