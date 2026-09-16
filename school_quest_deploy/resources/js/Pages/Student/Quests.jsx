import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import QuestCard from '@/Components/QuestCard';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import GuildHallScene from '@/Components/Quests/GuildHallScene';

export default function Quests({ mainQuests = [], additionalQuests = [] }) {
    const gridRef = useRef(null);
    const heroRef = useRef(null);
    const [tab, setTab] = useState('main');
    const [filter, setFilter] = useState('all');

    const currentRawQuests = tab === 'main' ? mainQuests : additionalQuests;
    const normalizedQuests = currentRawQuests.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty || 'medium',
        exp: q.exp_reward || q.exp || 50,
        exp_reward: q.exp_reward || q.exp || 50,
        category: q.category || 'School',
        isCompleted: q.completed || false,
        submissionStatus: q.submission_status || null,
        rejectionReason: q.rejection_reason || null,
    }));

    const filteredQuests = normalizedQuests.filter(q => {
        if (filter === 'active') return !q.isCompleted && q.submissionStatus !== 'pending';
        if (filter === 'pending') return q.submissionStatus === 'pending';
        if (filter === 'completed') return q.isCompleted;
        return true;
    });

    useGSAP(() => {
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { y: -16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
            );
        }

        if (gridRef.current) {
            const cards = gridRef.current.children;
            gsap.fromTo(
                cards,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, { dependencies: [tab, filter], scope: gridRef });

    // Count pending submissions
    const pendingCount = normalizedQuests.filter(q => q.submissionStatus === 'pending').length;
    const completedCount = normalizedQuests.filter(q => q.isCompleted).length;

    return (
        <StudentLayout>
            <Head title="Papan Quest Petualang" />

            {/* ─── Adventurers Guildhall & Quest Notice Board Hero Banner ─── */}
            <div 
                ref={heroRef}
                className="glass-card p-5 sm:p-7 md:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-[#13110e] to-[#0a0704] border-l-4 border-l-amber-500 shadow-2xl border-2 mb-6 sm:mb-8"
            >
                {/* Ambient Warm Hearth Glow */}
                <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative z-10">
                    {/* Left Column: Guild Header Info */}
                    <div className="space-y-3.5 max-w-xl flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-game text-[8px] sm:text-[9px] tracking-wider uppercase">
                            <span>📜</span>
                            <span>ADVENTURERS GUILDHQ • NOTICE BOARD</span>
                        </div>

                        <div>
                            <h1 className="font-game text-base sm:text-xl md:text-2xl text-white tracking-wider drop-shadow-md flex items-center gap-2.5">
                                <ClipboardDocumentListIcon className="w-6 h-6 text-amber-400 shrink-0" />
                                <span>PAPAN QUEST PETUALANG</span>
                            </h1>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-body mt-2">
                                Selamat datang di Balai Petualang! Pilih misi harian & tantangan ekstra dari papan buletin, selesaikan tugas belajarmu, lalu kumpulkan EXP untuk menaikkan pangkat rank petualangmu.
                            </p>
                        </div>

                        {/* Quick Guild Metric Badges */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                                Total: <strong className="text-white">{currentRawQuests.length}</strong> Quest
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                                Selesai: <strong>{completedCount}</strong>
                            </span>
                            {pendingCount > 0 && (
                                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-amber-400">
                                    Pending: <strong>{pendingCount}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Interactive Adventurers Guild Scene Viewport */}
                    <div className="w-full lg:w-[380px] xl:w-[440px] shrink-0">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-600/30 bg-[#0c0703] shadow-2xl group hover:border-amber-500/60 transition-colors">
                            {/* Top Header Strip */}
                            <div className="px-3 py-2 bg-[#140b04] border-b border-amber-950/80 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-game text-amber-300 tracking-wider">
                                    <span>📜</span>
                                    <span>GUILD NOTICE BOARD</span>
                                </span>
                                <span className="text-[9px] font-mono text-amber-300/90 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                                    BOUNTY ROOM
                                </span>
                            </div>

                            {/* Animated Guild Hall Canvas */}
                            <div className="w-full h-48 sm:h-56 bg-[#140b04] overflow-hidden flex items-center justify-center">
                                <GuildHallScene
                                    idPrefix="quests-guild"
                                    className="w-full h-full object-contain transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                                />
                            </div>

                            {/* Bottom Info Strip */}
                            <div className="p-2.5 bg-[#140b04]/95 border-t border-amber-950/80 flex items-center justify-between text-[10px] font-mono text-amber-200/80">
                                <span className="truncate flex items-center gap-1.5">
                                    <span>⚔️</span> Papan pengumuman quest aktif
                                </span>
                                <span className="text-amber-400 font-bold shrink-0">
                                    {tab === 'main' ? 'Main Quests' : 'Extra Quests'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex overflow-x-auto gap-4 sm:gap-6 mb-5 sm:mb-6 border-b border-slate-800 pb-px">
                <button 
                    onClick={() => setTab('main')}
                    className={`pb-3 px-1 font-game text-[9px] sm:text-[10px] tracking-wider uppercase transition-colors relative cursor-pointer shrink-0 ${tab === 'main' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    MAIN QUESTS ({mainQuests.length})
                    {tab === 'main' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                </button>
                <button 
                    onClick={() => setTab('additional')}
                    className={`pb-3 px-1 font-game text-[9px] sm:text-[10px] tracking-wider uppercase transition-colors relative cursor-pointer shrink-0 ${tab === 'additional' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    ADDITIONAL QUESTS ({additionalQuests.length})
                    {tab === 'additional' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 glass-card p-2.5 sm:p-3 border-2">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['all', 'active', 'pending', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg font-game text-[8px] sm:text-[9px] tracking-wider uppercase transition-all cursor-pointer ${
                                filter === f 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' 
                                    : 'bg-transparent text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                            {f === 'all' ? 'SEMUA' : f === 'active' ? 'AKTIF' : f === 'pending' ? `PENDING${pendingCount > 0 ? ` (${pendingCount})` : ''}` : 'SELESAI'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quests Grid */}
            {filteredQuests.length > 0 ? (
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredQuests.map(quest => (
                        <QuestCard 
                            key={quest.id} 
                            quest={quest} 
                            isCompleted={quest.isCompleted}
                            submissionStatus={quest.submissionStatus}
                            rejectionReason={quest.rejectionReason}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-8 sm:p-12 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
                    <ClipboardDocumentListIcon className="w-10 h-10 mb-3 text-slate-500 opacity-60" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-300 mb-1">Belum Ada Quest</h3>
                    <p className="text-slate-500 text-xs">Tidak ada quest untuk kriteria filter ini.</p>
                </div>
            )}
        </StudentLayout>
    );
}
