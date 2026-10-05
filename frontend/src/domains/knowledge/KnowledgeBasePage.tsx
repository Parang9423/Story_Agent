import type { StoryWorkspace } from '../../shared/types'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type KnowledgeBasePageProps = {
  workspace: StoryWorkspace
}

export function KnowledgeBasePage({ workspace }: KnowledgeBasePageProps) {
  return (
    <section>
      <SectionHeader
        eyebrow="Canon Reference"
        title="Knowledge Base"
        description="현재까지 입력된 세계관, 지역, 인물, 관계, 플롯, 장면 정보를 정전(canon) 데이터처럼 한곳에 모읍니다."
      />

      <div className="grid two-columns">
        <DataCard title="World Canon" subtitle="세계관 규칙">
          {workspace.world ? (
            <dl className="preview-list compact">
              <div><dt>Name</dt><dd>{workspace.world.name}</dd></div>
              <div><dt>Type</dt><dd>{workspace.world.worldType}</dd></div>
              <div><dt>Magic Rule</dt><dd>{workspace.world.magicRule}</dd></div>
              <div><dt>Science Rule</dt><dd>{workspace.world.scienceRule}</dd></div>
              <div><dt>Central Conflict</dt><dd>{workspace.world.centralConflict}</dd></div>
            </dl>
          ) : (
            <p className="muted">No world canon yet.</p>
          )}
        </DataCard>

        <DataCard title="Story Canon" subtitle="작품 중심축">
          {workspace.storyPlan ? (
            <dl className="preview-list compact">
              <div><dt>Logline</dt><dd>{workspace.storyPlan.logline}</dd></div>
              <div><dt>Genre</dt><dd>{workspace.storyPlan.genre}</dd></div>
              <div><dt>Tone</dt><dd>{workspace.storyPlan.tone}</dd></div>
              <div><dt>Theme</dt><dd>{workspace.storyPlan.theme}</dd></div>
            </dl>
          ) : (
            <p className="muted">No story plan yet.</p>
          )}
        </DataCard>
      </div>

      <DataCard title="Canon Index" subtitle="검증과 검색의 기준 데이터 목록입니다.">
        <div className="stack-list">
          {workspace.regions.map((region) => <div key={region.id} className="list-item"><strong>Region · {region.name}</strong><p>{region.loreSummary}</p></div>)}
          {workspace.characters.map((character) => <div key={character.id} className="list-item"><strong>Character · {character.name}</strong><p>{character.publicPersona}</p></div>)}
          {workspace.scenes.map((scene) => <div key={scene.id} className="list-item"><strong>Scene #{scene.sequenceNo} · {scene.title}</strong><p>{scene.outcome}</p></div>)}
        </div>
      </DataCard>
    </section>
  )
}
