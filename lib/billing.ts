export type TransactionType = "subscription" | "order_fee" | "additional_service" | "cash_deduction" | "payment"
export type PaymentMethod = "cash" | "bank_transfer" | "check" | "credit_card" | "other"

export interface BillingTransaction {
  id: string
  customerId: string
  customerName: string
  type: TransactionType
  amount: number // Positive for charges, negative for credits/payments
  description: string
  referenceId?: string // Order ID, Subscription ID, etc.
  date: string
  createdAt: Date
}

export interface Payment {
  id: string
  customerId: string
  customerName: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string
  notes?: string
  invoiceId?: string
  createdAt: Date
}

export interface Invoice {
  id: string
  customerId: string
  customerName: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  periodStart: string
  periodEnd: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"

  // Amounts
  subscriptionAmount: number
  orderFeesAmount: number
  additionalServicesAmount: number
  cashDeductionAmount: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number

  // Settings
  separateCashAccounting: boolean

  transactions: BillingTransaction[]
  payments: Payment[]

  createdAt: Date
  updatedAt: Date
}

export interface CustomerBillingSettings {
  customerId: string
  customerName: string
  separateCashAccounting: boolean
  defaultPaymentTerms: number // Days
  taxRate: number // Percentage
  billingEmail: string
  billingAddress?: string
  autoGenerateInvoices: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BillingSummary {
  customerId: string
  customerName: string
  totalOutstanding: number
  totalOverdue: number
  currentMonthRevenue: number
  lastPaymentDate?: string
  lastPaymentAmount?: number
  activeInvoices: number
  overdueInvoices: number
}

// Mock data
const mockTransactions: BillingTransaction[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    type: "subscription",
    amount: 500.0,
    description: "اشتراك شهري - يناير 2024",
    referenceId: "sub_1",
    date: "2024-01-01",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    type: "order_fee",
    amount: 25.0,
    description: "رسوم طلبات إضافية (5 طلبات × 5 د.ب)",
    date: "2024-01-15",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    type: "cash_deduction",
    amount: -150.0,
    description: "خصم نقدي من الطلبات",
    date: "2024-01-20",
    createdAt: new Date("2024-01-20"),
  },
]

const mockPayments: Payment[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    amount: 300.0,
    paymentMethod: "bank_transfer",
    paymentDate: "2024-01-25",
    notes: "دفعة جزئية",
    createdAt: new Date("2024-01-25"),
  },
]

const mockInvoices: Invoice[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    invoiceNumber: "INV-2024-001",
    issueDate: "2024-01-31",
    dueDate: "2024-02-15",
    periodStart: "2024-01-01",
    periodEnd: "2024-01-31",
    status: "sent",
    subscriptionAmount: 500.0,
    orderFeesAmount: 25.0,
    additionalServicesAmount: 0.0,
    cashDeductionAmount: -150.0,
    subtotal: 375.0,
    taxAmount: 37.5,
    totalAmount: 412.5,
    paidAmount: 300.0,
    remainingAmount: 112.5,
    separateCashAccounting: false,
    transactions: mockTransactions,
    payments: mockPayments,
    createdAt: new Date("2024-01-31"),
    updatedAt: new Date("2024-01-31"),
  },
]

