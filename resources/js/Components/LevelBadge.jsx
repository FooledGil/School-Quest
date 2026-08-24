import React from 'react';

export default function LevelBadge({ level = 1, rankName, size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[9px]',
        md: 'px-2.5 py-1 text-[10px]',
        lg: 'px-3.5 py-1.5 text-xs',
    };

    return (
        <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
            <div className={`bg-blue-600/20 text-blue-300 border-2 border-blue-500/40 rounded-lg flex items-center gap-1.5 font-game tracking-wider shadow-sm ${sizeClasses[size]}`}>
                <span className="text-[8px] sm:text-[9px] uppercase font-bold text-amber-400">LVL</span>
                <span>{level}</span>
            </div>

            {rankName && (
                <span className="font-game text-[8px] sm:text-[9px] tracking-wide text-amber-400/90 mt-1 uppercase">
                    {rankName}
                </span>
            )}
        </div>
    );
}
