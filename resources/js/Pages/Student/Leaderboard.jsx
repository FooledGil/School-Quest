import React, { useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import PodiumDisplay from '@/Components/PodiumDisplay';
import LevelBadge from '@/Components/LevelBadge';
import { 
    TrophyIcon, 
    BoltIcon, 
    ClockIcon, 
    InformationCircleIcon, 
    FireIcon, 
    SparklesIcon, 
    XMarkIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { getAvatarUrl } from '@/Utils/avatar';

export default function Leaderboard({ 
    students = [], 
    overallStudents = [], 
    weeklyStudents = [], 
    myRank = null, 
    resetInfo = null 
}) {
    const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' or 'overall'
    const [showInfoModal, setShowInfoModal] = useState(false);
    const tableBodyRef = useRef(null);
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    // Determine dataset according to active tab
    const currentList = activeTab === 'weekly' 
        ? (weeklyStudents.length > 0 ? weeklyStudents : students)
        : (overallStudents.length > 0 ? overallStudents : students);

    const normalizedStudents = currentList.map((s, idx) => ({
        id: s.id,
        name: s.name,
        class: s.class || 'Siswa',
        level: s.level || 1,
        exp: s.exp || 0,
        weekly_exp: s.weekly_exp ?? 0,
        rank_name: s.rank_name || 'Novice',
        avatar: getAvatarUrl(s),
        rank_number: idx + 1
    }));

    useGSAP(() => {
        if (tableBodyRef.current && normalizedStudents.length > 0) {
            const rows = tableBodyRef.current.querySelectorAll('tr');
            gsap.fromTo(
                rows,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
            );
        }
    }, { dependencies: [activeTab, currentList], scope: tableBodyRef });

    return (
        <StudentLayout>
            <Head title="Hall of Fame - Leaderboard" />

            {/* Header Title */}
            <div className="mb-4 sm:mb-6 text-center">
                <h1 className="font-game text-lg sm:text-xl md:text-3xl text-white mb-1.5 tracking-wider drop-shadow-md flex items-center justify-center gap-2.5">
                    <TrophyIcon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 drop-shadow-sm" />
                    <span>HALL OF FAME</span>
                </h1>
                <p className="font-mono text-blue-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                    PAPAN PERINGKAT HERO SEKOLAH
                </p>
            </div>

            {/* Tab Switcher & Info Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto mb-5 px-2">
                <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('weekly')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-game text-xs transition-all duration-200 ${
                            activeTab === 'weekly'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold border border-blue-400/40 scale-[1.02]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                    >
                        <BoltIcon className={`w-4 h-4 ${activeTab === 'weekly' ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span>MINGGUAN (WEEKLY)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('overall')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-game text-xs transition-all duration-200 ${
                            activeTab === 'overall'
                                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-500/20 font-bold border border-amber-400/40 scale-[1.02]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                    >
                        <TrophyIcon className={`w-4 h-4 ${activeTab === 'overall' ? 'text-yellow-200' : 'text-slate-400'}`} />
                        <span>OVERALL (ALL-TIME)</span>
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => setShowInfoModal(true)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-950/40 border border-blue-800/50 px-3 py-1.5 rounded-lg shadow-sm"
                >
                    <InformationCircleIcon className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-mono text-[11px]">Cara Kerja & Catch-Up</span>
                </button>
            </div>

            {/* Weekly Reset Status Bar */}
            {activeTab === 'weekly' && resetInfo && (
                <div className="max-w-2xl mx-auto mb-4 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="font-medium text-slate-300">
                            Siklus Mingguan: <span className="text-white font-semibold">Reset Setiap 7 Hari</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 font-mono text-[11px] text-amber-400">
                        <ClockIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Reset dlm {resetInfo.days_remaining}h {resetInfo.hours_remaining}j (Senin 00:00 WIB)</span>
                    </div>
                </div>
            )}

            {/* Catch-Up / Challenger Surge Alert Banner */}
            {activeTab === 'weekly' && myRank?.catch_up?.has_boost && (
                <div className="max-w-2xl mx-auto mb-5 bg-gradient-to-r from-amber-950/40 via-blue-950/40 to-amber-950/40 border-2 border-amber-500/40 rounded-xl p-3.5 shadow-lg shadow-amber-500/5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/40 shrink-0 text-amber-400 mt-0.5">
                        <BoltIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h4 className="font-game text-xs sm:text-sm text-amber-300 tracking-wider">
                                {myRank.catch_up.title} AKTIF!
                            </h4>
                            <span className="bg-amber-500/30 text-amber-300 border border-amber-400/50 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full">
                                +{myRank.catch_up.bonus_percentage}% BONUS EXP
                            </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                            {myRank.catch_up.reason} Selesaikan quest hari ini untuk memangkas selisih {myRank.catch_up.gap_to_top3} EXP dengan papan atas!
                        </p>
                    </div>
                </div>
            )}

            {/* Overall Mode Subtitle Banner */}
            {activeTab === 'overall' && (
                <div className="max-w-2xl mx-auto mb-4 bg-amber-950/20 border border-amber-800/40 rounded-xl p-2.5 flex items-center justify-center gap-2 text-xs text-amber-300">
                    <SparklesIcon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-mono text-[11px]">
                        Hall of Fame Abadi: Akumulasi seluruh EXP sepanjang masa tanpa reset.
                    </span>
                </div>
            )}

            {/* Top 3 Podium */}
            {normalizedStudents.length >= 3 && (
                <PodiumDisplay topThree={normalizedStudents.slice(0, 3)} activeTab={activeTab} />
            )}

            {/* Leaderboard Table */}
            <div className="glass-card overflow-hidden mt-6 shadow-xl border-2 border-slate-800/80">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                        <thead>
                            <tr className="bg-slate-950 border-b-2 border-slate-800 font-game text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
                                <th className="p-3 sm:p-4 text-center w-14 sm:w-16">RANK</th>
                                <th className="p-3 sm:p-4">HERO / MURID</th>
                                <th className="p-3 sm:p-4 text-center">KELAS</th>
                                <th className="p-3 sm:p-4 text-center">LEVEL / GELAR</th>
                                <th className="p-3 sm:p-4 text-right">
                                    {activeTab === 'weekly' ? 'EXP PEKAN INI' : 'TOTAL EXP'}
                                </th>
                            </tr>
                        </thead>
                        <tbody ref={tableBodyRef}>
                            {normalizedStudents.map((student, index) => {
                                const isCurrentUser = student.id === currentUserId;
                                const displayExp = activeTab === 'weekly' ? student.weekly_exp : student.exp;
                                
                                return (
                                    <tr 
                                        key={`${activeTab}-${student.id}`} 
                                        className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 
                                            ${isCurrentUser ? 'bg-blue-600/15 border-l-4 border-l-blue-500 font-semibold' : ''}
                                        `}
                                    >
                                        <td className="p-3 sm:p-4 text-center">
                                            <span className={`font-bold text-xs sm:text-sm ${
                                                index === 0 ? 'text-amber-400 drop-shadow-sm' :
                                                index === 1 ? 'text-slate-200' :
                                                index === 2 ? 'text-amber-600' :
                                                'text-slate-500'
                                            }`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="flex items-center gap-2.5 sm:gap-3">
                                                <img 
                                                    src={student.avatar} 
                                                    alt={student.name} 
                                                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 object-cover shrink-0 ${
                                                        index === 0 ? 'border-2 border-amber-400 ring-2 ring-amber-400/20' : 'border border-slate-700'
                                                    }`} 
                                                />
                                                <div className="min-w-0">
                                                    <div className={`text-xs sm:text-sm font-bold truncate flex items-center gap-1.5 ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                                                        <span>{student.name}</span>
                                                        {isCurrentUser && (
                                                            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[9px] px-1.5 py-0.2 rounded">Kamu</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-center text-xs text-slate-400">{student.class}</td>
                                        <td className="p-3 sm:p-4 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <LevelBadge level={student.level} size="sm" />
                                                <span className="font-mono text-[9px] text-slate-500 mt-0.5">{student.rank_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-right">
                                            <div className="font-bold text-xs sm:text-sm text-amber-400 font-mono">
                                                {(displayExp || 0).toLocaleString()}{' '}
                                                <span className="text-[9px] sm:text-[10px] text-slate-500 font-normal">
                                                    {activeTab === 'weekly' ? 'WK EXP' : 'EXP'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sticky/Fixed User Standing Summary Card */}
            {myRank && (
                <div className="mt-5 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border-2 border-blue-500/40 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center shrink-0">
                            <span className="font-game text-amber-400 text-sm">
                                #{activeTab === 'weekly' ? myRank.weekly_rank : myRank.overall_rank}
                            </span>
                        </div>
                        <div>
                            <div className="text-white text-xs sm:text-sm font-bold flex items-center gap-1.5">
                                <span>Status Peringkat Kamu ({activeTab === 'weekly' ? 'Pekan Ini' : 'Sepanjang Masa'})</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                                Peringkat <span className="text-amber-400 font-bold">#{activeTab === 'weekly' ? myRank.weekly_rank : myRank.overall_rank}</span> dengan{' '}
                                <span className="text-white font-bold">
                                    {(activeTab === 'weekly' ? myRank.weekly_exp : myRank.exp).toLocaleString()} EXP
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                        {activeTab === 'weekly' && myRank.weekly_rank > 1 && myRank.next_ahead_name ? (
                            <div className="flex items-center sm:justify-end gap-1.5 text-xs text-amber-300">
                                <ArrowTrendingUpIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-mono text-[11px]">
                                    Butuh <strong className="text-white font-bold">+{myRank.next_ahead_gap} EXP</strong> untuk menyalip #{myRank.weekly_rank - 1} {myRank.next_ahead_name}
                                </span>
                            </div>
                        ) : activeTab === 'weekly' && myRank.weekly_rank === 1 ? (
                            <div className="flex items-center sm:justify-end gap-1.5 text-xs text-emerald-400">
                                <TrophyIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-mono text-[11px] font-bold">
                                    👑 Kamu memimpin papan peringkat pekan ini!
                                </span>
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 font-mono">
                                Terus kerjakan quest harian untuk meningkatkan rank!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Info Modal / Drawer: How System & Catch-Up Works */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="glass-card max-w-lg w-full p-5 sm:p-6 rounded-2xl border-2 border-slate-700 shadow-2xl relative bg-slate-900/95 max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setShowInfoModal(false)}
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400">
                                <InformationCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-game text-sm sm:text-base text-white tracking-wider">
                                    SISTEM LEADERBOARD & CATCH-UP
                                </h3>
                                <p className="font-mono text-[10px] text-slate-400 uppercase">
                                    Mekanisme Adil & Anti-Dominasi
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs text-slate-300">
                            {/* Point 1 */}
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                                    <ClockIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>1. Reset Setiap 7 Hari (Senin 00:00 WIB)</span>
                                </div>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    Papan peringkat <strong>Mingguan (Weekly)</strong> direset ke 0 setiap hari Senin pukul 00:00 WIB. Semua siswa kembali ke garis start yang sama setiap pekannya. Sementara itu, total akumulasi EXP tetap tersimpan di tab <strong>Overall</strong>.
                                </p>
                            </div>

                            {/* Point 2 */}
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                                    <BoltIcon className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>2. Challenger Surge (Anti-Dominasi Early Bird)</span>
                                </div>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    Agar siswa yang mengerjakan lebih awal di hari Senin tidak membuat jarak yang mustahil dikejar, siswa yang tertinggal $\ge 100$ EXP dari Top 3 otomatis mendapatkan bonus <strong>+20% s/d +25% EXP</strong> saat menyelesaikan quest. Jarak poin bisa dipangkas lebih cepat!
                                </p>
                            </div>

                            {/* Point 3 */}
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                                    <FireIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>3. Konsistensi Mengalahkan Kecepatan</span>
                                </div>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    Siswa yang hanya rajin di hari Senin lalu bolos di hari lain akan tersalip oleh siswa yang konsisten login dan menyelesaikan quest setiap hari melalui <strong>Streak Multiplier</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 text-center">
                            <button
                                type="button"
                                onClick={() => setShowInfoModal(false)}
                                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-game text-xs tracking-wider font-bold transition-all shadow-lg shadow-blue-500/20"
                            >
                                MENGERTI & SIAP BERJUANG!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
