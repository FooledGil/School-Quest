import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Toast({ type = 'info', message }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Auto-dismiss after 3s
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    const styles = {
        success: {
            bg: 'bg-accent-emerald/20 border-accent-emerald text-accent-emerald shadow-[0_0_15px_rgba(16,185,129,0.4)]',
            icon: <CheckCircleIcon className="w-5 h-5" />
        },
        error: {
            bg: 'bg-accent-red/20 border-accent-red text-accent-red shadow-[0_0_15px_rgba(239,68,68,0.4)]',
            icon: <ExclamationCircleIcon className="w-5 h-5" />
        },
        info: {
            bg: 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]',
            icon: <InformationCircleIcon className="w-5 h-5" />
        },
        levelup: {
            bg: 'bg-accent-gold/20 border-accent-gold text-accent-gold shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-pulse',
            icon: <SparklesIcon className="w-5 h-5" />
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div className="fixed top-3 sm:top-4 right-3 sm:right-4 left-3 sm:left-auto z-50 sm:max-w-md animate-slide-up pointer-events-auto">
            <div className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg border backdrop-blur-md shadow-xl ${style.bg}`}>
                <div className="shrink-0">{style.icon}</div>
                <span className="font-bold text-xs sm:text-sm break-words flex-1">{message}</span>
            </div>
        </div>
    );
}
