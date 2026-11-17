import React, { useState } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ClipboardDocumentListIcon, UsersIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import { usePage } from '@inertiajs/react';

import { getAvatarUrl } from '@/Utils/avatar';

export default function AdminLayout({ user: propUser, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, flash } = usePage().props;

    const rawUser = auth?.user || propUser || {};
    const user = {
        ...rawUser,
        avatar: getAvatarUrl(rawUser),
    };

    const isIndexPhp = typeof window !== 'undefined' && window.location.pathname.includes('/index.php');
    const prefix = isIndexPhp ? '/index.php' : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/admin/dashboard';

    const links = [
        { name: 'Dashboard', href: `${prefix}/admin/dashboard`, icon: HomeIcon, active: pathname === `${prefix}/admin/dashboard` || pathname === '/admin/dashboard' },
        { name: 'Manage Quests', href: `${prefix}/admin/quests`, icon: ClipboardDocumentListIcon, active: pathname.startsWith(`${prefix}/admin/quests`) || pathname.startsWith('/admin/quests') },
        { name: 'Validasi Quest', href: `${prefix}/admin/validations`, icon: ShieldCheckIcon, active: pathname.startsWith(`${prefix}/admin/validations`) || pathname.startsWith('/admin/validations') },
        { name: 'The Realm', href: `${prefix}/admin/community`, icon: ChatBubbleLeftRightIcon, active: pathname.startsWith(`${prefix}/admin/community`) || pathname.startsWith('/admin/community'), badge: auth?.pending_reports_count > 0 ? auth.pending_reports_count : null },
        { name: 'Student Progress', href: `${prefix}/admin/students`, icon: UsersIcon, active: pathname.startsWith(`${prefix}/admin/students`) || pathname.startsWith('/admin/students') },
    ];

    return (
        <div className="flex h-screen h-dvh bg-bg-secondary overflow-hidden text-gray-300 font-body">
            <Sidebar links={links} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} role="admin" />

            <div className="flex-1 flex flex-col min-w-0 relative z-0 overflow-hidden w-full">
                <Navbar user={user} onMenuToggle={() => setSidebarOpen(prev => !prev)} isAdmin />

                <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 bg-[#0d121c]">
                    <div className="max-w-7xl mx-auto w-full animate-slide-up">
                        {children}
                    </div>
                </main>
            </div>

            {flash?.success && <Toast type="success" message={flash.success} />}
            {flash?.error && <Toast type="error" message={flash.error} />}
        </div>
    );
}
