import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'

export function ProductionHubPage() {
  const { isKo } = useI18n()

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '선택 후공정' : 'Optional Downstream'}
        title={isKo ? '제작 허브' : 'Production Hub'}
        description={isKo ? '이미지, 영상, 프롬프트 제작은 본 스토리 개발 이후의 후공정 기능으로 분리합니다.' : 'Image, video, and prompt production are separated as downstream features after core story development.'}
      />

      <div className="grid three-columns">
        <DataCard title={isKo ? '프롬프트 빌더' : 'Prompt Builder'} subtitle={isKo ? '예정 모듈' : 'planned module'}>
          <p className="muted">{isKo ? '스토리 장면이 확정된 뒤 이미지/영상 프롬프트를 생성하는 모듈로 연결합니다.' : 'Connect this module after story scenes are finalized to generate image/video prompts.'}</p>
        </DataCard>
        <DataCard title={isKo ? '에셋' : 'Assets'} subtitle={isKo ? '예정 모듈' : 'planned module'}>
          <p className="muted">{isKo ? '확정된 장면 또는 캐릭터에 연결되는 레퍼런스 이미지/영상을 관리합니다.' : 'Manage reference images and videos linked to finalized scenes or characters.'}</p>
        </DataCard>
        <DataCard title={isKo ? '제작 보드' : 'Production Board'} subtitle={isKo ? '예정 모듈' : 'planned module'}>
          <p className="muted">{isKo ? '시각화/영상화 작업 상태는 별도 후공정 보드로 관리합니다.' : 'Manage visualization/video production status in a separate downstream board.'}</p>
        </DataCard>
      </div>
    </section>
  )
}
