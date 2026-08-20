import React, { useRef, useState, useCallback } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import AchievementBadge from '@/Components/AchievementBadge';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Generate a DiceBear pixel-art avatar URL from a seed
function pixelAvatarUrl(seed) {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
}

// Pre-defined fun avatar seeds to choose from
const AVATAR_SEEDS = [
    'Felix', 'Luna', 'Pixel', 'Cyber', 'Nova', 'Blaze', 'Storm', 'Echo',
    'Orbit', 'Zenith', 'Spark', 'Frost', 'Neon', 'Drift', 'Pulse', 'Comet',
    'Shadow', 'Prism', 'Glitch', 'Volt', 'Atlas', 'Jade', 'Onyx', 'Aero',
    'Nimbus', 'Quasar', 'Vortex', 'Helix', 'Byte', 'Chip', 'Rocket', 'Turbo',
];

export default function Profile({ user: propUser }) {
    const pageRef = useRef(null);
    const avatarRef = useRef(null);
    const { auth, flash, errors } = usePage().props;
    const user = propUser || auth?.user || {};

    const currentSeed = user.avatar_seed || user.name || 'Student';
    const avatar = user.avatar || pixelAvatarUrl(currentSeed);
    const rankName = user.rank_name || 'Novice';
    const nextLevelExp = user.next_level_exp || (Math.pow(user.level || 1, 2) * 100);

    // Avatar picker state
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [selectedSeed, setSelectedSeed] = useState(currentSeed);
    const [customSeed, setCustomSeed] = useState('');
    const [savingAvatar, setSavingAvatar] = useState(false);

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showPasswordSection, setShowPasswordSection] = useState(false);

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

    const handleSaveAvatar = useCallback(() => {
        setSavingAvatar(true);
        router.post('/profile/avatar', { avatar_seed: selectedSeed }, {
            preserveScroll: true,
            onFinish: () => setSavingAvatar(false),
            onSuccess: () => setShowAvatarPicker(false),
        });
    }, [selectedSeed]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setShowPasswordSection(false);
            },
        });
    };

    const handleAddCustomSeed = () => {
        if (customSeed.trim()) {
            setSelectedSeed(customSeed.trim());
            setCustomSeed('');
        }
    };

    return (
        <StudentLayout user={{ ...user, avatar, rank_name: rankName, next_level_exp: nextLevelExp }}>
            <Head title="Profile" />

            <div ref={pageRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="glass-card p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
                        {/* Avatar with change button */}
                        <div className="relative group mb-3">
                            <div ref={avatarRef} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-blue-500 p-1 bg-slate-900 shadow-md shrink-0 overflow-hidden">
                                <img src={avatar} alt="Avatar" className="w-full h-full rounded-xl object-cover" style={{ imageRendering: 'pixelated' }} />
                            </div>
                            <button
                                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                <span className="text-white text-xs font-bold">Ganti</span>
                            </button>
                        </div>
                        
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 truncate max-w-full">{user.name}</h2>
                        <p className="text-blue-400 font-semibold text-xs mb-4">Kelas {user.class || '-'}</p>
                        
                        <div className="w-full space-y-2.5 text-xs text-left bg-slate-900/60 p-3 sm:p-3.5 rounded-lg border border-slate-800 mb-5 sm:mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-400">NISN</span>
                                <span className="text-white font-mono">{user.nisn || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Streak Hari</span>
                                <span className="text-amber-400 font-bold">{user.streak_days || 0} Hari</span>
                            </div>
                        </div>

                        <div className="w-full mb-5 sm:mb-6">
                            <LevelBadge level={user.level || 1} rankName={rankName} size="lg" className="mx-auto" />
                        </div>

                        <ExpBar currentExp={user.exp || 0} requiredExp={nextLevelExp} className="w-full" />
                        <p className="text-[10px] sm:text-[11px] text-slate-500 mt-2">Level {(user.level || 1) + 1} membutuhkan {nextLevelExp.toLocaleString()} EXP</p>
                    </div>

                    {/* Settings Actions */}
                    <div className="glass-card p-4 sm:p-5 space-y-3">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <span>⚙️</span> Pengaturan Akun
                        </h3>
                        <button
                            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-blue-500/40 transition-all text-sm text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">🎨</span>
                            <div className="min-w-0">
                                <p className="font-semibold">Ganti Avatar</p>
                                <p className="text-[11px] text-slate-500">Pilih avatar pixel bot favoritmu</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="w-full text-left px-4 py-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-amber-500/40 transition-all text-sm text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer group"
                        >
                            <span className="text-lg group-hover:scale-110 transition-transform">🔒</span>
                            <div className="min-w-0">
                                <p className="font-semibold">Ganti Password</p>
                                <p className="text-[11px] text-slate-500">Perbarui password akunmu</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">

                    {/* Avatar Picker Panel */}
                    {showAvatarPicker && (
                        <div className="glass-card p-4 sm:p-6 animate-fade-in border border-blue-500/20">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <span>🤖</span> Pilih Avatar Pixel Bot
                                </h3>
                                <button 
                                    onClick={() => setShowAvatarPicker(false)} 
                                    className="text-slate-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="flex flex-col items-center mb-5">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-blue-500 p-1.5 bg-gradient-to-br from-blue-900/40 to-purple-900/40 shadow-lg shadow-blue-500/10 mb-2 overflow-hidden">
                                    <img
                                        src={pixelAvatarUrl(selectedSeed)}
                                        alt="Preview"
                                        className="w-full h-full rounded-xl"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Seed: <span className="text-blue-400 font-mono font-bold">{selectedSeed}</span>
                                </p>
                            </div>

                            {/* Custom seed input */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={customSeed}
                                    onChange={(e) => setCustomSeed(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSeed()}
                                    placeholder="Ketik nama/seed custom..."
                                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                                />
                                <button
                                    onClick={handleAddCustomSeed}
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors cursor-pointer shrink-0"
                                >
                                    Coba
                                </button>
                            </div>

                            {/* Grid of preset seeds */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-2.5 mb-5 max-h-52 overflow-y-auto pr-1">
                                {AVATAR_SEEDS.map((seed) => (
                                    <button
                                        key={seed}
                                        onClick={() => setSelectedSeed(seed)}
                                        className={`relative aspect-square rounded-xl border-2 p-1 transition-all cursor-pointer hover:scale-105 overflow-hidden ${
                                            selectedSeed === seed
                                                ? 'border-blue-500 bg-blue-500/10 shadow-md shadow-blue-500/20 scale-105'
                                                : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                                        }`}
                                    >
                                        <img
                                            src={pixelAvatarUrl(seed)}
                                            alt={seed}
                                            className="w-full h-full rounded-lg"
                                            style={{ imageRendering: 'pixelated' }}
                                            loading="lazy"
                                        />
                                        {selectedSeed === seed && (
                                            <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]">✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Save button */}
                            <button
                                onClick={handleSaveAvatar}
                                disabled={savingAvatar || selectedSeed === currentSeed}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                    savingAvatar || selectedSeed === currentSeed
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer active:scale-[0.98]'
                                }`}
                            >
                                {savingAvatar ? '⏳ Menyimpan...' : selectedSeed === currentSeed ? '✓ Avatar Saat Ini' : '💾 Simpan Avatar'}
                            </button>
                        </div>
                    )}

                    {/* Password Change Panel */}
                    {showPasswordSection && (
                        <div className="glass-card p-4 sm:p-6 animate-fade-in border border-amber-500/20">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <span>🔑</span> Ganti Password
                                </h3>
                                <button 
                                    onClick={() => { setShowPasswordSection(false); passwordForm.clearErrors(); }} 
                                    className="text-slate-400 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password Lama</label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        onChange={e => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="Masukkan password lama"
                                    />
                                    {(passwordForm.errors.current_password || errors?.current_password) && (
                                        <p className="text-rose-400 text-xs mt-1">{passwordForm.errors.current_password || errors.current_password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={e => passwordForm.setData('password', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="Minimal 6 karakter"
                                    />
                                    {passwordForm.errors.password && (
                                        <p className="text-rose-400 text-xs mt-1">{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="Ketik ulang password baru"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all ${
                                        passwordForm.processing
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 cursor-pointer active:scale-[0.98]'
                                    }`}
                                >
                                    {passwordForm.processing ? '⏳ Menyimpan...' : '🔒 Perbarui Password'}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {/* Achievements Collection */}
                    <div className="glass-card p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Galeri Pencapaian</h3>
                        {achievements.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
                                {achievements.map(ach => (
                                    <div key={ach.id} className="ach-badge-wrapper flex justify-center w-full">
                                        <AchievementBadge achievement={ach} isUnlocked={ach.isUnlocked} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm text-center py-4">Belum ada achievement yang terbuka. Selesaikan quest untuk membuka!</p>
                        )}
                    </div>

                    {/* Quest History */}
                    <div className="glass-card p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Aktivitas Terakhir</h3>
                        {questHistory.length > 0 ? (
                            <div className="space-y-2.5 sm:space-y-3">
                                {questHistory.map((quest) => (
                                    <div key={quest.id} className="activity-item flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-xs sm:text-sm truncate">{quest.title}</p>
                                            <p className="text-[11px] text-slate-400">{quest.date}</p>
                                        </div>
                                        <div className="text-amber-400 font-bold text-xs shrink-0">
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
