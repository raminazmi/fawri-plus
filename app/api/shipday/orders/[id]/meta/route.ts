import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    const body = await request.json()
    
    console.log('=== تحديث معلومات الطلب ===');
    console.log('orderId:', orderId);
    console.log('body:', body);
    
    if (!orderId) {
      console.error('orderId مفقود');
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      )
    }
    
    console.log(`إرسال طلب تحديث معلومات: ${orderId}`);
    
    const response = await fetch(`https://api.shipday.com/orders/${orderId}/meta`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    console.log('استجابة Shipday:', response.status, response.statusText);

    if (response.ok) {
      const data = await response.json()
      console.log(`تم تحديث معلومات الطلب بنجاح:`, data);
      return NextResponse.json(data)
    } else {
      const errorText = await response.text()
      console.error(`خطأ في تحديث معلومات الطلب: ${response.status} ${response.statusText}`, errorText);
      return NextResponse.json(
        { error: `Shipday API Error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('خطأ في API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
