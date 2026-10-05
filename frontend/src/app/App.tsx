import { useMemo, useState } from 'react'
import type { AppSection, CharacterProfile, MapRegion, RelationshipLink, StoryPlan, StoryScene, StoryWorkspace, WorldConfig } from '../shared/types'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { AppLayout } from './AppLayout'
import { DashboardPage } from '../domains/dashboard/DashboardPage'
import { WorldBuilderPage } from '../domains/world/WorldBuilderPage'
import { MapBuilderPage } from '../domains/map/MapBuilderPage'
import { CharactersPage } from '../domains/characters/CharactersPage'
import { CharacterBuilderPage } from '../domains/characters/CharacterBuilderPage'
import { RelationshipsPage } from '../domains/relationships/RelationshipsPage'
import { StoryArchitectPage } from '../domains/story/StoryArchitectPage'
import { SceneWriterPage } from '../domains/scenes/SceneWriterPage'
import { ContinuityCheckPage } from '../domains/continuity/ContinuityCheckPage'
import { KnowledgeBasePage } from '../domains/knowledge/KnowledgeBasePage'
import { ProductionHubPage } from '../domains/production/ProductionHubPage'

export function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard')
  const [world, setWorld] = useState<WorldConfig | null>(null)
  const [regions, setRegions] = useState<MapRegion[]>([])
  const [characters, setCharacters] = useState<CharacterProfile[]>([])
  const [relationships, setRelationships] = useState<RelationshipLink[]>([])
  const [storyPlan, setStoryPlan] = useState<StoryPlan | null>(null)
  const [scenes, setScenes] = useState<StoryScene[]>([])

  const workspace: StoryWorkspace = useMemo(
    () => ({ world, regions, characters, relationships, storyPlan, scenes }),
    [characters, regions, relationships, scenes, storyPlan, world],
  )

  const handleSaveWorld = (nextWorld: WorldConfig, nextRegions: MapRegion[]) => {
    setWorld(nextWorld)
    setRegions(nextRegions)
  }

  const handleSaveCharacter = (nextCharacter: CharacterProfile) => {
    setCharacters((current) => [nextCharacter, ...current])
    setActiveSection('characters')
  }

  const handleSaveRelationship = (nextRelationship: RelationshipLink) => {
    setRelationships((current) => [nextRelationship, ...current])
  }

  const handleSaveScene = (nextScene: StoryScene) => {
    setScenes((current) => [...current, nextScene].sort((a, b) => a.sequenceNo - b.sequenceNo))
  }

  return (
    <AppLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {!isSupabaseConfigured && (
        <div className="notice notice--warning">
          Supabase 환경변수가 없습니다. 현재 화면에서는 로컬 메모리 상태로 동작하며, 새로고침 시 데이터가 초기화됩니다.
        </div>
      )}

      {activeSection === 'dashboard' && <DashboardPage workspace={workspace} />}
      {activeSection === 'worldBuilder' && <WorldBuilderPage world={world} onSaveWorld={handleSaveWorld} />}
      {activeSection === 'mapBuilder' && <MapBuilderPage world={world} regions={regions} onSaveRegions={setRegions} />}
      {activeSection === 'characters' && <CharactersPage characters={characters} />}
      {activeSection === 'characterBuilder' && <CharacterBuilderPage onSaveCharacter={handleSaveCharacter} />}
      {activeSection === 'relationships' && (
        <RelationshipsPage
          characters={characters}
          relationships={relationships}
          onSaveRelationship={handleSaveRelationship}
        />
      )}
      {activeSection === 'storyArchitect' && <StoryArchitectPage storyPlan={storyPlan} onSaveStoryPlan={setStoryPlan} />}
      {activeSection === 'sceneWriter' && (
        <SceneWriterPage
          storyPlan={storyPlan}
          characters={characters}
          regions={regions}
          scenes={scenes}
          onSaveScene={handleSaveScene}
        />
      )}
      {activeSection === 'continuityCheck' && <ContinuityCheckPage workspace={workspace} />}
      {activeSection === 'knowledgeBase' && <KnowledgeBasePage workspace={workspace} />}
      {activeSection === 'productionHub' && <ProductionHubPage />}
    </AppLayout>
  )
}
