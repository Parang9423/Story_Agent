import "jsr:@supabase/functions-js/edge-runtime.d.ts"

type AgentMode = 'world' | 'map' | 'character' | 'relationship' | 'story' | 'continuity'

type AgentRequest = {
  mode: AgentMode
  language: 'ko' | 'en'
  userMessage: string
  context: Record<string, unknown>
}

type AgentSuggestion = {
  id: string
  type: string
  title: string
  description: string
  targetId?: string
  patch?: Record<string, unknown>
  followUpQuestion?: string
  payload?: unknown
}

type AgentResponse = {
  message: string
  suggestions: AgentSuggestion[]
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

  try {
    const body = await req.json() as AgentRequest
    const request = normalizeRequest(body)
    const response = await callConfiguredProvider(request)

    return jsonResponse(response, 200)
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('story-agent failed:', message)
    return jsonResponse({ error: message }, 500)
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

async function callConfiguredProvider(request: AgentRequest): Promise<AgentResponse> {
  const provider = (Deno.env.get('LLM_PROVIDER') ?? '').toLowerCase()
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  const openAiApiKey = Deno.env.get('OPENAI_API_KEY')

  if (provider === 'gemini') {
    if (!geminiApiKey) throw new Error('LLM_PROVIDER is gemini, but GEMINI_API_KEY is not configured')
    return callGemini(geminiApiKey, request)
  }

  if (provider === 'openai') {
    if (!openAiApiKey) throw new Error('LLM_PROVIDER is openai, but OPENAI_API_KEY is not configured')
    return callOpenAI(openAiApiKey, request)
  }

  if (geminiApiKey) {
    return callGemini(geminiApiKey, request)
  }

  if (openAiApiKey) {
    return callOpenAI(openAiApiKey, request)
  }

  throw new Error('No LLM provider is configured. Set GEMINI_API_KEY or OPENAI_API_KEY in Supabase Edge Function Secrets.')
}

async function callGemini(apiKey: string, request: AgentRequest): Promise<AgentResponse> {
  const configuredModel = Deno.env.get('GEMINI_MODEL')
  const modelCandidates = uniqueStrings([
    configuredModel,
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
  ])

  let lastModelError = ''

  for (const model of modelCandidates) {
    const normalizedModel = model.replace(/^models\//, '')
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${normalizedModel}:generateContent?key=${encodeURIComponent(apiKey)}`

    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: [
                  buildSystemPrompt(request),
                  'User request JSON:',
                  JSON.stringify({
                    mode: request.mode,
                    language: request.language,
                    userMessage: request.userMessage,
                    context: request.context,
                  }),
                ].join('\n\n'),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      const trimmedError = trimErrorText(errorText)
      lastModelError = `Gemini API request failed with model ${normalizedModel}: ${apiResponse.status} ${trimmedError}`

      if (shouldTryNextGeminiModel(apiResponse.status, modelCandidates, normalizedModel)) {
        console.warn(lastModelError)
        continue
      }

      throw new Error(lastModelError)
    }

    const data = await apiResponse.json()
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (typeof content !== 'string') {
      lastModelError = `Gemini response did not include text content for model ${normalizedModel}`

      if (modelCandidates.length > 1) {
        console.warn(lastModelError)
        continue
      }

      throw new Error(lastModelError)
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(stripJsonFence(content))
    } catch {
      lastModelError = `Gemini response was not valid JSON for model ${normalizedModel}`

      if (modelCandidates.length > 1) {
        console.warn(lastModelError)
        continue
      }

      throw new Error(lastModelError)
    }

    return normalizeAgentResponse(parsed)
  }

  throw new Error(lastModelError || 'Gemini API request failed for all configured model candidates')
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
      response_format: { type: 'json_object' },
    }),
  })

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text()
    throw new Error(`OpenAI API request failed: ${apiResponse.status} ${trimErrorText(errorText)}`)
  }

  const data = await apiResponse.json()
  const content = data?.choices?.[0]?.message?.content

  if (typeof content !== 'string') {
    throw new Error('OpenAI response did not include JSON content')
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(stripJsonFence(content))
  } catch {
    throw new Error('OpenAI response was not valid JSON')
  }

  return normalizeAgentResponse(parsed)
}

function buildSystemPrompt(request: AgentRequest) {
  const languageInstruction = request.language === 'ko'
    ? '모든 사용자 표시 텍스트는 한국어로 작성한다.'
    : 'Write all user-facing text in English.'

  const jsonContract = `Return only one JSON object with this shape:
{
  "message": "short explanation",
  "suggestions": [
    {
      "id": "suggestion_1",
      "type": "update_region | ask_followup | create_character | update_character | suggest_relationship",
      "title": "suggestion title",
      "description": "suggestion description",
      "targetId": "target id or null",
      "patch": {
        "name": "optional region name",
        "regionType": "continent | ocean | mountain | forest | desert | nation | city | dimension_gate",
        "climate": "optional climate text",
        "loreSummary": "optional lore summary text"
      },
      "followUpQuestion": "optional follow-up question or null",
      "payload": null
    }
  ],
  "followUpQuestions": ["question 1", "question 2"]
}`

  const commonRules = [
    'You are a story development assistant for a fiction worldbuilding app.',
    'You suggest improvements; you never claim that changes have already been saved.',
    'Return only valid JSON. Do not wrap it in markdown fences.',
    'Keep suggestions specific, internally consistent, and usable by a UI.',
    'When patching data, preserve existing user intent and improve specificity rather than replacing everything.',
    'Prefer concise but high-value suggestions.',
    languageInstruction,
    jsonContract,
  ].join('\n')

  if (request.mode === 'map') {
    return [
      commonRules,
      'Current task: Map Agent.',
      'Focus on selected region name, climate, loreSummary, geography, trade, war, migration, religion, taboo, historical scars, and links to the central world conflict.',
      'If context.selectedRegion exists, create at most one update_region suggestion for that targetId.',
      'Do not invent impossible geometry or coordinates. Only patch name, regionType, climate, and loreSummary.',
      'Also provide 2-4 follow-up questions that help the user deepen the worldbuilding.',
      'If no selectedRegion exists, return ask_followup suggestions instead of update_region.',
    ].join('\n')
  }

  return [
    commonRules,
    `Current task: ${request.mode} Agent.`,
    'For now, provide advisory suggestions and follow-up questions. Do not return destructive edits.',
  ].join('\n')
}

function normalizeAgentResponse(value: unknown): AgentResponse {
  if (!value || typeof value !== 'object') {
    throw new Error('Agent response JSON root was not an object')
  }

  const candidate = value as Partial<AgentResponse>

  return {
    message: typeof candidate.message === 'string' ? candidate.message : '',
    suggestions: Array.isArray(candidate.suggestions)
      ? candidate.suggestions.map(normalizeSuggestion).filter(Boolean) as AgentSuggestion[]
      : [],
    followUpQuestions: Array.isArray(candidate.followUpQuestions)
      ? candidate.followUpQuestions.filter((question): question is string => typeof question === 'string')
      : [],
  }
}

function normalizeSuggestion(value: unknown, index: number): AgentSuggestion | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Partial<AgentSuggestion>

  return {
    id: typeof candidate.id === 'string' && candidate.id ? candidate.id : `suggestion_${index + 1}`,
    type: typeof candidate.type === 'string' && candidate.type ? candidate.type : 'ask_followup',
    title: typeof candidate.title === 'string' ? candidate.title : `Suggestion ${index + 1}`,
    description: typeof candidate.description === 'string' ? candidate.description : '',
    targetId: typeof candidate.targetId === 'string' ? candidate.targetId : undefined,
    patch: cleanPatch(candidate.patch),
    followUpQuestion: typeof candidate.followUpQuestion === 'string' ? candidate.followUpQuestion : undefined,
    payload: candidate.payload ?? undefined,
  }
}

function cleanPatch(patch: unknown) {
  if (!patch || typeof patch !== 'object') return undefined

  const allowedKeys = new Set(['name', 'regionType', 'climate', 'loreSummary'])

  return Object.fromEntries(
    Object.entries(patch as Record<string, unknown>)
      .filter(([key, value]) => allowedKeys.has(key) && value !== null && value !== undefined && value !== ''),
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

function shouldTryNextGeminiModel(status: number, modelCandidates: string[], attemptedModel: string) {
  if (modelCandidates.length <= 1) return false

  const normalizedCandidates = modelCandidates.map((model) => model.replace(/^models\//, ''))
  const isLastCandidate = normalizedCandidates[normalizedCandidates.length - 1] === attemptedModel

  if (isLastCandidate) return false

  return [404, 429, 500, 502, 503, 504].includes(status)
}

function stripJsonFence(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

function uniqueStrings(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  )
}

function trimErrorText(value: string) {
  return value.length > 700 ? `${value.slice(0, 700)}...` : value
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}
