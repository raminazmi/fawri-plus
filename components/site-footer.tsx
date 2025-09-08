"use client"

import React from "react"
import Link from "next/link"
import { MapPin, Phone, Building2 } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-[#d2d2d2] bg-[#ececec] text-[#444647]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-12 items-start">
          <div className="md:col-span-5 text-right">
            <div className="text-lg font-extrabold tracking-tight text-[#272626]">BLUE ALFA CONSULTANCY COMPANY</div>
            <div className="text-sm opacity-80 text-[#444647]">Fawri Plus Delivery</div>
            <p className="text-xs opacity-70 mt-2 leading-relaxed text-[#444647]">
              Limited company • Registered in Kingdom of Bahrain • CR 184417-1
            </p>
          </div>

          <div className="md:col-span-3 text-right">
            <h4 className="font-semibold mb-2 text-sm text-[#272626]">روابط سريعة</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/orders" className="hover:underline text-[#444647] hover:text-[#574b9f]">الطلبات</Link></li>
              <li><Link href="/drivers" className="hover:underline text-[#444647] hover:text-[#574b9f]">السائقون</Link></li>
              <li><Link href="/reports" className="hover:underline text-[#444647] hover:text-[#574b9f]">التقارير</Link></li>
              <li><Link href="/billing" className="hover:underline text-[#444647] hover:text-[#574b9f]">الفوترة</Link></li>
              <li><Link href="/subscriptions" className="hover:underline text-[#444647] hover:text-[#574b9f]">الاشتراكات</Link></li>
              <li><Link href="/settings" className="hover:underline text-[#444647] hover:text-[#574b9f]">الإعدادات</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 text-right">
            <h4 className="font-semibold mb-2 text-sm text-[#272626]">التواصل</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 justify-end">
                <Link href="tel:33831996" className="hover:underline inline-flex items-center gap-2 text-[#444647] hover:text-[#574b9f]">
                  ‏‪3383 1996‬‏ <Phone className="h-4 w-4 text-[#574b9f]" />
                </Link>
              </li>
              <li className="flex items-center gap-2 justify-end opacity-90 text-[#444647]">
                5GHH+MRR Salmabad, Bahrain <MapPin className="h-4 w-4 text-[#574b9f]" />
              </li>
              <li className="flex items-center gap-2 justify-end opacity-90 text-[#444647]">
                Office 305, Building 1691Y, Road 432, Block 704 <Building2 className="h-4 w-4 text-[#574b9f]" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-[#d2d2d2] pt-4 text-center text-xs opacity-70 text-[#444647]">
          © {new Date().getFullYear()} BLUE ALFA CONSULTANCY COMPANY — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}