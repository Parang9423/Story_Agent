# Story Agent Assistant Design

## Purpose

The agent assistant supports the user while building worlds, maps, characters, relationships, plots, and scenes. The agent should not directly overwrite canonical data. It should generate suggestions that the user can review and explicitly apply.

## Safety Model

```text
User request
→ Edge Function calls LLM
→ LLM returns structured suggestions
→ UI renders suggestion cards
→ User clicks Apply
→ UI updates draft state
→ User clicks Save
→ Supabase persists data
```

This keeps the LLM as a creative assistant, not an automatic database mutator.

## Current Implementation

Implemented first:

- Map Agent
- Supabase Edge Function: `story-agent`
- Frontend reusable component: `AgentAssistantPanel`
- Supported suggestion type: `update_region`

The Map Agent can suggest updates to:

- region name
- region type
- climate
- lore summary

## Planned Agent Modes

### World Agent

- Strengthen world rules
- Suggest civilization, magic, science, and supernatural limits
- Check whether the map configuration matches the world premise

### Map Agent

- Name continents and regions
- Suggest climate and geography
- Add trade, war, religion, migration, taboo, and past-event hooks
- Connect regions to the central world conflict

### Character Agent

- Build layered personality
- Suggest inner desire, fear, contradiction, trauma, speech style, and visual signature
- Ask structured follow-up questions

### Relationship Agent

- Suggest relationships among existing characters
- Create placeholder relationship targets
- Add emotional tone, secrets, debt, betrayal, and shared history

### Story Agent

- Build logline, theme, plot structure, act summaries, scene purpose, and dialogue direction

### Continuity Agent

- Check character motivation, world-rule consistency, timeline, location movement, and relationship changes

## Runtime Secrets

The browser must never contain LLM API keys. The API key must be stored as a Supabase Edge Function secret.

Expected secret:

```text
OPENAI_API_KEY
```

Optional secret:

```text
OPENAI_MODEL
```

Default model in the function:

```text
gpt-4o-mini
```
