---
name: Pixel Realm Odyssey
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#56e5a9'
  on-tertiary: '#003824'
  tertiary-container: '#30c88f'
  on-tertiary-container: '#004e34'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
  surface-deep: '#070B14'
  surface-canvas: '#0B0F17'
  surface-card: '#131C31'
  surface-card-elevated: '#1A253E'
  border-pixel: '#222E46'
  border-active: '#38BDF8'
  text-primary: '#F8FAFC'
  text-secondary: '#E2E8F0'
  text-muted: '#64748B'
  mana-cyan: '#38BDF8'
  amber-glow: '#FBBF24'
  rank-gold: '#F59E0B'
  rank-silver: '#94A3B8'
  rank-bronze: '#CD7F32'
  quest-success: '#10B981'
  quest-danger: '#EF4444'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.04em
  headline-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
    letterSpacing: 0.03em
  title-quest:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-regular:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-compact:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  stat-metric:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '800'
    lineHeight: 24px
  label-badge:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-micro:
    fontFamily: Outfit
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system establishes an immersive gamified educational interface designed for mobile-first engagement. The product transforms everyday classroom rigor into a legendary role-playing quest. The audience consists of middle, high school, and vocational students who crave immediate feedback loops, status progression, and autonomy, balanced with teachers seeking streamlined pedagogical monitoring.

The design movement combines **Retro 8-bit / Pixel Fantasy** with **High-Contrast Dark SaaS**. It borrows the nostalgic tactile excitement of classic fantasy RPGs—illustrated quest scrolls, glowing relic borders, XP progress bars, and tiered rank medallions—and grounds them within high-performance mobile UI ergonomics. 

The emotional tone balances high-stakes adventurous play (gaining XP, vanquishing homework dungeons, unlocking guild tiers) with crystal-clear legibility and rapid task completion. Surfaces feature midnight obsidian and deep indigo-slate depths, punctuated by warm amber gold and electric mana cyan.

## Colors

The palette leverages a dark-mode-native foundation to reduce visual fatigue while allowing game-inspired chromatic accents to stand out vividly.

- **Primary (`#F59E0B`)**: Radiant Quest Amber. Used for major calls-to-action ("Enter The Realm", claim rewards), milestone badges, and Gold tier #1 podium status.
- **Secondary (`#3B82F6`)**: Arcane Mana Blue. Used for core interactive utility, primary filters, active segment controls, and active quest initiation buttons.
- **Tertiary (`#10B981`)**: Alchemy Emerald. Reserved for task completion, verified badge indicators, and positive streak affirmations.
- **Neutral (`#0B0F17`)**: Midnight Realm. An ultra-deep blue-black providing the infinite canvas backdrop.

### Named Specialty Roles
- **Surface Elevation Hierarchy**: `#070B14` (Deepest backdrop) → `#0B0F17` (Canvas base) → `#131C31` (Interactive card containers) → `#1A253E` (Modals and active hovered tiles).
- **Gamified Rank Tiers**: 
  - Rank 1: `#F59E0B` (Aura Gold)
  - Rank 2: `#94A3B8` (Polished Silver)
  - Rank 3: `#CD7F32` (Forged Bronze)
- **Status Luminescence**: `#38BDF8` acts as an electric mana glow on active focus rings and level-up progress indicators.

## Typography

The type strategy unifies functional mobile scannability with thematic 8-bit character. 

- **Primary Mobile Stack**: **Outfit** serves as the system workhorse across headings, body, and labels, delivering high geometric legibility, bold modern headers, and crisp counter-spaces on OLED mobile displays.
- **Pixel Display Elements**: When native custom font bundling allows (e.g. `Press Start 2P`), retro pixel typography should be selectively applied to high-impact anchor points: screen titles (`display-hero`), stage banner announcements, and rank numbers (`#1`, `#2`, `#3`). Because retro fonts have wide tracking and low density, they must never be applied to paragraphs or long task descriptions.
- **Micro-Copy & Badges**: All meta tags (`EXP`, `ACTIVE QUESTS`, `IDENTIFIER`) rely on uppercase, bold weights with generous letter-spacing (`0.08em` to `0.1em`) to mimic vintage terminal and cartridge HUD elements.

## Layout & Spacing

This design system targets high-density mobile interfaces with structured vertical stacks and fluid 4-column layouts.

- **Vertical Rhythm**: Layout components adhere to a 4px/8px modular scale. Compact 4px gaps (`space-xs`) group tightly coupled label-value pairs (such as `LVL` chips next to player names). Standard 12px (`space-md`) and 16px (`space-lg`) increments structure list cards and quest modules.
- **Screen Margins**: Mobile canvases utilize `16px` (`margin`) outer horizontal padding to optimize thumb real estate, scaling up to `24px` on tablets.
- **HUD Grid**: The primary dashboard features a 2x2 or 4x1 micro-stat matrix (EXP, Completed Quests, Daily Streak, Rank) spaced with consistent `gutter-sm` (12px) channels to keep information dense without overwhelming small screens.

