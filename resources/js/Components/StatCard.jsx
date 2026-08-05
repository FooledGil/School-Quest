import React, { useEffect, useState } from 'react';

export default function StatCard({ icon: Icon, label, value, color = 'cyan' }) {
    const [displayValue, setDisplayValue] = useState(0);
    const numValue = typeof value === 'number' ? value : parseInt(value?.toString().replace(/\D/g, '') || '0', 10);
    
    // Simple counter animation
    useEffect(() => {
        if (numValue === 0) return;
        
        let start = 0;
        const duration = 1500; // ms
        const increment = numValue / (duration / 16); // 60fps
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= numValue) {
                setDisplayValue(numValue);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);
        
        return () => clearInterval(timer);
    }, [numValue]);

    const colors = {
        cyan: 'text-accent-cyan from-accent-cyan/20 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:border-accent-cyan/50',
        purple: 'text-accent-purple from-accent-purple/20 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:border-accent-purple/50',
        gold: 'text-accent-gold from-accent-gold/20 to-transparent shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] hover:border-accent-gold/50',
        emerald: 'text-accent-emerald from-accent-emerald/20 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:border-accent-emerald/50',
    };

    const style = colors[color] || colors.cyan;

    return (
        <div className={`glass-card p-5 flex items-center gap-4 bg-gradient-to-br transition-all duration-300 ${style}`}>
            <div className={`p-3 rounded-lg bg-black/40 border border-gray-800 ${style.split(' ')[0]}`}>
                <Icon className="w-6 h-6" />
            </div>
            
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
                    {label}
                </p>
                <div className={`text-2xl font-game ${style.split(' ')[0]}`}>
                    {typeof value === 'number' ? displayValue.toLocaleString() : value}
                </div>
            </div>
        </div>
    );
}
