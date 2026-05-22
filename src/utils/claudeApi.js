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

// API 없을 때 사용하는 기본 카피
export function defaultResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }) {
  if (isPerfectMatch) {
    return `당신은 ${faceMatch.player.name} 그 자체! 얼굴부터 플레이 스타일까지 완벽한 매치, 진정한 "${nickname}" 타입입니다.`;
  }
  return `${faceMatch.player.name}의 얼굴에 ${styleMatch.player.name}의 심장을 가진 당신. "${nickname}" 타입의 당신은 그라운드 위 가장 무서운 조합입니다.`;
}
