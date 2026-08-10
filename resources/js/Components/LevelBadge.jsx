import React from 'react';

export default function LevelBadge({ level = 1, rankName, size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs font-semibold',
        md: 'px-3 py-1 text-sm font-bold',
        lg: 'px-4 py-1.5 text-base font-extrabold',
    };

    return (
        <div className={`inline-flex flex-col items-center justify-center ${className}`}>
            <div className={`bg-blue-600/20 text-blue-400 border border-blue-500/40 rounded-full flex items-center gap-1.5 ${sizeClasses[size]}`}>
                <span className="text-[10px] uppercase font-bold text-blue-300">LVL</span>
                <span>{level}</span>
            </div>

            {rankName && (
                <span className="text-[11px] font-semibold tracking-wide text-slate-300 mt-1">
                    {rankName}
                </span>
            )}
        </div>
    );
}
