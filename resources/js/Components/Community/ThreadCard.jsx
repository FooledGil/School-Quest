import React from 'react';
import { Link, router } from '@inertiajs/react';
import CategoryBadge from './CategoryBadge';
import LevelBadge from '@/Components/LevelBadge';
import { getAvatarUrl } from '@/Utils/avatar';
import { timeAgo } from '@/Utils/date';
import { 
    ChatBubbleOvalLeftEllipsisIcon, 
    EyeIcon, 
    HeartIcon,
    LockClosedIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

export default function ThreadCard({ thread, onReport }) {
    const user = thread.user || {};
    const avatar = getAvatarUrl(user);
    const isLiked = !!thread.is_liked;
    const likesCount = thread.likes_count ?? 0;
    const repliesCount = thread.all_replies_count ?? thread.replies_count ?? 0;

    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.post('/community/like', {
            type: 'thread',
            id: thread.id,
        }, {
            preserveScroll: true,
        });
    };

    const handleReportClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onReport) {
            onReport({
                type: 'thread',
                id: thread.id,
                title: thread.title,
            });
        }
    };

    return (
        <div className={`glass-card p-4 sm:p-5 md:p-6 transition-all duration-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 relative group border-2 ${
            thread.is_pinned 
                ? 'border-amber-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/70 to-amber-950/20' 
                : 'border-slate-800/80 bg-slate-900/70'
        }`}>
            {/* Top Row: Badges + Timestamp + Report */}
            <div className="flex items-center justify-between gap-2.5 mb-3.5 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {thread.is_pinned && (
                        <span className="inline-flex items-center gap-1 font-game text-[8px] sm:text-[9px] text-amber-400 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded shadow-xs tracking-wider">
                            <span>📌</span>
                            <span>PINNED</span>
                        </span>
                    )}

                    <CategoryBadge category={thread.category} size="xs" />

                    {thread.is_locked && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">
                            <LockClosedIcon className="w-3 h-3" />
                            <span>Terkunci</span>
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">
                        {timeAgo(thread.created_at)}
                    </span>
                    {onReport && (
                        <button
                            type="button"
                            onClick={handleReportClick}
                            title="Laporkan Topik Ini"
                            className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                        >
                            <FlagIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area (Clickable Link to Thread Detail) */}
            <Link href={`/community/${thread.id}`} className="block group-hover:no-underline mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2 leading-snug tracking-tight">
                    {thread.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed font-body">
                    {thread.body}
                </p>
            </Link>

            {/* Bottom Section: Author Info & Activity Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-800/80 mt-auto">
                {/* Author Info */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                        src={avatar} 
                        alt={user.name || 'Petualang'} 
                        className="w-8 h-8 sm:w-8 sm:h-8 rounded-lg bg-slate-950 border border-slate-700 object-cover shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-white truncate max-w-[130px] sm:max-w-[180px]">
                                {user.name}
                            </span>
                            <LevelBadge level={user.level || 1} size="xs" />
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                            {user.class ? `Kelas ${user.class}` : (user.rank_name || 'Petualang')}
                        </p>
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 text-xs font-semibold self-end sm:self-auto">
                    {/* Likes */}
                    <button
                        type="button"
                        onClick={handleLike}
                        title={isLiked ? 'Batal Suka' : 'Sukai Topik'}
                        className={`flex items-center gap-1.5 transition-all active:scale-90 cursor-pointer ${
                            isLiked ? 'text-rose-400 hover:text-rose-300' : 'text-slate-400 hover:text-rose-400'
                        }`}
                    >
                        {isLiked ? (
                            <HeartSolidIcon className="w-4 h-4 text-rose-500 animate-pulse" />
                        ) : (
                            <HeartIcon className="w-4 h-4" />
                        )}
                        <span className="text-[11px] font-mono">{likesCount}</span>
                    </button>

                    {/* Replies */}
                    <Link
                        href={`/community/${thread.id}#replies`}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                        title="Jumlah Balasan"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4 text-blue-400/80" />
                        <span className="text-[11px] font-mono">{repliesCount}</span>
                    </Link>

                    {/* Views */}
                    <div className="flex items-center gap-1 text-slate-400" title="Total Dilihat">
                        <EyeIcon className="w-4 h-4 text-slate-500" />
                        <span className="text-[11px] font-mono">{thread.views_count || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
