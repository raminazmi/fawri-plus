export type OrderType = "same-day" | "direct"
export type SubscriptionType = "same-day" | "direct"
export type BillingPeriod = "weekly" | "bi-weekly" | "monthly" | "quarterly" | "custom"
export type UnusedOrdersPolicy = "carry_over_percentage" | "carry_over_number" | "extend_period" | "forfeit"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  status: "active" | "inactive" | "suspended"
  createdAt: Date
}

export interface SubscriptionPlan {
  id: string
  customerId: string
  customerName: string
  subscriptionType: SubscriptionType
  billingPeriod: BillingPeriod
  customPeriodDays?: number
  startDate: string
  endDate: string
  totalOrders: number
  subscriptionPrice: number
  outOfSubscriptionSameDayPrice: number
  outOfSubscriptionDirectPrice: number
  crossTypeHandling: "fixed_fee" | "deduct_orders"
  crossTypeSameDayFee?: number
  crossTypeDirectFee?: number
  crossTypeOrdersDeducted?: number
  unusedOrdersPolicy: UnusedOrdersPolicy
  carryOverPercentage?: number
  carryOverNumber?: number
  extensionDays?: number
  status: "active" | "expired" | "cancelled"
  autoRenew: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SubscriptionUsage {
  id: string
  subscriptionId: string
  customerId: string
  orderId: string
  orderNumber: string
  orderType: OrderType
  orderDate: string
  isWithinSubscription: boolean
  deductedOrders: number
  additionalFee: number
  createdAt: Date
}

export interface SubscriptionSummary {
  subscriptionId: string
  customerName: string
  subscriptionType: SubscriptionType
  totalOrders: number
  usedOrders: number
  remainingOrders: number
  usagePercentage: number
  daysRemaining: number
  totalRevenue: number
  additionalFees: number
  status: "active" | "expired" | "cancelled"
  nextBillingDate?: string
}
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "شركة التوصيل السريع",
    email: "info@fastdelivery.com",
    phone: "+973-1111-1111",
    company: "شركة التوصيل السريع",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "متجر الإلكترونيات",
    email: "orders@electronics.com",
    phone: "+973-2222-2222",
    company: "متجر الإلكترونيات",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
]

const mockSubscriptions: SubscriptionPlan[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "شركة التوصيل السريع",
    subscriptionType: "same-day",
    billingPeriod: "monthly",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalOrders: 100,
    subscriptionPrice: 500.0,
    outOfSubscriptionSameDayPrice: 8.0,
    outOfSubscriptionDirectPrice: 12.0,
    crossTypeHandling: "fixed_fee",
    crossTypeDirectFee: 10.0,
    unusedOrdersPolicy: "carry_over_percentage",
    carryOverPercentage: 50,
    status: "active",
    autoRenew: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    customerId: "2",
    customerName: "متجر الإلكترونيات",
    subscriptionType: "direct",
    billingPeriod: "weekly",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    totalOrders: 25,
    subscriptionPrice: 150.0,
    outOfSubscriptionSameDayPrice: 6.0,
    outOfSubscriptionDirectPrice: 9.0,
    crossTypeHandling: "deduct_orders",
    crossTypeOrdersDeducted: 2,
    unusedOrdersPolicy: "extend_period",
    extensionDays: 7,
    status: "active",
    autoRenew: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
]

const mockUsage: SubscriptionUsage[] = [
  {
    id: "1",
    subscriptionId: "1",
    customerId: "1",
    orderId: "1",
    orderNumber: "1001",
    orderType: "same-day",
    orderDate: "2024-01-10",
    isWithinSubscription: true,
    deductedOrders: 1,
    additionalFee: 0,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "2",
    subscriptionId: "1",
    customerId: "1",
    orderId: "2",
    orderNumber: "1002",
    orderType: "direct",
    orderDate: "2024-01-12",
    isWithinSubscription: false,
    deductedOrders: 0,
    additionalFee: 10.0,
    createdAt: new Date("2024-01-12"),
  },
]

export const getCustomers = async (): Promise<Customer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockCustomers]
}

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockCustomers.find((customer) => customer.id === id) || null
}

