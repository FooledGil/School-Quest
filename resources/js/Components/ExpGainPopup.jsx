import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ExpGainPopup({ amount, show }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        if (show && textRef.current) {
            const tl = gsap.timeline();
            tl.fromTo(
                textRef.current,
                { y: 30, opacity: 0, scale: 0.5 },
                { y: 0, opacity: 1, scale: 1.2, duration: 0.4, ease: 'back.out(2)' }
            )
            .to(textRef.current, { scale: 1, duration: 0.2 })
            .to(textRef.current, { y: -60, opacity: 0, scale: 0.9, duration: 1.2, ease: 'power2.inOut', delay: 0.5 });
        }
    }, { dependencies: [show, amount], scope: containerRef });

    if (!show) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div 
                ref={textRef}
                className="text-4xl md:text-5xl font-game text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] tracking-wider"
            >
                +{amount} EXP
            </div>
        </div>
    );
}
