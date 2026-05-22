// 퀴즈 답변 type → 5각형 능력치 점수 변환.
// 각 답변마다 매핑된 축에 가중치를 더하고, 10문항 누적 후 0~100 정규화.

export const ABILITY_AXES = ['슈팅', '패스', '스피드', '피지컬', '멘탈'];

const TYPE_TO_ABILITY = {
  striker:    { 슈팅: 1.0, 멘탈: 0.3 },
  playmaker:  { 패스: 1.0, 멘탈: 0.3 },
  defender:   { 피지컬: 1.0, 멘탈: 0.3 },
  midfielder: { 패스: 0.6, 슈팅: 0.4, 피지컬: 0.2 },
  speed:      { 스피드: 1.0, 피지컬: 0.2 },
  leader:     { 멘탈: 1.0, 피지컬: 0.3 },
  tactical:   { 멘탈: 1.0, 패스: 0.3 },
};

export const TYPE_NICKNAME = {
  striker:    '박스 안의 사냥꾼',
  playmaker:  '경기의 디자이너',
  defender:   '최후의 수문장',
  midfielder: '그라운드의 엔진',
  speed:      '측면의 폭주기관차',
  leader:     '그라운드의 캡틴',
  tactical:   '필드 위의 전략가',
};

// 한 축의 최대 누적치 ≈ 10. base 40 + 비율*60으로 시각적 안정성 확보.
export function computeAbilities(answerTypes) {
  const scores = Object.fromEntries(ABILITY_AXES.map((a) => [a, 0]));
  for (const type of answerTypes) {
    const mapping = TYPE_TO_ABILITY[type] || {};
    for (const [axis, w] of Object.entries(mapping)) {
      scores[axis] += w;
    }
  }
  const maxRaw = 10;
  const result = {};
  for (const axis of ABILITY_AXES) {
    const ratio = Math.min(1, scores[axis] / maxRaw);
    result[axis] = Math.round(40 + ratio * 60);
  }
  return result;
}

// 사진 안씀을 사용자들한테 말해주기 