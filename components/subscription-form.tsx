"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import type {
  Customer,
  SubscriptionPlan,
  SubscriptionType,
  BillingPeriod,
  UnusedOrdersPolicy,
} from "@/lib/subscriptions"
import { Loader2, Users, Calendar, DollarSign, Settings, ArrowRight } from "lucide-react"

interface SubscriptionFormProps {
  customers: Customer[]
  subscription?: SubscriptionPlan
  onSubmit: (subscriptionData: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function SubscriptionForm({
  customers,
  subscription,
  onSubmit,
  onCancel,
  loading = false,
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    customerId: subscription?.customerId || "",
    subscriptionType: subscription?.subscriptionType || ("same-day" as SubscriptionType),
    billingPeriod: subscription?.billingPeriod || ("monthly" as BillingPeriod),
    customPeriodDays: subscription?.customPeriodDays || 30,
    startDate: subscription?.startDate || new Date().toISOString().split("T")[0],
    endDate: subscription?.endDate || "",
    totalOrders: subscription?.totalOrders || 0,
    subscriptionPrice: subscription?.subscriptionPrice || 0,
    outOfSubscriptionSameDayPrice: subscription?.outOfSubscriptionSameDayPrice || 0,
    outOfSubscriptionDirectPrice: subscription?.outOfSubscriptionDirectPrice || 0,
    crossTypeHandling: subscription?.crossTypeHandling || ("fixed_fee" as "fixed_fee" | "deduct_orders"),
    crossTypeSameDayFee: subscription?.crossTypeSameDayFee || 0,
    crossTypeDirectFee: subscription?.crossTypeDirectFee || 0,
    crossTypeOrdersDeducted: subscription?.crossTypeOrdersDeducted || 1,
    unusedOrdersPolicy: subscription?.unusedOrdersPolicy || ("carry_over_percentage" as UnusedOrdersPolicy),
    carryOverPercentage: subscription?.carryOverPercentage || 0,
    carryOverNumber: subscription?.carryOverNumber || 0,
    extensionDays: subscription?.extensionDays || 0,
    autoRenew: subscription?.autoRenew || false,
    status: subscription?.status || ("active" as "active" | "expired" | "cancelled"),
  })

  const selectedCustomer = customers.find((c) => c.id === formData.customerId)

  const calculateEndDate = () => {
    const startDate = new Date(formData.startDate)
    const endDate = new Date(startDate)

    switch (formData.billingPeriod) {
      case "weekly":
        endDate.setDate(endDate.getDate() + 7)
        break
      case "bi-weekly":
        endDate.setDate(endDate.getDate() + 14)
        break
      case "monthly":
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case "quarterly":
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case "custom":
        endDate.setDate(endDate.getDate() + formData.customPeriodDays)
        break
    }

    return endDate.toISOString().split("T")[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const endDate = formData.endDate || calculateEndDate()

    await onSubmit({
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "",
      subscriptionType: formData.subscriptionType,
      billingPeriod: formData.billingPeriod,
      customPeriodDays: formData.billingPeriod === "custom" ? formData.customPeriodDays : undefined,
      startDate: formData.startDate,
      endDate,
      totalOrders: formData.totalOrders,
      subscriptionPrice: formData.subscriptionPrice,
      outOfSubscriptionSameDayPrice: formData.outOfSubscriptionSameDayPrice,
      outOfSubscriptionDirectPrice: formData.outOfSubscriptionDirectPrice,
      crossTypeHandling: formData.crossTypeHandling,
      crossTypeSameDayFee: formData.crossTypeHandling === "fixed_fee" ? formData.crossTypeSameDayFee : undefined,
      crossTypeDirectFee: formData.crossTypeHandling === "fixed_fee" ? formData.crossTypeDirectFee : undefined,
      crossTypeOrdersDeducted:
        formData.crossTypeHandling === "deduct_orders" ? formData.crossTypeOrdersDeducted : undefined,
      unusedOrdersPolicy: formData.unusedOrdersPolicy,
      carryOverPercentage:
        formData.unusedOrdersPolicy === "carry_over_percentage" ? formData.carryOverPercentage : undefined,
      carryOverNumber: formData.unusedOrdersPolicy === "carry_over_number" ? formData.carryOverNumber : undefined,
      extensionDays: formData.unusedOrdersPolicy === "extend_period" ? formData.extensionDays : undefined,
      status: formData.status,
      autoRenew: formData.autoRenew,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 hover-lift"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الاشتراكات
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {subscription ? "تعديل الاشتراك" : "إضافة اشتراك جديد"}
          </CardTitle>
          <CardDescription>{subscription ? "قم بتعديل بيانات الاشتراك" : "أضف اشتراك جديد للعميل"}</CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              معلومات العميل والاشتراك
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customer">العميل</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
                  disabled={loading || !!subscription}
                >
                  <SelectTrigger>
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
                <Label htmlFor="subscriptionType">نوع الاشتراك</Label>
                <Select
                  value={formData.subscriptionType}
                  onValueChange={(value: SubscriptionType) =>
                    setFormData((prev) => ({ ...prev, subscriptionType: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same-day">نفس اليوم (Same-day)</SelectItem>
                    <SelectItem value="direct">مباشر (Direct)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              فترة الفوترة والتواريخ
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="billingPeriod">فترة الفوترة</Label>
                <Select
                  value={formData.billingPeriod}
                  onValueChange={(value: BillingPeriod) => setFormData((prev) => ({ ...prev, billingPeriod: value }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="bi-weekly">نصف شهري</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                    <SelectItem value="quarterly">ربع سنوي</SelectItem>
                    <SelectItem value="custom">مخصص</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.billingPeriod === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customPeriodDays">عدد الأيام</Label>
                  <Input
                    id="customPeriodDays"
                    type="number"
                    min="1"
                    value={formData.customPeriodDays}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customPeriodDays: Number.parseInt(e.target.value) || 30 }))
                    }
                    disabled={loading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoRenew: checked }))}
                disabled={loading}
              />
              <Label htmlFor="autoRenew">تجديد تلقائي</Label>
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              تفاصيل الاشتراك والأسعار
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="totalOrders">عدد الطلبات</Label>
                <Input
                  id="totalOrders"
                  type="number"
                  min="1"
                  value={formData.totalOrders}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, totalOrders: Number.parseInt(e.target.value) || 0 }))
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionPrice">سعر الاشتراك (د.ب)</Label>
                <Input
                  id="subscriptionPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.subscriptionPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subscriptionPrice: Number.parseFloat(e.target.value) || 0 }))
                  }
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">حالة الاشتراك</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "expired" | "cancelled") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="outOfSubscriptionSameDayPrice">سعر طلبات نفس اليوم خارج الاشتراك (د.ب)</Label>
                <Input
                  id="outOfSubscriptionSameDayPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.outOfSubscriptionSameDayPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      outOfSubscriptionSameDayPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outOfSubscriptionDirectPrice">سعر الطلبات المباشرة خارج الاشتراك (د.ب)</Label>
                <Input
                  id="outOfSubscriptionDirectPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.outOfSubscriptionDirectPrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      outOfSubscriptionDirectPrice: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              معالجة الطلبات المختلطة
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>طريقة معالجة الطلبات من النوع الآخر</Label>
                <Select
                  value={formData.crossTypeHandling}
                  onValueChange={(value: "fixed_fee" | "deduct_orders") =>
                    setFormData((prev) => ({ ...prev, crossTypeHandling: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed_fee">رسوم ثابتة</SelectItem>
                    <SelectItem value="deduct_orders">خصم من الطلبات المتاحة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.crossTypeHandling === "fixed_fee" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="crossTypeSameDayFee">رسوم طلبات نفس اليوم (د.ب)</Label>
                    <Input
                      id="crossTypeSameDayFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.crossTypeSameDayFee}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          crossTypeSameDayFee: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossTypeDirectFee">رسوم الطلبات المباشرة (د.ب)</Label>
                    <Input
                      id="crossTypeDirectFee"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.crossTypeDirectFee}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, crossTypeDirectFee: Number.parseFloat(e.target.value) || 0 }))
                      }
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {formData.crossTypeHandling === "deduct_orders" && (
                <div className="space-y-2">
                  <Label htmlFor="crossTypeOrdersDeducted">عدد الطلبات المخصومة</Label>
                  <Input
                    id="crossTypeOrdersDeducted"
                    type="number"
                    min="1"
                    value={formData.crossTypeOrdersDeducted}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        crossTypeOrdersDeducted: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">سياسة الطلبات غير المستخدمة</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ماذا يحدث للطلبات غير المستخدمة؟</Label>
                <Select
                  value={formData.unusedOrdersPolicy}
                  onValueChange={(value: UnusedOrdersPolicy) =>
                    setFormData((prev) => ({ ...prev, unusedOrdersPolicy: value }))
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carry_over_percentage">ترحيل نسبة مئوية</SelectItem>
                    <SelectItem value="carry_over_number">ترحيل عدد محدد</SelectItem>
                    <SelectItem value="extend_period">تمديد الفترة</SelectItem>
                    <SelectItem value="forfeit">إلغاء بدون استرداد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.unusedOrdersPolicy === "carry_over_percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="carryOverPercentage">النسبة المئوية للترحيل (%)</Label>
                  <Input
                    id="carryOverPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.carryOverPercentage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, carryOverPercentage: Number.parseInt(e.target.value) || 0 }))
                    }
                    disabled={loading}
                  />
                </div>
              )}

              {formData.unusedOrdersPolicy === "carry_over_number" && (
                <div className="space-y-2">
                  <Label htmlFor="carryOverNumber">عدد الطلبات المرحلة</Label>
                  <Input
                    id="carryOverNumber"
                    type="number"
                    min="0"
                    value={formData.carryOverNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, carryOverNumber: Number.parseInt(e.target.value) || 0 }))
                    }
                    disabled={loading}
                  />
                </div>
              )}

              {formData.unusedOrdersPolicy === "extend_period" && (
                <div className="space-y-2">
                  <Label htmlFor="extensionDays">عدد أيام التمديد</Label>
                  <Input
                    id="extensionDays"
                    type="number"
                    min="1"
                    value={formData.extensionDays}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, extensionDays: Number.parseInt(e.target.value) || 0 }))
                    }
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading || !formData.customerId}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : subscription ? (
                "تحديث الاشتراك"
              ) : (
                "إضافة الاشتراك"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  )
}
