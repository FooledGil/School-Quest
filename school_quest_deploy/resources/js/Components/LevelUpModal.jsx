import React, { useEffect, useRef } from 'react';
import LevelBadge from './LevelBadge';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function LevelUpModal({ newLevel, rankName, show, onClose }) {
    const modalRef = useRef(null);
    const cardRef = useRef(null);
    const titleRef = useRef(null);
    const badgeRef = useRef(null);
    const textRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    useGSAP(() => {
        if (show && cardRef.current) {
            const tl = gsap.timeline();

            // Backdrop Fade In
            tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
              // Card Scale Bounce
              .fromTo(
                  cardRef.current,
                  { scale: 0.4, y: 50, opacity: 0 },
                  { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
              )
              // Title Bounce & Glow
              .fromTo(
                  titleRef.current,
                  { scale: 2, opacity: 0 },
                  { scale: 1, opacity: 1, duration: 0.5, ease: 'bounce.out' },
                  '-=0.2'
              )
              // Badge Elastic Rise
              .fromTo(
                  badgeRef.current,
                  { scale: 0, rotation: -20 },
                  { scale: 1.5, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' },
                  '-=0.3'
              )
              // Text & Button Fade Up Stagger
              .fromTo(
                  [textRef.current, buttonRef.current],
                  { y: 20, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.4, stagger: 0.15, ease: 'power2.out' },
                  '-=0.2'
              );
        }
    }, { dependencies: [show], scope: modalRef });

    if (!show) return null;

    return (
        <div 
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={onClose}
        >
            <div 
                ref={cardRef}
                className="glass-card max-w-sm w-full p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl border border-amber-500/30"
                onClick={e => e.stopPropagation()}
            >
                {/* Rotating ray effect */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(245,158,11,0.25)_360deg)] animate-[spin_4s_linear_infinite] pointer-events-none" />
                
                <div className="relative z-10 w-full flex flex-col items-center">
                    <h2 
                        ref={titleRef}
                        className="text-2xl sm:text-3xl md:text-4xl font-game text-amber-400 mb-4 sm:mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.9)] tracking-wider"
                    >
                        LEVEL UP!
                    </h2>
                    
                    <div ref={badgeRef} className="mb-4 sm:mb-6">
                        <LevelBadge level={newLevel} rankName={rankName} size="lg" />
                    </div>
                    
                    <p ref={textRef} className="text-slate-200 mt-4 sm:mt-6 mb-5 sm:mb-6 font-bold text-sm sm:text-base leading-relaxed">
                        Kamu mencapai peringkat baru! Terus selesaikan quest untuk menjadi seorang legenda.
                    </p>
                    
                    <button 
                        ref={buttonRef}
                        onClick={onClose}
                        className="w-full sm:w-auto bg-amber-500 text-black font-game text-xs sm:text-sm px-6 py-3 rounded-lg hover:bg-amber-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer"
                    >
                        LUAR BIASA! ⚡
                    </button>
                </div>
            </div>
        </div>
    );
}
