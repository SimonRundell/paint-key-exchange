/**
 * @fileoverview Reusable paint bucket swatch component for Simulation Mode.
 *
 * Renders a circular colour swatch with a label below and an optional
 * tooltip line for additional context.
 */

import { toHex, contrastColour } from '../../utils/colourMix';

/**
 * A circular paint swatch with a label.
 *
 * @param {{
 *   colour:   { r:number, g:number, b:number },
 *   label:    string,
 *   tooltip?: string,
 * }} props
 * @param {{ r:number, g:number, b:number }} props.colour  - Colour to display.
 * @param {string}  props.label   - Short label shown below the swatch.
 * @param {string}  [props.tooltip] - Optional second line of context text.
 * @returns {JSX.Element}
 */
export default function PaintBucket({ colour, label, tooltip }) {
  const hex = toHex(colour);

  return (
    <div className="paint-bucket" title={tooltip}>
      <div
        className="paint-bucket__swatch"
        style={{ backgroundColor: hex }}
        aria-label={`${label}: ${hex}`}
      />
      <span className="paint-bucket__label">{label}</span>
      {tooltip && (
        <span className="paint-bucket__tooltip">{tooltip}</span>
      )}
    </div>
  );
}
