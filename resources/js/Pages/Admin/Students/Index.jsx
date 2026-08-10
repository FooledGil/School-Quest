import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function StudentsIndex({ students = [] }) {
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('All');

    const normalizedStudents = students.map(s => ({
        id: s.id,
        name: s.name,
        nisn: s.nisn || '-',
        class: s.class || 'Siswa',
        level: s.level || 1,
        exp: s.exp || 0,
        quests: s.quest_completions_count || 0,
        streak: s.streak_days || 0
    }));

    const classesList = ['All', ...Array.from(new Set(normalizedStudents.map(s => s.class)))];

    const filteredStudents = normalizedStudents.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
        const matchesClass = classFilter === 'All' || s.class === classFilter;
        return matchesSearch && matchesClass;
    });

    return (
        <AdminLayout>
            <Head title="Progress Murid" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Progress Murid</h1>
                <p className="text-gray-400 text-sm mt-1">Pantau statistik dan perkembangan level murid.</p>
            </div>

            <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama atau NISN..."
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
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase">
                                <th className="p-4">Murid</th>
                                <th className="p-4">NISN</th>
                                <th className="p-4">Kelas</th>
                                <th className="p-4 text-center">Level</th>
                                <th className="p-4 text-right">EXP</th>
                                <th className="p-4 text-center">Streak</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr 
                                        key={student.id} 
                                        className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group cursor-pointer" 
                                        onClick={() => router.get(`/admin/students/${student.id}`)}
                                    >
                                        <td className="p-4 font-bold text-white group-hover:text-accent-cyan transition-colors">{student.name}</td>
                                        <td className="p-4 text-sm text-gray-400 font-mono">{student.nisn}</td>
                                        <td className="p-4 text-sm text-gray-300">{student.class}</td>
                                        <td className="p-4 flex justify-center">
                                            <div className="scale-75 origin-center">
                                                <LevelBadge level={student.level} size="sm" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-game text-xs text-accent-gold">{(student.exp || 0).toLocaleString()}</td>
                                        <td className="p-4 text-center text-sm text-accent-emerald flex justify-center items-center gap-1">
                                            🔥 {student.streak} Hari
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">Tidak ada data murid.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
