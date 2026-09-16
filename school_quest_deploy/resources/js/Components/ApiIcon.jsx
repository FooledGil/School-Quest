import React, { useState } from 'react';
import { getIconApiUrl } from '@/Utils/iconApi';

/**
 * Reusable Icon Component that fetches vector icons from API
 */
export default function ApiIcon({ 
    icon, 
    color = null, 
    className = 'w-5 h-5', 
    alt = 'icon',
    fallback = null 
}) {
    const [hasError, setHasError] = useState(false);

    if (!icon) return fallback || null;

    const url = getIconApiUrl(icon, color);

    if (hasError) {
        return fallback || <span className="inline-block text-base">✨</span>;
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`inline-block object-contain shrink-0 ${className}`}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}
