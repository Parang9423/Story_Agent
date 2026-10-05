import type { StoryWorkspace } from '../../shared/types'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type DashboardPageProps = {
  workspace: StoryWorkspace
}

export function DashboardPage({ workspace }: DashboardPageProps) {
  return (
    <section>
      <SectionHeader
        eyebrow="Story Control Center"
        title="Dashboard"
        description="세계관, 지도, 인물, 관계, 플롯, 장면, 개연성 상태를 한 화면에서 확인합니다."
      />

      <div className="grid four-columns">
        <DataCard title="World" subtitle="world setting">
          <p className="metric">{workspace.world ? '1' : '0'}</p>
          <p className="muted">{workspace.world?.name ?? 'No world defined'}</p>
        </DataCard>
        <DataCard title="Regions" subtitle="map regions">
          <p className="metric">{workspace.regions.length}</p>
        </DataCard>
        <DataCard title="Characters" subtitle="character profiles">
          <p className="metric">{workspace.characters.length}</p>
        </DataCard>
        <DataCard title="Scenes" subtitle="written scenes">
          <p className="metric">{workspace.scenes.length}</p>
        </DataCard>
      </div>

      <div className="grid two-columns">
        <DataCard title="Current Story Axis" subtitle="Story Architect summary">
          {workspace.storyPlan ? (
            <dl className="preview-list compact">
              <div><dt>Logline</dt><dd>{workspace.storyPlan.logline}</dd></div>
              <div><dt>Theme</dt><dd>{workspace.storyPlan.theme}</dd></div>
              <div><dt>Central Question</dt><dd>{workspace.storyPlan.centralQuestion}</dd></div>
              <div><dt>Ending</dt><dd>{workspace.storyPlan.endingDirection}</dd></div>
            </dl>
          ) : (
            <p className="muted">Story Architect에서 전체 구조를 먼저 저장하세요.</p>
          )}
        </DataCard>

        <DataCard title="Development Order" subtitle="본개발 기준 권장 흐름">
          <ol className="ordered-list">
            <li>World Builder에서 세계관 규칙 확정</li>
            <li>Map Builder에서 대륙과 지역 로어 정리</li>
            <li>Character Builder에서 주요 인물 설계</li>
            <li>Relationships에서 기존/placeholder 관계망 구성</li>
            <li>Story Architect에서 전체 플롯 작성</li>
            <li>Scene Writer에서 장면과 대사 작성</li>
            <li>Continuity Check로 개연성 점검</li>
          </ol>
        </DataCard>
      </div>
    </section>
  )
}
