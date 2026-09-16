import React from 'react';

export default function LevelBadge({ level = 1, rankName, size = 'md', className = '' }) {
    const sizeConfig = {
        xs: {
            box: 'px-1.5 py-0.5 text-[7px] gap-1 rounded',
            lvlText: 'text-[6px]',
            border: 'border',
        },
        sm: {
            box: 'px-2 py-0.5 text-[8px] gap-1 rounded-md',
            lvlText: 'text-[7px]',
            border: 'border',
        },
        md: {
            box: 'px-2.5 py-0.5 text-[9px] gap-1.5 rounded-lg',
            lvlText: 'text-[8px]',
            border: 'border-2',
        },
        lg: {
            box: 'px-3 py-1 text-[11px] gap-1.5 rounded-lg',
            lvlText: 'text-[9px]',
            border: 'border-2',
        },
    };

    const current = sizeConfig[size] || sizeConfig.md;

    return (
        <div className={`inline-flex items-center select-none shrink-0 ${className}`}>
            <div className={`bg-blue-600/20 text-blue-300 ${current.border} border-blue-500/40 flex items-center font-game tracking-wider shadow-xs ${current.box}`}>
                <span className={`uppercase font-bold text-amber-400 ${current.lvlText}`}>LVL</span>
                <span>{level}</span>
            </div>

            {rankName && (
                <span className="font-game text-[7px] sm:text-[8px] tracking-wide text-amber-400/90 ml-1.5 uppercase">
                    {rankName}
                </span>
            )}
        </div>
    );
}
