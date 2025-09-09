import { useAppSelector } from './hooks'
import arTranslations from './translations/ar.json'
import enTranslations from './translations/en.json'

type TranslationKeys = typeof arTranslations

const translations = {
  ar: arTranslations,
  en: enTranslations
}

export function useTranslation() {
  const { currentLanguage } = useAppSelector((state) => state.language)
  
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to Arabic if key not found
        value = translations.ar
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return the key if not found in any language
          }
        }
        break
      }
    }
    
    return typeof value === 'string' ? value : key
  }
  
  return { t, currentLanguage }
}
