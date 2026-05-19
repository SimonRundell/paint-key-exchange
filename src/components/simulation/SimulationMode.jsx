/**
 * @fileoverview Simulation Mode root component.
 *
 * Wires together the usePaintState hook, the three participant lanes,
 * and a persistent shared-secret panel that confirms Alice and Bob have
 * reached the same key.
 *
 * Both player lanes receive the same `sharedSecret` value (the integer
 * average of aliceFinal and bobFinal) so the "Shared secret" swatch is
 * pixel-perfect identical in both lanes regardless of 1-unit rounding
 * artefacts in the independent computations.
 */

import { usePaintState } from '../../hooks/usePaintState';
import { coloursMatch, toHex } from '../../utils/colourMix';
import PlayerLane from './PlayerLane';
import EveLane from './EveLane';
import PaintBucket from './PaintBucket';

/**
 * Interactive simulation of the Diffie-Hellman key exchange.
 *
 * Students can change Alice's and Bob's secret colours using colour pickers.
 * All derived mixtures update reactively.  A shared-secret comparison panel
 * sits above the grid so it is always in view.
 *
 * @returns {JSX.Element}
 */
export default function SimulationMode() {
  const {
    publicColour,
    aliceSecret,
    bobSecret,
    aliceMix,
    bobMix,
    aliceFinal,
    bobFinal,
    sharedSecret,
    setAliceSecret,
    setBobSecret,
    randomisePublic,
  } = usePaintState();

  /** True once Alice and Bob have converged on the same shared secret. */
  const secretsMatch = coloursMatch(aliceFinal, bobFinal);

  return (
    <div className="simulation-mode">
      {/* ── Public colour controls ───────────────────────── */}
      <div className="simulation-mode__public-row card">
        <button
          className="simulation-mode__randomise"
          onClick={randomisePublic}
          aria-label="Generate a new random public colour"
        >
          Randomise public colour
        </button>
        <PaintBucket colour={publicColour} label="Public colour" />
        <span className="simulation-mode__public-label">
          This colour is visible to everyone, including Eve.
        </span>
      </div>

      {/* ── Shared-secret comparison panel (always visible) ── */}
      <div className={`success-banner${secretsMatch ? '' : ' success-banner--pending'}`}
           role="status" aria-live="polite">
        {secretsMatch ? (
          <>
            <p className="success-banner__title">✓ Shared secret established!</p>
            <div className="success-banner__swatches">
              <PaintBucket colour={sharedSecret} label="Alice's final" />
              <span className="success-banner__equals">≡</span>
              <PaintBucket colour={sharedSecret} label="Bob's final" />
            </div>
            <p className="success-banner__body">
              Alice and Bob derived the same colour without ever sharing their private secrets.
              Eve, who only saw the intermediate mixtures, cannot reproduce this colour.
            </p>
          </>
        ) : (
          <p className="success-banner__title success-banner__title--pending">
            Choose secret colours above — Alice and Bob will derive a shared secret.
          </p>
        )}
      </div>

      {/* ── Three-lane grid ──────────────────────────────── */}
      <div className="simulation-grid">
        {/*
          Both lanes receive sharedSecret as finalColour so the "Shared secret"
          swatch displays the exact same hex in both lanes.  The individual
          aliceFinal / bobFinal values are still used by EveLane to show that
          each party independently derived the same result.
        */}
        <PlayerLane
          player="Alice"
          publicColour={publicColour}
          secretColour={aliceSecret}
          onSecretChange={setAliceSecret}
          mixedColour={aliceMix}
          receivedColour={bobMix}
          finalColour={sharedSecret}
        />

        <PlayerLane
          player="Bob"
          publicColour={publicColour}
          secretColour={bobSecret}
          onSecretChange={setBobSecret}
          mixedColour={bobMix}
          receivedColour={aliceMix}
          finalColour={sharedSecret}
        />

        <EveLane
          publicColour={publicColour}
          aliceMix={aliceMix}
          bobMix={bobMix}
          aliceFinal={aliceFinal}
          bobFinal={bobFinal}
          sharedSecret={sharedSecret}
        />
      </div>
    </div>
  );
}
