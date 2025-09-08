"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, ArrowRight } from "lucide-react"
import { Client, CreateClientRequest, UpdateClientRequest } from "@/lib/types"

interface ClientFormProps {
  client?: Client | null
  onSubmit: (clientData: CreateClientRequest | UpdateClientRequest) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ClientForm({ client, onSubmit, onCancel, loading = false }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    company_name: client?.company_name || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const clientData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company_name: formData.company_name || undefined,
    }
    
    await onSubmit(clientData)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex items-center gap-2 hover-lift"
        >
          <ArrowRight className="h-4 w-4" />
          العودة
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {client ? "تعديل العميل" : "إضافة عميل جديد"}
          </CardTitle>
          <CardDescription>
            {client ? "تعديل بيانات العميل" : "تسجيل عميل جديد في النظام"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">معلومات العميل</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم العميل *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="أدخل اسم العميل"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+973 (000) 000-00-0"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="client@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">اسم الشركة</Label>
                  <Input
                    id="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder="اسم الشركة (اختياري)"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.email || !formData.phone}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  client ? "تحديث العميل" : "إضافة العميل"
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
