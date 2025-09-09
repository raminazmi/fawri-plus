"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "@/lib/useTranslation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getBillingTransactions,
  getPayments,
  getInvoices,
  getBillingSummaries,
  addBillingTransaction,
  addPayment,
  generateInvoice,
  updateInvoiceStatus,
  type BillingTransaction,
  type Payment,
  type Invoice,
  type BillingSummary,
  type TransactionType,
  type PaymentMethod,
} from "@/lib/billing"
import { getCustomers, type Customer } from "@/lib/subscriptions"
import { Plus, DollarSign, FileText, AlertCircle, TrendingUp, TrendingDown, CreditCard, Receipt, ArrowRight } from "lucide-react"
import Loading from "@/components/loading"

const getTransactionTypeLabels = (t: (key: string) => string) => ({
  subscription: t('billing.subscription'),
  order_fee: t('billing.orderFee'),
  additional_service: t('billing.additionalService'),
  cash_deduction: t('billing.cashDeduction'),
  payment: t('billing.payment'),
})

const getPaymentMethodLabels = (t: (key: string) => string) => ({
  cash: t('billing.cash'),
  bank_transfer: t('billing.bankTransfer'),
  check: t('billing.check'),
  credit_card: t('billing.creditCard'),
  other: t('billing.other'),
})

const getInvoiceStatusLabels = (t: (key: string) => string) => ({
  draft: t('billing.draft'),
  sent: t('billing.sent'),
  paid: t('billing.paid'),
  overdue: t('billing.overdue'),
  cancelled: t('billing.cancelled'),
})

const invoiceStatusColors = {
  draft: "secondary",
  sent: "default",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
} as const

