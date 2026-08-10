import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ClipboardDocumentListIcon, UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({ user: propUser, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, flash } = usePage().props;

    const rawUser = auth?.user || propUser || {};
    const user = {
        ...rawUser,
        avatar: rawUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(rawUser.avatar_seed || rawUser.name || 'Admin')}`,
    };

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/admin/dashboard';

    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, active: pathname === '/admin/dashboard' },
        { name: 'Manage Quests', href: '/admin/quests', icon: ClipboardDocumentListIcon, active: pathname.startsWith('/admin/quests') },
        { name: 'Validasi Quest', href: '/admin/validations', icon: ShieldCheckIcon, active: pathname.startsWith('/admin/validations') },
        { name: 'Student Progress', href: '/admin/students', icon: UsersIcon, active: pathname.startsWith('/admin/students') },
    ];

    return (
        <div className="flex h-screen bg-bg-secondary overflow-hidden text-gray-300 font-body">
            <Sidebar links={links} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} role="admin" />

            <div className="flex-1 flex flex-col relative z-0 overflow-y-auto w-full">
                <Navbar user={user} onMenuToggle={() => setSidebarOpen(true)} isAdmin />

                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0d121c]">
                    <div className="max-w-7xl mx-auto animate-slide-up">
                        {children}
                    </div>
                </main>
            </div>

            {flash?.success && <Toast type="success" message={flash.success} />}
            {flash?.error && <Toast type="error" message={flash.error} />}
        </div>
    );
}
