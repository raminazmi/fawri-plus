"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createOrderNew } from "@/lib/shipday-api-functions"
import { createOrderWithProvidedData, formatOrderForShipday } from "@/lib/order-formats"
import { Package, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function TestOrderCreation() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; data?: any } | null>(null)

  const handleCreateTestOrder = async () => {
    try {
      setLoading(true)
      setResult(null)

      // Get the test order data
      const orderData = createOrderWithProvidedData()
      
      // Format it for Shipday API
      const formattedOrder = formatOrderForShipday(orderData)
      
      console.log("Creating order with data:", formattedOrder)
      
      // Send to Shipday API
      const response = await createOrderNew(formattedOrder)
      
      setResult({
        type: "success",
        message: "تم إنشاء الطلب بنجاح!",
        data: response
      })
      
    } catch (error) {
      console.error("Error creating order:", error)
      setResult({
        type: "error",
        message: `فشل في إنشاء الطلب: ${error instanceof Error ? error.message : String(error)}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            اختبار إنشاء طلب
          </CardTitle>
          <CardDescription>
            اختبار إضافة طلب جديد باستخدام البيانات المحددة من Shipday API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">بيانات الطلب التجريبية:</h4>
            <div className="text-sm space-y-1">
              <p><strong>رقم الطلب:</strong> 99qT5A</p>
              <p><strong>العميل:</strong> Mr. Jhon Mason</p>
              <p><strong>المطعم:</strong> Popeyes Louisiana Kitchen</p>
              <p><strong>التكلفة الإجمالية:</strong> $13.47</p>
              <p><strong>طريقة الدفع:</strong> credit_card (visa)</p>
            </div>
          </div>

          <Button 
            onClick={handleCreateTestOrder}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري إنشاء الطلب...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                إنشاء طلب تجريبي
              </>
            )}
          </Button>

          {result && (
            <Alert className={result.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
              {result.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription className={result.type === "error" ? "text-red-700" : "text-green-700"}>
                {result.message}
                {result.data && (
                  <div className="mt-2 p-2 bg-white rounded border text-xs">
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
