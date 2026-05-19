/**
 * @fileoverview Adaptive SVG paint scene for Teaching Mode.
 *
 * A single SVG whose elements are progressively revealed based on the
 * current step's `paintScene` key.  Colours are passed as { r, g, b }
 * props and converted to hex via {@link toHex}.
 *
 * ## Layout (viewBox 0 0 900 <dynamic>)
 *
 *   Row 1 (y=14):  Alice's Secret | Public colour | Bob's Secret
 *   Row 2 (y=120): Alice's Mix | Alice's Final | Bob's Final | Bob's Mix
 *   Row 3 (y=222): Eve's attempt  ← step 7 only; viewBox extends to 295
 *
 * The wider 900-unit viewBox gives a landscape aspect ratio (~26–33 %)
 * so the SVG stays compact when scaled to the container width.
 */

import { toHex } from '../../utils/colourMix';

// ── Geometry constants ───────────────────────────────────────────────────────
const BW  = 60;   // bucket width
const BH  = 70;   // bucket height
const BRX = 9;    // corner radius
const TR  = 14;   // top-row y
const MR  = 120;  // middle-row y
const ER  = 222;  // Eve-row y (step 7 only)

/**
 * Left-edge and top-edge of every named bucket.
 * Centre: cx = rx + BW/2,  cy = ry + BH/2
 * @type {Record<string, { rx: number, ry: number }>}
 */
const BUCKETS = {
  'alice-secret': { rx: 30,  ry: TR },   // cx=60,  cy=49
  'public':       { rx: 420, ry: TR },   // cx=450, cy=49
  'bob-secret':   { rx: 810, ry: TR },   // cx=840, cy=49
  'alice-mix':    { rx: 30,  ry: MR },   // cx=60,  cy=155
  'alice-final':  { rx: 255, ry: MR },   // cx=285, cy=155
  'bob-final':    { rx: 555, ry: MR },   // cx=585, cy=155
  'bob-mix':      { rx: 810, ry: MR },   // cx=840, cy=155
};

/** Centre-x of a bucket. */
const cx  = id => BUCKETS[id].rx + BW / 2;
/** Centre-y of a bucket. */
const cy  = id => BUCKETS[id].ry + BH / 2;
/** Bottom-centre y. */
const bot = id => BUCKETS[id].ry + BH;
/** Top-centre y. */
const top = id => BUCKETS[id].ry;

/**
 * Which buckets are visible for each paintScene key.
 * @type {Record<string, string[]>}
 */
const VISIBLE_BUCKETS = {
  'public-only':  ['public'],
  'alice-secret': ['public', 'alice-secret'],
  'bob-secret':   ['public', 'alice-secret', 'bob-secret'],
  'alice-sends':  ['public', 'alice-secret', 'bob-secret', 'alice-mix'],
  'bob-sends':    ['public', 'alice-secret', 'bob-secret', 'alice-mix', 'bob-mix'],
  'final-mix':    ['public', 'alice-secret', 'bob-secret', 'alice-mix', 'bob-mix', 'alice-final', 'bob-final'],
  'eve-fails':    ['public', 'alice-secret', 'bob-secret', 'alice-mix', 'bob-mix', 'alice-final', 'bob-final'],
};

/**
 * Single-line label for each bucket (rendered below in Courier New).
 * @type {Record<string, string>}
 */
const LABELS = {
  'alice-secret': "Alice's secret",
  'public':       'Public colour',
  'bob-secret':   "Bob's secret",
  'alice-mix':    "Alice's mix",
  'alice-final':  "Alice's final",
  'bob-final':    "Bob's final",
  'bob-mix':      "Bob's mix",
};

/**
 * Maps bucket id → the colour prop to use.
 * @param {Object} colours - All colour props passed to StepVisual.
 * @returns {Record<string, { r:number, g:number, b:number }>}
 */
