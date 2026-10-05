import type { CharacterProfile } from '../../shared/types'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type CharactersPageProps = {
  characters: CharacterProfile[]
}

export function CharactersPage({ characters }: CharactersPageProps) {
  return (
    <section>
      <SectionHeader
        eyebrow="Character DB"
        title="Characters"
        description="저장된 캐릭터의 성격, 내면, 외형, 관계 단서를 한 화면에서 검토합니다."
      />

      {characters.length === 0 ? (
        <div className="notice">Character Builder에서 인물을 먼저 생성하세요.</div>
      ) : (
        <div className="card-grid">
          {characters.map((character) => (
            <DataCard key={character.id} title={character.name} subtitle={character.role || 'No role'}>
              <dl className="preview-list compact">
                <div><dt>Public Persona</dt><dd>{character.publicPersona}</dd></div>
                <div><dt>Inner Self</dt><dd>{character.innerSelf}</dd></div>
                <div><dt>Core Desire</dt><dd>{character.coreDesire}</dd></div>
                <div><dt>Core Fear</dt><dd>{character.coreFear}</dd></div>
                <div><dt>Visual Signature</dt><dd>{character.visualSignature}</dd></div>
                <div><dt>Relationship Hooks</dt><dd>{character.relationshipNotes}</dd></div>
              </dl>
            </DataCard>
          ))}
        </div>
      )}
    </section>
  )
}
