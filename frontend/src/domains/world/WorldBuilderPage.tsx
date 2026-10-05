import { useState } from 'react'
import type { MapRegion, MapMode, WorldConfig, WorldType } from '../../shared/types'
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
        eyebrow="World Development"
        title="World Builder"
        description="행성, 대륙, 차원, 문명 수준, 세계 규칙을 먼저 정의하고 지도 생성의 기준 데이터로 사용합니다."
        actions={<button type="button" onClick={handleGenerate}>Save & Generate Map</button>}
      />

      <div className="grid two-columns">
        <DataCard title="World Scope" subtitle="세계의 물리적 범위와 지도 표현 방식을 설정합니다.">
          <div className="form-grid">
            <TextInput label="World Name" value={draft.name} onChange={(value) => updateDraft('name', value)} />
            <SelectField
              label="World Type"
              value={draft.worldType}
              onChange={(value) => updateDraft('worldType', value as WorldType)}
              options={[
                { value: 'planet', label: 'Planet' },
                { value: 'continent', label: 'Single Continent' },
                { value: 'dimension', label: 'Single Dimension' },
                { value: 'multi_dimension', label: 'Multi Dimension' },
                { value: 'space', label: 'Space / Planetary System' },
              ]}
            />
            <SelectField
              label="Map Mode"
              value={draft.mapMode}
              onChange={(value) => updateDraft('mapMode', value as MapMode)}
              options={[
                { value: 'flat_2d', label: 'Square 2D Map' },
                { value: 'globe_3d', label: '3D Globe' },
              ]}
            />
            <TextInput label="Continent Count" type="number" value={draft.continentCount} onChange={(value) => updateDraft('continentCount', Number(value))} />
            <TextInput label="Dimension Count" type="number" value={draft.dimensionCount} onChange={(value) => updateDraft('dimensionCount', Number(value))} />
            <TextInput label="Planet Count" type="number" value={draft.planetCount} onChange={(value) => updateDraft('planetCount', Number(value))} />
            <TextInput label="Generation Seed" type="number" value={draft.seed} onChange={(value) => updateDraft('seed', Number(value))} />
          </div>
        </DataCard>

        <DataCard title="World Rules" subtitle="개연성 검사의 기준이 되는 세계관 규칙입니다.">
          <div className="form-grid">
            <TextArea label="Civilization Level" value={draft.civilizationLevel} onChange={(value) => updateDraft('civilizationLevel', value)} />
            <TextArea label="Magic / Supernatural Rule" value={draft.magicRule} onChange={(value) => updateDraft('magicRule', value)} />
            <TextArea label="Science / Technology Rule" value={draft.scienceRule} onChange={(value) => updateDraft('scienceRule', value)} />
            <TextArea label="Central World Conflict" value={draft.centralConflict} onChange={(value) => updateDraft('centralConflict', value)} />
          </div>
        </DataCard>
      </div>
    </section>
  )
}
