import { useState } from 'react'
import type { MapRegion, MapMode, WorldConfig, WorldType } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { createId } from '../../shared/id'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { SelectField, TextArea, TextInput } from '../../shared/ui/FormFields'
import { generateRegionsFromWorld } from '../map/proceduralMap'

type WorldBuilderPageProps = {
  world: WorldConfig | null
  onSaveWorld: (world: WorldConfig, regions: MapRegion[]) => void
}

const defaultWorld: WorldConfig = {
  id: createId('world'),
  name: 'Untitled World',
  worldType: 'planet',
  mapMode: 'flat_2d',
  continentCount: 4,
  dimensionCount: 1,
  planetCount: 1,
  civilizationLevel: 'late medieval society with lost ancient technology',
  magicRule: 'Magic exists, but it demands a physical or emotional cost.',
  scienceRule: 'Technology is unevenly distributed and tied to political power.',
  centralConflict: 'A forgotten catastrophe is returning through distorted geography and memory.',
  seed: 104729,
}

export function WorldBuilderPage({ world, onSaveWorld }: WorldBuilderPageProps) {
  const { isKo } = useI18n()
  const [draft, setDraft] = useState<WorldConfig>(world ?? defaultWorld)

  const updateDraft = <K extends keyof WorldConfig>(key: K, value: WorldConfig[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleGenerate = () => {
    const normalizedDraft = {
      ...draft,
      id: draft.id || createId('world'),
      continentCount: Math.max(1, Number(draft.continentCount) || 1),
      dimensionCount: Math.max(1, Number(draft.dimensionCount) || 1),
      planetCount: Math.max(1, Number(draft.planetCount) || 1),
      seed: Number(draft.seed) || Date.now(),
    }

    onSaveWorld(normalizedDraft, generateRegionsFromWorld(normalizedDraft))
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '세계관 개발' : 'World Development'}
        title={isKo ? '세계관 빌더' : 'World Builder'}
        description={isKo ? '행성, 대륙, 차원, 문명 수준, 세계 규칙을 먼저 정의하고 지도 생성의 기준 데이터로 사용합니다.' : 'Define planets, continents, dimensions, civilization level, and world rules before generating map data.'}
        actions={<button type="button" onClick={handleGenerate}>{isKo ? '저장 및 지도 생성' : 'Save & Generate Map'}</button>}
      />

      <div className="grid two-columns">
        <DataCard title={isKo ? '세계 범위' : 'World Scope'} subtitle={isKo ? '세계의 물리적 범위와 지도 표현 방식을 설정합니다.' : 'Set the physical scope and map representation of the world.'}>
          <div className="form-grid">
            <TextInput label={isKo ? '세계 이름' : 'World Name'} value={draft.name} onChange={(value) => updateDraft('name', value)} />
            <SelectField
              label={isKo ? '세계 타입' : 'World Type'}
              value={draft.worldType}
              onChange={(value) => updateDraft('worldType', value as WorldType)}
              options={[
                { value: 'planet', label: isKo ? '행성' : 'Planet' },
                { value: 'continent', label: isKo ? '단일 대륙' : 'Single Continent' },
                { value: 'dimension', label: isKo ? '단일 차원' : 'Single Dimension' },
                { value: 'multi_dimension', label: isKo ? '다중 차원' : 'Multi Dimension' },
                { value: 'space', label: isKo ? '우주 / 행성계' : 'Space / Planetary System' },
              ]}
            />
            <SelectField
              label={isKo ? '지도 모드' : 'Map Mode'}
              value={draft.mapMode}
              onChange={(value) => updateDraft('mapMode', value as MapMode)}
              options={[
                { value: 'flat_2d', label: isKo ? '정사각형 2D 지도' : 'Square 2D Map' },
                { value: 'globe_3d', label: isKo ? '3D 구형 행성' : '3D Globe' },
              ]}
            />
            <TextInput label={isKo ? '대륙 개수' : 'Continent Count'} type="number" value={draft.continentCount} onChange={(value) => updateDraft('continentCount', Number(value))} />
            <TextInput label={isKo ? '차원 개수' : 'Dimension Count'} type="number" value={draft.dimensionCount} onChange={(value) => updateDraft('dimensionCount', Number(value))} />
            <TextInput label={isKo ? '행성 개수' : 'Planet Count'} type="number" value={draft.planetCount} onChange={(value) => updateDraft('planetCount', Number(value))} />
            <TextInput label={isKo ? '생성 시드' : 'Generation Seed'} type="number" value={draft.seed} onChange={(value) => updateDraft('seed', Number(value))} />
          </div>
        </DataCard>

        <DataCard title={isKo ? '세계 규칙' : 'World Rules'} subtitle={isKo ? '개연성 검사의 기준이 되는 세계관 규칙입니다.' : 'World rules used as the basis for continuity checks.'}>
          <div className="form-grid">
            <TextArea label={isKo ? '문명 수준' : 'Civilization Level'} value={draft.civilizationLevel} onChange={(value) => updateDraft('civilizationLevel', value)} />
            <TextArea label={isKo ? '마법 / 초자연 규칙' : 'Magic / Supernatural Rule'} value={draft.magicRule} onChange={(value) => updateDraft('magicRule', value)} />
            <TextArea label={isKo ? '과학 / 기술 규칙' : 'Science / Technology Rule'} value={draft.scienceRule} onChange={(value) => updateDraft('scienceRule', value)} />
            <TextArea label={isKo ? '중심 세계 갈등' : 'Central World Conflict'} value={draft.centralConflict} onChange={(value) => updateDraft('centralConflict', value)} />
          </div>
        </DataCard>
      </div>
    </section>
  )
}
