create extension if not exists pgcrypto;

create table if not exists public.story_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  logline text,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.world_settings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  name text not null,
  world_type text not null check (world_type in ('planet', 'continent', 'dimension', 'multi_dimension', 'space')),
  map_mode text not null check (map_mode in ('flat_2d', 'globe_3d')),
  continent_count integer not null default 1,
  dimension_count integer not null default 1,
  planet_count integer not null default 1,
  civilization_level text,
  magic_rule text,
  science_rule text,
  central_conflict text,
  generation_seed bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.map_regions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  world_id uuid references public.world_settings(id) on delete cascade,
  name text not null,
  region_type text not null check (region_type in ('continent', 'ocean', 'mountain', 'forest', 'desert', 'nation', 'city', 'dimension_gate')),
  geometry_json jsonb not null default '{}'::jsonb,
  climate text,
  lore_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_characters (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  name text not null,
  role text,
  public_persona text,
  inner_self text,
  core_desire text,
  core_fear text,
  moral_code text,
  contradiction text,
  trauma text,
  speech_style text,
  behavior_pattern text,
  visual_signature text,
  relationship_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  source_character_id uuid references public.story_characters(id) on delete cascade,
  target_kind text not null check (target_kind in ('character', 'placeholder', 'faction', 'location', 'event')),
  target_id uuid,
  placeholder_name text,
  relationship_type text,
  emotional_tone text,
  conflict text,
  history text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  logline text,
  genre text,
  tone text,
  theme text,
  protagonist_goal text,
  antagonist_force text,
  central_question text,
  ending_direction text,
  structure_type text not null default 'three_act' check (structure_type in ('three_act', 'five_act', 'hero_journey', 'custom')),
  act_summaries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  story_plan_id uuid references public.story_plans(id) on delete set null,
  sequence_no integer not null,
  title text not null,
  chapter_title text,
  location_name text,
  pov_character_name text,
  story_time text,
  scene_purpose text,
  conflict text,
  emotional_start text,
  emotional_end text,
  outcome text,
  dialogue_draft text,
  prose_draft text,
  continuity_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.continuity_issues (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.story_projects(id) on delete cascade,
  related_scene_id uuid references public.story_scenes(id) on delete set null,
  severity text not null check (severity in ('info', 'warning', 'critical')),
  category text not null check (category in ('character', 'world_rule', 'timeline', 'relationship', 'foreshadowing', 'scene_logic')),
  title text not null,
  description text,
  recommendation text,
  status text not null default 'open' check (status in ('open', 'resolved', 'ignored')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_world_settings_project_id on public.world_settings(project_id);
create index if not exists idx_map_regions_project_id on public.map_regions(project_id);
create index if not exists idx_story_characters_project_id on public.story_characters(project_id);
create index if not exists idx_story_relationships_project_id on public.story_relationships(project_id);
create index if not exists idx_story_plans_project_id on public.story_plans(project_id);
create index if not exists idx_story_scenes_project_id on public.story_scenes(project_id);
create index if not exists idx_continuity_issues_project_id on public.continuity_issues(project_id);

grant select, insert, update, delete on public.story_projects to anon, authenticated;
grant select, insert, update, delete on public.world_settings to anon, authenticated;
grant select, insert, update, delete on public.map_regions to anon, authenticated;
grant select, insert, update, delete on public.story_characters to anon, authenticated;
grant select, insert, update, delete on public.story_relationships to anon, authenticated;
grant select, insert, update, delete on public.story_plans to anon, authenticated;
grant select, insert, update, delete on public.story_scenes to anon, authenticated;
grant select, insert, update, delete on public.continuity_issues to anon, authenticated;
