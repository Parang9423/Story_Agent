import type { Language } from '../../shared/i18n'

export type StoryQuestion = {
  key:
    | 'logline'
    | 'genre'
    | 'tone'
    | 'theme'
    | 'protagonistGoal'
    | 'antagonistForce'
    | 'centralQuestion'
    | 'endingDirection'
  label: Record<Language, string>
  prompt: Record<Language, string>
  placeholder: Record<Language, string>
}

export const STORY_ARCHITECT_QUESTIONS: StoryQuestion[] = [
  {
    key: 'logline',
    label: { ko: '로그라인', en: 'Logline' },
    prompt: { ko: '이야기를 한 문장으로 설명한다면 무엇인가요?', en: 'If you described this story in one sentence, what would it be?' },
    placeholder: { ko: '몰락한 북부 도시의 생존자가 세계를 얼어붙게 만든 진실을 추적한다.', en: 'A survivor of a fallen northern city hunts the truth that froze the world.' },
  },
  {
    key: 'genre',
    label: { ko: '장르', en: 'Genre' },
    prompt: { ko: '장르는 무엇이며 어떤 장르 규칙을 따르나요?', en: 'What is the genre, and what genre rules should it follow?' },
    placeholder: { ko: '다크 판타지, 미스터리, 정치 스릴러', en: 'Dark fantasy, mystery, political thriller' },
  },
  {
    key: 'tone',
    label: { ko: '톤', en: 'Tone' },
    prompt: { ko: '작품의 정서와 문체 톤은 어떤가요?', en: 'What emotional and prose tone should the work have?' },
    placeholder: { ko: '차갑고 비극적이지만 마지막에는 희미한 구원이 남는 톤', en: 'Cold and tragic, but with a faint sense of salvation at the end' },
  },
  {
    key: 'theme',
    label: { ko: '주제', en: 'Theme' },
    prompt: { ko: '이야기가 끝났을 때 독자가 어떤 질문이나 감정을 남기길 원하나요?', en: 'What question or feeling should remain with the reader after the story ends?' },
    placeholder: { ko: '기억을 잃지 않는 것이 과연 구원인가, 저주인가', en: 'Is refusing to forget salvation, or a curse?' },
  },
  {
    key: 'protagonistGoal',
    label: { ko: '주인공 목표', en: 'Protagonist Goal' },
    prompt: { ko: '주인공의 외적 목표와 내적 목표는 무엇인가요?', en: 'What are the protagonist’s external and internal goals?' },
    placeholder: { ko: '도시 봉쇄의 원인을 밝히고, 자신이 버림받았다는 믿음을 극복한다.', en: 'Uncover why the city was sealed and overcome the belief that they were abandoned.' },
  },
  {
    key: 'antagonistForce',
    label: { ko: '적대 세력', en: 'Antagonist Force' },
    prompt: { ko: '주인공을 막는 힘은 인물, 조직, 세계 규칙 중 무엇인가요?', en: 'What force opposes the protagonist: a person, organization, or world rule?' },
    placeholder: { ko: '진실을 숨기는 의회, 기억을 지우는 세계 규칙, 주인공 안의 죄책감', en: 'A council hiding the truth, a memory-erasing world rule, and the protagonist’s guilt' },
  },
  {
    key: 'centralQuestion',
    label: { ko: '중심 극적 질문', en: 'Central Dramatic Question' },
    prompt: { ko: '독자가 끝까지 따라가게 될 핵심 질문은 무엇인가요?', en: 'What central question will keep the reader following until the end?' },
    placeholder: { ko: '주인공은 세계를 구하기 위해 가장 소중한 기억을 포기할 수 있는가?', en: 'Can the protagonist sacrifice their most precious memory to save the world?' },
  },
  {
    key: 'endingDirection',
    label: { ko: '결말 방향', en: 'Ending Direction' },
    prompt: { ko: '결말은 승리, 비극, 열린 결말, 아이러니 중 어느 방향인가요?', en: 'Should the ending be victorious, tragic, open-ended, or ironic?' },
    placeholder: { ko: '부분적 승리. 세계는 구하지만 모두에게 기억되지 못한다.', en: 'A partial victory. The world is saved, but the protagonist is forgotten.' },
  },
]
