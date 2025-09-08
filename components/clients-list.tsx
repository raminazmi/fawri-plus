"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Plus, Search, Edit, Trash2, Building2 } from "lucide-react"
import { Client, CreateClientRequest, UpdateClientRequest } from "@/lib/types"
import { fetchClients, createClient, updateClient, deleteClient } from "@/lib/client-api-functions"
import { ClientForm } from "@/components/client-form"
import Loading from "@/components/loading"

Loading
export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [addingClient, setAddingClient] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Load clients on component mount
  useEffect(() => {
    loadClients()
  }, [])

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredClients(filtered)
    }
  }, [clients, searchTerm])

  const loadClients = async () => {
    try {
      setLoading(true)
      const clientsData = await fetchClients()
      setClients(clientsData)
      setFilteredClients(clientsData)
    } catch (error) {
      console.error("Error loading clients:", error)
      setMessage({ type: "error", text: "فشل في تحميل العملاء" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async (clientData: CreateClientRequest | UpdateClientRequest) => {
    try {
      setAddingClient(true)
      setMessage(null)
      await createClient(clientData as CreateClientRequest)
      setMessage({ type: "success", text: "تم إضافة العميل بنجاح!" })
      setShowAddDialog(false)
      await loadClients() // Refresh clients list
    } catch (error) {
      console.error("Error adding client:", error)
      setMessage({ type: "error", text: "فشل في إضافة العميل" })
    } finally {
      setAddingClient(false)
    }
  }

  const handleEditClient = async (clientData: UpdateClientRequest) => {
    if (!editingClient) return
    
    try {
      setAddingClient(true)
      setMessage(null)
      await updateClient(editingClient.id, clientData)
      setMessage({ type: "success", text: "تم تحديث العميل بنجاح!" })
      setShowEditDialog(false)
      setEditingClient(null)
      await loadClients() // Refresh clients list
    } catch (error) {
      console.error("Error updating client:", error)
      setMessage({ type: "error", text: "فشل في تحديث العميل" })
    } finally {
      setAddingClient(false)
    }
  }

  const handleDeleteClient = async (client: Client) => {
    if (!confirm(`هل أنت متأكد من حذف العميل "${client.name}"؟`)) {
      return
    }

    try {
      setMessage(null)
      await deleteClient(client.id)
      setMessage({ type: "success", text: "تم حذف العميل بنجاح!" })
      await loadClients() // Refresh clients list
    } catch (error) {
      console.error("Error deleting client:", error)
      setMessage({ type: "error", text: "فشل في حذف العميل" })
    }
  }

  const openEditDialog = (client: Client) => {
    setEditingClient(client)
    setShowEditDialog(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading title="جاري تحميل العملاء..." />
        <span className="mr-2">جاري تحميل العملاء...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
          <p className="text-gray-600">إدارة بيانات العملاء في النظام</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
            </DialogHeader>
            <ClientForm
              onSubmit={handleAddClient}
              onCancel={() => setShowAddDialog(false)}
              loading={addingClient}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Message */}
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث في العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث بالاسم، البريد الإلكتروني، رقم الهاتف، أو اسم الشركة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            قائمة العملاء ({filteredClients.length})
          </CardTitle>
          <CardDescription>
            عرض وإدارة جميع العملاء المسجلين في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد عملاء</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>رقم الهاتف</TableHead>
                    <TableHead>الشركة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        {client.company_name ? (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <Building2 className="h-3 w-3" />
                            {client.company_name}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(client.created_at).toLocaleDateString('en')}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(client)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل العميل</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              client={editingClient}
              onSubmit={handleEditClient}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingClient(null)
              }}
              loading={addingClient}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
