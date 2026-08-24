import React, { useRef } from 'react';
import LevelBadge from './LevelBadge';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PodiumDisplay({ topThree = [] }) {
    const containerRef = useRef(null);

    useGSAP(() => {
        if (topThree && topThree.length >= 3 && containerRef.current) {
            const items = containerRef.current.querySelectorAll('.podium-item');
            if (items.length === 3) {
                const tl = gsap.timeline();
                tl.fromTo(
                    [items[0], items[2]],
                    { y: 60, opacity: 0, scale: 0.85 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)' }
                )
                .fromTo(
                    items[1],
                    { y: 80, opacity: 0, scale: 0.7 },
                    { y: 0, opacity: 1, scale: 1.05, duration: 0.7, ease: 'back.out(1.7)' },
                    '-=0.2'
                )
                .to(items[1], { scale: 1, duration: 0.2, ease: 'power1.inOut' });
            }
        }
    }, { dependencies: [topThree], scope: containerRef });

    if (!topThree || topThree.length < 3) return null;

    const podiumOrder = [topThree[1], topThree[0], topThree[2]];

    const podiumStyles = [
        { height: 'h-20 sm:h-28', color: 'bg-slate-800 border-slate-600 text-slate-300', badge: 'bg-slate-700 text-slate-200', rank: 2 },
        { height: 'h-28 sm:h-40', color: 'bg-blue-900/60 border-blue-500 text-amber-400', badge: 'bg-amber-500/20 border-amber-500/40 text-amber-400', rank: 1 },
        { height: 'h-16 sm:h-24', color: 'bg-slate-800 border-slate-700 text-amber-600', badge: 'bg-amber-900/30 text-amber-500', rank: 3 },
    ];

    return (
        <div ref={containerRef} className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6 pt-6 sm:pt-8 pb-2 overflow-hidden w-full max-w-md sm:max-w-lg mx-auto px-2">
            {podiumOrder.map((user, index) => {
                const style = podiumStyles[index];
                if (!user) return <div key={index} className="w-20 sm:w-28"></div>;

                return (
                    <div key={user.id} className="podium-item flex-1 max-w-[100px] sm:max-w-[130px] md:max-w-[150px] flex flex-col items-center min-w-0">
                        <div className="flex flex-col items-center mb-2 sm:mb-3 w-full">
                            <div className="relative mb-1.5 sm:mb-2 shrink-0">
                                <img 
                                    src={user.avatar} 
                                    alt={user.name} 
                                    className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-slate-800 border-2 border-slate-700 object-cover shadow-md" 
                                />
                                <div className="absolute -bottom-1 -right-1 transform scale-75 sm:scale-100 origin-bottom-right">
                                    <LevelBadge level={user.level || 1} size="sm" />
                                </div>
                            </div>
                            <div className="text-center px-0.5 w-full">
                                <p className="font-bold text-white text-[11px] sm:text-xs md:text-sm truncate w-full">{user.name}</p>
                                <p className="font-mono font-bold text-slate-400 text-[10px] sm:text-[11px] truncate w-full">{user.class}</p>
                            </div>
                        </div>

                        {/* Podium Block */}
                        <div className={`w-full ${style.height} ${style.color} rounded-t-xl border-t-2 border-x-2 flex flex-col items-center justify-between p-2 shadow-lg relative select-none`}>
                            {/* Rank Badge */}
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-game text-[10px] sm:text-xs shadow-md ${style.badge}`}>
                                #{style.rank}
                            </div>

                            {/* EXP Counter */}
                            <div className="font-game text-[9px] sm:text-[10px] tracking-wider text-amber-400 drop-shadow-sm pb-1">
                                {user.exp.toLocaleString()} <span className="text-[7px] sm:text-[8px] text-blue-300">EXP</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
