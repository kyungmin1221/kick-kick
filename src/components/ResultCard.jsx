import { useEffect, useMemo, useRef, useState } from 'react';
import PlayerAvatar from './PlayerAvatar.jsx';
import AbilityRadar from './AbilityRadar.jsx';
import { TYPE_NICKNAME, computeAbilities } from '../utils/abilities.js';
import { defaultResultCopy, generateResultCopy } from '../utils/claudeApi.js';

function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

// 캡처 직전 카드 내 모든 <img>가 로드 완료될 때까지 대기.
// (그렇지 않으면 캡처 결과에서 이미지가 누락되거나 레이아웃이 깨질 수 있음)
function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          }),
    ),
  );
}

export default function ResultCard({ result, answers, onRestart }) {
  const { faceMatch, styleMatch, isPerfectMatch } = result;
  const nickname = TYPE_NICKNAME[styleMatch.type] || '월드컵의 별';
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(null); // null | 'save' | 'share'
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const shareText = isPerfectMatch
    ? `🎯 나는 ${faceMatch.player.countryFlag} ${faceMatch.player.name}과 완벽 일치! — "${nickname}" / KickKick`
    : `${faceMatch.player.countryFlag} ${faceMatch.player.name} 얼굴 닮은꼴 + ${styleMatch.player.countryFlag} ${styleMatch.player.name} 스타일 — "${nickname}" / KickKick`;

  const captureImage = async () => {
    if (!cardRef.current) return null;
    // 캡처 전에 카드 안의 모든 이미지 로드 보장
    await waitForImages(cardRef.current);
    // 레이아웃 안정화를 위한 약간의 대기
    await new Promise((r) => setTimeout(r, 80));
    const { toBlob } = await import('html-to-image');
    // 동일 출처 이미지를 두 번 한 번 더 거쳐 캐시 워밍 (간헐적 race 회피)
    await toBlob(cardRef.current, {
      pixelRatio: 1,
      cacheBust: false,
      backgroundColor: '#0a0e1a',
    });
    return await toBlob(cardRef.current, {
      pixelRatio: 2,
      cacheBust: false,
      backgroundColor: '#0a0e1a',
    });
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
      const filename = `kickkick-${faceMatch.player.slug}.png`;

      if (isMobile()) {
        // 모바일: 이미지를 모달로 띄워 길게 눌러 저장 안내
        // (iOS Safari는 <a download>가 사진앱이 아니라 파일앱으로 가서 통하지 않음)
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } else {
        // 데스크탑: 일반 다운로드
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
      const filename = `kickkick-${faceMatch.player.slug}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      // Web Share API + 파일: 모바일에서 인스타/카톡 등 공유 시트 호출
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'KickKick 결과',
            text: shareText,
          });
          return;
        } catch (e) {
          if (e.name === 'AbortError') return; // 사용자가 취소
          // 그 외 에러는 폴백으로 진행
        }
      }
      // 폴백: 이미지 다운로드 + 안내
      downloadBlob(blob, filename);
      alert('이 기기에서는 직접 공유가 안 돼서 이미지로 저장했어요. 사진앱에서 인스타 스토리로 올려보세요!');
    } catch (e) {
      alert('공유 실패: ' + (e.message || e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="screen result">
      <div className="result-card" ref={cardRef}>
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
        <button className="btn-primary" onClick={handleShare} disabled={busy !== null}>
          {busy === 'share' ? '준비 중...' : '📤 공유하기'}
        </button>
        <button className="btn-ghost" onClick={handleSave} disabled={busy !== null}>
          {busy === 'save' ? '저장 중...' : '📥 사진 저장'}
        </button>
        <button className="btn-ghost" onClick={onRestart} disabled={busy !== null}>
          다시 해보기
        </button>
      </div>

      {previewUrl && (
        <div className="image-preview-modal" onClick={closePreview}>
          <div className="image-preview-inner" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="결과 이미지" className="image-preview-img" />
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
