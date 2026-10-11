import type { MapRegion } from '../../shared/types'

export type AgentMode = 'world' | 'map' | 'character' | 'relationship' | 'story' | 'continuity'

export type AgentSuggestionType =
  | 'update_region'
  | 'ask_followup'
  | 'create_character'
  | 'update_character'
  | 'suggest_relationship'

export type AgentRegionPatch = Partial<
  Pick<MapRegion, 'name' | 'regionType' | 'climate' | 'loreSummary'>
>

export type AgentSuggestion = {
  id: string
  type: AgentSuggestionType
  title: string
  description: string
  targetId?: string
  patch?: AgentRegionPatch
  followUpQuestion?: string
  payload?: unknown
}

export type AgentRequest = {
  mode: AgentMode
  language: 'ko' | 'en'
  userMessage: string
  context: Record<string, unknown>
}

export type AgentResponse = {
  message: string
  suggestions: AgentSuggestion[]
  followUpQuestions: string[]
}
