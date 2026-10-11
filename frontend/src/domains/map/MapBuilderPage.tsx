import { useEffect, useState } from 'react'
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
  onSaveRegions: (regions: MapRegion[]) => void | Promise<void>
}

export function MapBuilderPage({ world, regions, onSaveRegions }: MapBuilderPageProps) {
  const { isKo } = useI18n()
  const [draftRegions, setDraftRegions] = useState<MapRegion[]>(regions)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(regions[0]?.id ?? null)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const selectedRegion = draftRegions.find((region) => region.id === selectedRegionId) ?? null

  useEffect(() => {
    setDraftRegions(regions)
    setSelectedRegionId((currentSelectedRegionId) => {
      if (currentSelectedRegionId && regions.some((region) => region.id === currentSelectedRegionId)) {
        return currentSelectedRegionId
      }

      return regions[0]?.id ?? null
    })
    setIsDirty(false)
  }, [regions])

  const updateRegion = <K extends keyof MapRegion>(key: K, value: MapRegion[K]) => {
    if (!selectedRegion) return

    setDraftRegions((currentRegions) =>
      currentRegions.map((region) =>
        region.id === selectedRegion.id ? { ...region, [key]: value } : region,
      ),
    )
    setIsDirty(true)
  }

  const handleSave = async () => {
    if (!world || !isDirty || isSaving) return

    setIsSaving(true)

    try {
      await onSaveRegions(draftRegions)
      setIsDirty(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = async () => {
    if (!world || isSaving) return

    const nextRegions = generateRegionsFromWorld({ ...world, seed: Date.now() })
    setDraftRegions(nextRegions)
    setSelectedRegionId(nextRegions[0]?.id ?? null)
    setIsDirty(false)
    setIsSaving(true)

    try {
      await onSaveRegions(nextRegions)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '세계 시각화' : 'World Visualization'}
        title={isKo ? '지도 빌더' : 'Map Builder'}
        description={isKo ? '세계 설정에서 생성한 대륙을 2D 정사각형 지도에서 보고, 각 지역의 기후와 로어를 편집합니다. 3D Globe는 같은 region 데이터를 기반으로 확장됩니다.' : 'Review generated continents on a square 2D map and edit each region’s climate and lore. The 3D globe will extend from the same region data.'}
        actions={
          <div className="button-row button-row--header">
            <button type="button" onClick={handleSave} disabled={!world || !isDirty || isSaving}>
              {isSaving ? (isKo ? '저장 중...' : 'Saving...') : isKo ? '지도 수정사항 저장' : 'Save Map Changes'}
            </button>
            <button type="button" onClick={handleRegenerate} disabled={!world || isSaving}>
              {isKo ? '지도 재생성' : 'Regenerate Map'}
            </button>
          </div>
        }
      />

      {!world && (
        <div className="notice">{isKo ? '세계관 빌더에서 세계를 먼저 저장하면 지도를 생성할 수 있습니다.' : 'Save a world in World Builder first to generate a map.'}</div>
      )}

      {isDirty && (
        <div className="notice">
          {isKo
            ? '아직 저장되지 않은 지도 수정사항이 있습니다. 입력을 마친 뒤 “지도 수정사항 저장”을 눌러주세요.'
            : 'You have unsaved map edits. Click “Save Map Changes” after finishing your edits.'}
        </div>
      )}

      <div className="grid two-columns map-layout">
        <DataCard title={isKo ? '생성된 2D 지도' : 'Generated 2D Map'} subtitle={isKo ? '대륙을 클릭하면 오른쪽에서 세부 설정을 수정할 수 있습니다.' : 'Click a continent to edit its details on the right.'}>
          <MapCanvas
            regions={draftRegions}
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
