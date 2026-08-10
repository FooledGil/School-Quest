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

            <div ref={pageRef}>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Ringkasan Sistem</h1>
                    <p className="text-slate-400 text-sm">Pantau perkembangan quest dan murid secara keseluruhan.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={UsersIcon} label="Total Murid" value={stats.total_students || 0} color="blue" />
                    <StatCard icon={ClipboardDocumentListIcon} label="Quest Aktif" value={stats.total_quests || 0} color="purple" />
                    <StatCard icon={CheckCircleIcon} label="Selesai Hari Ini" value={stats.completions_today || 0} color="emerald" />
                    <StatCard icon={ChartBarIcon} label="Rata-rata Level" value={stats.avg_level || 1.0} color="gold" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Performers */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white">Murid Teratas</h2>
                            <Link href="/admin/students" className="text-xs font-semibold text-blue-400 hover:underline">Lihat Semua &rarr;</Link>
                        </div>
                        <div className="space-y-3">
                            {topPerformers.map((student, idx) => (
                                <div key={student.id} className="performer-item flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 border border-slate-700">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{student.name}</p>
                                            <p className="text-xs text-slate-400">Kelas {student.class || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="text-blue-400 font-bold text-sm">
                                        {(student.exp || 0).toLocaleString()} EXP
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold text-white mb-6">Aktivitas Selesai Terbaru</h2>
                        <div className="space-y-4">
                            {recentCompletions.length > 0 ? (
                                recentCompletions.map((activity) => (
                                    <div key={activity.id} className="completion-item flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-300">
                                                <span className="font-bold text-white">{activity.user?.name || 'Siswa'}</span> menyelesaikan{' '}
                                                <span className="text-blue-400 font-semibold">{activity.quest?.title || 'Quest'}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
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
