"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { HubLocation } from "@/lib/settings"
import { Loader2 } from "lucide-react"

interface HubFormProps {
  hub?: HubLocation
  onSubmit: (hubData: Omit<HubLocation, "id" | "createdAt" | "updatedAt">) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function HubForm({ hub, onSubmit, onCancel, loading = false }: HubFormProps) {
  const [formData, setFormData] = useState({
    name: hub?.name || "",
    phone: hub?.phone || "",
    address: hub?.address || "",
    locationAddress: hub?.location.address || "",
    lat: hub?.location.lat?.toString() || "",
    lng: hub?.location.lng?.toString() || "",
    isDefault: hub?.isDefault || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onSubmit({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      location: {
        lat: Number.parseFloat(formData.lat) || 0,
        lng: Number.parseFloat(formData.lng) || 0,
        address: formData.locationAddress,
      },
      isDefault: formData.isDefault,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{hub ? "تعديل المركز" : "إضافة مركز جديد"}</CardTitle>
        <CardDescription>{hub ? "قم بتعديل بيانات المركز" : "أضف مركز جديد لإدارة الطلبات"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المركز</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="المركز الرئيسي"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+973-1234-5678"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">العنوان التفصيلي</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="شارع الملك فيصل، المنامة"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationAddress">عنوان الموقع</Label>
            <Input
              id="locationAddress"
              value={formData.locationAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, locationAddress: e.target.value }))}
              placeholder="المنامة، البحرين"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lat">خط العرض (Latitude)</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData((prev) => ({ ...prev, lat: e.target.value }))}
                placeholder="26.2285"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">خط الطول (Longitude)</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData((prev) => ({ ...prev, lng: e.target.value }))}
                placeholder="50.5860"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked }))}
              disabled={loading}
            />
            <Label htmlFor="isDefault">تعيين كمركز افتراضي</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : hub ? (
                "تحديث المركز"
              ) : (
                "إضافة المركز"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
