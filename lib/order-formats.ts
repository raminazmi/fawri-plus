export interface OrderItem {
  name: string
  unitPrice: number
  quantity: number
  addOns?: string[]
  detail?: string
}

export interface Address {
  unit?: string
  street: string
  city: string
  state: string
  zip: string
  country: string
}

export interface PickupLocation {
  address: Address
}

export interface DropoffLocation {
  address: Address
}

export interface CreateOrderRequest {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress: string
  restaurantName: string
  restaurantPhone: string
  restaurantAddress: string
  expectedDeliveryDate: string
  expectedPickupTime?: string
  expectedDeliveryTime?: string
  pickupLatitude?: number
  pickupLongitude?: number
  deliveryLatitude?: number
  deliveryLongitude?: number
  tips?: number
  tax?: number
  discountAmount?: number
  deliveryFee?: number
  totalOrderCost: number
  deliveryInstruction?: string
  orderSource?: string
  additionalId?: string
  clientRestaurantId?: number
  paymentMethod: 'cash' | 'credit_card'
  creditCardType?: 'visa' | 'master_card' | 'AMEX' | 'other'
  creditCardId?: number
}

export function formatOrderForShipday(orderData: CreateOrderRequest) {
  const safeOrderData = {
    orderNumber: orderData.orderNumber || `ORD-${Date.now()}`,
    customerName: orderData.customerName || '',
    customerPhone: (orderData as any).customerPhoneNumber || orderData.customerPhone || '',
    customerEmail: orderData.customerEmail || '',
    customerAddress: orderData.customerAddress || '',
    restaurantName: orderData.restaurantName || '',
    restaurantPhone: orderData.restaurantPhone || (orderData as any).restaurantPhoneNumber || '',
    restaurantAddress: orderData.restaurantAddress || '',
    expectedDeliveryDate: orderData.expectedDeliveryDate || new Date().toISOString().split('T')[0],
    expectedPickupTime: orderData.expectedPickupTime || '18:00',
    expectedDeliveryTime: orderData.expectedDeliveryTime || '19:00',
    pickupLatitude: orderData.pickupLatitude || 0,
    pickupLongitude: orderData.pickupLongitude || 0,
    deliveryLatitude: orderData.deliveryLatitude || 0,
    deliveryLongitude: orderData.deliveryLongitude || 0,
    deliveryInstruction: orderData.deliveryInstruction || '',
    orderSource: orderData.orderSource || 'Fawri Plus',
    additionalId: orderData.additionalId || '',
    clientRestaurantId: orderData.clientRestaurantId || 1,
    paymentMethod: orderData.paymentMethod || 'cash',
    creditCardType: orderData.creditCardType || '',
    creditCardId: orderData.creditCardId || 0,
    totalOrderCost: orderData.totalOrderCost || 0,
    tips: orderData.tips || 0,
    deliveryFee: orderData.deliveryFee || 0,
    tax: orderData.tax || 0,
    discountAmount: orderData.discountAmount || 0,
  }

  return {
    orderNumber: safeOrderData.orderNumber,
    customerName: safeOrderData.customerName,
    customerAddress: safeOrderData.customerAddress,
    customerEmail: safeOrderData.customerEmail,
    customerPhoneNumber: safeOrderData.customerPhone,
    restaurantName: safeOrderData.restaurantName,
    restaurantAddress: safeOrderData.restaurantAddress,
    restaurantPhoneNumber: safeOrderData.restaurantPhone,
    expectedDeliveryDate: safeOrderData.expectedDeliveryDate,
    expectedPickupTime: safeOrderData.expectedPickupTime,
    expectedDeliveryTime: safeOrderData.expectedDeliveryTime,
    pickupLatitude: safeOrderData.pickupLatitude,
    pickupLongitude: safeOrderData.pickupLongitude,
    deliveryLatitude: safeOrderData.deliveryLatitude,
    deliveryLongitude: safeOrderData.deliveryLongitude,
    tips: safeOrderData.tips,
    tax: safeOrderData.tax,
    discountAmount: safeOrderData.discountAmount,
    deliveryFee: safeOrderData.deliveryFee,
    totalOrderCost: safeOrderData.totalOrderCost,
    deliveryInstruction: safeOrderData.deliveryInstruction,
    orderSource: safeOrderData.orderSource,
    additionalId: safeOrderData.additionalId,
    clientRestaurantId: safeOrderData.clientRestaurantId,
    paymentMethod: safeOrderData.paymentMethod,
    creditCardType: safeOrderData.creditCardType,
    creditCardId: safeOrderData.creditCardId,
  }
}

export function createOrderWithProvidedData(): CreateOrderRequest {
  return {
    orderNumber: "99qT5A",
    customerName: "Mr. Jhon Mason",
    customerAddress: "556 Crestlake Dr, San Francisco, CA 94132, USA",
    customerEmail: "jhonMason@gmail.com",
    customerPhone: "+14152392212",
    restaurantName: "Popeyes Louisiana Kitchen",
    restaurantAddress: "890 Geneva Ave, San Francisco, CA 94112, United States",
    restaurantPhone: "+14152392013",
    expectedDeliveryDate: "2021-06-03",
    expectedPickupTime: "17:45:00",
    expectedDeliveryTime: "19:22:00",
    pickupLatitude: 41.53867,
    pickupLongitude: -72.0827,
    deliveryLatitude: 41.53867,
    deliveryLongitude: -72.0827,
    tips: 2.5,
    tax: 1.5,
    discountAmount: 1.5,
    deliveryFee: 3,
    totalOrderCost: 13.47,
    deliveryInstruction: "fast",
    orderSource: "Seamless",
    additionalId: "4532",
    clientRestaurantId: 12,
    paymentMethod: "credit_card",
    creditCardType: "visa",
    creditCardId: 1234
  }
}
