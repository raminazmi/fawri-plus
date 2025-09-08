import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "الرمز وكلمة المرور الجديدة مطلوبان" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Verify the reset token
    // 2. Check if the token is not expired
    // 3. Update the user's password in the database
    // 4. Invalidate the reset token

    // For now, we'll simulate the process
    console.log(`Password reset with token: ${token}`)

    return NextResponse.json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح"
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
