import { useEffect, useState } from 'react';
import { generateResultDescription } from '../utils/claudeApi.js';

export default function ResultCard({ result, answers, onRestart }) {
  const { player, similarity, mode } = result;
  const [aiDescription, setAiDescription] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingAi(true);
    generateResultDescription({
      answerTypes: answers.map((a) => a.type),
      player,
      similarity,
    })
      .then((text) => {
        if (!cancelled) setAiDescription(text);
      })
      .finally(() => {
        if (!cancelled) setLoadingAi(false);
      });
    return () => {
      cancelled = true;
    };
  }, [player, similarity, answers]);

  const handleShare = async () => {
    const text = `나는 ${player.country} ${player.countryFlag} ${player.name}과 ${similarity}% 닮았다! — KickKick`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'KickKick 결과', text });
        return;
      } catch {
        /* 사용자가 취소했을 수 있음 */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      alert('결과가 클립보드에 복사됐어요!');
    } catch {
      alert(text);
    }
  };

  return (
    <div className="screen result">
      <div className="result-card">
        <div className="result-similarity">
          <span className="result-similarity-num">{similarity}</span>
          <span className="result-similarity-unit">%</span>
        </div>
        <div className="result-similarity-label">일치도</div>

        <div className="result-flag">{player.countryFlag}</div>
        <h2 className="result-name">{player.name}</h2>
        <div className="result-meta">
          {player.country} · {player.position} · {player.nameEn}
        </div>

        <div className="result-tags">
          {player.tags.map((tag) => (
            <span key={tag} className="result-tag">
              #{tag}
            </span>
          ))}
        </div>

        <p className="result-description">
          {loadingAi ? '결과 설명을 만드는 중...' : aiDescription || player.description}
        </p>

        {mode === 'quiz-only' && (
          <p className="result-notice">
            * 선수 얼굴 데이터가 아직 준비되지 않아 퀴즈 결과로만 매칭됐어요.
          </p>
        )}
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={handleShare}>
          결과 공유하기
        </button>
        <button className="btn-ghost" onClick={onRestart}>
          다시 해보기
        </button>
      </div>
    </div>
  );
}
