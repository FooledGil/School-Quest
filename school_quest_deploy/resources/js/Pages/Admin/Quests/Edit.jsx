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

            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <Link href="/admin/quests" className="text-gray-400 hover:text-white text-sm font-semibold">&larr; Kembali</Link>
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">Edit Quest: {quest?.title}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 glass-card p-4 sm:p-6 min-w-0">
                    <form onSubmit={submit} className="space-y-5 sm:space-y-6">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1">Judul Quest</label>
                            <input 
                                type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm"
                                required
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1">Deskripsi</label>
                            <textarea 
                                value={data.description} onChange={e => setData('description', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24 text-sm resize-none"
                                required
                            />
                            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1">Kategori</label>
                                <input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm" required />
                                {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1">Tingkat Kesulitan</label>
                                <select value={data.difficulty} onChange={e => setData('difficulty', e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none text-sm">
                                    <option value="easy">Easy (Mudah)</option>
                                    <option value="medium">Medium (Sedang)</option>
                                    <option value="hard">Hard (Sulit)</option>
                                </select>
                                {errors.difficulty && <p className="text-red-400 text-xs mt-1">{errors.difficulty}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1">EXP Reward</label>
                            <input type="number" value={data.exp_reward} onChange={e => setData('exp_reward', parseInt(e.target.value)||0)} className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none font-game text-sm" min="10" required />
                            {errors.exp_reward && <p className="text-red-400 text-xs mt-1">{errors.exp_reward}</p>}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                            <label htmlFor="is_active" className="text-xs sm:text-sm text-gray-300 cursor-pointer">Aktif</label>
                        </div>

                        <div className="pt-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
                            <Link href="/admin/quests" className="px-6 py-2.5 sm:py-2 rounded-lg text-gray-400 hover:bg-gray-800 transition-colors text-center text-sm font-semibold">Batal</Link>
                            <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 sm:py-2 rounded-lg font-bold shadow-md transition-all cursor-pointer text-sm">
                                {processing ? 'Menyimpan...' : 'Update Quest'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Live Preview</h3>
                    <QuestCard quest={{ title: data.title, description: data.description, difficulty: data.difficulty, exp: data.exp_reward, category: data.category }} isCompleted={false} />
                </div>
            </div>
        </AdminLayout>
    );
}
