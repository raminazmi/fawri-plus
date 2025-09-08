import { ShipdayOrder, ShipdayDriver, NormalizedStatus } from './types'

// Re-export types for backward compatibility
export type { ShipdayOrder, ShipdayDriver, NormalizedStatus }

// Status mapping for UI to API conversion
const UI_TO_API_STATUS: Record<string, string> = {
  pending: "PENDING",
  assigned: "ASSIGNED", 
  picked_up: "PICKED_UP",
  in_transit: "IN_TRANSIT",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
}

// API Functions using direct fetch calls
export async function fetchOrders(): Promise<ShipdayOrder[]> {
  try {
    console.log('[API Functions] Fetching orders from /api/shipday/orders')
    const response = await fetch('/api/shipday/orders')
    console.log('[API Functions] Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API Functions] Error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('[API Functions] Received data:', typeof data, Array.isArray(data) ? data.length : 'Not array')
    console.log('[API Functions] Data sample:', Array.isArray(data) ? data.slice(0, 1) : data)
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function fetchDrivers(): Promise<ShipdayDriver[]> {
  try {
    console.log('[API Functions] Fetching drivers from /api/shipday/carriers')
    const response = await fetch('/api/shipday/carriers')
    console.log('[API Functions] Drivers response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[API Functions] Drivers error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('[API Functions] Received drivers data:', typeof data, Array.isArray(data) ? data.length : 'Not array')
    console.log('[API Functions] Drivers data sample:', Array.isArray(data) ? data.slice(0, 1) : data)
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch drivers:', error)
    throw new Error(`Failed to fetch drivers: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateOrderStatus(orderId: number, status: NormalizedStatus): Promise<boolean> {
  try {
    console.log(`Updating order ${orderId} status to ${status}`)
    
    // Convert normalized status to Shipday API status
    const apiStatus = UI_TO_API_STATUS[status] || status.toUpperCase()
    
    const response = await fetch(`/api/shipday/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: apiStatus }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    console.log(`Successfully updated order ${orderId} status to ${status}`)
    return true
  } catch (error) {
    console.error(`Failed to update order ${orderId} status:`, error)
    return false
  }
}

export async function assignOrderToDriver(orderId: number, driverId: number): Promise<boolean> {
  try {
    console.log(`Assigning order ${orderId} to driver ${driverId}`)
    
    const response = await fetch(`/api/shipday/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driverId }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    console.log(`Successfully assigned order ${orderId} to driver ${driverId}`)
    return true
  } catch (error) {
    console.error(`Failed to assign order ${orderId} to driver ${driverId}:`, error)
    return false
  }
}

export async function addDriver(driverData: Partial<ShipdayDriver>): Promise<ShipdayDriver> {
  try {
    console.log('Adding driver:', driverData)
    
    const response = await fetch('/api/shipday/carriers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully added driver:', data)
    return data
  } catch (error) {
    console.error('Failed to add driver:', error)
    throw error
  }
}

export async function createOrder(orderData: Partial<ShipdayOrder>): Promise<ShipdayOrder> {
  try {
    console.log('Creating order:', orderData)
    
    const response = await fetch('/api/shipday/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully created order:', data)
    return data
  } catch (error) {
    console.error('Failed to create order:', error)
    throw error
  }
}

// New function for creating orders with the new format
export async function createOrderNew(orderData: any): Promise<any> {
  try {
    console.log('Creating order with new format:', orderData)
    
    const response = await fetch('/api/shipday/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully created order:', data)
    return data
  } catch (error) {
    console.error('Failed to create order:', error)
    throw error
  }
}

// New function for updating orders with the correct format
export async function updateOrderNew(orderId: string, orderData: any): Promise<any> {
  try {
    console.log('Updating order with new format:', orderData)
    
    const response = await fetch(`/api/shipday/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully updated order:', data)
    return data
  } catch (error) {
    console.error('Failed to update order:', error)
    throw error
  }
}

export async function updateOrder(orderId: number, orderData: Partial<ShipdayOrder>): Promise<ShipdayOrder> {
  try {
    console.log('Updating order:', orderId, orderData)
    
    const response = await fetch(`/api/shipday/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Successfully updated order:', data)
    return data
  } catch (error) {
    console.error('Failed to update order:', error)
    throw error
  }
}

export async function deleteOrder(orderId: number): Promise<boolean> {
  try {
    console.log('Deleting order:', orderId)
    
    const response = await fetch(`/api/shipday/orders/${orderId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    console.log('Successfully deleted order:', orderId)
    return true
  } catch (error) {
    console.error('Failed to delete order:', error)
    throw error
  }
}


export async function updateOrderStatusAPI(orderId: number, status: string): Promise<boolean> {
  try {
    console.log('Updating order status:', orderId, status)
    
    const response = await fetch(`/api/shipday/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    console.log('Successfully updated order status:', orderId, status)
    return true
  } catch (error) {
    console.error('Failed to update order status:', error)
    throw error
  }
}

// Legacy function for backward compatibility
export async function getShipdaySDK() {
  return {
    getOrders: fetchOrders,
    getDrivers: fetchDrivers,
    updateOrderStatus,
    assignOrderToDriver,
    createOrder
  }
}
