"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Building2, Info, Package } from "lucide-react"

import logoImg from "../public/images/logo.svg" 

import heroImg from "../public/images/hero-image.svg"

type SiteHeaderProps = {
  showHero?: boolean
}

export function SiteHeader({ showHero = false }: SiteHeaderProps) {
  return (
    <div className="w-full">
      {/* شريط علوي بمعلومات الشركة والتواصل */}
      <div className="w-full bg-[#574b9f] text-[#ececec] border-b border-[#d2d2d2]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {/* يمين: اللوجو واسم الشركة + معلومات الشركة */}
            <div className="flex items-center gap-3 text-right sm:text-left flex-grow">
              <Image
                src={logoImg}
                alt="Fawri Plus Logo"
                width={32}
                height={32}
                className="rounded-full border-2 border-[#59c5c7] flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold leading-tight">Fawri Plus Delivery</span>
                <span className="text-xs opacity-90 text-[#ececec]">BLUE ALFA CONSULTANCY COMPANY • CR 184417-1</span>
              </div>
            </div>

            {/* يسار: وسائل التواصل والعنوان */}
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <Link
                href="tel:33831996"
                className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-[#ececec]"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>3383 1996</span>
              </Link>
              <span className="text-[#d2d2d2] text-opacity-50">|</span>
              <Link
                href="https://maps.app.goo.gl/9xhPbvW2N39cKpcY6"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs hover:underline text-[#ececec]"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>الموقع على الخريطة</span>
              </Link>
              <span className="text-[#d2d2d2] text-opacity-50 hidden md:block">|</span>
              <div className="hidden md:inline-flex items-center gap-1 text-xs text-[#ececec] opacity-90">
                <Building2 className="h-3.5 w-3.5" />
                <span>Office 305, Building 1691Y, Road 432, Block 704</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط الهيدر الرئيسي - فارغ لصفحة تسجيل الدخول */}
      {/* <div className="w-full bg-[#ececec] border-b border-[#d2d2d2] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 flex items-center justify-end">
          <nav className="flex items-center gap-6">
             <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-[#574b9f] text-[#ececec] py-2 px-4 rounded-md text-sm font-bold shadow-md hover:bg-[#444647] transition-colors"
            >
              <Package className="h-4 w-4" />
              تسجيل الدخول
            </Link>
          </nav>
        </div>
      </div> */}

      {/* هيرو اختياري بالصور */}
      {showHero && (
        <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden bg-gradient-to-r from-[#574b9f] via-[#574b9f]/90 to-[#574b9f]/70">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
            {/* الصورة على اليسار */}
            <div className="relative h-full w-full max-w-[400px] flex-shrink-0">
              <Image
                src={heroImg}
                alt="Fawri Plus Delivery Hero"
                priority
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 50vw, 400px"
              />
            </div>
            
            {/* المحتوى على اليمين */}
            <div className="flex flex-col items-end text-right max-w-xl pr-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#59c5c7] text-[#272626] px-3 py-1 text-xs font-bold shadow-md">
                <Info className="h-3.5 w-3.5 text-[#272626]" /> 
                Registered in Kingdom of Bahrain
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#ececec]">
                Fawri Plus Delivery
              </h1>
              <p className="mt-2 text-[#ececec] opacity-90 text-sm sm:text-base leading-relaxed">
                Office 305, Building 1691Y, Road 432, Block 704 — 5GHH+MRR Salmabad, Bahrain
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteHeader