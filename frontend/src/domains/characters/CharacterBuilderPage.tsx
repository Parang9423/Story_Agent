import { useMemo, useState } from 'react'
import type { CharacterProfile } from '../../shared/types'
import { useI18n } from '../../shared/i18n'
import { createId } from '../../shared/id'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { DataCard } from '../../shared/ui/DataCard'
import { TextArea } from '../../shared/ui/FormFields'
import { CHARACTER_BUILDER_QUESTIONS } from './characterBuilderFlow'

type CharacterBuilderPageProps = {
  onSaveCharacter: (character: CharacterProfile) => void
}

const emptyCharacter: CharacterProfile = {
  id: '',
  name: '',
  role: '',
  publicPersona: '',
  innerSelf: '',
  coreDesire: '',
  coreFear: '',
  moralCode: '',
  contradiction: '',
  trauma: '',
  speechStyle: '',
  behaviorPattern: '',
  visualSignature: '',
  relationshipNotes: '',
}

export function CharacterBuilderPage({ onSaveCharacter }: CharacterBuilderPageProps) {
  const { language, isKo } = useI18n()
  const [stepIndex, setStepIndex] = useState(0)
  const [draft, setDraft] = useState<CharacterProfile>(emptyCharacter)
  const currentQuestion = CHARACTER_BUILDER_QUESTIONS[stepIndex]

  const completionRate = useMemo(() => {
    const answered = CHARACTER_BUILDER_QUESTIONS.filter((question) =>
      String(draft[question.key]).trim(),
    ).length
    return Math.round((answered / CHARACTER_BUILDER_QUESTIONS.length) * 100)
  }, [draft])

  const updateAnswer = (value: string) => {
    setDraft((current) => ({ ...current, [currentQuestion.key]: value }))
  }

  const handleSave = () => {
    onSaveCharacter({
      ...draft,
      id: draft.id || createId('character'),
      name: draft.name.trim() || (isKo ? '이름 없는 인물' : 'Unnamed Character'),
    })
    setDraft(emptyCharacter)
    setStepIndex(0)
  }

  return (
    <section>
      <SectionHeader
        eyebrow={isKo ? '인물 개발' : 'Character Development'}
        title={isKo ? '인물 빌더' : 'Character Builder'}
        description={isKo ? '성격, 내면, 외형, 말투, 관계 단서를 순차 질문 방식으로 수집해 입체적인 캐릭터를 만듭니다.' : 'Build layered characters by collecting personality, inner self, appearance, speech, and relationship hooks through guided questions.'}
        actions={<button type="button" onClick={handleSave}>{isKo ? '인물 저장' : 'Save Character'}</button>}
      />

      <div className="grid two-columns">
        <DataCard title={`${isKo ? '단계' : 'Step'} ${stepIndex + 1}. ${currentQuestion.label[language]}`} subtitle={`${completionRate}% ${isKo ? '완료' : 'complete'}`}>
          <div className="question-card">
            <p className="question-prompt">{currentQuestion.prompt[language]}</p>
            <TextArea
              label={isKo ? '답변' : 'Answer'}
              value={String(draft[currentQuestion.key])}
              placeholder={currentQuestion.placeholder[language]}
              onChange={updateAnswer}
              rows={7}
            />
            <div className="button-row">
              <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>
                {isKo ? '이전' : 'Previous'}
              </button>
              <button
                type="button"
                onClick={() => setStepIndex(Math.min(CHARACTER_BUILDER_QUESTIONS.length - 1, stepIndex + 1))}
                disabled={stepIndex === CHARACTER_BUILDER_QUESTIONS.length - 1}
              >
                {isKo ? '다음' : 'Next'}
              </button>
            </div>
          </div>
        </DataCard>

        <DataCard title={isKo ? '인물 프로필 미리보기' : 'Character Profile Preview'} subtitle={isKo ? '저장 전 전체 캐릭터 구조를 확인합니다.' : 'Review the full character structure before saving.'}>
          <dl className="preview-list">
            {CHARACTER_BUILDER_QUESTIONS.map((question) => (
              <div key={question.key}>
                <dt>{question.label[language]}</dt>
                <dd>{String(draft[question.key]).trim() || (isKo ? '미답변' : 'Not answered')}</dd>
              </div>
            ))}
          </dl>
        </DataCard>
      </div>
    </section>
  )
}
