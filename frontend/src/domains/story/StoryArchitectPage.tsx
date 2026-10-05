import { useMemo, useState } from 'react'
import type { StoryPlan } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { createId } from '../../shared/id'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { SelectField, TextArea } from '../../shared/ui/FormFields'
import { STORY_ARCHITECT_QUESTIONS } from './storyArchitectFlow'

type StoryArchitectPageProps = {
  storyPlan: StoryPlan | null
  onSaveStoryPlan: (storyPlan: StoryPlan) => void
}

const emptyStoryPlan: StoryPlan = {
  id: '',
  logline: '',
  genre: '',
  tone: '',
  theme: '',
  protagonistGoal: '',
  antagonistForce: '',
  centralQuestion: '',
  endingDirection: '',
  structureType: 'three_act',
  actSummaries: ['', '', ''],
}

export function StoryArchitectPage({ storyPlan, onSaveStoryPlan }: StoryArchitectPageProps) {
  const { language, isKo } = useI18n()
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState<StoryPlan>(storyPlan ?? emptyStoryPlan)
  const currentQuestion = STORY_ARCHITECT_QUESTIONS[stepIndex]

  const completionRate = useMemo(() => {
    const answered = STORY_ARCHITECT_QUESTIONS.filter((question) =>
      String(draft[question.key]).trim(),
    ).length
    return Math.round((answered / STORY_ARCHITECT_QUESTIONS.length) * 100)
  }, [draft])

  const updateDraft = <K extends keyof StoryPlan>(key: K, value: StoryPlan[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const updateActSummary = (index: number, value: string) => {
    setDraft((current) => ({
      ...current,
      actSummaries: current.actSummaries.map((summary, summaryIndex) =>
        summaryIndex === index ? value : summary,
      ),
    }))
  }

  const handleSave = () => {
    onSaveStoryPlan({ ...draft, id: draft.id || createId('story') })
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '서사 구조 설계' : 'Narrative Architecture'}
        title={isKo ? '스토리 설계' : 'Story Architect'}
        description={isKo ? '작품 컨셉, 장르, 주제, 중심 갈등, 결말 방향을 질문 기반으로 수집하고 전체 구조로 정리합니다.' : 'Collect concept, genre, theme, central conflict, and ending direction through guided questions.'}
        actions={<button type="button" onClick={handleSave}>{isKo ? '스토리 설계 저장' : 'Save Story Plan'}</button>}
      />

      <div className="grid two-columns">
        <DataCard title={`${isKo ? '단계' : 'Step'} ${stepIndex + 1}. ${currentQuestion.label[language]}`} subtitle={`${completionRate}% ${isKo ? '완료' : 'complete'}`}>
          <p className="question-prompt">{currentQuestion.prompt[language]}</p>
          <TextArea
            label={isKo ? '답변' : 'Answer'}
            value={String(draft[currentQuestion.key])}
            placeholder={currentQuestion.placeholder[language]}
            onChange={(value) => updateDraft(currentQuestion.key, value)}
            rows={7}
          />
          <SelectField
            label={isKo ? '스토리 구조' : 'Story Structure'}
            value={draft.structureType}
            onChange={(value) => updateDraft('structureType', value as StoryPlan['structureType'])}
            options={[
              { value: 'three_act', label: isKo ? '3막 구조' : 'Three Act Structure' },
              { value: 'five_act', label: isKo ? '5막 구조' : 'Five Act Structure' },
              { value: 'hero_journey', label: isKo ? '영웅 서사' : 'Hero Journey' },
              { value: 'custom', label: isKo ? '사용자 정의' : 'Custom' },
            ]}
          />
          <div className="button-row">
            <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>{isKo ? '이전' : 'Previous'}</button>
            <button type="button" onClick={() => setStepIndex(Math.min(STORY_ARCHITECT_QUESTIONS.length - 1, stepIndex + 1))} disabled={stepIndex === STORY_ARCHITECT_QUESTIONS.length - 1}>{isKo ? '다음' : 'Next'}</button>
          </div>
        </DataCard>

        <DataCard title={isKo ? '구조 초안' : 'Structure Draft'} subtitle={isKo ? '막 단위 구조는 장면 작성과 개연성 점검의 기준이 됩니다.' : 'Act-level structure guides Scene Writer and Continuity Check.'}>
          <div className="form-grid">
            {draft.actSummaries.map((summary, index) => (
              <TextArea
                key={index}
                label={`${isKo ? '막' : 'Act'} ${index + 1}`}
                value={summary}
                placeholder={getActPlaceholder(index, isKo)}
                onChange={(value) => updateActSummary(index, value)}
              />
            ))}
          </div>
        </DataCard>
      </div>

      <DataCard title={isKo ? '스토리 설계 미리보기' : 'Story Plan Preview'} subtitle={isKo ? '현재까지 입력된 작품의 중심축입니다.' : 'The central axis of the story so far.'}>
        <dl className="preview-list compact">
          {STORY_ARCHITECT_QUESTIONS.map((question) => (
            <div key={question.key}>
              <dt>{question.label[language]}</dt>
              <dd>{String(draft[question.key]).trim() || (isKo ? '미답변' : 'Not answered')}</dd>
            </div>
          ))}
        </dl>
      </DataCard>
    </section>
  )
}

function getActPlaceholder(index: number, isKo: boolean) {
  if (isKo) {
    if (index === 0) return '도입: 세계, 주인공, 결핍, 사건의 발단'
    if (index === 1) return '전개: 추적, 실패, 관계 변화, 중간 반전'
    return '결말: 진실 공개, 최종 선택, 대가, 변화된 세계'
  }

  if (index === 0) return 'Setup: world, protagonist, lack, inciting incident'
  if (index === 1) return 'Development: pursuit, failure, relationship shift, midpoint reversal'
  return 'Ending: truth revealed, final choice, cost, transformed world'
}
