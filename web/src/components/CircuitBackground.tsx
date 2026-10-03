import { useEffect, useState } from 'react';

const CELL = 44; // grid module (px); everything snaps to this so it stays aligned

type Pt = [number, number]; // grid-cell coordinates

/**
 * Fixed, behind-content background styled like an integrated circuit: a dark
 * grid overlaid with faint copper-style traces, vias/pads at their corners, and
 * a few "chip" packages with pins — plus gray pulses that run the traces
 * (straight → turn → slide out) at irregular speeds. All snapped to the grid.
 */
export function CircuitBackground() {
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!w || !h) return null;

  const px = (n: number) => n * CELL;
  const cols = Math.ceil(w / CELL);
  const rows = Math.ceil(h / CELL);
  const R = (f: number, n: number) => Math.round(n * f);

  const vLines = Array.from({ length: cols + 1 }, (_, i) => px(i));
  const hLines = Array.from({ length: rows + 1 }, (_, i) => px(i));

  // Traces as grid-cell point paths (so we can draw the line, its corner pads,
  // and the animated pulse from one definition).
  const traces: { pts: Pt[]; dur: number; delay: number; ease: string }[] = [
    { pts: [[-1, 3], [R(0.45, cols), 3], [R(0.45, cols), 1], [cols + 1, 1]], dur: 4, delay: 0, ease: 'cubic-bezier(0.6,0,0.4,1)' },
    { pts: [[cols + 1, 6], [R(0.6, cols), 6], [R(0.6, cols), 11], [-1, 11]], dur: 7, delay: 1.2, ease: 'ease-in-out' },
    { pts: [[-1, R(0.7, rows)], [R(0.3, cols), R(0.7, rows)], [R(0.3, cols), rows + 1]], dur: 5.5, delay: 2.2, ease: 'ease-in' },
    { pts: [[R(0.5, cols), -1], [R(0.5, cols), 5], [cols + 1, 5]], dur: 8, delay: 0.7, ease: 'ease-out' },
    { pts: [[-1, rows - 2], [R(0.75, cols), rows - 2], [R(0.75, cols), R(0.6, rows)], [cols + 1, R(0.6, rows)]], dur: 5, delay: 1.8, ease: 'cubic-bezier(0.9,0,0.1,1)' },
    { pts: [[R(0.82, cols), rows + 1], [R(0.82, cols), 2], [cols + 1, 2]], dur: 6.5, delay: 3, ease: 'ease-in-out' },
  ];

  const dOf = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${px(p[0])} ${px(p[1])}`).join(' ');
  const onScreen = (p: Pt) => px(p[0]) >= 0 && px(p[0]) <= w && px(p[1]) >= 0 && px(p[1]) <= h;

  // Chip packages (col, row, w, h in cells).
  const chips = [
    { c: R(0.16, cols), r: R(0.24, rows), cw: 3, ch: 2, label: 'LLM' },
    { c: R(0.68, cols), r: R(0.32, rows), cw: 2, ch: 3, label: 'NPU' },
    { c: R(0.4, cols), r: R(0.78, rows), cw: 3, ch: 2, label: 'RAG' },
  ];

  const trace = 'rgba(130,134,146,0.16)';
  const pad = 'rgba(150,154,166,0.28)';
  const chipStroke = 'rgba(140,144,156,0.22)';

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: -1,
        WebkitMaskImage: 'linear-gradient(to bottom, #000 40%, transparent 95%)',
        maskImage: 'linear-gradient(to bottom, #000 40%, transparent 95%)',
      }}
    >
      <svg width={w} height={h} className="block">
        {/* grid */}
        <g stroke="#16181d" strokeWidth={1}>
          {vLines.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={h} />
          ))}
          {hLines.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={w} y2={y} />
          ))}
        </g>

        {/* chips */}
        {chips.map((ch, i) => {
          const x = px(ch.c);
          const y = px(ch.r);
          const cw = px(ch.cw);
          const chh = px(ch.ch);
          return (
            <g key={`chip${i}`} stroke={chipStroke} fill="none">
              {/* opaque fill so the grid never shows through the chip package */}
              <rect x={x} y={y} width={cw} height={chh} rx={4} fill="#0d0e12" />
              {/* pins on left/right */}
              {Array.from({ length: ch.ch }, (_, k) => (
                <g key={k} strokeWidth={1}>
                  <line x1={x - 6} y1={y + px(k) + CELL / 2} x2={x} y2={y + px(k) + CELL / 2} />
                  <line x1={x + cw} y1={y + px(k) + CELL / 2} x2={x + cw + 6} y2={y + px(k) + CELL / 2} />
                </g>
              ))}
              {/* AI acronym label */}
              <text
                x={x + cw / 2}
                y={y + chh / 2}
                stroke="none"
                fill="rgba(150,154,166,0.5)"
                fontSize={12}
                fontFamily="'JetBrains Mono', monospace"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {ch.label}
              </text>
            </g>
          );
        })}

        {/* static traces + corner pads (vias) */}
        {traces.map((t, i) => (
          <g key={`tr${i}`}>
            <path d={dOf(t.pts)} stroke={trace} strokeWidth={1.5} fill="none" />
            {t.pts.filter(onScreen).map((p, j) => (
              <circle key={j} cx={px(p[0])} cy={px(p[1])} r={3} fill="none" stroke={pad} strokeWidth={1.5} />
            ))}
          </g>
        ))}

        {/* animated gray pulses */}
        {traces.map((t, i) => (
          <path
            key={`beam${i}`}
            d={dOf(t.pts)}
            className="circuit-beam"
            stroke="rgba(138,142,154,0.55)"
            strokeWidth={1.75}
            fill="none"
            pathLength={100}
            style={{ animationDuration: `${t.dur}s`, animationDelay: `${t.delay}s`, animationTimingFunction: t.ease }}
          />
        ))}
      </svg>
    </div>
  );
}
