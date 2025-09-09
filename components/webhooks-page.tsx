"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/useTranslation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  getWebhookConfigs,
  addWebhookConfig,
  updateWebhookConfig,
  deleteWebhookConfig,
  simulateShipdayWebhook,
  type WebhookConfig,
} from "@/lib/webhooks"
import {
  Plus,
  Trash2,
  Edit,
  TestTube,
  Webhook,
  AlertCircle,
  CheckCircle,
  Settings,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function WebhooksPage() {
  const { t } = useTranslation()
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    secret: "",
    events: ["order_status_update", "driver_assigned", "order_delivered"],
  })

  useEffect(() => {
    loadWebhooks()
  }, [])

  const loadWebhooks = () => {
    const configs = getWebhookConfigs()
    setWebhooks(configs)
  }

  const handleAddWebhook = () => {
    if (!newWebhook.url) {
      toast({
        title: t('common.error'),
        description: "يرجى إدخال رابط Webhook",
        variant: "destructive",
      })
      return
    }

    try {
      addWebhookConfig(newWebhook)
      toast({
        title: "تم إضافة Webhook بنجاح",
        description: "تم إضافة رابط Webhook الجديد",
      })
      setNewWebhook({ url: "", secret: "", events: [] })
      setShowAddDialog(false)
      loadWebhooks()
    } catch (error) {
      toast({
        title: "خطأ في إضافة Webhook",
        description: "فشل في إضافة رابط Webhook",
        variant: "destructive",
      })
    }
  }

  const handleUpdateWebhook = (index: number, updates: Partial<WebhookConfig>) => {
    try {
      updateWebhookConfig(index, updates)
      toast({
        title: "تم تحديث Webhook",
        description: "تم تحديث إعدادات Webhook بنجاح",
      })
      loadWebhooks()
    } catch (error) {
      toast({
        title: "خطأ في تحديث Webhook",
        description: "فشل في تحديث إعدادات Webhook",
        variant: "destructive",
      })
    }
  }

  const handleDeleteWebhook = (index: number) => {
    try {
      deleteWebhookConfig(index)
      toast({
        title: "تم حذف Webhook",
        description: "تم حذف رابط Webhook بنجاح",
      })
      loadWebhooks()
    } catch (error) {
      toast({
        title: "خطأ في حذف Webhook",
        description: "فشل في حذف رابط Webhook",
        variant: "destructive",
      })
    }
  }

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      await simulateShipdayWebhook("TEST-001", "ORDER_DELIVERED")
      toast({
        title: "تم إرسال اختبار Webhook",
        description: "تم إرسال طلب اختبار إلى Webhook",
      })
    } catch (error) {
      toast({
        title: "خطأ في اختبار Webhook",
        description: "فشل في إرسال طلب اختبار",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white shadow-modern-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">إدارة Webhooks</h1>
            <p className="text-gray-100">إدارة روابط Webhook لتحديثات الحالة من Shipday</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold">{webhooks.length}</div>
              <div className="text-sm text-gray-200">إجمالي Webhooks</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Webhook className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة Webhook جديد</DialogTitle>
              <DialogDescription>
                إضافة رابط Webhook جديد لتلقي تحديثات من Shipday
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">رابط Webhook</Label>
                <Input
                  id="url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://your-app.com/api/webhooks/shipday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">مفتاح الأمان (اختياري)</Label>
                <Input
                  id="secret"
                  type="password"
                  value={newWebhook.secret}
                  onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                  placeholder="مفتاح الأمان"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAddWebhook}>
                إضافة Webhook
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            لا يوجد Webhooks مُعدة. أضف رابط Webhook لتلقي تحديثات من Shipday.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {webhooks.map((webhook, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    <CardTitle className="text-lg">Webhook #{index + 1}</CardTitle>
                    <Badge variant={webhook.enabled ? "default" : "secondary"}>
                      {webhook.enabled ? t('webhooks.enabled') : t('webhooks.disabled')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestWebhook(webhook)}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWebhook(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{webhook.url}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`enabled-${index}`}>تفعيل Webhook</Label>
                  <Switch
                    id={`enabled-${index}`}
                    checked={webhook.enabled}
                    onCheckedChange={(enabled) => handleUpdateWebhook(index, { enabled })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الأحداث المُراقبة:</Label>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                {webhook.secret && (
                  <div className="text-sm text-gray-500">
                    مفتاح الأمان: ••••••••
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            معلومات Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600">
            <strong>ما هي Webhooks؟</strong>
            <p className="mt-1">
              Webhooks هي روابط تسمح لـ Shipday بإرسال تحديثات فورية عن حالة الطلبات إلى نظامك.
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <strong>الأحداث المدعومة:</strong>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>order_status_update - تحديث حالة الطلب</li>
              <li>driver_assigned - تعيين سائق للطلب</li>
              <li>order_delivered - تسليم الطلب</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
