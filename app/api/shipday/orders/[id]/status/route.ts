import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[API] Updating order status:", params.id)

    const body = await request.json()
    console.log("[API] Request body:", body)

    // Encode API key for Basic Auth
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    const encodedApiKey = Buffer.from(apiKey + ':').toString('base64')

    const response = await fetch(`https://api.shipday.com/orders/${params.id}/status`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedApiKey}`,
      },
      body: JSON.stringify(body),
    })

    console.log("[API] Shipday response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      console.log("[API] Success! Updated order status:", data)
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
