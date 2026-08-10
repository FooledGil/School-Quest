import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ListBulletIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';

export default function StudentLayout({ user: propUser, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, flash } = usePage().props;
    
    // Use user from Inertia auth share if available, fallback to prop
    const rawUser = auth?.user || propUser || {};
    const user = {
        ...rawUser,
        avatar: rawUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(rawUser.avatar_seed || rawUser.name || 'Student')}`,
        rank_name: rawUser.rank_name || 'Novice',
        next_level_exp: rawUser.next_level_exp || (Math.pow(rawUser.level || 1, 2) * 100)
    };

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: pathname === '/dashboard' },
        { name: 'Quests', href: '/quests', icon: ListBulletIcon, active: pathname === '/quests' },
        { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon, active: pathname === '/leaderboard' },
        { name: 'Profile', href: '/profile', icon: UserIcon, active: pathname === '/profile' },
    ];

    return (
        <div className="flex h-screen bg-bg-primary overflow-hidden text-gray-300 font-body">
            {/* Sidebar */}
            <Sidebar links={links} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} role="student" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-0 overflow-y-auto w-full">
                <Navbar user={user} onMenuToggle={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Flash Messages */}
            {flash?.success && <Toast type="success" message={flash.success} />}
            {flash?.error && <Toast type="error" message={flash.error} />}
            {flash?.level_up && <Toast type="levelup" message={`Level Up! Selamat kamu naik ke Level ${flash.new_level || user.level}`} />}
        </div>
    );
}
