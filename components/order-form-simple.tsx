"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Package, ArrowRight } from "lucide-react"

interface OrderFormSimpleProps {
  onSubmit: (orderData: {
    orderNumber: string
    customerName: string
    customerPhoneNumber: string
    pickupName: string
    pickupPhoneNumber: string
    pickupAddress: string
    deliveryAddress: string
    deliveryDate: string
    orderValue: number
    paymentMethod: string
    notes?: string
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function OrderFormSimple({ onSubmit, onCancel, loading = false }: OrderFormSimpleProps) {
  const [formData, setFormData] = useState({
    orderNumber: `ORD-${Date.now()}`,
    customerName: "",
    customerPhoneNumber: "",
    pickupName: "",
    pickupPhoneNumber: "",
    pickupAddress: "",
    deliveryAddress: "",
    deliveryDate: new Date().toISOString().split("T")[0],
    orderValue: 0,
    paymentMethod: "CASH",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      orderNumber: formData.orderNumber,
      customerName: formData.customerName,
      customerPhoneNumber: formData.customerPhoneNumber,
      pickupName: formData.pickupName,
      pickupPhoneNumber: formData.pickupPhoneNumber,
      pickupAddress: formData.pickupAddress,
      deliveryAddress: formData.deliveryAddress,
      deliveryDate: formData.deliveryDate,
      orderValue: formData.orderValue,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes || undefined,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 hover-lift"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الطلبات
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            إضافة طلب جديد
          </CardTitle>
          <CardDescription>تسجيل طلب جديد في النظام</CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">رقم الطلب</Label>
            <Input
              id="orderNumber"
              type="text"
              value={formData.orderNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))}
              placeholder="أدخل رقم الطلب"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">اسم العميل *</Label>
              <Input
                id="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                placeholder="أدخل اسم العميل"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhoneNumber">رقم هاتف العميل *</Label>
              <Input
                id="customerPhoneNumber"
                type="tel"
                value={formData.customerPhoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, customerPhoneNumber: e.target.value }))}
                placeholder="+973 (000) 000-00-0"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">معلومات الاستلام</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupName">اسم المتجر *</Label>
                <Input
                  id="pickupName"
                  type="text"
                  value={formData.pickupName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pickupName: e.target.value }))}
                  placeholder="أدخل اسم المتجر"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupPhoneNumber">رقم هاتف المتجر *</Label>
                <Input
                  id="pickupPhoneNumber"
                  type="tel"
                  value={formData.pickupPhoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, pickupPhoneNumber: e.target.value }))}
                  placeholder="+973 (000) 000-00-0"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">عنوان الاستلام *</Label>
              <Input
                id="pickupAddress"
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, pickupAddress: e.target.value }))}
                placeholder="أدخل عنوان الاستلام"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">معلومات التوصيل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">عنوان التوصيل *</Label>
                <Input
                  id="deliveryAddress"
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deliveryAddress: e.target.value }))}
                  placeholder="أدخل عنوان التوصيل"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">تاريخ التوصيل *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderValue">قيمة الطلب (د.ب) *</Label>
              <Input
                id="orderValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.orderValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, orderValue: Number.parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">نقداً</SelectItem>
                  <SelectItem value="CARD">بطاقة</SelectItem>
                  <SelectItem value="ONLINE">عبر الإنترنت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="ملاحظات إضافية (اختياري)"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={loading || !formData.customerName || !formData.pickupName || formData.orderValue <= 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "إضافة الطلب"
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
