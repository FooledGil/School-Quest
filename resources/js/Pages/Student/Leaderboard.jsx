import React from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import PodiumDisplay from '@/Components/PodiumDisplay';
import LevelBadge from '@/Components/LevelBadge';

export default function Leaderboard() {
    const user = { name: 'Alex Hunter', level: 4, rank_name: 'Knight', exp: 3450, next_level_exp: 5000, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex', id: 12 };

    // Mock data
    const leaderboard = [
        { id: 1, name: 'Sarah Connor', class: '10-A Science', level: 7, exp: 12500, quests: 89, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah' },
        { id: 2, name: 'John Doe', class: '10-B Math', level: 6, exp: 10200, quests: 75, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=john' },
        { id: 3, name: 'Emma Stone', class: '10-A Science', level: 6, exp: 9800, quests: 71, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=emma' },
        { id: 4, name: 'Mike Ross', class: '10-C Arts', level: 5, exp: 7500, quests: 54, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mike' },
        { id: 12, name: 'Alex Hunter', class: '10-A Science', level: 4, exp: 3450, quests: 42, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex' }, // Current user
    ];

    return (
        <StudentLayout user={user}>
            <Head title="Leaderboard" />

            <div className="mb-6 text-center">
                <h1 className="text-3xl font-game text-white mb-2">Hall of Fame</h1>
                <p className="text-accent-gold font-bold tracking-widest">TOP PLAYERS THIS SEASON</p>
            </div>

            <PodiumDisplay topThree={leaderboard.slice(0, 3)} />

            <div className="glass-card overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-4 text-center w-16">Rank</th>
                                <th className="p-4">Student</th>
                                <th className="p-4 text-center">Class</th>
                                <th className="p-4 text-center">Level</th>
                                <th className="p-4 text-right">Total EXP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((student, index) => {
                                const isCurrentUser = student.id === user.id;
                                
                                return (
                                    <tr 
                                        key={student.id} 
                                        className={`border-b border-gray-800/50 transition-colors hover:bg-white/5 
                                            ${isCurrentUser ? 'bg-accent-cyan/10 border-l-4 border-l-accent-cyan relative shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' : ''}
                                        `}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="p-4 text-center">
                                            <span className={`font-game text-sm ${index < 3 ? 'text-accent-gold' : 'text-gray-500'}`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center gap-4">
                                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-gray-800" />
                                            <div>
                                                <div className={`font-bold ${isCurrentUser ? 'text-accent-cyan' : 'text-white'}`}>
                                                    {student.name} {isCurrentUser && '(You)'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-sm text-gray-400">{student.class}</td>
                                        <td className="p-4 flex justify-center">
                                            <div className="scale-75 origin-center">
                                                <LevelBadge level={student.level} size="sm" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-game text-xs text-accent-gold">{student.exp.toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-500 mt-1">{student.quests} quests</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
