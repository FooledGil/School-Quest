import React, { useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import PodiumDisplay from '@/Components/PodiumDisplay';
import LevelBadge from '@/Components/LevelBadge';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { getAvatarUrl } from '@/Utils/avatar';

export default function Leaderboard({ students = [] }) {
    const tableBodyRef = useRef(null);
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    const normalizedStudents = students.map((s, idx) => ({
        id: s.id,
        name: s.name,
        class: s.class || 'Siswa',
        level: s.level || 1,
        exp: s.exp || 0,
        avatar: getAvatarUrl(s),
        rank_number: idx + 1
    }));

    useGSAP(() => {
        if (tableBodyRef.current && normalizedStudents.length > 0) {
            const rows = tableBodyRef.current.querySelectorAll('tr');
            gsap.fromTo(
                rows,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, { dependencies: [students], scope: tableBodyRef });

    return (
        <StudentLayout>
            <Head title="Leaderboard" />

            <div className="mb-5 sm:mb-6 text-center">
                <h1 className="font-game text-base sm:text-lg md:text-2xl text-white mb-1.5 tracking-wider drop-shadow-md flex items-center justify-center gap-2">
                    <span>👑</span>
                    <span>PAPAN PERINGKAT</span>
                </h1>
                <p className="font-mono text-blue-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
                    ▶ HALL OF FAME — TOP GUILD HEROES ◀
                </p>
            </div>

            {normalizedStudents.length >= 3 && (
                <PodiumDisplay topThree={normalizedStudents.slice(0, 3)} />
            )}

            <div className="glass-card overflow-hidden mt-6 shadow-xl border-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[480px]">
                        <thead>
                            <tr className="bg-slate-950 border-b-2 border-slate-800 font-game text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
                                <th className="p-3 sm:p-4 text-center w-14 sm:w-16">RANK</th>
                                <th className="p-3 sm:p-4">HERO / MURID</th>
                                <th className="p-3 sm:p-4 text-center">KELAS</th>
                                <th className="p-3 sm:p-4 text-center">LEVEL</th>
                                <th className="p-3 sm:p-4 text-right">TOTAL EXP</th>
                            </tr>
                        </thead>
                        <tbody ref={tableBodyRef}>
                            {normalizedStudents.map((student, index) => {
                                const isCurrentUser = student.id === currentUserId;
                                
                                return (
                                    <tr 
                                        key={student.id} 
                                        className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/40 
                                            ${isCurrentUser ? 'bg-blue-600/10 border-l-4 border-l-blue-500 font-semibold' : ''}
                                        `}
                                    >
                                        <td className="p-3 sm:p-4 text-center">
                                            <span className={`font-bold text-xs sm:text-sm ${index < 3 ? 'text-amber-400' : 'text-slate-500'}`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="flex items-center gap-2.5 sm:gap-3">
                                                <img src={student.avatar} alt={student.name} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 object-cover border border-slate-700 shrink-0" />
                                                <div className="min-w-0">
                                                    <div className={`text-xs sm:text-sm font-bold truncate ${isCurrentUser ? 'text-blue-400' : 'text-white'}`}>
                                                        {student.name} {isCurrentUser && '(Kamu)'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4 text-center text-xs text-slate-400">{student.class}</td>
                                        <td className="p-3 sm:p-4 text-center">
                                            <LevelBadge level={student.level} size="sm" />
                                        </td>
                                        <td className="p-3 sm:p-4 text-right">
                                            <div className="font-bold text-xs sm:text-sm text-amber-400">
                                                {(student.exp || 0).toLocaleString()} <span className="text-[9px] sm:text-[10px] text-slate-500 font-normal">EXP</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
