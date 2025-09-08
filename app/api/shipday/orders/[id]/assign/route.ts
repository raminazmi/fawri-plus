import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    const encodedApiKey = Buffer.from(apiKey + ':').toString('base64')

    const response = await fetch(`https://api.shipday.com/orders/${params.id}/assign`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedApiKey}`,
      },
      body: JSON.stringify(body),
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
