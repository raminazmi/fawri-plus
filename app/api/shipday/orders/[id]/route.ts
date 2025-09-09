import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try { 
    const orderId = params.id
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    
    // الحصول على تفاصيل الطلب من Shipday
    const orderDetailsResponse = await fetch(`https://api.shipday.com/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
    })

    if (!orderDetailsResponse.ok) {
      return NextResponse.json(
        { error: `Failed to find order: ${orderDetailsResponse.status} ${orderDetailsResponse.statusText}` },
        { status: orderDetailsResponse.status }
      )
    }

    const orderDetails = await orderDetailsResponse.json()
    return NextResponse.json(orderDetails)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id // هذا هو orderId الفعلي
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    const body = await request.json()
    
    console.log(`تعديل الطلب باستخدام orderId: ${orderId}`);
    
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

    console.log(`إرسال طلب التعديل إلى Shipday مع orderId: ${orderId}`);
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
      console.log(`تم تحديث الطلب بنجاح في Shipday:`, data);
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      console.error(`خطأ في تحديث الطلب في Shipday: ${response.status} ${response.statusText}`, errorText);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    
    console.log(`حذف الطلب باستخدام orderId: ${orderId}`);
    
    const response = await fetch(`https://api.shipday.com/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
    })

    if (response.ok) {
      console.log(`تم حذف الطلب بنجاح من Shipday`);
      return NextResponse.json({ success: true, message: 'Order deleted successfully' })
    } else {
      const errorText = await response.text()
      console.error(`خطأ في حذف الطلب من Shipday: ${response.status} ${response.statusText}`, errorText);
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