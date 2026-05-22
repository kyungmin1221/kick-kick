import { useEffect, useState } from 'react';

// /players/<slug>/illustration.(png|jpg|jpeg|webp) 순서로 시도.
// AI 일러스트가 준비된 선수는 자동 노출, 없으면 null 반환(자리 차지 안 함).

const EXTS = ['png', 'jpg', 'jpeg', 'webp'];

export default function PlayerIllustration({ player, onLoaded, onFailed }) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setExtIdx(0);
    setFailed(false);
  }, [player.slug]);

  if (failed) return null;

  const url =
    player.illustrationUrl ||
    `/players/${player.slug}/illustration.${EXTS[extIdx]}`;

  return (
    <img
      src={url}
      alt={`${player.name} 일러스트`}
      className="hero-illustration"
      onLoad={() => onLoaded && onLoaded()}
      onError={() => {
        if (extIdx < EXTS.length - 1) {
          setExtIdx((i) => i + 1);
        } else {
          setFailed(true);
          onFailed && onFailed();
        }
      }}
    />
  );
}
