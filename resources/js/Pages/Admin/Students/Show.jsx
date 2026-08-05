import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';

export default function StudentShow() {
    const adminUser = { name: 'Admin Principal', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' };

    // Mock student
    const student = {
        id: 12, name: 'Alex Hunter', nisn: '1234567890', class: '10-A Science', 
        level: 4, rank_name: 'Knight', exp: 3450, next_level_exp: 5000, 
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex',
        joinDate: 'Aug 2023'
    };

    const questHistory = [
        { id: 1, title: 'Math Homework', type: 'Main', date: '2023-10-24', exp: 100 },
        { id: 2, title: 'Science Lab Report', type: 'Main', date: '2023-10-22', exp: 250 },
        { id: 3, title: 'Help Library', type: 'Additional', date: '2023-10-20', exp: 150 },
    ];

    // Simple bar chart data for EXP gained per day over a week
    const expTimeline = [100, 0, 350, 150, 0, 500, 100];
    const maxExp = Math.max(...expTimeline);

    return (
        <AdminLayout user={adminUser}>
            <Head title={`Student: ${student.name}`} />

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/students" className="text-gray-400 hover:text-white">&larr; Back to List</Link>
                <h1 className="text-2xl font-bold text-white">Student Profile</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card p-6 flex flex-col items-center">
                    <img src={student.avatar} alt={student.name} className="w-24 h-24 rounded-lg bg-gray-800 border-2 border-gray-700 mb-4" />
                    <h2 className="text-xl font-bold text-white">{student.name}</h2>
                    <p className="text-sm text-gray-400 mb-6">{student.nisn} • {student.class}</p>

                    <div className="w-full mb-6 flex justify-center scale-110 mt-2">
                        <LevelBadge level={student.level} rankName={student.rank_name} size="md" />
                    </div>

                    <ExpBar currentExp={student.exp} requiredExp={student.next_level_exp} className="w-full mb-4" />

                    <div className="w-full grid grid-cols-2 gap-2 mt-4 text-sm text-center">
                        <div className="bg-black/30 p-2 rounded border border-gray-800">
                            <p className="text-gray-500 text-xs">Quests Done</p>
                            <p className="font-bold text-white">42</p>
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-gray-800">
                            <p className="text-gray-500 text-xs">Current Streak</p>
                            <p className="font-bold text-accent-emerald">7 Days</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Activity Chart */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-6">EXP Gain (Last 7 Days)</h3>
                        <div className="flex items-end justify-between h-40 gap-2">
                            {expTimeline.map((exp, i) => {
                                const height = maxExp > 0 ? (exp / maxExp) * 100 : 0;
                                return (
                                    <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                                        <div className="w-full max-w-[40px] bg-gray-800 rounded-t-sm relative h-full flex items-end overflow-hidden">
                                            <div 
                                                className="w-full bg-gradient-to-t from-accent-cyan to-accent-purple transition-all duration-1000 ease-out group-hover:opacity-80"
                                                style={{ height: `${height}%` }}
                                            ></div>
                                            {exp > 0 && (
                                                <div className="absolute top-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-game text-white z-10 pt-1">
                                                    {exp}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">D{i+1}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quest History Table */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Quest Completions</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-500">
                                        <th className="pb-2">Date</th>
                                        <th className="pb-2">Quest Title</th>
                                        <th className="pb-2">Type</th>
                                        <th className="pb-2 text-right">EXP Gained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questHistory.map(q => (
                                        <tr key={q.id} className="border-b border-gray-800/30">
                                            <td className="py-3 text-gray-400">{q.date}</td>
                                            <td className="py-3 font-bold text-white">{q.title}</td>
                                            <td className="py-3 text-gray-400">{q.type}</td>
                                            <td className="py-3 text-right font-game text-[10px] text-accent-gold">+{q.exp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
