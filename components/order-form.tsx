"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Package, ArrowRight, MapPin, Clock, CreditCard, User, Building2, Plus } from "lucide-react"
import { Client, CreateClientRequest, UpdateClientRequest } from "@/lib/types"
import { fetchClients, createClient } from "@/lib/client-api-functions"
import { ClientForm } from "@/components/client-form"

interface OrderFormProps {
  onSubmit: (orderData: ShipdayOrderData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface ShipdayOrderData {
  orderNumber: string
  customerName: string
  customerAddress: string
  customerEmail: string
  customerPhoneNumber: string
  restaurantName: string
  restaurantAddress: string
  restaurantPhoneNumber: string
  expectedDeliveryDate: string
  expectedPickupTime: string
  expectedDeliveryTime: string
  pickupLatitude: number
  pickupLongitude: number
  deliveryLatitude: number
  deliveryLongitude: number
  tips: number
  tax: number
  discountAmount: number
  deliveryFee: number
  totalOrderCost: number
  deliveryInstruction: string
  orderSource: string
  additionalId: string
  clientRestaurantId: number
  paymentMethod: string
  creditCardType?: string
  creditCardId?: number
}

export function OrderForm({ onSubmit, onCancel, loading = false }: OrderFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [loadingClients, setLoadingClients] = useState(false)
  const [showAddClientDialog, setShowAddClientDialog] = useState(false)
  const [addingClient, setAddingClient] = useState(false)
  
  const [formData, setFormData] = useState<ShipdayOrderData>({
    orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhoneNumber: "",
    restaurantName: "",
    restaurantAddress: "",
    restaurantPhoneNumber: "",
    expectedDeliveryDate: new Date().toISOString().split("T")[0],
    expectedPickupTime: "17:45",
    expectedDeliveryTime: "19:22",
    pickupLatitude: 41.53867,
    pickupLongitude: -72.0827,
    deliveryLatitude: 41.53867,
    deliveryLongitude: -72.0827,
    tips: 0,
    tax: 0,
    discountAmount: 0,
    deliveryFee: 0,
    totalOrderCost: 0,
    deliveryInstruction: "",
    orderSource: "Fawri Plus",
    additionalId: "",
    clientRestaurantId: 1,
    paymentMethod: "cash",
    creditCardType: "",
    creditCardId: 0,
  })

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setLoadingClients(true)
      const clientsData = await fetchClients()
      setClients(clientsData)
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setLoadingClients(false)
    }
  }

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id.toString() === clientId)
    if (client) {
      setSelectedClient(client)
      setFormData(prev => ({
        ...prev,
        customerName: client.name,
        customerEmail: client.email,
        customerPhoneNumber: client.phone,
        customerAddress: client.address || prev.customerAddress, // Include address if available
      }))
    }
  }

  const handleAddClient = async (clientData: CreateClientRequest | UpdateClientRequest) => {
    try {
      setAddingClient(true)
      await createClient(clientData as CreateClientRequest)
      setShowAddClientDialog(false)
      await loadClients() // Refresh clients list
    } catch (error) {
      console.error("Error adding client:", error)
    } finally {
      setAddingClient(false)
    }
  }

  const validateTimeFormat = (time: string): boolean => {
    // Accept both HH:MM and HH:MM:SS formats
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
    return timeRegex.test(time)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate time formats
    if (!validateTimeFormat(formData.expectedPickupTime)) {
      alert("تنسيق وقت الاستلام غير صحيح. يجب أن يكون HH:MM (مثال: 17:45)")
      return
    }
    
    if (!validateTimeFormat(formData.expectedDeliveryTime)) {
      alert("تنسيق وقت التوصيل غير صحيح. يجب أن يكون HH:MM (مثال: 19:22)")
      return
    }
    
    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof ShipdayOrderData, value: string | number) => {
    // Convert time format for time inputs
    if (field === 'expectedPickupTime' || field === 'expectedDeliveryTime') {
      // Convert from HH:MM to HH:MM:SS format
      if (typeof value === 'string' && value.match(/^\d{2}:\d{2}$/)) {
        value = value + ':00'
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          العودة إلى الطلبات
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            إنشاء طلب جديد - Shipday
          </CardTitle>
          <CardDescription>أدخل جميع البيانات المطلوبة لإنشاء طلب في Shipday</CardDescription>
        </CardHeader>
          
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات الطلب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">رقم الطلب</Label>
                    <Input
                      id="orderNumber"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderSource">مصدر الطلب</Label>
                    <Input
                      id="orderSource"
                      value={formData.orderSource}
                      onChange={(e) => handleInputChange("orderSource", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalId">معرف إضافي</Label>
                    <Input
                      id="additionalId"
                      value={formData.additionalId}
                      onChange={(e) => handleInputChange("additionalId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientRestaurantId">معرف المطعم</Label>
                    <Input
                      id="clientRestaurantId"
                      type="number"
                      value={formData.clientRestaurantId}
                      onChange={(e) => handleInputChange("clientRestaurantId", parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">اختيار العميل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientSelect">اختر عميل موجود</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedClient?.id.toString() || ""}
                        onValueChange={handleClientSelect}
                        disabled={loadingClients || loading}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={loadingClients ? "جاري تحميل العملاء..." : "اختر عميل من القائمة"} />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} / {client.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={showAddClientDialog} onOpenChange={setShowAddClientDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            عميل جديد
                          </Button>
                        </DialogTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label>أو أدخل بيانات العميل يدوياً</Label>
                    <div className="text-sm text-gray-500">
                      يمكنك اختيار عميل من القائمة أو إدخال البيانات يدوياً
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات العميل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">اسم العميل *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
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
                      onChange={(e) => handleInputChange("customerPhoneNumber", e.target.value)}
                      placeholder="+973 (000) 000-00-0"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">بريد العميل الإلكتروني</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                      placeholder="customer@example.com"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerAddress">عنوان العميل</Label>
                    <Input
                      id="customerAddress"
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange("customerAddress", e.target.value)}
                      placeholder="أدخل عنوان العميل"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات المطعم</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">اسم المطعم</Label>
                    <Input
                      id="restaurantName"
                      value={formData.restaurantName}
                      onChange={(e) => handleInputChange("restaurantName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantPhoneNumber">رقم هاتف المطعم</Label>
                    <Input
                      id="restaurantPhoneNumber"
                      value={formData.restaurantPhoneNumber}
                      onChange={(e) => handleInputChange("restaurantPhoneNumber", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="restaurantAddress">عنوان المطعم</Label>
                    <Input
                      id="restaurantAddress"
                      value={formData.restaurantAddress}
                      onChange={(e) => handleInputChange("restaurantAddress", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات التوصيل</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedDeliveryDate">تاريخ التوصيل المتوقع</Label>
                    <Input
                      id="expectedDeliveryDate"
                      type="date"
                      value={formData.expectedDeliveryDate}
                      onChange={(e) => handleInputChange("expectedDeliveryDate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedPickupTime">وقت الاستلام المتوقع</Label>
                    <Input
                      id="expectedPickupTime"
                      type="time"
                      value={formData.expectedPickupTime}
                      onChange={(e) => handleInputChange("expectedPickupTime", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedDeliveryTime">وقت التوصيل المتوقع</Label>
                    <Input
                      id="expectedDeliveryTime"
                      type="time"
                      value={formData.expectedDeliveryTime}
                      onChange={(e) => handleInputChange("expectedDeliveryTime", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryInstruction">تعليمات التوصيل</Label>
                    <Textarea
                      id="deliveryInstruction"
                      value={formData.deliveryInstruction}
                      onChange={(e) => handleInputChange("deliveryInstruction", e.target.value)}
                      placeholder="مثال: سريع، اطلب من العميل، إلخ..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات الموقع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLatitude">خط عرض نقطة الاستلام</Label>
                    <Input
                      id="pickupLatitude"
                      type="number"
                      step="0.000001"
                      value={formData.pickupLatitude}
                      onChange={(e) => handleInputChange("pickupLatitude", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pickupLongitude">خط طول نقطة الاستلام</Label>
                    <Input
                      id="pickupLongitude"
                      type="number"
                      step="0.000001"
                      value={formData.pickupLongitude}
                      onChange={(e) => handleInputChange("pickupLongitude", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLatitude">خط عرض نقطة التوصيل</Label>
                    <Input
                      id="deliveryLatitude"
                      type="number"
                      step="0.000001"
                      value={formData.deliveryLatitude}
                      onChange={(e) => handleInputChange("deliveryLatitude", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLongitude">خط طول نقطة التوصيل</Label>
                    <Input
                      id="deliveryLongitude"
                      type="number"
                      step="0.000001"
                      value={formData.deliveryLongitude}
                      onChange={(e) => handleInputChange("deliveryLongitude", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">المعلومات المالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tips">البقشيش</Label>
                    <Input
                      id="tips"
                      type="number"
                      step="0.01"
                      value={formData.tips}
                      onChange={(e) => handleInputChange("tips", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">الضريبة</Label>
                    <Input
                      id="tax"
                      type="number"
                      step="0.01"
                      value={formData.tax}
                      onChange={(e) => handleInputChange("tax", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountAmount">مبلغ الخصم</Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      step="0.01"
                      value={formData.discountAmount}
                      onChange={(e) => handleInputChange("discountAmount", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">رسوم التوصيل</Label>
                    <Input
                      id="deliveryFee"
                      type="number"
                      step="0.01"
                      value={formData.deliveryFee}
                      onChange={(e) => handleInputChange("deliveryFee", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalOrderCost">إجمالي تكلفة الطلب</Label>
                    <Input
                      id="totalOrderCost"
                      type="number"
                      step="0.01"
                      value={formData.totalOrderCost}
                      onChange={(e) => handleInputChange("totalOrderCost", parseFloat(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">معلومات الدفع</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange("paymentMethod", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقداً</SelectItem>
                        <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                        <SelectItem value="debit_card">بطاقة خصم</SelectItem>
                        <SelectItem value="online">دفع إلكتروني</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.paymentMethod === "credit_card" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="creditCardType">نوع البطاقة</Label>
                        <Select value={formData.creditCardType} onValueChange={(value) => handleInputChange("creditCardType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع البطاقة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">Mastercard</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="creditCardId">معرف البطاقة</Label>
                        <Input
                          id="creditCardId"
                          type="number"
                          value={formData.creditCardId}
                          onChange={(e) => handleInputChange("creditCardId", parseInt(e.target.value))}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
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
