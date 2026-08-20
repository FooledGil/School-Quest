import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import LevelBadge from './LevelBadge';
import ExpBar from './ExpBar';

export default function Navbar({ user, onMenuToggle, isAdmin = false }) {
    return (
        <header className="h-16 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-3.5 sm:px-5 sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
                <button 
                    type="button"
                    aria-label="Buka Menu Navigasi"
                    onClick={onMenuToggle}
                    className="p-2 md:hidden text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                
                <div className="hidden sm:block text-xs sm:text-sm font-semibold text-slate-400 truncate max-w-[200px] lg:max-w-none">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                {/* User Profile & EXP */}
                <div className="flex items-center gap-3">
                    {!isAdmin && (
                        <div className="hidden md:flex flex-col items-end mr-1 w-28 lg:w-36">
                            <span className="text-[11px] font-bold text-amber-400 mb-0.5 truncate max-w-full">{user.rank_name || 'Novice'}</span>
                            <ExpBar currentExp={user.exp || 0} requiredExp={user.next_level_exp || 100} className="w-full" />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2.5">
                        <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-xs font-bold text-white truncate max-w-[120px]">{user.name}</span>
                            <span className="text-[10px] text-slate-400">{isAdmin ? 'Administrator' : `Level ${user.level || 1}`}</span>
                        </div>

                        <div className="relative group shrink-0">
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-800 border-2 ${isAdmin ? 'border-indigo-500/60' : 'border-blue-500/60'} object-cover`} 
                            />
                            {!isAdmin && (
                                <div className="absolute -bottom-2 -right-2 transform scale-75 origin-bottom-right">
                                    <LevelBadge level={user.level || 1} size="sm" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
