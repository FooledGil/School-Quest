import React from 'react';

/**
 * GuildHallScene — Pure SVG illustration of an Adventurers Guildhall / Quest Board Room.
 * Features a massive wooden Bounty/Quest Notice Board with 6 pinned scrolls (S-Rank, Daily, Wanted, Team Guild),
 * Guild Reception Counter, Guild Clerk NPC with Monocle, Adventurer inspecting missions, weapon rack,
 * potion barrels, and swaying warm lantern.
 */
export default function GuildHallScene({ idPrefix = 'guild', className = 'w-full h-full block' }) {
    const p = (id) => `${idPrefix}-${id}`;
    const u = (id) => `url(#${p(id)})`;

    return (
        <svg
            viewBox="0 0 600 320"
            preserveAspectRatio="xMidYMid meet"
            className={className}
            aria-label="Adventurers Guildhall Quest Board illustration"
        >
            <defs>
                {/* Wood Wall Gradient */}
                <linearGradient id={p('woodWall')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2b1a0d" />
                    <stop offset="45%" stopColor="#201308" />
                    <stop offset="100%" stopColor="#140b04" />
                </linearGradient>

                {/* Floor Timber Gradient */}
                <linearGradient id={p('woodFloor')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e1006" />
                    <stop offset="100%" stopColor="#0d0703" />
                </linearGradient>

                {/* Notice Board Cork/Wood Gradient */}
                <linearGradient id={p('boardWood')} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78471c" />
                    <stop offset="50%" stopColor="#573111" />
                    <stop offset="100%" stopColor="#3d2109" />
                </linearGradient>

                {/* Parchment Paper Gradient */}
                <linearGradient id={p('parchmentPaper')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="60%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>

                {/* Guild Counter Oak Gradient */}
                <linearGradient id={p('counterOak')} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#451a03" />
                    <stop offset="40%" stopColor="#2e1002" />
                    <stop offset="100%" stopColor="#1c0901" />
                </linearGradient>

                {/* Sunlight Window Cone */}
                <linearGradient id={p('sunBeam')} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#140b04" stopOpacity="0" />
                </linearGradient>

                {/* Lantern Warm Glow */}
                <radialGradient id={p('lanternGlow')} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#d97706" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#140b04" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* ── 1. Guildhall Back Wall & Floor ── */}
            <rect width="600" height="230" fill={u('woodWall')} />
            {/* Wooden Wall Planks */}
            <line x1="0" y1="45" x2="600" y2="45" stroke="#180e05" strokeWidth="1.5" />
            <line x1="0" y1="100" x2="600" y2="100" stroke="#180e05" strokeWidth="1.5" />
            <line x1="0" y1="155" x2="600" y2="155" stroke="#180e05" strokeWidth="1.5" />
            <line x1="0" y1="210" x2="600" y2="210" stroke="#180e05" strokeWidth="1.5" />

            {/* Plank Vertical Seams */}
            <line x1="80" y1="0" x2="80" y2="45" stroke="#180e05" strokeWidth="1" />
            <line x1="220" y1="45" x2="220" y2="100" stroke="#180e05" strokeWidth="1" />
            <line x1="420" y1="0" x2="420" y2="45" stroke="#180e05" strokeWidth="1" />
            <line x1="510" y1="100" x2="510" y2="155" stroke="#180e05" strokeWidth="1" />

            {/* Guild Floor Wooden Boards */}
            <polygon points="0,230 600,230 600,320 0,320" fill={u('woodFloor')} />
            <line x1="0" y1="230" x2="600" y2="230" stroke="#3b1e0a" strokeWidth="3" />
            {/* Floor perspective planks */}
            <line x1="90" y1="230" x2="50" y2="320" stroke="#190d04" strokeWidth="1.5" />
            <line x1="200" y1="230" x2="170" y2="320" stroke="#190d04" strokeWidth="1.5" />
            <line x1="330" y1="230" x2="320" y2="320" stroke="#190d04" strokeWidth="1.5" />
            <line x1="450" y1="230" x2="470" y2="320" stroke="#190d04" strokeWidth="1.5" />

            {/* ── 2. High Guild Window with Sunlight Beam ── */}
            <g transform="translate(35, 15)">
                <rect x="0" y="0" width="42" height="66" rx="18" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <rect x="4" y="4" width="34" height="58" rx="16" fill="#38bdf8" opacity="0.65" className="svg-window-glow" />
                <line x1="21" y1="4" x2="21" y2="62" stroke="#334155" strokeWidth="2" />
                <line x1="4" y1="33" x2="38" y2="33" stroke="#334155" strokeWidth="2" />
                {/* Sunlight Cone projecting onto floor */}
                <polygon points="21,28 170,230 45,230" fill={u('sunBeam')} style={{ pointerEvents: 'none' }} />
            </g>

            {/* ── 3. Guild Coat of Arms & Banners ── */}
            <g transform="translate(290, 16)">
                {/* Guild Heraldic Shield */}
                <path d="M 0 0 L 32 0 Q 32 30 16 46 Q 0 30 0 0 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="2" />
                <path d="M 4 4 L 28 4 Q 28 27 16 40 Q 4 27 4 4 Z" fill="#1e3a8a" />
                {/* Crossed Swords on Shield */}
                <line x1="6" y1="8" x2="26" y2="28" stroke="#f1f5f9" strokeWidth="2" />
                <line x1="26" y1="8" x2="6" y2="28" stroke="#f1f5f9" strokeWidth="2" />
                <circle cx="16" cy="18" r="4" fill="#fbbf24" />
                {/* Guild Header Ribbon */}
                <rect x="-30" y="-10" width="92" height="15" rx="3" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
                <text x="16" y="1" fill="#fef08a" fontSize="7" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                    QUEST GUILD
                </text>
            </g>

            {/* ── 4. Massive Central Quest Notice Board ── */}
            <g transform="translate(160, 44)">
                {/* Board Frame (Heavy Timber) */}
                <rect x="0" y="0" width="265" height="158" rx="6" fill="#2d1706" stroke="#160a02" strokeWidth="2.5" />
                {/* Cork / Wood Posting Area */}
                <rect x="10" y="10" width="245" height="138" rx="3" fill={u('boardWood')} />
                {/* Iron Corner Brackets */}
                <polygon points="0,0 22,0 0,22" fill="#475569" />
                <polygon points="265,0 243,0 265,22" fill="#475569" />
                <polygon points="0,158 22,158 0,136" fill="#475569" />
                <polygon points="265,158 243,158 265,136" fill="#475569" />
                {/* Board Stand Stilts */}
                <rect x="30" y="158" width="15" height="60" fill="#241205" />
                <rect x="220" y="158" width="15" height="60" fill="#241205" />

                {/* ── Pinned Quest Parchment Flyers (Statically Pinned to Cork Board) ── */}

                {/* Quest Flyer 1: Main S-Rank Quest (Top Left) */}
                <g transform="translate(18, 16) rotate(-1)">
                    <rect x="0" y="0" width="66" height="54" rx="2" fill={u('parchmentPaper')} stroke="#b45309" strokeWidth="1" />
                    {/* Red Wax Seal Pin */}
                    <circle cx="33" cy="4" r="3.5" fill="#dc2626" />
                    <circle cx="33" cy="4" r="1.5" fill="#7f1d1d" />
                    {/* Flyer Title & Lines */}
                    <rect x="8" y="12" width="50" height="4.5" fill="#991b1b" rx="1" />
                    <line x1="8" y1="23" x2="58" y2="23" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="8" y1="29" x2="52" y2="29" stroke="#78350f" strokeWidth="1.5" />
                    <line x1="8" y1="35" x2="44" y2="35" stroke="#78350f" strokeWidth="1.5" />
                    {/* Stamp: S-RANK */}
                    <rect x="30" y="41" width="30" height="9" rx="1.5" fill="#ef4444" />
                    <text x="45" y="48" fill="#ffffff" fontSize="5.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        S-RANK
                    </text>
                </g>

                {/* Quest Flyer 2: Daily School Quest (Center Top) */}
                <g transform="translate(94, 14) rotate(0.8)">
                    <rect x="0" y="0" width="70" height="52" rx="2" fill="#fffbeb" stroke="#d97706" strokeWidth="1" />
                    {/* Brass Thumb Tack */}
                    <circle cx="35" cy="3.5" r="2.8" fill="#f59e0b" />
                    {/* Quest Badge: DAILY */}
                    <rect x="12" y="9" width="46" height="5.5" fill="#3b82f6" rx="1" />
                    <text x="35" y="13.5" fill="#ffffff" fontSize="5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        DAILY EXP
                    </text>
                    <line x1="8" y1="20" x2="62" y2="20" stroke="#92400e" strokeWidth="1.2" />
                    <line x1="8" y1="26" x2="56" y2="26" stroke="#92400e" strokeWidth="1.2" />
                    <line x1="8" y1="32" x2="50" y2="32" stroke="#92400e" strokeWidth="1.2" />
                    {/* Reward Gold Star */}
                    <circle cx="56" cy="42" r="4.5" fill="#fbbf24" />
                    <text x="56" y="44.5" fill="#78350f" fontSize="5.5" textAnchor="middle">★</text>
                </g>

                {/* Quest Flyer 3: Wanted Monster / Math Boss (Top Right) */}
                <g transform="translate(174, 16) rotate(-1.5)">
                    <rect x="0" y="0" width="62" height="56" rx="2" fill={u('parchmentPaper')} stroke="#92400e" strokeWidth="1" />
                    <circle cx="31" cy="3.5" r="3" fill="#dc2626" />
                    <rect x="6" y="9" width="50" height="4.5" fill="#1e293b" rx="1" />
                    <text x="31" y="13" fill="#fef08a" fontSize="4.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        WANTED
                    </text>
                    {/* Boss Silhouette portrait */}
                    <rect x="18" y="17" width="26" height="21" fill="#334155" rx="2" />
                    <circle cx="31" cy="25" r="5" fill="#0f172a" />
                    <polygon points="31,29 23,37 39,37" fill="#0f172a" />
                    {/* Reward Amount */}
                    <rect x="9" y="42" width="44" height="8" rx="1.5" fill="#d97706" />
                    <text x="31" y="48" fill="#ffffff" fontSize="4.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        +150 EXP
                    </text>
                </g>

                {/* Quest Flyer 4: Additional Quest (Bottom Left) */}
                <g transform="translate(20, 78) rotate(1)">
                    <rect x="0" y="0" width="70" height="54" rx="2" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1" />
                    <circle cx="35" cy="3.5" r="2.8" fill="#16a34a" />
                    <rect x="10" y="9.5" width="50" height="5" fill="#15803d" rx="1" />
                    <text x="35" y="13.5" fill="#ffffff" fontSize="4.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        EXTRA QUEST
                    </text>
                    <line x1="8" y1="21" x2="62" y2="21" stroke="#854d0e" strokeWidth="1.2" />
                    <line x1="8" y1="27" x2="56" y2="27" stroke="#854d0e" strokeWidth="1.2" />
                    <line x1="8" y1="33" x2="48" y2="33" stroke="#854d0e" strokeWidth="1.2" />
                    {/* Completed / Open Stamp */}
                    <rect x="30" y="41" width="34" height="8" rx="1.5" fill="#16a34a" />
                    <text x="47" y="47" fill="#ffffff" fontSize="4.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        OPEN
                    </text>
                </g>

                {/* Quest Flyer 5: Guild Collaboration (Bottom Center) */}
                <g transform="translate(100, 76) rotate(-0.8)">
                    <rect x="0" y="0" width="72" height="56" rx="2" fill={u('parchmentPaper')} stroke="#d97706" strokeWidth="1" />
                    <circle cx="36" cy="3.5" r="3" fill="#2563eb" />
                    <rect x="12" y="9.5" width="48" height="5" fill="#1e40af" rx="1" />
                    <text x="36" y="13.5" fill="#ffffff" fontSize="4.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        TEAM GUILD
                    </text>
                    <line x1="8" y1="21" x2="64" y2="21" stroke="#78350f" strokeWidth="1.2" />
                    <line x1="8" y1="27" x2="58" y2="27" stroke="#78350f" strokeWidth="1.2" />
                    <line x1="8" y1="33" x2="50" y2="33" stroke="#78350f" strokeWidth="1.2" />
                    {/* Gold Coin Reward Icon */}
                    <circle cx="56" cy="46" r="5" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
                    <text x="56" y="49" fill="#78350f" fontSize="5.5" fontWeight="bold" textAnchor="middle">$</text>
                </g>

                {/* Quest Flyer 6: Guild Announcement Memo (Bottom Right) */}
                <g transform="translate(182, 82) rotate(1.5)">
                    <rect x="0" y="0" width="54" height="50" rx="2" fill="#fff7ed" stroke="#ea580c" strokeWidth="1" />
                    <circle cx="27" cy="3" r="2.5" fill="#ea580c" />
                    <rect x="6" y="9" width="42" height="4" fill="#c2410c" rx="1" />
                    <text x="27" y="12.5" fill="#ffedd5" fontSize="4" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                        PWK NOTICE
                    </text>
                    <line x1="6" y1="18" x2="48" y2="18" stroke="#9a3412" strokeWidth="1.2" />
                    <line x1="6" y1="24" x2="44" y2="24" stroke="#9a3412" strokeWidth="1.2" />
                    <line x1="6" y1="30" x2="40" y2="30" stroke="#9a3412" strokeWidth="1.2" />
                    <circle cx="38" cy="40" r="4.5" fill="#f97316" />
                    <text x="38" y="42.5" fill="#ffffff" fontSize="4.5" textAnchor="middle">✓</text>
                </g>

                {/* Glowing Quest Notification Star (!) hovering over board */}
                <g transform="translate(132, -14)" className="svg-crystal-core">
                    <circle cx="0" cy="0" r="14" fill="#fbbf24" opacity="0.35" />
                    <circle cx="0" cy="0" r="9" fill="#fef08a" />
                    <text x="0" y="5" fill="#78350f" fontSize="11" fontFamily="'Press Start 2P', monospace" fontWeight="bold" textAnchor="middle">
                        !
                    </text>
                </g>
            </g>

            {/* ── 5. Hanging Guild Lantern with Swaying Warm Light ── */}
            <g transform="translate(450, 0)">
                <line x1="0" y1="0" x2="0" y2="36" stroke="#475569" strokeWidth="1.5" />
                {/* Lantern Housing */}
                <rect x="-10" y="36" width="20" height="26" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                {/* Glass Chamber with Flame */}
                <rect x="-7" y="40" width="14" height="18" fill="#fef08a" opacity="0.85" className="svg-window-glow" />
                <g className="svg-brazier-fire">
                    <ellipse cx="0" cy="49" rx="4" ry="6" fill="#f59e0b" />
                    <circle cx="0" cy="48" r="2" fill="#ffffff" />
                </g>
                {/* Radial Glow Cast */}
                <circle cx="0" cy="50" r="45" fill={u('lanternGlow')} style={{ pointerEvents: 'none' }} />
            </g>

            {/* ── 6. Adventurer Hero (Inspecting the Board, Center-Right) ── */}
            {/* Positioned at x=440, y=140 on the floor (230px baseline) with inner idle bob */}
            <g transform="translate(440, 140)">
                <g className="svg-character-bob-1">
                    {/* Backpack & Bedroll on back */}
                    <rect x="-8" y="32" width="12" height="20" rx="3" fill="#78350f" />
                    <ellipse cx="-2" cy="30" rx="7" ry="3.5" fill="#15803d" />
                    {/* Legs in leather boots */}
                    <rect x="4" y="66" width="7" height="24" fill="#334155" />
                    <rect x="15" y="66" width="7" height="24" fill="#1e293b" />
                    <rect x="2" y="84" width="9" height="6" fill="#78350f" />
                    <rect x="15" y="84" width="9" height="6" fill="#78350f" />
                    {/* Tunic & Armor Torso */}
                    <rect x="2" y="34" width="22" height="34" rx="3" fill="#2563eb" />
                    <rect x="5" y="36" width="16" height="16" fill="#60a5fa" rx="2" />
                    <rect x="4" y="54" width="18" height="4" fill="#d97706" />
                    {/* Belt Dagger */}
                    <line x1="22" y1="56" x2="28" y2="64" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="22" cy="56" r="1.5" fill="#fbbf24" />
                    {/* Head & Adventurer Bandana / Hair */}
                    <circle cx="13" cy="24" r="9" fill="#fcd34d" />
                    <rect x="4" y="16" width="18" height="6" rx="2" fill="#dc2626" />
                    <circle cx="16" cy="24" r="1.2" fill="#0f172a" />
                    {/* Left Raised Arm (pointing at the quest notice board) */}
                    <polygon points="4,42 -12,26 -9,22 6,38" fill="#60a5fa" />
                    <circle cx="-11" cy="24" r="2.5" fill="#fed7aa" />

                    {/* Hero Speech Bubble */}
                    <g transform="translate(-30, -22)" className="svg-window-glow">
                        <rect x="0" y="0" width="86" height="20" rx="5" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
                        <polygon points="40,20 46,20 42,25" fill="#0f172a" />
                        <text x="43" y="14" fill="#fef08a" fontSize="6.5" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                            Ambil quest! ⚔️
                        </text>
                    </g>
                </g>
            </g>

            {/* ── 7. Guild Reception Counter & Clerk NPC (Left Side) ── */}
            <g transform="translate(15, 155)">
                {/* Guild Clerk NPC (Behind the desk, with inner idle bob) */}
                <g transform="translate(28, 0)">
                    <g className="svg-character-bob-2">
                        {/* Clerk Vest & White Shirt */}
                        <rect x="2" y="24" width="22" height="34" rx="3" fill="#f8fafc" />
                        <polygon points="6,26 13,44 20,26" fill="#7f1d1d" />
                        {/* Tie */}
                        <polygon points="12,30 14,30 15,42 13,44 11,42" fill="#fbbf24" />
                        {/* Head / Clerk with Monocle */}
                        <circle cx="13" cy="15" r="8" fill="#fed7aa" />
                        <rect x="5" y="8" width="16" height="6" rx="2" fill="#451a03" />
                        <circle cx="11" cy="15" r="1.2" fill="#0f172a" />
                        {/* Monocle Lens with chain */}
                        <circle cx="16" cy="15" r="3" stroke="#fbbf24" strokeWidth="0.9" fill="#e0f2fe" opacity="0.8" />
                        <path d="M 19 16 Q 22 22 20 26" stroke="#fbbf24" strokeWidth="0.6" fill="none" />

                        {/* Clerk Speech Bubble (Positioned rightwards so it won't clash with top badges) */}
                        <g transform="translate(24, -14)" className="svg-window-glow" style={{ animationDelay: '1.5s' }}>
                            <rect x="0" y="0" width="88" height="20" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                            <polygon points="4,16 0,22 10,20" fill="#0f172a" />
                            <text x="44" y="14" fill="#bae6fd" fontSize="6" fontFamily="'Press Start 2P', monospace" textAnchor="middle">
                                Pilih misimu! 📜
                            </text>
                        </g>
                    </g>
                </g>

                {/* Reception Counter Wooden Desk */}
                <g transform="translate(0, 52)">
                    {/* Desk Top */}
                    <rect x="0" y="0" width="135" height="12" rx="2" fill={u('counterOak')} stroke="#1a0901" strokeWidth="1" />
                    {/* Desk Front Panel */}
                    <rect x="4" y="12" width="127" height="42" fill="#2d1304" />
                    <rect x="10" y="18" width="115" height="30" rx="2" fill="#1e0c02" stroke="#451a03" strokeWidth="1" />

                    {/* Items on Counter */}
                    {/* Brass Service Bell */}
                    <ellipse cx="22" cy="-2" rx="6" ry="2" fill="#d97706" />
                    <circle cx="22" cy="-5" r="4" fill="#fbbf24" />
                    <rect x="21" y="-8" width="2" height="3" fill="#f59e0b" />
                    {/* Stacked Ledger Books */}
                    <rect x="40" y="-8" width="22" height="8" rx="1" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="0.5" />
                    <rect x="42" y="-13" width="20" height="5" rx="1" fill="#1e3a8a" />
                    {/* Inkpot and Feather Quill */}
                    <rect x="75" y="-5" width="7" height="5" rx="1" fill="#0f172a" />
                    <line x1="80" y1="-5" x2="88" y2="-16" stroke="#f1f5f9" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Rolled Certificate Scroll with ribbon */}
                    <rect x="98" y="-6" width="24" height="6" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" />
                    <rect x="108" y="-7" width="4" height="8" rx="1" fill="#dc2626" />
                </g>
            </g>

            {/* ── 8. Weapon Rack & Barrels (Right Side) ── */}
            <g transform="translate(515, 175)">
                {/* Wooden Weapon Rack Stand */}
                <rect x="0" y="0" width="8" height="65" fill="#3b1d08" />
                <rect x="46" y="0" width="8" height="65" fill="#3b1d08" />
                <rect x="0" y="20" width="54" height="5" fill="#542c0f" />
                <rect x="0" y="50" width="54" height="5" fill="#542c0f" />
                {/* Halberd / Spear */}
                <line x1="14" y1="-20" x2="14" y2="60" stroke="#78350f" strokeWidth="2.5" />
                <polygon points="14,-30 10,-20 18,-20" fill="#cbd5e1" />
                <polygon points="18,-20 25,-24 18,-16" fill="#94a3b8" />
                {/* Steel Broadsword */}
                <line x1="28" y1="-10" x2="28" y2="55" stroke="#cbd5e1" strokeWidth="3" />
                <line x1="22" y1="5" x2="34" y2="5" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                {/* Round Wooden Shield */}
                <circle cx="40" cy="28" r="13" fill="#78350f" stroke="#475569" strokeWidth="2.5" />
                <circle cx="40" cy="28" r="4" fill="#fbbf24" />

                {/* Wooden Potion Barrel (Far Right) */}
                <g transform="translate(56, 15)">
                    <ellipse cx="12" cy="0" rx="12" ry="4" fill="#451a03" />
                    <rect x="0" y="0" width="24" height="42" fill="#3b1d08" rx="2" />
                    <line x1="0" y1="8" x2="24" y2="8" stroke="#1f2937" strokeWidth="2" />
                    <line x1="0" y1="32" x2="24" y2="32" stroke="#1f2937" strokeWidth="2" />
                    {/* Glowing potion flask on barrel */}
                    <g transform="translate(8, -10)">
                        <circle cx="4" cy="5" r="4" fill="#38bdf8" className="svg-crystal-core" />
                        <rect x="3" y="-1" width="2" height="3" fill="#78350f" />
                    </g>
                </g>
            </g>

            {/* ── 9. Ambient Dust Motes & Magic Sparks ── */}
            <g style={{ pointerEvents: 'none' }}>
                <circle cx="110" cy="140" r="1.5" fill="#fef08a" className="svg-mana-mote" />
                <circle cx="160" cy="90" r="1.2" fill="#fde047" className="svg-mana-mote" style={{ animationDelay: '0.9s' }} />
                <circle cx="280" cy="110" r="1.6" fill="#67e8f9" className="svg-mana-mote" style={{ animationDelay: '1.8s' }} />
                <circle cx="340" cy="70" r="1.4" fill="#fef08a" className="svg-mana-mote" style={{ animationDelay: '2.7s' }} />
                <circle cx="460" cy="130" r="1.5" fill="#fbbf24" className="svg-mana-mote" style={{ animationDelay: '1.2s' }} />
            </g>
        </svg>
    );
}