function colourMap(colours) {
  return {
    'alice-secret': colours.aliceSecret,
    'public':       colours.publicColour,
    'bob-secret':   colours.bobSecret,
    'alice-mix':    colours.aliceMix,
    'alice-final':  colours.aliceFinal,
    'bob-final':    colours.bobFinal,
    'bob-mix':      colours.bobMix,
  };
}

/**
 * Single-line SVG text label centred on x.
 * @param {{ x:number, y:number, text:string }} props
 */
function SvgLabel({ x, y, text }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontFamily="Courier New, monospace"
      fontSize="11"
      fill="#6b7280"
    >
      {text}
    </text>
  );
}

/**
 * One paint bucket: rounded rect + optional glow ring + label below.
 * @param {{ id:string, colour:{ r:number,g:number,b:number }, highlight:string[] }} props
 */
function Bucket({ id, colour, highlight }) {
  const { rx, ry } = BUCKETS[id];
  const hex = toHex(colour);
  const isHighlighted = highlight.includes(id);
  return (
    <g>
      {isHighlighted && (
        <rect
          x={rx - 4} y={ry - 4}
          width={BW + 8} height={BH + 8}
          rx={BRX + 4}
          fill="none" stroke="gold" strokeWidth="3" opacity="0.85"
          filter="url(#glow)"
        />
      )}
      <rect
        x={rx} y={ry} width={BW} height={BH} rx={BRX}
        fill={hex}
        stroke="rgba(0,0,0,0.18)" strokeWidth="2"
      />
      <SvgLabel x={rx + BW / 2} y={ry + BH + 14} text={LABELS[id]} />
    </g>
  );
}

/**
 * A simple straight arrow between two points.
 * @param {{ x1:number, y1:number, x2:number, y2:number, dashed?:boolean, colour?:string }} props
 */
function Arrow({ x1, y1, x2, y2, dashed = false, colour = '#94a3b8', markerId = 'arrowhead' }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={colour}
      strokeWidth="2"
      strokeDasharray={dashed ? '5 4' : undefined}
      markerEnd={`url(#${markerId})`}
    />
  );
}

/**
 * Adaptive SVG paint scene for the current teaching step.
 *
 * @param {{
 *   step:         import('../../constants/steps').Step,
 *   publicColour: { r:number, g:number, b:number },
 *   aliceSecret:  { r:number, g:number, b:number },
 *   bobSecret:    { r:number, g:number, b:number },
 *   aliceMix:     { r:number, g:number, b:number },
 *   bobMix:       { r:number, g:number, b:number },
 *   aliceFinal:   { r:number, g:number, b:number },
 *   bobFinal:     { r:number, g:number, b:number },
 * }} props
 * @returns {JSX.Element}
 */
