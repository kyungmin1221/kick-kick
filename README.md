# KickKick

2026 FIFA 월드컵 기념 — 나와 닮은 월드컵 선수 찾기 서비스.

## 실행

```bash
npm install
npm run dev
```

## 구조

```
src/
├── components/      # Intro / Quiz / Upload / Loading / ResultCard
├── data/            # 퀴즈 문항, 선수 descriptors JSON
├── hooks/           # useQuiz, useFaceMatch
├── utils/           # faceApi, claudeApi
├── styles/          # 글로벌 CSS
├── App.jsx          # 단계 머신
└── main.jsx
```

## Phase 1 데이터 준비 체크리스트

1. **face-api.js 모델 다운로드**
   ```bash
   npm run download-models
   ```
   → `public/models/`에 가중치 파일 7개가 받아짐.

2. **선수 사진 수집** — 선수당 3~5장 (정면, 밝은 조명). 슬러그(=폴더명) 기준으로 정리:
   ```
   players/
   ├── mbappe/
   │   ├── 01.jpg
   │   ├── 02.jpg
   │   └── 03.jpg
   ├── ronaldo/
   │   └── ...
   ├── messi/
   └── ... (slug는 src/data/players_descriptors.json의 slug 필드와 동일)
   ```

3. **어드민에서 추출**
   - `npm run dev` 후 `http://localhost:5173/#admin` 진입
   - **(B) 폴더 통째 드롭**: 상단 `📁 폴더 통째 드롭` → 위의 `players/` 폴더 선택 → 전체 자동 처리
   - **(A) 한 선수만 추가**: 카드의 `사진 추가` → 사진 여러 장 선택
   - 끝나면 `JSON 다운로드` → 받은 파일로 `src/data/players_descriptors.json` 통째 교체

4. **결과 카드용 선수 사진** — 어드민용으로 정리한 폴더를 `public/`에 통째로 복사:
   ```bash
   cp -r ~/Desktop/players public/
   ```
   결과 카드는 `/players/<slug>/01.jpg`를 자동으로 로드합니다. 파일이 없으면 슬러그 기반 그라데이션 + 이니셜 플레이스홀더로 폴백.

5. **AI 일러스트 (선택, 강력 추천)** — `public/players/<slug>/illustration.png` 자리에 두면 히어로 카드 상단에 자동으로 등장.

   **생성 방법 (Midjourney / DALL-E 3):**
   ```
   A trendy and cute 3D Pixar-style cartoon avatar of soccer player <PLAYER_NAME>,
   wearing a <COUNTRY> football jersey, smiling, avatar icon,
   solid clean background --v 6.0
   ```
   `<PLAYER_NAME>`만 바꿔서 30명분 일괄 생성. 1~2시간 작업.

   배치:
   ```
   public/players/mbappe/illustration.png
   public/players/ronaldo/illustration.png
   ...
   ```
   파일이 없는 선수는 일러스트 영역이 자동으로 숨겨지고 작은 실제 사진만 나옵니다.

6. **선수 명단** — 현재 30명 등록. 2026.06.02 FIFA 명단 발표 후 필요 시 업데이트.

벡터가 비어 있는 선수도 후보에서 자동 제외됩니다. 전체가 비어있으면 퀴즈 결과만으로 매칭하는 폴백 모드로 동작.

## Claude API 결과 설명

`VITE_CLAUDE_PROXY_URL`을 환경변수에 지정하면 Claude API 프록시로 결과 설명을 동적 생성합니다.
설정하지 않으면 `players_descriptors.json`의 `description`이 그대로 사용됩니다.
**보안: API 키는 절대 클라이언트에 노출하지 말고 Vercel Edge Function 등 서버리스 프록시를 통해서만 호출하세요.**
