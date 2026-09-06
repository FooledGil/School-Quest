import React from 'react';

/**
 * CastleHallScene — Pure SVG illustration of a lively Castle Great Hall / Tavern Common Room.
 * Shows animated pixel characters interacting (Knight, Mage, Rogue) with speech emotes,
 * roaring fireplace, stained glass rose window, and banquet table with map and potions.
 */
export default function CastleHallScene({ idPrefix = 'hall', className = 'w-full h-full block' }) {
    const p = (id) => `${idPrefix}-${id}`;
    const u = (id) => `url(#${p(id)})`;

    return (
        <svg
            viewBox="0 0 600 320"
            preserveAspectRatio="xMidYMid meet"
            className={className}
            aria-label="Castle Great Hall with interactive pixel characters"
        >
            <defs>
                {/* Wall Stone Gradient */}
                <linearGradient id={p('stoneWall')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#151f30" />
                    <stop offset="100%" stopColor="#0b111c" />
                </linearGradient>

                {/* Floor Stone Gradient */}
                <linearGradient id={p('floorStone')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#172033" />
                    <stop offset="100%" stopColor="#090d16" />
                </linearGradient>

                {/* Stained Glass Glow */}
                <radialGradient id={p('stainedGlow')} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0b111c" stopOpacity="0" />
                </radialGradient>

                {/* Fireplace Hearth Glow */}
                <radialGradient id={p('fireGlow')} cx="50%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="70%" stopColor="#ea580c" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0b111c" stopOpacity="0" />
                </radialGradient>

                {/* Oak Wood Furniture */}
                <linearGradient id={p('oakWood')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5c3818" />
                    <stop offset="50%" stopColor="#42260e" />
                    <stop offset="100%" stopColor="#281507" />
                </linearGradient>

                {/* Tapestry Red */}
                <linearGradient id={p('tapestryRed')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#991b1b" />
                    <stop offset="50%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#450a0a" />
                </linearGradient>

                {/* Tapestry Blue */}
                <linearGradient id={p('tapestryBlue')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="50%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#172554" />
                </linearGradient>
            </defs>

            {/* ── 1. Back Wall & Architecture ── */}
            <rect width="600" height="240" fill={u('stoneWall')} />
            {/* Castle Flagstone Floor */}
            <polygon points="0,230 600,230 600,320 0,320" fill={u('floorStone')} />
            <line x1="0" y1="230" x2="600" y2="230" stroke="#334155" strokeWidth="2" />
            {/* Floor Flagstone Grid Perspective Lines */}
            <line x1="120" y1="230" x2="80" y2="320" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="240" y1="230" x2="220" y2="320" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="360" y1="230" x2="380" y2="320" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="480" y1="230" x2="520" y2="320" stroke="#1e293b" strokeWidth="1.2" />
            <line x1="0" y1="270" x2="600" y2="270" stroke="#1e293b" strokeWidth="1" />

            {/* ── 2. Gothic Arches & Columns ── */}
            {/* Left Column */}
            <rect x="25" y="25" width="20" height="205" fill="#334155" />
            <rect x="21" y="20" width="28" height="8" fill="#475569" />
            {/* Center-Left Arch Span */}
            <path d="M 45 25 Q 155 8 250 25" stroke="#475569" strokeWidth="5" fill="none" />
            {/* Center Column */}
            <rect x="250" y="25" width="20" height="205" fill="#334155" />
            <rect x="246" y="20" width="28" height="8" fill="#475569" />
            {/* Center-Right Arch Span */}
            <path d="M 270 25 Q 390 8 495 25" stroke="#475569" strokeWidth="5" fill="none" />
            {/* Right Column */}
            <rect x="495" y="25" width="20" height="205" fill="#334155" />
            <rect x="491" y="20" width="28" height="8" fill="#475569" />

            {/* ── 3. Central Stained Glass Rose Window ── */}
            <circle cx="150" cy="95" r="46" fill={u('stainedGlow')} />
            <circle cx="150" cy="95" r="36" stroke="#475569" strokeWidth="3" fill="#0f172a" opacity="0.85" />
            {/* Rose Window Petals */}
            <path d="M 150 63 L 150 127 M 118 95 L 182 95 M 127 72 L 173 118 M 127 118 L 173 72" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <circle cx="150" cy="95" r="13" fill="#67e8f9" opacity="0.75" className="svg-window-glow" />
            <circle cx="150" cy="95" r="5" fill="#fef08a" />

            {/* Ambient Light Beam from Window */}
            <polygon points="120,105 180,105 280,260 70,260" fill="url(#hall-stainedGlow)" opacity="0.22" style={{ pointerEvents: 'none' }} />

            {/* ── 4. Grand Stone Fireplace (Right side) ── */}
            <g transform="translate(420, 120)">
                {/* Hearth Mantelpiece & Chimney */}
                <rect x="15" y="-50" width="80" height="50" fill="#1e293b" />
                <rect x="0" y="0" width="110" height="110" fill="#334155" rx="3" />
                <rect x="-6" y="-6" width="122" height="12" fill="#475569" rx="2" />
                {/* Firebox Cavity */}
                <path d="M 20 110 L 20 50 Q 55 25 90 50 L 90 110 Z" fill="#090d16" />
                {/* Fireplace Glow Background */}
                <circle cx="55" cy="80" r="45" fill={u('fireGlow')} />
                {/* Cast Iron Andirons */}
                <rect x="28" y="96" width="54" height="6" fill="#1e293b" />
                {/* Burning Wood Logs */}
                <polygon points="32,98 78,84 82,90 36,104" fill="#451a03" />
                <polygon points="76,100 34,86 38,80 80,94" fill="#78350f" />
                {/* Animated Hearth Fire Flames */}
                <g className="svg-brazier-fire" transform="translate(55, 78)">
                    <ellipse cx="0" cy="4" rx="18" ry="20" fill="#ea580c" />
                    <ellipse cx="-4" cy="2" rx="12" ry="16" fill="#f97316" />
                    <ellipse cx="3" cy="1" rx="10" ry="15" fill="#f59e0b" />
                    <ellipse cx="0" cy="0" rx="7" ry="11" fill="#fef08a" />
                    <circle cx="0" cy="-2" r="4" fill="#ffffff" />
                </g>
                {/* Floating Fire Embers */}
                <circle cx="48" cy="60" r="1.5" fill="#fde047" className="svg-mana-mote" />
                <circle cx="62" cy="52" r="1.2" fill="#f97316" className="svg-mana-mote" style={{ animationDelay: '0.6s' }} />
                {/* Crossed Swords on Chimney */}
                <g transform="translate(55, -25)">
                    <line x1="-18" y1="-18" x2="18" y2="18" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="18" y1="-18" x2="-18" y2="18" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="6" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                </g>
            </g>

            {/* ── 5. Wall Banners & Torches ── */}
            {/* Left Tapestry */}
            <g transform="translate(68, 35)">
                <rect x="0" y="0" width="34" height="85" fill={u('tapestryRed')} />
                <polygon points="0,85 17,100 34,85" fill={u('tapestryRed')} />
                <rect x="-3" y="-2" width="40" height="4" fill="#d97706" />
                <polygon points="17,30 24,46 10,46" fill="#fef08a" />
                <circle cx="17,42" r="4.5" fill="#d97706" />
            </g>
            {/* Center-Right Tapestry */}
            <g transform="translate(335, 35)">
                <rect x="0" y="0" width="34" height="85" fill={u('tapestryBlue')} />
                <polygon points="0,85 17,100 34,85" fill={u('tapestryBlue')} />
                <rect x="-3" y="-2" width="40" height="4" fill="#d97706" />
                <polygon points="17,28 25,40 17,52 9,40" fill="#38bdf8" />
            </g>

            {/* Wall Sconce Torches */}
            <g transform="translate(32, 105)">
                <rect x="3" y="10" width="4" height="14" fill="#475569" />
                <polygon points="0,10 10,10 8,6 2,6" fill="#64748b" />
                <g className="svg-brazier-fire">
                    <ellipse cx="5" cy="2" rx="4.5" ry="7" fill="#ea580c" />
                    <ellipse cx="5" cy="1" rx="3" ry="5" fill="#f59e0b" />
                    <circle cx="5" cy="0" r="1.5" fill="#fef08a" />
                </g>
            </g>
            <g transform="translate(256, 105)">
                <rect x="3" y="10" width="4" height="14" fill="#475569" />
                <polygon points="0,10 10,10 8,6 2,6" fill="#64748b" />
                <g className="svg-brazier-fire">
                    <ellipse cx="5" cy="2" rx="4.5" ry="7" fill="#ea580c" />
                    <ellipse cx="5" cy="1" rx="3" ry="5" fill="#f59e0b" />
                    <circle cx="5" cy="0" r="1.5" fill="#fef08a" />
                </g>
            </g>

            {/* ── 6. Chandelier Hanging from High Vault ── */}
            <g transform="translate(195, 0)">
                <line x1="0" y1="0" x2="0" y2="38" stroke="#475569" strokeWidth="1.5" />
                <ellipse cx="0" cy="38" rx="34" ry="6" stroke="#64748b" strokeWidth="2" fill="none" />
                {/* Candles on Chandelier */}
                {[-24, -8, 8, 24].map((cx, idx) => (
                    <g key={idx} transform={`translate(${cx}, 34)`}>
                        <rect x="-2" y="0" width="4" height="6" fill="#f1f5f9" />
                        <g className="svg-brazier-fire">
                            <ellipse cx="0" cy="-3" rx="2" ry="3.5" fill="#f59e0b" />
                            <circle cx="0" cy="-3.5" r="1" fill="#fef08a" />
                        </g>
                    </g>
                ))}
            </g>

            {/* ── 7. Banquet Oak Table & Stools Background ── */}
            <rect x="95" y="205" width="230" height="8" fill="#38200d" />
            <rect x="105" y="213" width="6" height="20" fill="#291507" />
            <rect x="310" y="213" width="6" height="20" fill="#291507" />

            {/* ── 8. Pixel Characters Interacting at the Table ── */}

            {/* Character 1: Knight / Warrior (Standing proud, raising tankard) */}
            <g transform="translate(118, 145)">
                <g className="svg-character-bob-1">
                    {/* Blue Cape */}
                    <polygon points="12,30 4,70 24,70 18,30" fill="#1e40af" />
                    {/* Steel Plate Armor Legs */}
                    <rect x="8" y="62" width="6" height="22" fill="#64748b" />
                    <rect x="16" y="62" width="6" height="22" fill="#475569" />
                    <rect x="6" y="80" width="8" height="6" fill="#334155" />
                    <rect x="16" y="80" width="8" height="6" fill="#334155" />
                    {/* Chestplate */}
                    <rect x="7" y="32" width="16" height="32" rx="3" fill="#94a3b8" />
                    <polygon points="15,34 11,46 19,46" fill="#cbd5e1" />
                    <rect x="9" y="52" width="12" height="4" fill="#d97706" />
                    {/* Helmet / Head */}
                    <rect x="7" y="14" width="16" height="18" rx="4" fill="#cbd5e1" />
                    {/* Helmet Visor Slit */}
                    <rect x="9" y="22" width="12" height="3" fill="#0f172a" />
                    {/* Helmet Plume (Golden feather) */}
                    <polygon points="15,14 15,4 19,10" fill="#f59e0b" />
                    {/* Right Arm: Raising Wooden Tankard */}
                    <polygon points="21,34 32,24 35,28 23,38" fill="#64748b" />
                    {/* Tankard with frothy foam */}
                    <rect x="31" y="18" width="8" height="11" fill="#78350f" rx="1" />
                    <rect x="30" y="16" width="10" height="3" fill="#fef08a" rx="1.5" />
                    {/* Left Arm: Resting on hip */}
                    <polygon points="7,36 1,44 5,47 10,40" fill="#64748b" />

                    {/* Speech Bubble: Knight */}
                    <g transform="translate(18, -20)" className="svg-window-glow">
                        <rect x="0" y="0" width="80" height="22" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                        <polygon points="8,22 14,22 10,27" fill="#0f172a" />
                        <text x="40" y="15" fill="#f1f5f9" fontSize="8" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                            GG WP! ⚔️
                        </text>
                    </g>
                </g>
            </g>

            {/* Character 2: Mage / Sorceress (Seated center, casting glowing mana spark) */}
            <g transform="translate(192, 150)">
                <g className="svg-character-bob-2">
                    {/* Mage Robe Body */}
                    <polygon points="8,32 0,76 28,76 20,32" fill="#6b21a8" />
                    <polygon points="10,32 14,76 18,32" fill="#581c87" />
                    {/* Gold Belt */}
                    <rect x="7" y="50" width="14" height="3" fill="#fbbf24" />
                    {/* Head / Face */}
                    <circle cx="14" cy="24" r="7" fill="#fed7aa" />
                    <circle cx="12" cy="24" r="1" fill="#0f172a" />
                    <circle cx="16" cy="24" r="1" fill="#0f172a" />
                    {/* Wizard Hat */}
                    <ellipse cx="14" cy="20" rx="14" ry="4" fill="#581c87" />
                    <polygon points="6,20 22,20 18,4 12,2" fill="#7e22ce" />
                    <rect x="10" y="18" width="8" height="2" fill="#fbbf24" />
                    {/* Mage Staff with Glowing Sapphire Core */}
                    <line x1="28" y1="10" x2="28" y2="76" stroke="#78350f" strokeWidth="2.5" />
                    <circle cx="28" cy="8" r="6" fill="#38bdf8" className="svg-crystal-core" />
                    <circle cx="28" cy="8" r="3" fill="#ffffff" />
                    {/* Sparkles around staff head */}
                    <polygon points="28,0 29.5,3 32,4 29.5,5 28,8 26.5,5 24,4 26.5,3" fill="#fef08a" className="svg-rune-ring" />

                    {/* Speech Bubble: Mage */}
                    <g transform="translate(24, -22)" className="svg-window-glow" style={{ animationDelay: '1.2s' }}>
                        <rect x="0" y="0" width="105" height="22" rx="6" fill="#0f172a" stroke="#c084fc" strokeWidth="1.5" />
                        <polygon points="12,22 18,22 14,27" fill="#0f172a" />
                        <text x="52" y="15" fill="#f3e8ff" fontSize="7" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                            Ada tips quest? 📜
                        </text>
                    </g>
                </g>
            </g>

            {/* Character 3: Rogue / Ranger (Sitting by the table, tossing a coin) */}
            <g transform="translate(276, 158)">
                <g className="svg-character-bob-3">
                    {/* Tunic & Cloak */}
                    <polygon points="10,26 2,68 22,68 16,26" fill="#14532d" />
                    {/* Leather Vest */}
                    <rect x="7" y="28" width="12" height="18" fill="#78350f" rx="2" />
                    {/* Archer Hood */}
                    <polygon points="4,24 20,24 16,10 8,10" fill="#166534" />
                    {/* Face in shadow with glowing eyes */}
                    <rect x="8" y="16" width="8" height="6" fill="#14532d" />
                    <circle cx="10" cy="18" r="0.9" fill="#86efac" />
                    <circle cx="14" cy="18" r="0.9" fill="#86efac" />
                    {/* Golden Coin Tossing upwards */}
                    <g transform="translate(22, 10)">
                        <g className="svg-mana-mote">
                            <circle cx="0" cy="0" r="2.2" fill="#fde047" stroke="#ca8a04" strokeWidth="0.5" />
                        </g>
                    </g>

                    {/* Speech Bubble: Rogue */}
                    <g transform="translate(16, -18)" className="svg-window-glow" style={{ animationDelay: '2s' }}>
                        <rect x="0" y="0" width="76" height="20" rx="6" fill="#0f172a" stroke="#4ade80" strokeWidth="1.5" />
                        <polygon points="8,20 14,20 10,25" fill="#0f172a" />
                        <text x="38" y="14" fill="#dcfce7" fontSize="7" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                            Raid gas! 🏹
                        </text>
                    </g>
                </g>
            </g>

            {/* Heavy Oak Feast Table (Front Layer over character lower bodies) */}
            <g transform="translate(85, 222)">
                {/* Table Top Plank */}
                <rect x="0" y="0" width="250" height="14" rx="2" fill={u('oakWood')} stroke="#1f1105" strokeWidth="1" />
                {/* Table Legs */}
                <rect x="15" y="14" width="10" height="42" fill="#291507" />
                <rect x="225" y="14" width="10" height="42" fill="#291507" />
                <line x1="20" y1="36" x2="230" y2="36" stroke="#381d09" strokeWidth="4" />

                {/* Items on the Table */}
                {/* Rolled Out World Map Scroll */}
                <polygon points="35,3 105,2 100,10 32,10" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                <path d="M 45 5 Q 65 8 85 4" stroke="#92400e" strokeWidth="0.8" fill="none" />
                <circle cx="70" cy="6" r="1.5" fill="#ef4444" />
                {/* Health & Mana Potions */}
                <g transform="translate(118, -4)">
                    {/* Red Health Potion */}
                    <path d="M 4 2 L 6 2 L 6 4 L 8 8 L 2 8 L 4 4 Z" fill="#ef4444" />
                    <rect x="4" y="0" width="2" height="2" fill="#78350f" />
                </g>
                <g transform="translate(128, -4)">
                    {/* Blue Mana Potion */}
                    <path d="M 4 2 L 6 2 L 6 4 L 8 8 L 2 8 L 4 4 Z" fill="#38bdf8" />
                    <rect x="4" y="0" width="2" height="2" fill="#78350f" />
                </g>
                {/* Candle Lantern on table */}
                <g transform="translate(150, -8)">
                    <rect x="0" y="4" width="8" height="10" fill="#0f172a" stroke="#d97706" strokeWidth="0.8" />
                    <circle cx="4" cy="9" r="2.5" fill="#fef08a" className="svg-window-glow" />
                </g>
                {/* Plate with Roasted Turkey / Apple */}
                <ellipse cx="185" cy="5" rx="10" ry="3" fill="#cbd5e1" />
                <ellipse cx="185" cy="3" rx="6" ry="3" fill="#92400e" />
                {/* Mugs */}
                <rect x="210" y="0" width="7" height="9" fill="#78350f" rx="1" />
                <rect x="209" y="-2" width="9" height="3" fill="#fef08a" rx="1" />
            </g>

            {/* Front Stool (Right) */}
            <rect x="350" y="240" width="28" height="8" rx="2" fill="#42260e" />
            <rect x="354" y="248" width="5" height="24" fill="#291507" />
            <rect x="370" y="248" width="5" height="24" fill="#291507" />

            {/* ── 9. Floating Hall Stardust Motes ── */}
            <g style={{ pointerEvents: 'none' }}>
                <circle cx="90" cy="180" r="1.4" fill="#fef08a" className="svg-mana-mote" />
                <circle cx="240" cy="120" r="1.8" fill="#67e8f9" className="svg-mana-mote" style={{ animationDelay: '0.8s' }} />
                <circle cx="340" cy="190" r="1.5" fill="#c084fc" className="svg-mana-mote" style={{ animationDelay: '1.6s' }} />
                <circle cx="410" cy="140" r="1.6" fill="#fde047" className="svg-mana-mote" style={{ animationDelay: '2.4s' }} />
                <circle cx="500" cy="210" r="1.4" fill="#86efac" className="svg-mana-mote" style={{ animationDelay: '1.2s' }} />
            </g>
        </svg>
    );
}
