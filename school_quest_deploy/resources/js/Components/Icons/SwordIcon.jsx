import React from 'react';

/**
 * Clean Vector SVG Sword Icon for RPG Quest & Guild UI
 */
export function SwordIcon({ className = 'w-4 h-4', ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 inline-block ${className}`}
            aria-hidden="true"
            {...props}
        >
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" />
            <line x1="16" y1="16" x2="20" y2="20" />
            <line x1="19" y1="21" x2="21" y2="19" />
        </svg>
    );
}

/**
 * Crossed Swords Icon for Guild / Battle / Challenge UI
 */
export function CrossedSwordsIcon({ className = 'w-4 h-4', ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 inline-block ${className}`}
            aria-hidden="true"
            {...props}
        >
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
            <path d="M13 19l6-6" />
            <path d="M16 16l4 4" />
            <path d="M19 21l2-2" />
            <path d="M9.5 17.5L21 6V3h-3L6.5 14.5" />
            <path d="M11 19l-6-6" />
            <path d="M8 16l-4 4" />
            <path d="M5 21l-2-2" />
        </svg>
    );
}

export default SwordIcon;
