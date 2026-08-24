import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ExpBar({ currentExp = 0, requiredExp = 100, className = '' }) {
    const barRef = useRef(null);
    const counterRef = useRef(null);
    const [displayExp, setDisplayExp] = useState(0);

    const percentage = Math.min(100, Math.max(0, (currentExp / requiredExp) * 100));

    useGSAP(() => {
        if (barRef.current) {
            // Animate bar width
            gsap.to(barRef.current, {
                width: `${percentage}%`,
                duration: 0.8,
                ease: 'power2.out',
            });

            // Animate EXP counter number
            const obj = { val: displayExp };
            gsap.to(obj, {
                val: currentExp,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate: () => {
                    setDisplayExp(Math.round(obj.val));
                }
            });
        }
    }, { dependencies: [currentExp, requiredExp, percentage] });

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between items-center mb-1.5 select-none">
                <span className="font-game text-[9px] sm:text-[10px] text-blue-400 font-bold tracking-wider flex items-center gap-1">
                    <span>⚡</span>
                    <span>EXP</span>
                </span>
                <span ref={counterRef} className="font-mono text-xs text-slate-300 font-bold tracking-wide">
                    {displayExp.toLocaleString()} <span className="text-slate-500 font-normal">/</span> {requiredExp.toLocaleString()}
                </span>
            </div>

            <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden border-2 border-slate-700/80 relative shadow-inner p-0.5">
                <div
                    ref={barRef}
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full relative"
                    style={{ width: '0%' }}
                >
                    <div className="absolute top-0 right-0 w-2 h-full bg-white/60 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
