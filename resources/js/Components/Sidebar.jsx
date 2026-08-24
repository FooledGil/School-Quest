import React from 'react';
import { Link } from '@inertiajs/react';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import ApiIcon from '@/Components/ApiIcon';
import { ICON_API } from '@/Utils/iconApi';

export default function Sidebar({ links, isOpen, setIsOpen, user, role }) {
    const handleLinkClick = () => {
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <>
            {/* Mobile overlay with fade transition */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-[#111827] border-r border-gray-800 transition-transform duration-200 ease-in-out flex flex-col shadow-2xl md:shadow-none
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                    md:relative md:translate-x-0 md:z-20
                `}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800 bg-[#0b0f19] shrink-0">
                    <div className="flex items-center gap-2.5">
                        <img src="/images/logo.png" alt="SchoolQuest Logo" className="w-8 h-8 drop-shadow-md object-contain" />
                        <span className="font-game text-sm text-gradient tracking-wider">SchoolQuest</span>
                    </div>
                    <button 
                        type="button"
                        aria-label="Tutup Menu"
                        className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer" 
                        onClick={() => setIsOpen(false)}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* User Info (Mobile / Drawer Only) */}
                <div className="md:hidden p-4 border-b border-gray-800/80 bg-slate-900/40 flex items-center gap-3 shrink-0">
                    <img src={user.avatar} alt="Avatar" className="w-11 h-11 rounded-lg bg-gray-800 border border-gray-700 object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-white truncate">{user.name}</p>
                        <p className="text-xs text-blue-400 font-medium truncate">
                            {role === 'student' ? `Lvl ${user.level || 1} • ${user.rank_name || 'Novice'}` : 'Administrator'}
                        </p>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = link.active;
                        
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={`flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-lg text-sm font-medium transition-colors group
                                    ${isActive 
                                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-bold' 
                                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className="truncate">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Guide Button for Students */}
                {role === 'student' && (
                    <div className="px-3 pb-2">
                        <button
                            type="button"
                            onClick={() => {
                                handleLinkClick();
                                window.dispatchEvent(new CustomEvent('open-onboarding-tour'));
                            }}
                            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer group"
                        >
                            <ApiIcon icon={ICON_API.guide} className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="truncate">Panduan Petualangan</span>
                        </button>
                    </div>
                )}

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800 shrink-0 bg-[#0b0f19]">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 w-full px-3.5 py-3 md:py-2 text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0" />
                        <span>Keluar (Logout)</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
