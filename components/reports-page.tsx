"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRangePicker } from "@/components/date-range-picker"
import { DateRange } from "react-day-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download } from "lucide-react"
import { getReports, ReportData } from "@/lib/reports"

export function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [status, setStatus] = useState<string>("all")

  const loadReports = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getReports({
        from: dateRange?.from,
        to: dateRange?.to,
        status: status === "all" ? undefined : status
      })
      setReports(data)
    } catch (err) {
      setError("فشل في تحميل التقارير")
    } finally {
      setLoading(false)
    }
  }, [dateRange, status])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const handleExport = () => {
    const csvContent = [
      ["رقم الطلب", "العميل", "العنوان", "الحالة", "التاريخ", "المبلغ"].join(","),
      ...reports.map(report => [
        report.orderId,
        report.customerName,
        report.address,
        report.status,
        new Date(report.date).toLocaleDateString("ar"),
        report.amount.toFixed(2)
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `تقرير_${new Date().toLocaleDateString("ar")}.csv`
    link.click()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <Alert className="border-red-500 bg-red-50 shadow-modern">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-modern-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">التقارير والإحصائيات</h1>
            <p className="text-indigo-100">تحليل شامل لأداء النظام والعمليات</p>
          </div>
          <Button
            onClick={handleExport}
            disabled={loading || !reports.length}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover-lift"
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            تصفية التقارير
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="اختر نطاق التاريخ"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full !h-11 bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-modern border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              لا توجد تقارير متاحة
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.orderId}</TableCell>
                    <TableCell>{report.customerName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{report.address}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            report.status === "completed"
                              ? "bg-green-500"
                              : report.status === "in_progress"
                              ? "bg-blue-500"
                              : report.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        {report.status === "completed"
                          ? "مكتمل"
                          : report.status === "in_progress"
                          ? "قيد التنفيذ"
                          : report.status === "cancelled"
                          ? "ملغي"
                          : "قيد الانتظار"}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString("ar")}</TableCell>
                    <TableCell className="text-right">
                      {report.amount.toFixed(2)} ريال
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}