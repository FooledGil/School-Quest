import React, { useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/StatCard';
import CastleScene from '@/Components/Login/CastleScene';
import CastleIntroModal from '@/Components/Login/CastleIntroModal';
import { 
    UsersIcon, 
    ClipboardDocumentListIcon, 
    CheckCircleIcon, 
    ChartBarIcon, 
    PlayIcon, 
    SparklesIcon, 
    ShieldCheckIcon,
    ArrowRightIcon,
    RadioIcon
} from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard({ stats = {}, topPerformers = [], recentCompletions = [] }) {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user || {};

    const [showFlexModal, setShowFlexModal] = useState(false);

    useGSAP(() => {
        if (pageRef.current) {
            const tl = gsap.timeline();

            if (heroRef.current) {
                tl.fromTo(
                    heroRef.current,
                    { y: -24, opacity: 0, scale: 0.98 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
                );
            }

            if (statsRef.current) {
                const statCards = statsRef.current.querySelectorAll('.stat-card');
                tl.fromTo(
                    statCards,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power2.out' },
                    '-=0.3'
                );
            }

            const performers = pageRef.current.querySelectorAll('.performer-item');
            if (performers.length > 0) {
                tl.fromTo(
                    performers,
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
                    '-=0.2'
                );
            }

            const completions = pageRef.current.querySelectorAll('.completion-item');
            if (completions.length > 0) {
                tl.fromTo(
                    completions,
                    { x: 20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
                    '-=0.3'
                );
            }
        }
    }, { scope: pageRef });

    return (
        <AdminLayout user={user}>
            <Head title="Admin Dashboard - Realm Command" />

            <div ref={pageRef} className="space-y-6 sm:space-y-8">
                {/* ─── Grand Realm Command Center Hero Banner ─── */}
                <div 
                    ref={heroRef}
                    className="relative overflow-hidden rounded-2xl lg:rounded-3xl border-2 border-[#1e2e4a] bg-gradient-to-br from-[#0c1424] via-[#101b30] to-[#0a101d] p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                    {/* Background Radial Ambiance */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
                        {/* Left Command Info */}
                        <div className="flex-1 space-y-4 max-w-2xl">
                            {/* Live Realm Status Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-[10px] sm:text-xs font-mono font-bold text-amber-300">
                                    <span className="text-xs">🛡️</span>
                                    CITADEL CORE OPERATIONAL
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-xs font-mono font-semibold text-blue-300">
                                    <ShieldCheckIcon className="w-3.5 h-3.5 text-blue-400" />
                                    REALM OVERSEER
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] sm:text-xs font-mono text-amber-300">
                                    <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
                                    60 FPS LIVE SVG
                                </span>
                            </div>

                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide font-body">
                                    Pusat Kendali Realm & Citadel
                                </h1>
                                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed font-body">
                                    Selamat bertugas, <span className="text-amber-400 font-bold">{user.name || 'Administrator'}</span>. Pantau aktivitas petualangan siswa, verifikasi tantangan quest harian, dan pertahankan stabilitas realm Sekolah.
                                </p>
                            </div>

                            {/* Action CTA Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                {/* Flex Mode Replay Trigger Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowFlexModal(true)}
                                    className="group px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-game text-[10px] sm:text-xs tracking-wider shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer font-bold select-none border border-amber-300"
                                    aria-label="Putar animasi gerbang sinematik"
                                >
                                    <PlayIcon className="w-4 h-4 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
                                    <span>REPLAY GERBANG (FLEX)</span>
                                </button>

                                <Link
                                    href="/admin/validations"
                                    className="px-4 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>Validasi Quest</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400" />
                                </Link>

                                <Link
                                    href="/admin/quests"
                                    className="px-4 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/40 text-blue-300 border border-blue-800/50 hover:border-blue-600 text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <span>Kelola Quest</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5 text-blue-400" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Interactive Animated Citadel Viewport (Flex Widget) */}
                        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
                            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 bg-[#070d18] shadow-2xl group hover:border-blue-400/60 transition-colors">
                                {/* Live Cam Header Label */}
                                <div className="absolute top-2 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-amber-400/40 text-[9px] font-mono text-amber-300 font-bold tracking-wider">
                                        <span className="text-[9px]">⚔️</span>
                                        LIVE CITADEL CAM
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-400 bg-black/60 px-1.5 py-0.5 rounded">
                                        FPS: 60
                                    </span>
                                </div>

                                {/* Active SVG Citadel Canvas */}
                                <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden cursor-pointer" onClick={() => setShowFlexModal(true)}>
                                    <CastleScene
                                        idPrefix="admin-preview"
                                        className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Bottom Info Strip */}
                                <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                                    <span className="truncate flex items-center gap-1">
                                        <span className="text-amber-400">⚡</span> Realm Fortress Realm-01
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowFlexModal(true)}
                                        className="text-blue-400 hover:text-blue-300 font-bold hover:underline shrink-0"
                                    >
                                        Buka Gerbang &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Stats Grid ─── */}
                <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="stat-card">
                        <StatCard icon={UsersIcon} label="Total Murid" value={stats.total_students || 0} color="blue" />
                    </div>
                    <div className="stat-card">
                        <StatCard icon={ClipboardDocumentListIcon} label="Quest Aktif" value={stats.total_quests || 0} color="purple" />
                    </div>
                    <div className="stat-card">
                        <StatCard icon={CheckCircleIcon} label="Selesai Hari Ini" value={stats.completions_today || 0} color="emerald" />
                    </div>
                    <div className="stat-card">
                        <StatCard icon={ChartBarIcon} label="Rata-rata Level" value={stats.avg_level || 1.0} color="gold" />
                    </div>
                </div>

                {/* ─── Two-Column Tables (Top Performers & Recent Activity) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Top Performers */}
                    <div className="glass-card p-4 sm:p-6 min-w-0 border-2">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                <span>🏆</span>
                                <span>Murid Teratas</span>
                            </h2>
                            <Link href="/admin/students" className="text-xs font-semibold text-blue-400 hover:underline">Lihat Semua &rarr;</Link>
                        </div>
                        <div className="space-y-2.5 sm:space-y-3">
                            {topPerformers.map((student, idx) => (
                                <div key={student.id} className="performer-item flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors gap-3">
                                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700 shrink-0">
                                            #{idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-xs sm:text-sm truncate">{student.name}</p>
                                            <p className="text-[11px] text-slate-400 truncate">Kelas {student.class || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-400 font-bold text-xs sm:text-sm shrink-0">
                                        {(student.exp || 0).toLocaleString()} <span className="hidden sm:inline">EXP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-4 sm:p-6 min-w-0 border-2">
                        <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                            <span>📜</span>
                            <span>Aktivitas Selesai Terbaru</span>
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                            {recentCompletions.length > 0 ? (
                                recentCompletions.map((activity) => (
                                    <div key={activity.id} className="completion-item flex items-start gap-2.5 sm:gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                                <span className="font-bold text-white">{activity.user?.name || 'Siswa'}</span> menyelesaikan{' '}
                                                <span className="text-blue-400 font-semibold">{activity.quest?.title || 'Quest'}</span>
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                                                {activity.completed_at ? new Date(activity.completed_at).toLocaleTimeString('id-ID') : 'Baru saja'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">Belum ada aktivitas penyelesaian quest hari ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Fullscreen Intro Modal Triggered on Demand (Flex Mode) */}
            {showFlexModal && (
                <CastleIntroModal
                    redirectUrl="/admin/dashboard"
                    onClose={() => setShowFlexModal(false)}
                />
            )}
        </AdminLayout>
    );
}

