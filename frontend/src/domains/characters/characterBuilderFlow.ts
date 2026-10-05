import type { Language } from '../../shared/i18n'

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
  label: Record<Language, string>
  prompt: Record<Language, string>
  placeholder: Record<Language, string>
}

export const CHARACTER_BUILDER_QUESTIONS: CharacterQuestion[] = [
  {
    key: 'name',
    label: { ko: '이름', en: 'Name' },
    prompt: { ko: '이 인물의 이름 또는 임시 호출명을 정해주세요.', en: 'Give this character a name or temporary working name.' },
    placeholder: { ko: '예: Aria, 북부 감시자, 이름 미정의 왕자', en: 'Example: Aria, Northern Watcher, unnamed prince' },
  },
  {
    key: 'role',
    label: { ko: '서사 역할', en: 'Narrative Role' },
    prompt: { ko: '이 인물은 이야기에서 어떤 기능을 하나요?', en: 'What function does this character serve in the story?' },
    placeholder: { ko: '주인공, 조력자, 적대자, 배신자, 멘토, 관찰자 등', en: 'Protagonist, ally, antagonist, betrayer, mentor, observer, etc.' },
  },
  {
    key: 'publicPersona',
    label: { ko: '외적 성격', en: 'Public Persona' },
    prompt: { ko: '타인이 겉으로 보기에 이 인물은 어떤 사람인가요?', en: 'How does this character appear to others on the surface?' },
    placeholder: { ko: '차갑고 유능하지만 접근하기 어려운 사람', en: 'Cold and competent, but difficult to approach' },
  },
  {
    key: 'innerSelf',
    label: { ko: '실제 내면', en: 'Inner Self' },
    prompt: { ko: '겉모습과 달리 실제 내면은 어떤가요?', en: 'What is this character really like beneath the surface?' },
    placeholder: { ko: '타인의 인정을 갈망하지만 거절당할까 두려워함', en: 'Craves recognition but fears rejection' },
  },
  {
    key: 'coreDesire',
    label: { ko: '핵심 욕망', en: 'Core Desire' },
    prompt: { ko: '이 인물이 가장 원하는 것은 무엇인가요?', en: 'What does this character want most?' },
    placeholder: { ko: '가문의 진실을 밝히고 자신의 선택이 틀리지 않았음을 증명하고 싶다', en: 'To uncover the truth of their family and prove their choice was not wrong' },
  },
  {
    key: 'coreFear',
    label: { ko: '핵심 두려움', en: 'Core Fear' },
    prompt: { ko: '이 인물이 가장 두려워하는 것은 무엇인가요?', en: 'What does this character fear most?' },
    placeholder: { ko: '자신이 구하려는 사람이 결국 자신 때문에 파멸하는 것', en: 'That the person they try to save will be destroyed because of them' },
  },
  {
    key: 'moralCode',
    label: { ko: '윤리 기준', en: 'Moral Code' },
    prompt: { ko: '이 인물이 절대 넘지 않으려는 선은 무엇인가요?', en: 'What line will this character refuse to cross?' },
    placeholder: { ko: '무고한 사람을 수단으로 쓰지 않는다', en: 'Never use innocent people as tools' },
  },
  {
    key: 'contradiction',
    label: { ko: '성격적 모순', en: 'Contradiction' },
    prompt: { ko: '이 인물의 성격적 모순은 무엇인가요?', en: 'What contradiction makes this character feel layered?' },
    placeholder: { ko: '타인을 믿지 않는다고 말하지만 실제로는 누군가에게 의존하고 싶어함', en: 'Claims not to trust others but secretly wants to depend on someone' },
  },
  {
    key: 'trauma',
    label: { ko: '과거 상처', en: 'Past Wound' },
    prompt: { ko: '현재 성격을 만든 과거 사건이나 상처가 있나요?', en: 'What past event or wound shaped the current personality?' },
    placeholder: { ko: '어릴 때 도시가 봉쇄되며 가족과 분리됨', en: 'Separated from family when the city was sealed in childhood' },
  },
  {
    key: 'speechStyle',
    label: { ko: '말투', en: 'Speech Style' },
    prompt: { ko: '이 인물의 말투, 단어 선택, 대화 습관은 어떤가요?', en: 'How does this character speak, choose words, and behave in dialogue?' },
    placeholder: { ko: '짧고 단정한 문장, 감정을 직접 말하지 않음', en: 'Short, controlled sentences; avoids directly naming feelings' },
  },
  {
    key: 'behaviorPattern',
    label: { ko: '행동 패턴', en: 'Behavior Pattern' },
    prompt: { ko: '긴장하거나 선택의 순간에 반복되는 행동은 무엇인가요?', en: 'What repeated behavior appears under tension or at decision points?' },
    placeholder: { ko: '왼손 장갑을 만지작거리며 주변 출구를 먼저 확인함', en: 'Touches the left glove and checks exits first' },
  },
  {
    key: 'visualSignature',
    label: { ko: '외형 시그니처', en: 'Visual Signature' },
    prompt: { ko: '외형에서 가장 먼저 기억될 고유 특징은 무엇인가요?', en: 'What visual trait should be remembered first?' },
    placeholder: { ko: '은색 흉터가 눈썹을 가로지르고, 낡은 붉은 망토를 착용함', en: 'A silver scar crosses the eyebrow; wears an old red cloak' },
  },
  {
    key: 'relationshipNotes',
    label: { ko: '관계 단서', en: 'Relationship Hooks' },
    prompt: { ko: '기존 인물 또는 아직 만들지 않은 인물과의 관계 단서를 적어주세요.', en: 'Add relationship hooks with existing or not-yet-created characters.' },
    placeholder: { ko: '실종된 오빠, 적대 세력 내부의 옛 친구, 아직 이름 없는 후견인', en: 'Missing older brother, old friend inside the enemy faction, unnamed guardian' },
  },
]
