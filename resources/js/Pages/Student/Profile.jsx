import React from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import AchievementBadge from '@/Components/AchievementBadge';

export default function Profile() {
    const user = { name: 'Alex Hunter', nisn: '1234567890', level: 4, rank_name: 'Knight', exp: 3450, next_level_exp: 5000, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex', class: '10-A Science', joinDate: 'Aug 2023' };

    const achievements = [
        { id: 1, title: 'First Blood', description: 'Complete your first quest', isUnlocked: true },
        { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', isUnlocked: true },
        { id: 3, title: 'Teacher\'s Pet', description: 'Get 100% on a major exam', isUnlocked: false },
        { id: 4, title: 'Social Butterfly', description: 'Complete 5 community quests', isUnlocked: true },
        { id: 5, title: 'Speed Demon', description: 'Complete a quest within 1 hour', isUnlocked: false },
    ];

    const questHistory = [
        { id: 1, title: 'Math Homework', date: '2023-10-24', exp: 100 },
        { id: 2, title: 'Science Lab Report', date: '2023-10-22', exp: 250 },
        { id: 3, title: 'Help Library', date: '2023-10-20', exp: 150 },
    ];

    return (
        <StudentLayout user={user}>
            <Head title="Profile" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="glass-card p-8 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Banner bg */}
                        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-accent-purple to-accent-cyan opacity-20"></div>
                        
                        <div className="relative z-10 w-32 h-32 rounded-full border-4 border-gray-800 p-1 bg-black shadow-2xl mb-4 mt-8">
                            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                        <p className="text-accent-cyan font-game text-xs mb-4">{user.class}</p>
                        
                        <div className="w-full space-y-3 text-sm text-left bg-black/40 p-4 rounded-lg border border-gray-800 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">NISN</span>
                                <span className="text-white font-mono">{user.nisn}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Joined</span>
                                <span className="text-white">{user.joinDate}</span>
                            </div>
                        </div>

                        <div className="w-full scale-110 mb-8 mt-2">
                            <LevelBadge level={user.level} rankName={user.rank_name} size="lg" className="mx-auto" />
                        </div>

                        <ExpBar currentExp={user.exp} requiredExp={user.next_level_exp} className="w-full" />
                        <p className="text-xs text-gray-500 mt-2">Level {user.level + 1} requires {user.next_level_exp.toLocaleString()} EXP</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2 space-y-8">
                    
                    {/* Achievements Collection */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-game text-white mb-6 border-b border-gray-800 pb-4">Achievement Gallery</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                            {achievements.map(ach => (
                                <AchievementBadge key={ach.id} achievement={ach} isUnlocked={ach.isUnlocked} />
                            ))}
                        </div>
                    </div>

                    {/* Quest History */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-game text-white mb-6 border-b border-gray-800 pb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {questHistory.map((quest) => (
                                <div key={quest.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-800/50 hover:border-gray-600 transition-colors">
                                    <div>
                                        <p className="font-bold text-white">{quest.title}</p>
                                        <p className="text-xs text-gray-500">{quest.date}</p>
                                    </div>
                                    <div className="text-accent-gold font-game text-xs">
                                        +{quest.exp} EXP
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 mt-4 text-xs font-bold text-gray-400 hover:text-white transition-colors border border-gray-800 rounded-lg hover:bg-gray-800">
                                View Full History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
