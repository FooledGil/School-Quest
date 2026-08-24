import React, { useState, useEffect } from 'react';

const TIPS = [
    {
        icon: '⚔️',
        title: 'TIPS PETUALANG',
        text: 'Kerjakan Main Quest setiap hari untuk mengumpulkan EXP dan naik pangkat rank!',
    },
    {
        icon: '🔥',
        title: 'STREAK COMBO',
        text: 'Pertahankan Daily Streak tanpa putus untuk melipatgandakan perolehan bonus EXP.',
    },
    {
        icon: '📸',
        title: 'BUKTI QUEST',
        text: 'Kini kamu bisa mengunggah bukti foto langsung dari perangkatmu untuk verifikasi misi.',
    },
    {
        icon: '👑',
        title: 'HALL OF FAME',
        text: 'Raih 3 besar teratas EXP untuk tampil megah di Podium Kehormatan Leaderboard!',
    },
];

export default function RealmNotice({ activeMode }) {
    const [tipIndex, setTipIndex] = useState(0);

    // Auto rotate tips every 6 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const currentTip = TIPS[tipIndex];

    return (
        <div className="w-full mt-5 space-y-2.5 select-none">
            {/* Realm Server & Security Banner */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#0d1322]/80 border-2 border-[#1e2a44] shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                    {/* Pulsing Realm Indicator */}
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <div className="min-w-0">
                        <p className="font-game text-[8px] sm:text-[9px] text-emerald-400 tracking-wider truncate">
                            REALM SMKN 2 PWK • ONLINE
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                            {activeMode === 'student' ? 'Siswa Portal • Gateway Active' : 'Admin & Guru Central Gate'}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 font-game text-[8px] text-blue-400 bg-blue-950/70 border border-blue-600/40 px-2 py-1 rounded-md">
                    VER 2.4
                </div>
            </div>

            {/* Cycling Adventurer Lore & Tips Box */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#090e1a]/90 border border-slate-800/90 shadow-inner flex items-start gap-3 transition-all duration-300">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-sm sm:text-base shrink-0 shadow-sm">
                    {currentTip.icon}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-game text-[8px] text-amber-400 tracking-wider">
                            {currentTip.title}
                        </span>
                        <div className="flex gap-1">
                            {TIPS.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setTipIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                        idx === tipIndex ? 'bg-amber-400 w-3' : 'bg-slate-700 hover:bg-slate-500'
                                    }`}
                                    title={`Tip ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-body">
                        {currentTip.text}
                    </p>
                </div>
            </div>
        </div>
    );
}
