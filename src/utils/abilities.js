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
  mbappe:     '#그라운드의람보르기니', // 스피드 끝판왕 직관적 비유
  ronaldo:    '#호우주의보',           // 대중성 호날두 시그니처 세레머니 (유지)
  messi:      '#신이내린재능',         // GOAT보다 축구 몰라도 와닿는 직관적 카피
  vinicius:   '#삼바댄싱머신',         // '비닐신' 대신 브라질 크랙의 힙한 매력 강조
  haaland:    '#인간파괴병기',         // '엄지윤' 대신 홀란드의 사기적인 피지컬 부각
  bellingham: '#벨링엄의왕조',         // 골 넣고 두 팔 벌리는 왕 같은 세레머니 연상
  yamal:      '#최연소천재',           // 최연소 스타 야말의 정체성 표현
  musiala:    '#중원의드리블러',       // 텀블링 같은 커뮤 드립 대신 깔끔하게 정리
  modric:     '#마에스트로',           // 조율의 신 모드리치 캐릭터 통일
  debruyne:   '#택배배달원',           // 왼발 에러 수정 및 '인간 내비게이션' 직관적 비유
  son:        '#우리들의캡틴',         // 한국 대중 취향 저격 감성 카피
  salah:      '#파라오의마법사',       // 이집트 살라의 시그니처 칭호
  hakimi:     '#질주폭주기관차',       // 하키미의 미친 스피드 직관화
  vandijk:    '#통곡의벽',             // '반다이크의벽'보다 축구계 정석 표현으로 간결하게
  odegaard:   '#축구예술가',           // 외데고르 특유의 우아한 플레이 직관화
  lukaku:     '#탱크피지컬',           // 루카쿠 하면 떠오르는 무식한 힘
  mane:       '#지치지않는심장',       // 활동량이라는 딱딱한 단어 순화
  valverde:   '#중원의엔진',           // 발베르데의 엄청난 기동력 비유
  mahrez:     '#발목의마술사',         // 마흐레즈 특유의 접기 기술 연상
  pulisic:    '#캡틴아메리카',         // 풀리시치 고유 별명 (최고의 대중성 유지)
  davies:     '#인간로켓',             // 데이비스 스피드 직관화
  leekangin:  '#황금왼발',             // '이강인왼발'보다 훨씬 멋지고 트렌디한 표현
  kubo:       '#테크니션',             // '일본의메시'라는 비교형보다 독자적 매력 부각
  taremi:     '#아시아의거인',         // 타레미의 피지컬 정제
  almoezali:  '#아시아의포격기',       // 카타르 득점왕 출신의 결정력 강조
  luisdiaz:   '#수비파괴자',           // 디아스의 저돌적인 드리블 스타일
  caicedo:    '#강철미드필더',         // 에콰도르 핵심 카이세도 엔진 묘사
  saliba:     '#월클방패',             // '살리바의관상' 드립 대신 최고의 수비수 칭호 부여
  kimmich:    '#패스마스터',           // 킴미히의 정교한 킥 능력 직관화
  pedri:      '#황금패스방향지시등',   // 페드리 특유의 영리한 길 찾기 능력 비유
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