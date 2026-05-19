/**
 * @fileoverview Eve's eavesdropper lane for Simulation Mode.
 *
 * Shows what Eve can observe on the public channel and demonstrates why
 * her attempt to reconstruct the shared secret fails: she mixes Alice's
 * mixture with Bob's mixture, but without knowing either private colour
 * she ends up with the wrong result.
 *
 * The `sharedSecret` prop is the canonical shared secret displayed in both
 * Alice's and Bob's lanes.  Using the same value here keeps Eve's "True
 * shared secret" swatch pixel-perfect consistent with those lanes.
 */

import PaintBucket from './PaintBucket';
import { mixColours } from '../../utils/colourMix';

/**
 * Eve's lane showing intercepted values and her failed reconstruction attempt.
 *
 * @param {{
 *   publicColour:  { r:number, g:number, b:number },
 *   aliceMix:      { r:number, g:number, b:number },
 *   bobMix:        { r:number, g:number, b:number },
 *   aliceFinal:    { r:number, g:number, b:number },
 *   bobFinal:      { r:number, g:number, b:number },
 *   sharedSecret:  { r:number, g:number, b:number },
 * }} props
 * @param {{ r:number, g:number, b:number }} props.publicColour  - The agreed public colour.
 * @param {{ r:number, g:number, b:number }} props.aliceMix      - Alice's sent mixture (intercepted).
 * @param {{ r:number, g:number, b:number }} props.bobMix        - Bob's sent mixture (intercepted).
 * @param {{ r:number, g:number, b:number }} props.aliceFinal    - Alice's independently-computed final.
 * @param {{ r:number, g:number, b:number }} props.bobFinal      - Bob's independently-computed final.
 * @param {{ r:number, g:number, b:number }} props.sharedSecret  - Canonical shared secret (matches both lanes).
 * @returns {JSX.Element}
 */
export default function EveLane({ publicColour, aliceMix, bobMix, aliceFinal, bobFinal, sharedSecret }) {
  /** Eve's best guess: mix the two intercepted mixtures together. */
  const eveMix = mixColours(aliceMix, bobMix);

  return (
    <div className="lane">
      <div className="lane__header lane__header--eve">
        Eve (eavesdropper)
      </div>

      <div className="lane__body">
        {/* ── What Eve can see ──────────────────────────────── */}
        <p className="lane__section-label">Eve intercepts</p>
        <div className="lane__row">
          <PaintBucket colour={publicColour} label="Public"      tooltip="Freely visible" />
          <PaintBucket colour={aliceMix}     label="Alice's mix" tooltip="Intercepted ✓" />
          <PaintBucket colour={bobMix}       label="Bob's mix"   tooltip="Intercepted ✓" />
        </div>

        <hr className="lane__divider" />

        {/* ── Eve's attempt ─────────────────────────────────── */}
        <p className="lane__section-label">Eve's attempt</p>
        <div className="lane__row">
          <PaintBucket colour={aliceMix} label="Alice's mix" />
          <span className="lane__operator">+</span>
          <PaintBucket colour={bobMix}   label="Bob's mix" />
          <span className="lane__operator">=</span>
          <PaintBucket colour={eveMix}   label="Eve's mix" tooltip="Wrong!" />
        </div>
        <p className="lane__eve-fail-label">✗ Wrong!</p>

        <hr className="lane__divider" />

        {/* ── True shared secret (out of reach) ─────────────── */}
        {/*
          Show the canonical sharedSecret twice with ≡ to reinforce that
          Alice and Bob both hold the same value — the same swatch shown
          in their respective lanes — which Eve cannot reproduce.
        */}
        <p className="lane__section-label">True shared secret</p>
        <div className="lane__row">
          <PaintBucket colour={sharedSecret} label="Alice's final" tooltip="Eve can't reach this" />
          <span className="lane__operator">≡</span>
          <PaintBucket colour={sharedSecret} label="Bob's final"   tooltip="Eve can't reach this" />
        </div>
        <p className="lane__eve-fail-label">🔒 Out of reach</p>

        <hr className="lane__divider" />

        {/* ── Explanation ───────────────────────────────────── */}
        <p className="lane__eve-warning">
          Eve has the public colour, Alice's mixture, and Bob's mixture — but
          she is missing both private colours. Mixing what she has produces the
          wrong result. In real DH, recovering a private key from a public value
          requires solving the <strong>Discrete Logarithm Problem</strong>, which
          is computationally infeasible for large enough primes.
        </p>
      </div>
    </div>
  );
}
