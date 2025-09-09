"use client"

import { useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks'

export function LanguageInitializer() {
  const { currentLanguage, direction } = useAppSelector((state) => state.language)

  useEffect(() => {
    // Update HTML attributes when language changes
    document.documentElement.lang = currentLanguage
    document.documentElement.dir = direction
    
    // Add/remove RTL class for additional styling
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl')
      document.documentElement.classList.remove('ltr')
    } else {
      document.documentElement.classList.add('ltr')
      document.documentElement.classList.remove('rtl')
    }
  }, [currentLanguage, direction])

  return null
}
