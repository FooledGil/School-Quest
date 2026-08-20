import React, { useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import StatCard from '@/Components/StatCard';
import ScheduleTimeline from '@/Components/ScheduleTimeline';
import QuestCard from '@/Components/QuestCard';
import AchievementBadge from '@/Components/AchievementBadge';
import { StarIcon, CheckBadgeIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard({ user: propUser, schedules = [], stats = {}, recentQuests = [], achievements = [] }) {
    const pageRef = useRef(null);
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const questsRef = useRef(null);
    const achievementsRef = useRef(null);
    const scheduleRef = useRef(null);

    const user = propUser || {};
    const avatar = user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.avatar_seed || user.name || 'Alex')}`;
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

            if (statsRef.current && statsRef.current.children.length > 0) {
                tl.fromTo(
                    statsRef.current.children,
                    { y: 20, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' },
                    '-=0.3'
                );
            }

            if (questsRef.current && questsRef.current.children.length > 0) {
                tl.fromTo(
                    questsRef.current.children,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
                    '-=0.2'
                );
            }

            if (achievementsRef.current && achievementsRef.current.children.length > 0) {
                tl.fromTo(
                    achievementsRef.current.children,
                    { scale: 0.7, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'back.out(1.5)' },
                    '-=0.2'
                );
            }

            if (scheduleRef.current) {
                tl.fromTo(
                    scheduleRef.current,
                    { x: 30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
                    '-=0.4'
                );
            }
        }
    }, { scope: pageRef });

    return (
        <StudentLayout user={{ ...user, avatar, rank_name: rankName, next_level_exp: nextLevelExp }}>
            <Head title="Dashboard" />

            <div ref={pageRef} className="space-y-6 sm:space-y-8">
                {/* Hero Section */}
                <div ref={heroRef} className="glass-card p-4 sm:p-6 md:p-8 relative overflow-hidden bg-slate-900/60 border-l-4 border-l-blue-500 shadow-xl">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10">
                        <div className="relative group shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl p-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md transform transition-transform group-hover:scale-105">
                                <img src={avatar} alt={user.name} className="w-full h-full rounded-xl bg-slate-950 object-cover" />
                            </div>
                        </div>

                        <div className="flex-1 text-center sm:text-left min-w-0 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                <div className="min-w-0">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight truncate">{user.name}</h1>
                                    <p className="text-slate-400 font-medium text-xs sm:text-sm">Kelas {user.class || 'Siswa'} • <span className="text-amber-400 font-bold">{rankName}</span></p>
                                </div>
                                <div className="mt-1 sm:mt-0 shrink-0 self-center sm:self-auto">
                                    <LevelBadge level={user.level || 1} size="md" />
                                </div>
                            </div>

                            <div className="mt-3 sm:mt-4 max-w-2xl">
                                <ExpBar currentExp={user.exp || 0} requiredExp={nextLevelExp} />
                                <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5 sm:mt-2 text-center sm:text-right">
                                    {Math.max(0, nextLevelExp - (user.exp || 0))} EXP menuju level berikutnya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard icon={StarIcon} label="Total EXP" value={user.exp || 0} color="blue" />
                    <StatCard icon={CheckBadgeIcon} label="Quests Done" value={stats.questsCompleted || 0} color="emerald" />
                    <StatCard icon={FireIcon} label="Day Streak" value={stats.streak || 0} color="gold" />
                    <StatCard icon={TrophyIcon} label="Rank Level" value={`Lvl ${user.level || 1}`} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                        
                        {/* Active Quests Preview */}
                        <section>
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <span className="text-blue-400">#</span> Quest Aktif
                                </h2>
                                <Link href="/quests" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    Lihat Semua &rarr;
                                </Link>
                            </div>
                            {recentQuests.length > 0 ? (
                                <div ref={questsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentQuests.map(quest => (
                                        <QuestCard key={quest.id} quest={quest} isCompleted={false} />
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-6 text-center text-slate-400 text-sm">
                                    Semua quest hari ini telah diselesaikan! 🎉
                                </div>
                            )}
                        </section>

                        {/* Achievements Preview */}
                        <section className="glass-card p-4 sm:p-6">
                            <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Pencapaian (Achievements)</h2>
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
                        <section ref={scheduleRef} className="glass-card p-4 sm:p-6 border-t-2 border-t-blue-500">
                            <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 text-center">Jadwal Hari Ini</h2>
                            <ScheduleTimeline schedule={schedules.map(s => ({
                                subject: s.subject?.name || 'Pelajaran',
                                room: s.teacher ? `${s.teacher} • ${s.class}` : s.class,
                                startTime: s.time_start?.substring(0, 5) || '07:30',
                                endTime: s.time_end?.substring(0, 5) || '09:00',
                                icon: s.subject?.icon || '📚'
                            }))} />
                        </section>
                    </div>
                </div>
            </div>

        </StudentLayout>
    );
}
