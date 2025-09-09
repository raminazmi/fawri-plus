import { ShipdayOrder, ShipdayDriver, NormalizedStatus } from './types'
export type { ShipdayOrder, ShipdayDriver, NormalizedStatus }
const UI_TO_API_STATUS: Record<string, string> = {
  pending: "PENDING",
  assigned: "ASSIGNED", 
  picked_up: "PICKED_UP",
  in_transit: "IN_TRANSIT",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
}
export async function fetchOrders(): Promise<ShipdayOrder[]> {
  try {
    const response = await fetch('/api/shipday/orders')
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function fetchDrivers(): Promise<ShipdayDriver[]> {
  try {
    const response = await fetch('/api/shipday/carriers')
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(`Failed to fetch drivers: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateOrderStatus(orderId: number, status: NormalizedStatus): Promise<boolean> {
  try {
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

    return true
  } catch (error) {
    return false
  }
}

export async function assignOrderToDriver(orderId: number, driverId: number): Promise<boolean> {
  try {
    console.log('assignOrderToDriver called with:', { orderId, driverId });
    
    const response = await fetch(`/api/shipday/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ carrierId: driverId }), // Changed from driverId to carrierId
    })

    console.log('assignOrderToDriver response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text()
      console.error('assignOrderToDriver error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    return true
  } catch (error) {
    console.error('assignOrderToDriver catch error:', error);
    return false
  }
}

export async function unassignOrderFromDriver(orderId: number): Promise<boolean> {
  try {
    console.log('unassignOrderFromDriver called with:', { orderId });
    
    const response = await fetch(`/api/shipday/orders/${orderId}/unassign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('unassignOrderFromDriver response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text()
      console.error('unassignOrderFromDriver error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    return true
  } catch (error) {
    console.error('unassignOrderFromDriver catch error:', error);
    return false
  }
}

export async function setOrderReadyToPickup(orderId: number): Promise<boolean> {
  try {
    console.log('setOrderReadyToPickup called with:', { orderId });
    
    const response = await fetch(`/api/shipday/orders/${orderId}/meta`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ readyToPickup: true }),
    })

    console.log('setOrderReadyToPickup response:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text()
      console.error('setOrderReadyToPickup error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }

    return true
  } catch (error) {
    console.error('setOrderReadyToPickup catch error:', error);
    return false
  }
}

export async function addDriver(driverData: Partial<ShipdayDriver>): Promise<ShipdayDriver> {
  try {
    
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
    return data
  } catch (error) {
    throw error
  }
}

export async function createOrder(orderData: Partial<ShipdayOrder>): Promise<ShipdayOrder> {
  try {    
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
    return data
  } catch (error) {
    throw error
  }
}

export async function createOrderNew(orderData: any): Promise<any> {
  try {    
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
    return data
  } catch (error) {
    throw error
  }
}
export async function updateOrderNew(orderId: string, orderData: any): Promise<any> {
  try {    
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
    return data
  } catch (error) {
    throw error
  }
}

export async function updateOrder(orderId: number, orderData: Partial<ShipdayOrder>): Promise<ShipdayOrder> {
  try {
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
    return data
  } catch (error) {
    throw error
  }
}

export async function deleteOrder(orderId: number): Promise<boolean> {
  try {    
    const response = await fetch(`/api/shipday/orders/${orderId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    return true
  } catch (error) {
    throw error
  }
}


export async function updateOrderStatusAPI(orderId: number, status: string): Promise<boolean> {
  try {    
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
    return true
  } catch (error) {
    throw error
  }
}

export async function getShipdaySDK() {
  return {
    getOrders: fetchOrders,
    getDrivers: fetchDrivers,
    updateOrderStatus,
    assignOrderToDriver,
    createOrder
  }
}
