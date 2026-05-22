import { useEffect, useState } from 'react';

// /players/<slug>/01.(jpg|png|jpeg|webp) 순서로 시도.
// 모두 실패하면 슬러그 해시 기반 그라데이션 + 이니셜 플레이스홀더.

const EXTS = ['jpg', 'png', 'jpeg', 'webp'];

export default function PlayerAvatar({ player, size = 'md' }) {
  const [extIdx, setExtIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  // 선수 바뀌면 초기화
  useEffect(() => {
    setExtIdx(0);
    setFailed(false);
  }, [player.slug]);

  if (failed) {
    return <Placeholder player={player} size={size} />;
  }

  const url = player.photoUrl || `/players/${player.slug}/01.${EXTS[extIdx]}`;

  return (
    <img
      src={url}
      alt={player.name}
      className={`player-avatar player-avatar-${size}`}
      onError={() => {
        if (extIdx < EXTS.length - 1) {
          setExtIdx((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
      loading="lazy"
    />
  );
}

function Placeholder({ player, size }) {
  const initial =
    (player.nameEn && player.nameEn.trim().charAt(0)) ||
    (player.name && player.name.trim().charAt(0)) ||
    '?';
  const hue = hashStr(player.slug || player.name || '') % 360;
  return (
    <div
      className={`player-avatar player-avatar-${size} player-avatar-placeholder`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 55%, 38%), hsl(${(hue + 40) % 360}, 55%, 22%))`,
      }}
      aria-label={player.name}
    >
      <span>{initial}</span>
    </div>
  );
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
