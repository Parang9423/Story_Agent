import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'
import type { AgentRequest, AgentResponse } from './types'

export async function requestAgentAssistance(request: AgentRequest): Promise<AgentResponse> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Configure Supabase first to use the agent assistant.')
  }

  const { data, error } = await supabase.functions.invoke<AgentResponse>('story-agent', {
    body: request,
  })

  if (error) {
    throw new Error(await getFunctionErrorMessage(error))
  }

  if (!data || typeof data.message !== 'string' || !Array.isArray(data.suggestions)) {
    throw new Error('Invalid agent response format')
  }

  return {
    message: data.message,
    suggestions: data.suggestions,
    followUpQuestions: Array.isArray(data.followUpQuestions) ? data.followUpQuestions : [],
  }
}

async function getFunctionErrorMessage(error: unknown) {
  const fallbackMessage = error instanceof Error ? error.message : String(error)
  const context = (error as { context?: unknown })?.context

  if (context instanceof Response) {
    try {
      const body = await context.clone().json() as { error?: unknown; message?: unknown }
      const detail = body.error ?? body.message

      if (typeof detail === 'string' && detail.trim()) {
        return detail
      }
    } catch {
      try {
        const text = await context.clone().text()
        if (text.trim()) return text
      } catch {
        return fallbackMessage
      }
    }
  }

  return fallbackMessage
}
