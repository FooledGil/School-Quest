import React from 'react';

export default function LevelBadge({ level, rankName, size = 'md', className = '' }) {
    // 1=Novice, 2=Apprentice, 3=Warrior, 4=Knight, 5=Champion, 6=Hero, 7=Legend, 8=Mythic, 9=Divine, 10=Immortal
    const levelData = {
        1: { color: 'text-gray-400', border: 'border-gray-400', shadow: 'shadow-gray-400/50', bg: 'bg-gray-400/20' },
        2: { color: 'text-blue-400', border: 'border-blue-400', shadow: 'shadow-blue-400/50', bg: 'bg-blue-400/20' },
        3: { color: 'text-emerald-400', border: 'border-emerald-400', shadow: 'shadow-emerald-400/50', bg: 'bg-emerald-400/20' },
        4: { color: 'text-purple-400', border: 'border-purple-400', shadow: 'shadow-purple-400/50', bg: 'bg-purple-400/20' },
        5: { color: 'text-yellow-400', border: 'border-yellow-400', shadow: 'shadow-yellow-400/50', bg: 'bg-yellow-400/20' },
        6: { color: 'text-orange-400', border: 'border-orange-400', shadow: 'shadow-orange-400/50', bg: 'bg-orange-400/20' },
        7: { color: 'text-red-400', border: 'border-red-400', shadow: 'shadow-red-400/50', bg: 'bg-red-400/20' },
        8: { color: 'text-pink-400', border: 'border-pink-400', shadow: 'shadow-pink-400/50', bg: 'bg-pink-400/20' },
        9: { color: 'text-indigo-400', border: 'border-indigo-400', shadow: 'shadow-indigo-400/50', bg: 'bg-indigo-400/20' },
        10: { color: 'text-accent-gold', border: 'border-accent-gold', shadow: 'shadow-accent-gold/50', bg: 'bg-accent-gold/20' },
    };

    // Clamp level between 1 and 10
    const clampedLevel = Math.max(1, Math.min(10, level || 1));
    const style = levelData[clampedLevel];

    const sizeClasses = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-xl',
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div 
                className={`${sizeClasses[size]} ${style.bg} ${style.border} ${style.color} border-2 rounded-lg flex items-center justify-center font-game shadow-[0_0_15px] ${style.shadow} transform rotate-45 mb-2 hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
            >
                {/* Inner highlight */}
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full rotate-45 animate-pulse"></div>
                
                <span className="transform -rotate-45 relative z-10">{level}</span>
            </div>
            
            {rankName && (
                <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                    {rankName}
                </span>
            )}
        </div>
    );
}