const mockBillingSettings: CustomerBillingSettings[] = [
  {
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    separateCashAccounting: false,
    defaultPaymentTerms: 15,
    taxRate: 10.0,
    billingEmail: "billing@fastdelivery.com",
    billingAddress: "شارع الملك فيصل، المنامة، البحرين",
    autoGenerateInvoices: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

let invoiceCounter = 2

export const getBillingTransactions = async (filters?: {
  customerId?: string
  startDate?: string
  endDate?: string
  type?: TransactionType
}): Promise<BillingTransaction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let filtered = [...mockTransactions]

  if (filters?.customerId) {
    filtered = filtered.filter((t) => t.customerId === filters.customerId)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((t) => t.date >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((t) => t.date <= filters.endDate!)
  }

  if (filters?.type) {
    filtered = filtered.filter((t) => t.type === filters.type)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const addBillingTransaction = async (
  transactionData: Omit<BillingTransaction, "id" | "createdAt">,
): Promise<BillingTransaction> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newTransaction: BillingTransaction = {
    ...transactionData,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  mockTransactions.push(newTransaction)
  return newTransaction
}

export const getPayments = async (filters?: {
  customerId?: string
  startDate?: string
  endDate?: string
}): Promise<Payment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filtered = [...mockPayments]

  if (filters?.customerId) {
    filtered = filtered.filter((p) => p.customerId === filters.customerId)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((p) => p.paymentDate >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((p) => p.paymentDate <= filters.endDate!)
  }

  return filtered.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
}

export const addPayment = async (paymentData: Omit<Payment, "id" | "createdAt">): Promise<Payment> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newPayment: Payment = {
    ...paymentData,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  mockPayments.push(newPayment)
  const paymentTransaction: BillingTransaction = {
    id: (Date.now() + 1).toString(),
    customerId: paymentData.customerId,
    customerName: paymentData.customerName,
    type: "payment",
    amount: -paymentData.amount, // Negative for payment
    description: `دفعة مستلمة - ${paymentData.paymentMethod}`,
    date: paymentData.paymentDate,
    createdAt: new Date(),
  }

  mockTransactions.push(paymentTransaction)

  return newPayment
}

export const getInvoices = async (filters?: {
  customerId?: string
  status?: string
  startDate?: string
  endDate?: string
}): Promise<Invoice[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700))

  let filtered = [...mockInvoices]

  if (filters?.customerId) {
    filtered = filtered.filter((i) => i.customerId === filters.customerId)
  }

  if (filters?.status) {
    filtered = filtered.filter((i) => i.status === filters.status)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((i) => i.issueDate >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((i) => i.issueDate <= filters.endDate!)
  }

  return filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
}

export const generateInvoice = async (customerId: string, periodStart: string, periodEnd: string): Promise<Invoice> => {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  const billingSettings = mockBillingSettings.find((s) => s.customerId === customerId)
  if (!billingSettings) {
    throw new Error("Customer billing settings not found")
  }
  const transactions = await getBillingTransactions({
    customerId,
    startDate: periodStart,
    endDate: periodEnd,
  })
  const payments = await getPayments({
    customerId,
    startDate: periodStart,
    endDate: periodEnd,
  })
  const subscriptionAmount = transactions.filter((t) => t.type === "subscription").reduce((sum, t) => sum + t.amount, 0)
  const orderFeesAmount = transactions.filter((t) => t.type === "order_fee").reduce((sum, t) => sum + t.amount, 0)
  const additionalServicesAmount = transactions
    .filter((t) => t.type === "additional_service")
    .reduce((sum, t) => sum + t.amount, 0)
  const cashDeductionAmount = transactions
    .filter((t) => t.type === "cash_deduction")
    .reduce((sum, t) => sum + t.amount, 0)
  const subtotal = subscriptionAmount + orderFeesAmount + additionalServicesAmount + cashDeductionAmount
  const taxAmount = (subtotal * billingSettings.taxRate) / 100
  const totalAmount = subtotal + taxAmount
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const remainingAmount = totalAmount - paidAmount
  const issueDate = new Date()
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + billingSettings.defaultPaymentTerms)

  const newInvoice: Invoice = {
    id: Date.now().toString(),
    customerId,
    customerName: billingSettings.customerName,
    invoiceNumber: `INV-2024-${invoiceCounter.toString().padStart(3, "0")}`,
    issueDate: issueDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
    periodStart,
    periodEnd,
    status: "draft",
    subscriptionAmount,
    orderFeesAmount,
    additionalServicesAmount,
    cashDeductionAmount,
    subtotal,
    taxAmount,
    totalAmount,
    paidAmount,
    remainingAmount,
    separateCashAccounting: billingSettings.separateCashAccounting,
    transactions,
    payments,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  invoiceCounter++
  mockInvoices.push(newInvoice)
  return newInvoice
}

export const updateInvoiceStatus = async (invoiceId: string, status: Invoice["status"]): Promise<Invoice | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const invoiceIndex = mockInvoices.findIndex((i) => i.id === invoiceId)
  if (invoiceIndex === -1) return null

  mockInvoices[invoiceIndex] = {
    ...mockInvoices[invoiceIndex],
    status,
    updatedAt: new Date(),
  }

  return mockInvoices[invoiceIndex]
}

export const getBillingSummaries = async (): Promise<BillingSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const summaries: BillingSummary[] = []
  const customers = Array.from(new Set(mockTransactions.map((t) => ({ id: t.customerId, name: t.customerName }))))

  for (const customer of customers) {
    const customerInvoices = mockInvoices.filter((i) => i.customerId === customer.id)
    const customerPayments = mockPayments.filter((p) => p.customerId === customer.id)

    const totalOutstanding = customerInvoices
      .filter((i) => i.status !== "paid" && i.status !== "cancelled")
      .reduce((sum, i) => sum + i.remainingAmount, 0)

    const overdueInvoices = customerInvoices.filter(
      (i) => i.status !== "paid" && i.status !== "cancelled" && new Date(i.dueDate) < new Date(),
    )

    const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.remainingAmount, 0)

    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const currentMonthRevenue = customerPayments
      .filter((p) => p.paymentDate.startsWith(currentMonth))
      .reduce((sum, p) => sum + p.amount, 0)

    const lastPayment = customerPayments.sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    )[0]

    summaries.push({
      customerId: customer.id,
      customerName: customer.name,
      totalOutstanding,
      totalOverdue,
      currentMonthRevenue,
      lastPaymentDate: lastPayment?.paymentDate,
      lastPaymentAmount: lastPayment?.amount,
      activeInvoices: customerInvoices.filter((i) => i.status !== "paid" && i.status !== "cancelled").length,
      overdueInvoices: overdueInvoices.length,
    })
  }

  return summaries
}

export const getCustomerBillingSettings = async (customerId: string): Promise<CustomerBillingSettings | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBillingSettings.find((s) => s.customerId === customerId) || null
}

export const updateCustomerBillingSettings = async (
  customerId: string,
  settings: Partial<CustomerBillingSettings>,
): Promise<CustomerBillingSettings | null> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const settingsIndex = mockBillingSettings.findIndex((s) => s.customerId === customerId)
  if (settingsIndex === -1) return null

  mockBillingSettings[settingsIndex] = {
    ...mockBillingSettings[settingsIndex],
    ...settings,
    updatedAt: new Date(),
  }

  return mockBillingSettings[settingsIndex]
}
