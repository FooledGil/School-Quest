import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import CastleScene from './CastleScene';

const FantasyPanel = forwardRef(function FantasyPanel({ className = '' }, ref) {
    const containerRef = useRef(null);
    const castleRef = useRef(null);
    const svgRef = useRef(null);
    const beamRef = useRef(null);
    const torchRef = useRef(null);
    const manaRef = useRef(null);
    const waterfallRef = useRef(null);
    const cloudsRef = useRef(null);
    const birdsRef = useRef(null);
    const flagsRef = useRef(null);
    const particlesRef = useRef(null);
    const windowGlowRef = useRef(null);

    const gsapCtxRef = useRef(null);

    // Expose element refs to parent
    useImperativeHandle(ref, () => ({
        getContainerElement: () => containerRef.current,
        getSvgElement: () => svgRef.current,
        stopAmbient: () => {
            if (gsapCtxRef.current) {
                gsapCtxRef.current.revert();
                gsapCtxRef.current = null;
            }
        },
    }));

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // 1. Subtle floating motion for the castle
            if (castleRef.current) {
                gsap.to(castleRef.current, {
                    y: -6,
                    duration: 3.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }

            // 2. Parallax Drifting Clouds
            if (cloudsRef.current) {
                const clouds = cloudsRef.current.children;
                if (clouds[0]) {
                    gsap.to(clouds[0], { x: 40, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                }
                if (clouds[1]) {
                    gsap.to(clouds[1], { x: -35, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                }
                if (clouds[2]) {
                    gsap.to(clouds[2], { x: 30, duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut' });
                }
            }

            // 3. Soaring Birds / Dragon
            if (birdsRef.current) {
                gsap.fromTo(
                    birdsRef.current,
                    { x: -80, y: 110, opacity: 0 },
                    { x: 520, y: 70, opacity: 0.9, duration: 14, repeat: -1, ease: 'none', repeatDelay: 3 }
                );
                const wings = birdsRef.current.querySelectorAll('.bird-wing');
                if (wings.length > 0) {
                    gsap.to(wings, {
                        scaleY: -0.8,
                        transformOrigin: 'bottom center',
                        duration: 0.35,
                        repeat: -1,
                        yoyo: true,
                        ease: 'power1.inOut',
                    });
                }
            }

            // 4. Fluttering Flags
            if (flagsRef.current) {
                gsap.to(flagsRef.current.children, {
                    scaleX: 0.75,
                    skewY: 6,
                    transformOrigin: 'left center',
                    duration: 0.4,
                    stagger: 0.12,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }

            // 5. Ascending Magical Energy Beam
            if (beamRef.current) {
                gsap.to(beamRef.current, {
                    opacity: 0.75,
                    scaleY: 1.08,
                    duration: 1.6,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    transformOrigin: 'bottom center',
                });
            }

            // 6. Magic Window Glow
            if (windowGlowRef.current) {
                gsap.to(windowGlowRef.current, {
                    scale: 1.3,
                    opacity: 0.85,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    transformOrigin: 'center center',
                });
            }

            // 7. Torch Flame Flicker
            if (torchRef.current) {
                gsap.to(torchRef.current, {
                    scaleX: 1.15,
                    scaleY: 1.25,
                    opacity: 0.95,
                    duration: 0.25,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power1.inOut',
                    transformOrigin: 'bottom center',
                });
            }

            // 8. Mystical Mana Flame
            if (manaRef.current) {
                gsap.to(manaRef.current, {
                    scale: 1.25,
                    y: -4,
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    transformOrigin: 'center center',
                });
            }

            // 9. Waterfall Stream
            if (waterfallRef.current) {
                gsap.to(waterfallRef.current.children, {
                    y: 12,
                    opacity: 0.3,
                    duration: 0.5,
                    stagger: 0.12,
                    repeat: -1,
                    ease: 'none',
                });
            }

            // 10. Magic Floating Sparks
            if (particlesRef.current) {
                Array.from(particlesRef.current.children).forEach((spark, idx) => {
                    gsap.fromTo(
                        spark,
                        { y: 20, x: 0, opacity: 0, scale: 0.5 },
                        {
                            y: -40 - idx * 10,
                            x: idx % 2 === 0 ? 15 : -15,
                            opacity: 0.9,
                            scale: 1.2,
                            duration: 2.5 + idx * 0.4,
                            repeat: -1,
                            yoyo: true,
                            delay: idx * 0.4,
                            ease: 'power1.inOut',
                        }
                    );
                });
            }

            // 11. Subtle Mouse Parallax
            const handleMouseMove = (e) => {
                if (!containerRef.current || window.innerWidth < 1024) return;
                const r = containerRef.current.getBoundingClientRect();
                const mouseX = (e.clientX - r.left) / r.width - 0.5;
                const mouseY = (e.clientY - r.top) / r.height - 0.5;
                gsap.to(castleRef.current, {
                    x: mouseX * 12,
                    y: mouseY * 8,
                    duration: 0.6,
                    ease: 'power2.out',
                });
            };

            const containerEl = containerRef.current;
            if (containerEl) {
                containerEl.addEventListener('mousemove', handleMouseMove);
                containerEl.addEventListener('mouseleave', () => {
                    gsap.to(castleRef.current, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
                });
            }
        }, containerRef);

        gsapCtxRef.current = ctx;

        return () => {
            ctx.revert();
            gsapCtxRef.current = null;
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-[380px] lg:min-h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-[#22304c] shadow-2xl bg-[#141b2d] flex items-center justify-center select-none group cursor-pointer ${className}`}
        >
            <div ref={castleRef} className="w-full h-full">
                <CastleScene
                    ref={svgRef}
                    cloudsRef={cloudsRef}
                    birdsRef={birdsRef}
                    beamRef={beamRef}
                    flagsRef={flagsRef}
                    windowGlowRef={windowGlowRef}
                    torchRef={torchRef}
                    manaRef={manaRef}
                    waterfallRef={waterfallRef}
                    particlesRef={particlesRef}
                />
            </div>

            {/* Subtle Inner Glow Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl lg:rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
        </div>
    );
});

export default FantasyPanel;
