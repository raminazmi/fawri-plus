import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const orderId = params.id
    const body = await request.json()
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
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

    const response = await fetch(`https://api.shipday.com/order/edit/${orderId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify(formattedData),
    })


    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Shipday API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}