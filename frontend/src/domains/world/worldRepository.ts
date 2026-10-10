import type { MapMode, MapRegion, WorldConfig, WorldType } from '../../shared/types'
import { createId } from '../../shared/id'
import { supabase } from '../../lib/supabaseClient'

type StoryProjectRow = {
  id: string
  title: string
  logline: string | null
  status: 'draft' | 'active' | 'archived'
  created_at: string
  updated_at: string
}

type WorldSettingsRow = {
  id: string
  project_id: string
  name: string
  world_type: WorldType
  map_mode: MapMode
  continent_count: number
  dimension_count: number
  planet_count: number
  civilization_level: string | null
  magic_rule: string | null
  science_rule: string | null
  central_conflict: string | null
  generation_seed: number | null
  created_at: string
  updated_at: string
}

type MapRegionRow = {
  id: string
  project_id: string
  world_id: string | null
  name: string
  region_type: MapRegion['regionType']
  geometry_json: unknown
  climate: string | null
  lore_summary: string | null
  created_at: string
  updated_at: string
}

export type PersistedWorldWorkspace = {
  projectId: string
  world: WorldConfig | null
  regions: MapRegion[]
}

const DEFAULT_PROJECT_TITLE = 'Story Agent Workspace'

let cachedProjectId: string | null = null

export async function loadPersistedWorldWorkspace(): Promise<PersistedWorldWorkspace> {
  const client = requireSupabase()
  const project = await ensureDefaultProject()

  const { data: worldRow, error: worldError } = await client
    .from('world_settings')
    .select('*')
    .eq('project_id', project.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle<WorldSettingsRow>()

  if (worldError) throw worldError

  if (!worldRow) {
    return { projectId: project.id, world: null, regions: [] }
  }

  const { data: regionRows, error: regionError } = await client
    .from('map_regions')
    .select('*')
    .eq('project_id', project.id)
    .eq('world_id', worldRow.id)
    .order('created_at', { ascending: true })
    .returns<MapRegionRow[]>()

  if (regionError) throw regionError

  return {
    projectId: project.id,
    world: mapWorldRow(worldRow),
    regions: (regionRows ?? []).map(mapRegionRow),
  }
}

export async function saveWorldAndRegions(
  world: WorldConfig,
  regions: MapRegion[],
): Promise<{ world: WorldConfig; regions: MapRegion[] }> {
  const client = requireSupabase()
  const project = await ensureDefaultProject()
  const worldPayload = toWorldPayload(project.id, world)

  const { data: worldRow, error: worldError } = await client
    .from('world_settings')
    .upsert(worldPayload)
    .select('*')
    .single<WorldSettingsRow>()

  if (worldError) throw worldError

  const savedRegions = await replaceMapRegions(project.id, worldRow.id, regions)

  return {
    world: mapWorldRow(worldRow),
    regions: savedRegions,
  }
}

export async function saveRegionsForWorld(
  world: WorldConfig,
  regions: MapRegion[],
): Promise<MapRegion[]> {
  const client = requireSupabase()
  const project = await ensureDefaultProject()

  if (!isUuid(world.id)) {
    const result = await saveWorldAndRegions(world, regions)
    return result.regions
  }

  await client
    .from('world_settings')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', world.id)
    .eq('project_id', project.id)

  return replaceMapRegions(project.id, world.id, regions)
}

async function ensureDefaultProject(): Promise<StoryProjectRow> {
  const client = requireSupabase()

  if (cachedProjectId) {
    const { data, error } = await client
      .from('story_projects')
      .select('*')
      .eq('id', cachedProjectId)
      .maybeSingle<StoryProjectRow>()

    if (error) throw error
    if (data) return data
    cachedProjectId = null
  }

  const { data: existingProject, error: existingError } = await client
    .from('story_projects')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle<StoryProjectRow>()

  if (existingError) throw existingError

  if (existingProject) {
    cachedProjectId = existingProject.id
    return existingProject
  }

  const { data: createdProject, error: createError } = await client
    .from('story_projects')
    .insert({ title: DEFAULT_PROJECT_TITLE, status: 'active' })
    .select('*')
    .single<StoryProjectRow>()

  if (createError) throw createError

  cachedProjectId = createdProject.id
  return createdProject
}

async function replaceMapRegions(
  projectId: string,
  worldId: string,
  regions: MapRegion[],
): Promise<MapRegion[]> {
  const client = requireSupabase()

  const { error: deleteError } = await client
    .from('map_regions')
    .delete()
    .eq('project_id', projectId)
    .eq('world_id', worldId)

  if (deleteError) throw deleteError

  if (regions.length === 0) return []

  const payload = regions.map((region) => toRegionPayload(projectId, worldId, region))

  const { data, error } = await client
    .from('map_regions')
    .insert(payload)
    .select('*')
    .order('created_at', { ascending: true })
    .returns<MapRegionRow[]>()

  if (error) throw error

  return (data ?? []).map(mapRegionRow)
}

function toWorldPayload(projectId: string, world: WorldConfig) {
  return {
    ...(isUuid(world.id) ? { id: world.id } : {}),
    project_id: projectId,
    name: world.name,
    world_type: world.worldType,
    map_mode: world.mapMode,
    continent_count: world.continentCount,
    dimension_count: world.dimensionCount,
    planet_count: world.planetCount,
    civilization_level: world.civilizationLevel,
    magic_rule: world.magicRule,
    science_rule: world.scienceRule,
    central_conflict: world.centralConflict,
    generation_seed: world.seed,
    updated_at: new Date().toISOString(),
  }
}

function toRegionPayload(projectId: string, worldId: string, region: MapRegion) {
  return {
    project_id: projectId,
    world_id: worldId,
    name: region.name,
    region_type: region.regionType,
    geometry_json: { points: region.points },
    climate: region.climate,
    lore_summary: region.loreSummary,
    updated_at: new Date().toISOString(),
  }
}

function mapWorldRow(row: WorldSettingsRow): WorldConfig {
  return {
    id: row.id,
    name: row.name,
    worldType: row.world_type,
    mapMode: row.map_mode,
    continentCount: row.continent_count,
    dimensionCount: row.dimension_count,
    planetCount: row.planet_count,
    civilizationLevel: row.civilization_level ?? '',
    magicRule: row.magic_rule ?? '',
    scienceRule: row.science_rule ?? '',
    centralConflict: row.central_conflict ?? '',
    seed: row.generation_seed ?? Date.now(),
  }
}

function mapRegionRow(row: MapRegionRow): MapRegion {
  return {
    id: row.id || createId('region'),
    mapId: row.world_id ?? row.project_id,
    name: row.name,
    regionType: row.region_type,
    points: extractPoints(row.geometry_json),
    climate: row.climate ?? '',
    loreSummary: row.lore_summary ?? '',
  }
}

function extractPoints(value: unknown): Array<{ x: number; y: number }> {
  if (!value || typeof value !== 'object' || !('points' in value)) return []
  const candidate = (value as { points?: unknown }).points

  if (!Array.isArray(candidate)) return []

  return candidate
    .map((point) => {
      if (!point || typeof point !== 'object') return null
      const { x, y } = point as { x?: unknown; y?: unknown }
      const parsedX = Number(x)
      const parsedY = Number(y)

      if (!Number.isFinite(parsedX) || !Number.isFinite(parsedY)) return null
      return { x: parsedX, y: parsedY }
    })
    .filter((point): point is { x: number; y: number } => Boolean(point))
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  return supabase
}
