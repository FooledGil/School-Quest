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
            <div className="flex justify-between items-end mb-1 text-xs font-mono">
                <span className="font-bold text-blue-400">EXP</span>
                <span ref={counterRef} className="text-slate-300 font-medium">
                    {displayExp.toLocaleString()} / {requiredExp.toLocaleString()}
                </span>
            </div>

            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/60 relative">
                <div
                    ref={barRef}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full relative"
                    style={{ width: '0%' }}
                >
                    <div className="absolute top-0 right-0 w-2 h-full bg-white/40 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
