import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import StatCard from '@/Components/StatCard';
import ScheduleTimeline from '@/Components/ScheduleTimeline';
import QuestCard from '@/Components/QuestCard';
import AchievementBadge from '@/Components/AchievementBadge';
import { StarIcon, CheckBadgeIcon, FireIcon, TrophyIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { CrossedSwordsIcon } from '@/Components/Icons/SwordIcon';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { getAvatarUrl } from '@/Utils/avatar';

export default function Dashboard({ user: propUser, schedules = [], stats = {}, recentQuests = [], achievements = [] }) {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const questsRef = useRef(null);
    const achievementsRef = useRef(null);
    const scheduleRef = useRef(null);

    const user = propUser || {};
    const avatar = getAvatarUrl(user);
    const rankName = stats.rank || 'Novice';
    const nextLevelExp = stats.nextLevelExp || 100;

    useGSAP(() => {
        if (pageRef.current) {
            const tl = gsap.timeline();

            if (heroRef.current) {
                tl.fromTo(
                    heroRef.current,
                    { y: -20, opacity: 0, scale: 0.98 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
                );
            }

            if (statsRef.current) {
                const statCards = statsRef.current.querySelectorAll('.stat-card');
                tl.fromTo(
                    statCards,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
                    "-=0.3"
                );
            }

            if (questsRef.current) {
                tl.fromTo(
                    questsRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
                    "-=0.2"
                );
            }

            if (achievementsRef.current) {
                tl.fromTo(
                    achievementsRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
                    "-=0.2"
                );
            }

            if (scheduleRef.current) {
                tl.fromTo(
                    scheduleRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
                    "-=0.3"
                );
            }
        }
    }, { scope: pageRef });

    return (
        <StudentLayout user={user}>
            <Head title="Dashboard" />

            <div ref={pageRef} className="space-y-6 sm:space-y-8">
                {/* Hero Section */}
                <div ref={heroRef} className="glass-card p-4 sm:p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/80 to-blue-950/40 border-l-4 border-l-blue-500 shadow-xl border-2">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
                        {/* Avatar Frame */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-700 p-1 shadow-lg shadow-blue-500/30">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={avatar} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                        style={{ imageRendering: 'pixelated' }} 
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2">
                                <LevelBadge level={user.level || 1} size="sm" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div>
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-wide truncate">
                                        {user.name}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-400 font-mono">
                                        NISN: {user.nisn} • {user.class}
                                    </p>
                                </div>
                                <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold self-center sm:self-auto">
                                    <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{rankName}</span>
                                </div>
                            </div>

                            {/* EXP Progression */}
                            <div className="mt-3 sm:mt-4 max-w-xl">
                                <ExpBar 
                                    currentExp={user.exp || 0} 
                                    nextLevelExp={nextLevelExp} 
                                    level={user.level || 1} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ambient Background Glow */}
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                </div>

                {/* Stats Grid */}
                <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="stat-card">
                        <StatCard 
                            title="Total EXP" 
                            value={stats.totalExp || 0} 
                            icon={StarIcon} 
                            color="amber" 
                        />
                    </div>
                    <div className="stat-card">
                        <StatCard 
                            title="Quest Selesai" 
                            value={stats.completedQuests || 0} 
                            icon={CheckBadgeIcon} 
                            color="emerald" 
                        />
                    </div>
                    <div className="stat-card">
                        <StatCard 
                            title="Daily Streak" 
                            value={`${stats.streak || 0} Hari`} 
                            icon={FireIcon} 
                            color="rose" 
                        />
                    </div>
                    <div className="stat-card">
                        <StatCard 
                            title="Peringkat" 
                            value={`#${stats.rankPosition || '-'}`} 
                            icon={TrophyIcon} 
                            color="blue" 
                        />
                    </div>
                </div>

                {/* Main Grid: Left Quests/Achievements, Right Schedule */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                        
                        {/* Active Quests Preview */}
                        <section>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h2 className="font-game text-xs sm:text-sm text-white flex items-center gap-2 tracking-wider">
                                    <CrossedSwordsIcon className="w-4 h-4 text-amber-400" />
                                    <span>QUEST AKTIF</span>
                                </h2>
                                <Link href="/quests" className="font-game text-[10px] sm:text-xs text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                                    SEMUA &rarr;
                                </Link>
                            </div>
                            {recentQuests.length > 0 ? (
                                <div ref={questsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentQuests.map(quest => (
                                        <QuestCard key={quest.id} quest={quest} isCompleted={false} />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-6 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span>Semua quest hari ini telah diselesaikan!</span>
                                </div>
                            )}
                        </section>

                        {/* Achievements Preview */}
                        <section className="glass-card p-4 sm:p-6 border-2">
                            <h2 className="font-game text-xs sm:text-sm text-white mb-4 sm:mb-6 tracking-wider flex items-center gap-2">
                                <TrophyIcon className="w-4 h-4 text-amber-400" />
                                <span>PENCAPAIAN / ACHIEVEMENTS</span>
                            </h2>
                            <div ref={achievementsRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
                                {achievements.slice(0, 5).map(ach => (
                                    <AchievementBadge key={ach.id} achievement={ach} isUnlocked={ach.isUnlocked} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6 sm:space-y-8 min-w-0">
                        {/* Schedule */}
                        <section ref={scheduleRef} className="glass-card p-4 sm:p-6 border-t-4 border-t-blue-500 border-2">
                            <h2 className="font-game text-xs sm:text-sm text-white mb-4 sm:mb-6 text-center tracking-wider flex items-center justify-center gap-2">
                                <CalendarDaysIcon className="w-4 h-4 text-blue-400" />
                                <span>JADWAL HARI INI</span>
                            </h2>
                            <ScheduleTimeline schedule={schedules.map(s => ({
                                subject: s.subject?.name || 'Pelajaran',
                                room: s.teacher ? `${s.teacher} • ${s.class}` : s.class,
                                startTime: s.time_start?.substring(0, 5) || '07:30',
                                endTime: s.time_end?.substring(0, 5) || '09:00',
                                icon: s.subject?.icon || 'book'
                            }))} />
                        </section>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
}
