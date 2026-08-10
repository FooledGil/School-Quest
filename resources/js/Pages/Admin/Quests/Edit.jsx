import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QuestCard from '@/Components/QuestCard';

export default function EditQuest({ quest }) {
    const { data, setData, put, processing, errors } = useForm({
        title: quest?.title || '',
        description: quest?.description || '',
        category: quest?.category || 'Sosial',
        difficulty: quest?.difficulty || 'medium',
        exp_reward: quest?.exp_reward || 100,
        is_active: quest?.is_active ?? true
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/quests/${quest.id}`);
    };

    return (
        <AdminLayout>
            <Head title="Edit Quest" />

            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/quests" className="text-gray-400 hover:text-white">&larr; Kembali</Link>
                <h1 className="text-2xl font-bold text-white">Edit Quest: {quest?.title}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Judul Quest</label>
                            <input 
                                type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none"
                                required
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">Deskripsi</label>
                            <textarea 
                                value={data.description} onChange={e => setData('description', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none h-24"
                                required
                            />
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Kategori</label>
                                <input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none" required />
                                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-1">Tingkat Kesulitan</label>
                                <select value={data.difficulty} onChange={e => setData('difficulty', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none">
                                    <option value="easy">Easy (Mudah)</option>
                                    <option value="medium">Medium (Sedang)</option>
                                    <option value="hard">Hard (Sulit)</option>
                                </select>
                                {errors.difficulty && <p className="text-red-400 text-xs mt-1">{errors.difficulty}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-400 mb-1">EXP Reward</label>
                            <input type="number" value={data.exp_reward} onChange={e => setData('exp_reward', parseInt(e.target.value)||0)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-accent-cyan outline-none font-game text-sm" min="10" required />
                            {errors.exp_reward && <p className="text-red-400 text-xs mt-1">{errors.exp_reward}</p>}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-accent-cyan focus:ring-accent-cyan" />
                            <label htmlFor="is_active" className="text-sm text-gray-300">Aktif</label>
                        </div>

                        <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                            <Link href="/admin/quests" className="px-6 py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors">Batal</Link>
                            <button type="submit" disabled={processing} className="bg-accent-cyan hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                {processing ? 'Menyimpan...' : 'Update Quest'}
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Live Preview</h3>
                    <QuestCard quest={{ title: data.title, description: data.description, difficulty: data.difficulty, exp: data.exp_reward, category: data.category }} isCompleted={false} />
                </div>
            </div>
        </AdminLayout>
    );
}
