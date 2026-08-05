import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import StatCard from '@/Components/StatCard';
import ScheduleTimeline from '@/Components/ScheduleTimeline';
import QuestCard from '@/Components/QuestCard';
import AchievementBadge from '@/Components/AchievementBadge';
import { StarIcon, CheckBadgeIcon, FireIcon, TrophyIcon } from '@heroicons/react/24/solid';

export default function Dashboard() {
    // Mock data
    const user = {
        name: 'Alex Hunter',
        level: 4,
        rank_name: 'Knight',
        exp: 3450,
        next_level_exp: 5000,
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex',
        class: '10-A Science'
    };

    const stats = {
        totalExp: 15450,
        questsCompleted: 42,
        dayStreak: 7,
        currentRank: 12
    };

    const schedule = [
        { subject: 'Mathematics', room: 'Room 101', startTime: '08:00', endTime: '09:30' },
        { subject: 'Physics Lab', room: 'Lab 3', startTime: '10:00', endTime: '11:30' },
        { subject: 'History', room: 'Room 204', startTime: '12:30', endTime: '14:00' },
    ];

    const recentQuests = [
        { id: 1, title: 'Complete Math Homework', description: 'Finish exercises 1-15 on page 42.', difficulty: 'easy', exp: 100, category: 'Academic' },
        { id: 2, title: 'Physics Project', description: 'Build a small trebuchet model.', difficulty: 'hard', exp: 500, category: 'Project' },
    ];

    const achievements = [
        { id: 1, title: 'First Blood', description: 'Complete your first quest', isUnlocked: true },
        { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', isUnlocked: true },
        { id: 3, title: 'Teacher\'s Pet', description: 'Get 100% on a major exam', isUnlocked: false },
    ];

    return (
        <StudentLayout user={user}>
            <Head title="Dashboard" />

            {/* Hero Section */}
            <div className="glass-card p-6 md:p-8 mb-8 relative overflow-hidden bg-gradient-to-r from-bg-card to-gray-900 border-l-4 border-l-accent-cyan">
                {/* Background decoration */}
                <div className="absolute -right-20 -top-20 opacity-10 transform rotate-12 scale-150 pointer-events-none">
                    <StarIcon className="w-64 h-64 text-accent-cyan" />
                </div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl p-1 bg-gradient-to-br from-accent-cyan to-accent-purple shadow-lg shadow-accent-cyan/20">
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl bg-gray-900" />
                        </div>
                        <div className="absolute -bottom-4 -right-4">
                            <LevelBadge level={user.level} rankName="" size="md" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left mt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                                <p className="text-gray-400 font-bold">{user.class} • <span className="text-accent-gold">{user.rank_name}</span></p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-4 max-w-2xl">
                            <ExpBar currentExp={user.exp} requiredExp={user.next_level_exp} />
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                {user.next_level_exp - user.exp} EXP to next level
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={StarIcon} label="Total EXP" value={stats.totalExp} color="cyan" />
                <StatCard icon={CheckBadgeIcon} label="Quests Done" value={stats.questsCompleted} color="emerald" />
                <StatCard icon={FireIcon} label="Day Streak" value={stats.dayStreak} color="gold" />
                <StatCard icon={TrophyIcon} label="Current Rank" value={`#${stats.currentRank}`} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Active Quests Preview */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-game text-white flex items-center gap-2">
                                <span className="text-accent-cyan">#</span> Active Quests
                            </h2>
                            <Link href="/student/quests" className="text-xs font-bold text-accent-cyan hover:text-white transition-colors">
                                VIEW ALL &rarr;
                            </Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {recentQuests.map(quest => (
                                <QuestCard key={quest.id} quest={quest} isCompleted={false} />
                            ))}
                        </div>
                    </section>

                    {/* Achievements Preview */}
                    <section className="glass-card p-6">
                        <h2 className="text-xl font-game text-white mb-6">Recent Achievements</h2>
                        <div className="flex flex-wrap justify-around gap-4">
                            {achievements.map(ach => (
                                <AchievementBadge key={ach.id} achievement={ach} isUnlocked={ach.isUnlocked} />
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-8">
                    {/* Schedule */}
                    <section className="glass-card p-6 h-full border-t-4 border-t-accent-purple">
                        <h2 className="text-xl font-game text-white mb-6 text-center">Today's Schedule</h2>
                        <ScheduleTimeline schedule={schedule} />
                    </section>
                </div>
            </div>

        </StudentLayout>
    );
}
