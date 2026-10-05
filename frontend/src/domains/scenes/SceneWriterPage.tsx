import { useState } from 'react'
import type { CharacterProfile, MapRegion, StoryPlan, StoryScene } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { createId } from '../../shared/id'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { SelectField, TextArea, TextInput } from '../../shared/ui/FormFields'

type SceneWriterPageProps = {
  storyPlan: StoryPlan | null
  characters: CharacterProfile[]
  regions: MapRegion[]
  scenes: StoryScene[]
  onSaveScene: (scene: StoryScene) => void
}

const emptyScene: StoryScene = {
  id: '',
  sequenceNo: 1,
  title: '',
  chapterTitle: '',
  locationName: '',
  povCharacterName: '',
  storyTime: '',
  scenePurpose: '',
  conflict: '',
  emotionalStart: '',
  emotionalEnd: '',
  outcome: '',
  dialogueDraft: '',
  proseDraft: '',
}

export function SceneWriterPage({ storyPlan, characters, regions, scenes, onSaveScene }: SceneWriterPageProps) {
  const { isKo } = useI18n()
  const [draft, setDraft] = useState<StoryScene>({ ...emptyScene, sequenceNo: scenes.length + 1 })

  const updateDraft = <K extends keyof StoryScene>(key: K, value: StoryScene[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSave = () => {
    onSaveScene({ ...draft, id: draft.id || createId('scene'), sequenceNo: Number(draft.sequenceNo) || scenes.length + 1 })
    setDraft({ ...emptyScene, sequenceNo: scenes.length + 2 })
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '장면 개발' : 'Scene Development'}
        title={isKo ? '장면 작성' : 'Scene Writer'}
        description={isKo ? '전체 플롯을 실제 장면, 감정 변화, 갈등, 결과, 대사 초안으로 분해합니다.' : 'Break the full plot into concrete scenes, emotional movement, conflict, outcome, and dialogue draft.'}
        actions={<button type="button" onClick={handleSave}>{isKo ? '장면 저장' : 'Save Scene'}</button>}
      />

      {!storyPlan && <div className="notice">{isKo ? '스토리 설계에서 전체 스토리 구조를 먼저 저장하면 장면 설계 기준이 명확해집니다.' : 'Save the overall story structure in Story Architect first to clarify scene design criteria.'}</div>}

      <div className="grid two-columns">
        <DataCard title={isKo ? '장면 의도' : 'Scene Intent'} subtitle={isKo ? '장면의 목적과 이야기상 기능을 정의합니다.' : 'Define the scene’s purpose and narrative function.'}>
          <div className="form-grid">
            <TextInput label={isKo ? '순서 번호' : 'Sequence No'} type="number" value={draft.sequenceNo} onChange={(value) => updateDraft('sequenceNo', Number(value))} />
            <TextInput label={isKo ? '장면 제목' : 'Scene Title'} value={draft.title} onChange={(value) => updateDraft('title', value)} />
            <TextInput label={isKo ? '챕터 제목' : 'Chapter Title'} value={draft.chapterTitle} onChange={(value) => updateDraft('chapterTitle', value)} />
            <SelectField
              label={isKo ? '시점 인물' : 'POV Character'}
              value={draft.povCharacterName}
              onChange={(value) => updateDraft('povCharacterName', value)}
              options={[
                { value: '', label: isKo ? '시점 인물 선택' : 'Select POV character' },
                ...characters.map((character) => ({ value: character.name, label: character.name })),
              ]}
            />
            <SelectField
              label={isKo ? '장소 / 지역' : 'Location / Region'}
              value={draft.locationName}
              onChange={(value) => updateDraft('locationName', value)}
              options={[
                { value: '', label: isKo ? '장소 선택' : 'Select location' },
                ...regions.map((region) => ({ value: region.name, label: region.name })),
              ]}
            />
            <TextInput label={isKo ? '작중 시간' : 'Story Time'} value={draft.storyTime} onChange={(value) => updateDraft('storyTime', value)} placeholder={isKo ? '3일차 저녁, 본편 10년 전' : 'Day 3 evening, 10 years before main story'} />
            <TextArea label={isKo ? '장면 목적' : 'Scene Purpose'} value={draft.scenePurpose} onChange={(value) => updateDraft('scenePurpose', value)} placeholder={isKo ? '이 장면이 독자에게 전달해야 하는 정보, 감정, 선택' : 'Information, emotion, or decision this scene must deliver'} />
            <TextArea label={isKo ? '갈등' : 'Conflict'} value={draft.conflict} onChange={(value) => updateDraft('conflict', value)} />
            <TextInput label={isKo ? '시작 감정' : 'Emotional Start'} value={draft.emotionalStart} onChange={(value) => updateDraft('emotionalStart', value)} />
            <TextInput label={isKo ? '종료 감정' : 'Emotional End'} value={draft.emotionalEnd} onChange={(value) => updateDraft('emotionalEnd', value)} />
            <TextArea label={isKo ? '결과' : 'Outcome'} value={draft.outcome} onChange={(value) => updateDraft('outcome', value)} />
          </div>
        </DataCard>

        <DataCard title={isKo ? '초안 작성' : 'Draft Writing'} subtitle={isKo ? '대사와 산문 초안을 분리해 저장합니다.' : 'Save dialogue and prose drafts separately.'}>
          <TextArea label={isKo ? '대사 초안' : 'Dialogue Draft'} value={draft.dialogueDraft} onChange={(value) => updateDraft('dialogueDraft', value)} rows={9} />
          <TextArea label={isKo ? '산문 초안' : 'Prose Draft'} value={draft.proseDraft} onChange={(value) => updateDraft('proseDraft', value)} rows={12} />
        </DataCard>
      </div>

      <DataCard title={isKo ? '장면 목록' : 'Scene List'} subtitle={isKo ? '저장된 장면은 개연성 점검에서 검사됩니다.' : 'Saved scenes are checked in Continuity Check.'}>
        {scenes.length === 0 ? (
          <p className="muted">{isKo ? '저장된 장면이 없습니다.' : 'No scenes saved.'}</p>
        ) : (
          <div className="stack-list">
            {scenes.map((scene) => (
              <div key={scene.id} className="list-item">
                <strong>#{scene.sequenceNo} {scene.title}</strong>
                <p>{scene.chapterTitle} · {scene.povCharacterName || (isKo ? '시점 없음' : 'No POV')} @ {scene.locationName || (isKo ? '장소 없음' : 'No location')}</p>
                <p>{scene.scenePurpose}</p>
              </div>
            ))}
          </div>
        )}
      </DataCard>
    </section>
  )
}
