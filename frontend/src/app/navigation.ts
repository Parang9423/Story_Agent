import type { AppSection } from '../shared/types'
import type { Language } from '../shared/i18n'

export type NavigationGroup = 'coreStory' | 'world' | 'characters' | 'storyWriting' | 'validation' | 'production'

export type NavigationItem = {
  section: AppSection
  label: Record<Language, string>
  group: NavigationGroup
}

export const NAVIGATION_GROUP_LABELS: Record<NavigationGroup, Record<Language, string>> = {
  coreStory: { ko: '스토리 핵심', en: 'Core Story' },
  world: { ko: '세계관', en: 'World' },
  characters: { ko: '인물/관계', en: 'Characters' },
  storyWriting: { ko: '스토리 작성', en: 'Story Writing' },
  validation: { ko: '검증/자료', en: 'Validation' },
  production: { ko: '후공정', en: 'Production' },
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { section: 'dashboard', label: { ko: '대시보드', en: 'Dashboard' }, group: 'coreStory' },
  { section: 'worldBuilder', label: { ko: '세계관 빌더', en: 'World Builder' }, group: 'world' },
  { section: 'mapBuilder', label: { ko: '지도 빌더', en: 'Map Builder' }, group: 'world' },
  { section: 'characters', label: { ko: '인물 목록', en: 'Characters' }, group: 'characters' },
  { section: 'characterBuilder', label: { ko: '인물 빌더', en: 'Character Builder' }, group: 'characters' },
  { section: 'relationships', label: { ko: '관계망', en: 'Relationships' }, group: 'characters' },
  { section: 'storyArchitect', label: { ko: '스토리 설계', en: 'Story Architect' }, group: 'storyWriting' },
  { section: 'sceneWriter', label: { ko: '장면 작성', en: 'Scene Writer' }, group: 'storyWriting' },
  { section: 'continuityCheck', label: { ko: '개연성 점검', en: 'Continuity Check' }, group: 'validation' },
  { section: 'knowledgeBase', label: { ko: '설정 자료실', en: 'Knowledge Base' }, group: 'validation' },
  { section: 'productionHub', label: { ko: '제작 허브', en: 'Production Hub' }, group: 'production' },
]
