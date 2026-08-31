import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { CATEGORIES } from './CategoryBadge';
import { XMarkIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';

export default function NewThreadModal({ isOpen, onClose, defaultCategory = 'umum' }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category: defaultCategory,
        title: '',
        body: '',
    });

    useEffect(() => {
        if (isOpen) {
            setData('category', defaultCategory);
            if (backdropRef.current && modalRef.current) {
                gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
                gsap.fromTo(
                    modalRef.current,
                    { scale: 0.92, opacity: 0, y: 20 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' }
                );
            }
        } else {
            reset();
            clearErrors();
        }
    }, [isOpen, defaultCategory]);

    const handleClose = () => {
        if (backdropRef.current && modalRef.current) {
            gsap.to(modalRef.current, { scale: 0.95, opacity: 0, y: 15, duration: 0.15 });
            gsap.to(backdropRef.current, { 
                opacity: 0, 
                duration: 0.15, 
                onComplete: () => {
                    reset();
                    clearErrors();
                    onClose();
                } 
            });
        } else {
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/community', {
            onSuccess: () => {
                handleClose();
            },
        });
    };

    if (!isOpen) return null;

    const currentCatConfig = CATEGORIES[data.category] || CATEGORIES.umum;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            {/* Backdrop */}
            <div 
                ref={backdropRef}
                onClick={handleClose}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Box */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl bg-slate-900 border-2 border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#0c1220]">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xl">📜</span>
                        <div>
                            <h2 className="font-game text-xs sm:text-sm text-white tracking-wider">
                                BUAT TOPIK DISKUSI
                            </h2>
                            <p className="text-[11px] text-slate-400">Bagikan ide, pertanyaan, atau pencapaianmu ke The Realm</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Pilih Kategori <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.values(CATEGORIES).map((cat) => {
                                const isSelected = data.category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setData('category', cat.id)}
                                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            isSelected 
                                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10' 
                                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                    >
                                        <span className="text-base">{cat.icon}</span>
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs truncate">{cat.label}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.category && (
                            <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.category}</p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1.5 italic">
                            {currentCatConfig.description}
                        </p>
                    </div>

                    {/* Title Input */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Judul Topik <span className="text-rose-400">*</span>
                            </label>
                            <span className={`text-[10px] font-mono ${data.title.length > 180 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {data.title.length}/200
                            </span>
                        </div>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Tips Cepat Menyelesaikan Quest Matematika Aljabar..."
                            maxLength={200}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-body"
                        />
                        {errors.title && (
                            <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.title}</p>
                        )}
                    </div>

                    {/* Body Textarea */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Isi Pembahasan <span className="text-rose-400">*</span>
                            </label>
                            <span className="text-[10px] font-mono text-slate-500">
                                {data.body.length}/10000
                            </span>
                        </div>
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Jelaskan secara detail apa yang ingin kamu diskusikan atau tanyakan. Rekan guild akan membaca postinganmu..."
                            rows={6}
                            maxLength={10000}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-body resize-y"
                        />
                        {errors.body && (
                            <p className="text-xs text-rose-400 mt-1 font-semibold">{errors.body}</p>
                        )}
                    </div>

                    {/* Guidelines Notice */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
                        <InformationCircleIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>
                            Harap jaga kesopanan, hormati rekan sesama petualang, dan gunakan kategori yang sesuai demi kenyamanan komunitas guild.
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing || !data.title.trim() || !data.body.trim()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-game text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300/40 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            <span>{processing ? 'MEMPROSES...' : '⚔️ TERBITKAN'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
