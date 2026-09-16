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

export default function RealmNotice() {
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
            {/* Academy Guild & Realm Seal Banner (No AI-slop green dot) */}
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0d1424]/90 via-[#10192e]/90 to-[#0d1424]/90 border-2 border-[#1e2d4a] shadow-md flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                    {/* RPG Academy Crest Icon */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500/15 via-blue-500/15 to-indigo-500/20 border border-amber-400/40 flex items-center justify-center text-sm shrink-0 shadow-inner">
                        🏰
                    </div>
                    <div className="min-w-0">
                        <p className="font-game text-[8px] sm:text-[9px] text-amber-300 tracking-wider truncate flex items-center gap-1.5">
                            <span>SMKN 2 PURWAKARTA</span>
                            <span className="text-[7px] text-slate-500">•</span>
                            <span className="text-blue-300 text-[7px] sm:text-[8px]">REALM ACADEMY</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-body truncate">
                            Platform Gamifikasi Belajar & Quest Sekolah
                        </p>
                    </div>
                </div>

                <div className="shrink-0 font-game text-[8px] text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-1 rounded-md tracking-wider">
                    TAPEL 2026
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
