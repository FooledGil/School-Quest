import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import QuestCard from '@/Components/QuestCard';
import ExpGainPopup from '@/Components/ExpGainPopup';

export default function Quests() {
    // Mock user for layout
    const user = {
        name: 'Alex Hunter', level: 4, rank_name: 'Knight', exp: 3450, next_level_exp: 5000,
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex'
    };

    const [tab, setTab] = useState('main'); // main, additional
    const [filter, setFilter] = useState('all'); // all, active, completed
    
    // Popup state
    const [popupData, setPopupData] = useState({ show: false, amount: 0 });

    const quests = [
        { id: 1, type: 'main', status: 'active', title: 'Complete Math Homework', description: 'Finish exercises 1-15 on page 42.', difficulty: 'easy', exp: 100, category: 'Academic' },
        { id: 2, type: 'main', status: 'completed', title: 'Read History Chapter 4', description: 'Read and summarize the chapter on World War II.', difficulty: 'medium', exp: 250, category: 'Academic' },
        { id: 3, type: 'additional', status: 'active', title: 'Help clean the lab', description: 'Assist Mr. Smith in organizing the chemistry lab after school.', difficulty: 'easy', exp: 150, category: 'Community' },
        { id: 4, type: 'main', status: 'active', title: 'Physics Project', description: 'Build a small trebuchet model demonstrating energy transfer.', difficulty: 'hard', exp: 500, category: 'Project' },
        { id: 5, type: 'additional', status: 'active', title: 'Library Assistant', description: 'Help organize the new book arrivals for 1 hour.', difficulty: 'medium', exp: 200, category: 'Community' },
    ];

    const handleComplete = (id) => {
        // In real app, call Inertia router to complete quest
        const quest = quests.find(q => q.id === id);
        setPopupData({ show: true, amount: quest.exp });
        
        // Hide popup after a while
        setTimeout(() => {
            setPopupData({ show: false, amount: 0 });
        }, 2000);
    };

    const filteredQuests = quests.filter(q => {
        if (q.type !== tab) return false;
        if (filter === 'active' && q.status !== 'active') return false;
        if (filter === 'completed' && q.status !== 'completed') return false;
        return true;
    });

    return (
        <StudentLayout user={user}>
            <Head title="Quests Board" />

            <ExpGainPopup show={popupData.show} amount={popupData.amount} />

            <div className="mb-8">
                <h1 className="text-3xl font-game text-white mb-2">Quest Board</h1>
                <p className="text-gray-400">Accept challenges and earn EXP to level up!</p>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-800 pb-px">
                <button 
                    onClick={() => setTab('main')}
                    className={`pb-3 px-2 font-game text-xs transition-colors relative ${tab === 'main' ? 'text-accent-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Main Quests
                    {tab === 'main' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                </button>
                <button 
                    onClick={() => setTab('additional')}
                    className={`pb-3 px-2 font-game text-xs transition-colors relative ${tab === 'additional' ? 'text-accent-purple' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Side Quests
                    {tab === 'additional' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 glass-card p-3">
                <div className="flex gap-2">
                    {['all', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors ${
                                filter === f 
                                    ? 'bg-gray-700 text-white shadow-inner' 
                                    : 'bg-transparent text-gray-400 hover:bg-gray-800'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quests Grid */}
            {filteredQuests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {filteredQuests.map(quest => (
                        <QuestCard 
                            key={quest.id} 
                            quest={quest} 
                            isCompleted={quest.status === 'completed'}
                            onComplete={handleComplete}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 text-center border-dashed border-gray-700 flex flex-col items-center justify-center">
                    <div className="text-4xl mb-4 grayscale opacity-50">📜</div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Quests Found</h3>
                    <p className="text-gray-500 text-sm">Check back later for new challenges.</p>
                </div>
            )}
        </StudentLayout>
    );
}
