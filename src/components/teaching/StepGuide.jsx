/**
 * @fileoverview Step navigation bar for Teaching Mode.
 *
 * Renders Previous / Next buttons, a textual step counter, and a row of
 * dot indicators showing progress through the walkthrough.
 */

/**
 * Navigation bar for the teaching-mode step walkthrough.
 *
 * @param {{
 *   currentStep: number,
 *   totalSteps:  number,
 *   onPrev:      Function,
 *   onNext:      Function,
 * }} props
 * @param {number}   props.currentStep - 1-indexed current step number.
 * @param {number}   props.totalSteps  - Total number of steps.
 * @param {Function} props.onPrev      - Called when the Previous button is clicked.
 * @param {Function} props.onNext      - Called when the Next button is clicked.
 * @returns {JSX.Element}
 */
export default function StepGuide({ currentStep, totalSteps, onPrev, onNext }) {
  return (
    <div>
      <div className="step-nav">
        <button
          className="step-nav__btn"
          onClick={onPrev}
          disabled={currentStep === 1}
          aria-label="Previous step"
        >
          ← Previous
        </button>

        <span className="step-nav__counter">
          Step {currentStep} of {totalSteps}
        </span>

        <button
          className="step-nav__btn"
          onClick={onNext}
          disabled={currentStep === totalSteps}
          aria-label="Next step"
        >
          Next →
        </button>
      </div>

      {/* Progress dots */}
      <div className="step-nav__dots" role="list" aria-label="Step progress">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          let dotClass = 'step-nav__dot';
          if (stepNum < currentStep) dotClass += ' step-nav__dot--done';
          else if (stepNum === currentStep) dotClass += ' step-nav__dot--current';
          return (
            <span
              key={stepNum}
              role="listitem"
              className={dotClass}
              title={`Step ${stepNum}`}
              aria-current={stepNum === currentStep ? 'step' : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
