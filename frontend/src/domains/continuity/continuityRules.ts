import type { ContinuityIssue, StoryWorkspace } from '../../shared/types'
import { createId } from '../../shared/id'

export function runContinuityChecks(workspace: StoryWorkspace): ContinuityIssue[] {
  const issues: ContinuityIssue[] = []

  if (!workspace.world) {
    issues.push({
      id: createId('issue'),
      severity: 'warning',
      category: 'world_rule',
      title: 'World rules are not defined',
      description: '세계관의 물리/마법/문명 규칙이 없으면 장면별 사건의 가능 여부를 판단하기 어렵습니다.',
      recommendation: 'World Builder에서 세계 타입, 문명 수준, 마법/과학 규칙을 먼저 저장하세요.',
    })
  }

  if (!workspace.storyPlan) {
    issues.push({
      id: createId('issue'),
      severity: 'warning',
      category: 'scene_logic',
      title: 'Story architecture is missing',
      description: '전체 로그라인, 중심 갈등, 결말 방향이 없으면 장면 목적의 일관성을 검증할 수 없습니다.',
      recommendation: 'Story Architect에서 전체 스토리 구조를 먼저 저장하세요.',
    })
  }

  workspace.characters.forEach((character) => {
    if (!character.coreDesire.trim() || !character.coreFear.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'character',
        title: `${character.name} lacks desire or fear`,
        description: '핵심 욕망과 두려움이 약하면 장면에서 행동 동기가 평면적으로 보일 수 있습니다.',
        recommendation: 'Character Builder에서 core desire와 core fear를 보강하세요.',
      })
    }

    if (!character.contradiction.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'character',
        title: `${character.name} has no contradiction`,
        description: '성격적 모순이 없으면 캐릭터의 선택이 예측 가능하고 단조로워질 수 있습니다.',
        recommendation: '이 인물이 말하는 가치와 실제 행동 사이의 균열을 추가하세요.',
      })
    }
  })

  workspace.scenes.forEach((scene, index) => {
    if (!scene.scenePurpose.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'warning',
        category: 'scene_logic',
        title: `Scene #${scene.sequenceNo} has no purpose`,
        description: '장면 목적이 없으면 플롯 진행, 인물 변화, 정보 공개 중 어떤 기능을 하는지 불명확합니다.',
        recommendation: '이 장면이 끝났을 때 독자가 무엇을 알거나 느껴야 하는지 명시하세요.',
      })
    }

    if (scene.emotionalStart.trim() && scene.emotionalEnd.trim() && scene.emotionalStart === scene.emotionalEnd) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'scene_logic',
        title: `Scene #${scene.sequenceNo} has no emotional movement`,
        description: '시작 감정과 종료 감정이 같으면 장면의 변화량이 약할 수 있습니다.',
        recommendation: '갈등 결과로 인물의 감정이나 믿음이 어떻게 이동하는지 조정하세요.',
      })
    }

    const previousScene = workspace.scenes[index - 1]
    if (previousScene && previousScene.locationName && scene.locationName && previousScene.locationName !== scene.locationName && !scene.storyTime.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'warning',
        category: 'timeline',
        title: `Scene #${scene.sequenceNo} changes location without story time`,
        description: '장소가 바뀌었지만 시간 정보가 없어 이동 가능성과 시간 경과를 판단하기 어렵습니다.',
        recommendation: 'story time에 시간 경과 또는 이동 조건을 기록하세요.',
      })
    }
  })

  workspace.relationships.forEach((relationship) => {
    if (!relationship.conflict.trim()) {
      issues.push({
        id: createId('issue'),
        severity: 'info',
        category: 'relationship',
        title: 'Relationship has no conflict hook',
        description: '관계 갈등이 없으면 장면에서 긴장이나 선택 압력이 약해질 수 있습니다.',
        recommendation: '관계의 미해결 감정, 빚, 배신, 오해, 비밀을 추가하세요.',
      })
    }
  })

  return issues
}
