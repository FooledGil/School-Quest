import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * PixelHero: Pure SVG Pixel-Art Adventurer Character
 * Features:
 * - Idle breathing & cape flutter
 * - Realistic pixel walk cycle (leg swing, body bob, arm movement)
 * - Victory celebration jump with sword raise on final step
 * - Direction flip (facing right or left)
 */
export default function PixelHero({ 
    isWalking = false, 
    direction = 1, // 1 = facing right, -1 = facing left
    isCelebrating = false, 
    className = 'w-16 h-16' 
}) {
    const heroRef = useRef(null);
    const bodyGroupRef = useRef(null);
    const leftLegRef = useRef(null);
    const rightLegRef = useRef(null);
    const leftArmRef = useRef(null);
    const rightArmRef = useRef(null);
    const capeRef = useRef(null);
    const swordRef = useRef(null);
    const dustRef = useRef(null);

    // GSAP Walk & Idle Animations
    useGSAP(() => {
        if (!heroRef.current) return;

        let walkTimeline = null;
        let idleTimeline = null;
        let celebrateTimeline = null;

        if (isCelebrating) {
            // Victory Jump & Sword Raise Animation
            celebrateTimeline = gsap.timeline({ repeat: -1, yoyo: true });
            celebrateTimeline
                .to(bodyGroupRef.current, { y: -12, duration: 0.35, ease: 'power2.out' })
                .to(swordRef.current, { rotation: -35, transformOrigin: 'bottom center', duration: 0.25 }, '<')
                .to(leftArmRef.current, { rotation: -40, transformOrigin: 'top center', duration: 0.25 }, '<')
                .to(rightArmRef.current, { rotation: 40, transformOrigin: 'top center', duration: 0.25 }, '<')
                .to(bodyGroupRef.current, { y: 0, duration: 0.3, ease: 'bounce.out' });
        } else if (isWalking) {
            // Walking Cycle Animation
            walkTimeline = gsap.timeline({ repeat: -1 });

            // Body bob up & down while marching
            walkTimeline.to(bodyGroupRef.current, {
                y: -3,
                duration: 0.15,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut'
            }, 0);

            // Left leg swing forward then back
            walkTimeline.to(leftLegRef.current, {
                rotation: 28,
                transformOrigin: 'top center',
                duration: 0.18,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            }, 0);

            // Right leg swing opposite
            walkTimeline.to(rightLegRef.current, {
                rotation: -28,
                transformOrigin: 'top center',
                duration: 0.18,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            }, 0.18);

            // Arm swinging
            walkTimeline.to(leftArmRef.current, {
                rotation: -24,
                transformOrigin: 'top center',
                duration: 0.18,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            }, 0);
            walkTimeline.to(rightArmRef.current, {
                rotation: 24,
                transformOrigin: 'top center',
                duration: 0.18,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut'
            }, 0.18);

            // Cape flap
            walkTimeline.to(capeRef.current, {
                scaleX: 1.25,
                rotation: direction === 1 ? -12 : 12,
                transformOrigin: 'top left',
                duration: 0.2,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut'
            }, 0);

            // Walking dust puffs
            if (dustRef.current) {
                gsap.fromTo(dustRef.current.children, 
                    { opacity: 0.9, scale: 0.4, x: 0 },
                    { opacity: 0, scale: 1.5, x: direction === 1 ? -10 : 10, duration: 0.35, stagger: 0.1, repeat: -1, ease: 'power2.out' }
                );
            }
        } else {
            // Idle Breathing Animation
            idleTimeline = gsap.timeline({ repeat: -1, yoyo: true });
            idleTimeline.to(bodyGroupRef.current, {
                y: -1.5,
                duration: 0.8,
                ease: 'sine.inOut'
            });
            idleTimeline.to(capeRef.current, {
                rotation: 4,
                transformOrigin: 'top left',
                duration: 0.8,
                ease: 'sine.inOut'
            }, '<');
            
            // Reset limbs to neutral
            gsap.to([leftLegRef.current, rightLegRef.current, leftArmRef.current, rightArmRef.current], {
                rotation: 0,
                duration: 0.2
            });
        }

        return () => {
            if (walkTimeline) walkTimeline.kill();
            if (idleTimeline) idleTimeline.kill();
            if (celebrateTimeline) celebrateTimeline.kill();
        };
    }, { dependencies: [isWalking, isCelebrating, direction], scope: heroRef });

    return (
        <div 
            ref={heroRef} 
            className={`relative select-none pointer-events-none transition-transform duration-200 ${className}`}
            style={{
                transform: `scaleX(${direction === -1 ? -1 : 1})`,
                imageRendering: 'pixelated'
            }}
        >
            <svg 
                viewBox="0 0 32 32" 
                className="w-full h-full overflow-visible drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
                shapeRendering="crispEdges"
            >
                {/* Walking Dust Particles */}
                <g ref={dustRef} className={isWalking ? 'block' : 'hidden'}>
                    <rect x="6" y="28" width="2" height="2" fill="#94a3b8" />
                    <rect x="4" y="29" width="2" height="1" fill="#cbd5e1" />
                    <rect x="2" y="27" width="2" height="2" fill="#64748b" />
                </g>

                {/* Ground Shadow */}
                <ellipse cx="16" cy="30" rx="9" ry="2.5" fill="#000000" opacity="0.45" />

                {/* Cape (Back) */}
                <g ref={capeRef}>
                    <rect x="8" y="14" width="4" height="10" fill="#dc2626" />
                    <rect x="7" y="16" width="3" height="9" fill="#b91c1c" />
                    <rect x="6" y="19" width="2" height="7" fill="#991b1b" />
                </g>

                {/* Sword on Back */}
                <g ref={swordRef}>
                    <rect x="6" y="8" width="2" height="2" fill="#f59e0b" /> {/* Pommel */}
                    <rect x="7" y="10" width="2" height="2" fill="#78350f" /> {/* Hilt */}
                    <rect x="5" y="12" width="6" height="1" fill="#f59e0b" /> {/* Guard */}
                    <rect x="7" y="13" width="2" height="8" fill="#e2e8f0" /> {/* Blade */}
                    <rect x="8" y="13" width="1" height="8" fill="#94a3b8" /> {/* Blade shadow */}
                </g>

                {/* Legs (Independent for walking animation) */}
                <g id="legs">
                    {/* Left Leg */}
                    <g ref={leftLegRef}>
                        <rect x="12" y="22" width="3" height="5" fill="#1e293b" />
                        <rect x="11" y="26" width="4" height="3" fill="#b45309" /> {/* Boot */}
                        <rect x="11" y="28" width="5" height="2" fill="#78350f" /> {/* Boot sole */}
                    </g>

                    {/* Right Leg */}
                    <g ref={rightLegRef}>
                        <rect x="17" y="22" width="3" height="5" fill="#0f172a" />
                        <rect x="17" y="26" width="4" height="3" fill="#92400e" /> {/* Boot */}
                        <rect x="17" y="28" width="5" height="2" fill="#451a03" /> {/* Boot sole */}
                    </g>
                </g>

                {/* Main Body Group (Moves with breath & bob) */}
                <g ref={bodyGroupRef}>
                    {/* Arm (Left / Behind) */}
                    <g ref={leftArmRef}>
                        <rect x="10" y="14" width="3" height="6" fill="#1d4ed8" />
                        <rect x="10" y="19" width="3" height="3" fill="#fed7aa" /> {/* Hand */}
                    </g>

                    {/* Torso / Armor */}
                    <rect x="12" y="13" width="8" height="9" fill="#2563eb" /> {/* Blue Tunic */}
                    <rect x="14" y="14" width="4" height="6" fill="#3b82f6" /> {/* Chest Highlight */}
                    <rect x="15" y="15" width="2" height="3" fill="#fbbf24" /> {/* Gold Emblem */}
                    
                    {/* Belt */}
                    <rect x="12" y="20" width="8" height="2" fill="#78350f" />
                    <rect x="15" y="20" width="2" height="2" fill="#fbbf24" /> {/* Belt Buckle */}

                    {/* Head / Helmet */}
                    <rect x="12" y="6" width="8" height="8" fill="#fed7aa" /> {/* Skin */}
                    
                    {/* Hair / Helmet Crest */}
                    <rect x="11" y="4" width="10" height="4" fill="#3b82f6" />
                    <rect x="10" y="6" width="3" height="4" fill="#1d4ed8" />
                    <rect x="14" y="2" width="4" height="3" fill="#fbbf24" /> {/* Gold Feather/Horn */}
                    <rect x="15" y="1" width="2" height="2" fill="#f59e0b" />
                    
                    {/* Face Details */}
                    <rect x="16" y="8" width="2" height="2" fill="#0f172a" /> {/* Eye */}
                    <rect x="17" y="8" width="1" height="1" fill="#ffffff" /> {/* Eye reflection */}
                    <rect x="16" y="11" width="3" height="1" fill="#ea580c" /> {/* Smile */}
                    <rect x="13" y="10" width="2" height="1" fill="#fca5a5" opacity="0.6" /> {/* Blush */}

                    {/* Arm (Right / Front) */}
                    <g ref={rightArmRef}>
                        <rect x="19" y="14" width="3" height="6" fill="#3b82f6" />
                        <rect x="19" y="19" width="3" height="3" fill="#fed7aa" /> {/* Hand */}
                        <rect x="20" y="15" width="2" height="3" fill="#60a5fa" /> {/* Shoulder pad */}
                    </g>
                </g>
            </svg>
        </div>
    );
}
