"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, Mail, Lock, Truck, Package, Users, BarChart3 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, loading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push('/')
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffcc04] via-[#ffcc04] to-[#ffcc04] p-4 relative overflow-hidden">
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ backgroundColor: '#ECBE07FF'}}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ backgroundColor: '#FDCC0AFF4'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{backgroundColor: '#ffcc04'}}></div>
      </div> */}

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto animate-scale-in">
          <Card className="glass-dark border-0 shadow-modern-xl">
            <CardHeader className="space-y-1 text-center pb-8">
              <div className="mx-auto mb-4 h-16 w-16 rounded-2xl flex items-center justify-center shadow-modern-lg" style={{ background: 'linear-gradient(135deg, #ffcc04 0%, #FACD18FF 100%)'}}>
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-modern-lg" style={{ background: 'linear-gradient(135deg, #ffcc04 0%, #FACD18FF 100%)'}}>
                  <Truck className="h-8 w-8 text-black" />
                  <Image src='/images/fawri_logo_yellow.jpg' alt='Fawri Plus' width={64} height={64} className="rounded-lg" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-black-800">مرحباً بك</CardTitle>
              <CardDescription className="text-gray-800">
                سجل دخولك للوصول إلى لوحة التحكم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل البريد الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 pr-10 bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:ring-0.5 "
                      style={{ '--tw-ring-color': '#ffcc04', '--tw-ring-offset-color': '#ffcc04'} as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800">كلمة المرور</Label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 pr-10 bg-gray-50 border-gray-200 text-black placeholder-gray-400 focus:ring-0.5 "
                      style={{ '--tw-ring-color': '#ffcc04', '--tw-ring-offset-color': '#ffcc04' } as React.CSSProperties}                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-12 px-3 py-2 hover:bg-transparent text-gray-400 hover:text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-black font-semibold rounded-lg transition-all duration-200 shadow-modern hover:shadow-modern-lg"
                  style={{ background: 'linear-gradient(90deg, #ffcc04 0%, #FACD18FF 100%)'}}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري تسجيل الدخول...
                    </>
                  ) : (
                    "تسجيل الدخول"
                  )}
                </Button>

                {/* <div className="text-center">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    نسيت كلمة المرور؟
                  </a>
                </div> */}
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="hidden lg:block space-y-8 animate-slide-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-modern-lg">
                <Truck className="h-8 w-8 text-black" />
                <Image src='/images/fawri_logo_black.jpg' alt='Fawri Plus' width={64} height={64} className="rounded-lg"/>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">Fawri Plus</h1>
                <p className="text-black">نظام إدارة التوصيل المتطور</p>
              </div>
            </div>
            <p className="text-black text-lg leading-relaxed">
              حلول لوجستية متكاملة لإدارة الطلبات والتوصيل مع تقارير مفصلة وإحصائيات دقيقة
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 hover-lift">
              <Package className="h-8 w-8 text-black mb-2" />
              <h3 className="text-black font-semibold">إدارة الطلبات</h3>
              <p className="text-black text-sm">تتبع وإدارة جميع الطلبات</p>
            </div>
            <div className="glass rounded-xl p-4 hover-lift">
              <Users className="h-8 w-8 text-black mb-2" />
              <h3 className="text-black font-semibold">إدارة السائقين</h3>
              <p className="text-black text-sm">تعيين ومتابعة السائقين</p>
            </div>
            <div className="glass rounded-xl p-4 hover-lift">
              <BarChart3 className="h-8 w-8 text-black mb-2" />
              <h3 className="text-black font-semibold">التقارير</h3>
              <p className="text-black text-sm">إحصائيات وتقارير مفصلة</p>
            </div>
            <div className="glass rounded-xl p-4 hover-lift">
              <Truck className="h-8 w-8 text-black mb-2" />
              <h3 className="text-black font-semibold">التوصيل</h3>
              <p className="text-black text-sm">تتبع حالة التوصيل</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}