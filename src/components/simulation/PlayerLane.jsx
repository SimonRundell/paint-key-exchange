/**
 * @fileoverview Player lane component — used for both Alice and Bob.
 *
 * Shows the full colour-mixing chain for one player:
 *   Row 1 — Public | + | Secret | = | Sent to other
 *   Row 2 — Received | + | Secret | = | Shared secret
 *
 * A native <input type="color"> lets the student change their secret colour
 * interactively; all derived colours update instantly via usePaintState.
 */

import PaintBucket from './PaintBucket';
import { toHex, fromHex } from '../../utils/colourMix';

/**
 * Interactive lane for one participant (Alice or Bob).
 *
 * @param {{
 *   player:          'Alice' | 'Bob',
 *   publicColour:    { r:number, g:number, b:number },
 *   secretColour:    { r:number, g:number, b:number },
 *   onSecretChange:  Function,
 *   mixedColour:     { r:number, g:number, b:number },
 *   receivedColour:  { r:number, g:number, b:number },
 *   finalColour:     { r:number, g:number, b:number },
 * }} props
 * @param {'Alice' | 'Bob'} props.player         - Which player this lane represents.
 * @param {{ r:number, g:number, b:number }} props.publicColour  - Shared public colour.
 * @param {{ r:number, g:number, b:number }} props.secretColour  - This player's private colour.
 * @param {Function}        props.onSecretChange - Called with a new { r,g,b } when the picker changes.
 * @param {{ r:number, g:number, b:number }} props.mixedColour   - public + secret (sent to other).
 * @param {{ r:number, g:number, b:number }} props.receivedColour - Mix received from the other player.
 * @param {{ r:number, g:number, b:number }} props.finalColour   - Derived shared secret.
 * @returns {JSX.Element}
 */
export default function PlayerLane({
  player,
  publicColour,
  secretColour,
  onSecretChange,
  mixedColour,
  receivedColour,
  finalColour,
}) {
  const playerKey = player.toLowerCase(); // 'alice' | 'bob'
  const otherName = player === 'Alice' ? 'Bob' : 'Alice';

  /**
   * Handles the native colour-picker change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  function handlePickerChange(e) {
    onSecretChange(fromHex(e.target.value));
  }

  return (
    <div className="lane">
      <div className={`lane__header lane__header--${playerKey}`}>
        {player}
      </div>

      <div className="lane__body">
        {/* ── Step 1: Mix and send ───────────────────────────── */}
        <p className="lane__section-label">Step 1 — Mix &amp; send</p>
        <div className="lane__row">
          <PaintBucket colour={publicColour} label="Public" />
          <span className="lane__operator">+</span>
          <PaintBucket colour={secretColour} label="My secret" />
          <span className="lane__operator">=</span>
          <PaintBucket
            colour={mixedColour}
            label={`${player} sends`}
            tooltip={`Sent to ${otherName}`}
          />
        </div>

        {/* Colour picker */}
        <div className="lane__picker-row">
          <label className="lane__picker-label" htmlFor={`picker-${playerKey}`}>
            Your secret colour
          </label>
          <input
            id={`picker-${playerKey}`}
            type="color"
            className="lane__colour-input"
            value={toHex(secretColour)}
            onChange={handlePickerChange}
            aria-label={`${player}'s secret colour picker`}
          />
        </div>

        <hr className="lane__divider" />

        {/* ── Step 2: Receive and finalise ──────────────────── */}
        <p className="lane__section-label">Step 2 — Receive &amp; finalise</p>
        <div className="lane__row">
          <PaintBucket
            colour={receivedColour}
            label={`From ${otherName}`}
            tooltip={`${otherName}'s mix`}
          />
          <span className="lane__operator">+</span>
          <PaintBucket colour={secretColour} label="My secret" />
          <span className="lane__operator">=</span>
          <PaintBucket
            colour={finalColour}
            label="Shared secret"
            tooltip="Should match other side!"
          />
        </div>
      </div>
    </div>
  );
}
