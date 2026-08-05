import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/StatCard';
import { UsersIcon, ClipboardDocumentListIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const user = { name: 'Admin Principal', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' };

    const stats = {
        totalStudents: 450,
        activeQuests: 24,
        questsCompletedToday: 186,
        avgLevel: 4.2
    };

    const topPerformers = [
        { id: 1, name: 'Sarah Connor', class: '10-A Science', expGained: 450 },
        { id: 2, name: 'John Doe', class: '10-B Math', expGained: 380 },
        { id: 3, name: 'Emma Stone', class: '10-A Science', expGained: 350 },
    ];

    const recentCompletions = [
        { id: 1, student: 'Alex Hunter', quest: 'Math Homework', time: '10 mins ago' },
        { id: 2, student: 'Mike Ross', quest: 'Physics Lab', time: '25 mins ago' },
        { id: 3, student: 'Sarah Connor', quest: 'Library Help', time: '1 hour ago' },
    ];

    return (
        <AdminLayout user={user}>
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">System Overview</h1>
                <p className="text-gray-400">Monitor school-wide quest progress.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={UsersIcon} label="Total Students" value={stats.totalStudents} color="cyan" />
                <StatCard icon={ClipboardDocumentListIcon} label="Active Quests" value={stats.activeQuests} color="purple" />
                <StatCard icon={CheckCircleIcon} label="Done Today" value={stats.questsCompletedToday} color="emerald" />
                <StatCard icon={ChartBarIcon} label="Avg. Level" value={stats.avgLevel} color="gold" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Performers */}
                <div className="glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white">Top Performers Today</h2>
                        <Link href="/admin/students" className="text-xs text-accent-cyan hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {topPerformers.map((student, idx) => (
                            <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center font-game text-xs text-accent-gold">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.class}</p>
                                    </div>
                                </div>
                                <div className="text-accent-emerald font-bold text-sm">
                                    +{student.expGained} EXP
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Recent Quest Completions</h2>
                    <div className="space-y-4">
                        {recentCompletions.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="mt-1">
                                    <CheckCircleIcon className="w-5 h-5 text-accent-emerald" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-bold text-white">{activity.student}</span> completed{' '}
                                        <span className="text-accent-cyan font-bold">{activity.quest}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
