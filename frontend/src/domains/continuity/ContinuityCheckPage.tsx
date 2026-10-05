import type { ContinuityIssue, StoryWorkspace } from '../../shared/types'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { runContinuityChecks } from './continuityRules'

type ContinuityCheckPageProps = {
  workspace: StoryWorkspace
}

export function ContinuityCheckPage({ workspace }: ContinuityCheckPageProps) {
  const issues = runContinuityChecks(workspace)
  const groupedIssues = groupIssuesBySeverity(issues)

  return (
    <section>
      <SectionHeader
        eyebrow="Story Validation"
        title="Continuity Check"
        description="세계관 규칙, 인물 동기, 관계 갈등, 장면 목적, 시간/장소 이동을 기준으로 개연성 문제를 점검합니다."
      />

      <div className="grid three-columns">
        <DataCard title="Critical" subtitle="즉시 수정해야 할 충돌">
          <Metric value={groupedIssues.critical.length} />
        </DataCard>
        <DataCard title="Warning" subtitle="개연성이 약한 항목">
          <Metric value={groupedIssues.warning.length} />
        </DataCard>
        <DataCard title="Info" subtitle="보강하면 좋은 항목">
          <Metric value={groupedIssues.info.length} />
        </DataCard>
      </div>

      <DataCard title="Continuity Issues" subtitle="현재 저장된 데이터 기준 자동 점검 결과입니다.">
        {issues.length === 0 ? (
          <p className="muted">현재 감지된 개연성 이슈가 없습니다.</p>
        ) : (
          <div className="stack-list">
            {issues.map((issue) => (
              <IssueItem key={issue.id} issue={issue} />
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

function IssueItem({ issue }: { issue: ContinuityIssue }) {
  return (
    <div className={`issue issue--${issue.severity}`}>
      <div className="issue__header">
        <strong>{issue.title}</strong>
        <span>{issue.severity} · {issue.category}</span>
      </div>
      <p>{issue.description}</p>
      <p><strong>Recommendation:</strong> {issue.recommendation}</p>
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
