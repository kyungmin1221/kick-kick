import { ABILITY_AXES } from '../utils/abilities.js';

// 5각형 능력치 레이더 차트.
// 색상은 인라인 attribute로 지정 — html-to-image가 SVG의 CSS fill/stroke를
// 제대로 못 잡아낼 때가 있어서 안전하게 attribute로 직접 박음.

const COL_GRID = 'rgba(255,255,255,0.12)';
const COL_AXIS = 'rgba(255,255,255,0.1)';
const COL_DATA_FILL = 'rgba(245,197,24,0.28)';
const COL_DATA_STROKE = '#f5c518';
const COL_LABEL = 'rgba(255,255,255,0.78)';
const COL_VALUE = '#f5c518';

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
        <path key={`g-${i}`} d={d} fill="none" stroke={COL_GRID} strokeWidth="1" />
      ))}
      {pts.map((p, i) => (
        <line
          key={`ax-${i}`}
          x1={cx}
          y1={cy}
          x2={p.ex}
          y2={p.ey}
          stroke={COL_AXIS}
          strokeWidth="1"
        />
      ))}
      <path
        d={polygon}
        fill={COL_DATA_FILL}
        stroke={COL_DATA_STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle key={`pt-${i}`} cx={p.px} cy={p.py} r="3" fill={COL_DATA_STROKE} />
      ))}
      {pts.map((p, i) => (
        <g key={`l-${i}`}>
          <text
            x={p.lx}
            y={p.ly - 5}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill={COL_LABEL}
          >
            {p.axis}
          </text>
          <text
            x={p.lx}
            y={p.ly + 8}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={COL_VALUE}
          >
            {p.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
