"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ShipdayDriver } from "@/lib/types"
import { fetchDrivers, addDriver } from "@/lib/shipday-api-functions"
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  Car,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
} from "lucide-react"
import Loading from "@/components/loading"
import { useTranslation } from "@/lib/useTranslation"

const getStatusLabels = (t: (key: string) => string) => ({
  available: t('drivers.available'),
  busy: t('drivers.busy'),
  offline: t('drivers.offline'),
}) as const

const statusColors = {
  available: "default",
  busy: "secondary", 
  offline: "destructive",
} as const

const statusIcons = {
  available: CheckCircle,
  busy: Clock,
  offline: XCircle,
} as const

export function DriversListPage() {
  const { t } = useTranslation()
  const statusLabels = getStatusLabels(t)
  const [drivers, setDrivers] = useState<ShipdayDriver[]>([])
  const [filteredDrivers, setFilteredDrivers] = useState<ShipdayDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addingDriver, setAddingDriver] = useState(false)
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })

  const loadDrivers = async () => {
    try {
      setLoading(true)
      const driversData = await fetchDrivers()
      setDrivers(driversData)
      setMessage({ type: "success", text: `تم تحميل ${driversData.length} سائق بنجاح` })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحميل بيانات السائقين" })
    } finally {
      setLoading(false)
    }
  }

  const refreshDrivers = async () => {
    try {
      setRefreshing(true)
      const driversData = await fetchDrivers()
      setDrivers(driversData)
      setMessage({ type: "success", text: "تم تحديث بيانات السائقين" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث بيانات السائقين" })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.email) {
      setMessage({ type: "error", text: "يرجى ملء جميع الحقول المطلوبة" })
      return
    }

    try {
      setAddingDriver(true)
      await addDriver(newDriver)
      setMessage({ type: "success", text: `تم إضافة السائق ${newDriver.name} بنجاح` })
      setNewDriver({ name: "", phone: "", email: "", password: "" })
      setShowAddDialog(false)
      await loadDrivers()
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة السائق" })
    } finally {
      setAddingDriver(false)
    }
  }

  const filterDrivers = useCallback(() => {
    let filtered = drivers
    if (searchTerm) {
      filtered = filtered.filter(
        (driver) =>
          driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (driver.phone && driver.phone.includes(searchTerm)) ||
          (driver.email && driver.email.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => driver.status === statusFilter)
    }

    setFilteredDrivers(filtered)
  }, [drivers, searchTerm, statusFilter])

  useEffect(() => {
    loadDrivers()
  }, [])

  useEffect(() => {
    filterDrivers()
  }, [filterDrivers])

  if (loading) {
    return <Loading title="جاري تحميل بيانات السائقين..." />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {message && (
        <Alert className={`${message.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"} shadow-modern`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] rounded-2xl p-6 text-[#272626] shadow-modern-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('drivers.title')}</h1>
            <p>{t('drivers.managementDesc')}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={refreshDrivers}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? t('common.refreshing') : t('common.refresh')}
            </Button>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t('drivers.newDriver')}
            </Button>
          </div>
        </div>
      </div>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
{t('common.search')} & {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">البحث</label>
              <Input
                placeholder="البحث بالاسم أو الهاتف أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full !h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="available">متاح</SelectItem>
                  <SelectItem value="busy">مشغول</SelectItem>
                  <SelectItem value="offline">غير متصل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">إجمالي السائقين</label>
              <div className="flex items-center h-11 px-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <Truck className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">{filteredDrivers.length} سائق</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrivers.map((driver) => {
          const StatusIcon = statusIcons[driver.status] || AlertCircle
          return (
            <Card key={driver.id} className="hover-lift shadow-modern border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      {driver.name}
                    </CardTitle>
                    <CardDescription>السائق #{driver.id}</CardDescription>
                  </div>
                  <Badge variant={statusColors[driver.status] || "secondary"} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusLabels[driver.status] || driver.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {driver.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{driver.phone}</span>
                    </div>
                  )}
                  
                  {driver.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{driver.email}</span>
                    </div>
                  )}

                  {driver.vehicle && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{driver.vehicle.type}</span>
                      </div>
                      {driver.vehicle.plate && (
                        <div className="text-sm text-gray-600 mr-6">
                          لوحة: {driver.vehicle.plate}
                        </div>
                      )}
                    </div>
                  )}

                  {driver.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        {driver.location.lat.toFixed(4)}, {driver.location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDrivers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "لم يتم العثور على سائقين يطابقون معايير البحث" 
                : "لا يوجد سائقين مسجلين في النظام"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
                className="mt-4"
              >
                مسح الفلاتر
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة سائق جديد</DialogTitle>
            <DialogDescription>
              إضافة سائق جديد إلى نظام Shipday
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم السائق</Label>
              <Input
                id="name"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                placeholder="أدخل اسم السائق"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={newDriver.phone}
                onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={newDriver.email}
                onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                placeholder="أدخل البريد الإلكتروني"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور المؤقتة</Label>
              <Input
                id="password"
                type="password"
                value={newDriver.password}
                onChange={(e) => setNewDriver({ ...newDriver, password: e.target.value })}
                placeholder="أدخل كلمة المرور المؤقتة"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddDriver} disabled={addingDriver}>
              {addingDriver ? "جاري الإضافة..." : "إضافة السائق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
