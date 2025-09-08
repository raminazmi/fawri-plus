import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[API] Updating order in Shipday...")
    
    const orderId = params.id
    const body = await request.json()
    console.log("[API] Request body:", body)
    console.log("[API] Order ID:", orderId)

    // Use the correct API key
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'

    // Format the data for Shipday API
    const formattedData = {
      orderId: parseInt(orderId),
      orderNo: body.orderNumber || body.orderNo,
      customerName: body.customerName,
      customerAddress: body.customerAddress,
      customerEmail: body.customerEmail,
      customerPhoneNumber: body.customerPhoneNumber,
      restaurantName: body.restaurantName,
      restaurantAddress: body.restaurantAddress,
      restaurantPhoneNumber: body.restaurantPhoneNumber,
      expectedDeliveryDate: body.expectedDeliveryDate,
      expectedPickupTime: body.expectedPickupTime,
      expectedDeliveryTime: body.expectedDeliveryTime,
      pickupLatitude: body.pickupLatitude,
      pickupLongitude: body.pickupLongitude,
      deliveryLatitude: body.deliveryLatitude,
      deliveryLongitude: body.deliveryLongitude,
      tip: body.tips || body.tip,
      tax: body.tax,
      discountAmount: body.discountAmount,
      deliveryFee: body.deliveryFee,
      totalCost: body.totalOrderCost || body.totalCost,
      deliveryInstruction: body.deliveryInstruction,
      orderSource: body.orderSource,
      additionalId: body.additionalId,
      clientRestaurantId: body.clientRestaurantId,
      paymentMethod: body.paymentMethod,
      creditCardType: body.creditCardType,
      creditCardId: body.creditCardId,
    }

    console.log("[API] Formatted data for Shipday:", formattedData)

    const response = await fetch(`https://api.shipday.com/order/edit/${orderId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify(formattedData),
    })

    console.log("[API] Shipday response status:", response.status)
    console.log("[API] Response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log("[API] Success! Updated order:", data)
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      console.log("[API] Error response:", errorText)
      return NextResponse.json(
        { error: `Shipday API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("[API] Request failed:", error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}