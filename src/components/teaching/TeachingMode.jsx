/**
 * @fileoverview Teaching Mode orchestrator component.
 *
 * Manages the current step index and wires together the SVG scene,
 * step title/description, cryptographic parallel panel, and navigation bar.
 *
 * Preset colours are fixed for the teaching walkthrough so that the
 * demonstration is always visually clear and consistent:
 *   - Public:       #F4D03F  (warm yellow)
 *   - Alice secret: #2E86C1  (cobalt blue)
 *   - Bob secret:   #E74C3C  (brick red)
 *
 * These produce clearly distinct intermediate and final colours.
 */

import { useState, useMemo } from 'react';
import STEPS from '../../constants/steps';
import { mixColours, fromHex } from '../../utils/colourMix';
import StepVisual from './StepVisual';
import CryptoPanel from './CryptoPanel';
import StepGuide from './StepGuide';

/** Fixed preset colours used throughout the teaching walkthrough. */
const PRESET = {
  publicColour: fromHex('#F4D03F'),
  aliceSecret:  fromHex('#2E86C1'),
  bobSecret:    fromHex('#E74C3C'),
};

/**
 * Computes all derived colours from the three preset base colours.
 *
 * @returns {{
 *   aliceMix:   { r:number, g:number, b:number },
 *   bobMix:     { r:number, g:number, b:number },
 *   aliceFinal: { r:number, g:number, b:number },
 *   bobFinal:   { r:number, g:number, b:number },
 * }}
 */
function computeDerived() {
  const aliceMix   = mixColours(PRESET.publicColour, PRESET.aliceSecret);
  const bobMix     = mixColours(PRESET.publicColour, PRESET.bobSecret);
  const aliceFinal = mixColours(bobMix, PRESET.aliceSecret, 2 / 3);
  const bobFinal   = mixColours(aliceMix, PRESET.bobSecret, 2 / 3);
  return { aliceMix, bobMix, aliceFinal, bobFinal };
}

const DERIVED = computeDerived();

/**
 * Teaching Mode root component.  Renders a guided, non-interactive
 * walkthrough of all seven Diffie-Hellman steps.
 *
 * @returns {JSX.Element}
 */
export default function TeachingMode() {
  /** @type {[number, Function]} 0-indexed current step */
  const [stepIndex, setStepIndex] = useState(0);

  const step       = STEPS[stepIndex];
  const totalSteps = STEPS.length;

  /** Advance to the next step (clamped). */
  function handleNext() {
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  /** Go back one step (clamped). */
  function handlePrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="teaching-mode">
      {/* SVG paint scene */}
      <StepVisual
        step={step}
        publicColour={PRESET.publicColour}
        aliceSecret={PRESET.aliceSecret}
        bobSecret={PRESET.bobSecret}
        aliceMix={DERIVED.aliceMix}
        bobMix={DERIVED.bobMix}
        aliceFinal={DERIVED.aliceFinal}
        bobFinal={DERIVED.bobFinal}
      />

      {/* Step content */}
      <div className="card">
        <h2 className="teaching-mode__title">{step.title}</h2>
        <p className="teaching-mode__description">{step.description}</p>

        <CryptoPanel step={step} />

        <StepGuide
          currentStep={stepIndex + 1}
          totalSteps={totalSteps}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
