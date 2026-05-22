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

function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  );
}

// 모든 <img>를 캡처 직전 data URL로 변환.
// iOS Safari는 메모리 압박 시 디코딩된 이미지 데이터를 GC하기 때문에
// img.complete === true여도 toBlob 시점에 빈 캔버스가 그려질 수 있음.
// 미리 fetch → base64 변환 → src를 data URL로 교체하면, html-to-image가
// 외부 fetch/decode 없이 인라인 데이터로 캔버스에 직접 그릴 수 있어 안정적.
async function inlineImagesToDataUrls(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  const restoreFns = [];

  await Promise.all(
    imgs.map(async (img) => {
      const originalSrc = img.src;
      if (originalSrc.startsWith('data:')) return; // 이미 인라인
      try {
        const response = await fetch(originalSrc);
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        await new Promise((resolve) => {
          const done = () => {
            img.removeEventListener('load', done);
            img.removeEventListener('error', done);
            resolve();
          };
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
          img.src = dataUrl;
        });
        try {
          await img.decode?.();
        } catch {
          /* 무시 */
        }
        restoreFns.push(() => {
          img.src = originalSrc;
        });
      } catch {
        /* 개별 이미지 실패는 무시하고 진행 */
      }
    }),
  );

  return () => restoreFns.forEach((fn) => fn());
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
  const [busy, setBusy] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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

    // mask-image를 인라인 스타일로 직접 비활성화 (html-to-image 비호환)
    const illustration = cardRef.current.querySelector('.hero-illustration');
    const originalMask = illustration?.style.maskImage;
    const originalWebkitMask = illustration?.style.webkitMaskImage;
    if (illustration) {
      illustration.style.maskImage = 'none';
      illustration.style.webkitMaskImage = 'none';
    }
    cardRef.current.dataset.capturing = 'true';

    const wasRevealed = easterRevealed;
    if (faceMatch && !wasRevealed) setEasterRevealed(true);

    // React 상태 commit 대기 + 이스터에그 img mount 대기
    await new Promise((r) => setTimeout(r, 60));

    // 모든 img를 data URL로 인라인 (iOS Safari GC 이슈 회피)
    const restoreImages = await inlineImagesToDataUrls(cardRef.current);

    const { toBlob } = await import('html-to-image');
    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        cacheBust: false,
        backgroundColor: '#0a0e1a',
      });
      return blob;
    } finally {
      restoreImages();
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

  const handleSave = async () => {
    if (busy) return;
    setBusy('save');
    try {
      const blob = await captureImage();
      if (!blob) throw new Error('이미지 생성 실패');
      const filename = `kickkick-${styleMatch.type}.png`;
      if (isMobile()) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        downloadBlob(blob, filename);
      }
    } catch (e) {
      alert('이미지 저장 실패: ' + (e.message || e));
    } finally {
      setBusy(null);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy('share');
    try {
      const blob = await captureImage();
      if (!blob) throw new Error('이미지 생성 실패');
      const filename = `kickkick-${styleMatch.type}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
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
      downloadBlob(blob, filename);
      alert(
        '이 기기에서는 직접 공유가 안 돼서 이미지로 저장했어요. 사진앱에서 인스타 스토리로 올려보세요!'
      );
    } catch (e) {
      alert('공유 실패: ' + (e.message || e));
    } finally {
      setBusy(null);
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
        <button
          className="btn-primary"
          onClick={handleShare}
          disabled={busy !== null}
        >
          {busy === 'share' ? '준비 중...' : '📸 인스타 공유하기'}
        </button>
        <button
          className="btn-ghost"
          onClick={handleSave}
          disabled={busy !== null}
        >
          {busy === 'save' ? '저장 중...' : ' 📸 카드 저장하기'}
        </button>
        <button
          className="btn-ghost"
          onClick={onRestart}
          disabled={busy !== null}
        >
          🔄 다시 하기
        </button>
      </div>

      {previewUrl && (
        <div className="image-preview-modal" onClick={closePreview}>
          <div
            className="image-preview-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewUrl}
              alt="결과 이미지"
              className="image-preview-img"
            />
            <p className="image-preview-hint">
              👇 이미지를 <b>길게 눌러</b> "사진에 저장"을 선택하세요
            </p>
            <button className="btn-ghost" onClick={closePreview}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
