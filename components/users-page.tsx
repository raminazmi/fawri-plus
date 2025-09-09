"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/lib/useTranslation"
import { hasPermission } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Pencil, Trash2, Loader2, Info, ArrowRight } from "lucide-react"
import { UserData } from "@/lib/users"
import { addUser, updateUser, deleteUser, getUsers } from "@/lib/users"
import { cn } from "@/lib/utils"

const UserForm = ({ formData, setFormData, handleSubmit, loading, selectedUser, error, onCancel }: {
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  selectedUser: UserData | null;
  error: string | null;
  onCancel: () => void;
}) => (
  <div className="max-w-md mx-auto">
    <div className="mb-4">
      <Button
        variant="outline"
        onClick={onCancel}
        className="flex items-center gap-2 hover-lift"
      >
        <ArrowRight className="h-4 w-4" />
        العودة إلى المستخدمين
      </Button>
    </div>
    
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
        </CardTitle>
        <CardDescription>
          {selectedUser ? "قم بتعديل بيانات المستخدم" : "أضف مستخدم جديد للنظام"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="username" className="text-gray-700 font-medium">اسم المستخدم</Label>
      <Input
        id="username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
        disabled={loading}
        className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 rounded-md"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-700 font-medium">البريد الإلكتروني</Label>
      <Input
        id="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        disabled={loading}
        className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 rounded-md"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="password" className="text-gray-700 font-medium">
        كلمة المرور 
        {selectedUser ? " (اتركها فارغة للاحتفاظ بكلمة المرور الحالية)" : " *"}
      </Label>
      <Input
        id="password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={!selectedUser}
        disabled={loading}
        placeholder={selectedUser ? "اتركها فارغة للاحتفاظ بكلمة المرور الحالية" : "أدخل كلمة مرور قوية"}
        className="bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 rounded-md"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="role" className="text-gray-700 font-medium">الدور</Label>
      <Select
        value={formData.role}
        onValueChange={(value: "admin" | "manager") => setFormData({ ...formData, role: value })}
        disabled={loading}
      >
        <SelectTrigger className="w-full bg-gray-50 border-gray-300 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200 ease-in-out hover:border-indigo-400 rounded-md">
          <SelectValue placeholder="اختر الدور" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">مدير</SelectItem>
          <SelectItem value="manager">مشرف</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button 
      type="submit" 
      disabled={loading}
      className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 ease-in-out py-2.5 text-lg font-semibold rounded-md shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {selectedUser ? "تحديث المستخدم" : "إضافة مستخدم"}
    </Button>
  </form>
      </CardContent>
    </Card>
  </div>
);


export function UsersPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "manager" as "admin" | "manager"
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError("فشل في تحميل المستخدمين")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (selectedUser) {
        const updateData = formData.password 
          ? formData 
          : { username: formData.username, email: formData.email, role: formData.role }
        await updateUser(selectedUser.id, updateData)
      } else {
        if (!formData.password) {
          setError("كلمة المرور مطلوبة للمستخدمين الجدد")
          return
        }
        await addUser(formData)
      }
      loadUsers()
      setIsAddUserDialogOpen(false)
      setIsEditUserDialogOpen(false)
      setFormData({ username: "", email: "", password: "", role: "manager" })
      setSelectedUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserData) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role
    })
    setIsEditUserDialogOpen(true)
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true)
      await deleteUser(userToDelete)
      loadUsers()
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (err) {
      setError("فشل في حذف المستخدم")
    } finally {
      setLoading(false)
    }
  }
  
  if (!hasPermission(user, "admin_access")) {
    return (
      <Alert className="bg-red-50 text-red-700 border-red-200 rounded-md">
        <AlertDescription className="flex items-center">
          <span className="mr-2 text-lg">⚠️</span> ليس لديك صلاحية الوصول إلى هذه الصفحة
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="p-4 py-10 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen-minus-header">
      <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative">
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-extrabold tracking-tight">إدارة المستخدمين</CardTitle>
            <CardDescription className="text-indigo-200 mt-1 text-base">
              عرض وإدارة جميع المستخدمين
            </CardDescription>
          </div>
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#59c5c7] text-[#272626] font-semibold hover:bg-[#47a6a7] transition-colors rounded-md shadow-md hover:shadow-lg">
                <UserPlus className="mr-2 h-4 w-4" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                <DialogDescription>
                  أدخل معلومات المستخدم الجديد
                </DialogDescription>
              </DialogHeader>
              {error && (
                <Alert className="bg-red-50 text-red-700 border-red-200 rounded-md">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <UserForm 
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                selectedUser={selectedUser}
                error={error}
                onCancel={() => setIsAddUserDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          {loading && users.length === 0 ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : users.length === 0 ? (
            <Alert className="bg-blue-50 text-blue-700 border-blue-200 rounded-md flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <AlertDescription>لا يوجد مستخدمون حاليًا.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">اسم المستخدم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                    <TableHead className="text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-right">{user.username}</TableCell>
                      <TableCell className="text-gray-600 text-right">{user.email}</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          user.role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-purple-100 text-purple-700"
                        )}>
                          {user.role === "admin" ? t('users.admin') : t('users.manager')}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-right">{new Date(user.createdAt).toLocaleDateString("ar", { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                      <TableCell className="text-center space-x-2 space-x-reverse">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(user.id)}
                          className="hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>
              قم بتعديل معلومات المستخدم.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert className="bg-red-50 text-red-700 border-red-200 rounded-md">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <UserForm 
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            selectedUser={selectedUser}
            error={error}
            onCancel={() => setIsEditUserDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-gray-600 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .min-h-screen-minus-header {
          min-height: calc(100vh);
        }
      `}</style>
    </div>
  )
}
