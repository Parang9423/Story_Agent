export type CharacterQuestion = {
  key:
    | 'name'
    | 'role'
    | 'publicPersona'
    | 'innerSelf'
    | 'coreDesire'
    | 'coreFear'
    | 'moralCode'
    | 'contradiction'
    | 'trauma'
    | 'speechStyle'
    | 'behaviorPattern'
    | 'visualSignature'
    | 'relationshipNotes'
  label: string
  prompt: string
  placeholder: string
}

export const CHARACTER_BUILDER_QUESTIONS: CharacterQuestion[] = [
  {
    key: 'name',
    label: 'Name',
    prompt: '이 인물의 이름 또는 임시 호출명을 정해주세요.',
    placeholder: '예: Aria, 북부 감시자, 이름 미정의 왕자',
  },
  {
    key: 'role',
    label: 'Narrative Role',
    prompt: '이 인물은 이야기에서 어떤 기능을 하나요?',
    placeholder: '주인공, 조력자, 적대자, 배신자, 멘토, 관찰자 등',
  },
  {
    key: 'publicPersona',
    label: 'Public Persona',
    prompt: '타인이 겉으로 보기에 이 인물은 어떤 사람인가요?',
    placeholder: '차갑고 유능하지만 접근하기 어려운 사람',
  },
  {
    key: 'innerSelf',
    label: 'Inner Self',
    prompt: '겉모습과 달리 실제 내면은 어떤가요?',
    placeholder: '타인의 인정을 갈망하지만 거절당할까 두려워함',
  },
  {
    key: 'coreDesire',
    label: 'Core Desire',
    prompt: '이 인물이 가장 원하는 것은 무엇인가요?',
    placeholder: '가문의 진실을 밝히고 자신의 선택이 틀리지 않았음을 증명하고 싶다',
  },
  {
    key: 'coreFear',
    label: 'Core Fear',
    prompt: '이 인물이 가장 두려워하는 것은 무엇인가요?',
    placeholder: '자신이 구하려는 사람이 결국 자신 때문에 파멸하는 것',
  },
  {
    key: 'moralCode',
    label: 'Moral Code',
    prompt: '이 인물이 절대 넘지 않으려는 선은 무엇인가요?',
    placeholder: '무고한 사람을 수단으로 쓰지 않는다',
  },
  {
    key: 'contradiction',
    label: 'Contradiction',
    prompt: '이 인물의 성격적 모순은 무엇인가요?',
    placeholder: '타인을 믿지 않는다고 말하지만 실제로는 누군가에게 의존하고 싶어함',
  },
  {
    key: 'trauma',
    label: 'Past Wound',
    prompt: '현재 성격을 만든 과거 사건이나 상처가 있나요?',
    placeholder: '어릴 때 도시가 봉쇄되며 가족과 분리됨',
  },
  {
    key: 'speechStyle',
    label: 'Speech Style',
    prompt: '이 인물의 말투, 단어 선택, 대화 습관은 어떤가요?',
    placeholder: '짧고 단정한 문장, 감정을 직접 말하지 않음',
  },
  {
    key: 'behaviorPattern',
    label: 'Behavior Pattern',
    prompt: '긴장하거나 선택의 순간에 반복되는 행동은 무엇인가요?',
    placeholder: '왼손 장갑을 만지작거리며 주변 출구를 먼저 확인함',
  },
  {
    key: 'visualSignature',
    label: 'Visual Signature',
    prompt: '외형에서 가장 먼저 기억될 고유 특징은 무엇인가요?',
    placeholder: '은색 흉터가 눈썹을 가로지르고, 낡은 붉은 망토를 착용함',
  },
  {
    key: 'relationshipNotes',
    label: 'Relationship Hooks',
    prompt: '기존 인물 또는 아직 만들지 않은 인물과의 관계 단서를 적어주세요.',
    placeholder: '실종된 오빠, 적대 세력 내부의 옛 친구, 아직 이름 없는 후견인',
  },
]
