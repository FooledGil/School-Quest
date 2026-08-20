import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    MagnifyingGlassIcon, 
    ShieldCheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    WrenchScrewdriverIcon,
    AcademicCapIcon,
    UserGroupIcon,
    SparklesIcon,
    BookOpenIcon,
    TagIcon
} from '@heroicons/react/24/outline';

export default function QuestIndex({ quests = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleDelete = (id) => {
        if (confirm('Apakah kamu yakin ingin menghapus quest ini?')) {
            router.delete(`/admin/quests/${id}`);
        }
    };

    const toggleStatus = (quest) => {
        router.put(`/admin/quests/${quest.id}`, {
            title: quest.title,
            description: quest.description,
            category: quest.category || 'general',
            exp_reward: quest.exp_reward || 50,
            difficulty: quest.difficulty || 'medium',
            is_active: !quest.is_active
        });
    };

    // Extract unique categories for filter dropdown
    const categories = Array.from(new Set(quests.map(q => q.category).filter(Boolean)));

    // Filtering logic
    const filteredQuests = quests.filter(quest => {
        const matchesSearch = 
            quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            quest.description?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = 
            selectedCategory === 'all' || 
            quest.category?.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredQuests.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuests = filteredQuests.slice(startIndex, startIndex + itemsPerPage);

    // Dynamic Icon Selector for Categories
    const getCategoryIcon = (category) => {
        const cat = (category || '').toLowerCase();
        if (cat === 'piket') return <WrenchScrewdriverIcon className="w-5 h-5 text-amber-400" />;
        if (cat === 'social') return <UserGroupIcon className="w-5 h-5 text-blue-400" />;
        if (cat === 'activity') return <SparklesIcon className="w-5 h-5 text-emerald-400" />;
        if (cat === 'creative') return <BookOpenIcon className="w-5 h-5 text-purple-400" />;
        return <AcademicCapIcon className="w-5 h-5 text-sky-400" />;
    };

    // Stats Calculations
    const totalQuestsCount = quests.length;
    const activeQuestsCount = quests.filter(q => q.is_active).length;
    const inactiveQuestsCount = quests.filter(q => !q.is_active).length;
    const hardQuestsCount = quests.filter(q => q.difficulty === 'hard').length;

    return (
        <AdminLayout>
            <Head title="Kelola Quest - Admin Commander" />

            <div className="space-y-6">
                
                {/* SEARCH & HEADER BAR */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="flex-1 w-full max-w-md">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari quest..." 
                                className="w-full bg-[#1A1F26] border border-gray-700 rounded-lg px-10 py-2.5 sm:py-2 focus:outline-none focus:border-blue-500 text-sm text-gray-200 placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* PAGE TITLE & ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Kelola Quest Tambahan</h2>
                        <p className="text-xs text-gray-400 flex items-center mt-1 font-semibold uppercase tracking-wider">
                            <ShieldCheckIcon className="w-4 h-4 mr-1 text-blue-500" /> ADMIN CONTROL PANEL
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-[#1A1F26] border border-gray-700 text-xs sm:text-sm text-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 focus:outline-none focus:border-blue-500 flex-1 sm:flex-initial min-w-[130px]"
                        >
                            <option value="all">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>

                        <Link 
                            href="/admin/quests/create"
                            className="bg-[#10B981] hover:bg-emerald-600 text-black font-bold px-4 py-2.5 sm:py-2 rounded-lg flex items-center justify-center text-xs sm:text-sm transition shadow-md flex-1 sm:flex-initial"
                        >
                            <PlusIcon className="w-4 h-4 mr-1.5 stroke-[3]" /> Buat Quest Baru
                        </Link>
                    </div>
                </div>

                {/* STATS CARDS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-[#1A1F26] p-3.5 sm:p-4 border border-blue-900/50 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">Total Quest</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{totalQuestsCount}</p>
                    </div>

                    <div className="bg-[#1A1F26] p-3.5 sm:p-4 border border-emerald-900/50 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">Aktif</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1 text-emerald-500">{activeQuestsCount}</p>
                    </div>

                    <div className="bg-[#1A1F26] p-3.5 sm:p-4 border border-amber-900/50 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">Nonaktif</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1 text-amber-500">{inactiveQuestsCount}</p>
                    </div>

                    <div className="bg-[#1A1F26] p-3.5 sm:p-4 border border-red-900/50 rounded-lg shadow-sm">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider truncate">Tingkat Hard</p>
                        <p className="text-xl sm:text-2xl font-bold mt-1 text-red-500">{hardQuestsCount}</p>
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="bg-[#11141B] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[620px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-800 bg-[#0E1118]">
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Quest Title</th>
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Type</th>
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Difficulty</th>
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Reward</th>
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Status</th>
                                    <th className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/80">
                                {paginatedQuests.length > 0 ? (
                                    paginatedQuests.map((quest) => (
                                        <tr key={quest.id} className="hover:bg-gray-800/30 transition group">
                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mr-3 sm:mr-4 shrink-0 shadow-inner">
                                                    {getCategoryIcon(quest.category)}
                                                </div>
                                                <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                                                    <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                                                        {quest.title}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                                                        {quest.category ? `${quest.category.toUpperCase()} • ` : ''} 
                                                        {quest.description || 'Tanpa deskripsi'}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                                                <span className="text-[10px] border border-blue-500/50 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">
                                                    {quest.type || 'Additional'}
                                                </span>
                                            </td>

                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                                                {quest.difficulty === 'easy' && (
                                                    <span className="bg-emerald-900/30 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded uppercase border border-emerald-800/40">
                                                        Easy
                                                    </span>
                                                )}
                                                {quest.difficulty === 'medium' && (
                                                    <span className="bg-amber-900/30 text-amber-500 text-[10px] font-bold px-2 py-1 rounded uppercase border border-amber-800/40">
                                                        Medium
                                                    </span>
                                                )}
                                                {quest.difficulty === 'hard' && (
                                                    <span className="bg-red-900/30 text-red-500 text-[10px] font-bold px-2 py-1 rounded uppercase border border-red-800/40">
                                                        Hard
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4 font-bold text-amber-500 text-xs sm:text-sm">
                                                +{quest.exp_reward || quest.exp} EXP
                                            </td>

                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(quest)}
                                                    className={`w-10 h-5 rounded-full relative transition-colors focus:outline-none cursor-pointer ${
                                                        quest.is_active ? 'bg-emerald-500' : 'bg-gray-700'
                                                    }`}
                                                    title={quest.is_active ? 'Status: Aktif (Klik untuk nonaktifkan)' : 'Status: Nonaktif (Klik untuk aktifkan)'}
                                                >
                                                    <div 
                                                        className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                                                            quest.is_active ? 'right-1' : 'left-1'
                                                        }`} 
                                                    />
                                                </button>
                                            </td>

                                            <td className="px-4 sm:px-6 py-3.5 sm:py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link 
                                                        href={`/admin/quests/${quest.id}/edit`}
                                                        className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white transition shadow-sm cursor-pointer"
                                                        title="Edit Quest"
                                                    >
                                                        <PencilSquareIcon className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleDelete(quest.id)}
                                                        className="p-1.5 bg-red-600 hover:bg-red-500 rounded text-white transition shadow-sm cursor-pointer"
                                                        title="Hapus Quest"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            <TagIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                                            <p className="text-sm font-semibold text-gray-300">Tidak ada quest ditemukan</p>
                                            <p className="text-xs text-gray-500 mt-1">Coba ganti kata kunci pencarian atau kategori filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION SECTION */}
                    <div className="p-3.5 sm:p-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 bg-[#0E1118]">
                        <p className="text-[11px] sm:text-xs text-gray-400 text-center sm:text-left">
                            Menampilkan <span className="font-semibold text-white">{filteredQuests.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-semibold text-white">{Math.min(startIndex + itemsPerPage, filteredQuests.length)}</span> dari <span className="font-semibold text-white">{filteredQuests.length}</span> Quests
                        </p>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button 
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="p-1.5 sm:p-2 border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 transition cursor-pointer"
                            >
                                <ChevronLeftIcon className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-2.5 sm:px-3 py-1 text-xs rounded border transition font-medium cursor-pointer ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'bg-[#1A1F26] text-gray-300 border-gray-700 hover:bg-gray-800'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button 
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="p-1.5 sm:p-2 border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 transition cursor-pointer"
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
