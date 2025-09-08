// Removed SDK import - using direct API calls
import { getSettings } from "./settings"

export type OrderType = "same-day" | "direct"

export interface OrderDetails {
  id: string
  orderNumber: string
  externalId: string
  type: OrderType
  date: string
  cash: number
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

export interface PickupDetails {
  name: string
  phone: string
  location: string
  address: string
  email?: string
}

export interface DeliveryDetails {
  name: string
  phone: string
  location: string
  address: string
  email?: string
}

export interface OrderInstructions {
  instructions: string
  timeInstructions: string
}

export interface Order {
  details: OrderDetails
  pickup: PickupDetails
  delivery: DeliveryDetails
  instructions: OrderInstructions
  isTransit: boolean
  shipdayOrders: string[] // Array of Shipday order numbers
  assignedDriver?: {
    id: string
    name: string
  }
}

const mockOrders: Order[] = [
  {
    details: {
      id: "1",
      orderNumber: "1001",
      externalId: "SD001",
      type: "same-day",
      date: new Date().toISOString().split("T")[0],
      cash: 15.5,
      status: "assigned",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    pickup: {
      name: "متجر الإلكترونيات",
      phone: "+973-1111-1111",
      location: "المنامة، البحرين",
      address: "شارع الملك فيصل، المنامة",
    },
    delivery: {
      name: "أحمد محمد",
      phone: "+973-2222-2222",
      location: "الرفاع، البحرين",
      address: "مجمع الرفاع، الرفاع",
    },
    instructions: {
      instructions: "التعامل بحذر - أجهزة إلكترونية",
      timeInstructions: "التوصيل قبل الساعة 6 مساءً",
    },
    isTransit: false,
    shipdayOrders: ["SD001"],
    assignedDriver: {
      id: "driver1",
      name: "سعد علي",
    },
  },
]

let orderCounter = 1002

const getCurrentTimeHHMMSS = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

export const getOrders = async (): Promise<Order[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockOrders]
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockOrders.find((order) => order.details.id === id) || null
}

export const createOrder = async (orderData: {
  pickup: PickupDetails
  delivery: DeliveryDetails
  instructions: OrderInstructions
  type: OrderType
  date: string
  cash: number
  isTransit: boolean
  items?: { name: string; quantity: number; unitPrice: number }[]
}): Promise<Order> => {
  const orderNumber = (orderCounter++).toString()
  const externalId = `${orderData.type === "same-day" ? "SD" : "D"}${orderNumber}`

  const newOrder: Order = {
    details: {
      id: Date.now().toString(),
      orderNumber,
      externalId,
      type: orderData.type,
      date: orderData.date,
      cash: orderData.cash,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    pickup: orderData.pickup,
    delivery: orderData.delivery,
    instructions: orderData.instructions,
    isTransit: orderData.isTransit,
    shipdayOrders: [],
  }

  try {
    const now = new Date()
    const pickupTime = now.toTimeString().split(" ")[0]
    const deliveryTime = new Date(now.getTime() + 15 * 60000).toTimeString().split(" ")[0]

    // لو معندكش items من الواجهة – fallback item
    const orderItems = orderData.items?.length
      ? orderData.items
      : [{
          name: "Delivery",
          quantity: 1,
          unitPrice: orderData.cash || 0
        }]

const commonPayload = {
  orderNumber,
  externalId,

  // Customer info
  customerName: orderData.delivery.name,
  customerPhone: orderData.delivery.phone,
  customerEmail: orderData.delivery.email || "",
  deliveryAddress: orderData.delivery.location,
  deliveryNote: orderData.instructions.instructions,

  // Pickup info
  pickupName: orderData.pickup.name,
  pickupPhone: orderData.pickup.phone,
  pickupEmail: orderData.pickup.email || "",
  pickupAddress: orderData.pickup.location,

  // Raw order data
  orderItems: orderData.items || [],
  totalPrice: orderData.cash,
  subTotal: orderData.items?.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) || orderData.cash,

  // Extra fields (عشان أي معلومة تتسجل زي ما هي)
  rawData: orderData,   // ده يضمن إن أي حاجة إضافية متضيعش
  deliveryDate: orderData.date,
  expectedPickupTime: pickupTime,
  expectedDeliveryTime: deliveryTime,
}



    if (orderData.isTransit) {
      // Hub Order
      const hubOrderPayload = {
        ...commonPayload,
        orderNumber: `${orderNumber}-H`,
        externalId: `${externalId}-HUB`,
        customerName: "Hub Transfer",
        customerPhone: "+973-0000-0000",
        pickupAddress: orderData.pickup.location,
        deliveryAddress: "Hub Location",
        totalPrice: 0,
        subTotal: 0,
        orderItems: [{ name: "Hub Transfer", quantity: 1, unitPrice: 0 }]
      }

      // Delivery Order
      const deliveryOrderPayload = {
        ...commonPayload,
        orderNumber: `${orderNumber}-D`,
        externalId: `${externalId}-DELIVERY`,
        pickupName: "Hub",
        pickupPhone: "+973-0000-0000",
        pickupAddress: "Hub Location",
        deliveryAddress: orderData.delivery.location,
      }

      // TODO: Implement Shipday order creation via API
      console.log("Creating hub order:", hubOrderPayload)
      console.log("Creating delivery order:", deliveryOrderPayload)
      
      // Mock orders for now
      const hubOrder = { orderNumber: `${orderNumber}-H` }
      const deliveryOrder = { orderNumber: `${orderNumber}-D` }

      newOrder.shipdayOrders = [hubOrder.orderNumber, deliveryOrder.orderNumber]
    } else {
      const directOrderPayload = {
        ...commonPayload,
        pickupAddress: orderData.pickup.location,
        deliveryAddress: orderData.delivery.location,
      }

      // TODO: Implement Shipday order creation via API
      console.log("Creating direct order:", directOrderPayload)
      
      // Mock order for now
      const shipdayOrder = { orderNumber: orderNumber }
      newOrder.shipdayOrders = [shipdayOrder.orderNumber]
    }

    newOrder.details.status = "assigned"
  } catch (error) {
    console.error("Failed to create Shipday order:", error)
  }

  mockOrders.push(newOrder)
  return newOrder
}


export const updateOrderStatus = async (orderId: string, status: OrderDetails["status"]): Promise<Order | null> => {
  const orderIndex = mockOrders.findIndex((order) => order.details.id === orderId)
  if (orderIndex === -1) return null

  const order = mockOrders[orderIndex]

  try {
    // TODO: Implement Shipday order status update via API
    console.log(`Updating Shipday orders ${order.shipdayOrders.join(', ')} status to ${status}`)
  } catch (error) {
    console.error("Failed to update Shipday order status:", error)
  }

  mockOrders[orderIndex] = {
    ...order,
    details: {
      ...order.details,
      status,
      updatedAt: new Date(),
    },
  }

  return mockOrders[orderIndex]
}

export const syncWithShipday = async (): Promise<{ synced: number; errors: number }> => {
  try {
    // TODO: Implement Shipday sync via API
    console.log("Syncing with Shipday API...")
    
    // For now, return mock data
    return { synced: 0, errors: 0 }
  } catch (error) {
    console.error("Failed to sync with Shipday:", error)
    return { synced: 0, errors: mockOrders.length }
  }
}