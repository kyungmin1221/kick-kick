# KickKick (킥킥) 🦵⚽

> 2026 FIFA 월드컵 기념 — 나와 닮은 월드컵 선수 찾기 서비스

---

## 서비스 개요

- **서비스명**: KickKick (킥킥)
- **GitHub Repo 후보**: `kickkick` / `kickkick-2026`
- **컨셉**: 10가지 질문 + 사진 업로드로 나와 가장 닮은 월드컵 선수를 찾아주는 서비스
- **레퍼런스**: 셀럽미(celebme.net), StarByFace, Fotor Celebrity Lookalike

---

## 기술 스택

```
Frontend     React (SPA, 서버 없음)
얼굴 분석    face-api.js (브라우저에서 직접 실행, 서버 불필요)
결과 설명    Claude API (Anthropic) — 퀴즈 결과 기반 선수 매칭 설명 생성
배포         Vercel (예정)
```

### 왜 face-api.js인가
- 순수 프론트엔드만으로 동작 (Spring 서버 불필요)
- 브라우저에서 128차원 Face Descriptor(얼굴 벡터) 추출
- 사전 처리한 선수 벡터 JSON과 코사인 유사도 비교
- 셀럽미와 동일한 원리 (얼굴 임베딩 + 벡터 유사도 비교)

---

## 서비스 플로우

```
인트로 화면
  ↓
퀴즈 10문항 (선택형, 자동 다음 문항 이동)
  ↓
사진 업로드 (정면 사진 1장)
  ↓
AI 분석 중... (로딩)
  ↓
결과 카드
  - 매칭된 선수 이름 / 포지션 / 국가
  - 닮은 이유 (외모 + 플레이 스타일)
  - 일치도 % 표시
  - 공유하기 버튼
```

---

## 퀴즈 구성 (10문항)

### 플레이 스타일 (5문항)

| Q | 질문 | 선택지 | 매핑 타입 |
|---|---|---|---|
| 1 | 경기 중 나의 역할은? | 돌파/패스/수비/연결 | striker / playmaker / defender / midfielder |
| 2 | 1:1 상황, 나는? | 개인기/속도/패스/파울유도 | striker / speed / playmaker / tactical |
| 3 | 팀이 지고 있을 때 나는? | 직접해결/독려/전술/집중 | striker / leader / tactical / defender |
| 4 | 결정적 슛 찬스가 왔다. 나는? | 바로슛/패스/코스노림/당황 | striker / playmaker / tactical / midfielder |
| 5 | 나의 최대 무기는? | 스피드/창의성/피지컬/전술 | speed / playmaker / defender / tactical |

### 성격 & 멘탈 (5문항)

| Q | 질문 | 선택지 | 매핑 타입 |
|---|---|---|---|
| 6 | 친구들 사이에서 나는? | 리더/결정적타입/팀플/개인주의 | leader / striker / playmaker / tactical |
| 7 | 어려운 프로젝트가 생겼을 때? | 주도/계획/역할분담/부딪힘 | leader / tactical / playmaker / striker |
| 8 | 나의 성격에 가까운 것은? | 즉흥적/계획적/감성적/논리적 | speed / tactical / playmaker / defender |
| 9 | 경기에서 실수를 했다면? | 잊고집중/만회/자책/미안함 | striker / tactical / defender / playmaker |
| 10 | 나에게 축구(혹은 일)란? | 증명/성장/열정/싸움 | striker / playmaker / speed / leader |

---

## 선수 매칭 풀 (7개 타입 → 확장 예정)

| 타입 | 선수 | 국가 | 특징 태그 |
|---|---|---|---|
| striker | 킬리안 음바페 | 프랑스 🇫🇷 | 폭발적 스피드, 골결정력, 개인돌파 |
| playmaker | 루카 모드리치 | 크로아티아 🇭🇷 | 비전 패스, 리더십, 경기 조율 |
| defender | 버질 반다이크 | 네덜란드 🇳🇱 | 강인한 수비, 공중볼, 침착함 |
| midfielder | 케빈 데 브라이너 | 벨기에 🇧🇪 | 장거리 패스, 창의성, 양발 능력 |
| speed | 비니시우스 주니오르 | 브라질 🇧🇷 | 드리블, 스피드, 폭발력 |
| leader | 크리스티아누 호날두 | 포르투갈 🇵🇹 | 리더십, 멘탈, 책임감 |
| tactical | 세르히오 부스케츠 | 스페인 🇪🇸 | 전술 이해, 포지셔닝, 침착함 |

