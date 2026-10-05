import { useMemo, useState } from 'react'
import type { StoryPlan } from '../../shared/types'
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
        eyebrow="Narrative Architecture"
        title="Story Architect"
        description="작품 컨셉, 장르, 주제, 중심 갈등, 결말 방향을 질문 기반으로 수집하고 전체 구조로 정리합니다."
        actions={<button type="button" onClick={handleSave}>Save Story Plan</button>}
      />

      <div className="grid two-columns">
        <DataCard title={`Step ${stepIndex + 1}. ${currentQuestion.label}`} subtitle={`${completionRate}% complete`}>
          <p className="question-prompt">{currentQuestion.prompt}</p>
          <TextArea
            label="Answer"
            value={String(draft[currentQuestion.key])}
            placeholder={currentQuestion.placeholder}
            onChange={(value) => updateDraft(currentQuestion.key, value)}
            rows={7}
          />
          <SelectField
            label="Story Structure"
            value={draft.structureType}
            onChange={(value) => updateDraft('structureType', value as StoryPlan['structureType'])}
            options={[
              { value: 'three_act', label: 'Three Act Structure' },
              { value: 'five_act', label: 'Five Act Structure' },
              { value: 'hero_journey', label: 'Hero Journey' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
          <div className="button-row">
            <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>Previous</button>
            <button type="button" onClick={() => setStepIndex(Math.min(STORY_ARCHITECT_QUESTIONS.length - 1, stepIndex + 1))} disabled={stepIndex === STORY_ARCHITECT_QUESTIONS.length - 1}>Next</button>
          </div>
        </DataCard>

        <DataCard title="Structure Draft" subtitle="막 단위 구조는 Scene Writer와 Continuity Check의 기준이 됩니다.">
          <div className="form-grid">
            {draft.actSummaries.map((summary, index) => (
              <TextArea
                key={index}
                label={`Act ${index + 1}`}
                value={summary}
                placeholder={getActPlaceholder(index)}
                onChange={(value) => updateActSummary(index, value)}
              />
            ))}
          </div>
        </DataCard>
      </div>

      <DataCard title="Story Plan Preview" subtitle="현재까지 입력된 작품의 중심축입니다.">
        <dl className="preview-list compact">
          {STORY_ARCHITECT_QUESTIONS.map((question) => (
            <div key={question.key}>
              <dt>{question.label}</dt>
              <dd>{String(draft[question.key]).trim() || 'Not answered'}</dd>
            </div>
          ))}
        </dl>
      </DataCard>
    </section>
  )
}

function getActPlaceholder(index: number) {
  if (index === 0) return '도입: 세계, 주인공, 결핍, 사건의 발단'
  if (index === 1) return '전개: 추적, 실패, 관계 변화, 중간 반전'
  return '결말: 진실 공개, 최종 선택, 대가, 변화된 세계'
}
