"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashPaymentForm } from "@/components/cash-payment-form"
import {
  getDrivers,
  getCashOrders,
  getCashPayments,
  getDriverCashSummary,
  addCashPayment,
  updateCashOrderStatus,
  type Driver,
  type CashOrder,
  type CashPayment,
  type DriverCashSummary,
} from "@/lib/driver-cash"
import {
  Plus,
  DollarSign,
  Truck,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Loading from "@/components/loading"

const paymentMethodLabels = {
  cash: "نقداً",
  bank_transfer: "تحويل بنكي",
  check: "شيك",
  other: "أخرى",
}

const statusLabels = {
  pending: "في الانتظار",
  collected: "تم التحصيل",
  paid: "تم الدفع",
}

const statusColors = {
  pending: "secondary",
  collected: "default",
  paid: "default",
} as const

export function DriverCashPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [cashOrders, setCashOrders] = useState<CashOrder[]>([])
  const [cashPayments, setCashPayments] = useState<CashPayment[]>([])
  const [driverSummary, setDriverSummary] = useState<DriverCashSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<string>("all")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0],
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [driversData, ordersData, paymentsData, summaryData] = await Promise.all([
        getDrivers(),
        getCashOrders({
          driverId: selectedDriver === "all" ? undefined : selectedDriver,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getCashPayments({
          driverId: selectedDriver === "all" ? undefined : selectedDriver,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getDriverCashSummary({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
      ])

      setDrivers(driversData)
      setCashOrders(ordersData)
      setCashPayments(paymentsData)
      setDriverSummary(summaryData)
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحميل البيانات" })
    } finally {
      setLoading(false)
    }
  }, [selectedDriver, dateRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddPayment = async (paymentData: Parameters<typeof addCashPayment>[0]) => {
    try {
      await addCashPayment(paymentData)
      setShowPaymentForm(false)
      await loadData()
      setMessage({ type: "success", text: "تم إضافة الدفعة بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة الدفعة" })
    }
  }

  const handleStatusChange = async (orderId: string, status: CashOrder["status"]) => {
    try {
      await updateCashOrderStatus(orderId, status)
      await loadData()
      setMessage({ type: "success", text: "تم تحديث حالة الطلب" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث حالة الطلب" })
    }
  }

  if (loading) {
    return (
      <Loading title="جاري تحميل متابعة السائقين ..." />
    )
  }

  if (showPaymentForm) {
    return <CashPaymentForm drivers={drivers} onSubmit={handleAddPayment} onCancel={() => setShowPaymentForm(false)} />
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
            <h1 className="text-2xl font-bold mb-2">إدارة السائقين</h1>
            <p>تتبع المبالغ النقدية المحصلة والمدفوعة من السائقين</p>
          </div>
          <Button 
            onClick={() => setShowPaymentForm(true)}
            className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة دفعة
          </Button>
        </div>
      </div>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            التصفية والفترة الزمنية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm  text-gray-700">السائق</label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger className="w-full !h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع السائقين</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm  text-gray-700">من تاريخ</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm  text-gray-700">إلى تاريخ</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                className="h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm  text-gray-700">إجمالي السائقين</label>
              <div className="flex items-center h-11 px-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                <Truck className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm  text-blue-700">{driverSummary.length} سائق</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm shadow-modern">
          <TabsTrigger value="summary" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            ملخص السائقين
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            الطلبات النقدية
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            الدفعات المستلمة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {driverSummary.map((summary) => (
              <Card key={summary.driverId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        {summary.driverName}
                      </CardTitle>
                      <CardDescription>{summary.totalCashOrders} طلب نقدي</CardDescription>
                    </div>
                    <div className="text-right">
                      {summary.remainingBalance > 0 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          مدين
                        </Badge>
                      ) : summary.remainingBalance < 0 ? (
                        <Badge variant="default" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          دائن
                        </Badge>
                      ) : (
                        <Badge variant="secondary">متوازن</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">إجمالي المحصل:</span>
                      <span className="">{summary.totalCashAmount.toFixed(2)} د.ب</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">المدفوع:</span>
                      <span className=" text-green-600">{summary.totalPaid.toFixed(2)} د.ب</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm ">الرصيد:</span>
                      <span
                        className={`font-bold ${
                          summary.remainingBalance > 0
                            ? "text-red-600"
                            : summary.remainingBalance < 0
                              ? "text-green-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {Math.abs(summary.remainingBalance).toFixed(2)} د.ب
                      </span>
                    </div>
                    {summary.pendingOrders > 0 && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <Clock className="h-4 w-4" />
                        {summary.pendingOrders} طلب في الانتظار
                      </div>
                    )}
                    {summary.lastPaymentDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        آخر دفعة: {summary.lastPaymentDate}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4">
            {cashOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        طلب #{order.orderNumber}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {order.driverName}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusColors[order.status]}>
                        {order.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                        {order.status === "collected" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {statusLabels[order.status]}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(value: CashOrder["status"]) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">في الانتظار</SelectItem>
                          <SelectItem value="collected">تم التحصيل</SelectItem>
                          <SelectItem value="paid">تم الدفع</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <h4 className="">تفاصيل الطلب</h4>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="">العميل:</span> {order.customerName}
                        </p>
                        <p>
                          <span className="">المبلغ:</span> {order.cashAmount.toFixed(2)} د.ب
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="">تاريخ التوصيل</h4>
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {order.deliveryDate}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="">السائق</h4>
                      <div className="text-sm">
                        <p className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {order.driverName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {cashOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg  mb-2">لا توجد طلبات نقدية</h3>
                <p className="text-muted-foreground">لم يتم العثور على طلبات نقدية في الفترة المحددة</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {cashPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        دفعة من {payment.driverName}
                      </CardTitle>
                      <CardDescription>{payment.paymentDate}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{payment.amount.toFixed(2)} د.ب</div>
                      <Badge variant="outline">{paymentMethodLabels[payment.paymentMethod]}</Badge>
                    </div>
                  </div>
                </CardHeader>
                {payment.notes && (
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="">ملاحظات</h4>
                      <p className="text-sm text-muted-foreground">{payment.notes}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {cashPayments.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg  mb-2">لا توجد دفعات</h3>
                <p className="text-muted-foreground mb-4">لم يتم العثور على دفعات في الفترة المحددة</p>
                <Button onClick={() => setShowPaymentForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة دفعة جديدة
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
