// // Claude API 호출은 브라우저에서 직접 하면 API 키가 노출되므로
// // Vercel Edge Function 등 서버리스 프록시를 거치는 걸 권장.
// // 프록시가 없으면 defaultResultCopy()로 폴백.

// const PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL;

// export async function generateResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }) {
//   if (!PROXY_URL) return null;

//   const prompt = `KickKick 닮은 선수 찾기 결과 카드에 들어갈 한 줄 카피를 작성해주세요.

// [분석 결과]
// - 얼굴 닮은꼴: ${faceMatch.player.name} (${faceMatch.player.country}, ${faceMatch.player.position}, 유사도 ${faceMatch.similarity}%)
// - 플레이 스타일: ${styleMatch.player.name} (${styleMatch.player.country})
// - 사용자 칭호: "${nickname}"
// - ${isPerfectMatch ? '두 결과가 같은 선수 — 완벽 일치!' : '두 결과가 서로 다른 선수'}

// [작성 가이드]
// - 친근한 존댓말, 2~3문장
// - 얼굴 닮은꼴과 플레이 스타일을 자연스럽게 엮을 것
// - 마지막에 살짝 위트 한 스푼
// - 마크다운/이모지 없이 일반 텍스트`;

//   try {
//     const res = await fetch(PROXY_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ prompt }),
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     return data.text || data.completion || null;
//   } catch {
//     return null;
//   }
// }

// import { TYPE_ADJECTIVE } from './abilities.js';

// // API 없을 때 사용하는 기본 카피.
// // 핵심: 타입(퀴즈 결과)을 먼저 단정적으로 선언 → 마지막에 얼굴 매칭을 호기심 티저로.
// // 닮은꼴 선수 이름은 절대 카피에 노출하지 않음 (이스터에그 탭에서만 공개).
// export function defaultResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }) {
//   const typeAdj = TYPE_ADJECTIVE[styleMatch.type] || '월드컵의 별';
//   const styleP = styleMatch.player;

//   // 사진 모드 + 완벽 일치 — 관상까지 같은 선수
//   if (faceMatch && isPerfectMatch) {
//     return `${styleP.name} 그 자체! 관상부터 플레이 스타일까지 완벽한 매치, 진정한 "${nickname}"입니다.`;
//   }

//   // 사진 모드 + 다른 선수 — 타입 단정 + 얼굴은 티저로 숨김
//   if (faceMatch && faceMatch.player.slug !== styleP.slug) {
//     return `${typeAdj} ${styleP.name}의 심장을 가진 당신! 그라운드 위 가장 무서운 지배자입니다. (소근소근.. 근데 당신 얼굴에서 ${faceMatch.player.country} 국대 선수의 관상이 보이는데..?! 👇 아래에서 확인)`;
//   }

//   // 사진 없음
//   return `${typeAdj} ${styleP.name}의 심장을 가진 당신! 그라운드 위 가장 무서운 지배자입니다.`;
// }
// Claude API 호출은 브라우저에서 직접 하면 API 키가 노출되므로
// Vercel Edge Function 등 서버리스 프록시를 거치는 걸 권장.
// 프록시가 없으면 defaultResultCopy()로 폴백.

// Claude API 호출 및 트렌디한 톤앤매너 반영 버전

// Claude API 호출 및 담백한 톤앤매너 밸런스 버전

const PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL;

export async function generateResultCopy({
  faceMatch,
  styleMatch,
  nickname,
  isPerfectMatch,
}) {
  if (!PROXY_URL) return null;

  const hasPhoto = faceMatch && faceMatch.similarity > 0;

  const prompt = `KickKick 결과 카드에 들어갈 분석 문구를 작성해주세요.

[분석 결과]
- 얼굴 닮은꼴 선수: ${
    hasPhoto ? `${faceMatch.player.name} (${faceMatch.player.country})` : '없음'
  }
- 플레이 스타일(메인 카드 일러스트): ${styleMatch.player.name} (${
    styleMatch.player.country
  })
- 사용자 칭호: "${nickname}"
- 상태: ${isPerfectMatch ? '얼굴과 성향 일치' : '얼굴과 성향이 다른 반전 매치'}

[작성 가이드 - 밸런스 조절]
1. 너무 과한 인터넷 유행어(초딩 말투, 주접 멘트 등)는 절대 금지.
2. 모바일/인스타에서 읽기 좋은 담백하고 캐주얼한 존댓말 톤앤매너. (~군요, ~입니다)
3. '관상', 'AI 정밀 분석' 대신 '비주얼 느낌', '외모 분위기', '플레이 스타일' 같은 일상적인 단어 활용.
4. ${
    hasPhoto
      ? `메인 카드의 ${styleMatch.player.name} 카드는 유저의 '외모 분위기'와 '플레이 성향'이 믹스되어 나온 결과라는 점을 명확히 전달할 것.`
      : `유저의 성향 결과를 세련되게 설명할 것.`
  }
5. 딱 2~3문장으로 깔끔하게 끝내기. (마크다운/이모지 제외)`;

  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.text || data.completion || null;
  } catch {
    return null;
  }
}

import { TYPE_ADJECTIVE } from './abilities.js';

// API 없을 때 사용하는 기본 카피 (담백한 버전)
export function defaultResultCopy({
  faceMatch,
  styleMatch,
  nickname,
  isPerfectMatch,
}) {
  const typeAdj = TYPE_ADJECTIVE[styleMatch.type] || '월드컵의 별';
  const styleP = styleMatch.player;

  // 1. 사진 모드 + 관상과 성향 완벽 일치
  if (faceMatch && isPerfectMatch) {
    return `외모 분위기부터 플레이 스타일까지 완전히 ${styleP.name}를 빼닮았네요. 싱크로율 100%에 어울리는 진정한 "${nickname}" 카드가 발급되었습니다.`;
  }

  // 2. 사진 모드 + 얼굴(하키미)과 성향(메시)이 다른 경우
  if (faceMatch && faceMatch.player.slug !== styleP.slug) {
    return `내 비주얼과 플레이 성향이 믹스된 유니크한 캐릭터 카드입니다. 외모는 ${faceMatch.player.country} 국대 특유의 단단한 아우라가 느껴지는데, 내면은 ${typeAdj} ${styleP.name}의 감각을 장착했군요. 묘하게 어울리는 반전 매력이 있습니다! (내 얼굴 속 숨겨진 선수는 👇 아래 탭에서 확인)`;
  }

  // 3. 사진 없이 성향만 본 유저
  return `${typeAdj} ${styleP.name}의 심장을 장착한 당신! 그라운드 위에서 남다른 존재감을 보여주는 확실한 지배자 스타일입니다.`;
}
