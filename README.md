# Story Agent

Story Agent is a story-development assistant app for building fictional worlds, characters, relationships, plots, scenes, dialogue, and continuity checks.

The core app focuses on **story creation and validation**. Animation, image generation, video generation, and production board features are treated as optional downstream production modules.

## Main Domains

- Dashboard
- World Builder
- Map Builder
- Characters
- Character Builder
- Relationship Builder
- Story Architect
- Scene Writer
- Continuity Check
- Knowledge Base
- Production Hub

## Repository Structure

```text
Story_Agent
├─ frontend
│  ├─ src
│  │  ├─ app
│  │  ├─ domains
│  │  │  ├─ world
│  │  │  ├─ map
│  │  │  ├─ characters
│  │  │  ├─ relationships
│  │  │  ├─ story
│  │  │  ├─ scenes
│  │  │  ├─ continuity
│  │  │  ├─ knowledge
│  │  │  └─ production
│  │  ├─ shared
│  │  └─ lib
├─ supabase
│  └─ migrations
└─ docs
```

## Tech Stack

- React
- TypeScript
- Vite
- Supabase

## Local Development

```bash
git clone https://github.com/Parang9423/Story_Agent.git
cd Story_Agent/frontend
npm install
npm run dev
```

Windows PowerShell에서 npm 실행 정책 문제가 있으면 아래처럼 실행할 수 있습니다.

```powershell
npm.cmd install
npm.cmd run dev
```

## Environment Variables

Copy `frontend/.env.example` to `frontend/.env`.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Supabase 환경변수가 없어도 앱은 로컬 메모리 상태로 실행됩니다. 단, 새로고침 시 데이터가 초기화됩니다.

## Supabase Schema

Apply the migration below when enabling persistence.

```text
supabase/migrations/20261006_create_story_agent_schema.sql
```
