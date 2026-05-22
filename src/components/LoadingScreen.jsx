import { useEffect, useState } from 'react';

const MESSAGES = [
  '얼굴에서 특징을 추출하는 중...',
  '월드컵 선수들과 비교하는 중...',
  '플레이 스타일을 매칭하는 중...',
  '결과를 정리하는 중...',
];

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="screen loading">
      <div className="loading-ball" />
      <h2 className="loading-title">AI가 분석 중이에요</h2>
      <p className="loading-text">{MESSAGES[idx]}</p>
    </div>
  );
}
