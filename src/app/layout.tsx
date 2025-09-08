import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "arabic"] })

export const metadata: Metadata = {
  title: "Fawri Plus - نظام إدارة التوصيل",
  description: "نظام متكامل لإدارة الطلبات والتوصيل مع تكامل Shipday API",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
