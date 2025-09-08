import { NextRequest, NextResponse } from "next/server"
import { addUserToAuth } from "@/lib/auth"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json()
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    if (!["admin", "manager"].includes(role)) {
      return NextResponse.json(
        { error: "الدور غير صالح" },
        { status: 400 }
      )
    }

    const userId = Date.now().toString()
    addUserToAuth({
      id: userId,
      username,
      email,
      password,
      role,
      createdAt: new Date()
    })

    const token = jwt.sign(
      { 
        userId, 
        username, 
        role 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        username,
        role,
        createdAt: new Date()
      }
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
