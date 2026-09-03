import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import CastleScene from './CastleScene';

export default function CastleIntroModal({ initialRect, redirectUrl = '/dashboard' }) {
    const [phase, setPhase] = useState('expanding'); // expanding → waiting → opening → transitioning

    const backdropRef = useRef(null);
    const wrapperRef = useRef(null);
    const cameraRef = useRef(null);
    const svgRef = useRef(null);
    const flashRef = useRef(null);
    const enteringTextRef = useRef(null);

    // Refs for rich fantasy scenery (NOT debloated!)
    const cloudsRef = useRef(null);
    const birdsRef = useRef(null);
    const flagsRef = useRef(null);
    const beamRef = useRef(null);
    const windowGlowRef = useRef(null);
    const torchRef = useRef(null);
    const manaRef = useRef(null);
    const waterfallRef = useRef(null);
    const particlesRef = useRef(null);

    const masterTlRef = useRef(null);
    const offscreenTlRef = useRef(null);

    // ─── Skip Handler ───
    const handleSkip = useCallback(() => {
        if (masterTlRef.current) masterTlRef.current.kill();
        if (offscreenTlRef.current) offscreenTlRef.current.kill();
        gsap.killTweensOf('*');
        setPhase('transitioning');
        // Set flag so onboarding guide automatically opens on dashboard
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('open_guide_after_intro', 'true');
        }
        router.visit(redirectUrl);
    }, [redirectUrl]);

    // ─── Main Animation Sequence ───
    useEffect(() => {
        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('open_guide_after_intro', 'true');
            }
            router.visit(redirectUrl);
            return;
        }

        // ── 1. Scenery Ambient Animations (Active during wide view, Zero debloat!) ──
        const offscreenTl = gsap.timeline();
        offscreenTlRef.current = offscreenTl;

        // Clouds drifting
        if (cloudsRef.current) {
            const clouds = cloudsRef.current.children;
            if (clouds[0]) offscreenTl.to(clouds[0], { x: 35, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0);
            if (clouds[1]) offscreenTl.to(clouds[1], { x: -30, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0);
            if (clouds[2]) offscreenTl.to(clouds[2], { x: 25, duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0);
        }

        // Soaring Birds / Dragon
        if (birdsRef.current) {
            offscreenTl.fromTo(
                birdsRef.current,
                { x: -80, y: 110, opacity: 0 },
                { x: 520, y: 70, opacity: 0.9, duration: 14, repeat: -1, ease: 'none', repeatDelay: 3 },
                0
            );
        }

        // Fluttering Flags on keep
        if (flagsRef.current) {
            offscreenTl.to(flagsRef.current.children, {
                scaleX: 0.75,
                skewY: 6,
                transformOrigin: 'left center',
                duration: 0.45,
                stagger: 0.15,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            }, 0);
        }

        // Waterfall stream
        if (waterfallRef.current) {
            offscreenTl.to(waterfallRef.current.children, {
                y: 10,
                opacity: 0.4,
                duration: 0.6,
                stagger: 0.15,
                repeat: -1,
                ease: 'none',
            }, 0);
        }

        // ── 2. Near-Gate Ambient (Torch & Mana — Always alive, very lightweight) ──
        if (torchRef.current) {
            gsap.to(torchRef.current, {
                scaleX: 1.1,
                scaleY: 1.18,
                opacity: 0.95,
                duration: 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                transformOrigin: 'bottom center',
            });
        }
        if (manaRef.current) {
            gsap.to(manaRef.current, {
                scale: 1.2,
                y: -3,
                duration: 1.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                transformOrigin: 'center center',
            });
        }

        // Pre-calculate target zoom parameters ONCE before starting
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const aspect = vw / vh;

        let gateYPercent = 57.5;
        if (aspect > 1) {
            const renderedH = vw;
            const overflowY = (renderedH - vh) / 2;
            const gatePixelY = (277 / 480) * renderedH - overflowY;
            gateYPercent = (gatePixelY / vh) * 100;
        }

        const defaultRect = {
            top: vh * 0.2,
            left: vw * 0.5,
            width: vw * 0.45,
            height: vh * 0.6,
        };
        const rect = initialRect || defaultRect;

        // Set initial wrapper position at the card's exact position
        gsap.set(wrapperRef.current, {
            position: 'absolute',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: 24,
            overflow: 'hidden',
        });

        // ═════════════════════════════════════════════════════════════════
        // SINGLE UNIFIED TIMELINE: Phase 1 (Expand) directly flows into
        // Phase 2 (Camera Zoom) with ZERO React state changes, ZERO gaps,
        // and ZERO forced synchronous layout reflows!
        // ═════════════════════════════════════════════════════════════════
        const masterTl = gsap.timeline();
        masterTlRef.current = masterTl;

        masterTl
            // Phase 1: Backdrop fade in
            .to(backdropRef.current, {
                opacity: 1,
                duration: 0.35,
                ease: 'power2.out',
            }, 0)
            // Phase 1: Expand from Card position to Fullscreen (0.75s)
            .to(wrapperRef.current, {
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                duration: 0.75,
                ease: 'power2.inOut',
            }, 0)
            // Phase 2: Hardware-accelerated camera zoom chained seamlessly!
            // Starts 0.05s before expansion ends for a buttery fluid cinematic camera move
            .to(cameraRef.current, {
                scale: 2.7,
                y: aspect > 1 ? -15 : 0,
                transformOrigin: `50.4% ${gateYPercent.toFixed(1)}%`,
                duration: 1.6,
                ease: 'power2.inOut',
                force3D: true,
                onStart: () => {
                    // Pause offscreen background loops as zoom engages
                    offscreenTl.pause();
                },
            }, '-=0.05')
            // Fade in and out the "Entering the Realm..." text without triggering React re-renders!
            .to(enteringTextRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power1.out',
            }, '-=1.4')
            .to(enteringTextRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power1.in',
            }, '-=0.2')
            // Phase 3: Arrived smoothly at gate
            .call(() => {
                startPhase3();
            });

        return () => {
            if (masterTlRef.current) masterTlRef.current.kill();
            if (offscreenTlRef.current) offscreenTlRef.current.kill();
        };
    }, [initialRect, redirectUrl]);

    // ═══════════════════════════════════════════════════
    // PHASE 3: Waiting for User to Click Gate
    // Zero-lag GPU opacity pulsing around the arch
    // ═══════════════════════════════════════════════════
    const startPhase3 = useCallback(() => {
        setPhase('waiting');

        const svg = svgRef.current;
        if (!svg) return;

        // Apply lightweight GPU opacity pulse to the gate glow aura path (NO drop-shadow!)
        const gateGlow = svg.querySelector('#intro-gate-glow');
        if (gateGlow) {
            gateGlow.style.animation = 'gatePulse 1.6s ease-in-out infinite';
        }

        const clickzone = svg.querySelector('#intro-gate-clickzone');
        if (clickzone) {
            clickzone.style.pointerEvents = 'all';
            clickzone.style.cursor = 'pointer';

            const onGateClick = () => {
                clickzone.style.pointerEvents = 'none';
                clickzone.removeEventListener('click', onGateClick);
                startPhase4();
            };

            clickzone.addEventListener('click', onGateClick);
        }
    }, []);

    // ═══════════════════════════════════════════════════
    // PHASE 4: Gate Opens + Golden Flash Transition (1.4s)
    // ═══════════════════════════════════════════════════
    const startPhase4 = useCallback(() => {
        setPhase('opening');

        const svg = svgRef.current;
        if (!svg) return;

        // Stop gate glow animation
        const gateGlow = svg.querySelector('#intro-gate-glow');
        if (gateGlow) gateGlow.style.animation = 'none';

        const doorTl = gsap.timeline({
            onComplete: () => {
                setPhase('transitioning');
                // Flag to auto-open the guide modal immediately upon reaching the dashboard
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('open_guide_after_intro', 'true');
                }
                router.visit(redirectUrl);
            },
        });
        masterTlRef.current = doorTl;

        doorTl
            // Fade out the center seam
            .to(svg.querySelector('#intro-gate-seam'), {
                opacity: 0,
                duration: 0.15,
            })
            // Left door leaf swings open
            .to(svg.querySelector('#intro-gate-door-left'), {
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 0.75,
                ease: 'power2.in',
            })
            // Right door leaf swings open simultaneously
            .to(svg.querySelector('#intro-gate-door-right'), {
                scaleX: 0,
                transformOrigin: 'right center',
                duration: 0.75,
                ease: 'power2.in',
            }, '<')
            // Reveal divine golden light from inside the castle
            .to(svg.querySelector('#intro-gate-light'), {
                opacity: 1,
                duration: 0.35,
                ease: 'power1.in',
            }, '-=0.35')
            // Radiant golden/white screen flash expands from center
            .to(flashRef.current, {
                opacity: 1,
                scale: 45,
                duration: 1.1,
                ease: 'power2.in',
            }, '-=0.2');
    }, [redirectUrl]);

    // Render directly into document.body to guarantee 100% true viewport fullscreen
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            ref={backdropRef}
            className="fixed inset-0 z-[100] bg-[#070b14] overflow-hidden select-none"
            style={{ opacity: 0, contain: 'layout paint' }}
            role="dialog"
            aria-modal="true"
            aria-label="Entering the Realm"
        >
            {/* Animated Fullscreen SVG Wrapper */}
            <div ref={wrapperRef} className="w-full h-full">
                {/* Hardware-accelerated camera zoom layer */}
                <div ref={cameraRef} className="w-full h-full will-change-transform">
                    <CastleScene
                        ref={svgRef}
                        idPrefix="intro"
                        cloudsRef={cloudsRef}
                        birdsRef={birdsRef}
                        flagsRef={flagsRef}
                        beamRef={beamRef}
                        windowGlowRef={windowGlowRef}
                        torchRef={torchRef}
                        manaRef={manaRef}
                        waterfallRef={waterfallRef}
                        particlesRef={particlesRef}
                    />
                </div>
            </div>

            {/* Skip Button — Top Right */}
            <button
                type="button"
                className="intro-skip-btn"
                onClick={handleSkip}
                aria-label="Skip intro animation"
            >
                SKIP ▸▸
            </button>

            {/* Phase 2: "Entering the Realm..." loading text (Always in DOM, opacity animated via GSAP) */}
            <div
                ref={enteringTextRef}
                className="fixed inset-x-0 bottom-[10%] z-[110] flex justify-center pointer-events-none opacity-0"
                aria-live="polite"
            >
                <span className="entering-text text-[10px] sm:text-xs text-cyan-200 tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    Entering the Realm...
                </span>
            </div>

            {/* Phase 3: "OPEN THE GATE" interactive prompt (Zero-lag, crisp solid button) */}
            {phase === 'waiting' && (
                <div
                    className="fixed inset-x-0 bottom-[8%] z-[110] flex justify-center pointer-events-none"
                    aria-live="assertive"
                >
                    <button
                        type="button"
                        onClick={startPhase4}
                        className="gate-prompt text-xs sm:text-sm text-amber-200 tracking-wider pointer-events-auto cursor-pointer px-5 py-2.5 rounded-xl bg-[#090e18] border border-amber-400/60 hover:border-amber-300 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                    >
                        ⚔️ OPEN THE GATE ⚔️
                    </button>
                </div>
            )}

            {/* Phase 4: Golden light flash overlay */}
            <div
                ref={flashRef}
                className="fixed pointer-events-none z-[120]"
                style={{
                    top: '50%',
                    left: '50%',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #fffbeb 0%, #fef08a 25%, #f59e0b 60%, rgba(245,158,11,0) 100%)',
                    opacity: 0,
                    transform: 'translate(-50%, -50%) scale(0.1)',
                }}
                aria-hidden="true"
            />
        </div>,
        document.body
    );
}
