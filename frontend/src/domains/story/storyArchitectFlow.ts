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
  label: string
  prompt: string
  placeholder: string
}

export const STORY_ARCHITECT_QUESTIONS: StoryQuestion[] = [
  {
    key: 'logline',
    label: 'Logline',
    prompt: '이야기를 한 문장으로 설명한다면 무엇인가요?',
    placeholder: '몰락한 북부 도시의 생존자가 세계를 얼어붙게 만든 진실을 추적한다.',
  },
  {
    key: 'genre',
    label: 'Genre',
    prompt: '장르는 무엇이며 어떤 장르 규칙을 따르나요?',
    placeholder: '다크 판타지, 미스터리, 정치 스릴러',
  },
  {
    key: 'tone',
    label: 'Tone',
    prompt: '작품의 정서와 문체 톤은 어떤가요?',
    placeholder: '차갑고 비극적이지만 마지막에는 희미한 구원이 남는 톤',
  },
  {
    key: 'theme',
    label: 'Theme',
    prompt: '이야기가 끝났을 때 독자가 어떤 질문이나 감정을 남기길 원하나요?',
    placeholder: '기억을 잃지 않는 것이 과연 구원인가, 저주인가',
  },
  {
    key: 'protagonistGoal',
    label: 'Protagonist Goal',
    prompt: '주인공의 외적 목표와 내적 목표는 무엇인가요?',
    placeholder: '도시 봉쇄의 원인을 밝히고, 자신이 버림받았다는 믿음을 극복한다.',
  },
  {
    key: 'antagonistForce',
    label: 'Antagonist Force',
    prompt: '주인공을 막는 힘은 인물, 조직, 세계 규칙 중 무엇인가요?',
    placeholder: '진실을 숨기는 의회, 기억을 지우는 세계 규칙, 주인공 안의 죄책감',
  },
  {
    key: 'centralQuestion',
    label: 'Central Dramatic Question',
    prompt: '독자가 끝까지 따라가게 될 핵심 질문은 무엇인가요?',
    placeholder: '주인공은 세계를 구하기 위해 가장 소중한 기억을 포기할 수 있는가?',
  },
  {
    key: 'endingDirection',
    label: 'Ending Direction',
    prompt: '결말은 승리, 비극, 열린 결말, 아이러니 중 어느 방향인가요?',
    placeholder: '부분적 승리. 세계는 구하지만 모두에게 기억되지 못한다.',
  },
]
