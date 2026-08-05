import React from 'react';
import { Link } from '@inertiajs/react';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Sidebar({ links, isOpen, setIsOpen, user, role }) {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-30 w-64 glass-card rounded-none border-t-0 border-b-0 border-l-0 border-r-gray-800 transition-transform duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:relative md:translate-x-0
                `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800/50 bg-black/20">
                    <span className="font-game text-sm text-gradient">SchoolQuest</span>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info (Mobile Only) */}
                <div className="md:hidden p-4 border-b border-gray-800/50 flex items-center gap-3">
                    <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded bg-gray-800" />
                    <div>
                        <p className="font-bold text-sm text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{role === 'student' ? `Lvl ${user.level} ${user.rank_name}` : 'Administrator'}</p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.active;
                        
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                                    ${isActive 
                                        ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 shadow-[inset_4px_0_0_0_#06b6d4]' 
                                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-accent-cyan' : 'text-gray-400 group-hover:text-white'}`} />
                                {link.name}
                                
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800/50">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-400 hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        Logout
                    </Link>
                </div>
            </aside>
        </>
    );
}
