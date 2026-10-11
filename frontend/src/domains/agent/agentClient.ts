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
    throw new Error(error.message)
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
