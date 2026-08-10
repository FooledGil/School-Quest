import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import QuestCard from '@/Components/QuestCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Quests({ mainQuests = [], additionalQuests = [] }) {
    const gridRef = useRef(null);
    const [tab, setTab] = useState('main');
    const [filter, setFilter] = useState('all');

    const currentRawQuests = tab === 'main' ? mainQuests : additionalQuests;
    const normalizedQuests = currentRawQuests.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty || 'medium',
        exp: q.exp_reward || q.exp || 50,
        exp_reward: q.exp_reward || q.exp || 50,
        category: q.category || 'School',
        isCompleted: q.completed || false,
        submissionStatus: q.submission_status || null,
        rejectionReason: q.rejection_reason || null,
    }));

    const filteredQuests = normalizedQuests.filter(q => {
        if (filter === 'active' && (q.isCompleted || q.submissionStatus === 'pending')) return false;
        if (filter === 'completed' && !q.isCompleted) return false;
        if (filter === 'pending' && q.submissionStatus !== 'pending') return false;
        return true;
    });

    useGSAP(() => {
        if (gridRef.current && filteredQuests.length > 0) {
            const cards = gridRef.current.children;
            gsap.fromTo(
                cards,
                { y: 20, opacity: 0, scale: 0.96 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: 'power2.out' }
            );
        }
    }, { dependencies: [tab, filter], scope: gridRef });

    // Count pending submissions
    const pendingCount = normalizedQuests.filter(q => q.submissionStatus === 'pending').length;

    return (
        <StudentLayout>
            <Head title="Papan Quest" />

            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">Papan Quest</h1>
                <p className="text-slate-400 text-sm">Selesaikan quest harian & tambahan untuk meningkatkan EXP!</p>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-6 mb-6 border-b border-slate-800 pb-px">
                <button 
                    onClick={() => setTab('main')}
                    className={`pb-3 px-1 font-bold text-sm transition-colors relative cursor-pointer ${tab === 'main' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Main Quests ({mainQuests.length})
                    {tab === 'main' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setTab('additional')}
                    className={`pb-3 px-1 font-bold text-sm transition-colors relative cursor-pointer ${tab === 'additional' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Additional Quests ({additionalQuests.length})
                    {tab === 'additional' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 glass-card p-3">
                <div className="flex gap-2">
                    {['all', 'active', 'pending', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                                filter === f 
                                    ? 'bg-blue-600 text-white shadow-sm' 
                                    : 'bg-transparent text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                            {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : f === 'pending' ? `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` : 'Selesai'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quests Grid */}
            {filteredQuests.length > 0 ? (
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredQuests.map(quest => (
                        <QuestCard 
                            key={quest.id} 
                            quest={quest} 
                            isCompleted={quest.isCompleted}
                            submissionStatus={quest.submissionStatus}
                            rejectionReason={quest.rejectionReason}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-3 opacity-60">📜</div>
                    <h3 className="text-lg font-bold text-slate-300 mb-1">Belum Ada Quest</h3>
                    <p className="text-slate-500 text-xs">Tidak ada quest untuk kriteria filter ini.</p>
                </div>
            )}
        </StudentLayout>
    );
}
