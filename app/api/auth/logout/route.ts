import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح"
    })

    // Clear the auth token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
