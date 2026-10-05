import type { CharacterProfile } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type CharactersPageProps = {
  characters: CharacterProfile[]
}

export function CharactersPage({ characters }: CharactersPageProps) {
  const { isKo } = useI18n()

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '인물 DB' : 'Character DB'}
        title={isKo ? '인물 목록' : 'Characters'}
        description={isKo ? '저장된 캐릭터의 성격, 내면, 외형, 관계 단서를 한 화면에서 검토합니다.' : 'Review saved characters, inner conflicts, visual signatures, and relationship hooks.'}
      />

      {characters.length === 0 ? (
        <div className="notice">{isKo ? '인물 빌더에서 인물을 먼저 생성하세요.' : 'Create a character in Character Builder first.'}</div>
      ) : (
        <div className="card-grid">
          {characters.map((character) => (
            <DataCard key={character.id} title={character.name} subtitle={character.role || (isKo ? '역할 없음' : 'No role')}>
              <dl className="preview-list compact">
                <div><dt>{isKo ? '외적 성격' : 'Public Persona'}</dt><dd>{character.publicPersona}</dd></div>
                <div><dt>{isKo ? '내면' : 'Inner Self'}</dt><dd>{character.innerSelf}</dd></div>
                <div><dt>{isKo ? '핵심 욕망' : 'Core Desire'}</dt><dd>{character.coreDesire}</dd></div>
                <div><dt>{isKo ? '핵심 두려움' : 'Core Fear'}</dt><dd>{character.coreFear}</dd></div>
                <div><dt>{isKo ? '외형 시그니처' : 'Visual Signature'}</dt><dd>{character.visualSignature}</dd></div>
                <div><dt>{isKo ? '관계 단서' : 'Relationship Hooks'}</dt><dd>{character.relationshipNotes}</dd></div>
              </dl>
            </DataCard>
          ))}
        </div>
      )}
    </section>
  )
}
