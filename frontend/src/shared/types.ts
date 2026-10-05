export type ID = string

export type AppSection =
  | 'dashboard'
  | 'worldBuilder'
  | 'mapBuilder'
  | 'characters'
  | 'characterBuilder'
  | 'relationships'
  | 'storyArchitect'
  | 'sceneWriter'
  | 'continuityCheck'
  | 'knowledgeBase'
  | 'productionHub'

export type WorldType = 'planet' | 'continent' | 'dimension' | 'multi_dimension' | 'space'
export type MapMode = 'flat_2d' | 'globe_3d'

export type WorldConfig = {
  id: ID
  name: string
  worldType: WorldType
  mapMode: MapMode
  continentCount: number
  dimensionCount: number
  planetCount: number
  civilizationLevel: string
  magicRule: string
  scienceRule: string
  centralConflict: string
  seed: number
}

export type MapRegion = {
  id: ID
  mapId: ID
  name: string
  regionType: 'continent' | 'ocean' | 'mountain' | 'forest' | 'desert' | 'nation' | 'city' | 'dimension_gate'
  points: Array<{ x: number; y: number }>
  climate: string
  loreSummary: string
}

export type CharacterProfile = {
  id: ID
  name: string
  role: string
  publicPersona: string
  innerSelf: string
  coreDesire: string
  coreFear: string
  moralCode: string
  contradiction: string
  trauma: string
  speechStyle: string
  behaviorPattern: string
  visualSignature: string
  relationshipNotes: string
}

export type RelationshipLink = {
  id: ID
  sourceCharacterId: ID
  targetKind: 'character' | 'placeholder' | 'faction' | 'location' | 'event'
  targetId?: ID
  placeholderName?: string
  relationshipType: string
  emotionalTone: string
  conflict: string
  history: string
}

export type StoryPlan = {
  id: ID
  logline: string
  genre: string
  tone: string
  theme: string
  protagonistGoal: string
  antagonistForce: string
  centralQuestion: string
  endingDirection: string
  structureType: 'three_act' | 'five_act' | 'hero_journey' | 'custom'
  actSummaries: string[]
}

export type StoryScene = {
  id: ID
  sequenceNo: number
  title: string
  chapterTitle: string
  locationName: string
  povCharacterName: string
  storyTime: string
  scenePurpose: string
  conflict: string
  emotionalStart: string
  emotionalEnd: string
  outcome: string
  dialogueDraft: string
  proseDraft: string
}

export type ContinuityIssue = {
  id: ID
  severity: 'info' | 'warning' | 'critical'
  category: 'character' | 'world_rule' | 'timeline' | 'relationship' | 'foreshadowing' | 'scene_logic'
  title: string
  description: string
  recommendation: string
}

export type StoryWorkspace = {
  world: WorldConfig | null
  regions: MapRegion[]
  characters: CharacterProfile[]
  relationships: RelationshipLink[]
  storyPlan: StoryPlan | null
  scenes: StoryScene[]
}
