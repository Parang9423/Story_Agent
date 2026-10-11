import { useState, type FormEvent } from 'react'
import { useI18n } from '../../shared/i18n'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { requestAgentAssistance } from './agentClient'
import type { AgentMode, AgentResponse, AgentSuggestion } from './types'
import './agent.css'

type AgentAssistantPanelProps = {
  mode: AgentMode
  title: string
  description: string
  context: Record<string, unknown>
  onApplySuggestion?: (suggestion: AgentSuggestion) => void
}

export function AgentAssistantPanel({
  mode,
  title,
  description,
  context,
  onApplySuggestion,
}: AgentAssistantPanelProps) {
  const { language, isKo } = useI18n()
  const [userMessage, setUserMessage] = useState('')
  const [response, setResponse] = useState<AgentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userMessage.trim() || isLoading) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextResponse = await requestAgentAssistance({
        mode,
        language,
        userMessage,
        context,
      })
      setResponse(nextResponse)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="agent-panel">
      <div className="agent-panel__header">
        <div>
          <p className="eyebrow">{isKo ? '에이전트 보조' : 'Agent Assistant'}</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="notice notice--warning">
          {isKo
            ? 'Supabase 연결이 필요합니다. .env 설정 후 에이전트를 사용할 수 있습니다.'
            : 'Supabase connection is required. Configure .env before using the agent.'}
        </div>
      )}

      <form className="agent-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>{isKo ? '요청 내용' : 'Request'}</span>
          <textarea
            value={userMessage}
            onChange={(event) => setUserMessage(event.target.value)}
            rows={4}
            placeholder={
              isKo
                ? '예: 선택한 대륙의 이름, 기후, 과거 사건을 세계관 중심 갈등과 맞게 보강해줘.'
                : 'Example: Improve the selected continent name, climate, and past event hooks based on the central world conflict.'
            }
          />
        </label>
        <button type="submit" disabled={!isSupabaseConfigured || isLoading || !userMessage.trim()}>
          {isLoading ? (isKo ? '에이전트 분석 중...' : 'Agent is thinking...') : isKo ? '에이전트에게 요청' : 'Ask Agent'}
        </button>
      </form>

      {errorMessage && (
        <div className="notice notice--warning">
          {isKo ? '에이전트 호출 중 오류가 발생했습니다: ' : 'Agent request failed: '}
          {errorMessage}
        </div>
      )}

      {response && (
        <div className="agent-response">
          <div className="agent-message">
            <strong>{isKo ? '응답' : 'Response'}</strong>
            <p>{response.message}</p>
          </div>

          {response.suggestions.length > 0 && (
            <div className="agent-suggestions">
              <strong>{isKo ? '적용 가능한 제안' : 'Applicable Suggestions'}</strong>
              {response.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                  <div>
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.description}</p>
                    {suggestion.patch && (
                      <dl className="suggestion-patch">
                        {Object.entries(suggestion.patch).map(([key, value]) => (
                          <div key={key}>
                            <dt>{key}</dt>
                            <dd>{String(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                  {onApplySuggestion && suggestion.type !== 'ask_followup' && (
                    <button type="button" onClick={() => onApplySuggestion(suggestion)}>
                      {isKo ? '제안 적용' : 'Apply'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {response.followUpQuestions.length > 0 && (
            <div className="follow-up-list">
              <strong>{isKo ? '다음 질문' : 'Follow-up Questions'}</strong>
              <ul>
                {response.followUpQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}
