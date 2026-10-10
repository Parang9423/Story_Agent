import { useEffect, useMemo, useState } from 'react'
import type { AppSection, CharacterProfile, MapRegion, RelationshipLink, StoryPlan, StoryScene, StoryWorkspace, WorldConfig } from '../shared/types'
import { useI18n } from '../shared/i18n'
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
import { loadPersistedWorldWorkspace, saveRegionsForWorld, saveWorldAndRegions } from '../domains/world/worldRepository'

export function App() {
  const { isKo } = useI18n()
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard')
  const [world, setWorld] = useState<WorldConfig | null>(null)
  const [regions, setRegions] = useState<MapRegion[]>([])
  const [characters, setCharacters] = useState<CharacterProfile[]>([])
  const [relationships, setRelationships] = useState<RelationshipLink[]>([])
  const [storyPlan, setStoryPlan] = useState<StoryPlan | null>(null)
  const [scenes, setScenes] = useState<StoryScene[]>([])
  const [isLoadingRemoteData, setIsLoadingRemoteData] = useState(false)
  const [persistenceError, setPersistenceError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let isMounted = true

    const loadWorkspace = async () => {
      setIsLoadingRemoteData(true)
      setPersistenceError(null)

      try {
        const persistedWorkspace = await loadPersistedWorldWorkspace()

        if (!isMounted) return
        setWorld(persistedWorkspace.world)
        setRegions(persistedWorkspace.regions)
      } catch (error) {
        if (!isMounted) return
        setPersistenceError(getErrorMessage(error))
      } finally {
        if (isMounted) setIsLoadingRemoteData(false)
      }
    }

    void loadWorkspace()

    return () => {
      isMounted = false
    }
  }, [])

  const workspace: StoryWorkspace = useMemo(
    () => ({ world, regions, characters, relationships, storyPlan, scenes }),
    [characters, regions, relationships, scenes, storyPlan, world],
  )

  const handleSaveWorld = async (nextWorld: WorldConfig, nextRegions: MapRegion[]) => {
    setWorld(nextWorld)
    setRegions(nextRegions)
    setPersistenceError(null)

    if (!isSupabaseConfigured) return

    try {
      const saved = await saveWorldAndRegions(nextWorld, nextRegions)
      setWorld(saved.world)
      setRegions(saved.regions)
      setLastSavedAt(new Date().toISOString())
    } catch (error) {
      setPersistenceError(getErrorMessage(error))
    }
  }

  const handleSaveRegions = async (nextRegions: MapRegion[]) => {
    setRegions(nextRegions)
    setPersistenceError(null)

    if (!isSupabaseConfigured || !world) return

    try {
      const savedRegions = await saveRegionsForWorld(world, nextRegions)
      setRegions(savedRegions)
      setLastSavedAt(new Date().toISOString())
    } catch (error) {
      setPersistenceError(getErrorMessage(error))
    }
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
          {isKo
            ? 'Supabase 환경변수가 없습니다. 현재 화면에서는 로컬 메모리 상태로 동작하며, 새로고침 시 데이터가 초기화됩니다.'
            : 'Supabase environment variables are missing. The app is currently running in local memory mode, so data resets after refresh.'}
        </div>
      )}

      {isSupabaseConfigured && isLoadingRemoteData && (
        <div className="notice">
          {isKo ? 'Supabase에서 저장된 세계관/지도 데이터를 불러오는 중입니다.' : 'Loading persisted world and map data from Supabase.'}
        </div>
      )}

      {isSupabaseConfigured && lastSavedAt && (
        <div className="notice notice--success">
          {isKo ? 'Supabase 저장 완료' : 'Saved to Supabase'} · {new Date(lastSavedAt).toLocaleString()}
        </div>
      )}

      {persistenceError && (
        <div className="notice notice--warning">
          {isKo ? 'Supabase 저장/조회 중 오류가 발생했습니다: ' : 'Supabase persistence error: '}
          {persistenceError}
        </div>
      )}

      {activeSection === 'dashboard' && <DashboardPage workspace={workspace} />}
      {activeSection === 'worldBuilder' && <WorldBuilderPage world={world} onSaveWorld={handleSaveWorld} />}
      {activeSection === 'mapBuilder' && <MapBuilderPage world={world} regions={regions} onSaveRegions={handleSaveRegions} />}
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}
