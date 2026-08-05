import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ClipboardDocumentListIcon, UsersIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage().props;

    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, active: route().current('admin.dashboard') },
        { name: 'Manage Quests', href: '/admin/quests', icon: ClipboardDocumentListIcon, active: route().current('admin.quests.*') },
        { name: 'Student Progress', href: '/admin/students', icon: UsersIcon, active: route().current('admin.students.*') },
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

function route() {
    return { current: () => false };
}
