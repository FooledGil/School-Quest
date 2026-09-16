import React from 'react';

export const CATEGORIES = {
    umum: {
        id: 'umum',
        label: 'Umum',
        icon: '💬',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60',
        badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        description: 'Diskusi santai dan obrolan bebas seputar sekolah dan guild'
    },
    quest: {
        id: 'quest',
        label: 'Quest & Misi',
        icon: '⚔️',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        description: 'Tanya jawab tips, panduan, dan bantuan menyelesaikan quest'
    },
    showcase: {
        id: 'showcase',
        label: 'Showcase',
        icon: '🏆',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60',
        badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        description: 'Pamerkan pencapaian, level up, dan badge langka milikmu'
    },
    saran: {
        id: 'saran',
        label: 'Saran & Ide',
        icon: '💡',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60',
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        description: 'Ide fitur baru, quest kreatif, atau masukan untuk SchoolQuest'
    },
    bug: {
        id: 'bug',
        label: 'Laporan Bug',
        icon: '🐛',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60',
        badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        description: 'Laporkan kendala teknis atau error yang ditemukan'
    }
};

export default function CategoryBadge({ category, size = 'sm', showIcon = true, className = '' }) {
    const config = CATEGORIES[category] || CATEGORIES.umum;
    
    const sizeClasses = {
        xs: 'text-[9px] px-1.5 py-0.5',
        sm: 'text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1',
        md: 'text-xs sm:text-sm px-3 py-1.5',
    };

    return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-md border tracking-wide uppercase ${config.badgeColor} ${sizeClasses[size] || sizeClasses.sm} ${className}`}>
            {showIcon && <span>{config.icon}</span>}
            <span>{config.label}</span>
        </span>
    );
}
