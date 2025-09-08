"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SubscriptionForm } from "@/components/subscription-form"
import { ClientsList } from "@/components/clients-list"
import { ClientForm } from "@/components/client-form"
import Loading from "@/components/loading"
import {
  getCustomers,
  getSubscriptions,
  getSubscriptionSummaries,
  createSubscription,
  updateSubscription,
  createCustomer,
  type Customer,
  type SubscriptionPlan,
  type SubscriptionSummary,
} from "@/lib/subscriptions"
import { createClient, type CreateClientRequest, type UpdateClientRequest } from "@/lib/client-api-functions"
import { Plus, Users, Calendar, DollarSign, TrendingUp, AlertCircle, Edit, Search, UserPlus, ArrowRight } from "lucide-react"

const billingPeriodLabels = {
  weekly: "أسبوعي",
  "bi-weekly": "نصف شهري",
  monthly: "شهري",
  quarterly: "ربع سنوي",
  custom: "مخصص",
}

const subscriptionTypeLabels = {
  "same-day": "نفس اليوم",
  direct: "مباشر",
}

const statusColors = {
  active: "default",
  expired: "destructive",
  cancelled: "secondary",
} as const

const statusLabels = {
  active: "نشط",
  expired: "منتهي الصلاحية",
  cancelled: "ملغي",
}

export function SubscriptionsPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([])
  const [summaries, setSummaries] = useState<SubscriptionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionPlan | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"subscriptions" | "customers" | "clients">("subscriptions")
  const [showAddClientDialog, setShowAddClientDialog] = useState(false)
  const [addingClient, setAddingClient] = useState(false)


  useEffect(() => {
    loadData()
  }, [])


  const loadData = async () => {
    try {
      const [customersData, subscriptionsData, summariesData] = await Promise.all([
        getCustomers(),
        getSubscriptions(),
        getSubscriptionSummaries(),
      ])
      setCustomers(customersData)
      setSubscriptions(subscriptionsData)
      setSummaries(summariesData)
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحميل البيانات" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubscription = async (subscriptionData: Parameters<typeof createSubscription>[0]) => {
    try {
      await createSubscription(subscriptionData)
      setShowSubscriptionForm(false)
      await loadData()
      setMessage({ type: "success", text: "تم إضافة الاشتراك بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة الاشتراك" })
    }
  }

  const handleUpdateSubscription = async (subscriptionData: Parameters<typeof createSubscription>[0]) => {
    if (!editingSubscription) return

    try {
      await updateSubscription(editingSubscription.id, subscriptionData)
      setEditingSubscription(null)
      await loadData()
      setMessage({ type: "success", text: "تم تحديث الاشتراك بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث الاشتراك" })
    }
  }

  const handleAddClient = async (clientData: CreateClientRequest | UpdateClientRequest) => {
    try {
      setAddingClient(true)
      setMessage(null)
      // For adding new client, we need all required fields
      if (!clientData.name || !clientData.email || !clientData.phone) {
        throw new Error("جميع الحقول المطلوبة يجب أن تكون مملوءة")
      }
      
      const newClientData: CreateClientRequest = {
        name: clientData.name as string,
        email: clientData.email as string,
        phone: clientData.phone as string,
        company_name: clientData.company_name
      }
      await createClient(newClientData)
      setMessage({ type: "success", text: "تم إضافة العميل بنجاح!" })
      setShowAddClientDialog(false)
      await loadData() // Refresh data to include new client
    } catch (error) {
      console.error("Error adding client:", error)
      setMessage({ type: "error", text: "فشل في إضافة العميل" })
    } finally {
      setAddingClient(false)
    }
  }


  const filteredSummaries = summaries.filter((summary) => {
    const matchesSearch = summary.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || summary.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <Loading title="جاري تحميل العملاء والمشتركين ..." />
    )
  }

  if (showSubscriptionForm) {
    return (
      <SubscriptionForm
        customers={customers}
        subscription={editingSubscription || undefined}
        onSubmit={editingSubscription ? handleUpdateSubscription : handleCreateSubscription}
        onCancel={() => {
          setShowSubscriptionForm(false)
          setEditingSubscription(null)
        }}
      />
    )
  }


  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] rounded-2xl p-6 text-[#272626] shadow-modern-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة الاشتراكات والعملاء</h1>
            <p>متابعة اشتراكات العملاء وإدارة الباقات</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowAddClientDialog(true)}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              عميل جديد
            </Button>
            <Button 
              onClick={() => setShowSubscriptionForm(true)}
              className="bg-white/20 hover:bg-white/30 text-[#272626] border-white/30 hover-lift"
            >
              <Plus className="h-4 w-4 mr-2" />
              اشتراك جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "subscriptions"
              ? "bg-white text-[#272626] shadow-sm"
              : "text-gray-600 hover:text-[#272626]"
          }`}
        >
          إدارة الاشتراكات
        </button>
        <button
          onClick={() => setActiveTab("clients")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "clients"
              ? "bg-white text-[#272626] shadow-sm"
              : "text-gray-600 hover:text-[#272626]"
          }`}
        >
          إدارة العملاء
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "clients" && <ClientsList />}
      
      {activeTab === "subscriptions" && (
        <>
          {/* Filters */}
      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">البحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث في العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full !h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">إجمالي الاشتراكات</label>
              <div className="flex items-center h-10 px-3 bg-muted rounded-md">
                <span className="text-sm font-medium">{filteredSummaries.length} اشتراك</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            قائمة الاشتراكات ({filteredSummaries.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 p-6">
        {filteredSummaries.map((summary) => (
          <Card key={summary.subscriptionId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {summary.customerName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {subscriptionTypeLabels[summary.subscriptionType]}
                    </span>
                    {summary.nextBillingDate && (
                      <span className="text-sm">التجديد التالي: {summary.nextBillingDate}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[summary.status]}>{statusLabels[summary.status]}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const subscription = subscriptions.find((s) => s.id === summary.subscriptionId)
                      if (subscription) {
                        setEditingSubscription(subscription)
                        setShowSubscriptionForm(true)
                      }
                    }}
                    className="hover-lift"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Usage Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">استخدام الطلبات</span>
                    <span className="text-sm text-muted-foreground">
                      {summary.usedOrders} / {summary.totalOrders}
                    </span>
                  </div>
                  <Progress value={summary.usagePercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{summary.usagePercentage.toFixed(1)}% مستخدم</span>
                    <span>{summary.remainingOrders} طلب متبقي</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الأيام المتبقية</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {summary.daysRemaining}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                    <p className="text-lg font-semibold flex items-center gap-1 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      {summary.totalRevenue.toFixed(2)} د.ب
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">الرسوم الإضافية</p>
                    <p className="text-lg font-semibold flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {summary.additionalFees.toFixed(2)} د.ب
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">معدل الاستخدام</p>
                    <p className="text-lg font-semibold">{summary.usagePercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </CardContent>
      </Card>

      {filteredSummaries.length === 0 && (
        <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد اشتراكات</h3>
            <p className="text-gray-500 mb-4">لم يتم العثور على اشتراكات تطابق معايير البحث</p>
            <Button onClick={() => setShowSubscriptionForm(true)} className="hover-lift">
              <Plus className="h-4 w-4 mr-2" />
              إضافة اشتراك جديد
            </Button>
          </CardContent>
        </Card>
      )}
        </>
      )}

      {/* Add Client Dialog */}
      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setShowAddClientDialog(false)}
            loading={addingClient}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
