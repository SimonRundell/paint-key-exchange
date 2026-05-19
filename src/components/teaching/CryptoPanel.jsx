/**
 * @fileoverview Cryptographic parallel panel for Teaching Mode.
 *
 * Displays the real-world Diffie-Hellman counterpart for each step,
 * helping students connect the paint metaphor to the actual protocol.
 */

/**
 * Panel that explains the cryptographic parallel for the current step.
 *
 * @param {{ step: import('../../constants/steps').Step }} props
 * @param {import('../../constants/steps').Step} props.step - The active step object.
 * @returns {JSX.Element}
 */
export default function CryptoPanel({ step }) {
  return (
    <div className="crypto-panel" role="complementary" aria-label="Cryptographic parallel">
      <p className="crypto-panel__header">🔐 Real cryptography</p>
      <p className="crypto-panel__text">{step.cryptoParallel}</p>
      {step.formula && (
        <code className="crypto-panel__formula">{step.formula}</code>
      )}
    </div>
  );
}
