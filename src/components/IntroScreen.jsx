export default function IntroScreen({ onStart }) {
  return (
    <div className="screen intro">
      <div className="intro-hero">
        <div className="intro-badge">2026 FIFA WORLD CUP</div>
        <h1 className="intro-title">
          KICK<span className="intro-title-accent">KICK</span>
        </h1>
        <p className="intro-subtitle">나와 닮은 월드컵 선수 찾기</p>
        <p className="intro-desc">
          간단한 10문항 + 사진 한 장으로 <br />
          나와 가장 닮은 선수를 찾아드려요.
        </p>
      </div>

      <button className="btn-primary" onClick={onStart}>
        지금 시작하기
      </button>

      <ul className="intro-steps">
        <li>1. 10문항 답하기</li>
        <li>2. 정면 사진 업로드</li>
        <li>3. AI가 닮은 선수 찾기</li>
      </ul>
    </div>
  );
}
