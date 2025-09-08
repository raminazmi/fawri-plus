import { fetchDrivers, fetchOrders, addDriver as addDriverToShipday } from "./shipday-api-functions"

export interface Driver {
  id: string
  name: string
  phone: string
  email?: string
  status: "active" | "inactive" | "on_duty" | "off_duty"
  createdAt?: Date
}

export interface CashOrder {
  id: string
  orderId: string
  orderNumber: string
  driverId: string
  driverName: string
  customerName: string
  cashAmount: number
  deliveryDate: string
  status: "pending" | "collected" | "paid"
  createdAt: Date
}

export interface CashPayment {
  id: string
  driverId: string
  driverName: string
  amount: number
  paymentMethod: "cash" | "bank_transfer" | "check" | "other"
  paymentDate: string
  notes?: string
  createdAt: Date
}

export interface DriverCashSummary {
  driverId: string
  driverName: string
  totalCashOrders: number
  totalCashAmount: number
  totalPaid: number
  remainingBalance: number
  lastPaymentDate?: string
  pendingOrders: number
}

const mockCashOrders: CashOrder[] = [
  {
    id: "1",
    orderId: "1",
    orderNumber: "1001",
    driverId: "1",
    driverName: "سعد علي",
    customerName: "أحمد محمد",
    cashAmount: 15.5,
    deliveryDate: "2024-01-15",
    status: "collected",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    orderId: "2",
    orderNumber: "1002",
    driverId: "1",
    driverName: "سعد علي",
    customerName: "فاطمة أحمد",
    cashAmount: 22.0,
    deliveryDate: "2024-01-16",
    status: "collected",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    orderId: "3",
    orderNumber: "1003",
    driverId: "2",
    driverName: "محمد حسن",
    customerName: "خالد سالم",
    cashAmount: 18.75,
    deliveryDate: "2024-01-16",
    status: "pending",
    createdAt: new Date("2024-01-16"),
  },
]

const mockCashPayments: CashPayment[] = [
  {
    id: "1",
    driverId: "1",
    driverName: "سعد علي",
    amount: 30.0,
    paymentMethod: "cash",
    paymentDate: "2024-01-17",
    notes: "دفعة جزئية",
    createdAt: new Date("2024-01-17"),
  },
]

export const getDrivers = async (): Promise<Driver[]> => {
	try {
		const shipdayDrivers = await fetchDrivers()
		const shipdayOrders = await fetchOrders()

		const ordersByDriver = shipdayOrders.reduce((acc, order) => {
			const driverId = order.assignedCarrier?.id?.toString();
			if (driverId) {
				if (!acc[driverId]) {
					acc[driverId] = [];
				}
				acc[driverId].push(order);
			}
			return acc;
		}, {} as Record<string, any[]>);

		return shipdayDrivers.map((driver) => {
			const driverOrders = ordersByDriver[driver.id.toString()] || [];
			const isOnDuty = driverOrders.some(order => order.orderStatus?.orderState === "PICKED_UP" || order.orderStatus?.orderState === "IN_TRANSIT");
			const phone = driver.phone || "";

			return {
				id: driver.id.toString(),
				name: driver.name,
				phone,
				email: driver.email,
				status: isOnDuty ? "on_duty" : "off_duty",
			};
		});
	} catch (error) {
		return []
	}
}


export const addDriver = async (driverData: {
  name: string
  phone: string
  email: string
  password?: string
}): Promise<Driver> => {
		try {
			const payload = {
				name: driverData.name,
				phoneNumber: driverData.phone,
				email: driverData.email,
				temporaryPassword: driverData.password,
			}
			const newDriver = await addDriverToShipday(payload)
			if (!newDriver || !newDriver.id) {
				throw new Error("لم يتم إضافة السائق. تحقق من صحة البيانات المدخلة.")
			}
			return {
				id: newDriver.id.toString(),
				name: newDriver.name,
				phone: newDriver.phone,
				email: newDriver.email,
				status: "off_duty",
			}
		} catch (error: any) {
			let msg = "Error adding driver to Shipday API: " + (error?.message || error)
			if (error?.message?.includes("400")) {
				msg = "فشل في إضافة السائق. تحقق من صحة البيانات (الاسم، رقم الهاتف، البريد الإلكتروني، كلمة المرور)."
			}
			throw new Error(msg)
		}
}

export const getCashOrders = async (filters?: {
  driverId?: string
  startDate?: string
  endDate?: string
  status?: string
}): Promise<CashOrder[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  let filtered = [...mockCashOrders]

  if (filters?.driverId) {
    filtered = filtered.filter((order) => order.driverId === filters.driverId)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((order) => order.deliveryDate >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((order) => order.deliveryDate <= filters.endDate!)
  }

  if (filters?.status) {
    filtered = filtered.filter((order) => order.status === filters.status)
  }

  return filtered
}

export const getCashPayments = async (filters?: {
  driverId?: string
  startDate?: string
  endDate?: string
}): Promise<CashPayment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  let filtered = [...mockCashPayments]

  if (filters?.driverId) {
    filtered = filtered.filter((payment) => payment.driverId === filters.driverId)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((payment) => payment.paymentDate >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((payment) => payment.paymentDate <= filters.endDate!)
  }

  return filtered
}

export const addCashPayment = async (paymentData: {
  driverId: string
  amount: number
  paymentMethod: CashPayment["paymentMethod"]
  paymentDate: string
  notes?: string
}): Promise<CashPayment> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const driver = (await getDrivers()).find((d) => d.id === paymentData.driverId)
  if (!driver) {
    throw new Error("Driver not found")
  }

  const newPayment: CashPayment = {
    id: Date.now().toString(),
    driverId: paymentData.driverId,
    driverName: driver.name,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    paymentDate: paymentData.paymentDate,
    notes: paymentData.notes,
    createdAt: new Date(),
  }

  mockCashPayments.push(newPayment)
  return newPayment
}

export const getDriverCashSummary = async (filters?: {
  startDate?: string
  endDate?: string
}): Promise<DriverCashSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const drivers = await getDrivers()
  const cashOrders = await getCashOrders(filters)
  const cashPayments = await getCashPayments(filters)

  return drivers.map((driver) => {
    const driverOrders = cashOrders.filter((order) => order.driverId === driver.id)
    const driverPayments = cashPayments.filter((payment) => payment.driverId === driver.id)

    const totalCashAmount = driverOrders.reduce((sum, order) => sum + order.cashAmount, 0)
    const totalPaid = driverPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const pendingOrders = driverOrders.filter((order) => order.status === "pending").length

    const lastPayment = driverPayments.sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    )[0]

    return {
      driverId: driver.id,
      driverName: driver.name,
      totalCashOrders: driverOrders.length,
      totalCashAmount,
      totalPaid,
      remainingBalance: totalCashAmount - totalPaid,
      lastPaymentDate: lastPayment?.paymentDate,
      pendingOrders,
    }
  })
}

export const updateCashOrderStatus = async (
  orderId: string,
  status: CashOrder["status"],
): Promise<CashOrder | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const orderIndex = mockCashOrders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return null

  mockCashOrders[orderIndex] = {
    ...mockCashOrders[orderIndex],
    status,
  }

  return mockCashOrders[orderIndex]
}