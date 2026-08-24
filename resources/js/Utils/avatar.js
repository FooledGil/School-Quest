/**
 * Resolves the avatar URL for a user with hierarchical fallback:
 * 1. user.avatar (uploaded custom local photo or custom URL)
 * 2. user.avatar_seed (DiceBear 9.x pixel-art bot SVG)
 * 3. '/images/default-avatar.svg' (Default mystery silhouette with ?)
 */
export function getAvatarUrl(user) {
    if (!user) return '/images/default-avatar.svg';
    
    // 1. Direct avatar URL (uploaded image in storage, e.g., /storage/avatars/xxx.jpg)
    if (user.avatar && typeof user.avatar === 'string' && user.avatar.trim() !== '') {
        return user.avatar;
    }
    
    // 2. Pixel bot avatar seed
    if (user.avatar_seed && typeof user.avatar_seed === 'string' && user.avatar_seed.trim() !== '' && user.avatar_seed !== 'default') {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(user.avatar_seed)}`;
    }
    
    // 3. Fallback to default silhouette avatar with question mark
    return '/images/default-avatar.svg';
}

/**
 * Returns a pixel bot avatar URL for a given seed string
 */
export function getPixelBotUrl(seed) {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed || 'Student')}`;
}
