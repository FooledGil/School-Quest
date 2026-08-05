import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QuestCard from '@/Components/QuestCard';

// Using the same form as Create but pre-filled
export default function EditQuest() {
    const user = { name: 'Admin Principal', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' };

    // Mock incoming quest data
    const quest = {
        id: 1,
        title: 'Math Homework',
        description: 'Finish exercises 1-15 on page 42.',
        type: 'main',
        category: 'Academic',
        difficulty: 'easy',
        exp: 100,
        is_active: true
    };

    const { data, setData, put, processing, errors } = useForm({
        title: quest.title,
        description: quest.description,
        type: quest.type,
        category: quest.category,
        difficulty: quest.difficulty,
        exp: quest.exp,
        is_active: quest.is_active
    });

    const submit = (e) => {
        e.preventDefault();
        // put(`/admin/quests/${quest.id}`);
        console.log("Update", data);
    };

    return (
        <AdminLayout user={user}>
            <Head title="Edit Quest" />

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/quests" className="text-gray-400 hover:text-white">&larr; Back</Link>
                <h1 className="text-2xl font-bold text-white">Edit Quest</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Identical form fields as Create.jsx */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Quest Title</label>
                            <input 
                                type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Description</label>
                            <textarea 
                                value={data.description} onChange={e => setData('description', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none h-24"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Type</label>
                                <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none">
                                    <option value="main">Main Quest</option>
                                    <option value="additional">Additional Quest</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Category</label>
                                <input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Difficulty</label>
                                <select value={data.difficulty} onChange={e => setData('difficulty', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none">
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">EXP Reward</label>
                                <input type="number" value={data.exp} onChange={e => setData('exp', parseInt(e.target.value)||0)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none font-game text-sm" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-accent-cyan focus:ring-accent-cyan" />
                            <label htmlFor="is_active" className="text-sm text-gray-300">Active</label>
                        </div>

                        <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                            <Link href="/admin/quests" className="px-6 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">Cancel</Link>
                            <button type="submit" disabled={processing} className="bg-accent-cyan hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                Update Quest
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Card Preview</h3>
                    <QuestCard quest={data} isCompleted={false} />
                </div>
            </div>
        </AdminLayout>
    );
}
