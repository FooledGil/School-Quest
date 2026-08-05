import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ListBulletIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';

export default function StudentLayout({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    const links = [
        { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon, active: route().current('student.dashboard') },
        { name: 'Quests', href: '/student/quests', icon: ListBulletIcon, active: route().current('student.quests.*') },
        { name: 'Leaderboard', href: '/student/leaderboard', icon: TrophyIcon, active: route().current('student.leaderboard') },
        { name: 'Profile', href: '/student/profile', icon: UserIcon, active: route().current('student.profile') },
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
            {flash?.levelup && <Toast type="levelup" message={flash.levelup} />}
        </div>
    );
}

function route() {
    // Mock route helper for frontend demonstration purposes
    return {
        current: () => false
    };
}
