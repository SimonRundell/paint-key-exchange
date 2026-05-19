/**
 * @fileoverview Teaching-mode step definitions for the Diffie-Hellman
 * paint-mixing walkthrough.
 *
 * Each step object drives the StepVisual SVG scene, the descriptive text,
 * the cryptographic parallel panel, and which SVG elements are highlighted.
 *
 * @typedef {Object} Step
 * @property {number}   id             - 1-indexed step number.
 * @property {string}   title          - Short heading shown above the description.
 * @property {string}   paintScene     - Key consumed by StepVisual to control visibility.
 * @property {string}   description    - Plain-English explanation of this step.
 * @property {string}   cryptoParallel - Mapping to the real DH protocol.
 * @property {string[]} highlight      - SVG element IDs to apply the glow filter to.
 * @property {string}   [formula]      - Optional LaTeX-style formula for CryptoPanel.
 */

/** @type {Step[]} */
const STEPS = [
  {
    id: 1,
    title: 'Agree on a public colour',
    paintScene: 'public-only',
    description:
      'Alice and Bob start by publicly agreeing on a base colour. ' +
      'This colour is broadcast openly — Eve the eavesdropper can see it ' +
      'too. It is not secret, and that is perfectly fine.',
    cryptoParallel:
      'In real Diffie-Hellman, Alice and Bob agree on two public numbers: ' +
      'a large prime p and a generator g (a number smaller than p). ' +
      'Both values are published openly for anyone to see — they are not secret.',
    highlight: ['public'],
    formula: 'Public: prime p, generator g',
  },
  {
    id: 2,
    title: "Alice picks her secret colour",
    paintScene: 'alice-secret',
    description:
      "Alice privately chooses her own secret colour. She never shows it to " +
      "anyone — not Bob, not Eve. This is her private key in the metaphor.",
    cryptoParallel:
      "Alice generates a random private key a. This number stays completely " +
      "secret — she never transmits it over any channel.",
    highlight: ['alice-secret'],
    formula: 'Alice private key: a  (secret)',
  },
  {
    id: 3,
    title: "Bob picks his secret colour",
    paintScene: 'bob-secret',
    description:
      "Independently, Bob chooses his own secret colour. Like Alice, he " +
      "keeps it entirely private. The two secrets are chosen without any " +
      "communication between them.",
    cryptoParallel:
      "Bob generates his own independent random private key b. " +
      "Neither Alice nor Bob knows the other's private key at any point.",
    highlight: ['bob-secret'],
    formula: 'Bob private key: b  (secret)',
  },
  {
    id: 4,
    title: "Alice sends her mixture",
    paintScene: 'alice-sends',
    description:
      "Alice mixes the public colour with her secret colour, then sends " +
      "the result to Bob over the public channel. Eve can intercept this " +
      "mixture, but she cannot un-mix paint to recover Alice's secret.",
    cryptoParallel:
      "Alice computes her public value A = g\u1d43 mod p and sends A to Bob. " +
      "Eve intercepts A, but reversing it to find a requires solving the " +
      "Discrete Logarithm Problem — which is computationally infeasible " +
      "for large enough numbers.",
    highlight: ['alice-mix'],
    formula: 'A = g\u1d43 mod p  →  sent to Bob',
  },
  {
    id: 5,
    title: "Bob sends his mixture",
    paintScene: 'bob-sends',
    description:
      "Bob mixes the public colour with his secret colour and sends it " +
      "to Alice. Again Eve can see Bob's mixture, but she still cannot " +
      "extract Bob's secret from it.",
    cryptoParallel:
      "Bob computes B = g\u1d47 mod p and sends B to Alice. " +
      "Eve now holds g, p, A, and B — but without knowing a or b she " +
      "still cannot compute the shared secret.",
    highlight: ['bob-mix'],
    formula: 'B = g\u1d47 mod p  →  sent to Alice',
  },
  {
    id: 6,
    title: "Each adds their own secret — and they match!",
    paintScene: 'final-mix',
    description:
      "Alice takes Bob's mixture and stirs in her own secret colour. " +
      "Bob takes Alice's mixture and stirs in his own secret colour. " +
      "Both arrive at the same final colour — the shared secret — without " +
      "ever having shared their private colours.",
    cryptoParallel:
      "Alice computes s = B\u1d43 mod p. Bob computes s = A\u1d47 mod p. " +
      "Because (g\u1d47)\u1d43 \u2261 (g\u1d43)\u1d47 \u2261 g\u1d43\u1d47 (mod p), " +
      "both parties derive the identical shared secret.",
    highlight: ['alice-final', 'bob-final'],
    formula: 's = B\u1d43 mod p = A\u1d47 mod p = g\u1d43\u1d47 mod p',
  },
  {
    id: 7,
    title: "Shared secret established — and why Eve fails",
    paintScene: 'eve-fails',
    description:
      "Eve knows the public colour, Alice's mixture, and Bob's mixture. " +
      "If she mixes Alice's and Bob's mixtures together she gets the wrong " +
      "colour — not the shared secret. She is missing the private colours " +
      "that Alice and Bob each kept to themselves.",
    cryptoParallel:
      "Eve has g, p, A = g\u1d43 mod p, and B = g\u1d47 mod p. " +
      "To reach the shared secret g\u1d43\u1d47 mod p she would need to find " +
      "a or b from A or B — this is the Discrete Logarithm Problem, " +
      "which has no known efficient solution for large primes.",
    highlight: ['alice-final', 'bob-final'],
    formula: 'Eve knows A, B — but not a or b → DLP barrier',
  },
];

export default STEPS;
