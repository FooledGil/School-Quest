import React from 'react';

/**
 * CastleIntroOverlay — UI overlay for the castle intro animation phases.
 *
 * Renders different content depending on the current animation phase:
 * - `zooming`: "Entering the Realm..." loading text
 * - `waiting`: "⚔️ OPEN THE GATE ⚔️" pulsing prompt
 * - `opening` / `transitioning`: Golden/white light flash
 *
 * Always shows a "SKIP ▸▸" button to bypass the animation.
 */
export default function CastleIntroOverlay({ phase, onSkip }) {
    if (phase === 'idle' || phase === 'expanding') return null;

    return (
        <>
            {/* Skip button — always visible during animation */}
            <button
                className="intro-skip-btn"
                onClick={onSkip}
                aria-label="Skip intro animation"
            >
                SKIP ▸▸
            </button>

            {/* Phase 2: "Entering the Realm..." text */}
            {phase === 'zooming' && (
                <div
                    className="fixed inset-x-0 bottom-[15%] z-[60] flex justify-center pointer-events-none"
                    aria-live="polite"
                >
                    <span className="entering-text text-[10px] sm:text-xs text-cyan-200 tracking-widest">
                        Entering the Realm...
                    </span>
                </div>
            )}

            {/* Phase 3: "OPEN THE GATE" prompt */}
            {phase === 'waiting' && (
                <div
                    className="fixed inset-x-0 bottom-[12%] z-[60] flex justify-center pointer-events-none"
                    aria-live="assertive"
                >
                    <span className="gate-prompt text-xs sm:text-sm text-cyan-100 tracking-wider">
                        ⚔️ OPEN THE GATE ⚔️
                    </span>
                </div>
            )}

            {/* Phase 4: Golden light flash overlay */}
            {(phase === 'opening' || phase === 'transitioning') && (
                <div
                    id="intro-light-flash"
                    className="fixed z-[70] pointer-events-none"
                    style={{
                        top: '50%',
                        left: '50%',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, #fef9c3 0%, #fbbf24 30%, #f59e0b 60%, rgba(245,158,11,0) 100%)',
                        opacity: 0,
                        transform: 'translate(-50%, -50%) scale(0.1)',
                    }}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
