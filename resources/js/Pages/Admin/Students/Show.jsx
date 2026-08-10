import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';

export default function StudentShow({ student = {} }) {
    const avatar = student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(student.avatar_seed || student.name || 'Student')}`;
    const rankName = student.rank_name || 'Novice';
    const nextLevelExp = student.next_level_exp || (Math.pow(student.level || 1, 2) * 100);

    const questHistory = (student.quest_completions || []).map(qc => ({
        id: qc.id,
        title: qc.quest?.title || 'Quest',
        type: qc.quest?.type || 'Main',
        date: qc.completed_at ? new Date(qc.completed_at).toLocaleDateString('id-ID') : '-',
        exp: qc.exp_earned || qc.quest?.exp_reward || 0
    }));

    return (
        <AdminLayout>
            <Head title={`Student: ${student.name}`} />

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/students" className="text-gray-400 hover:text-white">&larr; Kembali ke Daftar</Link>
                <h1 className="text-2xl font-bold text-white">Profil Murid: {student.name}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card p-6 flex flex-col items-center">
                    <img src={avatar} alt={student.name} className="w-24 h-24 rounded-lg bg-gray-800 border-2 border-gray-700 mb-4 object-cover" />
                    <h2 className="text-xl font-bold text-white">{student.name}</h2>
                    <p className="text-sm text-gray-400 mb-6">NISN: {student.nisn || '-'} • Kelas {student.class || '-'}</p>

                    <div className="w-full mb-6 flex justify-center scale-110 mt-2">
                        <LevelBadge level={student.level || 1} rankName={rankName} size="md" />
                    </div>

                    <ExpBar currentExp={student.exp || 0} requiredExp={nextLevelExp} className="w-full mb-4" />

                    <div className="w-full grid grid-cols-2 gap-2 mt-4 text-sm text-center">
                        <div className="bg-black/30 p-2 rounded border border-gray-800">
                            <p className="text-gray-500 text-xs">Quest Selesai</p>
                            <p className="font-bold text-white">{questHistory.length}</p>
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-gray-800">
                            <p className="text-gray-500 text-xs">Streak Hari</p>
                            <p className="font-bold text-accent-emerald">{student.streak_days || 0} Hari</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quest History Table */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-6">Riwayat Penyelesaian Quest</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-500">
                                        <th className="pb-2">Tanggal</th>
                                        <th className="pb-2">Judul Quest</th>
                                        <th className="pb-2">Tipe</th>
                                        <th className="pb-2 text-right">EXP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questHistory.length > 0 ? (
                                        questHistory.map(q => (
                                            <tr key={q.id} className="border-b border-gray-800/30">
                                                <td className="py-3 text-gray-400">{q.date}</td>
                                                <td className="py-3 font-bold text-white">{q.title}</td>
                                                <td className="py-3 text-gray-400 capitalize">{q.type}</td>
                                                <td className="py-3 text-right font-game text-[10px] text-accent-gold">+{q.exp}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-6 text-center text-gray-500">Belum ada riwayat quest.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
