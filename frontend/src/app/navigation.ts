import type { AppSection } from '../shared/types'

export type NavigationItem = {
  section: AppSection
  label: string
  group: 'Core Story' | 'World' | 'Characters' | 'Story Writing' | 'Validation' | 'Production'
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { section: 'dashboard', label: 'Dashboard', group: 'Core Story' },
  { section: 'worldBuilder', label: 'World Builder', group: 'World' },
  { section: 'mapBuilder', label: 'Map Builder', group: 'World' },
  { section: 'characters', label: 'Characters', group: 'Characters' },
  { section: 'characterBuilder', label: 'Character Builder', group: 'Characters' },
  { section: 'relationships', label: 'Relationships', group: 'Characters' },
  { section: 'storyArchitect', label: 'Story Architect', group: 'Story Writing' },
  { section: 'sceneWriter', label: 'Scene Writer', group: 'Story Writing' },
  { section: 'continuityCheck', label: 'Continuity Check', group: 'Validation' },
  { section: 'knowledgeBase', label: 'Knowledge Base', group: 'Validation' },
  { section: 'productionHub', label: 'Production Hub', group: 'Production' },
]
