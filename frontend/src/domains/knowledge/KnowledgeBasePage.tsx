import type { StoryWorkspace } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type KnowledgeBasePageProps = {
  workspace: StoryWorkspace
}

export function KnowledgeBasePage({ workspace }: KnowledgeBasePageProps) {
  const { isKo } = useI18n()

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '정전 레퍼런스' : 'Canon Reference'}
        title={isKo ? '설정 자료실' : 'Knowledge Base'}
        description={isKo ? '현재까지 입력된 세계관, 지역, 인물, 관계, 플롯, 장면 정보를 정전(canon) 데이터처럼 한곳에 모읍니다.' : 'Collect world, region, character, relationship, plot, and scene data as canon reference.'}
      />

      <div className="grid two-columns">
        <DataCard title={isKo ? '세계관 정전' : 'World Canon'} subtitle={isKo ? '세계관 규칙' : 'world rules'}>
          {workspace.world ? (
            <dl className="preview-list compact">
              <div><dt>{isKo ? '이름' : 'Name'}</dt><dd>{workspace.world.name}</dd></div>
              <div><dt>{isKo ? '타입' : 'Type'}</dt><dd>{workspace.world.worldType}</dd></div>
              <div><dt>{isKo ? '마법 규칙' : 'Magic Rule'}</dt><dd>{workspace.world.magicRule}</dd></div>
              <div><dt>{isKo ? '과학 규칙' : 'Science Rule'}</dt><dd>{workspace.world.scienceRule}</dd></div>
              <div><dt>{isKo ? '중심 갈등' : 'Central Conflict'}</dt><dd>{workspace.world.centralConflict}</dd></div>
            </dl>
          ) : (
            <p className="muted">{isKo ? '아직 세계관 정전이 없습니다.' : 'No world canon yet.'}</p>
          )}
        </DataCard>

        <DataCard title={isKo ? '스토리 정전' : 'Story Canon'} subtitle={isKo ? '작품 중심축' : 'story axis'}>
          {workspace.storyPlan ? (
            <dl className="preview-list compact">
              <div><dt>{isKo ? '로그라인' : 'Logline'}</dt><dd>{workspace.storyPlan.logline}</dd></div>
              <div><dt>{isKo ? '장르' : 'Genre'}</dt><dd>{workspace.storyPlan.genre}</dd></div>
              <div><dt>{isKo ? '톤' : 'Tone'}</dt><dd>{workspace.storyPlan.tone}</dd></div>
              <div><dt>{isKo ? '주제' : 'Theme'}</dt><dd>{workspace.storyPlan.theme}</dd></div>
            </dl>
          ) : (
            <p className="muted">{isKo ? '아직 스토리 설계가 없습니다.' : 'No story plan yet.'}</p>
          )}
        </DataCard>
      </div>

      <DataCard title={isKo ? '정전 인덱스' : 'Canon Index'} subtitle={isKo ? '검증과 검색의 기준 데이터 목록입니다.' : 'Reference data used for validation and search.'}>
        <div className="stack-list">
          {workspace.regions.map((region) => <div key={region.id} className="list-item"><strong>{isKo ? '지역' : 'Region'} · {region.name}</strong><p>{region.loreSummary}</p></div>)}
          {workspace.characters.map((character) => <div key={character.id} className="list-item"><strong>{isKo ? '인물' : 'Character'} · {character.name}</strong><p>{character.publicPersona}</p></div>)}
          {workspace.scenes.map((scene) => <div key={scene.id} className="list-item"><strong>{isKo ? '장면' : 'Scene'} #{scene.sequenceNo} · {scene.title}</strong><p>{scene.outcome}</p></div>)}
        </div>
      </DataCard>
    </section>
  )
}
