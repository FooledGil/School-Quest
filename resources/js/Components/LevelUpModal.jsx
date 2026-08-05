import React, { useEffect } from 'react';
import LevelBadge from './LevelBadge';

export default function LevelUpModal({ newLevel, rankName, show, onClose }) {
    useEffect(() => {
        if (show) {
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}>
            {/* Confetti/Particle background could go here */}
            
            <div 
                className="glass-card max-w-sm w-full p-8 flex flex-col items-center text-center relative overflow-hidden animate-[scale-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Rotating ray effect */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(255,215,0,0.3)_360deg)] animate-[spin_4s_linear_infinite]"></div>
                
                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-3xl font-game text-accent-gold mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                        LEVEL UP!
                    </h2>
                    
                    <div className="mb-6 scale-150">
                        <LevelBadge level={newLevel} rankName={rankName} size="lg" />
                    </div>
                    
                    <p className="text-gray-300 mt-8 mb-6 font-bold text-lg">
                        You've reached a new rank! Keep completing quests to become a legend.
                    </p>
                    
                    <button 
                        onClick={onClose}
                        className="bg-accent-gold text-black font-game text-sm px-6 py-3 rounded hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                    >
                        AWESOME
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
