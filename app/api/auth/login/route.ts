import { NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      )
    }

    // Authenticate user with external API
    const authResult = await authenticate(email, password)
    
    if (!authResult) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      )
    }

    // Return user data and external token
    return NextResponse.json({
      success: true,
      user: {
        id: authResult.user.id,
        username: authResult.user.username,
        role: authResult.user.role,
        createdAt: authResult.user.createdAt
      },
      token: authResult.token
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
