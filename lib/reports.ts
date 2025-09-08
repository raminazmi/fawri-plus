export interface ReportData {
  id: string
  orderId: string
  customerName: string
  address: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  date: string
  amount: number
}

interface GetReportsParams {
  from?: Date
  to?: Date
  status?: string
}

export async function getReports(params?: GetReportsParams): Promise<ReportData[]> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.from) queryParams.append("from", params.from.toISOString())
    if (params?.to) queryParams.append("to", params.to.toISOString())
    if (params?.status) queryParams.append("status", params.status)
    return []
  } catch (error) {
    throw new Error("فشل في جلب التقارير")
  }
}