export default function StepVisual(props) {
  const { step, ...colours } = props;
  const scene     = step.paintScene;
  const highlight = step.highlight ?? [];
  const visible   = new Set(VISIBLE_BUCKETS[scene] ?? []);
  const cmap      = colourMap(colours);

  const showMixingAlice = ['alice-sends', 'bob-sends', 'final-mix', 'eve-fails'].includes(scene);
  const showMixingBob   = ['bob-sends', 'final-mix', 'eve-fails'].includes(scene);
  const showFinalArrows = ['final-mix', 'eve-fails'].includes(scene);
  const showSendAlice   = showMixingAlice && !showFinalArrows;
  const showSendBob     = showMixingBob   && !showFinalArrows;
  const showEveFail     = scene === 'eve-fails';

  // Eve's attempted mix: alice-mix + bob-mix at 50/50
  const eveMixColour = {
    r: Math.round((colours.aliceMix.r + colours.bobMix.r) / 2),
    g: Math.round((colours.aliceMix.g + colours.bobMix.g) / 2),
    b: Math.round((colours.aliceMix.b + colours.bobMix.b) / 2),
  };

  // Extend viewBox downward only on the Eve step so the SVG stays compact
  // for all other steps (aspect ratio ≈ 27 % vs 33 %).
  const viewBoxH = showEveFail ? 295 : 240;

  return (
    <div className="step-visual">
      <svg
        viewBox={`0 0 900 ${viewBoxH}`}
        aria-label={`Paint scene: ${step.title}`}
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
          </marker>
          <marker id="arrowhead-blue" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
          </marker>
          <marker id="arrowhead-green" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
          </marker>
          <marker id="arrowhead-eve" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#dc2626" />
          </marker>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Column headings ─────────────────────────────────── */}
        {visible.has('alice-secret') && (
          <text x={cx('alice-secret')} y="10" textAnchor="middle"
            fontFamily="Courier New, monospace" fontSize="10"
            fill="#2563eb" fontWeight="bold">ALICE</text>
        )}
        {visible.has('public') && (
          <text x={cx('public')} y="10" textAnchor="middle"
            fontFamily="Courier New, monospace" fontSize="10"
            fill="#6b7280">PUBLIC</text>
        )}
        {visible.has('bob-secret') && (
          <text x={cx('bob-secret')} y="10" textAnchor="middle"
            fontFamily="Courier New, monospace" fontSize="10"
            fill="#16a34a" fontWeight="bold">BOB</text>
        )}

        {/* ── Mixing arrows (top row → middle row) ────────────── */}
        {showMixingAlice && (
          <>
            {/* Public (dashed) → Alice Mix */}
            <Arrow x1={cx('public')} y1={bot('public') + 2}
                   x2={cx('alice-mix') + 16} y2={top('alice-mix') - 2}
                   dashed />
            {/* Alice Secret → Alice Mix */}
            <Arrow x1={cx('alice-secret')} y1={bot('alice-secret') + 2}
                   x2={cx('alice-mix')}    y2={top('alice-mix') - 2} />
          </>
        )}
        {showMixingBob && (
          <>
            {/* Public (dashed) → Bob Mix */}
            <Arrow x1={cx('public')}    y1={bot('public') + 2}
                   x2={cx('bob-mix') - 16} y2={top('bob-mix') - 2}
                   dashed />
            {/* Bob Secret → Bob Mix */}
            <Arrow x1={cx('bob-secret')} y1={bot('bob-secret') + 2}
                   x2={cx('bob-mix')}     y2={top('bob-mix') - 2} />
          </>
        )}

        {/* ── "Sent to" indicator arrows (steps 4 & 5 only) ───── */}
        {showSendAlice && (
          <>
            <Arrow x1={BUCKETS['alice-mix'].rx + BW + 4} y1={cy('alice-mix')}
                   x2={BUCKETS['alice-mix'].rx + BW + 56} y2={cy('alice-mix')} />
            <text x={BUCKETS['alice-mix'].rx + BW + 30} y={cy('alice-mix') - 8}
              textAnchor="middle" fontFamily="Courier New, monospace"
              fontSize="9" fill="#6b7280">to Bob</text>
          </>
        )}
        {showSendBob && (
          <>
            <Arrow x1={BUCKETS['bob-mix'].rx - 4}  y1={cy('bob-mix')}
                   x2={BUCKETS['bob-mix'].rx - 56} y2={cy('bob-mix')} />
            <text x={BUCKETS['bob-mix'].rx - 30} y={cy('bob-mix') - 8}
              textAnchor="middle" fontFamily="Courier New, monospace"
              fontSize="9" fill="#6b7280">to Alice</text>
          </>
        )}

        {/* ── Final-mix arrows (steps 6 & 7) ──────────────────── */}
        {showFinalArrows && (
          <>
            {/* Alice Mix ──→ Bob Final (long horizontal) */}
            <Arrow x1={BUCKETS['alice-mix'].rx + BW + 2} y1={cy('alice-mix')}
                   x2={BUCKETS['bob-final'].rx - 2}       y2={cy('bob-final')} />

            {/* Bob Mix ←── Alice Final (long horizontal, reversed) */}
            <Arrow x1={BUCKETS['bob-mix'].rx - 2}         y1={cy('bob-mix')}
                   x2={BUCKETS['alice-final'].rx + BW + 2} y2={cy('alice-final')} />

            {/* Alice Secret ····→ Alice Final (dashed blue diagonal) */}
            <line
              x1={cx('alice-secret')} y1={bot('alice-secret') + 2}
              x2={cx('alice-final')}  y2={top('alice-final') - 2}
              stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3"
              markerEnd="url(#arrowhead-blue)"
            />

            {/* Bob Secret ····→ Bob Final (dashed green diagonal) */}
            <line
              x1={cx('bob-secret')} y1={bot('bob-secret') + 2}
              x2={cx('bob-final')}  y2={top('bob-final') - 2}
              stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 3"
              markerEnd="url(#arrowhead-green)"
            />

            {/* ≡ between Alice Final and Bob Final */}
            {!showEveFail && (
              <text
                x={(cx('alice-final') + cx('bob-final')) / 2}
                y={cy('alice-final') + 7}
                textAnchor="middle" fontSize="22" fill="#16a34a"
              >≡</text>
            )}
          </>
        )}

        {/* ── Eve's failed attempt — third row (step 7) ───────── */}
        {showEveFail && (() => {
          const ex = BUCKETS['alice-final'].rx + Math.round((BUCKETS['bob-final'].rx - BUCKETS['alice-final'].rx - BW) / 2);
          // Centre Eve horizontally between alice-final and bob-final
          const eveCx = ex + BW / 2;
          const eveCy = ER + BH / 2;
          return (
            <g>
              {/* Arrows from alice-mix and bob-mix down to Eve bucket */}
              <line
                x1={cx('alice-mix')} y1={bot('alice-mix') + 2}
                x2={eveCx - 10}      y2={ER - 2}
                stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 3"
                markerEnd="url(#arrowhead-eve)"
              />
              <line
                x1={cx('bob-mix')} y1={bot('bob-mix') + 2}
                x2={eveCx + 10}    y2={ER - 2}
                stroke="#dc2626" strokeWidth="1.5" strokeDasharray="5 3"
                markerEnd="url(#arrowhead-eve)"
              />

              {/* Label above Eve bucket */}
              <text x={eveCx} y={ER - 6}
                textAnchor="middle" fontFamily="Courier New, monospace"
                fontSize="10" fill="#dc2626" fontWeight="bold">Eve's attempt</text>

              {/* Eve bucket with dashed red border */}
              <rect
                x={ex} y={ER} width={BW} height={BH} rx={BRX}
                fill={toHex(eveMixColour)}
                stroke="#dc2626" strokeWidth="2.5" strokeDasharray="6 3"
              />

              {/* Red X overlay */}
              <line x1={ex + 8} y1={ER + 8} x2={ex + BW - 8} y2={ER + BH - 8}
                stroke="#dc2626" strokeWidth="3" />
              <line x1={ex + BW - 8} y1={ER + 8} x2={ex + 8} y2={ER + BH - 8}
                stroke="#dc2626" strokeWidth="3" />

              {/* ≠ indicator to the right of Eve's bucket */}
              <text x={ex + BW + 22} y={eveCy + 6}
                textAnchor="middle" fontSize="20" fill="#dc2626">≠</text>

              {/* "true secret ↑" callout */}
              <text x={ex + BW + 22} y={eveCy + 20}
                textAnchor="middle" fontFamily="Courier New, monospace"
                fontSize="8" fill="#dc2626">true secret ↑</text>
            </g>
          );
        })()}

        {/* ── Paint buckets (drawn last so they sit above arrows) ── */}
        {Object.keys(BUCKETS).map(id =>
          visible.has(id)
            ? <Bucket key={id} id={id} colour={cmap[id]} highlight={highlight} />
            : null
        )}
      </svg>
    </div>
  );
}
