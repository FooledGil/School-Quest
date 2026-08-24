import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function StatCard({ icon: Icon, label, value, color = 'blue' }) {
    const cardRef = useRef(null);
    const [displayVal, setDisplayVal] = useState(typeof value === 'number' ? 0 : value);

    const iconColors = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        cyan: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        gold: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    };

    const style = iconColors[color] || iconColors.blue;

    useGSAP(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );

            if (typeof value === 'number') {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: value,
                    duration: 0.8,
                    ease: 'power2.out',
                    onUpdate: () => setDisplayVal(Math.round(obj.val))
                });
            }
        }
    }, { dependencies: [value], scope: cardRef });

    return (
        <div ref={cardRef} className="glass-card p-3.5 sm:p-4 md:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:border-blue-500/40 hover:-translate-y-0.5 min-w-0 border-2">
            <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 ${style} shadow-md`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
                    {label}
                </p>
                <div className="text-lg sm:text-xl font-game text-white tracking-wider truncate drop-shadow-sm">
                    {typeof displayVal === 'number' ? displayVal.toLocaleString() : value}
                </div>
            </div>
        </div>
    );
}