## Elevation & Depth

Rather than conventional soft drop shadows, elevation in this design system utilizes **Chiseled RPG Depth**—a combination of inset highlights, pixel-stroke outlines, and atmospheric ambient glows.

1. **Base Flat Surfaces (Elevation 0)**: Unbordered, sitting directly on `#0B0F17`.
2. **Quest Cards & Stat Tiles (Elevation 1)**: Slate navy surface (`#131C31`) framed with a crisp, high-definition 1px boundary (`#222E46`). No diffuse drop shadow; structural borders establish boundaries.
3. **Floating Overlays & Modals (Elevation 2)**: Elevated slate surface (`#1A253E`) with a 1.5px border tinted to Mana Cyan (`#38BDF8` at 40% opacity). Backed by a dark backdrop filter blur (8px–12px) and a tight 4px vertical offset shadow (`rgba(0, 0, 0, 0.6)`).
4. **Hero Interactions & Gold Buttons (Elevation 3 / Active Glow)**: Radiant buttons use layered beveling: a top border highlight (1px inset `rgba(255, 255, 255, 0.35)`), a bottom edge offset shadow (`#B45309` at 2px), and a warm external amber aura (`box-shadow: 0 0 16px rgba(245, 158, 11, 0.3)`).

## Shapes

The design system adopts a **hybrid beveled/rounded silhouette** (`roundedness: 2` / 8px default radii). While strict 8-bit aesthetics rely on 90-degree stair-stepped corners, modern mobile ergonomics require touch-friendly softened corners to maintain thumb comfort and UI fluidity.

- **Standard Containers & Cards**: Fixed at 12px–16px border-radius (`rounded-lg`), pairing a friendly modern perimeter with sharp 1px internal divider rules.
- **Badges, Chips, and Guild Tags**: Compact 4px–6px radii (`rounded-sm`), evoking physical enamel inventory tokens.
- **Pill Exceptions**: Action pill tabs (Weekly vs. Overall toggles) adopt fully rounded contours (`9999px`) to immediately communicate segmented control behavior.
- **Avatar Relics**: User avatars are framed in rounded squares (`rounded-xl` / 16px) with an integrated bottom-right overlapping `LVL` badge.

## Components

### Action Buttons
- **Primary "Realm" Button**: Gradient fill transitioning from `#F59E0B` to `#D97706`. High-contrast dark text (`#0F172A`) or pure white with dark stroke. 48px standard touch height, 12px border radius. Accompanied by trailing pixel RPG iconography (e.g., dual crossed swords `⚔`).
- **Mana Secondary Button**: Solid Arcane Blue (`#2563EB` to `#3B82F6`), crisp white text, 40px height for secondary interactions (such as "KERJAKAN" / Accept Quest).
- **Ghost Action**: Transparent fill, 1px `#222E46` outline, hover/tap state transitions border to `#38BDF8`.

### Quest Cards & Notice Board
- Constructed using `#131C31` containers with 12px padding.
- Top meta row: Difficulty tag (`EASY`, `MEDIUM`, `BOSS RAID`) on the left, Reward chip (`+40 EXP`, `#FBBF24`) on the right.
- Middle body: Truncated two-line quest description in `#E2E8F0`.
- Bottom utility row: Category pill tag (`Social`, `Math`, `Science`) alongside an active action button.

### Progress & EXP Gauges
- Track background: Recessed trough `#070B14` with a 1px border (`#222E46`), height 8px–10px, fully rounded.
- Fill indicator: Dynamic gradient from `#38BDF8` (start) to `#3B82F6` (end), capped with an animated pulse sheen. A micro-label above denotes `EXP (87%)` aligned left, with numerical counters `130 / 150` aligned right.

### Badges & Chips
- **Level Badges**: High-contrast blue-tinted rectangle positioned across the lower border of player portraits displaying `LVL X`.
- **Rank Tier Badges**: 
  - Rank 1: Crown icon, Amber fill (`#F59E0B`), Gold border glow.
  - Rank 2: Silver fill (`#94A3B8`), subtle slate outline.
  - Rank 3: Bronze fill (`#CD7F32`), burnished copper outline.

### Input Fields & Access Keys
- Background `#131C31` inset with a 1px `#222E46` border, expanding to a 1.5px `#38BDF8` ring upon focus.
- Prefix icons anchored to the left in muted gold or cyan (e.g., Key icon `🔑` for Access Code, ID Card icon for NISN/Email).
- Placeholder text in `#64748B`.

### Leaderboard Podium
- Three-column stepped pedestal structure for Top 3 heroes. Center column (Rank 1) elevated highest, flanked by Rank 2 (left) and Rank 3 (right).
- Features floating circular or soft-square profile portraits topped with rank medallions, showing real-time weekly accumulated points below.