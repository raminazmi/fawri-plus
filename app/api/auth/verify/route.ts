import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "الرمز المطلوب" },
        { status: 400 }
      )
    }

    // For now, just return success
    // In a real application, you would verify the token here
    return NextResponse.json({
      success: true,
      message: "تم التحقق بنجاح"
    })
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
