import React, { useRef, useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import LevelBadge from '@/Components/LevelBadge';
import ExpBar from '@/Components/ExpBar';
import AchievementBadge from '@/Components/AchievementBadge';
import ApiIcon from '@/Components/ApiIcon';
import { getAvatarUrl, getPixelBotUrl } from '@/Utils/avatar';
import { ICON_API } from '@/Utils/iconApi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
    const fileInputRef = useRef(null);
    const { auth, flash, errors } = usePage().props;
    const user = propUser || auth?.user || {};

    const avatar = getAvatarUrl(user);
    const rankName = user.rank_name || 'Novice';
    const nextLevelExp = user.next_level_exp || 150;
    const baseExp = user.current_level_base_exp || 0;

    // Avatar Management States
    const [showAvatarStudio, setShowAvatarStudio] = useState(false);
    const [avatarTab, setAvatarTab] = useState('upload'); // 'upload' | 'pixelbot'
    const [selectedBotSeed, setSelectedBotSeed] = useState(user.avatar_seed || 'Felix');
    const [customSeedInput, setCustomSeedInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingBot, setIsSavingBot] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

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

    // File selection handler
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    // Upload Local Image
    const handleUploadAvatar = (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar_file', selectedFile);

        router.post('/profile/avatar/upload', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setIsUploading(false),
            onSuccess: () => {
                setSelectedFile(null);
                setFilePreview(null);
                setShowAvatarStudio(false);
            },
        });
    };

    // Save Pixel Bot Seed
    const handleSaveBotSeed = () => {
        setIsSavingBot(true);
        router.post('/profile/avatar', { avatar_seed: selectedBotSeed }, {
            preserveScroll: true,
            onFinish: () => setIsSavingBot(false),
            onSuccess: () => setShowAvatarStudio(false),
        });
    };

    // Reset to Default Silhouette
    const handleResetAvatar = () => {
        if (!confirm('Apakah kamu yakin ingin mengembalikan avatar ke siluet default?')) return;

        setIsResetting(true);
        router.post('/profile/avatar/reset', {}, {
            preserveScroll: true,
            onFinish: () => setIsResetting(false),
            onSuccess: () => {
                setSelectedFile(null);
                setFilePreview(null);
                setShowAvatarStudio(false);
            },
        });
    };

    // Password submit
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

    // Custom bot seed
    const handleApplyCustomSeed = () => {
        if (customSeedInput.trim()) {
            setSelectedBotSeed(customSeedInput.trim());
            setCustomSeedInput('');
        }
    };

    // Avatar type badge
    const avatarTypeBadge = user.avatar 
        ? { text: 'Foto Pribadi', icon: ICON_API.camera, color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
        : user.avatar_seed 
            ? { text: 'Pixel Bot', icon: ICON_API.pixelBot, color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' }
            : { text: 'Siluet Default', icon: ICON_API.profile, color: 'bg-slate-700/40 text-slate-400 border-slate-700' };

    return (
        <StudentLayout user={{ ...user, avatar, rank_name: rankName, next_level_exp: nextLevelExp }}>
            <Head title="Profile" />

            <div ref={pageRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-5">
                    <div className="glass-card p-5 sm:p-6 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
                        {/* Avatar with Studio Trigger */}
                        <div className="relative group mb-3">
                            <div ref={avatarRef} className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl border-2 border-blue-500 p-1 bg-slate-900 shadow-md shrink-0 overflow-hidden">
                                <img 
                                    src={avatar} 
                                    alt="Avatar" 
                                    className="w-full h-full rounded-xl object-cover" 
                                    style={user.avatar_seed ? { imageRendering: 'pixelated' } : {}} 
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAvatarStudio(!showAvatarStudio)}
                                className="absolute inset-0 rounded-2xl bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white gap-1"
                                title="Klik untuk Kustomisasi Avatar"
                            >
                                <ApiIcon icon={ICON_API.palette} className="w-5 h-5" />
                                <span className="text-[11px] font-bold">Kustomisasi</span>
                            </button>
                        </div>

                        {/* Avatar Type Badge */}
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border mb-3 ${avatarTypeBadge.color}`}>
                            <ApiIcon icon={avatarTypeBadge.icon} className="w-3.5 h-3.5" />
                            <span>{avatarTypeBadge.text}</span>
                        </span>
                        
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

                        <ExpBar 
                            currentExp={user.exp || 0} 
                            requiredExp={nextLevelExp} 
                            baseExp={baseExp}
                            showPercent={true}
                            className="w-full" 
                        />
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 font-medium">
                            <strong className="text-amber-400 font-mono">
                                {Math.max(0, nextLevelExp - (user.exp || 0)).toLocaleString()} EXP
                            </strong> lagi untuk naik ke Level {(user.level || 1) + 1}
                        </p>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="glass-card p-4 sm:p-5 space-y-2.5">
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <ApiIcon icon={ICON_API.settings} className="w-4 h-4 text-blue-400" />
                            <span>Pengaturan & Bantuan</span>
                        </h3>
                        
                        {/* Avatar Studio Trigger */}
                        <button
                            type="button"
                            onClick={() => {
                                setShowAvatarStudio(true);
                                setShowPasswordSection(false);
                            }}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-blue-500/40 transition-all text-xs sm:text-sm text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                <ApiIcon icon={ICON_API.palette} className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white">Studio Avatar</p>
                                <p className="text-[11px] text-slate-400">Upload foto atau pilih Pixel Bot</p>
                            </div>
                        </button>

                        {/* Password Trigger */}
                        <button
                            type="button"
                            onClick={() => {
                                setShowPasswordSection(true);
                                setShowAvatarStudio(false);
                            }}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-amber-500/40 transition-all text-xs sm:text-sm text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:scale-110 transition-transform">
                                <ApiIcon icon={ICON_API.changePassword} className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white">Ganti Password</p>
                                <p className="text-[11px] text-slate-400">Perbarui kata sandi akunmu</p>
                            </div>
                        </button>

                        {/* Tour / Guide Trigger */}
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-onboarding-tour'))}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all text-xs sm:text-sm text-blue-300 hover:text-white flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="p-1.5 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                                <ApiIcon icon={ICON_API.guide} className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-blue-300">Buka Panduan Website</p>
                                <p className="text-[11px] text-blue-400/80">Lihat kembali tur panduan fitur</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">

                    {/* ========================================================================= */}
                    {/* AVATAR STUDIO PANEL */}
                    {/* ========================================================================= */}
                    {showAvatarStudio && (
                        <div className="glass-card p-4 sm:p-6 animate-fade-in border border-blue-500/30 shadow-2xl">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                        <ApiIcon icon={ICON_API.palette} className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                                            Studio Avatar Siswa
                                        </h3>
                                        <p className="text-xs text-slate-400">Pilih metode avatar yang kamu inginkan</p>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setShowAvatarStudio(false)} 
                                    className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                    title="Tutup Studio"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-5">
                                <button
                                    type="button"
                                    onClick={() => setAvatarTab('upload')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        avatarTab === 'upload'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <ApiIcon icon={ICON_API.uploadPhoto} className="w-4 h-4" />
                                    <span>Upload Foto Sendiri</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAvatarTab('pixelbot')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        avatarTab === 'pixelbot'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <ApiIcon icon={ICON_API.pixelBot} className="w-4 h-4" />
                                    <span>Karakter Pixel Bot</span>
                                </button>
                            </div>

                            {/* TAB 1: UPLOAD LOCAL IMAGE */}
                            {avatarTab === 'upload' && (
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                                        {/* Preview Circle */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-blue-500/60 p-1 bg-slate-950 overflow-hidden shrink-0 shadow-lg">
                                            {filePreview ? (
                                                <img src={filePreview} alt="Preview Upload" className="w-full h-full rounded-xl object-cover" />
                                            ) : user.avatar ? (
                                                <img src={user.avatar} alt="Current Foto" className="w-full h-full rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-full h-full rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-900 text-center p-2">
                                                    <ApiIcon icon={ICON_API.uploadPhoto} className="w-6 h-6 mb-1 text-slate-500" />
                                                    <span className="text-[10px]">Belum ada foto</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Input & Info */}
                                        <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                                            <label className="block text-xs font-bold text-white">
                                                Pilih Foto Dari Perangkatmu
                                            </label>
                                            <p className="text-[11px] text-slate-400">
                                                Format yang didukung: JPG, PNG, WEBP (Maksimal 3 MB).
                                            </p>

                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-2"
                                                >
                                                    <ApiIcon icon={ICON_API.openFolder} className="w-4 h-4 text-blue-400" />
                                                    <span>{selectedFile ? 'Ganti File' : 'Pilih File Gambar'}</span>
                                                </button>

                                                {selectedFile && (
                                                    <span className="text-xs text-blue-400 font-mono self-center truncate max-w-[180px]">
                                                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Button */}
                                    <button
                                        type="button"
                                        onClick={handleUploadAvatar}
                                        disabled={!selectedFile || isUploading}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                                            !selectedFile || isUploading
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-[0.98]'
                                        }`}
                                    >
                                        <ApiIcon icon={ICON_API.save} className="w-4 h-4 text-white" />
                                        {isUploading ? (
                                            <span>Mengunggah ke Storage...</span>
                                        ) : (
                                            <span>Simpan & Jadikan Avatar</span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* TAB 2: PIXEL BOT SELECTION */}
                            {avatarTab === 'pixelbot' && (
                                <div className="space-y-4">
                                    {/* Bot Preview */}
                                    <div className="flex flex-col items-center mb-2">
                                        <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl border-2 border-blue-500 p-1.5 bg-gradient-to-br from-blue-950 to-indigo-950 shadow-lg shadow-blue-500/15 overflow-hidden">
                                            <img
                                                src={getPixelBotUrl(selectedBotSeed)}
                                                alt="Preview Bot"
                                                className="w-full h-full rounded-xl"
                                                style={{ imageRendering: 'pixelated' }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1.5">
                                            Seed Karakter: <span className="text-blue-400 font-mono font-bold">{selectedBotSeed}</span>
                                        </p>
                                    </div>

                                    {/* Custom Seed Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={customSeedInput}
                                            onChange={(e) => setCustomSeedInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomSeed()}
                                            placeholder="Ketik seed kustom (contoh: Mecha, CyberNinja)..."
                                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCustomSeed}
                                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0"
                                        >
                                            Terapkan
                                        </button>
                                    </div>

                                    {/* Grid of Preset Bot Seeds */}
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
                                        {AVATAR_SEEDS.map((seed) => (
                                            <button
                                                key={seed}
                                                type="button"
                                                onClick={() => setSelectedBotSeed(seed)}
                                                className={`relative aspect-square rounded-xl border-2 p-1 transition-all cursor-pointer hover:scale-105 overflow-hidden ${
                                                    selectedBotSeed === seed
                                                        ? 'border-blue-500 bg-blue-500/15 shadow-md shadow-blue-500/20 scale-105'
                                                        : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600'
                                                }`}
                                                title={seed}
                                            >
                                                <img
                                                    src={getPixelBotUrl(seed)}
                                                    alt={seed}
                                                    className="w-full h-full rounded-lg"
                                                    style={{ imageRendering: 'pixelated' }}
                                                    loading="lazy"
                                                />
                                                {selectedBotSeed === seed && (
                                                    <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]">✓</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Save Bot Button */}
                                    <button
                                        type="button"
                                        onClick={handleSaveBotSeed}
                                        disabled={isSavingBot}
                                        className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                    >
                                        <ApiIcon icon={ICON_API.pixelBot} className="w-4 h-4 text-white" />
                                        {isSavingBot ? (
                                            <span>Menyimpan Karakter...</span>
                                        ) : (
                                            <span>Gunakan Pixel Bot Ini</span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Reset to Default Silhouette Action */}
                            {(user.avatar || user.avatar_seed) && (
                                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                                    <div className="text-[11px] text-slate-400">
                                        Ingin kembali ke avatar awal?
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResetAvatar}
                                        disabled={isResetting}
                                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
                                    >
                                        <ApiIcon icon={ICON_API.reset} className="w-3.5 h-3.5 text-rose-400" />
                                        <span>{isResetting ? 'Mereset...' : 'Kembalikan ke Siluet Default (?)'}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* PASSWORD CHANGE PANEL */}
                    {/* ========================================================================= */}
                    {showPasswordSection && (
                        <div className="glass-card p-4 sm:p-6 animate-fade-in border border-amber-500/20 shadow-2xl">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <ApiIcon icon={ICON_API.changePassword} className="w-5 h-5 text-amber-400" />
                                    <span>Ganti Password</span>
                                </h3>
                                <button 
                                    type="button"
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
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
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
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
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
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="Ketik ulang password baru"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                                        passwordForm.processing
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 cursor-pointer active:scale-[0.98]'
                                    }`}
                                >
                                    <ApiIcon icon={ICON_API.changePassword} className="w-4 h-4 text-white" />
                                    {passwordForm.processing ? (
                                        <span>Menyimpan...</span>
                                    ) : (
                                        <span>Perbarui Password</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                    
                    {/* Achievements Collection */}
                    <div className="glass-card p-4 sm:p-6 border-2">
                        <h3 className="font-game text-xs sm:text-sm text-white mb-4 border-b-2 border-slate-800 pb-3 tracking-wider flex items-center gap-2">
                            <span>🏆</span>
                            <span>GALERI PENCAPAIAN</span>
                        </h3>
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
                    <div className="glass-card p-4 sm:p-6 border-2">
                        <h3 className="font-game text-xs sm:text-sm text-white mb-4 border-b-2 border-slate-800 pb-3 tracking-wider flex items-center gap-2">
                            <span>📜</span>
                            <span>AKTIVITAS TERAKHIR</span>
                        </h3>
                        {questHistory.length > 0 ? (
                            <div className="space-y-2.5 sm:space-y-3">
                                {questHistory.map((quest) => (
                                    <div key={quest.id} className="activity-item flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-xs sm:text-sm truncate">{quest.title}</p>
                                            <p className="font-mono text-[10px] text-slate-400">{quest.date}</p>
                                        </div>
                                        <div className="text-amber-400 font-game text-[10px] sm:text-xs shrink-0">
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
