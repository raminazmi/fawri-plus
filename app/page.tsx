"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/lib/useTranslation"
import Loading from "@/components/loading"
import { LoginForm } from "@/components/login-form"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Package, Truck, Users, CreditCard, AlertCircle, Settings, MapPin, Phone, Building2, TrendingUp, TrendingDown } from "lucide-react"
import { fetchOrders, fetchDrivers } from "@/lib/shipday-api-functions"
import hero2 from "../public/images/hero-image.svg"

function DashboardOverview() {
  const router = useRouter()
  const { t } = useTranslation()
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
    pending: t('orders.pending'),
    assigned: t('orders.assigned'),
    picked_up: t('orders.pickedUp'),
    in_transit: t('orders.inTransit'),
    delivered: t('orders.delivered'),
    cancelled: t('orders.cancelled'),
  }

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
        setError(null)
        const [ordersData, driversData] = await Promise.all([fetchOrders(), fetchDrivers()])

        const totalOrders = ordersData.length
        const activeDrivers = driversData.filter((d) => d.status === "available").length
        const revenue = ordersData.reduce((sum, order) => sum + (order.costing?.totalCost || 0), 0)

        setStats({
          totalOrders,
          activeDrivers,
          subscribers: 89,
          revenue,
        })

        setRecentOrders(ordersData.slice(0, 5))
        setDrivers(driversData.slice(0, 4))
      } catch (error: any) {
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
            <span>{t('dashboard.apiKeyRequired')}</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/settings")} className={`bg-[${colors.white}] text-[${colors.black}] hover:bg-[${colors.greyLight}] border-[${colors.greyLight}]`}>
              <Settings className="mr-2 h-4 w-4" />
              {t('dashboard.goToSettings')}
            </Button>
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">{t('dashboard.totalOrders')}</CardTitle>
              <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.requiresApiKey')}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">{t('dashboard.activeDrivers')}</CardTitle>
              <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.requiresApiKey')}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">{t('dashboard.subscribers')}</CardTitle>
              <Users className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.monthlyGrowth')}</p>
            </CardContent>
          </Card>

          <Card className={`shadow-xl`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium">{t('dashboard.revenue')}</CardTitle>
              <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.requiresApiKey')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Loading title={t('dashboard.loading')} />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.totalOrders')}</CardTitle>
            <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.fromShipday')}</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.activeDrivers')}</CardTitle>
            <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDrivers}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.fromShipday')}</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.subscribers')}</CardTitle>
            <Users className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscribers}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.monthlyGrowth')}</p>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.revenue')}</CardTitle>
            <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} {t('dashboard.currency')}</div>
            <p className={`text-xs text-[${colors.greyDark}]/70`}>{t('dashboard.fromShipday')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`shadow-xl`}>
          <CardHeader>
            <CardTitle>{t('dashboard.recentOrders')}</CardTitle>
            <CardDescription className={`text-[${colors.greyDark}]`}>{t('dashboard.fromShipday')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.orderNumber} className={`flex items-center justify-between p-3 bg-[${colors.white}] rounded-lg border border-[${colors.greyLight}]`}>
                  <div>
                    <p className="font-medium">{t('orders.order')} #{order.orderNumber}</p>
                    <p className={`text-sm text-[${colors.greyDark}]/70`}>{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.costing?.totalCost} {t('dashboard.currency')}</p>
                    <p className={`text-sm text-[${colors.greyDark}]/70`}>{statusLabels[order.status] || order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-xl`}>
          <CardHeader>
            <CardTitle>{t('dashboard.driverStatus')}</CardTitle>
            <CardDescription className={`text-[${colors.greyDark}]`}>{t('dashboard.fromShipday')}</CardDescription>
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
                      {driver.status === "available" ? t('drivers.available') : t('drivers.unavailable')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.orderManagement')}</CardTitle>
            <Package className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>{t('dashboard.orderManagementDesc')}</p>
          </CardContent>
        </Card>
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.driverAssignment')}</CardTitle>
            <Truck className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>{t('dashboard.driverAssignmentDesc')}</p>
          </CardContent>
        </Card>
        <Card className={`shadow-xl`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium">{t('dashboard.reportsBilling')}</CardTitle>
            <CreditCard className={`h-4 w-4 text-[${colors.greyDark}]`} />
          </CardHeader>
          <CardContent>
            <p className={`text-sm text-[${colors.greyDark}]/70`}>{t('dashboard.reportsBillingDesc')}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const colors = {
    yellow: "#ffcc04",
    black: "#272626",
    white: "#ececec",
    greyLight: "#d2d2d2",
    greyDark: "#444647",
    blueLight: "#59c5c7",
    blueDark: "#574b9f",
  }

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="dashboard">
        <DashboardOverview />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
