import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function StudentsIndex({ students = [], passwordResetRequests = [] }) {
    const [search, setSearch] = useState('');
    const [classFilter, setClassFilter] = useState('All');

    const pendingRequests = passwordResetRequests.filter(r => r.status === 'pending');

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

    const handleResetStudent = (e, student) => {
        e.stopPropagation();
        if (confirm(`Reset kata sandi siswa ${student.name} ke default ('password')?`)) {
            router.post(`/admin/students/${student.id}/reset-password`);
        }
    };

    const handleResolveRequest = (requestId, action) => {
        const confirmMsg = action === 'resolve'
            ? "Setujui laporan dan reset kata sandi akun ke default ('password')?"
            : "Tolak permintaan reset kata sandi ini?";
        if (confirm(confirmMsg)) {
            router.post(`/password-resets/${requestId}/resolve`, { action });
        }
    };

    return (
        <AdminLayout>
            <Head title="Progress Murid & Akun" />

            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Progress Murid & Akun</h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">Pantau statistik, level murid, dan kelola kata sandi akun.</p>
                </div>
            </div>

            {/* Pending Password Reset Requests Banner */}
            {pendingRequests.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border-2 border-amber-500/50 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🔑</span>
                        <h2 className="font-bold text-sm text-amber-300">
                            Permintaan Lupa Kata Sandi ({pendingRequests.length} Menunggu Konfirmasi)
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="p-3 rounded-lg bg-black/50 border border-amber-500/30 text-xs space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <p className="font-bold text-white">{req.user?.name || req.identifier}</p>
                                        <p className="text-gray-400 text-[11px]">
                                            NISN/ID: <span className="font-mono text-amber-300">{req.identifier}</span>
                                            {req.user?.class && ` • Kelas: ${req.user.class}`}
                                        </p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                        PENDING
                                    </span>
                                </div>
                                {req.notes && (
                                    <p className="text-gray-300 italic text-[11px] bg-white/5 p-2 rounded">
                                        "{req.notes}"
                                    </p>
                                )}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleResolveRequest(req.id, 'resolve')}
                                        className="flex-1 py-1.5 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] cursor-pointer"
                                    >
                                        ✓ Reset ke 'password'
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleResolveRequest(req.id, 'reject')}
                                        className="py-1.5 px-2.5 rounded bg-red-950 hover:bg-red-900 border border-red-700/50 text-red-300 text-[11px] cursor-pointer"
                                    >
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="glass-card p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Cari berdasarkan nama atau NISN..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm text-white focus:border-blue-500 outline-none"
                    />
                </div>
                
                <select 
                    value={classFilter}
                    onChange={e => setClassFilter(e.target.value)}
                    className="bg-black/40 border border-gray-700 rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm text-white focus:border-blue-500 outline-none min-w-[120px]"
                >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <div className="glass-card overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                            <tr className="bg-black/40 border-b border-gray-800 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="p-3 sm:p-4">Murid</th>
                                <th className="p-3 sm:p-4">NISN</th>
                                <th className="p-3 sm:p-4">Kelas</th>
                                <th className="p-3 sm:p-4 text-center">Level</th>
                                <th className="p-3 sm:p-4 text-right">EXP</th>
                                <th className="p-3 sm:p-4 text-center">Streak</th>
                                <th className="p-3 sm:p-4 text-center">Aksi Kata Sandi</th>
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
                                        <td className="p-3 sm:p-4 font-bold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors">{student.name}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-400 font-mono">{student.nisn}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-300">{student.class}</td>
                                        <td className="p-3 sm:p-4 flex justify-center">
                                            <div className="scale-75 origin-center">
                                                <LevelBadge level={student.level} size="sm" />
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-right font-game text-[10px] sm:text-xs text-amber-400">{(student.exp || 0).toLocaleString()}</td>
                                        <td className="p-3 sm:p-4 text-center text-xs sm:text-sm text-emerald-400">
                                            🔥 {student.streak} Hari
                                        </td>
                                        <td className="p-3 sm:p-4 text-center">
                                            <button
                                                type="button"
                                                onClick={(e) => handleResetStudent(e, student)}
                                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-600/80 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                                title="Reset kata sandi siswa ini ke bawaan ('password')"
                                            >
                                                🔑 Reset Pass
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400 text-xs sm:text-sm">Tidak ada data murid.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