> **TODO**: 선수 풀을 30명으로 확장 예정. 2026 월드컵 최종 명단은 6월 2일 FIFA 공식 발표.

---

## face-api.js 준비 작업 (개발 전 선행 필요)

### 경민이 직접 준비해야 할 것

```
1. 선수 사진 수집 (선수당 2~3장, 총 60~90장)
   - 정면 사진 필수
   - 얼굴이 크게 나온 것
   - 밝은 조명
   - 출처: FIFA 공식, Wikipedia (라이선스 자유), 구글 이미지

2. 벡터 추출 스크립트 1회 실행
   사진들 → face-api.js → players_descriptors.json 생성

3. players_descriptors.json을 React 프로젝트에 포함
```

### players_descriptors.json 구조

```json
[
  {
    "name": "킬리안 음바페",
    "nameEn": "Kylian Mbappé",
    "country": "프랑스",
    "countryFlag": "🇫🇷",
    "position": "FW",
    "type": "striker",
    "tags": ["폭발적 스피드", "골결정력", "개인돌파"],
    "description": "당신은 순간적인 가속력과 뛰어난 결정력으로 상대를 압도하는 공격수 스타일입니다.",
    "descriptors": [
      [0.12, -0.34, 0.87, ...],
      [0.11, -0.33, 0.85, ...]
    ]
  }
]
```

---

## 컴포넌트 구조 (예정)

```
src/
├── components/
│   ├── IntroScreen.jsx       # 시작 화면
│   ├── QuizScreen.jsx        # 퀴즈 10문항
│   ├── UploadScreen.jsx      # 사진 업로드
│   ├── LoadingScreen.jsx     # 분석 중 로딩
│   └── ResultCard.jsx        # 결과 카드 + 공유
├── data/
│   └── players_descriptors.json  # 선수 얼굴 벡터 DB
├── hooks/
│   ├── useFaceMatch.js       # face-api.js 래핑
│   └── useQuiz.js            # 퀴즈 상태 관리
├── utils/
│   ├── faceApi.js            # face-api.js 초기화 및 비교 로직
│   └── claudeApi.js          # Claude API 결과 설명 생성
└── App.jsx
```

---

## Claude API 활용 방법

퀴즈 답변 결과 + 매칭된 선수 이름을 Claude API에 넘겨서 **개인화된 결과 설명 문장**을 동적 생성

```js
// 예시 프롬프트 구조
const prompt = `
사용자가 축구 스타일 테스트를 완료했습니다.
퀴즈 답변 타입: [striker, striker, leader, tactical, speed, ...]
매칭된 선수: 킬리안 음바페 (프랑스, FW)
얼굴 유사도: 82%

위 정보를 바탕으로 재미있고 공감가는 결과 설명을 2~3문장으로 작성해주세요.
플레이 스타일과 외모 닮은꼴을 자연스럽게 연결해주세요.
`;
```

---

## UI 디자인 방향

- **배경**: 다크 네이비 (#0a0e1a) + 잔디 그라데이션
- **포인트 컬러**: 옐로우 (#f5c518) + 레드 (#dc3232)
- **폰트**: Bebas Neue (타이틀) + Noto Sans KR (본문)
- **톤**: 스포츠 에너지 + 깔끔한 카드 UI
- **프로토타입**: claude.ai Artifact에서 구현 완료 (전체 플로우 동작 확인)

---

## 개발 우선순위

```
Phase 1 — 선수 데이터 준비
  [ ] 선수 30명 확정 (국가 배분 고려)
  [ ] 선수 사진 수집 (2~3장씩)
  [ ] 벡터 추출 스크립트 작성 및 실행
  [ ] players_descriptors.json 생성

Phase 2 — React 앱 구현
  [ ] CRA or Vite 프로젝트 세팅
  [ ] 프로토타입 기반 컴포넌트 구현
  [ ] face-api.js 연동
  [ ] Claude API 결과 설명 생성 연동

Phase 3 — 마무리
  [ ] 결과 이미지 저장 / 카카오 공유
  [ ] 모바일 반응형 최적화
  [ ] Vercel 배포
  [ ] 6월 2일 이후 선수 명단 업데이트
```

---

## 참고 일정

| 날짜 | 이벤트 |
|---|---|
| 2026.06.01 | 각국 최종 26인 명단 제출 마감 |
| 2026.06.02 | FIFA 공식 명단 발표 |
| 2026.06.11 | 2026 FIFA 월드컵 개막 (멕시코 vs 남아공) |
| 2026.07.19 | 월드컵 결승 |