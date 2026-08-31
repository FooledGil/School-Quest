import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { XMarkIcon, ShieldExclamationIcon, BoltIcon, NoSymbolIcon, FireIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import LevelBadge from '@/Components/LevelBadge';
import { getAvatarUrl } from '@/Utils/avatar';

const SANCTION_TYPES = [
    {
        id: 'exp_deduction',
        label: 'Denda EXP',
        icon: BoltIcon,
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        desc: 'Kurangi EXP siswa & otomatis sesuaikan level jika turun.',
    },
    {
        id: 'mute',
        label: 'Mute Forum',
        icon: NoSymbolIcon,
        color: 'text-red-400 border-red-500/40 bg-red-500/10',
        desc: 'Larang siswa membuat thread & komentar selama kurun waktu tertentu.',
    },
    {
        id: 'streak_reset',
        label: 'Reset Streak',
        icon: FireIcon,
        color: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
        desc: 'Reset seluruh streak harian siswa menjadi 0.',
    },
    {
        id: 'warning',
        label: 'Surat Peringatan',
        icon: DocumentTextIcon,
        color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
        desc: 'Kirim notifikasi teguran resmi tanpa penalti EXP.',
    },
];

const EXP_PRESETS = [50, 100, 200, 500, 1000];
const MUTE_PRESETS = [
    { label: '1 Jam', minutes: 60 },
    { label: '6 Jam', minutes: 360 },
    { label: '24 Jam (1 Hari)', minutes: 1440 },
    { label: '3 Hari', minutes: 4320 },
    { label: '7 Hari (1 Minggu)', minutes: 10080 },
    { label: 'Permanen', minutes: -1 },
];

export default function PunishStudentModal({ isOpen, onClose, student = null }) {
    const modalRef = useRef(null);
    const cardRef = useRef(null);

    const [sanctionType, setSanctionType] = useState('exp_deduction');
    const [expAmount, setExpAmount] = useState(100);
    const [muteDuration, setMuteDuration] = useState(1440);

    const { data, setData, post, processing, reset, errors } = useForm({
        sanction_type: 'exp_deduction',
        amount: 100,
        duration_minutes: 1440,
        reason: '',
    });

    React.useEffect(() => {
        setData(prev => ({
            ...prev,
            sanction_type: sanctionType,
            amount: expAmount,
            duration_minutes: muteDuration,
        }));
    }, [sanctionType, expAmount, muteDuration]);

    useGSAP(() => {
        if (isOpen && cardRef.current) {
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
            gsap.fromTo(
                cardRef.current,
                { scale: 0.9, y: 20, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.4)' }
            );
        }
    }, { dependencies: [isOpen], scope: modalRef });

    if (!isOpen || !student) return null;

    const avatar = getAvatarUrl(student);

    // Live preview EXP after penalty
    const currentExp = student.exp || 0;
    const projectedExp = Math.max(0, currentExp - expAmount);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/students/${student.id}/punish`, {
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={onClose}
        >
            <div 
                ref={cardRef}
                className="glass-card max-w-lg w-full p-5 sm:p-6 bg-slate-900/95 border-2 border-red-500/40 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
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
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                        <ShieldExclamationIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-game text-xs sm:text-sm text-red-400 tracking-wider">
                            HUKUM SISWA / SANCTION
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                            Penalti & Moderasi Tata Tertib Realm
                        </p>
                    </div>
                </div>

                {/* Target Student Preview */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5 mb-5">
                    <img 
                        src={avatar} 
                        alt={student.name} 
                        className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-white text-sm truncate">{student.name}</h4>
                            <LevelBadge level={student.level || 1} rankName={student.rank_name} size="xs" />
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                            <span>NISN: {student.nisn || '-'}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-bold">{student.exp || 0} EXP</span>
                            <span>•</span>
                            <span>🔥 {student.streak_days || 0}d</span>
                        </div>
                        {student.is_muted && (
                            <div className="mt-1 text-[10px] text-red-400 font-bold flex items-center gap-1">
                                <span>🔇 Sedang di-mute hingga: {student.muted_until || 'Aktif'}</span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Sanction Type Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                            Pilih Bentuk Hukuman <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {SANCTION_TYPES.map(st => {
                                const Icon = st.icon;
                                const isSelected = sanctionType === st.id;
                                return (
                                    <button
                                        key={st.id}
                                        type="button"
                                        onClick={() => setSanctionType(st.id)}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected 
                                                ? `${st.color} border-2 shadow-lg` 
                                                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="text-xs font-bold text-white">{st.label}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-tight">{st.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* EXP Deduction Controls */}
                    {sanctionType === 'exp_deduction' && (
                        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                                Jumlah EXP yang Dikurangi
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {EXP_PRESETS.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setExpAmount(amt)}
                                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                                            expAmount === amt 
                                                ? 'bg-amber-500 text-slate-950 shadow-md' 
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        -{amt} EXP
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <span className="text-xs text-slate-400">Custom:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="50000"
                                    value={expAmount}
                                    onChange={(e) => setExpAmount(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                                />
                                <span className="text-[11px] text-slate-400 font-mono ml-auto">
                                    {currentExp} &rarr; <span className="text-red-400 font-bold">{projectedExp} EXP</span>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Mute Controls */}
                    {sanctionType === 'mute' && (
                        <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2.5">
                            <label className="block text-xs font-bold text-red-400 uppercase tracking-wider">
                                Durasi Senyap (Mute)
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {MUTE_PRESETS.map(p => (
                                    <button
                                        key={p.minutes}
                                        type="button"
                                        onClick={() => setMuteDuration(p.minutes)}
                                        className={`p-2 rounded-lg text-xs font-medium transition-all text-center cursor-pointer ${
                                            muteDuration === p.minutes 
                                                ? 'bg-red-600 text-white font-bold shadow-md' 
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reason / Note (Mandatory) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                            Alasan Hukuman (Akan Ditampilkan ke Siswa) <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            rows="3"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Contoh: Mengirim komentar tidak pantas/toxic di thread #14. Dikenakan denda EXP dan mute 24 jam."
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all resize-none"
                            required
                        />
                        {errors.reason && <p className="text-[11px] text-red-400 mt-1">{errors.reason}</p>}
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
                            disabled={processing || !data.reason.trim()}
                            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-xs font-game tracking-wider text-white transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {processing ? 'MENERAPKAN...' : 'TERAPKAN HUKUMAN ⚖️'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
