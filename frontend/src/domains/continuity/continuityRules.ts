import type { ContinuityIssue, StoryWorkspace } from '../../shared/types'
import type { Language } from '../../shared/i18n'
import { createId } from '../../shared/id'

export function runContinuityChecks(workspace: StoryWorkspace, language: Language): ContinuityIssue[] {
  const issues: ContinuityIssue[] = []
  const isKo = language === 'ko'

  if (!workspace.world) {
    issues.push({
      id: createId('issue'),
      severity: 'warning',
      category: 'world_rule',
      title: isKo ? '세계관 규칙이 정의되지 않았습니다' : 'World rules are not defined',
      description: isKo ? '세계관의 물리/마법/문명 규칙이 없으면 장면별 사건의 가능 여부를 판단하기 어렵습니다.' : 'Without physical, magical, or civilization rules, it is hard to judge whether events are possible in each scene.',
      recommendation: isKo ? '세계관 빌더에서 세계 타입, 문명 수준, 마법/과학 규칙을 먼저 저장하세요.' : 'Save world type, civilization level, and magic/science rules in World Builder first.',
    })
  }

  if (!workspace.storyPlan) {
    issues.push({
      id: createId('issue'),
      severity: 'warning',
      category: 'scene_logic',
      title: isKo ? '스토리 구조가 없습니다' : 'Story architecture is missing',
      description: isKo ? '전체 로그라인, 중심 갈등, 결말 방향이 없으면 장면 목적의 일관성을 검증할 수 없습니다.' : 'Without logline, central conflict, and ending direction, scene purpose cannot be validated consistently.',
      recommendation: isKo ? '스토리 설계에서 전체 스토리 구조를 먼저 저장하세요.' : 'Save the overall story structure in Story Architect first.',
    })
  }

  workspace.characters.forEach((character) => {
    if (!character.coreDesire.trim() || !character.coreFear.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'character',
        title: isKo ? `${character.name}의 욕망 또는 두려움이 약합니다` : `${character.name} lacks desire or fear`,
        description: isKo ? '핵심 욕망과 두려움이 약하면 장면에서 행동 동기가 평면적으로 보일 수 있습니다.' : 'Weak desire or fear can make character motivation feel flat in scenes.',
        recommendation: isKo ? '인물 빌더에서 핵심 욕망과 핵심 두려움을 보강하세요.' : 'Strengthen core desire and core fear in Character Builder.',
      })
    }

    if (!character.contradiction.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'character',
        title: isKo ? `${character.name}의 성격적 모순이 없습니다` : `${character.name} has no contradiction`,
        description: isKo ? '성격적 모순이 없으면 캐릭터의 선택이 예측 가능하고 단조로워질 수 있습니다.' : 'Without contradiction, the character’s choices may become predictable and one-note.',
        recommendation: isKo ? '이 인물이 말하는 가치와 실제 행동 사이의 균열을 추가하세요.' : 'Add tension between what this character claims to value and how they actually behave.',
      })
    }
  })

  workspace.scenes.forEach((scene, index) => {
    if (!scene.scenePurpose.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'warning',
        category: 'scene_logic',
        title: isKo ? `장면 #${scene.sequenceNo}의 목적이 없습니다` : `Scene #${scene.sequenceNo} has no purpose`,
        description: isKo ? '장면 목적이 없으면 플롯 진행, 인물 변화, 정보 공개 중 어떤 기능을 하는지 불명확합니다.' : 'Without scene purpose, it is unclear whether the scene advances plot, character change, or information reveal.',
        recommendation: isKo ? '이 장면이 끝났을 때 독자가 무엇을 알거나 느껴야 하는지 명시하세요.' : 'State what the reader should know or feel when this scene ends.',
      })
    }

    if (scene.emotionalStart.trim() && scene.emotionalEnd.trim() && scene.emotionalStart === scene.emotionalEnd) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'scene_logic',
        title: isKo ? `장면 #${scene.sequenceNo}의 감정 변화가 없습니다` : `Scene #${scene.sequenceNo} has no emotional movement`,
        description: isKo ? '시작 감정과 종료 감정이 같으면 장면의 변화량이 약할 수 있습니다.' : 'If starting and ending emotions are identical, the scene may lack movement.',
        recommendation: isKo ? '갈등 결과로 인물의 감정이나 믿음이 어떻게 이동하는지 조정하세요.' : 'Adjust how conflict changes the character’s emotion or belief.',
      })
    }

    const previousScene = workspace.scenes[index - 1]
    if (previousScene && previousScene.locationName && scene.locationName && previousScene.locationName !== scene.locationName && !scene.storyTime.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'warning',
        category: 'timeline',
        title: isKo ? `장면 #${scene.sequenceNo}의 장소 이동 시간이 없습니다` : `Scene #${scene.sequenceNo} changes location without story time`,
        description: isKo ? '장소가 바뀌었지만 시간 정보가 없어 이동 가능성과 시간 경과를 판단하기 어렵습니다.' : 'The location changes, but missing story time makes travel plausibility hard to evaluate.',
        recommendation: isKo ? '작중 시간에 시간 경과 또는 이동 조건을 기록하세요.' : 'Record elapsed time or travel conditions in story time.',
      })
    }
  })

  workspace.relationships.forEach((relationship) => {
    if (!relationship.conflict.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'relationship',
        title: isKo ? '관계 갈등 단서가 없습니다' : 'Relationship has no conflict hook',
        description: isKo ? '관계 갈등이 없으면 장면에서 긴장이나 선택 압력이 약해질 수 있습니다.' : 'Without relationship conflict, scenes may lack tension or decision pressure.',
        recommendation: isKo ? '관계의 미해결 감정, 빚, 배신, 오해, 비밀을 추가하세요.' : 'Add unresolved emotion, debt, betrayal, misunderstanding, or secrets to the relationship.',
      })
    }
  })

  return issues
}
