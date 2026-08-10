import React, { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import AchievementBadge from '@/Components/AchievementBadge';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Profile({ user: propUser }) {
    const pageRef = useRef(null);
    const avatarRef = useRef(null);
    const { auth } = usePage().props;
    const user = propUser || auth?.user || {};

    const avatar = user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.avatar_seed || user.name || 'Student')}`;
    const rankName = user.rank_name || 'Novice';
    const nextLevelExp = user.next_level_exp || (Math.pow(user.level || 1, 2) * 100);

    const achievements = (user.achievements || []).map(ua => ({
        id: ua.achievement?.id || ua.id,
        title: ua.achievement?.name || 'Achievement',
        description: ua.achievement?.description || '',
        isUnlocked: true
    }));

    const questHistory = (user.quest_completions || []).map(qc => ({
        id: qc.id,
        title: qc.quest?.title || 'Quest',
        date: qc.completed_at ? new Date(qc.completed_at).toLocaleDateString('id-ID') : 'Hari ini',
        exp: qc.exp_earned || qc.quest?.exp_reward || 0
    }));

    useGSAP(() => {
        if (pageRef.current) {
            const tl = gsap.timeline();

            if (avatarRef.current) {
                tl.fromTo(
                    avatarRef.current,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
                );
            }

            const achBadges = pageRef.current.querySelectorAll('.ach-badge-wrapper');
            if (achBadges.length > 0) {
                tl.fromTo(
                    achBadges,
                    { scale: 0.7, opacity: 0, y: 15 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(1.5)' },
                    '-=0.3'
                );
            }

            const activityItems = pageRef.current.querySelectorAll('.activity-item');
            if (activityItems.length > 0) {
                tl.fromTo(
                    activityItems,
                    { x: -15, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' },
                    '-=0.2'
                );
            }
        }
    }, { scope: pageRef });

    return (
        <StudentLayout user={{ ...user, avatar, rank_name: rankName, next_level_exp: nextLevelExp }}>
            <Head title="Profile" />

            <div ref={pageRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
                        <div ref={avatarRef} className="w-24 h-24 rounded-full border-2 border-blue-500 p-0.5 bg-slate-900 shadow-md mb-3">
                            <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
                        <p className="text-blue-400 font-semibold text-xs mb-4">Kelas {user.class || '-'}</p>
                        
                        <div className="w-full space-y-2.5 text-xs text-left bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-400">NISN</span>
                                <span className="text-white font-mono">{user.nisn || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Streak Hari</span>
                                <span className="text-amber-400 font-bold">{user.streak_days || 0} Hari</span>
                            </div>
                        </div>

                        <div className="w-full mb-6">
                            <LevelBadge level={user.level || 1} rankName={rankName} size="lg" className="mx-auto" />
                        </div>

                        <ExpBar currentExp={user.exp || 0} requiredExp={nextLevelExp} className="w-full" />
                        <p className="text-[11px] text-slate-500 mt-2">Level {(user.level || 1) + 1} membutuhkan {nextLevelExp.toLocaleString()} EXP</p>
                    </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2 space-y-8">
                    
                    {/* Achievements Collection */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Galeri Pencapaian</h3>
                        {achievements.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                {achievements.map(ach => (
                                    <div key={ach.id} className="ach-badge-wrapper flex justify-center">
                                        <AchievementBadge achievement={ach} isUnlocked={ach.isUnlocked} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">Belum ada achievement yang terbuka. Selesaikan quest untuk membuka!</p>
                        )}
                    </div>

                    {/* Quest History */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Aktivitas Terakhir</h3>
                        {questHistory.length > 0 ? (
                            <div className="space-y-3">
                                {questHistory.map((quest) => (
                                    <div key={quest.id} className="activity-item flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/80">
                                        <div>
                                            <p className="font-bold text-white text-sm">{quest.title}</p>
                                            <p className="text-xs text-slate-400">{quest.date}</p>
                                        </div>
                                        <div className="text-amber-400 font-bold text-xs">
                                            +{quest.exp} EXP
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">Belum ada riwayat quest yang diselesaikan.</p>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
