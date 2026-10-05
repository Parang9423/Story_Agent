import { useState } from 'react'
import type { CharacterProfile, RelationshipLink } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
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
  const { isKo } = useI18n()
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
        eyebrow={isKo ? '관계 그래프' : 'Relationship Graph'}
        title={isKo ? '관계망' : 'Relationships'}
        description={isKo ? '기존 인물뿐 아니라 아직 생성되지 않은 placeholder 인물, 세력, 장소, 과거 사건과의 관계를 기록합니다.' : 'Record relationships with existing characters, placeholder people, factions, locations, and past events.'}
        actions={<button type="button" onClick={handleSave} disabled={!draft.sourceCharacterId}>{isKo ? '관계 저장' : 'Save Relationship'}</button>}
      />

      <div className="grid two-columns">
        <DataCard title={isKo ? '관계 생성' : 'Create Relationship'} subtitle={isKo ? '캐릭터의 감정선과 갈등 이력을 구조화합니다.' : 'Structure emotional dynamics and conflict history.'}>
          <div className="form-grid">
            <SelectField
              label={isKo ? '기준 인물' : 'Source Character'}
              value={draft.sourceCharacterId}
              onChange={(value) => updateDraft('sourceCharacterId', value)}
              options={[
                { value: '', label: isKo ? '인물 선택' : 'Select character' },
                ...characters.map((character) => ({ value: character.id, label: character.name })),
              ]}
            />
            <SelectField
              label={isKo ? '대상 종류' : 'Target Kind'}
              value={draft.targetKind}
              onChange={(value) => updateDraft('targetKind', value as RelationshipLink['targetKind'])}
              options={[
                { value: 'placeholder', label: isKo ? '미생성 인물' : 'Placeholder Person' },
                { value: 'character', label: isKo ? '기존 인물' : 'Existing Character' },
                { value: 'faction', label: isKo ? '세력' : 'Faction' },
                { value: 'location', label: isKo ? '장소' : 'Location' },
                { value: 'event', label: isKo ? '과거 사건' : 'Past Event' },
              ]}
            />
            <TextInput label={isKo ? '대상 이름' : 'Placeholder / Target Name'} value={draft.placeholderName ?? ''} onChange={(value) => updateDraft('placeholderName', value)} />
            <TextInput label={isKo ? '관계 유형' : 'Relationship Type'} value={draft.relationshipType} onChange={(value) => updateDraft('relationshipType', value)} placeholder={isKo ? '가족, 라이벌, 멘토, 채무자, 숨은 적' : 'family, rival, mentor, debtor, hidden enemy'} />
            <TextInput label={isKo ? '감정 톤' : 'Emotional Tone'} value={draft.emotionalTone} onChange={(value) => updateDraft('emotionalTone', value)} placeholder={isKo ? '죄책감, 불신, 그리움, 존경' : 'guilt, distrust, longing, respect'} />
            <TextArea label={isKo ? '핵심 갈등' : 'Core Conflict'} value={draft.conflict} onChange={(value) => updateDraft('conflict', value)} />
            <TextArea label={isKo ? '공유된 과거' : 'Shared History'} value={draft.history} onChange={(value) => updateDraft('history', value)} />
          </div>
        </DataCard>

        <DataCard title={isKo ? '관계 목록' : 'Relationship List'} subtitle={isKo ? '개연성 체크는 이 관계망을 기준으로 감정 변화의 급격함을 검사합니다.' : 'Continuity checks use this graph to detect abrupt emotional changes.'}>
          {relationships.length === 0 ? (
            <p className="muted">{isKo ? '저장된 관계가 없습니다.' : 'No relationships saved.'}</p>
          ) : (
            <div className="stack-list">
              {relationships.map((relationship) => {
                const source = characters.find((character) => character.id === relationship.sourceCharacterId)
                return (
                  <div key={relationship.id} className="list-item">
                    <strong>{source?.name ?? (isKo ? '알 수 없음' : 'Unknown')} → {relationship.placeholderName || relationship.targetKind}</strong>
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
