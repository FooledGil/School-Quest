import React, { useRef } from 'react';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ExclamationTriangleIcon, ShieldExclamationIcon, BoltIcon, NoSymbolIcon, FireIcon } from '@heroicons/react/24/solid';

export default function SanctionAlertModal({ sanctions = [] }) {
    const modalRef = useRef(null);
    const cardRef = useRef(null);

    // Only show if there are unacknowledged sanctions
    const activeSanction = sanctions && sanctions.length > 0 ? sanctions[0] : null;

    useGSAP(() => {
        if (activeSanction && cardRef.current) {
            const tl = gsap.timeline();
            tl.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
              .fromTo(
                  cardRef.current,
                  { scale: 0.5, y: 40, opacity: 0 },
                  { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }
              );
        }
    }, { dependencies: [activeSanction], scope: modalRef });

    if (!activeSanction) return null;

    const handleAcknowledge = () => {
        router.post(`/sanctions/${activeSanction.id}/acknowledge`, {}, {
            preserveScroll: true,
        });
    };

    const getIconAndBadge = (type) => {
        switch (type) {
            case 'exp_deduction':
                return {
                    icon: BoltIcon,
                    title: 'DENDA EXP DITERAPKAN',
                    badge: `${activeSanction.amount} EXP`,
                    color: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
                };
            case 'mute':
                return {
                    icon: NoSymbolIcon,
                    title: 'STATUS MUTE / SENYAP DI FORUM',
                    badge: activeSanction.expires_at ? `Hingga ${activeSanction.expires_at}` : 'Permanen',
                    color: 'text-red-400 border-red-500/50 bg-red-500/10',
                };
            case 'streak_reset':
                return {
                    icon: FireIcon,
                    title: 'DAILY STREAK DIRESET KE 0',
                    badge: 'Streak 0 Hari',
                    color: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
                };
            case 'warning':
            default:
                return {
                    icon: ExclamationTriangleIcon,
                    title: 'SURAT TEGURAN RESMI REALM',
                    badge: 'Peringatan Tata Tertib',
                    color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
                };
        }
    };

    const config = getIconAndBadge(activeSanction.type);
    const Icon = config.icon;

    return (
        <div 
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
        >
            <div 
                ref={cardRef}
                className="glass-card max-w-md w-full p-6 sm:p-8 bg-slate-950/95 border-2 border-red-500/60 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.3)] relative text-center overflow-hidden"
            >
                {/* Rotating subtle warning glow */}
                <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(239,68,68,0.2)_360deg)] animate-[spin_8s_linear_infinite] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 mb-4 shadow-lg shadow-red-500/20">
                        <Icon className="w-9 h-9" />
                    </div>

                    <h2 className="font-game text-sm sm:text-base text-red-400 tracking-wider mb-1 drop-shadow">
                        {config.title}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono mb-4">
                        Diterbitkan oleh: <span className="text-slate-200 font-bold">{activeSanction.admin_name}</span> • {activeSanction.created_at}
                    </p>

                    {/* Penalty Badge */}
                    <div className={`px-4 py-2 rounded-xl border font-game text-xs mb-5 ${config.color}`}>
                        {config.badge}
                    </div>

                    {/* Reason box */}
                    <div className="w-full text-left p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6">
                        <p className="font-game text-[9px] text-slate-400 uppercase tracking-wider mb-1.5">
                            Alasan Pelanggaran:
                        </p>
                        <p className="italic text-slate-200 font-body">
                            "{activeSanction.reason}"
                        </p>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal mb-5 font-body">
                        Harap patuhi tata tertib dan etika berkomunikasi di SchoolQuest Realm demi kenyamanan bersama.
                    </p>

                    <button
                        type="button"
                        onClick={handleAcknowledge}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-game text-xs tracking-wider transition-all shadow-lg shadow-red-600/40 cursor-pointer"
                    >
                        SAYA MENGERTI & AKAN PATUH 📜
                    </button>
                </div>
            </div>
        </div>
    );
}
