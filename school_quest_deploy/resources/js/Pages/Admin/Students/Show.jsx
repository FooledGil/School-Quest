import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import PunishStudentModal from '@/Components/Admin/PunishStudentModal';
import { getAvatarUrl } from '@/Utils/avatar';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function StudentShow({ student = {} }) {
    const avatar = getAvatarUrl(student);
    const rankName = student.rank_name || 'Novice';
    const nextLevelExp = student.next_level_exp || 150;
    const baseExp = student.current_level_base_exp || 0;
    const [isPunishModalOpen, setIsPunishModalOpen] = useState(false);

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

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link href="/admin/students" className="text-gray-400 hover:text-white text-sm font-semibold">&larr; Kembali ke Daftar</Link>
                    <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Profil Murid: {student.name}</h1>
                </div>

                <button
                    type="button"
                    onClick={() => setIsPunishModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto"
                >
                    <ShieldExclamationIcon className="w-4 h-4" />
                    <span>Hukum Siswa ⚖️</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Profile Card */}
                <div className="glass-card p-5 sm:p-6 flex flex-col items-center min-w-0">
                    <img src={avatar} alt={student.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-800 border-2 border-gray-700 mb-3 sm:mb-4 object-cover shrink-0" />
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate max-w-full">{student.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-400 mb-5 sm:mb-6">NISN: {student.nisn || '-'} • Kelas {student.class || '-'}</p>

                    <div className="w-full mb-5 sm:mb-6 flex justify-center scale-100 sm:scale-110">
                        <LevelBadge level={student.level || 1} rankName={rankName} size="md" />
                    </div>

                    <ExpBar currentExp={student.exp || 0} requiredExp={nextLevelExp} baseExp={baseExp} showPercent={true} className="w-full mb-4" />

                    <div className="w-full grid grid-cols-2 gap-2 mt-2 text-sm text-center">
                        <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800">
                            <p className="text-gray-400 text-[10px] sm:text-xs">Quest Selesai</p>
                            <p className="font-bold text-white text-sm sm:text-base mt-0.5">{questHistory.length}</p>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800">
                            <p className="text-gray-400 text-[10px] sm:text-xs">Streak Hari</p>
                            <p className="font-bold text-emerald-400 text-sm sm:text-base mt-0.5">{student.streak_days || 0} Hari</p>
                        </div>
                    </div>

                    {student.is_muted && (
                        <div className="w-full mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-center text-xs text-red-400 font-bold">
                            🔇 Sedang di-mute hingga: {student.muted_until || 'Aktif'}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                    
                    {/* Quest History Table */}
                    <div className="glass-card p-4 sm:p-6 shadow-lg">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Riwayat Penyelesaian Quest</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[450px]">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                                        <th className="pb-3 px-2 font-bold">Tanggal</th>
                                        <th className="pb-3 px-2 font-bold">Judul Quest</th>
                                        <th className="pb-3 px-2 font-bold">Tipe</th>
                                        <th className="pb-3 px-2 text-right font-bold">EXP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questHistory.length > 0 ? (
                                        questHistory.map(q => (
                                            <tr key={q.id} className="border-b border-gray-800/30">
                                                <td className="py-3 px-2 text-gray-400 text-xs">{q.date}</td>
                                                <td className="py-3 px-2 font-bold text-white">{q.title}</td>
                                                <td className="py-3 px-2 text-gray-400 capitalize">{q.type}</td>
                                                <td className="py-3 px-2 text-right font-game text-[10px] text-amber-400">+{q.exp}</td>
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

            {/* Punish Student Modal */}
            <PunishStudentModal
                isOpen={isPunishModalOpen}
                onClose={() => setIsPunishModalOpen(false)}
                student={student}
            />
        </AdminLayout>
    );
}
