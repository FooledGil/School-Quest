import React from 'react';
import { LockClosedIcon, StarIcon } from '@heroicons/react/24/solid';

export default function AchievementBadge({ achievement, isUnlocked }) {
    return (
        <div className="group relative flex flex-col items-center">
            {/* Badge */}
            <div 
                className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-2 transition-all duration-500
                    ${isUnlocked 
                        ? 'border-accent-gold bg-gradient-to-br from-yellow-600 to-yellow-900 shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:scale-110 cursor-pointer' 
                        : 'border-gray-700 bg-gray-800 grayscale cursor-not-allowed opacity-50'
                    }
                `}
            >
                {isUnlocked ? (
                    <div className="relative">
                        <StarIcon className="w-10 h-10 text-accent-gold drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
                        {/* Sparkle effect */}
                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                ) : (
                    <LockClosedIcon className="w-8 h-8 text-gray-500" />
                )}
            </div>

            {/* Title */}
            <span className={`text-xs font-bold text-center ${isUnlocked ? 'text-accent-gold' : 'text-gray-500'}`}>
                {achievement.title}
            </span>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 border border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-sm">
                <div className="text-sm font-bold text-white mb-1">{achievement.title}</div>
                <div className="text-xs text-gray-400">{achievement.description}</div>
                {isUnlocked && (
                    <div className="text-[10px] text-accent-emerald mt-2 font-game">UNLOCKED</div>
                )}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/90"></div>
            </div>
        </div>
    );
}
