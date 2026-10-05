import type { MapRegion } from '../../shared/types'
import { pointsToSvg } from './proceduralMap'

type MapCanvasProps = {
  regions: MapRegion[]
  selectedRegionId?: string | null
  onSelectRegion?: (region: MapRegion) => void
}

export function MapCanvas({ regions, selectedRegionId, onSelectRegion }: MapCanvasProps) {
  return (
    <div className="map-shell">
      <svg viewBox="0 0 100 100" role="img" aria-label="Generated story world map">
        <rect x="0" y="0" width="100" height="100" rx="2" className="map-ocean" />
        {regions.map((region, index) => (
          <polygon
            key={region.id}
            points={pointsToSvg(region.points)}
            className={region.id === selectedRegionId ? 'map-land map-land--selected' : 'map-land'}
            data-region-index={index}
            onClick={() => onSelectRegion?.(region)}
          />
        ))}
        {regions.map((region) => {
          const center = getRegionCenter(region)
          return (
            <text key={`${region.id}-label`} x={center.x} y={center.y} className="map-label">
              {region.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function getRegionCenter(region: MapRegion) {
  const sum = region.points.reduce(
    (acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }),
    { x: 0, y: 0 },
  )

  return {
    x: sum.x / region.points.length,
    y: sum.y / region.points.length,
  }
}
