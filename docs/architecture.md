# Story Agent Architecture

## Purpose

Story Agent is a story-development application. Its primary purpose is to help users build and validate fictional worlds, characters, relationships, plots, scenes, and dialogue.

Animation, image generation, video generation, and production board features are downstream modules, not the core workflow.

## Domain Boundaries

```text
frontend/src/domains
├─ world          # world rules, planets, continents, dimensions
├─ map            # 2D map and future 3D globe visualization
├─ characters     # character DB and guided character interview
├─ relationships  # character / placeholder / faction / event relationship graph
├─ story          # whole-story architecture and act structure
├─ scenes         # scene, dialogue, prose writing
├─ continuity     # plausibility and continuity checking
├─ knowledge      # canon reference view
└─ production     # optional image/video downstream modules
```

## Current Implementation

The first development baseline includes:

- React + TypeScript + Vite scaffold
- Domain-separated frontend architecture
- World Builder
- 2D SVG Map Builder
- Character Builder guided interview
- Character DB view
- Relationship Builder with placeholder support
- Story Architect guided interview
- Scene Writer
- Continuity Check rule engine
- Knowledge Base view
- Production Hub placeholder
- Supabase schema migration

## Data Persistence Strategy

The current frontend can run without Supabase configuration using local React state.
The Supabase schema is prepared under `supabase/migrations` and should be applied before enabling persistent CRUD services.

## Next Development Phases

1. Connect domain pages to Supabase services.
2. Add story development sessions for resumable agent interviews.
3. Add generated summaries per interview session.
4. Add event/timeline table and deeper continuity checks.
5. Add 3D globe using the existing map region data model.
6. Add LLM-backed question generation and critique flows.
