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
        { height: 'h-28', color: 'bg-slate-800 border-slate-600 text-slate-300', badge: 'bg-slate-700 text-slate-200', rank: 2 },
        { height: 'h-40', color: 'bg-blue-900/60 border-blue-500 text-amber-400', badge: 'bg-amber-500/20 border-amber-500/40 text-amber-400', rank: 1 },
        { height: 'h-24', color: 'bg-slate-800 border-slate-700 text-amber-600', badge: 'bg-amber-900/30 text-amber-500', rank: 3 },
    ];

    return (
        <div ref={containerRef} className="flex items-end justify-center gap-4 pt-8 pb-2 overflow-hidden">
            {podiumOrder.map((user, index) => {
                const style = podiumStyles[index];
                if (!user) return <div key={index} className="w-28"></div>;

                return (
                    <div key={user.id} className="podium-item w-28 md:w-36 flex flex-col items-center">
                        <div className="flex flex-col items-center mb-3">
                            <div className="relative mb-2">
                                <img src={user.avatar} alt={user.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-800 border-2 border-slate-700 object-cover shadow-md" />
                                <div className="absolute -bottom-1 -right-1">
                                    <LevelBadge level={user.level} size="sm" />
                                </div>
                            </div>
                            <div className="text-center px-1">
                                <p className="font-bold text-white text-xs md:text-sm truncate max-w-[110px]">{user.name}</p>
                                <p className="text-[11px] text-amber-400 font-semibold mt-0.5">{(user.exp || 0).toLocaleString()} EXP</p>
                            </div>
                        </div>

                        <div className={`w-full ${style.height} ${style.color} rounded-t-xl border-t-2 border-x flex flex-col items-center justify-start pt-3 shadow-lg relative`}>
                            <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold text-xs ${style.badge}`}>
                                #{style.rank}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
