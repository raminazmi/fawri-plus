import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'

    const response = await fetch('https://api.shipday.com/carriers', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = 'HeGq3pe4OR.9sRBrevMkRqJZjbaTfsa'

    const response = await fetch('https://api.shipday.com/carriers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${apiKey}`,
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