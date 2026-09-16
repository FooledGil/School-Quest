/**
 * Icon and Logo API Utility
 * Fetches vector SVG icons dynamically from the Iconify API and other icon APIs.
 */

/**
 * Generates an Iconify API SVG URL
 * @param {string} icon - e.g. 'solar:gamepad-bold-duotone', 'game-icons:crossed-swords', 'fluent-emoji-flat:trophy'
 * @param {string|null} color - hex color code (e.g. '#38bdf8')
 */
export function getIconApiUrl(icon, color = null) {
    if (!icon) return '';
    
    // If it's already an absolute HTTP/HTTPS URL, return it directly
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
        return icon;
    }

    const cleanIcon = icon.trim();
    let url = `https://api.iconify.design/${cleanIcon}.svg`;
    if (color) {
        url += `?color=${encodeURIComponent(color)}`;
    }
    return url;
}

/**
 * Dynamic App Logo loaded from API
 */
export function getAppLogoApiUrl(color = '#38bdf8') {
    return `https://api.iconify.design/solar:shield-star-bold-duotone.svg?color=${encodeURIComponent(color)}`;
}

/**
 * Common Icon API Presets for SchoolQuest
 */
export const ICON_API = {
    // App & Branding
    logo: 'solar:shield-star-bold-duotone',
    gameLogo: 'game-icons:shield-reflect',
    
    // Navigation & General
    dashboard: 'solar:widget-bold-duotone',
    quests: 'solar:checklist-minimalistic-bold-duotone',
    leaderboard: 'solar:cup-star-bold-duotone',
    profile: 'solar:user-bold-duotone',
    logout: 'solar:logout-2-bold-duotone',
    guide: 'solar:book-bookmark-bold-duotone',
    
    // Onboarding Guide Steps
    guideStep1: 'fluent-emoji-flat:video-game',
    guideStep2: 'fluent-emoji-flat:scroll',
    guideStep3: 'fluent-emoji-flat:broom',
    guideStep4: 'fluent-emoji-flat:trophy',
    guideStep5: 'fluent-emoji-flat:robot',
    
    // Guide Highlights
    questTarget: 'fluent-emoji-flat:bullseye',
    levelUp: 'fluent-emoji-flat:chart-increasing',
    medal: 'fluent-emoji-flat:sports-medal',
    laptop: 'fluent-emoji-flat:laptop',
    memo: 'fluent-emoji-flat:memo',
    lightning: 'fluent-emoji-flat:high-voltage',
    sparkles: 'fluent-emoji-flat:sparkles',
    runner: 'fluent-emoji-flat:person-running',
    fire: 'fluent-emoji-flat:fire',
    podium: 'fluent-emoji-flat:1st-place-medal',
    chart: 'fluent-emoji-flat:bar-chart',
    star: 'fluent-emoji-flat:glowing-star',
    camera: 'fluent-emoji-flat:camera-with-flash',
    lock: 'fluent-emoji-flat:locked-with-key',
    palette: 'fluent-emoji-flat:artist-palette',

    // Buttons & Actions
    uploadPhoto: 'solar:camera-add-bold-duotone',
    pixelBot: 'solar:ghost-bold-duotone',
    changePassword: 'solar:lock-keyhole-bold-duotone',
    openFolder: 'solar:folder-with-files-bold-duotone',
    reset: 'solar:restart-bold-duotone',
    save: 'solar:diskette-bold-duotone',
    settings: 'solar:settings-bold-duotone',
    help: 'solar:question-circle-bold-duotone',
};
