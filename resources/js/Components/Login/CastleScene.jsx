import React, { forwardRef } from 'react';

/**
 * CastleScene — Pure SVG illustration of the fantasy pixel art castle.
 *
 * Supports `idPrefix` to prevent gradient ID collisions when rendered multiple times.
 * Includes full fantasy details: castle keep, battlements, arched double gate,
 * clouds, soaring dragon/birds, torch flame, waterfall, and stardust particles.
 */
const CastleScene = forwardRef(function CastleScene(
    {
        idPrefix = '',
        className = 'w-full h-full block',
        viewBox = '0 0 480 480',
        cloudsRef,
        birdsRef,
        beamRef,
        flagsRef,
        windowGlowRef,
        torchRef,
        manaRef,
        waterfallRef,
        particlesRef,
        gateClickzoneRef,
    },
    ref
) {
    const p = (id) => (idPrefix ? `${idPrefix}-${id}` : id);
    const u = (id) => `url(#${p(id)})`;

    return (
        <svg
            ref={ref}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid slice"
            className={className}
            aria-label="Fantasy pixel art castle illustration"
        >
            <defs>
                {/* Sky gradient */}
                <linearGradient id={p('castleSky')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4a76a8" />
                    <stop offset="45%" stopColor="#709bc6" />
                    <stop offset="75%" stopColor="#9bbde0" />
                    <stop offset="100%" stopColor="#c3daf0" />
                </linearGradient>

                {/* Mountain gradients */}
                <linearGradient id={p('snowPeak')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2edf8" />
                    <stop offset="30%" stopColor="#c2d5ea" />
                    <stop offset="100%" stopColor="#556b8a" />
                </linearGradient>
                <linearGradient id={p('leftPeak')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#627b9b" />
                    <stop offset="100%" stopColor="#3d4f68" />
                </linearGradient>

                {/* Magic Beam Gradient */}
                <linearGradient id={p('magicBeamGrad')} x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.1" />
                </linearGradient>

                {/* Castle Stone & Roof Gradients */}
                <linearGradient id={p('castleWall')} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a3b1c6" />
                    <stop offset="50%" stopColor="#7a8ba3" />
                    <stop offset="100%" stopColor="#56667d" />
                </linearGradient>
                <linearGradient id={p('castleWallShadow')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#56667d" />
                    <stop offset="100%" stopColor="#3b4859" />
                </linearGradient>
                <linearGradient id={p('castleRoof')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#1d4ed8" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>

                {/* Terraces */}
                <linearGradient id={p('terraceGrad1')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="30%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id={p('terraceGrad2')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#166534" />
                </linearGradient>
                <linearGradient id={p('terraceGrad3')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#15803d" />
                    <stop offset="100%" stopColor="#14532d" />
                </linearGradient>

                {/* Water stream */}
                <linearGradient id={p('waterfallGrad')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
            </defs>

            {/* Sky Background */}
            <rect width="480" height="480" fill={u('castleSky')} />

            {/* Animated Clouds */}
            <g ref={cloudsRef} fill="#ffffff" opacity="0.88">
                <path d="M 20 80 h 70 v 14 h -70 z M 35 68 h 45 v 12 h -45 z M 48 58 h 24 v 10 h -24 z" />
                <path d="M 170 95 h 110 v 18 h -110 z M 190 80 h 75 v 15 h -75 z M 210 68 h 40 v 12 h -40 z" />
                <path d="M 330 110 h 80 v 16 h -80 z M 345 96 h 50 v 14 h -50 z" />
            </g>

            {/* Soaring Birds / Dragon Silhouette */}
            <g ref={birdsRef} fill="#1e293b" opacity="0.75">
                <g transform="translate(0, 0)">
                    <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                    <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                    <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                </g>
                <g transform="translate(-18, 14) scale(0.7)">
                    <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                    <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                    <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                </g>
                <g transform="translate(-32, -10) scale(0.55)">
                    <polygon points="12,12 18,14 12,16 6,14" fill="#0f172a" />
                    <path className="bird-wing" d="M 12 12 Q 18 4 24 10 L 16 13 Z" fill="#1e293b" />
                    <path className="bird-wing" d="M 12 16 Q 18 24 24 18 L 16 15 Z" fill="#1e293b" />
                </g>
            </g>

            {/* Snow Mountain Peak Right */}
            <polygon points="340,280 405,75 480,260 480,360 340,360" fill={u('snowPeak')} />
            <polygon points="385,130 405,75 425,125 410,140 400,120" fill="#ffffff" />
            <polygon points="405,75 440,160 420,150" fill="#e2edf8" opacity="0.9" />

            {/* Mountain Peaks Left */}
            <polygon points="0,290 90,130 190,260 210,320 0,320" fill={u('leftPeak')} />
            <polygon points="65,170 90,130 115,165 95,180" fill="#b9cadf" />
            <polygon points="90,130 140,200 115,190" fill="#4d627d" />

            {/* Magic Energy Beam Ascending */}
            <g ref={beamRef} className="magic-beam">
                <polygon points="380,240 388,155 385,155 382,240" fill={u('magicBeamGrad')} />
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
            <rect x="225" y="140" width="34" height="110" fill={u('castleWall')} />
            <rect x="242" y="140" width="17" height="110" fill={u('castleWallShadow')} />

            {/* Conical Roof High Keep */}
            <polygon points="218,140 242,95 266,140" fill={u('castleRoof')} />
            <line x1="242" y1="95" x2="242" y2="82" stroke="#e2e8f0" strokeWidth="2" />

            {/* Castle Main Gate Building */}
            <rect x="180" y="210" width="124" height="85" fill={u('castleWall')} />
            <rect x="242" y="210" width="62" height="85" fill={u('castleWallShadow')} />

            {/* Left Wing Tower */}
            <rect x="160" y="180" width="28" height="90" fill={u('castleWall')} />
            <polygon points="155,180 174,145 193,180" fill={u('castleRoof')} />
            <line x1="174" y1="145" x2="174" y2="135" stroke="#e2e8f0" strokeWidth="2" />

            {/* Right Wing Tower */}
            <rect x="296" y="185" width="28" height="85" fill={u('castleWallShadow')} />
            <polygon points="291,185 310,150 329,185" fill={u('castleRoof')} />
            <line x1="310" y1="150" x2="310" y2="140" stroke="#e2e8f0" strokeWidth="2" />

            {/* Outer Left Bastion Turret */}
            <rect x="135" y="235" width="26" height="60" fill={u('castleWall')} />
            <polygon points="130,235 148,205 166,235" fill={u('castleRoof')} />
            {/* Outer Right Bastion Turret */}
            <rect x="323" y="240" width="26" height="55" fill={u('castleWallShadow')} />
            <polygon points="318,240 336,210 354,240" fill={u('castleRoof')} />

            {/* Animated Fluttering Flags */}
            <g ref={flagsRef}>
                <polygon points="242,82 256,87 242,92" fill="#38bdf8" />
                <polygon points="174,135 186,139 174,143" fill="#f59e0b" />
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

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* GRAND MEDIEVAL ARCHED DOUBLE GATE                           */}
            {/* Unified arch structure with iron straps and heavy ring handles */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* 1. Deep interior doorway opening (darkness inside) */}
            <path
                d="M 242 258 A 15 15 0 0 0 227 273 L 227 295 L 257 295 L 257 273 A 15 15 0 0 0 242 258 Z"
                fill="#090d16"
            />

            {/* 2. Hidden divine light beam (revealed during Phase 4 open) */}
            <path
                id={p('gate-light')}
                d="M 242 259 A 14 14 0 0 0 228 273 L 228 295 L 256 295 L 256 273 A 14 14 0 0 0 242 259 Z"
                fill="#fef08a"
                opacity="0"
            />

            {/* 3. Left Door Leaf (Arched top-left, straight vertical center seam) */}
            <g id={p('gate-door-left')}>
                {/* Main dark timber panel */}
                <path
                    d="M 242 259 A 14 14 0 0 0 228 273 L 228 295 L 242 295 Z"
                    fill="#382214"
                />
                {/* Vertical wood grain grooves */}
                <line x1="233" y1="268" x2="233" y2="295" stroke="#25160d" strokeWidth="0.8" />
                <line x1="238" y1="261" x2="238" y2="295" stroke="#25160d" strokeWidth="0.8" />
                {/* Upper iron hinge bracket with rivets */}
                <rect x="228" y="271" width="10" height="2.5" fill="#1e293b" />
                <circle cx="230" cy="272.2" r="0.7" fill="#94a3b8" />
                <circle cx="236" cy="272.2" r="0.7" fill="#94a3b8" />
                {/* Lower iron hinge bracket with rivets */}
                <rect x="228" y="286" width="10" height="2.5" fill="#1e293b" />
                <circle cx="230" cy="287.2" r="0.7" fill="#94a3b8" />
                <circle cx="236" cy="287.2" r="0.7" fill="#94a3b8" />
                {/* Left bronze door knocker ring */}
                <circle cx="239" cy="280" r="1.5" stroke="#d97706" strokeWidth="0.8" fill="none" />
                <circle cx="239" cy="278.5" r="0.8" fill="#fbbf24" />
            </g>

            {/* 4. Right Door Leaf (Arched top-right, straight vertical center seam) */}
            <g id={p('gate-door-right')}>
                {/* Main dark timber panel (shadowed side) */}
                <path
                    d="M 242 259 A 14 14 0 0 1 256 273 L 256 295 L 242 295 Z"
                    fill="#2c1a0e"
                />
                {/* Vertical wood grain grooves */}
                <line x1="246" y1="261" x2="246" y2="295" stroke="#1c1008" strokeWidth="0.8" />
                <line x1="251" y1="268" x2="251" y2="295" stroke="#1c1008" strokeWidth="0.8" />
                {/* Upper iron hinge bracket with rivets */}
                <rect x="246" y="271" width="10" height="2.5" fill="#1e293b" />
                <circle cx="248" cy="272.2" r="0.7" fill="#94a3b8" />
                <circle cx="254" cy="272.2" r="0.7" fill="#94a3b8" />
                {/* Lower iron hinge bracket with rivets */}
                <rect x="246" y="286" width="10" height="2.5" fill="#1e293b" />
                <circle cx="248" cy="287.2" r="0.7" fill="#94a3b8" />
                <circle cx="254" cy="287.2" r="0.7" fill="#94a3b8" />
                {/* Right bronze door knocker ring */}
                <circle cx="245" cy="280" r="1.5" stroke="#d97706" strokeWidth="0.8" fill="none" />
                <circle cx="245" cy="278.5" r="0.8" fill="#fbbf24" />
            </g>

            {/* 5. Center seam line between the two door leaves */}
            <line id={p('gate-seam')} x1="242" y1="259" x2="242" y2="295" stroke="#120904" strokeWidth="1" />

            {/* 6. Stone archway trim around doorway */}
            <path
                id={p('gate-frame')}
                d="M 226 295 L 226 272 A 16 16 0 0 1 258 272 L 258 295 L 256 295 L 256 273 A 14 14 0 0 0 228 273 L 228 295 Z"
                fill="#475569"
            />
            {/* Decorative stone keystone at arch apex */}
            <polygon points="239,254 245,254 244,260 240,260" fill="#94a3b8" />

            {/* Pulsing cyan aura glow around the arch (GPU opacity-animated, zero drop-shadow lag!) */}
            <path
                id={p('gate-glow')}
                d="M 225 295 L 225 271 A 17 17 0 0 1 259 271 L 259 295"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0"
                style={{ pointerEvents: 'none' }}
            />

            {/* 7. Large invisible click target covering the gate area */}
            <rect
                ref={gateClickzoneRef}
                id={p('gate-clickzone')}
                x="215"
                y="248"
                width="54"
                height="58"
                fill="transparent"
                style={{ pointerEvents: 'none', cursor: 'pointer' }}
            />

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
            <polygon points="325,320 333,320 336,400 322,400" fill={u('waterfallGrad')} />

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
            <path d="M 200 340 Q 300 330 400 345 L 480 340 L 480 390 L 220 390 Z" fill={u('terraceGrad1')} />
            <path d="M 200 340 Q 300 330 400 345 L 480 340" stroke="#86efac" strokeWidth="3" fill="none" />

            <path d="M 180 380 Q 280 365 380 385 Q 430 395 480 380 L 480 435 L 180 435 Z" fill={u('terraceGrad2')} />
            <path d="M 180 380 Q 280 365 380 385 Q 430 395 480 380" stroke="#4ade80" strokeWidth="3.5" fill="none" />

            <path d="M 140 425 Q 260 410 370 430 Q 420 438 480 425 L 480 480 L 140 480 Z" fill={u('terraceGrad3')} />
            <path d="M 140 425 Q 260 410 370 430 Q 420 438 480 425" stroke="#22c55e" strokeWidth="4" fill="none" />

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
    );
});

export default CastleScene;
