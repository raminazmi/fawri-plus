"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Building2, Info, Package, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { toggleLanguage } from "@/lib/slices/languageSlice"
import { useTranslation } from "@/lib/useTranslation"
import logoImg from "../public/images/logo.svg" 
import heroImg from "../public/images/hero-image.svg"

type SiteHeaderProps = {
  showHero?: boolean
}

export function SiteHeader({ showHero = false }: SiteHeaderProps) {
  const dispatch = useAppDispatch()
  const { currentLanguage } = useAppSelector((state) => state.language)
  const { t } = useTranslation()

  const handleLanguageToggle = () => {
    dispatch(toggleLanguage())
  }

  return (
    <div className="w-full">
      <div className="w-full bg-[#574b9f] text-[#ececec] border-b border-[#d2d2d2]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-right sm:text-left flex-grow">
              <Image
                src={logoImg}
                alt="Fawri Plus Logo"
                width={32}
                height={32}
                className="rounded-full border-2 border-[#59c5c7] flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold leading-tight">{t('header.companyName')}</span>
                <span className="text-xs opacity-90 text-[#ececec]">{t('header.companySubtitle')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <Button
                onClick={handleLanguageToggle}
                variant="ghost"
                size="sm"
                className="inline-flex items-center gap-1 text-xs hover:bg-[#574b9f]/20 text-[#ececec] h-auto py-1 px-2"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{currentLanguage === 'ar' ? 'EN' : 'عربي'}</span>
              </Button>
              <span className="text-[#d2d2d2] text-opacity-50">|</span>
              <Link
                href="tel:33831996"
                className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-[#ececec]"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t('header.phone')}</span>
              </Link>
              <span className="text-[#d2d2d2] text-opacity-50">|</span>
              <Link
                href="https://maps.app.goo.gl/9xhPbvW2N39cKpcY6"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs hover:underline text-[#ececec]"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{t('header.location')}</span>
              </Link>
              <span className="text-[#d2d2d2] text-opacity-50 hidden md:block">|</span>
              <div className="hidden md:inline-flex items-center gap-1 text-xs text-[#ececec] opacity-90">
                <Building2 className="h-3.5 w-3.5" />
                <span>{t('header.address')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {showHero && (
        <div className="relative w-full h-48 sm:h-60 md:h-72 lg:h-80 overflow-hidden bg-gradient-to-r from-[#574b9f] via-[#574b9f]/90 to-[#574b9f]/70">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
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
            
            <div className={`flex flex-col max-w-xl pr-4 ${currentLanguage === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#59c5c7] text-[#272626] px-3 py-1 text-xs font-bold shadow-md">
                <Info className="h-3.5 w-3.5 text-[#272626]" /> 
                {t('header.registered')}
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#ececec]">
                {t('header.companyName')}
              </h1>
              <p className="mt-2 text-[#ececec] opacity-90 text-sm sm:text-base leading-relaxed">
                {t('header.fullAddress')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SiteHeader