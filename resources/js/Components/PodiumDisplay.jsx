import React from 'react';
import LevelBadge from './LevelBadge';

export default function PodiumDisplay({ topThree }) {
    if (!topThree || topThree.length < 3) return null;

    // Ordered: 2nd, 1st, 3rd for podium layout
    const podiumOrder = [topThree[1], topThree[0], topThree[2]];
    
    const podiumStyles = [
        { height: 'h-32', color: 'from-gray-300 to-gray-500', border: 'border-gray-400', shadow: 'shadow-[0_-5px_20px_rgba(156,163,175,0.4)]', rank: 2 },
        { height: 'h-48', color: 'from-accent-gold to-yellow-700', border: 'border-accent-gold', shadow: 'shadow-[0_-5px_30px_rgba(255,215,0,0.6)]', rank: 1 },
        { height: 'h-24', color: 'from-amber-600 to-amber-800', border: 'border-amber-600', shadow: 'shadow-[0_-5px_20px_rgba(217,119,6,0.4)]', rank: 3 },
    ];

    return (
        <div className="flex items-end justify-center gap-2 md:gap-6 pt-10 pb-4">
            {podiumOrder.map((user, index) => {
                const style = podiumStyles[index];
                if (!user) return <div key={index} className="w-1/3 max-w-[120px]"></div>;

                return (
                    <div key={user.id} className="w-1/3 max-w-[120px] flex flex-col items-center animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                        
                        {/* Avatar & Info */}
                        <div className="flex flex-col items-center mb-4 z-10">
                            <div className={`relative rounded-full border-4 ${style.border} p-1 bg-black shadow-lg mb-2`}>
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-800" />
                                <div className="absolute -bottom-3 -right-2 transform scale-75">
                                    <LevelBadge level={user.level} size="sm" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-white text-xs md:text-sm truncate w-full max-w-[100px]">{user.name}</p>
                                <p className="text-[10px] text-gray-400 font-game mt-1">{user.exp} EXP</p>
                            </div>
                        </div>

                        {/* Podium Block */}
                        <div className={`w-full ${style.height} bg-gradient-to-t ${style.color} rounded-t-lg relative border-t-4 border-l-2 border-r-2 ${style.border} ${style.shadow} flex justify-center pt-4`}>
                            <span className="font-game text-2xl text-black/50">{style.rank}</span>
                            
                            {/* 3D effect front face */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-white/20 rounded-t-sm"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