export const createCustomer = async (customerData: Omit<Customer, "id" | "createdAt">): Promise<Customer> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newCustomer: Customer = {
    ...customerData,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  mockCustomers.push(newCustomer)
  return newCustomer
}

export const getSubscriptions = async (filters?: { customerId?: string; status?: string }): Promise<
  SubscriptionPlan[]
> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let filtered = [...mockSubscriptions]

  if (filters?.customerId) {
    filtered = filtered.filter((sub) => sub.customerId === filters.customerId)
  }

  if (filters?.status) {
    filtered = filtered.filter((sub) => sub.status === filters.status)
  }

  return filtered
}

export const createSubscription = async (
  subscriptionData: Omit<SubscriptionPlan, "id" | "createdAt" | "updatedAt">,
): Promise<SubscriptionPlan> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newSubscription: SubscriptionPlan = {
    ...subscriptionData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockSubscriptions.push(newSubscription)
  return newSubscription
}

export const updateSubscription = async (
  id: string,
  subscriptionData: Partial<SubscriptionPlan>,
): Promise<SubscriptionPlan | null> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const subscriptionIndex = mockSubscriptions.findIndex((sub) => sub.id === id)
  if (subscriptionIndex === -1) return null

  mockSubscriptions[subscriptionIndex] = {
    ...mockSubscriptions[subscriptionIndex],
    ...subscriptionData,
    updatedAt: new Date(),
  }

  return mockSubscriptions[subscriptionIndex]
}

export const getSubscriptionUsage = async (subscriptionId: string): Promise<SubscriptionUsage[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockUsage.filter((usage) => usage.subscriptionId === subscriptionId)
}

export const getSubscriptionSummaries = async (): Promise<SubscriptionSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const summaries: SubscriptionSummary[] = []

  for (const subscription of mockSubscriptions) {
    const usage = mockUsage.filter((u) => u.subscriptionId === subscription.id)
    const usedOrders = usage.reduce((sum, u) => sum + u.deductedOrders, 0)
    const additionalFees = usage.reduce((sum, u) => sum + u.additionalFee, 0)

    const startDate = new Date(subscription.startDate)
    const endDate = new Date(subscription.endDate)
    const today = new Date()
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

    let nextBillingDate: string | undefined
    if (subscription.autoRenew && subscription.status === "active") {
      const nextBilling = new Date(endDate)
      switch (subscription.billingPeriod) {
        case "weekly":
          nextBilling.setDate(nextBilling.getDate() + 7)
          break
        case "bi-weekly":
          nextBilling.setDate(nextBilling.getDate() + 14)
          break
        case "monthly":
          nextBilling.setMonth(nextBilling.getMonth() + 1)
          break
        case "quarterly":
          nextBilling.setMonth(nextBilling.getMonth() + 3)
          break
        case "custom":
          if (subscription.customPeriodDays) {
            nextBilling.setDate(nextBilling.getDate() + subscription.customPeriodDays)
          }
          break
      }
      nextBillingDate = nextBilling.toISOString().split("T")[0]
    }

    summaries.push({
      subscriptionId: subscription.id,
      customerName: subscription.customerName,
      subscriptionType: subscription.subscriptionType,
      totalOrders: subscription.totalOrders,
      usedOrders,
      remainingOrders: Math.max(0, subscription.totalOrders - usedOrders),
      usagePercentage: (usedOrders / subscription.totalOrders) * 100,
      daysRemaining,
      totalRevenue: subscription.subscriptionPrice + additionalFees,
      additionalFees,
      status: subscription.status,
      nextBillingDate,
    })
  }

  return summaries
}

