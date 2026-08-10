import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CheckCircleIcon, XCircleIcon, ClockIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function SubmissionCard({ submission, onApprove, onReject }) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const cardRef = useRef(null);

    const difficultyStyles = {
        easy: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        hard: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    };
    const diffClass = difficultyStyles[submission.quest_difficulty] || difficultyStyles.easy;

    const handleApprove = () => {
        setProcessing(true);
        router.post(`/admin/validations/${submission.id}/approve`, {}, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/admin/validations/${submission.id}/reject`, {
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => {
                setProcessing(false);
                setShowRejectForm(false);
                setRejectionReason('');
            },
        });
    };

    return (
        <div ref={cardRef} className="glass-card p-5 space-y-4">
            {/* Header: Student info */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img 
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(submission.student_avatar_seed)}`} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-lg bg-slate-800" 
                    />
                    <div>
                        <p className="text-sm font-bold text-white">{submission.student_name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{submission.student_nisn || 'N/A'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{submission.submitted_at}</p>
                    <p className="text-amber-400 font-bold text-xs mt-0.5">+{submission.exp_reward} EXP</p>
                </div>
            </div>

            {/* Quest info */}
            <div className="bg-[#0d1118] border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{submission.quest_title}</h4>
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded border ${diffClass}`}>
                        {submission.quest_difficulty}
                    </span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    {submission.quest_category}
                </span>
            </div>

            {/* Proof text */}
            <div className="bg-[#0d1118] border border-slate-800 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
                    <DocumentTextIcon className="w-3.5 h-3.5" />
                    Bukti Pengerjaan
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {submission.proof_text || <span className="text-slate-600 italic">Tidak ada bukti teks</span>}
                </p>
            </div>

            {/* Reject form */}
            {showRejectForm ? (
                <form onSubmit={handleReject} className="space-y-2">
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Alasan penolakan (opsional)..."
                        className="w-full bg-[#0d0f15] border border-rose-500/30 rounded-lg p-2.5 text-sm text-white placeholder-slate-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none resize-none transition-all duration-200"
                        rows={2}
                        maxLength={500}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => { setShowRejectForm(false); setRejectionReason(''); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                        >
                            {processing ? 'Menolak...' : 'Konfirmasi Tolak'}
                        </button>
                    </div>
                </form>
            ) : (
                /* Action buttons */
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                    >
                        <CheckCircleIcon className="w-4 h-4" />
                        {processing ? 'Memproses...' : 'Approve'}
                    </button>
                    <button
                        onClick={() => setShowRejectForm(true)}
                        disabled={processing}
                        className="flex-1 bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-400 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer"
                    >
                        <XCircleIcon className="w-4 h-4" />
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}

function HistoryRow({ item }) {
    return (
        <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
            <td className="py-3 px-4 text-sm text-white">{item.student_name}</td>
            <td className="py-3 px-4 text-sm text-slate-300">{item.quest_title}</td>
            <td className="py-3 px-4">
                {item.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                        <CheckCircleIcon className="w-3.5 h-3.5" /> Approved
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-bold">
                        <XCircleIcon className="w-3.5 h-3.5" /> Rejected
                    </span>
                )}
            </td>
            <td className="py-3 px-4 text-xs text-amber-400 font-bold">+{item.exp_reward}</td>
            <td className="py-3 px-4 text-xs text-slate-500">{item.validated_by_name}</td>
            <td className="py-3 px-4 text-xs text-slate-500">{item.validated_at}</td>
        </tr>
    );
}

export default function Validations({ submissions = [], history = [] }) {
    const gridRef = useRef(null);
    const [activeTab, setActiveTab] = useState('pending');

    useGSAP(() => {
        if (gridRef.current && submissions.length > 0) {
            const cards = gridRef.current.children;
            gsap.fromTo(
                cards,
                { y: 20, opacity: 0, scale: 0.96 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
            );
        }
    }, { dependencies: [activeTab], scope: gridRef });

    return (
        <AdminLayout>
            <Head title="Validasi Quest" />

            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">Validasi Quest</h1>
                <p className="text-slate-400 text-sm">Review dan validasi bukti pengerjaan quest dari siswa.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-6 border-b border-slate-800 pb-px">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`pb-3 px-1 font-bold text-sm transition-colors relative cursor-pointer ${activeTab === 'pending' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Menunggu Validasi ({submissions.length})
                    {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full"></div>}
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 px-1 font-bold text-sm transition-colors relative cursor-pointer ${activeTab === 'history' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Riwayat ({history.length})
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></div>}
                </button>
            </div>

            {activeTab === 'pending' ? (
                submissions.length > 0 ? (
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {submissions.map(submission => (
                            <SubmissionCard key={submission.id} submission={submission} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-4xl mb-3 opacity-60">✅</div>
                        <h3 className="text-lg font-bold text-slate-300 mb-1">Semua Bersih!</h3>
                        <p className="text-slate-500 text-xs">Tidak ada submission yang menunggu validasi.</p>
                    </div>
                )
            ) : (
                history.length > 0 ? (
                    <div className="glass-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-700 bg-slate-800/30">
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Siswa</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Quest</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">EXP</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Divalidasi Oleh</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(item => (
                                        <HistoryRow key={item.id} item={item} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-4xl mb-3 opacity-60">📋</div>
                        <h3 className="text-lg font-bold text-slate-300 mb-1">Belum Ada Riwayat</h3>
                        <p className="text-slate-500 text-xs">Belum ada submission yang divalidasi.</p>
                    </div>
                )
            )}
        </AdminLayout>
    );
}
