import { useState } from 'react'
import type { CharacterProfile, RelationshipLink } from '../../shared/types'
import { createId } from '../../shared/id'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { SelectField, TextArea, TextInput } from '../../shared/ui/FormFields'

type RelationshipsPageProps = {
  characters: CharacterProfile[]
  relationships: RelationshipLink[]
  onSaveRelationship: (relationship: RelationshipLink) => void
}

const emptyRelationship: RelationshipLink = {
  id: '',
  sourceCharacterId: '',
  targetKind: 'placeholder',
  placeholderName: '',
  relationshipType: '',
  emotionalTone: '',
  conflict: '',
  history: '',
}

export function RelationshipsPage({ characters, relationships, onSaveRelationship }: RelationshipsPageProps) {
  const [draft, setDraft] = useState<RelationshipLink>(emptyRelationship)

  const updateDraft = <K extends keyof RelationshipLink>(key: K, value: RelationshipLink[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSave = () => {
    if (!draft.sourceCharacterId) return
    onSaveRelationship({ ...draft, id: draft.id || createId('relationship') })
    setDraft(emptyRelationship)
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Relationship Graph"
        title="Relationships"
        description="기존 인물뿐 아니라 아직 생성되지 않은 placeholder 인물, 세력, 장소, 과거 사건과의 관계를 기록합니다."
        actions={<button type="button" onClick={handleSave} disabled={!draft.sourceCharacterId}>Save Relationship</button>}
      />

      <div className="grid two-columns">
        <DataCard title="Create Relationship" subtitle="캐릭터의 감정선과 갈등 이력을 구조화합니다.">
          <div className="form-grid">
            <SelectField
              label="Source Character"
              value={draft.sourceCharacterId}
              onChange={(value) => updateDraft('sourceCharacterId', value)}
              options={[
                { value: '', label: 'Select character' },
                ...characters.map((character) => ({ value: character.id, label: character.name })),
              ]}
            />
            <SelectField
              label="Target Kind"
              value={draft.targetKind}
              onChange={(value) => updateDraft('targetKind', value as RelationshipLink['targetKind'])}
              options={[
                { value: 'placeholder', label: 'Placeholder Person' },
                { value: 'character', label: 'Existing Character' },
                { value: 'faction', label: 'Faction' },
                { value: 'location', label: 'Location' },
                { value: 'event', label: 'Past Event' },
              ]}
            />
            <TextInput label="Placeholder / Target Name" value={draft.placeholderName ?? ''} onChange={(value) => updateDraft('placeholderName', value)} />
            <TextInput label="Relationship Type" value={draft.relationshipType} onChange={(value) => updateDraft('relationshipType', value)} placeholder="family, rival, mentor, debtor, hidden enemy" />
            <TextInput label="Emotional Tone" value={draft.emotionalTone} onChange={(value) => updateDraft('emotionalTone', value)} placeholder="guilt, distrust, longing, respect" />
            <TextArea label="Core Conflict" value={draft.conflict} onChange={(value) => updateDraft('conflict', value)} />
            <TextArea label="Shared History" value={draft.history} onChange={(value) => updateDraft('history', value)} />
          </div>
        </DataCard>

        <DataCard title="Relationship List" subtitle="개연성 체크는 이 관계망을 기준으로 감정 변화의 급격함을 검사합니다.">
          {relationships.length === 0 ? (
            <p className="muted">저장된 관계가 없습니다.</p>
          ) : (
            <div className="stack-list">
              {relationships.map((relationship) => {
                const source = characters.find((character) => character.id === relationship.sourceCharacterId)
                return (
                  <div key={relationship.id} className="list-item">
                    <strong>{source?.name ?? 'Unknown'} → {relationship.placeholderName || relationship.targetKind}</strong>
                    <p>{relationship.relationshipType} · {relationship.emotionalTone}</p>
                    <p>{relationship.conflict}</p>
                  </div>
                )
              })}
            </div>
          )}
        </DataCard>
      </div>
    </section>
  )
}
