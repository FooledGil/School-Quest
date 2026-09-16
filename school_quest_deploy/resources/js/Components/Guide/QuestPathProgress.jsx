import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PixelHero from './PixelHero';

/**
 * QuestPathProgress: Interactive RPG Dungeon Road / Quest Path
 * - Features animated pixel hero travelling across checkpoints
 * - Glowing quest cobblestones & milestone badges
 * - Clickable checkpoints to navigate
 */
export default function QuestPathProgress({ 
    steps = [], 
    currentStep = 0, 
    onStepClick 
}) {
    const containerRef = useRef(null);
    const heroWrapperRef = useRef(null);
    const prevStepRef = useRef(currentStep);
    const [isWalking, setIsWalking] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = right, -1 = left

    const totalSteps = steps.length;
    const progressPercent = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;
    const isLastStep = currentStep === totalSteps - 1;

    // Handle Hero Traveling Animation between Checkpoints
    useGSAP(() => {
        if (!heroWrapperRef.current) return;

        const prevStep = prevStepRef.current;
        if (prevStep !== currentStep) {
            const dir = currentStep > prevStep ? 1 : -1;
            setDirection(dir);
            setIsWalking(true);

            const targetPercent = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;
            const distance = Math.abs(currentStep - prevStep);
            const duration = Math.min(0.7, 0.35 + distance * 0.15);

            gsap.to(heroWrapperRef.current, {
                left: `${targetPercent}%`,
                duration: duration,
                ease: 'power1.inOut',
                onComplete: () => {
                    setIsWalking(false);
                    // Small landing bounce & milestone spark
                    gsap.fromTo(heroWrapperRef.current, 
                        { y: -6 }, 
                        { y: 0, duration: 0.25, ease: 'bounce.out' }
                    );
                }
            });

            prevStepRef.current = currentStep;
        } else {
            // Initial positioning
            const targetPercent = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;
            gsap.set(heroWrapperRef.current, { left: `${targetPercent}%` });
        }
    }, { dependencies: [currentStep, totalSteps], scope: containerRef });

    return (
        <div ref={containerRef} className="w-full px-4 sm:px-8 pt-7 pb-2 select-none">
            {/* Header Mini Status */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-game text-slate-400 mb-3 px-1">
                <span className="flex items-center gap-1.5 text-blue-400">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>EXPEDITION MAP</span>
                </span>
                <span className="text-amber-400 tracking-wider">
                    STAGE {currentStep + 1}/{totalSteps}
                </span>
            </div>

            {/* Path Road Area */}
            <div className="relative h-12 flex items-center">
                {/* Background Dungeon Trail (Stone Road) */}
                <div className="absolute inset-x-0 h-3 bg-slate-950 rounded-full border-2 border-slate-700/80 shadow-inner overflow-hidden">
                    {/* Cobblestone texture lines */}
                    <div 
                        className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,#475569,#475569_4px,transparent_4px,transparent_10px)]"
                    />
                </div>

                {/* Glowing Active Trail (Progress Line) */}
                <div 
                    className="absolute left-0 h-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                />

                {/* Checkpoint Nodes */}
                <div className="absolute inset-x-0 flex items-center justify-between px-0.5">
                    {steps.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;
                        const isLocked = idx > currentStep;

                        return (
                            <button
                                key={step.id || idx}
                                type="button"
                                onClick={() => onStepClick && onStepClick(idx)}
                                title={step.subtitle || `Langkah ${idx + 1}`}
                                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-transform duration-200 focus:outline-none ${
                                    isActive ? 'scale-115' : 'hover:scale-110'
                                }`}
                            >
                                {/* Checkpoint Crystal / Stone */}
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg rotate-45 border-2 flex items-center justify-center transition-all duration-300 shadow-md ${
                                    isActive
                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-yellow-200 shadow-amber-500/50 scale-105'
                                        : isCompleted
                                            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-300 shadow-blue-500/40 text-blue-100'
                                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                                }`}>
                                    <span className="-rotate-45 font-game text-[8px] sm:text-[9px] font-bold">
                                        {isCompleted ? '✓' : idx + 1}
                                    </span>
                                </div>

                                {/* Active Pulse Ring */}
                                {isActive && (
                                    <span className="absolute -inset-1 rounded-xl bg-amber-400/25 animate-ping pointer-events-none" />
                                )}

                                {/* Step Label Marker */}
                                <span className={`absolute top-9 sm:top-10 text-[7px] sm:text-[8px] font-game whitespace-nowrap px-1.5 py-0.5 rounded border transition-colors ${
                                    isActive 
                                        ? 'text-amber-300 bg-slate-900 border-amber-500/60 shadow-sm' 
                                        : isCompleted
                                            ? 'text-blue-300 bg-slate-950/80 border-slate-800'
                                            : 'text-slate-500 bg-slate-950/60 border-slate-900 hidden sm:block'
                                }`}>
                                    {idx === totalSteps - 1 ? '👑 GOAL' : `STG ${idx + 1}`}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Animated Traveling Pixel Hero */}
                <div 
                    ref={heroWrapperRef}
                    className="absolute -top-7 z-20 pointer-events-none transition-[left] ease-out -translate-x-1/2"
                    style={{ left: `${progressPercent}%` }}
                >
                    {/* Hero Character */}
                    <div className="relative">
                        <PixelHero 
                            isWalking={isWalking} 
                            direction={direction} 
                            isCelebrating={isLastStep && !isWalking}
                            className="w-10 h-10 sm:w-12 sm:h-12"
                        />

                        {/* Player Speech Bubble / Level Tag */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-game text-[6px] sm:text-[7px] px-1.5 py-0.5 rounded border border-blue-300 shadow-sm whitespace-nowrap flex items-center gap-0.5">
                            <span>HERO</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
