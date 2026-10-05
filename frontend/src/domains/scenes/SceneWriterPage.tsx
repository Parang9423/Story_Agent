import { useState } from 'react'
import type { CharacterProfile, MapRegion, StoryPlan, StoryScene } from '../../shared/types'
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
        eyebrow="Scene Development"
        title="Scene Writer"
        description="전체 플롯을 실제 장면, 감정 변화, 갈등, 결과, 대사 초안으로 분해합니다."
        actions={<button type="button" onClick={handleSave}>Save Scene</button>}
      />

      {!storyPlan && <div className="notice">Story Architect에서 전체 스토리 구조를 먼저 저장하면 장면 설계 기준이 명확해집니다.</div>}

      <div className="grid two-columns">
        <DataCard title="Scene Intent" subtitle="장면의 목적과 이야기상 기능을 정의합니다.">
          <div className="form-grid">
            <TextInput label="Sequence No" type="number" value={draft.sequenceNo} onChange={(value) => updateDraft('sequenceNo', Number(value))} />
            <TextInput label="Scene Title" value={draft.title} onChange={(value) => updateDraft('title', value)} />
            <TextInput label="Chapter Title" value={draft.chapterTitle} onChange={(value) => updateDraft('chapterTitle', value)} />
            <SelectField
              label="POV Character"
              value={draft.povCharacterName}
              onChange={(value) => updateDraft('povCharacterName', value)}
              options={[
                { value: '', label: 'Select POV character' },
                ...characters.map((character) => ({ value: character.name, label: character.name })),
              ]}
            />
            <SelectField
              label="Location / Region"
              value={draft.locationName}
              onChange={(value) => updateDraft('locationName', value)}
              options={[
                { value: '', label: 'Select location' },
                ...regions.map((region) => ({ value: region.name, label: region.name })),
              ]}
            />
            <TextInput label="Story Time" value={draft.storyTime} onChange={(value) => updateDraft('storyTime', value)} placeholder="Day 3 evening, 10 years before main story" />
            <TextArea label="Scene Purpose" value={draft.scenePurpose} onChange={(value) => updateDraft('scenePurpose', value)} placeholder="이 장면이 독자에게 전달해야 하는 정보, 감정, 선택" />
            <TextArea label="Conflict" value={draft.conflict} onChange={(value) => updateDraft('conflict', value)} />
            <TextInput label="Emotional Start" value={draft.emotionalStart} onChange={(value) => updateDraft('emotionalStart', value)} />
            <TextInput label="Emotional End" value={draft.emotionalEnd} onChange={(value) => updateDraft('emotionalEnd', value)} />
            <TextArea label="Outcome" value={draft.outcome} onChange={(value) => updateDraft('outcome', value)} />
          </div>
        </DataCard>

        <DataCard title="Draft Writing" subtitle="대사와 산문 초안을 분리해 저장합니다.">
          <TextArea label="Dialogue Draft" value={draft.dialogueDraft} onChange={(value) => updateDraft('dialogueDraft', value)} rows={9} />
          <TextArea label="Prose Draft" value={draft.proseDraft} onChange={(value) => updateDraft('proseDraft', value)} rows={12} />
        </DataCard>
      </div>

      <DataCard title="Scene List" subtitle="저장된 장면은 Continuity Check에서 검사됩니다.">
        {scenes.length === 0 ? (
          <p className="muted">저장된 장면이 없습니다.</p>
        ) : (
          <div className="stack-list">
            {scenes.map((scene) => (
              <div key={scene.id} className="list-item">
                <strong>#{scene.sequenceNo} {scene.title}</strong>
                <p>{scene.chapterTitle} · {scene.povCharacterName || 'No POV'} @ {scene.locationName || 'No location'}</p>
                <p>{scene.scenePurpose}</p>
              </div>
            ))}
          </div>
        )}
      </DataCard>
    </section>
  )
}