export function BillingPage() {
  const { t } = useTranslation()
  const invoiceStatusLabels = getInvoiceStatusLabels(t)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [transactions, setTransactions] = useState<BillingTransaction[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summaries, setSummaries] = useState<BillingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)

  const [transactionForm, setTransactionForm] = useState({
    customerId: "",
    type: "order_fee" as TransactionType,
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [paymentForm, setPaymentForm] = useState({
    customerId: "",
    amount: 0,
    paymentMethod: "cash" as PaymentMethod,
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const [invoiceForm, setInvoiceForm] = useState({
    customerId: "",
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    periodEnd: new Date().toISOString().split("T")[0],
  })

  const loadData = useCallback(async () => {
    try {
      const [customersData, transactionsData, paymentsData, invoicesData, summariesData] = await Promise.all([
        getCustomers(),
        getBillingTransactions({
          customerId: selectedCustomer === "all" ? undefined : selectedCustomer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getPayments({
          customerId: selectedCustomer === "all" ? undefined : selectedCustomer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getInvoices({
          customerId: selectedCustomer === "all" ? undefined : selectedCustomer,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        }),
        getBillingSummaries(),
      ])

      setCustomers(customersData)
      setTransactions(transactionsData)
      setPayments(paymentsData)
      setInvoices(invoicesData)
      setSummaries(summariesData)
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحميل البيانات" })
    } finally {
      setLoading(false)
    }
  }, [selectedCustomer, dateRange])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const customer = customers.find((c) => c.id === transactionForm.customerId)
      if (!customer) return

      await addBillingTransaction({
        customerId: transactionForm.customerId,
        customerName: customer.name,
        type: transactionForm.type,
        amount: transactionForm.type === "cash_deduction" ? -Math.abs(transactionForm.amount) : transactionForm.amount,
        description: transactionForm.description,
        date: transactionForm.date,
      })

      setShowTransactionForm(false)
      setTransactionForm({
        customerId: "",
        type: "order_fee",
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
      await loadData()
      setMessage({ type: "success", text: "تم إضافة المعاملة بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة المعاملة" })
    }
  }

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const customer = customers.find((c) => c.id === paymentForm.customerId)
      if (!customer) return

      await addPayment({
        customerId: paymentForm.customerId,
        customerName: customer.name,
        amount: paymentForm.amount,
        paymentMethod: paymentForm.paymentMethod,
        paymentDate: paymentForm.paymentDate,
        notes: paymentForm.notes || undefined,
      })

      setShowPaymentForm(false)
      setPaymentForm({
        customerId: "",
        amount: 0,
        paymentMethod: "cash",
        paymentDate: new Date().toISOString().split("T")[0],
        notes: "",
      })
      await loadData()
      setMessage({ type: "success", text: "تم إضافة الدفعة بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة الدفعة" })
    }
  }

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await generateInvoice(invoiceForm.customerId, invoiceForm.periodStart, invoiceForm.periodEnd)

      setShowInvoiceForm(false)
      setInvoiceForm({
        customerId: "",
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        periodEnd: new Date().toISOString().split("T")[0],
      })
      await loadData()
      setMessage({ type: "success", text: "تم إنشاء الفاتورة بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إنشاء الفاتورة" })
    }
  }

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: Invoice["status"]) => {
    try {
      await updateInvoiceStatus(invoiceId, status)
      await loadData()
      setMessage({ type: "success", text: "تم تحديث حالة الفاتورة" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث حالة الفاتورة" })
    }
  }

  if (loading) {
    return (
      <Loading title="جاري تحميل الفواتير والرسوم ..." />
    )
  }

  if (showTransactionForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowTransactionForm(false)}
            className="flex items-center gap-2 hover-lift"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الفواتير
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              إضافة معاملة مالية
            </CardTitle>
            <CardDescription>تسجيل معاملة مالية جديدة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label>العميل</Label>
                <Select
                  value={transactionForm.customerId}
                  onValueChange={(value) => setTransactionForm((prev) => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={transactionForm.type}
                  onValueChange={(value: TransactionType) => setTransactionForm((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_fee">رسوم طلبات</SelectItem>
                    <SelectItem value="additional_service">خدمة إضافية</SelectItem>
                    <SelectItem value="cash_deduction">خصم نقدي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المبلغ (د.ب)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) =>
                    setTransactionForm((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف المعاملة"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-5 flex gap-2">
                <Button type="submit" className="hover-lift">إضافة المعاملة</Button>
                <Button type="button" variant="outline" onClick={() => setShowTransactionForm(false)} className="hover-lift">
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showPaymentForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPaymentForm(false)}
            className="flex items-center gap-2 hover-lift"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الفواتير
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إضافة دفعة مستلمة
            </CardTitle>
            <CardDescription>تسجيل دفعة مستلمة من العميل</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPayment} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label>العميل</Label>
                <Select
                  value={paymentForm.customerId}
                  onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المبلغ (د.ب)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>طريقة الدفع</Label>
                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value: PaymentMethod) =>
                    setPaymentForm((prev) => ({ ...prev, paymentMethod: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقداً</SelectItem>
                    <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                    <SelectItem value="check">شيك</SelectItem>
                    <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تاريخ الدفع</Label>
                <Input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, paymentDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Input
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="ملاحظات إضافية"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-5 flex gap-2">
                <Button type="submit" className="hover-lift">إضافة الدفعة</Button>
                <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)} className="hover-lift">
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showInvoiceForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowInvoiceForm(false)}
            className="flex items-center gap-2 hover-lift"
          >
            <ArrowRight className="h-4 w-4" />
            العودة إلى الفواتير
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إنشاء فاتورة جديدة
            </CardTitle>
            <CardDescription>إنشاء فاتورة جديدة للعميل</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateInvoice} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>العميل</Label>
                <Select
                  value={invoiceForm.customerId}
                  onValueChange={(value) => setInvoiceForm((prev) => ({ ...prev, customerId: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>من تاريخ</Label>
                <Input
                  type="date"
                  value={invoiceForm.periodStart}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, periodStart: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>إلى تاريخ</Label>
                <Input
                  type="date"
                  value={invoiceForm.periodEnd}
                  onChange={(e) => setInvoiceForm((prev) => ({ ...prev, periodEnd: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <Button type="submit" className="hover-lift">إنشاء الفاتورة</Button>
                <Button type="button" variant="outline" onClick={() => setShowInvoiceForm(false)} className="hover-lift">
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-2xl font-bold mb-2">إدارة الفوترة والمدفوعات</h1>
            <p>إدارة الفواتير والمدفوعات والمعاملات المالية</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowTransactionForm(true)}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <Plus className="h-4 w-4 mr-2" />
              معاملة جديدة
            </Button>
            <Button 
              onClick={() => setShowPaymentForm(true)}
              className="bg-white/10 hover:bg-white/20 text-[#272626] border-white/30 hover-lift"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              إضافة دفعة
            </Button>
            <Button 
              onClick={() => setShowInvoiceForm(true)}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <FileText className="h-4 w-4 mr-2" />
              فاتورة جديدة
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>التصفية والفترة الزمنية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">العميل</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العملاء</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">من تاريخ</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">إلى تاريخ</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">إجمالي العملاء</label>
              <div className="flex items-center h-9 px-3 bg-muted rounded-md">
                <span className="text-sm font-medium">{summaries.length} عميل</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Tabs defaultValue="summaries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-modern">
          <TabsTrigger value="summaries" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            ملخص العملاء
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            الفواتير
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            المعاملات
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            المدفوعات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summaries" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {summaries.map((summary) => (
              <Card key={summary.customerId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        {summary.customerName}
                      </CardTitle>
                      <CardDescription>{summary.activeInvoices} فاتورة نشطة</CardDescription>
                    </div>
                    <div className="text-right">
                      {summary.totalOverdue > 0 ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          متأخر
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          منتظم
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">إجمالي المستحق:</span>
                      <span className="font-medium">{summary.totalOutstanding.toFixed(2)} د.ب</span>
                    </div>
                    {summary.totalOverdue > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">المتأخر:</span>
                        <span className="font-medium text-red-600">{summary.totalOverdue.toFixed(2)} د.ب</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">إيرادات الشهر:</span>
                      <span className="font-medium text-green-600">{summary.currentMonthRevenue.toFixed(2)} د.ب</span>
                    </div>
                    {summary.lastPaymentDate && (
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-muted-foreground">آخر دفعة:</span>
                        <div className="text-right">
                          <p className="font-medium">{summary.lastPaymentAmount?.toFixed(2)} د.ب</p>
                          <p className="text-xs text-muted-foreground">{summary.lastPaymentDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        {invoice.invoiceNumber}
                      </CardTitle>
                      <CardDescription>
                        {invoice.customerName} • {invoice.periodStart} إلى {invoice.periodEnd}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={invoiceStatusColors[invoice.status]}>{getInvoiceStatusLabels(t)[invoice.status]}</Badge>
                      <Select
                        value={invoice.status}
                        onValueChange={(value: Invoice["status"]) => handleUpdateInvoiceStatus(invoice.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">مسودة</SelectItem>
                          <SelectItem value="sent">مرسلة</SelectItem>
                          <SelectItem value="paid">مدفوعة</SelectItem>
                          <SelectItem value="overdue">متأخرة</SelectItem>
                          <SelectItem value="cancelled">ملغية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">تفاصيل الفاتورة</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>الاشتراكات:</span>
                          <span>{invoice.subscriptionAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between">
                          <span>رسوم الطلبات:</span>
                          <span>{invoice.orderFeesAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between">
                          <span>خدمات إضافية:</span>
                          <span>{invoice.additionalServicesAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between">
                          <span>خصم نقدي:</span>
                          <span>{invoice.cashDeductionAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span>المجموع الفرعي:</span>
                          <span>{invoice.subtotal.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الضريبة:</span>
                          <span>{invoice.taxAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>الإجمالي:</span>
                          <span>{invoice.totalAmount.toFixed(2)} د.ب</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">حالة الدفع</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>المدفوع:</span>
                          <span className="text-green-600">{invoice.paidAmount.toFixed(2)} د.ب</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>المتبقي:</span>
                          <span className={invoice.remainingAmount > 0 ? "text-red-600" : "text-green-600"}>
                            {invoice.remainingAmount.toFixed(2)} د.ب
                          </span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>تاريخ الإصدار:</span>
                          <span>{invoice.issueDate}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>تاريخ الاستحقاق:</span>
                          <span>{invoice.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{transactionTypeLabels[transaction.type]}</Badge>
                        <span className="font-medium">{transaction.customerName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : ""}
                        {transaction.amount.toFixed(2)} د.ب
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">{payment.customerName}</span>
                        <Badge variant="outline">{paymentMethodLabels[payment.paymentMethod]}</Badge>
                      </div>
                      {payment.notes && <p className="text-sm text-muted-foreground">{payment.notes}</p>}
                      <p className="text-xs text-muted-foreground">{payment.paymentDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{payment.amount.toFixed(2)} د.ب</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
