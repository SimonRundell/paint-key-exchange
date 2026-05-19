/**
 * @fileoverview Mode switcher tab bar component.
 *
 * Renders two buttons allowing the user to toggle between Teaching Mode
 * (guided step-by-step walkthrough) and Simulation Mode (interactive).
 */

/**
 * Horizontal tab bar for switching between app modes.
 *
 * @param {{ mode: 'teaching' | 'simulation', onModeChange: Function }} props
 * @param {'teaching' | 'simulation'} props.mode       - Currently active mode.
 * @param {Function}                  props.onModeChange - Called with the new mode string when a tab is clicked.
 * @returns {JSX.Element}
 */
export default function ModeSwitch({ mode, onModeChange }) {
  return (
    <div className="mode-switch" role="tablist" aria-label="Application mode">
      <button
        role="tab"
        aria-selected={mode === 'teaching'}
        className={
          'mode-switch__btn' +
          (mode === 'teaching' ? ' mode-switch__btn--active' : '')
        }
        onClick={() => onModeChange('teaching')}
      >
        Teaching Mode
      </button>
      <button
        role="tab"
        aria-selected={mode === 'simulation'}
        className={
          'mode-switch__btn' +
          (mode === 'simulation' ? ' mode-switch__btn--active' : '')
        }
        onClick={() => onModeChange('simulation')}
      >
        Simulation Mode
      </button>
    </div>
  );
}
