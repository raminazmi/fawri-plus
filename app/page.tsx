"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import Loading from "@/components/loading"

// Components
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Icons
import { Package, Truck, Users, CreditCard, AlertCircle, Settings, MapPin, Phone, Building2, TrendingUp, TrendingDown } from "lucide-react"

// API Functions
import { fetchOrders, fetchDrivers } from "@/lib/shipday-api-functions"

// Image
import hero2 from "../public/images/hero-image.svg"

function DashboardOverview() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeDrivers: 0,
    subscribers: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const statusLabels: { [key: string]: string } = {
    pending: "قيد الانتظار",
    assigned: "تم التعيين",
    picked_up: "تم الاستلام",
    in_transit: "في الطريق",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  }

  // Define the new color palette
  const colors = {
    yellow: "#ffcc04",
    black: "#272626",
    white: "#ececec",
    greyLight: "#d2d2d2",
    greyDark: "#444647",
    blueLight: "#59c5c7",
    blueDark: "#574b9f",
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        console.log("[v0] Loading dashboard data from Shipday API")
        setError(null)
        const [ordersData, driversData] = await Promise.all([fetchOrders(), fetchDrivers()])

        const totalOrders = ordersData.length
        const activeDrivers = driversData.filter((d) => d.status === "available").length
        const revenue = ordersData.reduce((sum, order) => sum + (order.costing?.totalCost || 0), 0)

        setStats({
          totalOrders,
          activeDrivers,
          subscribers: 89, // This would come from subscription system
          revenue,
        })

        setRecentOrders(ordersData.slice(0, 5))
        setDrivers(driversData.slice(0, 4))

        console.log("[v0] Dashboard data loaded successfully")
      } catch (error: any) {
        console.error("[v0] Error loading dashboard data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (error && error.includes("API key not configured")) {
    return (
      <div className="space-y-6">
        <Alert className={`bg-[${colors.blueLight}]/10 text-[${colors.greyDark}] border-[${colors.blueLight}]`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>يجب تكوين مفتاح Shipday API أولاً لعرض البيانات الحقيقية</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/settings")} className={`bg-[${colors.white}] text-[${colors.black}] hover:bg-[${colors.greyLight}] border-[${colors.greyLight}]`}>
              <Settings className="mr-2 h-4 w-4" />
              الذهاب للإعدادات
            </Button>
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">إجمالي الطلبات</CardTitle>
              <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>يتطلب API key</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">السائقين النشطين</CardTitle>
              <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>يتطلب API key</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">العملاء المشتركين</CardTitle>
              <Users className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>+12% هذا الشهر</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">الإيرادات</CardTitle>
              <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>يتطلب API key</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Loading title="جاري تحميل لوحة التحكم ..." />
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">إجمالي الطلبات</CardTitle>
            <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>من Shipday</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">السائقين النشطين</CardTitle>
            <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDrivers}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>من Shipday</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">العملاء المشتركين</CardTitle>
            <Users className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribers}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>+12% هذا الشهر</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">الإيرادات</CardTitle>
            <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} د.ب</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>من Shipday</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Driver Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`shadow-xl`}>
          <CardHeader>
            <CardTitle>الطلبات الحديثة</CardTitle>
            <CardDescription className={`text-[${colors.greyDark}]`}>من Shipday</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.orderNumber} className={`flex items-center justify-between p-3 bg-[${colors.white}] rounded-lg border border-[${colors.greyLight}]`}>
                  <div>
                    <p className="font-medium">طلب #{order.orderNumber}</p>
                    <p className={`text-sm text-[${colors.greyDark}]/70`}>{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.costing?.totalCost} د.ب</p>
                    <p className={`text-sm text-[${colors.greyDark}]/70`}>{statusLabels[order.status] || order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader>
            <CardTitle>حالة السائقين</CardTitle>
            <CardDescription className={`text-[${colors.greyDark}]`}>من Shipday</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver) => (
                <div key={driver.id} className={`flex items-center justify-between p-3 bg-[${colors.white}] rounded-lg border border-[${colors.greyLight}]`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-[${colors.blueDark}]`}>
                      <span className={`text-[${colors.white}] font-medium`}>{driver.name.charAt(0)}</span>
                    </div>
                    <p className="font-medium">{driver.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${driver.status === "available" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className={`text-sm text-[${colors.greyDark}]/70`}>
                      {driver.status === "available" ? "متاح" : "غير متاح"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services / Features */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">إدارة الطلبات</CardTitle>
            <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>منشأة متكاملة لإدارة الطلبات وتتبعها وتحديث حالتها لحظياً.</p>
          </CardContent>
        </Card>
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">السائقون والتعيين</CardTitle>
            <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>تعيين السائقين وتتبع توفرهم وربطهم بالطلبات بسهولة.</p>
          </CardContent>
        </Card>
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">التقارير والفوترة</CardTitle>
            <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>لوحات وتقارير مالية ونشاطية لدعم القرارات.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  
  // Define the new color palette outside of the component to be available
  const colors = {
    yellow: "#ffcc04",
    black: "#272626",
    white: "#ececec",
    greyLight: "#d2d2d2",
    greyDark: "#444647",
    blueLight: "#59c5c7",
    blueDark: "#574b9f",
  }

  if (loading) {
    return (
      <Loading title="جاري التحميل ..." />
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <DashboardLayout currentPage="dashboard">
      <DashboardOverview />
    </DashboardLayout>
  )
}
