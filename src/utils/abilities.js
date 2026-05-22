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

// 국가별 그라데이션 (히어로 카드 배경) — 국기 메인 컬러 2~3개를 짙은 톤으로.
// 흰색은 흰 텍스트와 충돌하니 피하고, 모두 흰 글씨 가독성 확보.
export const COUNTRY_THEME = {
  '프랑스':     'linear-gradient(135deg, #002654 0%, #ED2939 100%)',
  '포르투갈':   'linear-gradient(135deg, #006633 0%, #FF0000 100%)',
  '아르헨티나': 'linear-gradient(135deg, #6CACE4 0%, #2A5D8A 100%)',
  '브라질':     'linear-gradient(135deg, #009C3B 0%, #D4A017 100%)',
  '노르웨이':   'linear-gradient(135deg, #BA0C2F 0%, #00205B 100%)',
  '잉글랜드':   'linear-gradient(135deg, #CE1124 0%, #5B0A12 100%)',
  '스페인':     'linear-gradient(135deg, #AA151B 0%, #C99D08 100%)',
  '독일':       'linear-gradient(135deg, #1A1A1A 0%, #DD0000 55%, #C99D08 100%)',
  '크로아티아': 'linear-gradient(135deg, #FF0000 0%, #0033A0 100%)',
  '벨기에':     'linear-gradient(135deg, #1A1A1A 0%, #DAA520 50%, #ED2939 100%)',
  '한국':       'linear-gradient(135deg, #003478 0%, #C60C30 100%)',
  '이집트':     'linear-gradient(135deg, #CE1126 0%, #1A1A1A 100%)',
  '모로코':     'linear-gradient(135deg, #C1272D 0%, #006233 100%)',
  '네덜란드':   'linear-gradient(135deg, #FF6600 0%, #21468B 100%)',
  '세네갈':     'linear-gradient(135deg, #00853F 0%, #E31B23 100%)',
  '우루과이':   'linear-gradient(135deg, #0038A8 0%, #C99D08 100%)',
  '알제리':     'linear-gradient(135deg, #006233 0%, #B22234 100%)',
  '미국':       'linear-gradient(135deg, #3C3B6E 0%, #B22234 100%)',
  '캐나다':     'linear-gradient(135deg, #FF0000 0%, #8B0000 100%)',
  '일본':       'linear-gradient(135deg, #BC002D 0%, #4A0010 100%)',
  '이란':       'linear-gradient(135deg, #239F40 0%, #DA0000 100%)',
  '카타르':     'linear-gradient(135deg, #8A1538 0%, #4A0A20 100%)',
  '콜롬비아':   'linear-gradient(135deg, #D4A017 0%, #CE1126 100%)',
  '에콰도르':   'linear-gradient(135deg, #D4A017 0%, #ED1C24 100%)',
};

// 타입별 한국어 형용사 (카피용)
export const TYPE_ADJECTIVE = {
  striker:    '정통 공격수',
  playmaker:  '창의력의 화신',
  defender:   '철벽 수비수',
  midfielder: '박스 투 박스 미드필더',
  speed:      '번개 같은 윙어',
  leader:     '타고난 캡틴',
  tactical:   '필드 위의 전략가',
};

// 타입별 캐릭터 카드 테마 — 그라데이션 + 이모지.
// COUNTRY_THEME에 매칭 안 되는 경우의 폴백.
export const TYPE_THEME = {
  striker:    { icon: '🎯', gradient: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)' },
  playmaker:  { icon: '🎨', gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)' },
  defender:   { icon: '🛡️', gradient: 'linear-gradient(135deg, #283e51 0%, #4b79a1 100%)' },
  midfielder: { icon: '⚙️', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  speed:      { icon: '⚡', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
  leader:     { icon: '👑', gradient: 'linear-gradient(135deg, #b8860b 0%, #ffd700 100%)' },
  tactical:   { icon: '🧠', gradient: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 60%, #ffaf7b 100%)' },
};

// 타입별 밈/인싸 스타일 해시태그 풀 (선수 태그 대신 결과 카드에 사용)
const TYPE_FUN_TAGS = {
  striker:    ['#박스안의암살자', '#골넣고세레머니각', '#슛이답이다', '#망설임은패배', '#내가해결사'],
  playmaker:  ['#그라운드의지휘자', '#패스의예술가', '#나만믿어', '#시야가80km', '#아는맛이무서운법'],
  defender:   ['#철의장벽', '#내앞은못지나가', '#태클의달인', '#멘탈갑', '#말없이일잘함'],
  midfielder: ['#그라운드의엔진', '#90분풀가동', '#균형잡힌천재', '#내가다한다', '#멀티플레이어'],
  speed:      ['#스피드왕', '#잡을테면잡아봐', '#속도가곧정의', '#오토바이탄축구선수', '#한발더뛰는사람'],
  leader:     ['#캡틴마인드', '#팀이곧나', '#죽어도지킨다', '#리더의품격', '#인싸중인싸'],
  tactical:   ['#두뇌풀가동', '#그라운드의IQ', '#수읽기장인', '#10수앞을본다', '#계획형인간'],
};

// 선수별 시그니처 한 단어 해시태그 (가장 앞에 박혀 강조됨)
const PLAYER_FUN_TAG = {
  mbappe:     '#음바페의심장',
  ronaldo:    '#호우심장',
  messi:      '#메시즘',
  vinicius:   '#비니의자존심',
  haaland:    '#골괴물각',
  bellingham: '#벨링선언',
  yamal:      '#야말의여유',
  musiala:    '#무시알라텀블링',
  modric:     '#모드리치의시간',
  debruyne:   '#데브의왼발',
  son:        '#손세이셔널',
  salah:      '#왼발은흉기',
  hakimi:     '#하키미질주',
  vandijk:    '#반다이크의벽',
  odegaard:   '#외데고르우아미',
  lukaku:     '#루카쿠피지컬',
  mane:       '#마네무한활동량',
  valverde:   '#발베장거리',
  mahrez:     '#마흐레즈왼발',
  pulisic:    '#캡틴아메리카',
  davies:     '#캐나다의로켓',
  leekangin:  '#이강인왼발',
  kubo:       '#일본의메시',
  taremi:     '#타레미피지컬',
  almoezali:  '#카타르의희망',
  luisdiaz:   '#콜롬비아의비밀병기',
  caicedo:    '#에콰도르기둥',
  saliba:     '#살리바의관상',
  kimmich:    '#킴미히시야',
  pedri:      '#페드리볼터치',
};

// 결과 카드에 사용할 3개 해시태그: 선수별 1개 + 타입별 2개 (랜덤이 아니라 결정적으로 앞 2개)
export function getFunHashtags(player) {
  const playerTag = PLAYER_FUN_TAG[player.slug];
  const typeTags = (TYPE_FUN_TAGS[player.type] || []).slice(0, 2);
  return [playerTag, ...typeTags].filter(Boolean);
}

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