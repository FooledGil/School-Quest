import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FlagIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const REPORT_REASONS = [
    { value: 'toxic', label: 'Toxic / Pelecehan / Ujaran Kebencian', icon: '🤬' },
    { value: 'spam', label: 'Spam / Iklan / Konten Berulang', icon: '📢' },
    { value: 'inappropriate', label: 'Konten Tidak Pantas / SARA', icon: '🚫' },
    { value: 'cheat', label: 'Kecurangan / Kebocoran Kunci Jawaban', icon: '🎭' },
    { value: 'other', label: 'Pelanggaran Lainnya', icon: '⚠️' },
];

export default function ReportModal({ isOpen, onClose, targetType = 'thread', targetId, targetTitle = '' }) {
    const modalRef = useRef(null);
    const cardRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        type: targetType,
        id: targetId,
        reason: 'toxic',
        details: '',
    });

    // Keep form data synced with prop changes
    React.useEffect(() => {
        if (targetId) {
            setData(prev => ({
                ...prev,
                type: targetType,
                id: targetId,
            }));
        }
    }, [targetType, targetId]);

    useGSAP(() => {
        if (isOpen && cardRef.current) {
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
            gsap.fromTo(
                cardRef.current,
                { scale: 0.9, y: 20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
            );
        }
    }, { dependencies: [isOpen], scope: modalRef });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/community/report', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div 
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        >
            <div 
                ref={cardRef}
                className="glass-card max-w-md w-full p-5 sm:p-6 bg-slate-900/95 border-2 border-red-500/30 rounded-2xl shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                        <FlagIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-game text-xs sm:text-sm text-white tracking-wider">
                            LAPORKAN KONTEN
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                            {targetType === 'thread' ? 'Topik Diskusi' : 'Komentar Balasan'}
                        </p>
                    </div>
                </div>

                {targetTitle && (
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 mb-4 line-clamp-2 italic">
                        "{targetTitle}"
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason Selection */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Pilih Alasan Pelanggaran <span className="text-red-400">*</span>
                        </label>
                        <div className="space-y-1.5">
                            {REPORT_REASONS.map(r => (
                                <label 
                                    key={r.value}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                                        data.reason === r.value 
                                            ? 'bg-red-500/10 border-red-500/60 text-white font-bold' 
                                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="report_reason"
                                        value={r.value}
                                        checked={data.reason === r.value}
                                        onChange={() => setData('reason', r.value)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm">{r.icon}</span>
                                    <span>{r.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.reason && <p className="text-[11px] text-red-400 mt-1">{errors.reason}</p>}
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Detail Tambahan (Opsional)
                        </label>
                        <textarea
                            rows="3"
                            value={data.details}
                            onChange={(e) => setData('details', e.target.value)}
                            placeholder="Jelaskan alasan pelaporan secara ringkas agar Admin dapat menindaklanjuti..."
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all resize-none"
                            maxLength={1000}
                        />
                        {errors.details && <p className="text-[11px] text-red-400 mt-1">{errors.details}</p>}
                    </div>

                    {/* Notice */}
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] sm:text-[11px] text-amber-300/90 leading-relaxed">
                        <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                        <span>Laporan palsu atau penyalahgunaan fitur lapor dapat dikenakan sanksi denda EXP oleh Admin Realm.</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-xs font-game tracking-wider text-white transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? 'MENGIRIM...' : 'KIRIM LAPORAN 🚩'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
