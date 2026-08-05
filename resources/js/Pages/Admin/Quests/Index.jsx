import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function QuestIndex() {
    const user = { name: 'Admin Principal', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' };

    const quests = [
        { id: 1, title: 'Math Homework', type: 'Main', difficulty: 'easy', exp: 100, active: true },
        { id: 2, title: 'Physics Project', type: 'Main', difficulty: 'hard', exp: 500, active: true },
        { id: 3, title: 'Library Assistant', type: 'Additional', difficulty: 'medium', exp: 200, active: false },
    ];

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this quest?')) {
            // router.delete(`/admin/quests/${id}`);
            console.log("Delete", id);
        }
    };

    const toggleStatus = (id) => {
        // router.put(`/admin/quests/${id}/toggle`);
        console.log("Toggle", id);
    };

    const diffColors = {
        easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
        medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        hard: 'text-red-400 bg-red-400/10 border-red-400/20',
    };

    return (
        <AdminLayout user={user}>
            <Head title="Manage Quests" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Quests</h1>
                    <p className="text-gray-400 text-sm mt-1">Create and manage quests for students.</p>
                </div>
                <Link 
                    href="/admin/quests/create"
                    className="bg-accent-cyan hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Quest
                </Link>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-gray-800 text-xs font-bold text-gray-400 uppercase">
                                <th className="p-4">Title</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Difficulty</th>
                                <th className="p-4 text-center">EXP</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quests.map((quest) => (
                                <tr key={quest.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-white">{quest.title}</td>
                                    <td className="p-4 text-sm text-gray-300">{quest.type}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${diffColors[quest.difficulty]}`}>
                                            {quest.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-game text-xs text-accent-gold">{quest.exp}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => toggleStatus(quest.id)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                                quest.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                                            }`}
                                        >
                                            {quest.active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <Link 
                                            href={`/admin/quests/${quest.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-accent-cyan bg-gray-800 rounded transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(quest.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 bg-gray-800 rounded transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
