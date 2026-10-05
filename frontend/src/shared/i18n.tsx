import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'ko' | 'en'

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  isKo: boolean
}

const I18nContext = createContext<I18nContextValue | null>(null)
const STORAGE_KEY = 'story-agent-language'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ko'
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY)
    return storedLanguage === 'en' ? 'en' : 'ko'
  })

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
  }

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language)
    document.documentElement.lang = language === 'ko' ? 'ko-KR' : 'en'
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, isKo: language === 'ko' }),
    [language],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
