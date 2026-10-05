import type { MapRegion, WorldConfig } from '../../shared/types'
import { createId } from '../../shared/id'

function seededRandom(seed: number) {
  let value = seed % 2147483647
  if (value <= 0) value += 2147483646
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

const continentNames = [
  'Asterion',
  'Velmora',
  'Eldscar',
  'Nocthane',
  'Lyrentha',
  'Kaerun',
  'Solmire',
  'Dravoss',
]

const climates = [
  'polar tundra and blue glaciers',
  'temperate forests and ancient rivers',
  'dry desert basin with buried ruins',
  'volcanic highlands and black stone ridges',
  'humid archipelago with storm seasons',
  'high plateau with thin air and sacred lakes',
]

export function generateRegionsFromWorld(world: WorldConfig): MapRegion[] {
  const random = seededRandom(world.seed)
  const regions: MapRegion[] = []
  const count = Math.max(1, Math.min(world.continentCount, 12))

  for (let index = 0; index < count; index += 1) {
    const centerX = 18 + random() * 64
    const centerY = 18 + random() * 64
    const radiusX = 10 + random() * 12
    const radiusY = 8 + random() * 13
    const pointCount = 9 + Math.floor(random() * 7)

    const points = Array.from({ length: pointCount }).map((_, pointIndex) => {
      const angle = (Math.PI * 2 * pointIndex) / pointCount
      const variance = 0.65 + random() * 0.65
      return {
        x: clamp(centerX + Math.cos(angle) * radiusX * variance),
        y: clamp(centerY + Math.sin(angle) * radiusY * variance),
      }
    })

    const name = continentNames[index] ?? `Continent ${index + 1}`

    regions.push({
      id: createId('region'),
      mapId: world.id,
      name,
      regionType: 'continent',
      points,
      climate: climates[index % climates.length],
      loreSummary: `${name} is a generated landmass shaped by ${world.centralConflict || 'an unresolved historical conflict'}.`,
    })
  }

  return regions
}

function clamp(value: number) {
  return Math.max(3, Math.min(97, Number(value.toFixed(2))))
}

export function pointsToSvg(points: MapRegion['points']) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}
