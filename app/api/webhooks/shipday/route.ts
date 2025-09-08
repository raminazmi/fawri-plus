import { NextRequest, NextResponse } from "next/server"
import { processWebhookPayload, type WebhookPayload } from "@/lib/webhooks"

export async function POST(request: NextRequest) {
  try {
    // Get the webhook secret from headers
    const webhookSecret = request.headers.get("x-webhook-secret")
    const expectedSecret = process.env.SHIPDAY_WEBHOOK_SECRET || "your-webhook-secret"
    
    // Verify webhook secret if provided
    if (webhookSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    const payload: WebhookPayload = await request.json()
    
    console.log("[Webhook] Received payload from Shipday:", payload)
    
    // Validate required fields
    if (!payload.orderNumber || !payload.status) {
      return NextResponse.json(
        { error: "Missing required fields: orderNumber, status" },
        { status: 400 }
      )
    }

    // Process the webhook payload
    await processWebhookPayload(payload)
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Webhook processed successfully",
        orderNumber: payload.orderNumber,
        status: payload.status
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error)
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "Shipday Webhook endpoint is active",
      timestamp: new Date().toISOString(),
      endpoint: "/api/webhooks/shipday"
    },
    { status: 200 }
  )
}
