// 퀴즈 10문항. type은 매칭 풀의 선수 type과 1:1 매칭.
// 사용자의 누적 type 카운트가 가장 높은 type이 매칭된 선수 type이 된다.

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: '플레이 스타일',
    question: '경기 중 나의 역할은?',
    options: [
      { label: '돌파로 찬스를 만든다', type: 'striker' },
      { label: '날카로운 패스로 풀어준다', type: 'playmaker' },
      { label: '뒤에서 묵직하게 막는다', type: 'defender' },
      { label: '공수의 연결고리가 된다', type: 'midfielder' },
    ],
  },
  {
    id: 2,
    category: '플레이 스타일',
    question: '1:1 상황, 나는?',
    options: [
      { label: '개인기로 제친다', type: 'striker' },
      { label: '속도로 제친다', type: 'speed' },
      { label: '동료에게 패스한다', type: 'playmaker' },
      { label: '파울을 유도한다', type: 'tactical' },
    ],
  },
  {
    id: 3,
    category: '플레이 스타일',
    question: '팀이 지고 있을 때 나는?',
    options: [
      { label: '내가 직접 해결한다', type: 'striker' },
      { label: '동료를 독려한다', type: 'leader' },
      { label: '전술을 다시 본다', type: 'tactical' },
      { label: '실점부터 막는다', type: 'defender' },
    ],
  },
  {
    id: 4,
    category: '플레이 스타일',
    question: '결정적 슛 찬스가 왔다. 나는?',
    options: [
      { label: '망설임 없이 슛', type: 'striker' },
      { label: '더 좋은 자리 동료에게 패스', type: 'playmaker' },
      { label: '골키퍼 코스를 노린다', type: 'tactical' },
      { label: '당황해서 멈칫', type: 'midfielder' },
    ],
  },
  {
    id: 5,
    category: '플레이 스타일',
    question: '나의 최대 무기는?',
    options: [
      { label: '스피드', type: 'speed' },
      { label: '창의성', type: 'playmaker' },
      { label: '피지컬', type: 'defender' },
      { label: '전술 이해', type: 'tactical' },
    ],
  },
  {
    id: 6,
    category: '성격 & 멘탈',
    question: '친구들 사이에서 나는?',
    options: [
      { label: '분위기를 이끄는 리더', type: 'leader' },
      { label: '결정적 한방을 만드는 사람', type: 'striker' },
      { label: '모두를 이어주는 다리', type: 'playmaker' },
      { label: '나만의 길을 간다', type: 'tactical' },
    ],
  },
  {
    id: 7,
    category: '성격 & 멘탈',
    question: '어려운 프로젝트가 생겼을 때?',
    options: [
      { label: '내가 주도한다', type: 'leader' },
      { label: '먼저 계획을 세운다', type: 'tactical' },
      { label: '역할을 나눈다', type: 'playmaker' },
      { label: '일단 부딪힌다', type: 'striker' },
    ],
  },
  {
    id: 8,
    category: '성격 & 멘탈',
    question: '나의 성격에 가까운 것은?',
    options: [
      { label: '즉흥적', type: 'speed' },
      { label: '계획적', type: 'tactical' },
      { label: '감성적', type: 'playmaker' },
      { label: '논리적', type: 'defender' },
    ],
  },
  {
    id: 9,
    category: '성격 & 멘탈',
    question: '경기에서 실수를 했다면?',
    options: [
      { label: '잊고 다음 플레이에 집중', type: 'striker' },
      { label: '바로 만회한다', type: 'tactical' },
      { label: '스스로를 자책한다', type: 'defender' },
      { label: '동료에게 미안해한다', type: 'playmaker' },
    ],
  },
  {
    id: 10,
    category: '성격 & 멘탈',
    question: '나에게 축구(혹은 일)란?',
    options: [
      { label: '나를 증명하는 무대', type: 'striker' },
      { label: '끝없는 성장', type: 'playmaker' },
      { label: '뜨거운 열정', type: 'speed' },
      { label: '이겨야 할 싸움', type: 'leader' },
    ],
  },
];

// 누적 답변에서 가장 많이 나온 type을 반환. 동률이면 먼저 나온 순서대로.
export function pickDominantType(answers) {
  const counts = {};
  for (const a of answers) {
    counts[a.type] = (counts[a.type] || 0) + 1;
  }
  let best = null;
  let bestCount = -1;
  for (const a of answers) {
    if (counts[a.type] > bestCount) {
      best = a.type;
      bestCount = counts[a.type];
    }
  }
  return best;
}
