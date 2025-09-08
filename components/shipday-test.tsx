"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import { getShipdaySDK, fetchOrders, fetchDrivers } from "@/lib/shipday-api-functions"

export function ShipdayTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [ordersCount, setOrdersCount] = useState<number | null>(null)
  const [driversCount, setDriversCount] = useState<number | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("idle")
    setErrorMessage("")
    setOrdersCount(null)
    setDriversCount(null)

    try {
      // Test connection using API route
      const response = await fetch('/api/shipday/test')
      const result = await response.json()
      
      if (result.success) {
        setConnectionStatus("success")
        setOrdersCount(result.ordersCount || 0)
        
        // Fetch drivers count
        try {
          const driversResponse = await fetch('/api/shipday/carriers')
          if (driversResponse.ok) {
            const drivers = await driversResponse.json()
            setDriversCount(drivers.length)
          }
        } catch (driversError) {
          console.warn("Could not fetch drivers count:", driversError)
        }
      } else {
        setConnectionStatus("error")
        setErrorMessage(result.message || result.error || "فشل في الاتصال بـ Shipday API")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage("فشل في الاتصال بـ Shipday API")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          اختبار اتصال Shipday API
        </CardTitle>
        <CardDescription>
          تحقق من اتصال النظام مع Shipday API وجمع البيانات الأساسية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? "جاري الاختبار..." : "اختبار الاتصال"}
          </Button>
          
          {connectionStatus !== "idle" && (
            <Badge 
              variant={connectionStatus === "success" ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {connectionStatus === "success" ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {connectionStatus === "success" ? "متصل" : "غير متصل"}
            </Badge>
          )}
        </div>

        {connectionStatus === "success" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">الطلبات</div>
              <div className="text-2xl font-bold text-green-700">
                {ordersCount !== null ? ordersCount : "جاري التحميل..."}
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">السائقين</div>
              <div className="text-2xl font-bold text-blue-700">
                {driversCount !== null ? driversCount : "جاري التحميل..."}
              </div>
            </div>
          </div>
        )}

        {connectionStatus === "error" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || "فشل في الاتصال بـ Shipday API"}
              <br />
              <span className="text-sm text-gray-600 mt-2 block">
                تحقق من صحة API Key وإعدادات الاتصال.
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div>• API Key: HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa</div>
          <div>• Base URL: https://api.shipday.com</div>
          <div>• Authentication: Basic Auth</div>
        </div>
      </CardContent>
    </Card>
  )
}
