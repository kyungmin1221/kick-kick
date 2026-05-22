// Claude API 호출은 브라우저에서 직접 하면 API 키가 노출되므로
// Vercel Edge Function 등 서버리스 프록시를 거치는 걸 권장.
// 프록시가 없으면 players_descriptors.json의 기본 description을 그대로 사용한다.

const PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL;

export async function generateResultDescription({ answerTypes, player, similarity }) {
  if (!PROXY_URL) return null;

  const prompt = `사용자가 축구 스타일 테스트를 완료했습니다.
퀴즈 답변 타입: [${answerTypes.join(', ')}]
매칭된 선수: ${player.name} (${player.country}, ${player.position})
얼굴 유사도: ${similarity}%

위 정보를 바탕으로 재미있고 공감가는 결과 설명을 2~3문장으로 작성해주세요.
플레이 스타일과 외모 닮은꼴을 자연스럽게 연결해주세요.
반말 X, 친근한 존댓말로.`;

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
