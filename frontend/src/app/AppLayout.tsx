import type { AppSection } from '../shared/types'
import { NAVIGATION_ITEMS } from './navigation'

type AppLayoutProps = {
  activeSection: AppSection
  onSectionChange: (section: AppSection) => void
  children: React.ReactNode
}

const groups = Array.from(new Set(NAVIGATION_ITEMS.map((item) => item.group)))

export function AppLayout({ activeSection, onSectionChange, children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SA</span>
          <div>
            <strong>Story Agent</strong>
            <p>Story Development OS</p>
          </div>
        </div>

        <nav className="nav-groups">
          {groups.map((group) => (
            <div key={group} className="nav-group">
              <p>{group}</p>
              {NAVIGATION_ITEMS.filter((item) => item.group === group).map((item) => (
                <button
                  key={item.section}
                  type="button"
                  className={item.section === activeSection ? 'nav-item nav-item--active' : 'nav-item'}
                  onClick={() => onSectionChange(item.section)}
                >
                  {item.label}
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