export const processOrderUsage = async (
  customerId: string,
  orderType: OrderType,
  orderData: { orderId: string; orderNumber: string; orderDate: string },
): Promise<{ deductedOrders: number; additionalFee: number; subscriptionId?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const activeSubscription = mockSubscriptions.find((sub) => sub.customerId === customerId && sub.status === "active")
  if (!activeSubscription) {
    return {
      deductedOrders: 0,
      additionalFee: orderType === "same-day" ? 8.0 : 12.0,
    }
  }

  const orderDate = new Date(orderData.orderDate)
  const subscriptionStart = new Date(activeSubscription.startDate)
  const subscriptionEnd = new Date(activeSubscription.endDate)

  if (orderDate < subscriptionStart || orderDate > subscriptionEnd) {
    return {
      deductedOrders: 0,
      additionalFee:
        orderType === "same-day"
          ? activeSubscription.outOfSubscriptionSameDayPrice
          : activeSubscription.outOfSubscriptionDirectPrice,
      subscriptionId: activeSubscription.id,
    }
  }

  const currentUsage = mockUsage.filter((u) => u.subscriptionId === activeSubscription.id)
  const usedOrders = currentUsage.reduce((sum, u) => sum + u.deductedOrders, 0)
  const remainingOrders = activeSubscription.totalOrders - usedOrders

  if (orderType === activeSubscription.subscriptionType) {
    if (remainingOrders > 0) {
      const newUsage: SubscriptionUsage = {
        id: Date.now().toString(),
        subscriptionId: activeSubscription.id,
        customerId,
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber,
        orderType,
        orderDate: orderData.orderDate,
        isWithinSubscription: true,
        deductedOrders: 1,
        additionalFee: 0,
        createdAt: new Date(),
      }
      mockUsage.push(newUsage)

      return {
        deductedOrders: 1,
        additionalFee: 0,
        subscriptionId: activeSubscription.id,
      }
    } else {
      const additionalFee =
        orderType === "same-day"
          ? activeSubscription.outOfSubscriptionSameDayPrice
          : activeSubscription.outOfSubscriptionDirectPrice

      const newUsage: SubscriptionUsage = {
        id: Date.now().toString(),
        subscriptionId: activeSubscription.id,
        customerId,
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber,
        orderType,
        orderDate: orderData.orderDate,
        isWithinSubscription: false,
        deductedOrders: 0,
        additionalFee,
        createdAt: new Date(),
      }
      mockUsage.push(newUsage)

      return {
        deductedOrders: 0,
        additionalFee,
        subscriptionId: activeSubscription.id,
      }
    }
  } else {
    if (activeSubscription.crossTypeHandling === "fixed_fee") {
      const additionalFee =
        orderType === "same-day"
          ? activeSubscription.crossTypeSameDayFee || 0
          : activeSubscription.crossTypeDirectFee || 0

      const newUsage: SubscriptionUsage = {
        id: Date.now().toString(),
        subscriptionId: activeSubscription.id,
        customerId,
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber,
        orderType,
        orderDate: orderData.orderDate,
        isWithinSubscription: false,
        deductedOrders: 0,
        additionalFee,
        createdAt: new Date(),
      }
      mockUsage.push(newUsage)

      return {
        deductedOrders: 0,
        additionalFee,
        subscriptionId: activeSubscription.id,
      }
    } else {
      const ordersToDeduct = activeSubscription.crossTypeOrdersDeducted || 1
      if (remainingOrders >= ordersToDeduct) {
        const newUsage: SubscriptionUsage = {
          id: Date.now().toString(),
          subscriptionId: activeSubscription.id,
          customerId,
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
          orderType,
          orderDate: orderData.orderDate,
          isWithinSubscription: true,
          deductedOrders: ordersToDeduct,
          additionalFee: 0,
          createdAt: new Date(),
        }
        mockUsage.push(newUsage)

        return {
          deductedOrders: ordersToDeduct,
          additionalFee: 0,
          subscriptionId: activeSubscription.id,
        }
      } else {
        const additionalFee =
          orderType === "same-day"
            ? activeSubscription.outOfSubscriptionSameDayPrice
            : activeSubscription.outOfSubscriptionDirectPrice

        const newUsage: SubscriptionUsage = {
          id: Date.now().toString(),
          subscriptionId: activeSubscription.id,
          customerId,
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
          orderType,
          orderDate: orderData.orderDate,
          isWithinSubscription: false,
          deductedOrders: 0,
          additionalFee,
          createdAt: new Date(),
        }
        mockUsage.push(newUsage)

        return {
          deductedOrders: 0,
          additionalFee,
          subscriptionId: activeSubscription.id,
        }
      }
    }
  }
}
