import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import ThreadCard from '@/Components/Community/ThreadCard';
import NewThreadModal from '@/Components/Community/NewThreadModal';
import CategoryBadge, { CATEGORIES } from '@/Components/Community/CategoryBadge';
import LevelBadge from '@/Components/LevelBadge';
import ReportModal from '@/Components/Community/ReportModal';
import { getAvatarUrl } from '@/Utils/avatar';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    ShieldCheckIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
    NoSymbolIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Community({ 
    threads = { data: [], links: [] }, 
    filters = { category: 'all', search: '', sort: 'latest' },
    categoryCounts = {},
    topMembers = [],
    isMuted = false,
    muteRemaining = null
}) {
    const pageRef = useRef(null);
    const threadsRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [currentSort, setCurrentSort] = useState(filters.sort || 'latest');

    // Report modal state
    const [reportModalData, setReportModalData] = useState({ isOpen: false, type: 'thread', id: null, title: '' });

    const handleOpenReport = (target) => {
        setReportModalData({
            isOpen: true,
            type: target.type,
            id: target.id,
            title: target.title,
        });
    };

    // Handle filter / query updates
    const updateFilters = (newCategory, newSort, newSearch) => {
        router.get('/community', {
            category: newCategory !== undefined ? newCategory : selectedCategory,
            sort: newSort !== undefined ? newSort : currentSort,
            search: newSearch !== undefined ? newSearch : searchQuery,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryClick = (catId) => {
        setSelectedCategory(catId);
        updateFilters(catId, currentSort, searchQuery);
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setCurrentSort(val);
        updateFilters(selectedCategory, val, searchQuery);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateFilters(selectedCategory, currentSort, searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        updateFilters(selectedCategory, currentSort, '');
    };

    useGSAP(() => {
        if (pageRef.current) {
            const tl = gsap.timeline();

            tl.fromTo(
                '.anim-header',
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );

            tl.fromTo(
                '.anim-categories',
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
                '-=0.2'
            );

            if (threadsRef.current && threadsRef.current.children.length > 0) {
                tl.fromTo(
                    threadsRef.current.children,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
                    '-=0.15'
                );
            }
        }
    }, { scope: pageRef, dependencies: [threads.data] });

    const totalThreadsCount = categoryCounts.all || 0;

    return (
        <StudentLayout>
            <Head title="The Realm — Komunitas" />

            <div ref={pageRef} className="space-y-6 sm:space-y-8">
                {/* Hero Header */}
                <div className="anim-header glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-900/70 to-blue-950/40 border-l-4 border-l-blue-500 shadow-xl border-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-game text-[8px] sm:text-[9px] tracking-wider uppercase">
                                <span>⚔️</span>
                                <span>GUILD FORUM & COMMUNITY</span>
                            </div>

                            <h1 className="font-game text-base sm:text-xl md:text-2xl text-white tracking-wider drop-shadow-md flex items-center gap-3">
                                <span>🏰</span>
                                <span>THE REALM</span>
                            </h1>

                            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-loose font-body">
                                Ruang berkumpul, berdiskusi, dan berbagi strategi bagi para petualang <strong className="text-blue-400">SchoolQuest</strong>. Tanyakan bantuan misi, bagikan pencapaianmu, atau usulkan ide baru!
                            </p>
                        </div>

                        {/* CTA Create Thread Button */}
                        {isMuted ? (
                            <button
                                type="button"
                                disabled
                                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-game text-xs text-slate-400 bg-slate-800 border border-slate-700 opacity-75 cursor-not-allowed tracking-wider shrink-0 w-full sm:w-auto shadow-inner"
                                title={`Anda sedang disenyapkan (Mute) ${muteRemaining ? `hingga ${muteRemaining}` : ''}`}
                            >
                                <LockClosedIcon className="w-4 h-4 text-red-400" />
                                <span>TERKUNCI (MUTE)</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-game text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300/50 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer tracking-wider shrink-0 w-full sm:w-auto"
                            >
                                <PlusIcon className="w-4 h-4 stroke-[3]" />
                                <span>BUAT TOPIK BARU</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mute Active Alert Banner */}
                {isMuted && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 flex items-start gap-3.5 text-xs sm:text-sm shadow-lg shadow-red-500/5">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                            <NoSymbolIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold text-red-400 font-game text-[10px] sm:text-xs mb-1 tracking-wider">
                                STATUS: AKUN SEDANG DISENYAPKAN (MUTE)
                            </p>
                            <p className="leading-relaxed text-slate-300 text-xs font-body">
                                Anda tidak dapat membuat topik baru atau mengirim komentar balasan {muteRemaining ? `(berlaku hingga ${muteRemaining})` : ''} karena sanksi pelanggaran tata tertib The Realm.
                            </p>
                        </div>
                    </div>
                )}

                {/* Categories Bar */}
                <div className="anim-categories flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none px-0.5">
                    {/* All Categories Tab */}
                    <button
                        type="button"
                        onClick={() => handleCategoryClick('all')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                            selectedCategory === 'all'
                                ? 'bg-blue-600/25 text-blue-400 border-blue-500/50 shadow-md shadow-blue-500/10'
                                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                        }`}
                    >
                        <span>🌐</span>
                        <span>Semua Topik</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300">
                            {totalThreadsCount}
                        </span>
                    </button>

                    {/* Category Tabs */}
                    {Object.values(CATEGORIES).map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        const count = categoryCounts[cat.id] || 0;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                                    isSelected
                                        ? `${cat.color} shadow-md`
                                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                                <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Sort Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari topik diskusi atau nama petualang..."
                            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-12 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-body shadow-inner"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        )}
                    </form>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <AdjustmentsHorizontalIcon className="w-4 h-4 text-slate-400" />
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            aria-label="Urutkan Topik"
                            className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-300 focus:outline-hidden focus:border-blue-500 transition-all cursor-pointer font-body"
                        >
                            <option value="latest">🕐 Terbaru</option>
                            <option value="popular">🔥 Paling Populer</option>
                            <option value="active">💬 Diskusi Aktif</option>
                            <option value="unanswered">❓ Belum Dibalas</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Grid: Threads + Sidebar Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left: Threads Stream */}
                    <div className="lg:col-span-2 space-y-4 min-w-0">
                        {threads.data && threads.data.length > 0 ? (
                            <>
                                <div ref={threadsRef} className="space-y-4">
                                    {threads.data.map((thread) => (
                                        <ThreadCard 
                                            key={thread.id} 
                                            thread={thread} 
                                            onReport={handleOpenReport}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {threads.links && threads.links.length > 3 && (
                                    <div className="flex items-center justify-center gap-1.5 pt-6 pb-2 flex-wrap">
                                        {threads.links.map((link, idx) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={idx}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                        className="px-3 py-1.5 text-xs text-slate-600 rounded-lg select-none"
                                                    />
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    preserveScroll
                                                    preserveState
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-md shadow-blue-500/20'
                                                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="glass-card p-8 sm:p-12 text-center border-2 border-dashed border-slate-800/80 bg-slate-900/40 space-y-4">
                                <div className="text-4xl sm:text-5xl">🧭</div>
                                <div>
                                    <h3 className="font-game text-xs sm:text-sm text-white mb-2 tracking-wider">
                                        BELUM ADA TOPIK DI SINI
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                                        {searchQuery 
                                            ? `Tidak ada topik yang cocok dengan pencarian "${searchQuery}". Coba kata kunci lain.`
                                            : 'Jadilah petualang pertama yang membuka diskusi di kategori ini!'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-game text-[11px] text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer tracking-wider"
                                >
                                    <PlusIcon className="w-4 h-4 stroke-[3]" />
                                    <span>MULAI TOPIK PERTAMA</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar Widgets */}
                    <div className="space-y-6 min-w-0">
                        {/* Top Active Adventurers Widget */}
                        <div className="glass-card p-4 sm:p-5 border-2 border-slate-800/80 bg-slate-900/60 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                                <span className="text-lg">👑</span>
                                <h3 className="font-game text-xs text-white tracking-wider">
                                    PETUALANG TERAKTIF
                                </h3>
                            </div>

                            <div className="space-y-2.5">
                                {topMembers && topMembers.length > 0 ? (
                                    topMembers.map((member, index) => {
                                        const memberAvatar = getAvatarUrl(member);
                                        const totalActivity = (member.forum_threads_count || 0) + (member.forum_replies_count || 0);
                                        return (
                                            <div key={member.id} className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className={`font-game text-[9px] w-4 text-center shrink-0 ${
                                                        index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-600' : 'text-slate-500'
                                                    }`}>
                                                        #{index + 1}
                                                    </span>
                                                    <img 
                                                        src={memberAvatar} 
                                                        alt={member.name} 
                                                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 object-cover shrink-0" 
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <p className="font-bold text-xs text-white truncate max-w-[100px] sm:max-w-[120px]">
                                                                {member.name}
                                                            </p>
                                                            <LevelBadge level={member.level || 1} size="xs" />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 truncate">
                                                            {member.class ? `Kelas ${member.class}` : (member.rank_name || 'Petualang')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <span className="font-mono text-xs font-bold text-amber-400">
                                                        {totalActivity}
                                                    </span>
                                                    <p className="text-[9px] text-slate-500">post</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-2">Belum ada aktivitas</p>
                                )}
                            </div>
                        </div>

                        {/* Guild Rules / Guidelines */}
                        <div className="glass-card p-4 sm:p-5 border-2 border-slate-800/80 bg-slate-900/60 space-y-3">
                            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                                <ShieldCheckIcon className="w-5 h-5 text-blue-400" />
                                <h3 className="font-game text-xs text-white tracking-wider">
                                    KODE ETIK GUILD
                                </h3>
                            </div>

                            <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed font-body">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">✦</span>
                                    <span>Gunakan bahasa yang sopan dan saling menghormati rekan siswa.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">✦</span>
                                    <span>Pilih kategori yang tepat agar diskusi mudah ditemukan.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">✦</span>
                                    <span>Bantu rekan yang mengalami kesulitan dalam quest dan materi.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-400">✦</span>
                                    <span>Dilarang menyebarkan konten yang tidak pantas atau spam.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Thread Modal */}
            <NewThreadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultCategory={selectedCategory === 'all' ? 'umum' : selectedCategory}
            />

            {/* Report Content Modal */}
            <ReportModal
                isOpen={reportModalData.isOpen}
                onClose={() => setReportModalData(prev => ({ ...prev, isOpen: false }))}
                targetType={reportModalData.type}
                targetId={reportModalData.id}
                targetTitle={reportModalData.title}
            />
        </StudentLayout>
    );
}
