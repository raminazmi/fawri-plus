"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Driver, CashPayment } from "@/lib/driver-cash"
import { Loader2, DollarSign, ArrowRight } from "lucide-react"

interface CashPaymentFormProps {
  drivers: Driver[]
  onSubmit: (paymentData: {
    driverId: string
    amount: number
    paymentMethod: CashPayment["paymentMethod"]
    paymentDate: string
    notes?: string
  }) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CashPaymentForm({ drivers, onSubmit, onCancel, loading = false }: CashPaymentFormProps) {
  const [formData, setFormData] = useState({
    driverId: "",
    amount: 0,
    paymentMethod: "cash" as CashPayment["paymentMethod"],
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      driverId: formData.driverId,
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      notes: formData.notes || undefined,
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 hover-lift"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى الدفعات
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            إضافة دفعة نقدية
          </CardTitle>
          <CardDescription>تسجيل دفعة مستلمة من السائق</CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="driver">السائق</Label>
            <Select
              value={formData.driverId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, driverId: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر السائق" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ (د.ب)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">طريقة الدفع</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value: CashPayment["paymentMethod"]) =>
                setFormData((prev) => ({ ...prev, paymentMethod: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">نقداً</SelectItem>
                <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                <SelectItem value="check">شيك</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">تاريخ الدفع</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, paymentDate: e.target.value }))}
              required
              disabled={loading}
            />
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
            <Button type="submit" disabled={loading || !formData.driverId || formData.amount <= 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "إضافة الدفعة"
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
