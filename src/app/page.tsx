"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

// Components
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Icons
import { 
  Package, 
  Truck, 
  Users, 
  CreditCard, 
  AlertCircle, 
  Settings, 
  MapPin, 
  Phone, 
  Building2, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  DollarSign,
  Calendar,
  Eye,
  Plus
} from "lucide-react"

// API Functions
import { fetchOrders, fetchDrivers } from "@/lib/shipday-api"

// Image
import hero2 from "../public/images/hero-image.svg"

function DashboardOverview() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeDrivers: 0,
    subscribers: 0,
    revenue: 0,
    todayOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
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

  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    picked_up: "bg-purple-100 text-purple-800",
    in_transit: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        console.log("[Dashboard] Loading dashboard data from Shipday API")
        setError(null)
        const [ordersData, driversData] = await Promise.all([fetchOrders(), fetchDrivers()])

        const totalOrders = ordersData.length
        const activeDrivers = driversData.filter((d) => d.status === "available").length
        const revenue = ordersData.reduce((sum, order) => sum + (order.costing?.totalCost || 0), 0)
        const todayOrders = ordersData.filter(order => {
          const orderDate = new Date(order.createdAt)
          const today = new Date()
          return orderDate.toDateString() === today.toDateString()
        }).length
        const completedOrders = ordersData.filter(order => order.status === "delivered").length
        const pendingOrders = ordersData.filter(order => ["pending", "assigned"].includes(order.status)).length

        setStats({
          totalOrders,
          activeDrivers,
          subscribers: 89,
          revenue,
          todayOrders,
          completedOrders,
          pendingOrders,
        })

        setRecentOrders(ordersData.slice(0, 5))
        setDrivers(driversData.slice(0, 4))

        console.log("[Dashboard] Dashboard data loaded successfully")
      } catch (error: any) {
        console.error("[Dashboard] Error loading dashboard data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (error && error.includes("API key not configured")) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>يجب تكوين مفتاح Shipday API أولاً لعرض البيانات الحقيقية</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/settings")} className="bg-white text-blue-600 hover:bg-blue-50 border-blue-200">
              <Settings className="mr-2 h-4 w-4" />
              الذهاب للإعدادات
            </Button>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "إجمالي الطلبات", value: "--", icon: Package, color: "blue" },
            { title: "السائقين النشطين", value: "--", icon: Truck, color: "green" },
            { title: "العملاء المشتركين", value: "89", icon: Users, color: "purple" },
            { title: "الإيرادات", value: "--", icon: CreditCard, color: "orange" },
          ].map((stat, index) => (
            <Card key={index} className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">يتطلب API key</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] rounded-2xl p-6 text-white shadow-modern-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">مرحباً بك في Fawri Plus</h1>
            <p className="text-blue-100">نظام إدارة التوصيل المتطور - إدارة شاملة لجميع عمليات التوصيل</p>
          </div>
          <div className="hidden md:block">
            <Image src={hero2} alt="Hero" width={120} height={120} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "إجمالي الطلبات", value: stats.totalOrders, icon: Package, color: "blue", change: "+12%" },
          { title: "السائقين النشطين", value: stats.activeDrivers, icon: Truck, color: "green", change: "+5%" },
          { title: "العملاء المشتركين", value: stats.subscribers, icon: Users, color: "purple", change: "+8%" },
          { title: "الإيرادات", value: `${stats.revenue.toLocaleString()} د.ب`, icon: CreditCard, color: "orange", change: "+15%" },
        ].map((stat, index) => (
          <Card key={index} className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} من الشهر الماضي
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "طلبات اليوم", value: stats.todayOrders, icon: Calendar, color: "blue" },
          { title: "طلبات مكتملة", value: stats.completedOrders, icon: CheckCircle, color: "green" },
          { title: "طلبات معلقة", value: stats.pendingOrders, icon: Clock, color: "yellow" },
        ].map((stat, index) => (
          <Card key={index} className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders & Driver Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">الطلبات الحديثة</CardTitle>
              <CardDescription>آخر 5 طلبات تم إنشاؤها</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/orders")}>
              <Eye className="h-4 w-4 mr-2" />
              عرض الكل
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.orderNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">طلب #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.costing?.totalCost} د.ب</p>
                    <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">حالة السائقين</CardTitle>
              <CardDescription>السائقين المتاحين حالياً</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/drivers")}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة سائق
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{driver.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-500">سائق توصيل</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className={`h-2 w-2 rounded-full ${driver.status === "available" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-sm text-gray-600">
                      {driver.status === "available" ? "متاح" : "غير متاح"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">إجراءات سريعة</CardTitle>
          <CardDescription>الوصول السريع للميزات الأساسية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { title: "إضافة طلب جديد", icon: Plus, href: "/orders", color: "blue" },
              { title: "إدارة السائقين", icon: Truck, href: "/drivers", color: "green" },
              { title: "عرض التقارير", icon: Activity, href: "/reports", color: "purple" },
              { title: "إعدادات النظام", icon: Settings, href: "/settings", color: "gray" },
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col space-y-2 hover:bg-gray-50"
                onClick={() => router.push(action.href)}
              >
                <action.icon className={`h-6 w-6 text-${action.color}-500`} />
                <span className="text-sm font-medium">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">تواصل معنا</CardTitle>
            <CardDescription>نخدمكم في مملكة البحرين</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <Phone className="h-5 w-5 text-blue-500" />
              <a href="tel:33831996" className="text-gray-700 hover:text-blue-600">‏‪3383 1996‬‏</a>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Building2 className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">Office 305, Building 1691Y, Road 432, Block 704</span>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <MapPin className="h-5 w-5 text-blue-500" />
              <Link href="https://maps.app.goo.gl/9xhPbvW2N39cKpcY6" target="_blank" className="text-gray-700 hover:text-blue-600">
                5GHH+MRR Salmabad, Bahrain
              </Link>
            </div>
            <div className="pt-2">
              <Badge className="bg-blue-100 text-blue-800">
                Registered in Kingdom of Bahrain • CR 184417-1
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
          <div className="relative h-56">
            <Image src={hero2} alt="Blue Alfa - Fawri Plus Delivery" fill className="object-cover" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
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
