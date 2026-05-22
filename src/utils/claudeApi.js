// Claude API 호출은 브라우저에서 직접 하면 API 키가 노출되므로
// Vercel Edge Function 등 서버리스 프록시를 거치는 걸 권장.
// 프록시가 없으면 defaultResultCopy()로 폴백.

const PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL;

export async function generateResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }) {
  if (!PROXY_URL) return null;

  const prompt = `KickKick 닮은 선수 찾기 결과 카드에 들어갈 한 줄 카피를 작성해주세요.

[분석 결과]
- 얼굴 닮은꼴: ${faceMatch.player.name} (${faceMatch.player.country}, ${faceMatch.player.position}, 유사도 ${faceMatch.similarity}%)
- 플레이 스타일: ${styleMatch.player.name} (${styleMatch.player.country})
- 사용자 칭호: "${nickname}"
- ${isPerfectMatch ? '두 결과가 같은 선수 — 완벽 일치!' : '두 결과가 서로 다른 선수'}

[작성 가이드]
- 친근한 존댓말, 2~3문장
- 얼굴 닮은꼴과 플레이 스타일을 자연스럽게 엮을 것
- 마지막에 살짝 위트 한 스푼
- 마크다운/이모지 없이 일반 텍스트`;

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

// API 없을 때 사용하는 기본 카피.
// 핵심: 타입(퀴즈 결과)을 먼저 단정적으로 선언 → 마지막에 얼굴 매칭을 호기심 티저로.
// 닮은꼴 선수 이름은 절대 카피에 노출하지 않음 (이스터에그 탭에서만 공개).
export function defaultResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }) {
  const typeAdj = TYPE_ADJECTIVE[styleMatch.type] || '월드컵의 별';
  const styleP = styleMatch.player;

  // 사진 모드 + 완벽 일치 — 관상까지 같은 선수
  if (faceMatch && isPerfectMatch) {
    return `${styleP.name} 그 자체! 관상부터 플레이 스타일까지 완벽한 매치, 진정한 "${nickname}"입니다.`;
  }

  // 사진 모드 + 다른 선수 — 타입 단정 + 얼굴은 티저로 숨김
  if (faceMatch && faceMatch.player.slug !== styleP.slug) {
    return `${typeAdj} ${styleP.name}의 심장을 가진 당신! 그라운드 위 가장 무서운 지배자입니다. (소근소근.. 근데 당신 얼굴에서 ${faceMatch.player.country} 국대 선수의 관상이 보이는데..?! 👇 아래에서 확인)`;
  }

  // 사진 없음
  return `${typeAdj} ${styleP.name}의 심장을 가진 당신! 그라운드 위 가장 무서운 지배자입니다.`;
}
