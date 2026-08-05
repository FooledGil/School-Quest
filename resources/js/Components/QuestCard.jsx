import React from 'react';
import { CheckCircleIcon, PlayIcon } from '@heroicons/react/24/solid';

export default function QuestCard({ quest, onComplete, isCompleted }) {
    const difficultyColors = {
        easy: 'text-accent-emerald border-accent-emerald shadow-[0_0_8px_rgba(16,185,129,0.3)]',
        medium: 'text-yellow-400 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.3)]',
        hard: 'text-accent-red border-accent-red shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    };

    const difficultyGlow = {
        easy: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]',
        medium: 'hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]',
        hard: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    };

    const colorClass = difficultyColors[quest.difficulty] || difficultyColors.easy;
    const hoverClass = difficultyGlow[quest.difficulty] || difficultyGlow.easy;

    return (
        <div className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${!isCompleted ? hoverClass : 'opacity-70 grayscale-[30%]'}`}>
            
            {isCompleted && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="bg-accent-emerald text-white px-4 py-2 rounded-lg font-game text-xs flex items-center gap-2 transform rotate-[-5deg] shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                        <CheckCircleIcon className="w-5 h-5" />
                        COMPLETED
                    </div>
                </div>
            )}

            <div className="flex justify-between items-start mb-3">
                <div className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${colorClass} bg-black/50`}>
                    {quest.difficulty}
                </div>
                <div className="text-accent-gold font-game text-xs flex items-center gap-1 shadow-sm">
                    <span>+{quest.exp}</span>
                    <span className="text-[8px] text-gray-400">EXP</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                {quest.title}
            </h3>
            
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {quest.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                    {quest.category}
                </span>
                
                {!isCompleted && onComplete && (
                    <button 
                        onClick={() => onComplete(quest.id)}
                        className="bg-accent-cyan/10 hover:bg-accent-cyan text-accent-cyan hover:text-white border border-accent-cyan/50 px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold uppercase transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    >
                        <PlayIcon className="w-4 h-4" />
                        Start Quest
                    </button>
                )}
            </div>
        </div>
    );
}
