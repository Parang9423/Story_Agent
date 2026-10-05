import type { StoryWorkspace } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

type DashboardPageProps = {
  workspace: StoryWorkspace
}

export function DashboardPage({ workspace }: DashboardPageProps) {
  const { isKo } = useI18n()

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '스토리 컨트롤 센터' : 'Story Control Center'}
        title={isKo ? '대시보드' : 'Dashboard'}
        description={isKo ? '세계관, 지도, 인물, 관계, 플롯, 장면, 개연성 상태를 한 화면에서 확인합니다.' : 'Review worldbuilding, maps, characters, relationships, plot, scenes, and continuity status in one place.'}
      />

      <div className="grid four-columns">
        <DataCard title={isKo ? '세계관' : 'World'} subtitle={isKo ? '세계 설정' : 'world setting'}>
          <p className="metric">{workspace.world ? '1' : '0'}</p>
          <p className="muted">{workspace.world?.name ?? (isKo ? '정의된 세계관 없음' : 'No world defined')}</p>
        </DataCard>
        <DataCard title={isKo ? '지역' : 'Regions'} subtitle={isKo ? '지도 지역' : 'map regions'}>
          <p className="metric">{workspace.regions.length}</p>
        </DataCard>
        <DataCard title={isKo ? '인물' : 'Characters'} subtitle={isKo ? '인물 프로필' : 'character profiles'}>
          <p className="metric">{workspace.characters.length}</p>
        </DataCard>
        <DataCard title={isKo ? '장면' : 'Scenes'} subtitle={isKo ? '작성된 장면' : 'written scenes'}>
          <p className="metric">{workspace.scenes.length}</p>
        </DataCard>
      </div>

      <div className="grid two-columns">
        <DataCard title={isKo ? '현재 스토리 축' : 'Current Story Axis'} subtitle={isKo ? '스토리 설계 요약' : 'Story Architect summary'}>
          {workspace.storyPlan ? (
            <dl className="preview-list compact">
              <div><dt>{isKo ? '로그라인' : 'Logline'}</dt><dd>{workspace.storyPlan.logline}</dd></div>
              <div><dt>{isKo ? '주제' : 'Theme'}</dt><dd>{workspace.storyPlan.theme}</dd></div>
              <div><dt>{isKo ? '중심 질문' : 'Central Question'}</dt><dd>{workspace.storyPlan.centralQuestion}</dd></div>
              <div><dt>{isKo ? '결말 방향' : 'Ending'}</dt><dd>{workspace.storyPlan.endingDirection}</dd></div>
            </dl>
          ) : (
            <p className="muted">{isKo ? '스토리 설계에서 전체 구조를 먼저 저장하세요.' : 'Save the overall structure in Story Architect first.'}</p>
          )}
        </DataCard>

        <DataCard title={isKo ? '개발 순서' : 'Development Order'} subtitle={isKo ? '본개발 기준 권장 흐름' : 'recommended full-development workflow'}>
          <ol className="ordered-list">
            <li>{isKo ? '세계관 빌더에서 세계관 규칙 확정' : 'Define world rules in World Builder'}</li>
            <li>{isKo ? '지도 빌더에서 대륙과 지역 로어 정리' : 'Organize continents and regional lore in Map Builder'}</li>
            <li>{isKo ? '인물 빌더에서 주요 인물 설계' : 'Design major characters in Character Builder'}</li>
            <li>{isKo ? '관계망에서 기존/placeholder 관계 구성' : 'Build existing and placeholder relationships'}</li>
            <li>{isKo ? '스토리 설계에서 전체 플롯 작성' : 'Create the full plot in Story Architect'}</li>
            <li>{isKo ? '장면 작성에서 장면과 대사 작성' : 'Write scenes and dialogue in Scene Writer'}</li>
            <li>{isKo ? '개연성 점검으로 충돌 검토' : 'Review conflicts in Continuity Check'}</li>
          </ol>
        </DataCard>
      </div>
    </section>
  )
}
