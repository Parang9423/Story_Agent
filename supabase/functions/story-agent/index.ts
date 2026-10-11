import "jsr:@supabase/functions-js/edge-runtime.d.ts"

type AgentMode = 'world' | 'map' | 'character' | 'relationship' | 'story' | 'continuity'

type AgentRequest = {
  mode: AgentMode
  language: 'ko' | 'en'
  userMessage: string
  context: Record<string, unknown>
}

type AgentResponse = {
  message: string
  suggestions: Array<{
    id: string
    type: string
    title: string
    description: string
    targetId?: string
    patch?: Record<string, unknown>
    followUpQuestion?: string
    payload?: unknown
  }>
  followUpQuestions: string[]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

  if (!openAiApiKey) {
    return jsonResponse({ error: 'OPENAI_API_KEY is not configured' }, 500)
  }

  try {
    const body = await req.json() as AgentRequest
    const request = normalizeRequest(body)
    const response = await callOpenAI(openAiApiKey, request)

    return jsonResponse(response, 200)
  } catch (error) {
    return jsonResponse({ error: getErrorMessage(error) }, 500)
  }
})

function normalizeRequest(body: AgentRequest): AgentRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body')
  }

  if (!body.userMessage || typeof body.userMessage !== 'string') {
    throw new Error('userMessage is required')
  }

  return {
    mode: body.mode ?? 'map',
    language: body.language === 'en' ? 'en' : 'ko',
    userMessage: body.userMessage.slice(0, 4000),
    context: body.context ?? {},
  }
}

async function callOpenAI(apiKey: string, request: AgentRequest): Promise<AgentResponse> {
  const model = Deno.env.get('OPENAI_MODEL') ?? 'gpt-4o-mini'

  const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(request),
        },
        {
          role: 'user',
          content: JSON.stringify({
            mode: request.mode,
            language: request.language,
            userMessage: request.userMessage,
            context: request.context,
          }),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'story_agent_response',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['message', 'suggestions', 'followUpQuestions'],
            properties: {
              message: { type: 'string' },
              suggestions: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['id', 'type', 'title', 'description', 'targetId', 'patch', 'followUpQuestion', 'payload'],
                  properties: {
                    id: { type: 'string' },
                    type: {
                      type: 'string',
                      enum: ['update_region', 'ask_followup', 'create_character', 'update_character', 'suggest_relationship'],
                    },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    targetId: { type: ['string', 'null'] },
                    patch: {
                      type: ['object', 'null'],
                      additionalProperties: false,
                      required: ['name', 'regionType', 'climate', 'loreSummary'],
                      properties: {
                        name: { type: ['string', 'null'] },
                        regionType: {
                          type: ['string', 'null'],
                          enum: ['continent', 'ocean', 'mountain', 'forest', 'desert', 'nation', 'city', 'dimension_gate', null],
                        },
                        climate: { type: ['string', 'null'] },
                        loreSummary: { type: ['string', 'null'] },
                      },
                    },
                    followUpQuestion: { type: ['string', 'null'] },
                    payload: {
                      type: ['object', 'null'],
                      additionalProperties: false,
                      properties: {},
                    },
                  },
                },
              },
              followUpQuestions: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      },
    }),
  })

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text()
    throw new Error(`OpenAI API request failed: ${apiResponse.status} ${errorText}`)
  }

  const data = await apiResponse.json()
  const content = data?.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('OpenAI response did not include JSON content')
  }

  const parsed = JSON.parse(content) as AgentResponse

  return normalizeAgentResponse(parsed)
}

function buildSystemPrompt(request: AgentRequest) {
  const languageInstruction = request.language === 'ko'
    ? 'Respond in Korean.'
    : 'Respond in English.'

  const commonRules = [
    'You are a story development assistant for a fiction worldbuilding app.',
    'You suggest improvements; you never claim that changes have already been saved.',
    'Return only valid JSON matching the schema.',
    'Keep suggestions specific, internally consistent, and usable by a UI.',
    'When patching data, preserve existing user intent and improve specificity rather than replacing everything.',
    'Prefer concise but high-value suggestions.',
    languageInstruction,
  ].join('\n')

  if (request.mode === 'map') {
    return [
      commonRules,
      'Current task: Map Agent.',
      'Focus on selected region name, climate, loreSummary, geography, trade, war, migration, religion, taboo, historical scars, and links to the central world conflict.',
      'If a selectedRegion exists, create at most one update_region suggestion for that targetId.',
      'Do not invent impossible geometry or coordinates. Only patch name, regionType, climate, and loreSummary.',
      'Also provide 2-4 follow-up questions that help the user deepen the worldbuilding.',
    ].join('\n')
  }

  return [
    commonRules,
    `Current task: ${request.mode} Agent.`,
    'For now, provide advisory suggestions and follow-up questions. Do not return destructive edits.',
  ].join('\n')
}

function normalizeAgentResponse(response: AgentResponse): AgentResponse {
  return {
    message: response.message ?? '',
    suggestions: Array.isArray(response.suggestions)
      ? response.suggestions.map((suggestion, index) => ({
          ...suggestion,
          id: suggestion.id || `suggestion_${index + 1}`,
          targetId: suggestion.targetId ?? undefined,
          patch: cleanPatch(suggestion.patch),
          followUpQuestion: suggestion.followUpQuestion ?? undefined,
          payload: suggestion.payload ?? undefined,
        }))
      : [],
    followUpQuestions: Array.isArray(response.followUpQuestions) ? response.followUpQuestions : [],
  }
}

function cleanPatch(patch: Record<string, unknown> | null | undefined) {
  if (!patch) return undefined

  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  )
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}
