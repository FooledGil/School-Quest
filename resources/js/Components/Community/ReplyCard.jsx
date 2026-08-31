import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import LevelBadge from '@/Components/LevelBadge';
import { getAvatarUrl } from '@/Utils/avatar';
import { timeAgo } from '@/Utils/date';
import { 
    HeartIcon, 
    ArrowUturnLeftIcon, 
    TrashIcon, 
    PaperAirplaneIcon, 
    XMarkIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ReplyCard({ reply, threadId, isLocked = false, isNested = false, onReplySuccess, onReport }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user || {};
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const user = reply.user || {};
    const avatar = getAvatarUrl(user);
    const isLiked = !!reply.is_liked;
    const likesCount = reply.likes_count ?? 0;
    const isAuthor = currentUser?.id === reply.user_id;
    const isAdmin = currentUser?.role === 'admin';

    const handleLike = (e) => {
        e.preventDefault();
        router.post('/community/like', {
            type: 'reply',
            id: reply.id,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm('Apakah kamu yakin ingin menghapus balasan ini?')) {
            router.delete(`/community/reply/${reply.id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleReportClick = (e) => {
        e.preventDefault();
        if (onReport) {
            onReport({
                type: 'reply',
                id: reply.id,
                title: reply.body?.substring(0, 80) + '...',
            });
        }
    };

    const handleNestedSubmit = (e) => {
        e.preventDefault();
        if (!replyText.trim() || replyText.trim().length < 2) {
            setErrorMsg('Balasan minimal 2 karakter.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        router.post(`/community/${threadId}/reply`, {
            body: replyText,
            parent_id: reply.id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReplyText('');
                setShowReplyForm(false);
                setIsSubmitting(false);
                if (onReplySuccess) onReplySuccess();
            },
            onError: (err) => {
                setIsSubmitting(false);
                setErrorMsg(err.body || 'Gagal mengirim balasan.');
            }
        });
    };

    return (
        <div className={`transition-all duration-200 ${
            isNested 
                ? 'ml-2.5 sm:ml-6 pl-2.5 sm:pl-4 border-l-2 border-slate-700/60 mt-2.5' 
                : 'glass-card p-4 sm:p-5 border-2 border-slate-800/80 mb-3 sm:mb-4 bg-slate-900/60'
        }`}>
            {/* Header: Author + Time + Actions */}
            <div className="flex items-center justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                        src={avatar} 
                        alt={user.name || 'Petualang'} 
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-950 border border-slate-700 object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[130px] sm:max-w-[200px]">
                                {user.name}
                            </span>
                            <LevelBadge level={user.level || 1} size="xs" />
                            {user.role === 'admin' && (
                                <span className="font-mono text-[8px] sm:text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                                    ADMIN
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                            {user.class ? `Kelas ${user.class}` : (user.rank_name || 'Petualang')} • <span className="text-slate-500">{timeAgo(reply.created_at)}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Report button */}
                    {!isAuthor && onReport && (
                        <button
                            type="button"
                            onClick={handleReportClick}
                            title="Laporkan Balasan Ini"
                            className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        >
                            <FlagIcon className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {/* Delete button (only author or admin) */}
                    {(isAuthor || isAdmin) && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            title="Hapus Balasan"
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                        >
                            <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Reply Content */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line break-words pl-0.5 sm:pl-1 font-body">
                {reply.body}
            </div>

            {/* Reply Actions: Like & Reply Toggle */}
            <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-800/60 pl-0.5 sm:pl-1 text-xs">
                {/* Like Button */}
                <button
                    type="button"
                    onClick={handleLike}
                    className={`flex items-center gap-1 font-semibold transition-all active:scale-90 cursor-pointer ${
                        isLiked ? 'text-rose-400 hover:text-rose-300' : 'text-slate-400 hover:text-rose-400'
                    }`}
                >
                    {isLiked ? (
                        <HeartSolidIcon className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                        <HeartIcon className="w-3.5 h-3.5" />
                    )}
                    <span className="font-mono text-[11px]">{likesCount}</span>
                </button>

                {/* Nested Reply Toggle (Only for top-level replies, not nested) */}
                {!isNested && !isLocked && (
                    <button
                        type="button"
                        onClick={() => setShowReplyForm(prev => !prev)}
                        className="flex items-center gap-1 font-semibold text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                        <ArrowUturnLeftIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[11px]">Balas</span>
                    </button>
                )}
            </div>

            {/* Nested Reply Form */}
            {showReplyForm && (
                <form onSubmit={handleNestedSubmit} className="mt-3 pt-3 border-t border-slate-800 pl-1 sm:pl-2 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Balas kepada <strong className="text-blue-400">{user.name}</strong>:</span>
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="text-slate-500 hover:text-white"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Tulis balasan untuk ${user.name}...`}
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none font-body"
                    />

                    {errorMsg && (
                        <p className="text-[11px] text-rose-400 font-semibold">{errorMsg}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowReplyForm(false)}
                            className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !replyText.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <PaperAirplaneIcon className="w-3 h-3" />
                            <span>{isSubmitting ? 'Mengirim...' : 'Kirim'}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Nested Child Replies */}
            {reply.replies && reply.replies.length > 0 && (
                <div className="space-y-2 mt-2">
                    {reply.replies.map((childReply) => (
                        <ReplyCard
                            key={childReply.id}
                            reply={childReply}
                            threadId={threadId}
                            isLocked={isLocked}
                            isNested={true}
                            onReport={onReport}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
