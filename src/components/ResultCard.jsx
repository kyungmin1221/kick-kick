import { useEffect, useMemo, useRef, useState } from 'react';
import PlayerAvatar from './PlayerAvatar.jsx';
import PlayerIllustration from './PlayerIllustration.jsx';
import AbilityRadar from './AbilityRadar.jsx';
import {
  COUNTRY_THEME,
  TYPE_NICKNAME,
  TYPE_THEME,
  computeAbilities,
  getFunHashtags,
} from '../utils/abilities.js';
import { defaultResultCopy, generateResultCopy } from '../utils/claudeApi.js';

// 결과 카드 구조 (위계):
//   [1] HERO 캐릭터 카드  — 별명 + 국대 타입 + 캐릭터(유저 사진 또는 이모지) + 힙한 해시태그
//   [2] 능력치 레이더      — 큼직하게
//   [3] 카피 (관상+심장)   — "X의 관상에 Y의 심장을 가진 당신!"
//   [4] 이스터에그 (탭)    — "내 관상 속 숨겨진 닮은꼴 선수" (탭하면 펼쳐짐)

// 캡처 전 모든 <img> 로드 완료 대기.
async function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
    )
  );
}

export default function ResultCard({ result, answers, onRestart }) {
  const { faceMatch, styleMatch, isPerfectMatch, userPhotoUrl } = result;
  const nickname = TYPE_NICKNAME[styleMatch.type] || '월드컵의 별';
  const theme = TYPE_THEME[styleMatch.type] || TYPE_THEME.midfielder;
  const heroGradient =
    COUNTRY_THEME[styleMatch.player.country] || theme.gradient;
  const hashtags = useMemo(
    () => getFunHashtags(styleMatch.player),
    [styleMatch.player]
  );
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [easterRevealed, setEasterRevealed] = useState(false);
  // 일러스트 로드 여부 — 있으면 실제 사진은 작게(검증용), 없으면 크게(메인 비주얼)
  const [hasIllustration, setHasIllustration] = useState(false);

  useEffect(() => {
    setHasIllustration(false);
  }, [styleMatch.player.slug]);

  const abilities = useMemo(
    () => computeAbilities(answers.map((a) => a.type)),
    [answers]
  );

  const fallbackCopy = useMemo(
    () =>
      defaultResultCopy({ faceMatch, styleMatch, nickname, isPerfectMatch }),
    [faceMatch, styleMatch, nickname, isPerfectMatch]
  );
  const [copy, setCopy] = useState(fallbackCopy);
  const [loadingCopy, setLoadingCopy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCopy(fallbackCopy);
    setLoadingCopy(true);
    generateResultCopy({
      faceMatch: faceMatch || { player: styleMatch.player, similarity: 0 },
      styleMatch,
      nickname,
      isPerfectMatch: !faceMatch || isPerfectMatch,
    })
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

  const shareText = `🏆 나는 "${nickname}" — ${styleMatch.player.country} 국대 ${styleMatch.player.name} 타입! / KickKick`;

  const captureImage = async () => {
    if (!cardRef.current) return null;

    // mask-image는 html2canvas도 지원 못함 — 캡처 동안만 비활성화
    const illustration = cardRef.current.querySelector('.hero-illustration');
    const originalMask = illustration?.style.maskImage;
    const originalWebkitMask = illustration?.style.webkitMaskImage;
    if (illustration) {
      illustration.style.maskImage = 'none';
      illustration.style.webkitMaskImage = 'none';
    }
    cardRef.current.dataset.capturing = 'true';

    const wasRevealed = easterRevealed;
    if (faceMatch && !wasRevealed) {
      setEasterRevealed(true);
      // 💡 중요: 리렌더링과 DOM 안정화를 위해 대기 시간을 60ms에서 250ms 정도로 늘려줍니다.
      // 대중 스마트폰에서 이미지 리로드가 끝날 수 있는 충분한 숨통을 틔워줍니다.
      await new Promise((r) => setTimeout(r, 250));
    } else {
      // 이스터에그를 이미 열어둔 상태였어도 100ms는 기다려주는 게 안전합니다.
      await new Promise((r) => setTimeout(r, 100));
    }

    // 모든 이미지(특히 일러스트와 이스터에그 이미지)가 완벽히 로드되었는지 최종 확인
    await waitForImages(cardRef.current);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await Promise.race([
        html2canvas(cardRef.current, {
          useCORS: true,
          allowTaint: true, // 💡 CORS 이미지 유실 방지 보완
          scale: 2, // 2배 선명하게 굽기
          backgroundColor: '#0a0e1a',
          logging: false,
          imageTimeout: 8000,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('캡처 타임아웃 (10s)')), 10000)
        ),
      ]);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      return blob;
    } finally {
      if (illustration) {
        illustration.style.maskImage = originalMask || '';
        illustration.style.webkitMaskImage = originalWebkitMask || '';
      }
      if (cardRef.current) delete cardRef.current.dataset.capturing;
      if (!wasRevealed) setEasterRevealed(false);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await captureImage();
      if (!blob) throw new Error('이미지 생성 실패');
      const filename = `kickkick-${styleMatch.type}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          // iOS/Android 공유 시트 — "사진에 저장", 인스타 스토리, 카톡 등 다 여기서 선택
          await navigator.share({
            files: [file],
            title: 'KickKick 결과',
            text: shareText,
          });
          return;
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }
      // 데스크탑/미지원 브라우저 폴백 — 직접 다운로드
      downloadBlob(blob, filename);
    } catch (e) {
      alert('공유 실패: ' + (e.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen result">
      <div className="result-card" ref={cardRef}>
        {/* ===== HERO 캐릭터 카드 ===== */}
        <div className="hero-card" style={{ background: heroGradient }}>
          <div className="hero-card-watermark">
            {styleMatch.player.countryFlag}
          </div>

          {/* AI 일러스트 (있는 선수만 자동 등장) */}
          <PlayerIllustration
            player={styleMatch.player}
            onLoaded={() => setHasIllustration(true)}
            onFailed={() => setHasIllustration(false)}
          />

          <h1 className="hero-card-nickname">"{nickname}"</h1>
          <div className="hero-card-player-line">
            {styleMatch.player.country} 국대 <b>{styleMatch.player.name}</b>{' '}
            타입
          </div>

          {/* 실제 선수 사진 — 일러스트 있으면 검증용 작은 원, 없으면 메인 비주얼 */}
          <div
            className={`hero-card-character ${
              hasIllustration ? 'is-small' : 'is-large'
            }`}
          >
            <PlayerAvatar
              player={styleMatch.player}
              size={hasIllustration ? 'md' : 'hero'}
            />
            <div className="hero-character-badge">{theme.icon}</div>
          </div>

          {isPerfectMatch && faceMatch && (
            <div className="hero-card-perfect">🔥 관상까지 완벽 일치!</div>
          )}

          <div className="hero-card-tags">
            {hashtags.map((tag) => (
              <span key={tag} className="hero-card-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ===== 능력치 ===== */}
        <div className="result-section">
          <div className="result-section-title">⚡ 나의 능력치</div>
          <div className="result-radar-wrap">
            <AbilityRadar scores={abilities} />
          </div>
        </div>

        {/* ===== 카피 ===== */}
        <div className="result-analysis-label">✨ 당신을 위한 스페셜 분석</div>
        <p className="result-description">
          {loadingCopy && copy === fallbackCopy
            ? '결과 설명을 만드는 중...'
            : copy}
        </p>

        {/* ===== 이스터에그 (탭하면 펼쳐짐) ===== */}
        {faceMatch && !isPerfectMatch && (
          <button
            type="button"
            className={`easter-egg ${easterRevealed ? 'revealed' : ''}`}
            onClick={() => setEasterRevealed((v) => !v)}
          >
            <div className="easter-egg-head">
              <span className="easter-egg-icon">🔮</span>
              <span className="easter-egg-title">숨겨진 닮은꼴 선수</span>
              <span
                className={`easter-egg-cta ${
                  easterRevealed ? '' : 'easter-egg-cta-pulse'
                }`}
              >
                {easterRevealed ? '닫기 ▲' : '👇 탭!'}
              </span>
            </div>
            {easterRevealed && (
              <div className="easter-egg-body">
                <PlayerAvatar player={faceMatch.player} size="sm" />
                <div className="easter-egg-info">
                  <div className="ee-name">
                    {faceMatch.player.countryFlag} {faceMatch.player.name}
                  </div>
                  <div className="ee-meta">
                    {faceMatch.player.country} · {faceMatch.player.position}
                  </div>
                </div>
                <div className="ee-pct">{faceMatch.similarity}%</div>
              </div>
            )}
          </button>
        )}

        {!faceMatch && (
          <p className="result-no-photo">
            💡 사진을 올리면 나와 닮은 선수도 보여드려요
          </p>
        )}

        <p className="result-disclaimer">⚽ 친구에게 공유해봐요!</p>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={handleShare} disabled={busy}>
          {busy ? '준비 중...' : '📸 인스타 공유하기'}
        </button>
        <button className="btn-ghost" onClick={onRestart} disabled={busy}>
          🔄 다시 하기
        </button>
      </div>
    </div>
  );
}
