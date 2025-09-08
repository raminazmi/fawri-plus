import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log("[API] Testing Shipday connection...")

    // Encode API key for Basic Auth
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'
    const response = await fetch('https://api.shipday.com/orders', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
    })

    console.log("[API] Shipday response status:", response.status)

    if (response.ok) {
      const data = await response.json()
      console.log("[API] Success! Got data:", data)
      return NextResponse.json({ 
        success: true, 
        message: "API connection successful",
        data: data 
      })
    } else {
      const errorText = await response.text()
      console.log("[API] Error response:", errorText)
      return NextResponse.json(
        { 
          success: false,
          error: `Shipday API Error: ${response.status} ${response.statusText}`, 
          details: errorText 
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("[API] Request failed:", error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}