import { updateOrderStatus, type NormalizedStatus } from "./shipday-api-functions"

export interface WebhookPayload {
  orderId: number
  orderNumber: string
  status: string
  timestamp: string
  driverId?: number
  driverName?: string
  notes?: string
}

export interface WebhookConfig {
  url: string
  secret?: string
  enabled: boolean
  events: string[]
}

// Mock webhook configurations - in real app, this would be stored in database
let webhookConfigs: WebhookConfig[] = [
  {
    url: "https://your-app.com/api/webhooks/shipday",
    secret: "your-webhook-secret",
    enabled: true,
    events: ["order_status_update", "driver_assigned", "order_delivered"]
  }
]

export const getWebhookConfigs = (): WebhookConfig[] => {
  return webhookConfigs
}

export const addWebhookConfig = (config: Omit<WebhookConfig, "enabled">): WebhookConfig => {
  const newConfig: WebhookConfig = {
    ...config,
    enabled: true
  }
  webhookConfigs.push(newConfig)
  return newConfig
}

export const updateWebhookConfig = (index: number, config: Partial<WebhookConfig>): WebhookConfig | null => {
  if (index < 0 || index >= webhookConfigs.length) return null
  
  webhookConfigs[index] = { ...webhookConfigs[index], ...config }
  return webhookConfigs[index]
}

export const deleteWebhookConfig = (index: number): boolean => {
  if (index < 0 || index >= webhookConfigs.length) return false
  
  webhookConfigs.splice(index, 1)
  return true
}

export const processWebhookPayload = async (payload: WebhookPayload): Promise<void> => {
  try {
    console.log("[Webhook] Processing payload:", payload)
    
    // Map Shipday status to normalized status
    const statusMap: Record<string, NormalizedStatus> = {
      "NOT_ASSIGNED": "pending",
      "ORDER_PLACED": "pending",
      "ASSIGNED": "assigned",
      "ORDER_ASSIGNED": "assigned",
      "PICKED_UP": "picked_up",
      "ORDER_PICKED_UP": "picked_up",
      "IN_TRANSIT": "in_transit",
      "ORDER_IN_TRANSIT": "in_transit",
      "DELIVERED": "delivered",
      "ORDER_DELIVERED": "delivered",
      "CANCELLED": "cancelled",
      "ORDER_CANCELLED": "cancelled",
    }
    
    const normalizedStatus = statusMap[payload.status] || "pending"
    
    // Update order status in our system
    // TODO: Implement order status update via API
    console.log(`Updating order ${payload.orderNumber} status to ${normalizedStatus}`)
    
    console.log(`[Webhook] Updated order ${payload.orderNumber} to status: ${normalizedStatus}`)
    
    // Send notifications to enabled webhooks
    await sendWebhookNotifications(payload)
    
  } catch (error) {
    console.error("[Webhook] Error processing payload:", error)
    throw error
  }
}

export const sendWebhookNotifications = async (payload: WebhookPayload): Promise<void> => {
  const enabledConfigs = webhookConfigs.filter(config => config.enabled)
  
  for (const config of enabledConfigs) {
    try {
      await sendWebhook(config, payload)
    } catch (error) {
      console.error(`[Webhook] Failed to send to ${config.url}:`, error)
    }
  }
}

const sendWebhook = async (config: WebhookConfig, payload: WebhookPayload): Promise<void> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "FawriPlus-Webhook/1.0"
  }
  
  if (config.secret) {
    headers["X-Webhook-Secret"] = config.secret
  }
  
  const response = await fetch(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      ...payload,
      timestamp: new Date().toISOString(),
      source: "fawri-plus"
    })
  })
  
  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
  }
  
  console.log(`[Webhook] Successfully sent to ${config.url}`)
}

// Simulate receiving webhook from Shipday
export const simulateShipdayWebhook = async (orderNumber: string, status: string): Promise<void> => {
  const payload: WebhookPayload = {
    orderId: Math.floor(Math.random() * 1000),
    orderNumber,
    status,
    timestamp: new Date().toISOString(),
    notes: `Status updated via webhook: ${status}`
  }
  
  await processWebhookPayload(payload)
}
