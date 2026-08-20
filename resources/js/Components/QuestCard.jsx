import React, { useRef, useState } from 'react';
import { CheckCircleIcon, PlayIcon, ClockIcon, XCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function QuestCard({ quest = {}, onComplete, isCompleted, submissionStatus, rejectionReason }) {
    const cardRef = useRef(null);
    const [showProofForm, setShowProofForm] = useState(false);
    const [proofText, setProofText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const difficultyStyles = {
        easy: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        hard: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    };

    const diffClass = difficultyStyles[quest.difficulty] || difficultyStyles.easy;

    useGSAP(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, { scope: cardRef });

    const handleMouseEnter = () => {
        if (!isCompleted && submissionStatus !== 'pending' && cardRef.current) {
            gsap.to(cardRef.current, { y: -4, scale: 1.015, duration: 0.25, ease: 'power2.out' });
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' });
        }
    };

    const handleSubmitProof = (e) => {
        e.preventDefault();
        if (!proofText.trim()) return;
        setSubmitting(true);

        router.post(`/quests/${quest.id}/complete`, {
            proof_text: proofText,
        }, {
            onSuccess: () => {
                setShowProofForm(false);
                setProofText('');
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            },
        });
    };

    // Determine overlay status
    const getStatusOverlay = () => {
        if (isCompleted || submissionStatus === 'approved') {
            return (
                <div className="absolute inset-0 bg-[#0b0f17]/70 flex items-center justify-center z-10 rounded-xl backdrop-blur-xs">
                    <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md">
                        <CheckCircleIcon className="w-4 h-4" />
                        Disetujui
                    </div>
                </div>
            );
        }
        if (submissionStatus === 'pending') {
            return (
                <div className="absolute inset-0 bg-[#0b0f17]/60 flex items-center justify-center z-10 rounded-xl backdrop-blur-xs">
                    <div className="bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md animate-pulse">
                        <ClockIcon className="w-4 h-4" />
                        Menunggu Validasi
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div 
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`glass-card p-4 sm:p-5 relative flex flex-col justify-between transition-colors duration-200 min-w-0 ${
                isCompleted || submissionStatus === 'pending' ? 'opacity-65' : ''
            }`}
        >
            {getStatusOverlay()}

            <div>
                <div className="flex justify-between items-center mb-2.5 sm:mb-3 gap-2">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border shrink-0 ${diffClass}`}>
                        {quest.difficulty || 'medium'}
                    </span>
                    <div className="text-amber-400 font-bold text-xs flex items-center gap-1 shrink-0">
                        <span>+{(quest.exp || quest.exp_reward || 0).toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">EXP</span>
                    </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2 leading-snug break-words">
                    {quest.title}
                </h3>
                
                <p className="text-xs text-slate-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {quest.description}
                </p>

                {/* Rejection notice */}
                {submissionStatus === 'rejected' && (
                    <div className="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold mb-1">
                            <XCircleIcon className="w-3.5 h-3.5 shrink-0" />
                            Ditolak
                        </div>
                        {rejectionReason && (
                            <p className="text-rose-300/80 text-[11px] leading-relaxed break-words">{rejectionReason}</p>
                        )}
                        <p className="text-slate-400 text-[10px] mt-1">Kamu bisa submit ulang bukti yang baru.</p>
                    </div>
                )}
            </div>

            {/* Proof submission form */}
            {showProofForm && (
                <form onSubmit={handleSubmitProof} className="mb-3 space-y-2">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
                        Bukti Pengerjaan
                    </label>
                    <textarea
                        value={proofText}
                        onChange={(e) => setProofText(e.target.value)}
                        placeholder="Jelaskan apa yang kamu kerjakan, atau tempel link tugas / screenshot..."
                        className="w-full bg-[#0d0f15] border border-[#272b38] rounded-lg p-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-200"
                        rows={3}
                        maxLength={1000}
                        required
                        autoFocus
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-500">{proofText.length}/1000</span>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={() => { setShowProofForm(false); setProofText(''); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !proofText.trim()}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shadow-sm cursor-pointer"
                            >
                                <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                {submitting ? 'Mengirim...' : 'Kirim Bukti'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
                    {quest.category || 'General'}
                </span>
                
                {/* Show "Kerjakan" button only if no pending/approved submission */}
                {!isCompleted && submissionStatus !== 'pending' && submissionStatus !== 'approved' && !showProofForm && (
                    <button 
                        onClick={() => setShowProofForm(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 sm:py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm active:scale-95 cursor-pointer shrink-0"
                    >
                        <PlayIcon className="w-3.5 h-3.5" />
                        {submissionStatus === 'rejected' ? 'Submit Ulang' : 'Kerjakan'}
                    </button>
                )}
            </div>
        </div>
    );
}
