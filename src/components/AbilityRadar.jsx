import { ABILITY_AXES } from '../utils/abilities.js';

// 5각형 능력치 레이더 차트. scores는 { 슈팅: 0~100, ... } 형식.

export default function AbilityRadar({ scores }) {
  const cx = 100;
  const cy = 100;
  const r = 64;
  const n = ABILITY_AXES.length;

  const pts = ABILITY_AXES.map((axis, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const value = scores[axis] || 0;
    const ratio = value / 100;
    return {
      axis,
      value,
      px: cx + Math.cos(angle) * r * ratio,
      py: cy + Math.sin(angle) * r * ratio,
      ex: cx + Math.cos(angle) * r,
      ey: cy + Math.sin(angle) * r,
      lx: cx + Math.cos(angle) * (r + 22),
      ly: cy + Math.sin(angle) * (r + 22),
    };
  });

  const polygon = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.px} ${p.py}`).join(' ') + 'Z';

  const grids = [0.25, 0.5, 0.75, 1].map((scale) =>
    ABILITY_AXES
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + Math.cos(angle) * r * scale;
        const y = cy + Math.sin(angle) * r * scale;
        return `${i === 0 ? 'M' : 'L'}${x} ${y}`;
      })
      .join(' ') + 'Z',
  );

  return (
    <svg viewBox="0 0 200 200" className="ability-radar" role="img" aria-label="능력치 차트">
      {grids.map((d, i) => (
        <path key={`g-${i}`} d={d} className="radar-grid" />
      ))}
      {pts.map((p, i) => (
        <line key={`ax-${i}`} x1={cx} y1={cy} x2={p.ex} y2={p.ey} className="radar-axis" />
      ))}
      <path d={polygon} className="radar-data" />
      {pts.map((p, i) => (
        <circle key={`pt-${i}`} cx={p.px} cy={p.py} r="3" className="radar-point" />
      ))}
      {pts.map((p, i) => (
        <g key={`l-${i}`}>
          <text x={p.lx} y={p.ly - 5} textAnchor="middle" className="radar-label">
            {p.axis}
          </text>
          <text x={p.lx} y={p.ly + 8} textAnchor="middle" className="radar-value">
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
