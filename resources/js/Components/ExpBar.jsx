import React, { useEffect, useState } from 'react';

export default function ExpBar({ currentExp, requiredExp, className = '' }) {
    const [width, setWidth] = useState(0);
    const percentage = Math.min(100, Math.max(0, (currentExp / requiredExp) * 100));

    useEffect(() => {
        // Animation delay for dramatic effect
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, 300);
        return () => clearTimeout(timer);
    }, [currentExp, requiredExp, percentage]);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between items-end mb-1 text-xs">
                <span className="font-game text-gray-400">EXP</span>
                <span className="text-gray-300 font-bold tracking-wider">
                    {currentExp.toLocaleString()} / {requiredExp.toLocaleString()}
                </span>
            </div>
            
            <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700 shadow-inner relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-accent-cyan opacity-20 blur-md"></div>
                
                {/* Progress bar */}
                <div 
                    className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)] relative"
                    style={{ width: `${width}%` }}
                >
                    {/* Highlight edge */}
                    <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-50 blur-sm"></div>
                </div>
            </div>
        </div>
    );
}
