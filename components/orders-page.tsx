"use client"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Loading from "@/components/loading"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchOrders, fetchDrivers, updateOrderStatus, createOrder as createShipdayOrder, createOrderNew, updateOrderNew, assignOrderToDriver, unassignOrderFromDriver, setOrderReadyToPickup, getShipdaySDK } from "@/lib/shipday-api-functions"
import { formatOrderForShipday, type CreateOrderRequest } from "@/lib/order-formats"
import { type ShipdayDriver, type ShipdayOrder } from "@/lib/types"
import { createOrder } from "@/lib/orders"
import { OrderForm } from "@/components/order-form"
import {
  Plus,
  Search,
  RefreshCw,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Eye,
  UserPlus,
  Edit,
  Trash2,
  User,
  Building,
  DollarSign,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

const getStatusOrder = (order: ShipdayOrder) => {
  const raw = (order.orderStatus?.orderState || "").toString().toUpperCase()
  const map: Record<string, "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"> = {
    NOT_ASSIGNED: "pending",
    ORDER_PLACED: "pending",
    PENDING: "pending",
    ASSIGNED: "assigned",
    ORDER_ASSIGNED: "assigned",
    PICKED_UP: "picked_up",
    ORDER_PICKED_UP: "picked_up",
    IN_TRANSIT: "in_transit",
    ORDER_IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
    ORDER_DELIVERED: "delivered",
    CANCELLED: "cancelled",
    ORDER_CANCELLED: "cancelled",
  }
  return map[raw] ?? "pending"
};

// دالة لتصنيف الطلبات حسب الحالة كما في Shipday
const getOrderCategory = (order: ShipdayOrder) => {
  const status = getStatusOrder(order)
  const now = new Date()
  const deliveryDate = order.activityLog?.expectedDeliveryTime ? new Date(order.activityLog.expectedDeliveryTime) : null
  
  if (status === "delivered") {
    return "completed"
  } else if (status === "cancelled") {
    return "incomplete"
  } else if (deliveryDate && deliveryDate > now) {
    return "scheduled"
  } else if (status === "pending" || status === "assigned" || status === "picked_up" || status === "in_transit") {
    return "current"
  } else {
    return "history"
  }
}

const statusIcons = {
  pending: Clock,
  assigned: Package,
  picked_up: Truck,
  in_transit: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusLabels = {
  pending: "غير معين",
  assigned: "تم التعيين",
  picked_up: "تم الاستلام",
  in_transit: "في الطريق",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const statusColors = {
  pending: "secondary",
  assigned: "default",
  picked_up: "default",
  in_transit: "default",
  delivered: "default",
  cancelled: "destructive",
} as const;

const availableStatuses = [
  "PENDING",
  "ASSIGNED",
  "PICKED_UP",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
] as const;

const UI_TO_API_STATUS: Record<
  "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled",
  (typeof availableStatuses)[number]
> = {
  pending: "PENDING",
  assigned: "ASSIGNED",
  picked_up: "PICKED_UP",
  in_transit: "IN_TRANSIT",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

function OrderDetailsModal({ order }: { order: ShipdayOrder }) {
  const formatTime = (timeString: string) => {
    if (!timeString) return "غير محدد"
    return new Date(timeString).toLocaleString("en")
  }

  const formatTimeOnly = (timeString: string) => {
    if (!timeString) return "غير محدد"
    return timeString
  }

  const status = getStatusOrder(order)
  const StatusIcon = statusIcons[status]

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-modern-xl">
      <DialogHeader className="bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] -m-6 mb-6 p-6 text-white rounded-t-lg">
        <DialogTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
          <Package className="h-5 w-5" />
          </div>
          <div>
            <span>طلب #{order.orderNumber}</span>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm text-blue-100">{statusLabels[status]}</span>
            </div>
          </div>
        </DialogTitle>
        <DialogDescription className="text-blue-100 mt-2">
          تاريخ الطلب: {formatTime(order.activityLog?.placementTime || "")}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-6 -mt-2">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-modern border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                التوصيل إلى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600  text-sm">
                    {order.customer?.name?.charAt(0) || "ع"}
                  </span>
                </div>
                <div>
                  <p className=" text-gray-900">{order.customer?.name || "غير محدد"}</p>
                  <p className="text-sm text-gray-600">{order.customer?.address || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/50 p-3 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{order.customer?.phoneNumber || "غير محدد"}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-modern border-0 bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs">📦</span>
                </div>
                الاستلام من
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600  text-sm">
                    {order.restaurant?.name?.charAt(0) || "م"}
                  </span>
                </div>
                <div>
                  <p className=" text-gray-900">{order.restaurant?.name || "غير محدد"}</p>
                  <p className="text-sm text-gray-600">{order.restaurant?.address || "غير محدد"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-white/50 p-3 rounded-lg">
                <Phone className="h-4 w-4 text-orange-600" />
                <span className="text-gray-700">{order.restaurant?.phoneNumber || "غير محدد"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-modern border-0 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs">💰</span>
              </div>
              تفاصيل الطلب المالية
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/70 p-4 rounded-lg border border-blue-200">
                  <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    تفاصيل التكلفة
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className=" text-gray-900">{(order.costing?.tax || 0).toFixed(2)} د.ب</span>
                </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">رسوم التوصيل:</span>
                      <span className=" text-gray-900">{(order.costing?.deliveryFee || 0).toFixed(2)} د.ب</span>
                </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">البقشيش:</span>
                      <span className=" text-gray-900">{(order.costing?.tip || 0).toFixed(2)} د.ب</span>
                </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">الخصم:</span>
                      <span className=" text-red-600">-{(order.costing?.discountAmount || 0).toFixed(2)} د.ب</span>
                </div>
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-100 to-green-200 rounded-lg px-4 mt-4">
                      <span className="font-bold text-green-800">الإجمالي:</span>
                      <span className="font-bold text-green-800 text-lg">{(order.costing?.totalCost || 0).toFixed(2)} د.ب</span>
                </div>
              </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
                  <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                    معلومات إضافية
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs">📏</span>
                      </div>
                  <div>
                        <p className="text-sm text-gray-600">المسافة</p>
                        <p className=" text-gray-900">{order.distance?.toFixed(2) || "0"} كم</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">💳</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">طريقة الدفع</p>
                        <p className=" text-gray-900">{order.paymentMethod || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="bg-white/70 p-4 rounded-lg border border-orange-200">
                    <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 bg-orange-500 rounded-full"></span>
                      عناصر الطلب
                    </h4>
                    <div className="space-y-2">
                    {order.orderItems.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                          </div>
                          <span className=" text-orange-600">{item.unitPrice?.toFixed(2) || "0"} د.ب</span>
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-modern border-0 bg-gradient-to-br from-indigo-50 to-cyan-50">
          <CardHeader className="bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-t-lg">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
              <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                <Truck className="h-3 w-3 text-white" />
              </div>
              تفاصيل التوصيل والتتبع
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/70 p-4 rounded-lg border border-indigo-200">
                  <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                    <span className="h-2 w-2 bg-indigo-500 rounded-full"></span>
                    الجدولة الزمنية
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
              </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت وضع الطلب</p>
                        <p className=" text-gray-900">{formatTime(order.activityLog?.placementTime || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 text-xs">📅</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت الاستلام المطلوب</p>
                        <p className=" text-gray-900">{formatTimeOnly(order.activityLog?.expectedPickupTime || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xs">🎯</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت التوصيل المطلوب</p>
                        <p className=" text-gray-900">{formatTimeOnly(order.activityLog?.expectedDeliveryTime || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت قبول الطلب</p>
                        <p className=" text-gray-900">{formatTime(order.activityLog?.assignedTime || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت الاستلام</p>
                        <p className=" text-gray-900">{formatTime(order.activityLog?.pickedUpTime || "")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">وقت التوصيل</p>
                        <p className=" text-gray-900">{formatTime(order.activityLog?.deliveryTime || "")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.assignedCarrier && (
                  <div className="bg-white/70 p-4 rounded-lg border border-cyan-200">
                    <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 bg-cyan-500 rounded-full"></span>
                      معلومات السائق
                    </h4>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                        <span className="text-cyan-600 font-bold text-lg">
                          {order.assignedCarrier.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className=" text-gray-900">{order.assignedCarrier.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-cyan-600" />
                          <span className="text-sm text-gray-600">{order.assignedCarrier.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {order.deliveryInstruction && (
                  <div className="bg-white/70 p-4 rounded-lg border border-amber-200">
                    <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 bg-amber-500 rounded-full"></span>
                      تعليمات التوصيل
                    </h4>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{order.deliveryInstruction}</p>
                    </div>
                  </div>
                )}
                
                {order.trackingLink && (
                  <div className="bg-white/70 p-4 rounded-lg border border-emerald-200">
                    <h4 className=" text-gray-800 mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                      رابط التتبع
                    </h4>
                    <a
                      href={order.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <span className="text-emerald-600 text-sm">🔗</span>
                      <span className="text-emerald-700 font-medium">تتبع الطلب</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}


// دالة للتحقق من صحة بيانات الطلب
function validateOrderData(orderData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!orderData.orderNumber || orderData.orderNumber.trim() === '') {
    errors.push("رقم الطلب مطلوب");
  }

  if (!orderData.customerName || orderData.customerName.trim() === '') {
    errors.push("اسم العميل مطلوب");
  }

  if (!orderData.customerPhoneNumber || orderData.customerPhoneNumber.trim() === '') {
    errors.push("رقم هاتف العميل مطلوب");
  }

  if (!orderData.pickupName || orderData.pickupName.trim() === '') {
    errors.push("اسم المتجر مطلوب");
  }

  if (!orderData.pickupPhoneNumber || orderData.pickupPhoneNumber.trim() === '') {
    errors.push("رقم هاتف المتجر مطلوب");
  }

  if (!orderData.pickupAddress || orderData.pickupAddress.trim() === '') {
    errors.push("عنوان الاستلام مطلوب");
  }

  if (!orderData.deliveryAddress || orderData.deliveryAddress.trim() === '') {
    errors.push("عنوان التوصيل مطلوب");
  }

  if (!orderData.deliveryDate || orderData.deliveryDate.trim() === '') {
    errors.push("تاريخ التوصيل مطلوب");
  }

  if (!orderData.orderValue || orderData.orderValue <= 0) {
    errors.push("قيمة الطلب يجب أن تكون أكبر من صفر");
  }

  if (!orderData.paymentMethod || orderData.paymentMethod.trim() === '') {
    errors.push("طريقة الدفع مطلوبة");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// زر تعيين السائق
function AssignDriverButton({ order, drivers, onAssign }: {
  order: ShipdayOrder;
  drivers: ShipdayDriver[];
  onAssign: (orderId: number, driverId: number) => void;
}) {
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleAssign = async () => {
    if (selectedDriverId) {
      try {
        await onAssign(Number(order.orderId), selectedDriverId);
        setOpen(false); // Close modal after successful assignment
        setSelectedDriverId(null); // Reset selection
      } catch (error) {
        console.error('Error in handleAssign:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0 hover-lift">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-modern-xl">
        <DialogHeader className="bg-[#262626] from-green-600 to-blue-600 -m-6 mb-6 p-6 text-white rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <span>تعيين سائق للطلب</span>
              <div className="text-sm text-green-100 mt-1 text-start">{order.orderNumber}#</div>
            </div>
          </DialogTitle>
          <DialogDescription className="text-green-100 mt-2">
            اختر سائقًا متاحًا لتعيينه لهذا الطلب
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 -mt-2">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
            <Label htmlFor="driver" className="text-sm  text-gray-700 mb-3 block">
              اختر السائق
            </Label>
            <Select
              onValueChange={(value) => {
                setSelectedDriverId(Number(value));
              }}
              value={selectedDriverId ? String(selectedDriverId) : undefined}
            >
              <SelectTrigger className="h-12 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                <SelectValue placeholder="اختر سائقًا من القائمة" />
              </SelectTrigger>
              <SelectContent>
                {drivers.filter(d => d.id && d.name).map((driver) => (
                  <SelectItem key={driver.id} value={String(driver.id)}>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600  text-xs">
                          {driver.name.charAt(0)}
                        </span>
                      </div>
                      <span>{driver.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDriverId && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 ">
                    {drivers.find(d => d.id === selectedDriverId)?.name.charAt(0)}
                  </span>
        </div>
                <div>
                  <p className=" text-gray-900">
                    {drivers.find(d => d.id === selectedDriverId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">سائق متاح</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 rounded-b-lg">
          <Button 
            type="button" 
            onClick={handleAssign} 
            disabled={!selectedDriverId} 
            className="bg-[#ffcc04] hover:bg-[#ffcc04] text-[#262626] hover-lift"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            تعيين السائق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OrdersPage() {
  const [orders, setOrders] = useState<ShipdayOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<ShipdayOrder[]>([])
  const [drivers, setDrivers] = useState<ShipdayDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [useCompleteForm, setUseCompleteForm] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("current")
  const [editingOrder, setEditingOrder] = useState<ShipdayOrder | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<ShipdayOrder | null>(null)
  const [assigningOrder, setAssigningOrder] = useState<ShipdayOrder | null>(null)
  const [carriers, setCarriers] = useState<any[]>([])
  const [loadingCarriers, setLoadingCarriers] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadData()
    loadCarriers()
  }, [])

  const loadCarriers = async () => {
    try {
      setLoadingCarriers(true)
      // Add delay to avoid 429 errors
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const response = await fetch('/api/shipday/carriers')
      if (response.ok) {
        const data = await response.json()
        setCarriers(data)
      }
    } catch (error) {
      console.error('خطأ في جلب السائقين:', error)
    } finally {
      setLoadingCarriers(false)
    }
  }

  const loadData = async () => {
    try {      
      // Add delay to avoid 429 errors
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Use local API routes instead of direct SDK calls
      const [ordersResponse, driversResponse] = await Promise.all([
        fetch('/api/shipday/orders'),
        fetch('/api/shipday/carriers')
      ])
      
      if (!ordersResponse.ok) {
        throw new Error(`Orders API failed: ${ordersResponse.status}`)
      }
      if (!driversResponse.ok) {
        throw new Error(`Drivers API failed: ${driversResponse.status}`)
      }
      
      const [ordersData, driversData] = await Promise.all([
        ordersResponse.json(),
        driversResponse.json()
      ])
      
      setOrders(ordersData)
      setDrivers(driversData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      setMessage({ type: "error", text: "فشل في تحميل البيانات من Shipday API" })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = useCallback(() => {
    let filtered = orders
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.assignedCarrier?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => getStatusOrder(order) === statusFilter)
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((order) => getOrderCategory(order) === categoryFilter)
    }
    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, categoryFilter])

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await loadData()
      setMessage({ type: "success", text: "تم تحديث البيانات من Shipday بنجاح" })
    } catch (error) {
      console.error("[v0] Error syncing data:", error)
      setMessage({ type: "error", text: "فشل في تحديث البيانات" })
    } finally {
      setSyncing(false)
    }
  }

  const handleTestConnection = async () => {
    try {
      const sdk = await getShipdaySDK()
      await sdk.getOrders() // Test connection
      const isConnected = true
      if (isConnected) {
        setMessage({ type: "success", text: "تم الاتصال بـ Shipday بنجاح" })
        toast({
          title: "نجح الاتصال",
          description: "تم الاتصال بـ Shipday API بنجاح",
        })
      } else {
        setMessage({ type: "error", text: "فشل الاتصال بـ Shipday" })
        toast({
          title: "فشل الاتصال",
          description: "فشل الاتصال بـ Shipday API",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error testing connection:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء اختبار الاتصال" })
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء اختبار الاتصال",
        variant: "destructive",
      })
    }
  }

  const handleNewOrder = async (orderData: any) => {
    try {

      setLoading(true);
      setMessage(null);

      // Send order data directly to Shipday API
      const response = await fetch('/api/shipday/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });


      if (response.ok) {
        const result = await response.json();
        
        setMessage({
          type: "success",
          text: "تم إنشاء الطلب بنجاح في Shipday!"
        });
        setShowOrderForm(false);
        
        // Show success toast
        toast({
          title: "تم إنشاء الطلب بنجاح",
          description: `تم إرسال الطلب #${orderData.orderNumber} إلى Shipday`,
        });

        // Refresh orders list
        setTimeout(() => {
          loadData();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("[v0] API error:", errorData);
        setMessage({
          type: "error",
          text: errorData.error || "فشل في إنشاء الطلب"
        });

        // Show error toast
        toast({
          title: "خطأ في إنشاء الطلب",
          description: errorData.error || "فشل في إنشاء الطلب",
          variant: "destructive",
        });
      }


    } catch (error) {
      let errorMessage = "فشل في إرسال الطلب إلى Shipday";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      setMessage({ type: "error", text: errorMessage });

      // Show error toast
      toast({
        title: "خطأ في إنشاء الطلب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }


  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const apiStatus = UI_TO_API_STATUS[newStatus as keyof typeof UI_TO_API_STATUS]
      await updateOrderStatus(parseInt(orderId), newStatus as any)

      setOrders(prev => prev.map(order =>
        order.orderNumber === orderId
          ? {
              ...order,
              orderStatus: {
                ...(order.orderStatus || {}),
                orderState: apiStatus,
              },
            }
          : order
      ))

      setMessage({ type: "success", text: "تم تحديث حالة الطلب بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث حالة الطلب" })
    }
  }

  const handleAssignDriver = async (orderId: number, driverId: number) => {
    try {
      console.log('handleAssignDriver called with:', { orderId, driverId });
      await assignOrderToDriver(orderId, driverId);
      await loadData(); // Reload data to show the assigned driver
      toast({
        title: "تم تعيين السائق",
        description: "تم تعيين السائق للطلب بنجاح.",
      });
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast({
        title: "فشل التعيين",
        description: "فشل في تعيين السائق للطلب.",
        variant: "destructive",
      });
    }
  };

  const handleUnassignDriver = async (orderId: number) => {
    try {
      console.log('handleUnassignDriver called with:', { orderId });
      await unassignOrderFromDriver(orderId);
      await loadData(); // Reload data to show the unassigned order
      toast({
        title: "تم إلغاء تعيين السائق",
        description: "تم إلغاء تعيين السائق من الطلب بنجاح.",
      });
    } catch (error) {
      console.error("Error unassigning driver:", error);
      toast({
        title: "فشل إلغاء التعيين",
        description: "فشل في إلغاء تعيين السائق من الطلب.",
        variant: "destructive",
      });
    }
  };

  const handleSetReadyToPickup = async (orderId: number) => {
    try {
      console.log('handleSetReadyToPickup called with:', { orderId });
      await setOrderReadyToPickup(orderId);
      await loadData(); // Reload data to show the updated order
      toast({
        title: "تم تعيين الطلب جاهز للاستلام",
        description: "تم تعيين الطلب كجاهز للاستلام بنجاح.",
      });
    } catch (error) {
      console.error("Error setting ready to pickup:", error);
      toast({
        title: "فشل تعيين جاهز للاستلام",
        description: "فشل في تعيين الطلب كجاهز للاستلام.",
        variant: "destructive",
      });
    }
  };

  const handleEditOrder = (order: ShipdayOrder) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = (order: ShipdayOrder) => {
    setDeletingOrder(order);
  };

  const confirmDeleteOrder = async () => {
    if (!deletingOrder) return;

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`/api/shipday/orders/${deletingOrder.orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "تم حذف الطلب بنجاح من Shipday!"
        });
        
        toast({
          title: "تم حذف الطلب بنجاح",
          description: `تم حذف الطلب #${deletingOrder.orderNumber} من Shipday`,
        });

        setDeletingOrder(null);
        setTimeout(() => {
          loadData();
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "فشل في حذف الطلب"
        });

        toast({
          title: "خطأ في حذف الطلب",
          description: errorData.error || "فشل في حذف الطلب",
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "فشل في حذف الطلب من Shipday";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      setMessage({ type: "error", text: errorMessage });
      toast({
        title: "خطأ في حذف الطلب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssignOrder = (order: ShipdayOrder) => {
    setAssigningOrder(order);
  };

  const handleAssignOrder = async (carrierId: string) => {
    if (!assigningOrder) return;
    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`/api/shipday/orders/${assigningOrder.orderId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carrierId }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "تم تعيين الطلب للسائق بنجاح!"
        });
        
        toast({
          title: "تم تعيين الطلب بنجاح",
          description: `تم تعيين الطلب #${assigningOrder.orderNumber} للسائق`,
        });

        setAssigningOrder(null);

        setTimeout(() => {
          loadData();
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "فشل في تعيين الطلب"
        });

        toast({
          title: "خطأ في تعيين الطلب",
          description: errorData.error || "فشل في تعيين الطلب",
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "فشل في تعيين الطلب للسائق";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      setMessage({ type: "error", text: errorMessage });
      toast({
        title: "خطأ في تعيين الطلب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderData: any) => {
    if (!editingOrder) return;
    
    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(`/api/shipday/orders/${editingOrder.orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          type: "success",
          text: "تم تحديث الطلب بنجاح في Shipday!"
        });
        setEditingOrder(null);
        
      toast({
          title: "تم تحديث الطلب بنجاح",
          description: `تم تحديث الطلب #${orderData.orderNumber} في Shipday`,
        });

        setTimeout(() => {
          loadData();
        }, 1000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.error || "فشل في تحديث الطلب"
        });

        toast({
          title: "خطأ في تحديث الطلب",
          description: errorData.error || "فشل في تحديث الطلب",
          variant: "destructive",
        });
      }
    } catch (error) {
      let errorMessage = "فشل في تحديث الطلب في Shipday";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }

      setMessage({ type: "error", text: errorMessage });
      toast({
        title: "خطأ في تحديث الطلب",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading title="جاري تحميل الطلبات..."/>
    )
  }

  if (showOrderForm) {
    return useCompleteForm && 
      <OrderForm onSubmit={handleNewOrder} onCancel={() => setShowOrderForm(false)} loading={loading} isEdit={false} /> 
  }

  if (editingOrder) {
    return (
      <OrderForm 
        onSubmit={handleUpdateOrder} 
        onCancel={() => setEditingOrder(null)} 
        loading={loading}
        initialData={editingOrder}
        isEdit={true}
      />
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
            <h1 className="text-2xl font-bold mb-2">إدارة الطلبات</h1>
            <p>تتبع وإدارة جميع طلبات التوصيل</p>
        </div>
          <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setUseCompleteForm(true);
              setShowOrderForm(true);
            }}
              className="bg-white/10 hover:bg-white/20 text-[#272626] border-white/30 hover-lift"
          >
              <Plus className="h-4 w-4 mr-2" />
            طلب جديد
          </Button>
          <Button
            onClick={handleSync}
            disabled={syncing}
            variant="outline"
              className="bg-white/10 hover:bg-white/20 text-[#272626] border-white/30 hover-lift"
          >
            {syncing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
            )}
            تحديث
          </Button>
          </div>
        </div>
      </div>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-11 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">غير معين</SelectItem>
            <SelectItem value="assigned">تم التعيين</SelectItem>
            <SelectItem value="picked_up">تم الاستلام</SelectItem>
            <SelectItem value="in_transit">في الطريق</SelectItem>
            <SelectItem value="delivered">تم التوصيل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>
        </CardContent>
      </Card>

      {/* تصنيف الطلبات حسب الحالة */}
      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              <TabsTrigger value="current" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>حالي</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>مجدول</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>مكتمل</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="incomplete" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>غير مكتمل</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>تاريخ</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            قائمة الطلبات ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
        <div className="overflow-x-auto">
            <Table className="w-full">
            <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className=" text-gray-700 px-4 py-3">رقم الطلب</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">العميل</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">المستلم</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">السائق</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">الحالة</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">المبلغ</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">الوقت</TableHead>
                  <TableHead className=" text-gray-700 px-4 py-3">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order, index) => {
                  const status = getStatusOrder(order)
                  const StatusIcon = statusIcons[status]
                  return (
                    <TableRow key={`${order.orderNumber}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className=" px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-blue-600">#{order.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer?.name || "غير محدد"}</p>
                          <p className="text-sm text-gray-500">{order.customer?.phoneNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{order.restaurant?.name || "غير محدد"}</p>
                          <p className="text-sm text-gray-500">{order.restaurant?.phoneNumber || ""}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {order.assignedCarrier ? (
                          <div>
                            <p className="font-medium text-gray-900">{order.assignedCarrier.name}</p>
                            <p className="text-sm text-gray-500">{order.assignedCarrier.phoneNumber}</p>
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleUnassignDriver(order.orderId)}
                              >
                                إلغاء التعيين
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-gray-500">غير معين</span>
                            {getStatusOrder(order) === "pending" && (
                              <div className="mt-2">
                                <AssignDriverButton
                                  order={order}
                                  drivers={drivers}
                                  onAssign={handleAssignDriver}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge 
                          className={`${statusColors[status]} flex items-center gap-1 w-fit`}
                          variant="secondary"
                        >
                          <StatusIcon className="h-3 w-3" />
                            {statusLabels[status]}
                          </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className=" text-green-600">
                          {(order.costing?.totalCost || 0).toFixed(2)} د.ب
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                        {order.activityLog?.placementTime
                          ? new Date(order.activityLog.placementTime).toLocaleString("en")
                          : "غير محدد"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0 hover-lift">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <OrderDetailsModal order={order} />
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover-lift"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover-lift text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleStartAssignOrder(order)}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover-lift text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleSetReadyToPickup(order.orderId)}
                            title="جاهز للاستلام"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover-lift text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Select
                            value={status}
                            onValueChange={(newStatus) => handleStatusChange(order.orderNumber, newStatus)}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gray-400" />
            </div>
              <h3 className="text-lg  text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-500 mb-4">لم يتم العثور على أي طلبات تطابق معايير البحث</p>
              <Button onClick={() => setShowOrderForm(true)} className="hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                إضافة طلب جديد
              </Button>
        </div>
          )}
        </CardContent>
      </Card>

      {/* Modal تأكيد الحذف */}
      <Dialog open={!!deletingOrder} onOpenChange={() => setDeletingOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              تأكيد حذف الطلب
            </DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          
          {deletingOrder && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">رقم الطلب: #{deletingOrder.orderNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>العميل: {deletingOrder.customer?.name || "غير محدد"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-orange-600" />
                  <span>المطعم: {deletingOrder.restaurant?.name || "غير محدد"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span>المبلغ: ${deletingOrder.costing?.totalCost || 0}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingOrder(null)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteOrder}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف الطلب
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal تعيين السائق */}
      <Dialog open={!!assigningOrder} onOpenChange={() => setAssigningOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Truck className="h-5 w-5" />
              تعيين الطلب للسائق
            </DialogTitle>
            <DialogDescription>
              اختر السائق الذي تريد تعيين الطلب له.
            </DialogDescription>
          </DialogHeader>
          
          {assigningOrder && (
            <div className="py-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">رقم الطلب: #{assigningOrder.orderNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span>العميل: {assigningOrder.customer?.name || "غير محدد"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-orange-600" />
                  <span>المطعم: {assigningOrder.restaurant?.name || "غير محدد"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>اختر السائق</Label>
                <Select onValueChange={handleAssignOrder} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر سائق..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCarriers ? (
                      <SelectItem value="" disabled>
                        جاري تحميل السائقين...
                      </SelectItem>
                    ) : carriers.length === 0 ? (
                      <SelectItem value="" disabled>
                        لا توجد سائقين متاحين
                      </SelectItem>
                    ) : (
                      carriers.map((carrier) => (
                        <SelectItem key={carrier.id} value={carrier.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <span>{carrier.name}</span>
                            <span className="text-sm text-gray-500">({carrier.phoneNumber})</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAssigningOrder(null)}
              disabled={loading}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}