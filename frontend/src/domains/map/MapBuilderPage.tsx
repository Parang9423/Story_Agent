import { useState } from 'react'
import type { MapRegion, WorldConfig } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { TextArea, TextInput } from '../../shared/ui/FormFields'
import { generateRegionsFromWorld } from './proceduralMap'
import { MapCanvas } from './MapCanvas'

type MapBuilderPageProps = {
  world: WorldConfig | null
  regions: MapRegion[]
  onSaveRegions: (regions: MapRegion[]) => void
}

export function MapBuilderPage({ world, regions, onSaveRegions }: MapBuilderPageProps) {
  const { isKo } = useI18n()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(regions[0]?.id ?? null)
  const selectedRegion = regions.find((region) => region.id === selectedRegionId) ?? null

  const updateRegion = <K extends keyof MapRegion>(key: K, value: MapRegion[K]) => {
    if (!selectedRegion) return
    onSaveRegions(
      regions.map((region) =>
        region.id === selectedRegion.id ? { ...region, [key]: value } : region,
      ),
    )
  }

  const handleRegenerate = () => {
    if (!world) return
    const nextRegions = generateRegionsFromWorld({ ...world, seed: Date.now() })
    onSaveRegions(nextRegions)
    setSelectedRegionId(nextRegions[0]?.id ?? null)
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '세계 시각화' : 'World Visualization'}
        title={isKo ? '지도 빌더' : 'Map Builder'}
        description={isKo ? '세계 설정에서 생성한 대륙을 2D 정사각형 지도에서 보고, 각 지역의 기후와 로어를 편집합니다. 3D Globe는 같은 region 데이터를 기반으로 확장됩니다.' : 'Review generated continents on a square 2D map and edit each region’s climate and lore. The 3D globe will extend from the same region data.'}
        actions={<button type="button" onClick={handleRegenerate} disabled={!world}>{isKo ? '지도 재생성' : 'Regenerate Map'}</button>}
      />

      {!world && (
        <div className="notice">{isKo ? '세계관 빌더에서 세계를 먼저 저장하면 지도를 생성할 수 있습니다.' : 'Save a world in World Builder first to generate a map.'}</div>
      )}

      <div className="grid two-columns map-layout">
        <DataCard title={isKo ? '생성된 2D 지도' : 'Generated 2D Map'} subtitle={isKo ? '대륙을 클릭하면 오른쪽에서 세부 설정을 수정할 수 있습니다.' : 'Click a continent to edit its details on the right.'}>
          <MapCanvas
            regions={regions}
            selectedRegionId={selectedRegionId}
            onSelectRegion={(region) => setSelectedRegionId(region.id)}
          />
        </DataCard>

        <DataCard title={isKo ? '지역 상세' : 'Region Detail'} subtitle={isKo ? '대륙/지역 단위 설정은 이후 국가, 도시, 사건 배치의 기준이 됩니다.' : 'Region-level settings become the basis for nations, cities, and events.'}>
          {selectedRegion ? (
            <div className="form-grid">
              <TextInput label={isKo ? '지역 이름' : 'Region Name'} value={selectedRegion.name} onChange={(value) => updateRegion('name', value)} />
              <TextInput label={isKo ? '지역 타입' : 'Region Type'} value={selectedRegion.regionType} onChange={(value) => updateRegion('regionType', value as MapRegion['regionType'])} />
              <TextArea label={isKo ? '기후' : 'Climate'} value={selectedRegion.climate} onChange={(value) => updateRegion('climate', value)} />
              <TextArea label={isKo ? '로어 요약' : 'Lore Summary'} value={selectedRegion.loreSummary} onChange={(value) => updateRegion('loreSummary', value)} rows={6} />
            </div>
          ) : (
            <p className="muted">{isKo ? '선택된 지역이 없습니다.' : 'No region selected.'}</p>
          )}
        </DataCard>
      </div>
    </section>
  )
}
