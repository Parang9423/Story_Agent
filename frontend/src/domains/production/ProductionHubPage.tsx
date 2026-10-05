import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

export function ProductionHubPage() {
  return (
    <section>
      <SectionHeader
        eyebrow="Optional Downstream"
        title="Production Hub"
        description="이미지, 영상, 프롬프트 제작은 본 스토리 개발 이후의 후공정 기능으로 분리합니다."
      />

      <div className="grid three-columns">
        <DataCard title="Prompt Builder" subtitle="planned module">
          <p className="muted">Story Scene이 확정된 뒤 이미지/영상 프롬프트를 생성하는 모듈로 연결합니다.</p>
        </DataCard>
        <DataCard title="Assets" subtitle="planned module">
          <p className="muted">확정된 장면 또는 캐릭터에 연결되는 레퍼런스 이미지/영상을 관리합니다.</p>
        </DataCard>
        <DataCard title="Production Board" subtitle="planned module">
          <p className="muted">시각화/영상화 작업 상태는 별도 후공정 보드로 관리합니다.</p>
        </DataCard>
      </div>
    </section>
  )
}
