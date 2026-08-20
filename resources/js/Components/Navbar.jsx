import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import LevelBadge from './LevelBadge';
import ExpBar from './ExpBar';

export default function Navbar({ user, onMenuToggle, isAdmin = false }) {
    return (
        <header className="h-16 bg-[#111827] border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuToggle}
                    className="p-2 md:hidden text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
                
                <div className="hidden sm:block text-sm font-bold text-gray-400">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {/* User Profile */}
                <div className="flex items-center gap-3">
                    {!isAdmin && (
                        <div className="hidden md:flex flex-col items-end mr-2 w-32">
                            <span className="text-xs font-bold text-accent-gold mb-1">{user.rank_name}</span>
                            <ExpBar currentExp={user.exp} requiredExp={user.next_level_exp} className="w-full" />
                        </div>
                    )}
                    
                    <div className="relative group cursor-pointer">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className={`w-10 h-10 rounded-lg bg-gray-800 border-2 ${isAdmin ? 'border-accent-purple' : 'border-accent-cyan'} object-cover`} 
                        />
                        {!isAdmin && (
                            <div className="absolute -bottom-2 -right-2 transform scale-50 origin-bottom-right">
                                <LevelBadge level={user.level} size="sm" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
