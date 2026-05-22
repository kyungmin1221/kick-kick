// 퀴즈 10문항. type은 매칭 풀의 선수 type과 1:1 매칭.
// 타겟: 월드컵 시즌 대중 — 축구 몰라도 MBTI처럼 과몰입할 수 있는 스낵 콘텐츠.

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: '일상의 나',
    question: '친구들과의 약속 장소, 문을 열고 들어서며 내가 한 행동은?',
    options: [
      {
        label: '"왔다아아악!" 하이텐션으로 들어서며 단숨에 주목받기',
        type: 'leader',
      },
      {
        label: '한 명씩 눈 맞추며 "밥은 묵었나" 안부부터 살뜰히 챙기기',
        type: 'playmaker',
      },
      {
        label: '"야, 여기 신메뉴 대박이래" 일단 주문 패드부터 낚아채기',
        type: 'striker',
      },
      {
        label: '이미 대화 중이던 단톡방 대화 이어받듯 자연스럽게 착석',
        type: 'midfielder',
      },
    ],
  },
  {
    id: 2,
    category: '일상의 나',
    question: '갑자기 하늘이 뚫린 듯 쏟아지는 소나기! 우산이 없다면?',
    options: [
      {
        label: '가방을 머리에 얹고 풀스프린트로 비를 뚫고 달린다',
        type: 'speed',
      },
      {
        label: '1초 만에 스캔 완료, 가장 가까운 편의점으로 즉시 침투한다',
        type: 'tactical',
      },
      {
        label: '어차피 젖은 거, 무념무상으로 낭만을 즐기며 터벅터벅 걷는다',
        type: 'defender',
      },
      {
        label:
          '근처에 있는 친구에게 "우산 좀.. 한쪽 어깨 오픈 가능?" 카톡 시전',
        type: 'playmaker',
      },
    ],
  },
  {
    id: 3,
    category: '내가 축구 선수라면',
    question: '꿈 그리던 월드컵 무대! 상상만 해도 온몸에 전율이 돋는 순간은?',
    options: [
      {
        label: '후반 90분 극장 결승골 꽂아 넣고 카메라 앞에서 무릎 슬라이딩!',
        type: 'striker',
      },
      {
        label:
          '수비수 3명 사이를 바늘구멍처럼 찢는 미친 패스로 택배 배달했을 때',
        type: 'playmaker',
      },
      {
        label:
          '상대 공격수의 완벽한 1:1 찬스를 몸을 던지는 태클로 지워버렸을 때',
        type: 'defender',
      },
      {
        label:
          '90분 내내 피땀 흘려 승리한 뒤, 온 관중의 기립박수를 받으며 퇴장할 때',
        type: 'midfielder',
      },
    ],
  },
  {
    id: 4,
    category: '일상의 나',
    question:
      '절친이 "나 너무 우울해..."라며 톡을 보냈다. 나의 즉각적인 반응은?',
    options: [
      {
        label: '"나와, 10분 뒤에 집 앞으로 갈 테니까" 일단 옷부터 입는다',
        type: 'leader',
      },
      {
        label: '바로 전화를 걸어 말없이 30분 동안 한숨과 눈물을 다 받아준다',
        type: 'defender',
      },
      {
        label: '"인생 뭐 있어? 맛있는 거 먹고 털자!" 맛집 링크부터 연달아 쏜다',
        type: 'speed',
      },
      {
        label:
          '"헐 무슨 일 있어? 무슨 일 때문에 우울한 건데?" 원인부터 차분히 분석',
        type: 'tactical',
      },
    ],
  },
  {
    id: 5,
    category: '내가 축구 선수라면',
    question: '월드컵 중계 해설위원이 내 플레이를 보며 감탄할 나의 능력은?',
    options: [
      {
        label:
          '"와! 빠릅니다! 오토바이 탄 줄 알았어요!" 영혼까지 털어버리는 스피드',
        type: 'speed',
      },
      {
        label:
          '"정말 부드럽네요!" 압박이 들어와도 유연하게 슥슥 벗어나는 탈압박',
        type: 'playmaker',
      },
      {
        label:
          '"차면 들어갑니다!" 차는 족족 골망을 찢어버릴 듯한 자비 없는 골 결정력',
        type: 'striker',
      },
      {
        label:
          '"지치지 않네요!" 전반부터 후반까지 그라운드 전역을 지배하는 무한 체력',
        type: 'midfielder',
      },
    ],
  },
  {
    id: 6,
    category: '일상의 나',
    question:
      '팀 프로젝트(혹은 조별 과제)가 시작됐다. 단톡방에서 나의 포지션은?',
    options: [
      {
        label: '"제 의견은 이렇습니다!" 대화의 스타트를 끊고 방향성을 제안한다',
        type: 'leader',
      },
      {
        label:
          '"오, 다들 아이디어 좋다!" 팽팽한 의견 대립 속에서 조율사 역할을 자처함',
        type: 'playmaker',
      },
      {
        label:
          '누가 기획을 잘하고 발표를 잘하는지 스캔 후, 칼같이 역할을 분담시킨다',
        type: 'tactical',
      },
      {
        label:
          '자료 조사든 서기든, 남들이 귀찮아해서 비어 있는 구멍을 묵묵히 채운다',
        type: 'midfielder',
      },
    ],
  },
  {
    id: 7,
    category: '일상의 나',
    question: '새로운 도시로 여행을 떠났다! 숙소를 나서는 나의 발걸음은?',
    options: [
      {
        label: '발길 닿는 대로 걷기! 걷다가 예쁜 카페 나오면 그게 바로 목적지',
        type: 'speed',
      },
      {
        label: '구글맵에 가야 할 맛집, 소품샵 동선별로 빽빽하게 핀 꽂혀 있음',
        type: 'tactical',
      },
      {
        label:
          '무조건 힙한 곳! SNS 올렸을 때 "야 여기 어디야?" 소리 들을 만한 스팟 스캔',
        type: 'striker',
      },
      {
        label:
          '길 잃어도 개이득! 현지인 붙잡고 게스트하우스 사람들과 친구 먹기',
        type: 'playmaker',
      },
    ],
  },
  {
    id: 8,
    category: '내가 축구 선수라면',
    question: '내가 축구선수라면 팬들이 나를 뭐라고 부를까?',
    options: [
      {
        label: '"해결사" — 답답하던 경기를 한 방에 끝내버리는 심장 폭격기',
        type: 'striker',
      },
      {
        label:
          '"마에스트로" — 경기장 전체를 내 발끝으로 조율하는 중원의 사령관',
        type: 'playmaker',
      },
      {
        label: '"통곡의 벽" — 그 어떤 월드클래스 공격수도 내 앞에서는 무용지물',
        type: 'defender',
      },
      {
        label:
          '"종신 캡틴" — 존재만으로 팀원들의 멘탈을 꽉 잡아주는 든든한 정신적 지주',
        type: 'leader',
      },
    ],
  },
  {
    id: 9,
    category: '일상의 나',
    question: '회의나 수업 중, 갑자기 나에게 기습 질문(혹은 발표)이 날아왔다!',
    options: [
      {
        label:
          '당황한 티 안 내고 자신감 있는 목소리로 눈빛 연기하며 서론을 연다',
        type: 'leader',
      },
      {
        label: '3초간 정적 후, 머릿속으로 핵심 키워드 3개를 빠르게 빌드업한다',
        type: 'tactical',
      },
      {
        label:
          '"이 부분은 옆의 김 대리님이 잘 아시는데.." 슬쩍 패스를 찌르며 협공',
        type: 'midfielder',
      },
      {
        label:
          '욕심부리지 않고 내가 확실하게 아는 팩트만 담백하게 딱 말하고 끝낸다',
        type: 'defender',
      },
    ],
  },
  {
    id: 10,
    category: '내가 축구 선수라면',
    question: '내 축구화 안쪽에 몰래 새겨놓을 나만의 축구 철학(모토)은?',
    options: [
      { label: '"남들이 멈출 때, 나는 한 발짝 더 뛴다"', type: 'speed' },
      {
        label: '"이름 뒤의 번호(나)보다, 가슴 앞의 엠블럼(팀)이 더 중요하다"',
        type: 'leader',
      },
      {
        label: '"기회를 기다리지 않는다. 기회는 내가 부순다"',
        type: 'striker',
      },
      {
        label: '"화려하지 않아도 좋다. 내 자리는 내가 지킨다"',
        type: 'defender',
      },
    ],
  },
];

// 알고리즘 코드는 간결하고 버그 없이 작동하므로 그대로 유지합니다.
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
