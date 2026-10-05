import type { ReactNode } from 'react'
import type { AppSection } from '../shared/types'
import { useI18n, type Language } from '../shared/i18n'
import { NAVIGATION_GROUP_LABELS, NAVIGATION_ITEMS } from './navigation'

type AppLayoutProps = {
  activeSection: AppSection
  onSectionChange: (section: AppSection) => void
  children: ReactNode
}

const groups = Array.from(new Set(NAVIGATION_ITEMS.map((item) => item.group)))

export function AppLayout({ activeSection, onSectionChange, children }: AppLayoutProps) {
  const { language, setLanguage, isKo } = useI18n()

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SA</span>
          <div>
            <strong>{isKo ? '스토리 에이전트' : 'Story Agent'}</strong>
            <p>{isKo ? '스토리 개발 OS' : 'Story Development OS'}</p>
          </div>
        </div>

        <div className="language-switcher" aria-label={isKo ? '언어 선택' : 'Language selector'}>
          <button
            type="button"
            className={language === 'ko' ? 'language-button language-button--active' : 'language-button'}
            onClick={() => handleLanguageChange('ko')}
          >
            한글
          </button>
          <button
            type="button"
            className={language === 'en' ? 'language-button language-button--active' : 'language-button'}
            onClick={() => handleLanguageChange('en')}
          >
            EN
          </button>
        </div>

        <nav className="nav-groups">
          {groups.map((group) => (
            <div key={group} className="nav-group">
              <p>{NAVIGATION_GROUP_LABELS[group][language]}</p>
              {NAVIGATION_ITEMS.filter((item) => item.group === group).map((item) => (
                <button
                  key={item.section}
                  type="button"
                  className={item.section === activeSection ? 'nav-item nav-item--active' : 'nav-item'}
                  onClick={() => onSectionChange(item.section)}
                >
                  {item.label[language]}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  )
}
