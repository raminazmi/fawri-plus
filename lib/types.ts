// Shipday API Types
export interface ShipdayOrder {
  orderId: number
  orderNumber: string
  companyId?: number
  areaId?: number
  customer: {
    id: number
    name: string
    address: string
    phoneNumber: string
    emailAddress?: string
    latitude?: number
    longitude?: number
  }
  restaurant: {
    id: number
    name: string
    address: string
    phoneNumber: string
    latitude?: number
    longitude?: number
  }
  assignedCarrier?: {
    id: number
    name: string
    phoneNumber: string
  } | null
  distance: number
  activityLog: {
    placementTime: string
    expectedPickupTime: string
    expectedDeliveryDate: string
    expectedDeliveryTime: string
    assignedTime?: string | null
    startTime?: string | null
    pickedUpTime?: string | null
    arrivedTime?: string | null
    deliveryTime?: string | null
    failedDeliveryTime?: string | null
  }
  costing: {
    totalCost: number
    deliveryFee: number
    tip: number
    discountAmount: number
    tax: number
    cashTip: number
  }
  paymentMethod?: string | null
  orderItems: Array<{
    name: string
    quantity: number
    unitPrice: number
    detail: string
    addOns: any[]
  }>
  assignedCarrierId?: number | null
  orderStatus: {
    incomplete: boolean
    accepted: boolean
    orderState: string
  }
  trackingLink: string
  feedback?: any
  schedule: boolean
  parentId: number
  etaTime: string
  deliveryInstruction: string
  feedbackDetails?: any
  orderStatusAdmin: string
  idRequired: boolean
  proofOfDelivery?: any
  orderSeqNum: number
  dOrderState?: any
  thirdPartyTrackingLink?: any
  pickupInstruction: string
  deliveryNote?: any
  thirdPartyAssignedAnytime: boolean
  preAssignment?: any
  orderSource?: any
}

export interface ShipdayDriver {
  id: number
  name: string
  phone: string
  email?: string
  status: "available" | "busy" | "offline"
  location?: {
    lat: number
    lng: number
  }
  vehicle?: {
    type: string
    plate: string
  }
}

export type NormalizedStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled"

// Client Types
export interface Client {
  id: number
  name: string
  email: string
  phone: string
  company_name?: string | null
  created_at: string
  updated_at: string
}

export interface CreateClientRequest {
  name: string
  email: string
  phone: string
  company_name?: string
}

export interface UpdateClientRequest {
  name?: string
  email?: string
  phone?: string
  company_name?: string
}