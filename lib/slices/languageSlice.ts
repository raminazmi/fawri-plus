import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Language = 'ar' | 'en'

interface LanguageState {
  currentLanguage: Language
  direction: 'rtl' | 'ltr'
}

const initialState: LanguageState = {
  currentLanguage: (typeof window !== 'undefined' && localStorage.getItem('language') as Language) || 'ar',
  direction: (typeof window !== 'undefined' && localStorage.getItem('language') === 'en') ? 'ltr' : 'rtl'
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload
      state.direction = action.payload === 'en' ? 'ltr' : 'rtl'
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload)
        // Update HTML attributes
        document.documentElement.lang = action.payload
        document.documentElement.dir = state.direction
      }
    },
    toggleLanguage: (state) => {
      const newLanguage: Language = state.currentLanguage === 'ar' ? 'en' : 'ar'
      state.currentLanguage = newLanguage
      state.direction = newLanguage === 'en' ? 'ltr' : 'rtl'
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage)
        // Update HTML attributes
        document.documentElement.lang = newLanguage
        document.documentElement.dir = state.direction
      }
    }
  }
})

export const { setLanguage, toggleLanguage } = languageSlice.actions
export default languageSlice.reducer
