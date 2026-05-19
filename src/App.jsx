/**
 * @fileoverview Root application component.
 *
 * Manages the active mode ('teaching' | 'simulation') and renders
 * the appropriate mode component below the shared header.
 */

import { useState } from 'react';
import ModeSwitch from './components/ModeSwitch';
import TeachingMode from './components/teaching/TeachingMode';
import SimulationMode from './components/simulation/SimulationMode';
import CMFloatAd from './cmFloatAd.jsx';

/**
 * Root component. Owns the mode state and composes the application shell.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  /** @type {['teaching' | 'simulation', Function]} */
  const [mode, setMode] = useState('teaching');

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Paint Key Exchange</h1>
        <p className="app-subtitle">
          Understanding Diffie-Hellman through colour mixing
        </p>
        <ModeSwitch mode={mode} onModeChange={setMode} />
      </header>

      <main className="app-main">
        {mode === 'teaching' ? <TeachingMode /> : <SimulationMode />}
      </main>

    <CMFloatAd color='#807c7c' />

      <footer className="app-footer">
        <p>
          A teaching tool for BTEC / T-Level Computing — Cryptography unit
          &nbsp;·&nbsp;
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__licence"
          >
            CC BY-NC-SA 4.0
          </a>
        </p>
      </footer>
    </div>
  );
}
