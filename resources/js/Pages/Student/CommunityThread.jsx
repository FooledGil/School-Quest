import React, { useState, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import CategoryBadge from '@/Components/Community/CategoryBadge';
import ReplyCard from '@/Components/Community/ReplyCard';
import ReportModal from '@/Components/Community/ReportModal';
import LevelBadge from '@/Components/LevelBadge';
import { getAvatarUrl } from '@/Utils/avatar';
import { timeAgo, formatFullDate } from '@/Utils/date';
import { 
    ArrowLeftIcon, 
    HeartIcon, 
    EyeIcon, 
    ChatBubbleOvalLeftEllipsisIcon,
    TrashIcon, 
    ShareIcon, 
    PaperAirplaneIcon,
    LockClosedIcon,
    CheckIcon,
    FlagIcon,
    NoSymbolIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function CommunityThread({ 
    thread, 
    replies = [], 
    isMuted = false, 
    muteRemaining = null 
}) {
    const pageRef = useRef(null);
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};
    
    const [replyBody, setReplyBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Report modal state
    const [reportModalData, setReportModalData] = useState({ isOpen: false, type: 'thread', id: null, title: '' });

    const handleOpenReport = (target) => {
        setReportModalData({
            isOpen: true,
            type: target.type,
            id: target.id,
            title: target.title,
        });
    };

    const author = thread.user || {};
    const authorAvatar = getAvatarUrl(author);
    const isLiked = !!thread.is_liked;
    const likesCount = thread.likes_count ?? 0;
    const isAuthor = currentUser?.id === thread.user_id;
    const isAdmin = currentUser?.role === 'admin';

    useGSAP(() => {
        if (pageRef.current) {
            gsap.fromTo(
                '.anim-thread-card',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );

            gsap.fromTo(
                '.anim-reply-section',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.15, ease: 'power2.out' }
            );
        }
    }, { scope: pageRef });

    const handleLike = () => {
        router.post('/community/like', {
            type: 'thread',
            id: thread.id,
        }, {
            preserveScroll: true,
        });
    };

    const handleDeleteThread = () => {
        if (confirm('Apakah kamu yakin ingin menghapus topik ini? Semua balasan di dalamnya juga akan terhapus.')) {
            router.delete(`/community/${thread.id}`);
        }
    };

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (!replyBody.trim() || replyBody.trim().length < 2) {
            setErrorMsg('Balasan minimal 2 karakter.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        router.post(`/community/${thread.id}/reply`, {
            body: replyBody,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyBody('');
                setIsSubmitting(false);
            },
            onError: (err) => {
                setIsSubmitting(false);
                setErrorMsg(err.body || 'Gagal mengirim balasan.');
            }
        });
    };

    return (
        <StudentLayout>
            <Head title={`${thread.title} — The Realm`} />

            <div ref={pageRef} className="space-y-6 max-w-4xl mx-auto">
                {/* Top Navigation & Breadcrumbs */}
                <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 font-bold text-slate-400 hover:text-white transition-colors bg-slate-900/60 border border-slate-800 px-3.5 py-2 rounded-xl hover:border-slate-700"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Kembali ke The Realm</span>
                    </Link>

                    <CategoryBadge category={thread.category} size="sm" />
                </div>

                {/* Main Thread Card */}
                <div className="anim-thread-card glass-card p-5 sm:p-7 md:p-8 border-2 border-slate-800/90 bg-slate-900/80 shadow-2xl relative space-y-5">
                    {/* Header: Author + Timestamp + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                        {/* Author Profile */}
                        <div className="flex items-center gap-3 min-w-0">
                            <img 
                                src={authorAvatar} 
                                alt={author.name || 'Author'} 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950 border-2 border-slate-700 object-cover shrink-0 shadow-md" 
                            />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[180px] sm:max-w-[300px]">
                                        {author.name}
                                    </h3>
                                    <LevelBadge level={author.level || 1} size="xs" />
                                    {author.role === 'admin' && (
                                        <span className="font-mono text-[8px] sm:text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                                            ADMIN
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-400">
                                    {author.class ? `Kelas ${author.class}` : (author.rank_name || 'Petualang')} • <span title={formatFullDate(thread.created_at)} className="text-slate-500">{timeAgo(thread.created_at)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Top Right Badges & Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {thread.is_pinned && (
                                <span className="inline-flex items-center gap-1 font-game text-[8px] sm:text-[9px] text-amber-400 bg-amber-500/15 border border-amber-500/40 px-2 py-1 rounded tracking-wider">
                                    <span>📌 PINNED</span>
                                </span>
                            )}
                            {thread.is_locked && (
                                <span className="inline-flex items-center gap-1 font-mono text-xs text-rose-400 bg-rose-500/15 border border-rose-500/40 px-2 py-1 rounded">
                                    <LockClosedIcon className="w-3.5 h-3.5" />
                                    <span>Terkunci</span>
                                </span>
                            )}

                            {/* Report Button */}
                            {!isAuthor && (
                                <button
                                    type="button"
                                    onClick={() => handleOpenReport({ type: 'thread', id: thread.id, title: thread.title })}
                                    title="Laporkan Topik Ini"
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                    <FlagIcon className="w-5 h-5" />
                                </button>
                            )}

                            {(isAuthor || isAdmin) && (
                                <button
                                    type="button"
                                    onClick={handleDeleteThread}
                                    title="Hapus Topik"
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Thread Title */}
                    <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
                        {thread.title}
                    </h1>

                    {/* Thread Body */}
                    <div className="text-sm sm:text-base text-slate-200 leading-relaxed sm:leading-loose whitespace-pre-line break-words space-y-3 font-body">
                        {thread.body}
                    </div>

                    {/* Thread Stats & Action Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-slate-800/80">
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            {/* Like Button */}
                            <button
                                type="button"
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95 cursor-pointer ${
                                    isLiked 
                                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-xs' 
                                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-rose-400 hover:border-slate-700'
                                }`}
                            >
                                {isLiked ? (
                                    <HeartSolidIcon className="w-4 h-4 text-rose-500 animate-pulse" />
                                ) : (
                                    <HeartIcon className="w-4 h-4" />
                                )}
                                <span className="font-mono">{likesCount} Suka</span>
                            </button>

                            {/* Views Count */}
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <EyeIcon className="w-4 h-4 text-slate-500" />
                                <span className="font-mono">{thread.views_count || 0} dilihat</span>
                            </div>
                        </div>

                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer self-end sm:self-auto"
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">Tautan Disalin!</span>
                                </>
                            ) : (
                                <>
                                    <ShareIcon className="w-4 h-4" />
                                    <span>Bagikan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Reply Section */}
                <div id="replies" className="anim-reply-section space-y-5">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-game text-xs sm:text-sm text-white flex items-center gap-2 tracking-wider">
                            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-blue-400" />
                            <span>DISKUSI & BALASAN ({thread.replies_count || replies.length})</span>
                        </h2>
                    </div>

                    {/* Mute banner if student is muted */}
                    {isMuted ? (
                        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 flex items-start gap-3.5 text-xs sm:text-sm shadow-md">
                            <NoSymbolIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-400 font-game text-[10px] sm:text-xs mb-1">
                                    AKUN ANDA SEDANG DISENYAPKAN (MUTE)
                                </p>
                                <p className="text-slate-300 text-xs leading-relaxed font-body">
                                    Anda tidak dapat mengirim balasan komentar {muteRemaining ? `(berlaku hingga ${muteRemaining})` : ''} karena sanksi moderasi tata tertib.
                                </p>
                            </div>
                        </div>
                    ) : !thread.is_locked ? (
                        /* Top-Level Reply Input Form */
                        <div className="glass-card p-4 sm:p-5 border-2 border-slate-800/80 bg-slate-900/70">
                            <form onSubmit={handleReplySubmit} className="space-y-3">
                                <div className="flex items-center gap-2.5">
                                    <img 
                                        src={getAvatarUrl(currentUser)} 
                                        alt={currentUser?.name || 'User'} 
                                        className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-700 object-cover"
                                    />
                                    <span className="text-xs font-bold text-white">
                                        Tulis balasan sebagai <span className="text-blue-400">{currentUser?.name}</span>
                                    </span>
                                </div>

                                <textarea
                                    value={replyBody}
                                    onChange={(e) => setReplyBody(e.target.value)}
                                    placeholder="Tulis tanggapan, pandangan, atau solusi untuk rekan petualang..."
                                    rows={3}
                                    maxLength={5000}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-body resize-y"
                                />

                                {errorMsg && (
                                    <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] text-slate-500 font-mono">
                                        {replyBody.length}/5000 karakter
                                    </span>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !replyBody.trim()}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-game text-[10px] sm:text-[11px] text-slate-950 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-300 hover:to-blue-400 border border-blue-300/40 shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-wider"
                                    >
                                        <PaperAirplaneIcon className="w-3.5 h-3.5" />
                                        <span>{isSubmitting ? 'MENGIRIM...' : 'KIRIM BALASAN'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="glass-card p-4 text-center text-xs text-slate-400 border border-slate-800 bg-slate-900/40 flex items-center justify-center gap-2">
                            <LockClosedIcon className="w-4 h-4 text-rose-400" />
                            <span>Topik ini telah dikunci oleh administrator sehingga tidak dapat menerima balasan baru.</span>
                        </div>
                    )}

                    {/* Replies Stream */}
                    {replies && replies.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {replies.map((reply) => (
                                <ReplyCard
                                    key={reply.id}
                                    reply={reply}
                                    threadId={thread.id}
                                    isLocked={thread.is_locked}
                                    onReport={handleOpenReport}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center text-slate-400 text-xs sm:text-sm border border-slate-800 bg-slate-900/30 space-y-2">
                            <div className="text-3xl">💬</div>
                            <p className="font-semibold text-white">Belum ada balasan</p>
                            <p className="text-slate-500 text-xs">Jadilah yang pertama memberikan tanggapan pada topik ini!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Content Modal */}
            <ReportModal
                isOpen={reportModalData.isOpen}
                onClose={() => setReportModalData(prev => ({ ...prev, isOpen: false }))}
                targetType={reportModalData.type}
                targetId={reportModalData.id}
                targetTitle={reportModalData.title}
            />
        </StudentLayout>
    );
}
