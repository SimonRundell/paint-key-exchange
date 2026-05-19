/**
 * @fileoverview Pure colour mixing utilities for the paint metaphor.
 *
 * All colours are represented as plain objects of the form { r, g, b }
 * where each channel is an integer in the range 0–255.
 *
 * None of these functions import React — this module is intentionally a
 * plain ES module so it can be unit-tested in isolation.
 */

/**
 * Mixes two colours using weighted RGB interpolation.
 *
 * A ratio of 0.5 (the default) gives a straight 50/50 blend.
 * Higher values weight towards c1; lower values weight towards c2.
 *
 * @param {{ r: number, g: number, b: number }} c1 - First colour.
 * @param {{ r: number, g: number, b: number }} c2 - Second colour.
 * @param {number} [ratio=0.5] - Weight of c1 (0 = all c2, 1 = all c1).
 * @returns {{ r: number, g: number, b: number }} The blended colour.
 */
export function mixColours(c1, c2, ratio = 0.5) {
  return {
    r: Math.round(c1.r * ratio + c2.r * (1 - ratio)),
    g: Math.round(c1.g * ratio + c2.g * (1 - ratio)),
    b: Math.round(c1.b * ratio + c2.b * (1 - ratio)),
  };
}

/**
 * Converts an { r, g, b } colour object to a lowercase CSS hex string.
 *
 * @example toHex({ r: 163, g: 196, b: 241 }) // → "#a3c4f1"
 *
 * @param {{ r: number, g: number, b: number }} colour - The colour to convert.
 * @returns {string} A 7-character hex string beginning with "#".
 */
export function toHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Converts a CSS hex string (with or without the leading "#") to an
 * { r, g, b } colour object.
 *
 * @example fromHex("#a3c4f1") // → { r: 163, g: 196, b: 241 }
 *
 * @param {string} hex - A 3- or 6-digit hex colour string.
 * @returns {{ r: number, g: number, b: number }} The parsed colour.
 */
export function fromHex(hex) {
  const clean = hex.replace('#', '');
  // Expand shorthand #rgb → #rrggbb
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/**
 * Returns either "#ffffff" or "#000000" — whichever provides greater
 * contrast against the given background colour.
 *
 * Uses the WCAG 2.1 relative luminance formula so that overlaid text
 * remains legible regardless of bucket colour.
 *
 * @param {{ r: number, g: number, b: number }} bg - Background colour.
 * @returns {string} "#ffffff" for dark backgrounds; "#000000" for light ones.
 */
export function contrastColour({ r, g, b }) {
  /** Linearise a single 0-255 sRGB channel value. */
  const linearise = (channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b);
  // Threshold 0.179 is the midpoint on the perceptual luminance scale.
  return L > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Determines whether two colours are perceptually close enough to be
 * considered "the same shared secret" in the simulation.
 *
 * Uses Euclidean distance in RGB space. Because the mixing formula used
 * by {@link mixColours} with ratio 2/3 produces final values that differ
 * by at most 1–2 per channel due to rounding, a tight threshold of 8 is
 * sufficient to confirm a valid match while rejecting Eve's approximate
 * attempt.
 *
 * @param {{ r: number, g: number, b: number }} c1 - First colour.
 * @param {{ r: number, g: number, b: number }} c2 - Second colour.
 * @param {number} [threshold=8] - Maximum Euclidean distance to count as a match.
 * @returns {boolean} True when the colours are within the threshold.
 */
export function coloursMatch(c1, c2, threshold = 8) {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db) < threshold;
}
