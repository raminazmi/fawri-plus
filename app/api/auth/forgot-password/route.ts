import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مطلوب" },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Check if the email exists in your database
    // 2. Generate a secure reset token
    // 3. Store the token with expiration time
    // 4. Send an email with the reset link

    // For now, we'll simulate the process
    console.log(`Password reset requested for: ${email}`)

    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: "إذا كان البريد الإلكتروني موجوداً، ستتلقى رابط إعادة تعيين كلمة المرور"
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
