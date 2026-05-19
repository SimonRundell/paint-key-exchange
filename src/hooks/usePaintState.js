/**
 * @fileoverview Custom React hook that manages all colour state for the
 * Diffie-Hellman paint simulation.
 *
 * The hook encapsulates:
 *   - The three base colours (public, Alice's secret, Bob's secret).
 *   - All derived mixtures, computed reactively with useMemo.
 *   - A helper to randomise the public colour.
 *
 * ## Why ratio 2/3 for the final mix?
 *
 * With a simple 50/50 blend the DH symmetry property does not hold:
 *   mix(mix(P, Sa), Sb) ≠ mix(mix(P, Sb), Sa)
 *
 * Using ratio 2/3 for the *second* mix restores the property because:
 *   mix(mix(P, Sa, 0.5), Sb, 2/3)
 *     = (P·½ + Sa·½)·⅔ + Sb·⅓
 *     = P/3 + Sa/3 + Sb/3        — symmetric in Sa and Sb ✓
 *
 * This means aliceFinal and bobFinal converge to the same colour
 * (within 1–2 integer rounding units), faithfully mirroring the
 * mathematical identity  (g^a)^b ≡ (g^b)^a (mod p)  in real DH.
 */

import { useState, useMemo } from 'react';
import { mixColours, fromHex } from '../utils/colourMix';

/**
 * Manages all colour state for the Diffie-Hellman paint simulation.
 *
 * @returns {{
 *   publicColour:   { r: number, g: number, b: number },
 *   aliceSecret:    { r: number, g: number, b: number },
 *   bobSecret:      { r: number, g: number, b: number },
 *   aliceMix:       { r: number, g: number, b: number },
 *   bobMix:         { r: number, g: number, b: number },
 *   aliceFinal:     { r: number, g: number, b: number },
 *   bobFinal:       { r: number, g: number, b: number },
 *   sharedSecret:   { r: number, g: number, b: number },
 *   setAliceSecret:  (colour: { r:number, g:number, b:number }) => void,
 *   setBobSecret:    (colour: { r:number, g:number, b:number }) => void,
 *   randomisePublic: () => void,
 * }}
 */
export function usePaintState() {
  // ── Base colours (state) ───────────────────────────────────────────────────
  const [publicColour, setPublicColour] = useState({ r: 244, g: 208, b: 63 });  // warm yellow
  const [aliceSecret,  setAliceSecretState] = useState({ r: 46,  g: 134, b: 193 }); // cobalt blue
  const [bobSecret,    setBobSecretState]   = useState({ r: 231, g: 76,  b: 60  }); // brick red

  // ── Derived colours (memo) ─────────────────────────────────────────────────
  const { aliceMix, bobMix, aliceFinal, bobFinal, sharedSecret } = useMemo(() => {
    // Step 4: Alice mixes public with her secret → sends to Bob
    const aliceMix = mixColours(publicColour, aliceSecret);

    // Step 5: Bob mixes public with his secret → sends to Alice
    const bobMix = mixColours(publicColour, bobSecret);

    // Step 6: Each party adds their own secret to the received mixture.
    // ratio=2/3 ensures aliceFinal ≡ bobFinal ≡ (P + Sa + Sb) / 3,
    // mirroring the DH identity g^(ab) mod p.
    const aliceFinal = mixColours(bobMix,   aliceSecret, 2 / 3);
    const bobFinal   = mixColours(aliceMix, bobSecret,   2 / 3);

    // Canonical shared secret: average of the two independently-computed
    // finals.  Due to integer rounding each channel of aliceFinal and bobFinal
    // can differ by at most 1 unit — imperceptible but potentially confusing
    // side by side.  Averaging removes this artefact so both lanes always
    // display pixel-perfect identical swatches.
    const sharedSecret = {
      r: Math.round((aliceFinal.r + bobFinal.r) / 2),
      g: Math.round((aliceFinal.g + bobFinal.g) / 2),
      b: Math.round((aliceFinal.b + bobFinal.b) / 2),
    };

    return { aliceMix, bobMix, aliceFinal, bobFinal, sharedSecret };
  }, [publicColour, aliceSecret, bobSecret]);

  // ── Setters (accept { r, g, b } objects) ──────────────────────────────────

  /**
   * Updates Alice's secret colour.
   * @param {{ r: number, g: number, b: number }} colour
   */
  function setAliceSecret(colour) {
    setAliceSecretState(colour);
  }

  /**
   * Updates Bob's secret colour.
   * @param {{ r: number, g: number, b: number }} colour
   */
  function setBobSecret(colour) {
    setBobSecretState(colour);
  }

  /**
   * Replaces the public colour with a freshly generated random RGB value.
   */
  function randomisePublic() {
    setPublicColour({
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    });
  }

  return {
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
  };
}
