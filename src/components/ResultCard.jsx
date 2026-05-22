import { useEffect, useMemo, useState } from 'react';
import PlayerAvatar from './PlayerAvatar.jsx';
import AbilityRadar from './AbilityRadar.jsx';
import { TYPE_NICKNAME, computeAbilities } from '../utils/abilities.js';
import { defaultResultCopy, generateResultCopy } from '../utils/claudeApi.js';

export default function ResultCard({ result, answers, onRestart }) {
  const { faceMatch, styleMatch, isPerfectMatch } = result;
  const nickname = TYPE_NICKNAME[styleMatch.type] || '월드컵의 별';

  const abilities = useMemo(
    () => computeAbilities(answers.map((a) => a.type)),
    [answers],
  );

  const fallbackCopy = useMemo(
    () => defaultResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }),
    [faceMatch, styleMatch, nickname, isPerfectMatch],
  );
  const [copy, setCopy] = useState(fallbackCopy);
  const [loadingCopy, setLoadingCopy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCopy(fallbackCopy);
    setLoadingCopy(true);
    generateResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch })
      .then((text) => {
        if (!cancelled && text) setCopy(text);
      })
      .finally(() => {
        if (!cancelled) setLoadingCopy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [faceMatch, styleMatch, nickname, isPerfectMatch, fallbackCopy]);

  const handleShare = async () => {
    const text = isPerfectMatch
      ? `🎯 나는 ${faceMatch.player.countryFlag} ${faceMatch.player.name}과 완벽 일치! 얼굴 ${faceMatch.similarity}% — "${nickname}" / KickKick`
      : `${faceMatch.player.countryFlag} ${faceMatch.player.name} 얼굴 ${faceMatch.similarity}% + ${styleMatch.player.countryFlag} ${styleMatch.player.name} 스타일 — "${nickname}" / KickKick`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'KickKick 결과', text });
        return;
      } catch {
        /* 취소 */
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
        {isPerfectMatch && <div className="result-perfect-badge">🔥 완벽 일치</div>}

        <div className="result-nickname">"{nickname}"</div>

        <div className="result-main">
          <PlayerAvatar player={faceMatch.player} size="lg" />
          <div className="result-main-stats">
            <div className="result-similarity">
              <span className="result-similarity-num">{faceMatch.similarity}</span>
              <span className="result-similarity-unit">%</span>
            </div>
            <div className="result-similarity-label">얼굴 닮은꼴</div>
            <div className="result-flag-small">{faceMatch.player.countryFlag}</div>
          </div>
        </div>

        <h2 className="result-name">{faceMatch.player.name}</h2>
        <div className="result-meta">
          {faceMatch.player.country} · {faceMatch.player.position} · {faceMatch.player.nameEn}
        </div>

        <div className="result-tags">
          {faceMatch.player.tags.map((tag) => (
            <span key={tag} className="result-tag">
              #{tag}
            </span>
          ))}
        </div>

        {!isPerfectMatch && (
          <div className="result-divider">
            <span>플레이 스타일</span>
          </div>
        )}
        {!isPerfectMatch && (
          <div className="result-style-row">
            <PlayerAvatar player={styleMatch.player} size="sm" />
            <div className="result-style-text">
              <div className="result-style-name">
                {styleMatch.player.countryFlag} {styleMatch.player.name}
              </div>
              <div className="result-style-meta">
                {styleMatch.player.country} · {styleMatch.player.position}
              </div>
            </div>
          </div>
        )}

        <div className="result-divider">
          <span>나의 능력치</span>
        </div>
        <div className="result-radar-wrap">
          <AbilityRadar scores={abilities} />
        </div>

        <p className="result-description">
          {loadingCopy && copy === fallbackCopy ? '결과 설명을 만드는 중...' : copy}
        </p>

        {faceMatch.mode === 'quiz-only' && (
          <p className="result-notice">
            * 선수 얼굴 데이터가 아직 준비되지 않아 퀴즈 결과로만 매칭됐어요.
          </p>
        )}
        <p className="result-disclaimer">
          ⚽ 친구에게 공유해봐요!
        </p>
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
