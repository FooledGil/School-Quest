import React, { useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/StatCard';
import { UsersIcon, ClipboardDocumentListIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard({ stats = {}, topPerformers = [], recentCompletions = [] }) {
    const pageRef = useRef(null);
    const { auth } = usePage().props;
    const user = auth?.user || {};

    useGSAP(() => {
        if (pageRef.current) {
            const performers = pageRef.current.querySelectorAll('.performer-item');
            if (performers.length > 0) {
                gsap.fromTo(
                    performers,
                    { x: -20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
                );
            }

            const completions = pageRef.current.querySelectorAll('.completion-item');
            if (completions.length > 0) {
                gsap.fromTo(
                    completions,
                    { x: 20, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
                );
            }
        }
    }, { scope: pageRef });

    return (
        <AdminLayout user={user}>
            <Head title="Admin Dashboard" />

            <div ref={pageRef} className="space-y-6 sm:space-y-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Ringkasan Sistem</h1>
                    <p className="text-slate-400 text-xs sm:text-sm">Pantau perkembangan quest dan murid secara keseluruhan.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <StatCard icon={UsersIcon} label="Total Murid" value={stats.total_students || 0} color="blue" />
                    <StatCard icon={ClipboardDocumentListIcon} label="Quest Aktif" value={stats.total_quests || 0} color="purple" />
                    <StatCard icon={CheckCircleIcon} label="Selesai Hari Ini" value={stats.completions_today || 0} color="emerald" />
                    <StatCard icon={ChartBarIcon} label="Rata-rata Level" value={stats.avg_level || 1.0} color="gold" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Top Performers */}
                    <div className="glass-card p-4 sm:p-6 min-w-0">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-bold text-white">Murid Teratas</h2>
                            <Link href="/admin/students" className="text-xs font-semibold text-blue-400 hover:underline">Lihat Semua &rarr;</Link>
                        </div>
                        <div className="space-y-2.5 sm:space-y-3">
                            {topPerformers.map((student, idx) => (
                                <div key={student.id} className="performer-item flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors gap-3">
                                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700 shrink-0">
                                            #{idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-xs sm:text-sm truncate">{student.name}</p>
                                            <p className="text-[11px] text-slate-400 truncate">Kelas {student.class || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-400 font-bold text-xs sm:text-sm shrink-0">
                                        {(student.exp || 0).toLocaleString()} <span className="hidden sm:inline">EXP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-4 sm:p-6 min-w-0">
                        <h2 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">Aktivitas Selesai Terbaru</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {recentCompletions.length > 0 ? (
                                recentCompletions.map((activity) => (
                                    <div key={activity.id} className="completion-item flex items-start gap-2.5 sm:gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                                <span className="font-bold text-white">{activity.user?.name || 'Siswa'}</span> menyelesaikan{' '}
                                                <span className="text-blue-400 font-semibold">{activity.quest?.title || 'Quest'}</span>
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                                                {activity.completed_at ? new Date(activity.completed_at).toLocaleTimeString('id-ID') : 'Baru saja'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">Belum ada aktivitas penyelesaian quest hari ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
