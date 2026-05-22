export default function IntroScreen({ onStart, onStartNoPhoto }) {
  return (
    <div className="screen intro">
      <div className="intro-hero">
        <div className="intro-badge">2026 월드컵 나와 닮은 선수는?</div>
        <h1 className="intro-title">
          KICK<span className="intro-title-accent">KICK</span>
        </h1>
        <p className="intro-subtitle">나와 닮은 월드컵 선수 찾기</p>
        <p className="intro-desc">
          10문항으로 내 플레이 스타일을 찾고, <br />
          (선택) 사진까지 더하면 닮은 선수도 알려드려요.
        </p>
      </div>

      <div className="intro-actions">
        <button className="btn-primary" onClick={onStart}>
          📸 사진 올리고 시작하기
        </button>
        <button className="btn-ghost" onClick={onStartNoPhoto}>
          사진 없이 성향만 보기
        </button>
      </div>

      <ul className="intro-steps">
        <li>1. 10문항 답하기 (30초)</li>
        <li>2. (선택) 사진 한 장 올리기</li>
        <li>3. 내 월드컵 캐릭터 카드 받기</li>
      </ul>
    </div>
  );
}
