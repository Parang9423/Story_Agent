import type { ContinuityIssue, StoryWorkspace } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { runContinuityChecks } from './continuityRules'

type ContinuityCheckPageProps = {
  workspace: StoryWorkspace
}

export function ContinuityCheckPage({ workspace }: ContinuityCheckPageProps) {
  const { language, isKo } = useI18n()
  const issues = runContinuityChecks(workspace, language)
  const groupedIssues = groupIssuesBySeverity(issues)

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '스토리 검증' : 'Story Validation'}
        title={isKo ? '개연성 점검' : 'Continuity Check'}
        description={isKo ? '세계관 규칙, 인물 동기, 관계 갈등, 장면 목적, 시간/장소 이동을 기준으로 개연성 문제를 점검합니다.' : 'Check continuity issues using world rules, character motivation, relationship conflict, scene purpose, and time/location movement.'}
      />

      <div className="grid three-columns">
        <DataCard title={isKo ? '치명적' : 'Critical'} subtitle={isKo ? '즉시 수정해야 할 충돌' : 'conflicts to fix immediately'}>
          <Metric value={groupedIssues.critical.length} />
        </DataCard>
        <DataCard title={isKo ? '경고' : 'Warning'} subtitle={isKo ? '개연성이 약한 항목' : 'weak plausibility items'}>
          <Metric value={groupedIssues.warning.length} />
        </DataCard>
        <DataCard title={isKo ? '참고' : 'Info'} subtitle={isKo ? '보강하면 좋은 항목' : 'items worth strengthening'}>
          <Metric value={groupedIssues.info.length} />
        </DataCard>
      </div>

      <DataCard title={isKo ? '개연성 이슈' : 'Continuity Issues'} subtitle={isKo ? '현재 저장된 데이터 기준 자동 점검 결과입니다.' : 'Automatic check results based on current saved data.'}>
        {issues.length === 0 ? (
          <p className="muted">{isKo ? '현재 감지된 개연성 이슈가 없습니다.' : 'No continuity issues detected.'}</p>
        ) : (
          <div className="stack-list">
            {issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} isKo={isKo} />
            ))}
          </div>
        )}
      </DataCard>
    </section>
  )
}

function Metric({ value }: { value: number }) {
  return <p className="metric">{value}</p>
}

function IssueItem({ issue, isKo }: { issue: ContinuityIssue; isKo: boolean }) {
  return (
    <div className={`issue issue--${issue.severity}`}>
      <div className="issue__header">
        <strong>{issue.title}</strong>
        <span>{issue.severity} · {issue.category}</span>
      </div>
      <p>{issue.description}</p>
      <p><strong>{isKo ? '권장 조치' : 'Recommendation'}:</strong> {issue.recommendation}</p>
    </div>
  )
}

function groupIssuesBySeverity(issues: ContinuityIssue[]) {
  return {
    critical: issues.filter((issue) => issue.severity === 'critical'),
    warning: issues.filter((issue) => issue.severity === 'warning'),
    info: issues.filter((issue) => issue.severity === 'info'),
  }
}
