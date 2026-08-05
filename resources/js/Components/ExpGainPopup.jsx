import React, { useEffect, useState } from 'react';

export default function ExpGainPopup({ amount, show }) {
    const [render, setRender] = useState(false);

    useEffect(() => {
        if (show) {
            setRender(true);
            const timer = setTimeout(() => {
                setRender(false);
            }, 2000); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!render) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-float text-4xl font-game text-accent-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] opacity-0 animate-[fade-out-up_2s_ease-out_forwards]">
                +{amount} EXP
            </div>
            
            <style jsx>{`
                @keyframes fade-out-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(-40px); }
                    100% { opacity: 0; transform: translateY(-60px); }
                }
            `}</style>
        </div>
    );
}
