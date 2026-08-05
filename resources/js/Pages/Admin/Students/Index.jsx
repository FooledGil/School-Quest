import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function StudentsIndex() {
    const user = { name: 'Admin Principal', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' };

    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('All');

    const students = [
        { id: 1, name: 'Sarah Connor', nisn: '1001', class: '10-A Science', level: 7, exp: 12500, quests: 89, streak: 12 },
        { id: 2, name: 'John Doe', nisn: '1002', class: '10-B Math', level: 6, exp: 10200, quests: 75, streak: 5 },
        { id: 12, name: 'Alex Hunter', nisn: '1234567890', class: '10-A Science', level: 4, exp: 3450, quests: 42, streak: 7 },
    ];

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
        const matchesClass = classFilter === 'All' || s.class === classFilter;
        return matchesSearch && matchesClass;
    });

    const classes = ['All', '10-A Science', '10-B Math', '10-C Arts'];

    return (
        <AdminLayout user={user}>
            <Head title="Student Progress" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Student Progress</h1>
                <p className="text-gray-400 text-sm mt-1">Monitor individual student statistics and levels.</p>
            </div>

            <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search by name or NISN..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-accent-cyan outline-none"
                    />
                </div>
                
                <select 
                    value={classFilter}
                    onChange={e => setClassFilter(e.target.value)}
                    className="bg-black/40 border border-gray-700 rounded-lg py-2 px-4 text-white focus:border-accent-cyan outline-none"
                >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase">
                                <th className="p-4">Student</th>
                                <th className="p-4">NISN</th>
                                <th className="p-4">Class</th>
                                <th className="p-4 text-center">Level</th>
                                <th className="p-4 text-right">EXP</th>
                                <th className="p-4 text-center">Quests</th>
                                <th className="p-4 text-center">Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => window.location.href = `/admin/students/${student.id}`}>
                                    <td className="p-4 font-bold text-white group-hover:text-accent-cyan transition-colors">{student.name}</td>
                                    <td className="p-4 text-sm text-gray-400 font-mono">{student.nisn}</td>
                                    <td className="p-4 text-sm text-gray-300">{student.class}</td>
                                    <td className="p-4 flex justify-center">
                                        <div className="scale-75 origin-center">
                                            <LevelBadge level={student.level} size="sm" />
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-game text-xs text-accent-gold">{student.exp.toLocaleString()}</td>
                                    <td className="p-4 text-center text-sm text-gray-300">{student.quests}</td>
                                    <td className="p-4 text-center text-sm text-accent-emerald flex justify-center items-center gap-1">
                                        🔥 {student.streak}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
