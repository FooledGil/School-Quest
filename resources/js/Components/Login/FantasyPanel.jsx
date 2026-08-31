import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function FantasyPanel({ className = '' }) {
    const containerRef = useRef(null);
    const castleRef = useRef(null);
    const beamRef = useRef(null);
    const torchRef = useRef(null);
    const manaRef = useRef(null);
    const waterfallRef = useRef(null);
    const cloudsRef = useRef(null);
    const birdsRef = useRef(null);
    const flagsRef = useRef(null);
    const particlesRef = useRef(null);
    const windowGlowRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const ctx = gsap.context(() => {
            // 1. Subtle floating motion for the whole castle hill
            if (castleRef.current) {
                gsap.to(castleRef.current, {
                    y: -6,
                    duration: 3.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                });
            }

            // 2. Parallax Drifting Clouds in the Sky
            if (cloudsRef.current) {
                const clouds = cloudsRef.current.children;
                if (clouds[0]) {
                    gsap.to(clouds[0], {
                        x: 40,
                        duration: 18,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
                }
                if (clouds[1]) {
                    gsap.to(clouds[1], {
                        x: -35,
                        duration: 22,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
                }
                if (clouds[2]) {
                    gsap.to(clouds[2], {
                        x: 30,
                        duration: 16,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut'
                    });
                }
            }

            // 3. Soaring Fantasy Dragon / Birds across the mountain sky
            if (birdsRef.current) {
                gsap.fromTo(birdsRef.current,
                    { x: -80, y: 110, opacity: 0 },
                    { 
                        x: 520, 
                        y: 70, 
                        opacity: 0.9, 
                        duration: 14, 
                        repeat: -1, 
                        ease: 'none',
                        repeatDelay: 3 
                    }
                );
                // Wings flap
                const wings = birdsRef.current.querySelectorAll('.bird-wing');
                if (wings.length > 0) {
                    gsap.to(wings, {
                        scaleY: -0.8,
                        transformOrigin: 'bottom center',
                        duration: 0.35,
                        repeat: -1,
                        yoyo: true,
                        ease: 'power1.inOut'
                    });
                }
            }

            // 4. Fluttering Castle Tower Flags
            if (flagsRef.current) {
                const flags = flagsRef.current.children;
                gsap.to(flags, {
                    scaleX: 0.75,
                    skewY: 6,
                    transformOrigin: 'left center',
                    duration: 0.4,
                    stagger: 0.12,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }

            // 5. Ascending Magical Energy Beam & Core Pulse
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

            // 6. Magic Window & Beacon Light Pulse
            if (windowGlowRef.current) {
                gsap.to(windowGlowRef.current, {
                    scale: 1.3,
                    opacity: 0.85,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    transformOrigin: 'center center'
                });
            }

            // 7. Torch Flame Flicker with dynamic sparks
            if (torchRef.current) {
                gsap.to(torchRef.current, {
                    scaleX: 1.15,
                    scaleY: 1.25,
                    opacity: 0.95,
                    duration: 0.25,
                    repeat: -1,
                    yoyo: true,
                    ease: 'rough({ strength: 2, points: 12 })',
                    transformOrigin: 'bottom center',
                });
            }

            // 8. Mystical Mana Flame & Aura
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

            // 9. Waterfall Stream & Water Ripple Flow
            if (waterfallRef.current) {
                gsap.to(waterfallRef.current.children, {
                    y: 12,
                    opacity: 0.3,
                    duration: 0.5,
                    stagger: 0.12,
                    repeat: -1,
                    ease: 'none'
                });
            }

            // 10. Magic Floating Sparks & Fireflies (Floating Stardust Particles)
            if (particlesRef.current) {
                const sparks = particlesRef.current.children;
                Array.from(sparks).forEach((spark, idx) => {
                    gsap.fromTo(spark,
                        { 
                            y: 20, 
                            x: 0, 
                            opacity: 0, 
                            scale: 0.5 
                        },
                        {
                            y: -40 - (idx * 10),
                            x: (idx % 2 === 0 ? 15 : -15),
                            opacity: 0.9,
                            scale: 1.2,
                            duration: 2.5 + (idx * 0.4),
                            repeat: -1,
                            yoyo: true,
                            delay: idx * 0.4,
                            ease: 'power1.inOut'
                        }
                    );
                });
            }

            // 11. Subtle Mouse Parallax on Desktop
            const handleMouseMove = (e) => {
                if (!containerRef.current || window.innerWidth < 1024) return;
                const rect = containerRef.current.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
                const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(castleRef.current, {
                    x: mouseX * 12,
                    y: mouseY * 8,
                    duration: 0.6,
                    ease: 'power2.out'
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

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-[380px] lg:min-h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-[#22304c] shadow-2xl bg-[#141b2d] flex items-center justify-center select-none group cursor-pointer ${className}`}
        >
            <div ref={castleRef} className="w-full h-full">
                <svg
                    viewBox="0 0 480 480"
                    preserveAspectRatio="xMidYMid slice"
                    className="w-full h-full block"
                    style={{ imageRendering: 'pixelated' }}
                    aria-label="Fantasy pixel art castle illustration with rich animations"
                >
                    <defs>
                        {/* Sky gradient */}
                        <linearGradient id="castleSky" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4a76a8" />
                            <stop offset="45%" stopColor="#709bc6" />
                            <stop offset="75%" stopColor="#9bbde0" />
                            <stop offset="100%" stopColor="#c3daf0" />
                        </linearGradient>

                        {/* Mountain gradients */}
                        <linearGradient id="snowPeak" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e2edf8" />
                            <stop offset="30%" stopColor="#c2d5ea" />
                            <stop offset="100%" stopColor="#556b8a" />
                        </linearGradient>
                        <linearGradient id="leftPeak" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#627b9b" />
                            <stop offset="100%" stopColor="#3d4f68" />
                        </linearGradient>

                        {/* Magic Beam Gradient */}
                        <linearGradient id="magicBeamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.1" />
                        </linearGradient>

                        {/* Castle Stone & Roof Gradients */}
                        <linearGradient id="castleWall" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a3b1c6" />
                            <stop offset="50%" stopColor="#7a8ba3" />
                            <stop offset="100%" stopColor="#56667d" />
                        </linearGradient>
                        <linearGradient id="castleWallShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#56667d" />
                            <stop offset="100%" stopColor="#3b4859" />
                        </linearGradient>
                        <linearGradient id="castleRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#1d4ed8" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>

                        {/* Terraces */}
                        <linearGradient id="terraceGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="30%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#15803d" />
                        </linearGradient>
                        <linearGradient id="terraceGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#16a34a" />
                            <stop offset="100%" stopColor="#166534" />
                        </linearGradient>
                        <linearGradient id="terraceGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#15803d" />
                            <stop offset="100%" stopColor="#14532d" />
                        </linearGradient>

                        {/* Water stream */}
                        <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#bae6fd" />
                            <stop offset="50%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                    </defs>

                    {/* Sky Background */}
                    <rect width="480" height="480" fill="url(#castleSky)" />

                    {/* Animated Clouds */}
                    <g ref={cloudsRef} fill="#ffffff" opacity="0.88">
                        {/* Cloud left */}
                        <path d="M 20 80 h 70 v 14 h -70 z M 35 68 h 45 v 12 h -45 z M 48 58 h 24 v 10 h -24 z" />
                        {/* Cloud center */}
                        <path d="M 170 95 h 110 v 18 h -110 z M 190 80 h 75 v 15 h -75 z M 210 68 h 40 v 12 h -40 z" />
                        {/* Cloud right top */}
                        <path d="M 330 110 h 80 v 16 h -80 z M 345 96 h 50 v 14 h -50 z" />
                    </g>

                    {/* Soaring Birds / Dragon Silhouette */}
                    <g ref={birdsRef} fill="#1e293b" opacity="0.75">
                        {/* Leader Bird / Dragon */}
                        <g transform="translate(0, 0)">
                            <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                            <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                            <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                        </g>
                        {/* Follower Bird 1 */}
                        <g transform="translate(-18, 14) scale(0.7)">
                            <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                            <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                            <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                        </g>
                        {/* Follower Bird 2 */}
                        <g transform="translate(-32, -10) scale(0.55)">
                            <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                            <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                            <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                        </g>
                    </g>

                    {/* Snow Mountain Peak Right */}
                    <polygon points="340,280 405,75 480,260 480,360 340,360" fill="url(#snowPeak)" />
                    {/* Snow cap highlights */}
                    <polygon points="385,130 405,75 425,125 410,140 400,120" fill="#ffffff" />
                    <polygon points="405,75 440,160 420,150" fill="#e2edf8" opacity="0.9" />

                    {/* Mountain Peaks Left */}
                    <polygon points="0,290 90,130 190,260 210,320 0,320" fill="url(#leftPeak)" />
                    <polygon points="65,170 90,130 115,165 95,180" fill="#b9cadf" />
                    <polygon points="90,130 140,200 115,190" fill="#4d627d" />

                    {/* Magic Energy Beam Ascending */}
                    <g ref={beamRef} className="magic-beam">
                        <polygon points="380,240 388,155 385,155 382,240" fill="url(#magicBeamGrad)" />
                        <rect x="382" y="150" width="4" height="90" fill="#38bdf8" opacity="0.8" />
                        <rect x="383" y="145" width="2" height="95" fill="#ffffff" opacity="0.95" />
                        <circle cx="384" cy="200" r="12" fill="#38bdf8" opacity="0.4" />
                    </g>

                    {/* Rocky Castle Hill Outcrop */}
                    <polygon points="120,400 150,290 320,290 360,400 240,430" fill="#475569" />
                    <polygon points="135,390 160,300 270,300 260,390" fill="#64748b" />
                    <polygon points="260,300 320,290 345,390 260,390" fill="#334155" />

                    {/* Main Castle Structure */}
                    {/* Central High Keep Tower */}
                    <rect x="225" y="140" width="34" height="110" fill="url(#castleWall)" />
                    <rect x="242" y="140" width="17" height="110" fill="url(#castleWallShadow)" />
                    
                    {/* Conical Roof High Keep */}
                    <polygon points="218,140 242,95 266,140" fill="url(#castleRoof)" />
                    <line x1="242" y1="95" x2="242" y2="82" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Castle Main Gate Building */}
                    <rect x="180" y="210" width="124" height="85" fill="url(#castleWall)" />
                    <rect x="242" y="210" width="62" height="85" fill="url(#castleWallShadow)" />

                    {/* Left Wing Tower */}
                    <rect x="160" y="180" width="28" height="90" fill="url(#castleWall)" />
                    <polygon points="155,180 174,145 193,180" fill="url(#castleRoof)" />
                    <line x1="174" y1="145" x2="174" y2="135" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Right Wing Tower */}
                    <rect x="296" y="185" width="28" height="85" fill="url(#castleWallShadow)" />
                    <polygon points="291,185 310,150 329,185" fill="url(#castleRoof)" />
                    <line x1="310" y1="150" x2="310" y2="140" stroke="#e2e8f0" strokeWidth="2" />

                    {/* Outer Left Bastion Turret */}
                    <rect x="135" y="235" width="26" height="60" fill="url(#castleWall)" />
                    <polygon points="130,235 148,205 166,235" fill="url(#castleRoof)" />
                    {/* Outer Right Bastion Turret */}
                    <rect x="323" y="240" width="26" height="55" fill="url(#castleWallShadow)" />
                    <polygon points="318,240 336,210 354,240" fill="url(#castleRoof)" />

                    {/* Animated Fluttering Flags */}
                    <g ref={flagsRef}>
                        {/* High Keep Flag */}
                        <polygon points="242,82 256,87 242,92" fill="#38bdf8" />
                        {/* Left Wing Flag */}
                        <polygon points="174,135 186,139 174,143" fill="#f59e0b" />
                        {/* Right Wing Flag */}
                        <polygon points="310,140 322,144 310,148" fill="#38bdf8" />
                    </g>

                    {/* Battlements / Parapets */}
                    <rect x="178" y="204" width="128" height="6" fill="#cbd5e1" />
                    <g fill="#94a3b8">
                        <rect x="180" y="198" width="8" height="6" />
                        <rect x="194" y="198" width="8" height="6" />
                        <rect x="208" y="198" width="8" height="6" />
                        <rect x="268" y="198" width="8" height="6" />
                        <rect x="282" y="198" width="8" height="6" />
                        <rect x="296" y="198" width="8" height="6" />
                    </g>

                    {/* Castle Windows & Glowing Rose Window */}
                    <g ref={windowGlowRef}>
                        <circle cx="242" cy="180" r="16" fill="#38bdf8" opacity="0.4" />
                        <circle cx="242" cy="180" r="10" fill="#38bdf8" opacity="0.9" />
                        <circle cx="242" cy="180" r="6" fill="#e0f2fe" />
                    </g>

                    {/* Arch Windows */}
                    <rect x="238" y="225" width="8" height="15" rx="3" fill="#0f172a" />
                    <rect x="200" y="235" width="6" height="12" rx="2" fill="#0f172a" />
                    <rect x="278" y="235" width="6" height="12" rx="2" fill="#0f172a" />
                    <rect x="170" y="210" width="5" height="10" rx="2" fill="#0f172a" />
                    <rect x="306" y="215" width="5" height="10" rx="2" fill="#0f172a" />

                    {/* Main Arched Wooden Gate */}
                    <rect x="228" y="260" width="28" height="35" rx="14" fill="#3b2413" />
                    <rect x="231" y="263" width="22" height="32" rx="11" fill="#1e130c" />
                    <line x1="242" y1="263" x2="242" y2="295" stroke="#52321b" strokeWidth="2" />

                    {/* Castle Entry Stone Bridge */}
                    <polygon points="215,295 269,295 285,340 199,340" fill="#64748b" />
                    <rect x="195" y="325" width="94" height="8" fill="#475569" />

                    {/* Torch Stand & Animated Fire */}
                    <g transform="translate(295, 305)">
                        <rect x="4" y="10" width="4" height="24" fill="#334155" />
                        <rect x="2" y="6" width="8" height="5" fill="#64748b" />
                        <g ref={torchRef}>
                            <ellipse cx="6" cy="2" rx="6" ry="8" fill="#ea580c" />
                            <ellipse cx="6" cy="1" rx="4" ry="6" fill="#f59e0b" />
                            <circle cx="6" cy="0" r="2.5" fill="#fef08a" />
                            <circle cx="6" cy="2" r="14" fill="#f59e0b" opacity="0.35" />
                        </g>
                    </g>

                    {/* Waterfall from cliff into terrace */}
                    <polygon points="325,320 333,320 336,400 322,400" fill="url(#waterfallGrad)" />
                    
                    {/* Flowing Water Ripples */}
                    <g ref={waterfallRef}>
                        <line x1="327" y1="330" x2="327" y2="350" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                        <line x1="331" y1="345" x2="331" y2="370" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.8" />
                        <line x1="325" y1="365" x2="325" y2="390" stroke="#bae6fd" strokeWidth="1.5" opacity="0.8" />
                    </g>

                    <path d="M 320 395 Q 330 385 340 395" stroke="#bae6fd" strokeWidth="3" fill="none" opacity="0.8" />

                    {/* Mystic Blue Mana Flame Orb near waterfall */}
                    <g ref={manaRef} transform="translate(315, 355)">
                        <circle cx="10" cy="10" r="7" fill="#38bdf8" />
                        <circle cx="10" cy="10" r="4" fill="#e0f2fe" />
                        <circle cx="10" cy="10" r="16" fill="#0284c7" opacity="0.35" />
                    </g>

                    {/* Stepped Rice Terraces in Foreground */}
                    <path
                        d="M 200 340 Q 300 330 400 345 L 480 340 L 480 390 L 220 390 Z"
                        fill="url(#terraceGrad1)"
                    />
                    <path
                        d="M 200 340 Q 300 330 400 345 L 480 340"
                        stroke="#86efac"
                        strokeWidth="3"
                        fill="none"
                    />

                    <path
                        d="M 180 380 Q 280 365 380 385 Q 430 395 480 380 L 480 435 L 180 435 Z"
                        fill="url(#terraceGrad2)"
                    />
                    <path
                        d="M 180 380 Q 280 365 380 385 Q 430 395 480 380"
                        stroke="#4ade80"
                        strokeWidth="3.5"
                        fill="none"
                    />

                    <path
                        d="M 140 425 Q 260 410 370 430 Q 420 438 480 425 L 480 480 L 140 480 Z"
                        fill="url(#terraceGrad3)"
                    />
                    <path
                        d="M 140 425 Q 260 410 370 430 Q 420 438 480 425"
                        stroke="#22c55e"
                        strokeWidth="4"
                        fill="none"
                    />

                    {/* Floating Magical Stardust / Firefly Sparks */}
                    <g ref={particlesRef}>
                        <circle cx="210" cy="270" r="2" fill="#fef08a" opacity="0.9" />
                        <circle cx="350" cy="310" r="2.5" fill="#67e8f9" opacity="0.8" />
                        <circle cx="280" cy="240" r="1.5" fill="#fde047" opacity="0.85" />
                        <circle cx="160" cy="290" r="2" fill="#a5f3fc" opacity="0.9" />
                        <circle cx="390" cy="230" r="2" fill="#38bdf8" opacity="0.8" />
                        <circle cx="240" cy="330" r="1.5" fill="#facc15" opacity="0.85" />
                    </g>

                    {/* Dark Green Pine Forest Framing */}
                    <g fill="#142c22">
                        <polygon points="25,240 5,340 45,340" />
                        <polygon points="25,260 0,360 50,360" />
                        <polygon points="25,290 -5,400 55,400" />
                        <polygon points="25,320 -10,480 60,480" />

                        <polygon points="65,300 45,390 85,390" />
                        <polygon points="65,330 40,430 90,430" />
                        <polygon points="65,360 35,480 95,480" />

                        <polygon points="105,370 85,440 125,440" />
                        <polygon points="105,400 80,480 130,480" />
                    </g>
                </svg>
            </div>

            {/* Subtle Inner Glow Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl lg:rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
        </div>
    );
}
