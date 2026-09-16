import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LevelBadge from '@/Components/LevelBadge';
import PunishStudentModal from '@/Components/Admin/PunishStudentModal';
import CategoryBadge from '@/Components/Community/CategoryBadge';
import { getAvatarUrl } from '@/Utils/avatar';
import { 
    FlagIcon, 
    ChatBubbleLeftRightIcon, 
    ShieldExclamationIcon, 
    LockClosedIcon, 
    LockOpenIcon, 
    TrashIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    MagnifyingGlassIcon,
    ArrowTopRightOnSquareIcon,
    NoSymbolIcon,
    BoltIcon,
    FireIcon
} from '@heroicons/react/24/outline';

const CATEGORIES = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'umum', label: '💬 Umum' },
    { id: 'quest', label: '⚔️ Quest' },
    { id: 'showcase', label: '🎨 Showcase' },
    { id: 'saran', label: '💡 Saran' },
    { id: 'bug', label: '🐛 Bug' },
];

export default function AdminCommunityIndex({ 
    reports = [], 
    threads = { data: [] }, 
    sanctions = [], 
    metrics = {}, 
    filters = {}, 
    activeTab: initialTab = 'reports' 
}) {
    const [currentTab, setCurrentTab] = useState(initialTab);
    const [selectedStudentForPunish, setSelectedStudentForPunish] = useState(null);
    const [isPunishModalOpen, setIsPunishModalOpen] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [reportStatus, setReportStatus] = useState(filters.report_status || 'pending');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/community', {
            tab: currentTab,
            search,
            category,
            report_status: reportStatus,
        }, { preserveState: true });
    };

    const handleCategoryChange = (newCat) => {
        setCategory(newCat);
        router.get('/admin/community', {
            tab: currentTab,
            search,
            category: newCat,
            report_status: reportStatus,
        }, { preserveState: true });
    };

    const handleReportStatusChange = (newStatus) => {
        setReportStatus(newStatus);
        router.get('/admin/community', {
            tab: 'reports',
            report_status: newStatus,
        }, { preserveState: true });
    };

    const openPunishModal = (student) => {
        setSelectedStudentForPunish(student);
        setIsPunishModalOpen(true);
    };

    const handleTogglePin = (threadId) => {
        router.post(`/admin/community/thread/${threadId}/pin`, {}, { preserveScroll: true });
    };

    const handleToggleLock = (threadId) => {
        router.post(`/admin/community/thread/${threadId}/lock`, {}, { preserveScroll: true });
    };

    const handleDeleteThread = (threadId, threadTitle) => {
        if (confirm(`Hapus thread "${threadTitle}" secara permanen?`)) {
            router.delete(`/admin/community/thread/${threadId}`, { preserveScroll: true });
        }
    };

    const handleResolveReport = (reportId, status, action = '') => {
        router.post(`/admin/community/report/${reportId}/resolve`, {
            status,
            action_taken: action,
        }, { preserveScroll: true });
    };

    const handleUnmute = (studentId, studentName) => {
        if (confirm(`Cabut status mute untuk ${studentName}?`)) {
            router.post(`/admin/students/${studentId}/unmute`, {}, { preserveScroll: true });
        }
    };

    const pendingReportsCount = metrics.pending_reports || 0;

    return (
        <AdminLayout>
            <Head title="Moderasi The Realm" />

            <div className="space-y-6">
                {/* Page Title & Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                            <span>🛡️ THE REALM MODERATION HQ</span>
                        </div>
                        <h1 className="font-game text-xl sm:text-2xl text-white tracking-wider">
                            MODERASI FORUM REALM
                        </h1>
                        <p className="text-xs text-slate-400 font-body">
                            Pantau diskusi siswa, tangani laporan pelanggaran, dan terapkan sanksi tata tertib.
                        </p>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="glass-card p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                            <ChatBubbleLeftRightIcon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Total Topik</p>
                            <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">{metrics.total_threads || 0}</p>
                        </div>
                    </div>

                    <div className="glass-card p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                            <span className="text-xl">💬</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Total Balasan</p>
                            <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">{metrics.total_replies || 0}</p>
                        </div>
                    </div>

                    <div className={`glass-card p-4 rounded-2xl flex items-center gap-3.5 transition-all ${
                        pendingReportsCount > 0 
                            ? 'bg-red-500/10 border-2 border-red-500/50 shadow-lg shadow-red-500/10 animate-pulse' 
                            : 'bg-slate-900/60 border border-slate-800'
                    }`}>
                        <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                            <FlagIcon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Laporan Pending</p>
                            <p className="text-lg sm:text-xl font-bold font-mono text-red-400 mt-0.5">{pendingReportsCount}</p>
                        </div>
                    </div>

                    <div className="glass-card p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                            <NoSymbolIcon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-slate-400 font-medium">Siswa Di-Mute</p>
                            <p className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-0.5">{metrics.active_mutes || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-800 gap-2 select-none overflow-x-auto pb-1">
                    <button
                        type="button"
                        onClick={() => setCurrentTab('reports')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            currentTab === 'reports'
                                ? 'bg-slate-800 text-white border-t-2 border-red-500 font-game text-[10px]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                    >
                        <FlagIcon className="w-4 h-4 text-red-400" />
                        <span>Laporan Pelanggaran</span>
                        {pendingReportsCount > 0 && (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded-full bg-red-500 text-white">
                                {pendingReportsCount}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab('threads')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            currentTab === 'threads'
                                ? 'bg-slate-800 text-white border-t-2 border-blue-500 font-game text-[10px]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                    >
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-400" />
                        <span>Daftar Semua Topik ({metrics.total_threads || 0})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setCurrentTab('sanctions')}
                        className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            currentTab === 'sanctions'
                                ? 'bg-slate-800 text-white border-t-2 border-amber-500 font-game text-[10px]'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                        }`}
                    >
                        <ShieldExclamationIcon className="w-4 h-4 text-amber-400" />
                        <span>Riwayat Hukuman Siswa</span>
                    </button>
                </div>

                {/* TAB 1: REPORTS QUEUE */}
                {currentTab === 'reports' && (
                    <div className="space-y-4">
                        {/* Report Filter Controls */}
                        <div className="flex items-center gap-2 pb-1">
                            <span className="text-xs text-slate-400 font-medium">Status Laporan:</span>
                            {['pending', 'resolved', 'dismissed', 'all'].map(st => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleReportStatusChange(st)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${
                                        reportStatus === st 
                                            ? 'bg-slate-700 text-white font-bold' 
                                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    {st === 'pending' ? 'Belum Ditinjau' : st === 'resolved' ? 'Selesai' : st === 'dismissed' ? 'Ditolak' : 'Semua'}
                                </button>
                            ))}
                        </div>

                        {reports.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {reports.map(rep => (
                                    <div 
                                        key={rep.id} 
                                        className={`glass-card p-4 sm:p-5 rounded-2xl border transition-all ${
                                            rep.status === 'pending' 
                                                ? 'border-red-500/40 bg-slate-900/90 shadow-md' 
                                                : 'border-slate-800/80 bg-slate-950/60 opacity-80'
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            {/* Report Info */}
                                            <div className="flex-1 space-y-3 min-w-0">
                                                {/* Badge Row */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-game uppercase tracking-wider ${
                                                        rep.status === 'pending' 
                                                            ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                                                            : rep.status === 'resolved' 
                                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                                            : 'bg-slate-700/40 text-slate-400 border border-slate-700'
                                                    }`}>
                                                        {rep.status === 'pending' ? '🚨 PENDING REVIEW' : rep.status === 'resolved' ? '✅ SELESAI' : 'DIABAIKAN'}
                                                    </span>

                                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-mono">
                                                        Kategori: {rep.reason.toUpperCase()}
                                                    </span>

                                                    <span className="text-[11px] text-slate-500 font-mono">
                                                        {rep.created_at_full} ({rep.created_at_human})
                                                    </span>
                                                </div>

                                                {/* Content Snippet */}
                                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
                                                    <span className="text-[10px] font-game text-slate-400 uppercase mr-2">
                                                        Konten yang Dilaporkan ({rep.type === 'thread' ? 'Topik' : 'Komentar'}):
                                                    </span>
                                                    <p className="mt-1 font-body italic text-slate-300">"{rep.content_snippet}"</p>
                                                    {rep.thread_id && (
                                                        <a 
                                                            href={`/community/${rep.thread_id}`} 
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-2 font-semibold"
                                                        >
                                                            <span>Buka di The Realm</span>
                                                            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Reporter Details */}
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                                    <span>Pelapor: <strong className="text-white">{rep.reporter.name}</strong> (NISN: {rep.reporter.nisn || '-'})</span>
                                                    {rep.details && (
                                                        <span className="italic text-amber-300/80">"Catatan: {rep.details}"</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Offender Author Card & Action Buttons */}
                                            <div className="lg:w-72 shrink-0 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3">
                                                {rep.target_author ? (
                                                    <div>
                                                        <p className="text-[10px] font-game text-slate-400 uppercase tracking-wider mb-2">
                                                            Pembuat Konten:
                                                        </p>
                                                        <div className="flex items-center gap-2.5">
                                                            <img 
                                                                src={getAvatarUrl(rep.target_author)} 
                                                                alt={rep.target_author.name} 
                                                                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 object-cover shrink-0" 
                                                            />
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-xs font-bold text-white truncate">{rep.target_author.name}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <LevelBadge level={rep.target_author.level} rankName={rep.target_author.rank_name} size="xs" />
                                                                    <span className="text-[10px] text-amber-400 font-mono font-bold">{rep.target_author.exp} EXP</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {rep.target_author.is_muted && (
                                                            <p className="text-[10px] text-red-400 font-bold mt-2">
                                                                🔇 Status: Sedang di-mute
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-500 italic">Akun pembuat tidak ditemukan / konten telah dihapus.</p>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                                                    {rep.target_author && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openPunishModal(rep.target_author)}
                                                            className="w-full py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                        >
                                                            <ShieldExclamationIcon className="w-4 h-4" />
                                                            <span>Hukum Siswa Ini ⚖️</span>
                                                        </button>
                                                    )}

                                                    {rep.status === 'pending' && (
                                                        <div className="flex gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleResolveReport(rep.id, 'resolved', 'Ditangani oleh admin')}
                                                                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                                                <span>Selesai</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleResolveReport(rep.id, 'dismissed')}
                                                                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <XCircleIcon className="w-3.5 h-3.5" />
                                                                <span>Abaikan</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-10 text-center text-slate-400 rounded-2xl">
                                <span className="text-3xl block mb-2">🎉</span>
                                <p className="font-bold text-white text-sm">Tidak ada laporan dengan status ini.</p>
                                <p className="text-xs text-slate-500 mt-1">The Realm saat ini bersih dan kondusif!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: ALL THREADS */}
                {currentTab === 'threads' && (
                    <div className="space-y-4">
                        {/* Search & Category Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <form onSubmit={handleSearchSubmit} className="relative flex-1">
                                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul thread, isi, atau nama penulis..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </form>
                            <div className="flex gap-1.5 overflow-x-auto pb-1">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                                            category === cat.id 
                                                ? 'bg-blue-600 text-white font-bold shadow-md' 
                                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Threads Table / Cards */}
                        <div className="space-y-3">
                            {threads.data && threads.data.length > 0 ? (
                                threads.data.map(t => (
                                    <div 
                                        key={t.id}
                                        className="glass-card p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {t.is_pinned && (
                                                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-game">
                                                        📌 PINNED
                                                    </span>
                                                )}
                                                {t.is_locked && (
                                                    <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 text-[9px] font-game">
                                                        🔒 LOCKED
                                                    </span>
                                                )}
                                                <CategoryBadge category={t.category} size="sm" />
                                                <span className="text-[11px] text-slate-500 font-mono">{t.created_at_human}</span>
                                            </div>

                                            <h3 className="font-bold text-white text-sm truncate hover:text-blue-400 transition-colors">
                                                <a href={`/community/${t.id}`} target="_blank" rel="noreferrer">
                                                    {t.title}
                                                </a>
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={getAvatarUrl(t.author)} 
                                                        alt={t.author.name} 
                                                        className="w-5 h-5 rounded-md bg-slate-800 object-cover" 
                                                    />
                                                    <span className="text-white font-medium">{t.author.name}</span>
                                                    <LevelBadge level={t.author.level} size="xs" />
                                                </div>
                                                <span>💬 {t.replies_count} Balasan</span>
                                                <span>❤️ {t.likes_count} Suka</span>
                                                <span>👁️ {t.views_count} Views</span>
                                                {t.reports_count > 0 && (
                                                    <span className="text-red-400 font-bold font-mono">🚩 {t.reports_count} Laporan</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Moderation Controls */}
                                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePin(t.id)}
                                                className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                                    t.is_pinned 
                                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                                }`}
                                                title={t.is_pinned ? 'Lepas Sematan' : 'Sematkan di Atas (Pin)'}
                                            >
                                                📌
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleToggleLock(t.id)}
                                                className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                                    t.is_locked 
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                                                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                                }`}
                                                title={t.is_locked ? 'Buka Kunci' : 'Kunci Thread'}
                                            >
                                                {t.is_locked ? <LockClosedIcon className="w-4 h-4" /> : <LockOpenIcon className="w-4 h-4" />}
                                            </button>

                                            {t.author.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => openPunishModal(t.author)}
                                                    className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white text-xs transition-all cursor-pointer"
                                                    title="Hukum Penulis Thread"
                                                >
                                                    <ShieldExclamationIcon className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteThread(t.id, t.title)}
                                                className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 border border-slate-700 text-slate-400 hover:text-white text-xs transition-all cursor-pointer"
                                                title="Hapus Thread"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-card p-8 text-center text-slate-400 rounded-2xl">
                                    Tidak ada topik diskusi yang cocok.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: SANCTIONS HISTORY */}
                {currentTab === 'sanctions' && (
                    <div className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
                        <h3 className="font-game text-xs sm:text-sm text-white mb-4 tracking-wider flex items-center gap-2">
                            <span className="text-amber-400">⚖️</span> LOG SANKSI & HUKUMAN REALM
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                                        <th className="pb-3 px-3 font-bold">Waktu</th>
                                        <th className="pb-3 px-3 font-bold">Siswa</th>
                                        <th className="pb-3 px-3 font-bold">Tipe Hukuman</th>
                                        <th className="pb-3 px-3 font-bold">Denda / Durasi</th>
                                        <th className="pb-3 px-3 font-bold">Alasan Pelanggaran</th>
                                        <th className="pb-3 px-3 font-bold">Admin</th>
                                        <th className="pb-3 px-3 text-right font-bold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sanctions.length > 0 ? (
                                        sanctions.map(s => (
                                            <tr key={s.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                                                <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">{s.created_at_human}</td>
                                                <td className="py-3 px-3">
                                                    <span className="font-bold text-white">{s.student.name}</span>
                                                    <span className="block text-[10px] text-slate-500 font-mono">NISN: {s.student.nisn || '-'}</span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                        s.type === 'exp_deduction' 
                                                            ? 'bg-amber-500/20 text-amber-400' 
                                                            : s.type === 'mute' 
                                                            ? 'bg-red-500/20 text-red-400' 
                                                            : s.type === 'streak_reset' 
                                                            ? 'bg-orange-500/20 text-orange-400' 
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {s.type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-3 font-mono font-bold text-amber-400">
                                                    {s.type === 'exp_deduction' ? `${s.amount} EXP` : s.type === 'mute' ? (s.expires_at ? `Hingga ${s.expires_at}` : 'Permanen') : '-'}
                                                </td>
                                                <td className="py-3 px-3 text-slate-300 max-w-xs truncate" title={s.reason}>
                                                    {s.reason}
                                                </td>
                                                <td className="py-3 px-3 text-slate-400 font-medium">{s.admin_name}</td>
                                                <td className="py-3 px-3 text-right">
                                                    {s.type === 'mute' && s.is_active && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUnmute(s.student.id, s.student.name)}
                                                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-[10px] font-bold transition-all cursor-pointer"
                                                        >
                                                            Unmute
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-slate-500">
                                                Belum ada catatan hukuman yang diterbitkan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Punish Student Modal */}
            <PunishStudentModal
                isOpen={isPunishModalOpen}
                onClose={() => {
                    setIsPunishModalOpen(false);
                    setSelectedStudentForPunish(null);
                }}
                student={selectedStudentForPunish}
            />
        </AdminLayout>
    );
}
