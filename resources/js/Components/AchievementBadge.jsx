import React, { useRef } from 'react';
import { LockClosedIcon, TrophyIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';

export default function AchievementBadge({ achievement = {}, isUnlocked }) {
    const badgeRef = useRef(null);
    const title = achievement.title || achievement.name || 'Achievement';
    const description = achievement.description || '';

    const handleMouseEnter = () => {
        if (badgeRef.current) {
            gsap.to(badgeRef.current, { scale: 1.15, duration: 0.25, ease: 'back.out(2)' });
        }
    };

    const handleMouseLeave = () => {
        if (badgeRef.current) {
            gsap.to(badgeRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
        }
    };

    return (
        <div 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative flex flex-col items-center cursor-pointer"
        >
            <div 
                ref={badgeRef}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-2 transition-all duration-200
                    ${isUnlocked 
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                        : 'border-slate-800 bg-slate-900/60 text-slate-600 opacity-60'
                    }
                `}
            >
                {isUnlocked ? (
                    <TrophyIcon className="w-7 h-7 text-amber-400" />
                ) : (
                    <LockClosedIcon className="w-5 h-5 text-slate-600" />
                )}
            </div>

            <span className={`text-xs font-semibold text-center truncate max-w-[90px] ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                {title}
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-xs font-bold text-white mb-1">{title}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{description}</div>
                {isUnlocked && (
                    <div className="text-[10px] text-emerald-400 font-bold mt-1.5 uppercase">Terbuka</div>
                )}
            </div>
        </div>
    );
}
