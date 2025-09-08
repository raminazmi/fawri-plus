"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { hasPermission } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { HubForm } from "@/components/hub-form"
import { ShipdayTest } from "@/components/shipday-test"
import { WebhooksPage } from "@/components/webhooks-page"
import {
  getHubs,
  getSettings,
  updateSettings,
  createHub,
  updateHub,
  deleteHub,
  type HubLocation,
  type AppSettings,
} from "@/lib/settings"
import { MapPin, Phone, Edit, Trash2, Plus, Save, AlertCircle, Building2, Settings } from "lucide-react"
import Loading from "@/components/loading"

export function SettingsPage() {
  const { user } = useAuth()
  const [hubs, setHubs] = useState<HubLocation[]>([])
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showHubForm, setShowHubForm] = useState(false)
  const [editingHub, setEditingHub] = useState<HubLocation | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const canManageSettings = hasPermission(user, "admin_access")
  const canDeleteHubs = hasPermission(user, "delete")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [hubsData, settingsData] = await Promise.all([getHubs(), getSettings()])
      setHubs(hubsData)
      setSettings(settingsData)
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحميل البيانات" })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await updateSettings(settings)
      setMessage({ type: "success", text: "تم حفظ الإعدادات بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في حفظ الإعدادات" })
    } finally {
      setSaving(false)
    }
  }

  const handleCreateHub = async (hubData: Omit<HubLocation, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newHub = await createHub(hubData)
      setHubs((prev) => [...prev, newHub])
      setShowHubForm(false)
      setMessage({ type: "success", text: "تم إضافة المركز بنجاح" })
    } catch (error) {
      setMessage({ type: "error", text: "فشل في إضافة المركز" })
    }
  }

  const handleUpdateHub = async (hubData: Omit<HubLocation, "id" | "createdAt" | "updatedAt">) => {
    if (!editingHub) return

    try {
      const updatedHub = await updateHub(editingHub.id, hubData)
      if (updatedHub) {
        setHubs((prev) => prev.map((hub) => (hub.id === editingHub.id ? updatedHub : hub)))
        setEditingHub(null)
        setMessage({ type: "success", text: "تم تحديث المركز بنجاح" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "فشل في تحديث المركز" })
    }
  }

  const handleDeleteHub = async (hubId: string) => {
    if (!canDeleteHubs) return

    if (confirm("هل أنت متأكد من حذف هذا المركز؟")) {
      try {
        await deleteHub(hubId)
        setHubs((prev) => prev.filter((hub) => hub.id !== hubId))
        setMessage({ type: "success", text: "تم حذف المركز بنجاح" })
      } catch (error) {
        setMessage({ type: "error", text: "فشل في حذف المركز" })
      }
    }
  }

  if (loading) {
    return (
      <Loading title="جاري تحميل الاعدادت ..." />
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

      {/* Header */}
      <div className="bg-gradient-to-r from-[#ffcc04] to-[#ffcc04] rounded-2xl p-6 text-white shadow-modern-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">إعدادات النظام</h1>
            <p className="text-gray-100">إدارة إعدادات التطبيق ومراكز الاستلام والتسليم</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="hubs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-modern">
          <TabsTrigger value="hubs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            إدارة المراكز
          </TabsTrigger>
          {canManageSettings && (
            <TabsTrigger value="general" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              الإعدادات العامة
            </TabsTrigger>
          )}
          {canManageSettings && (
            <TabsTrigger value="shipday" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              اختبار Shipday
            </TabsTrigger>
          )}
          {canManageSettings && (
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Webhooks
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="hubs" className="space-y-4">
          <div className="flex justify-between items-center">
            <Button onClick={() => setShowHubForm(true)} className="hover-lift">
              <Plus className="mr-2 h-4 w-4" />
              إضافة مركز
            </Button>
            <div>
              <h2 className="text-2xl font-bold">إدارة المراكز</h2>
              <p className="text-muted-foreground">إدارة مواقع المراكز والمستودعات</p>
            </div>

          </div>

          {showHubForm && <HubForm onSubmit={handleCreateHub} onCancel={() => setShowHubForm(false)} />}

          {editingHub && <HubForm hub={editingHub} onSubmit={handleUpdateHub} onCancel={() => setEditingHub(null)} />}

          <div className="grid gap-4 md:grid-cols-2">
            {hubs.map((hub) => (
              <Card key={hub.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {hub.name}
                        {hub.isDefault && <Badge variant="secondary">افتراضي</Badge>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4" />
                        {hub.phone}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingHub(hub)} className="hover-lift">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {canDeleteHubs && !hub.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleDeleteHub(hub.id)} className="hover-lift">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{hub.address}</p>
                        <p className="text-xs text-muted-foreground">{hub.location.address}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      الإحداثيات: {hub.location.lat}, {hub.location.lng}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {canManageSettings && (
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات Shipday API</CardTitle>
                <CardDescription>إعدادات الاتصال مع Shipday</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">مفتاح API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={settings?.shipdayApiKey || ""}
                    onChange={(e) => setSettings((prev) => (prev ? { ...prev, shipdayApiKey: e.target.value } : null))}
                    placeholder="أدخل مفتاح Shipday API"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>إعدادات النظام العامة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Input
                    id="timezone"
                    value={settings?.timezone || ""}
                    onChange={(e) => setSettings((prev) => (prev ? { ...prev, timezone: e.target.value } : null))}
                    placeholder="Asia/Bahrain"
                  />
                </div>

                <div className="space-y-4">
                  <Label>إعدادات الإشعارات</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">إشعارات البريد الإلكتروني</Label>
                      <Switch
                        id="email-notifications"
                        checked={settings?.notifications.email || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, email: checked },
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">إشعارات الرسائل النصية</Label>
                      <Switch
                        id="sms-notifications"
                        checked={settings?.notifications.sms || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, sms: checked },
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">الإشعارات الفورية</Label>
                      <Switch
                        id="push-notifications"
                        checked={settings?.notifications.push || false}
                        onCheckedChange={(checked) =>
                          setSettings((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  notifications: { ...prev.notifications, push: checked },
                                }
                              : null,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saving} className="hover-lift">
                {saving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        )}

        {canManageSettings && (
          <TabsContent value="shipday" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">اختبار اتصال Shipday API</h2>
                <p className="text-muted-foreground">تحقق من اتصال النظام مع Shipday API</p>
              </div>
              <ShipdayTest />
            </div>
          </TabsContent>
        )}

        {canManageSettings && (
          <TabsContent value="webhooks" className="space-y-4">
            <WebhooksPage />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
