import React, { useState, useEffect } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ListBulletIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import OnboardingModal from '@/Components/OnboardingModal';
import { getAvatarUrl } from '@/Utils/avatar';
import { usePage } from '@inertiajs/react';

export default function StudentLayout({ user: propUser, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth, flash } = usePage().props;
    
    // Use user from Inertia auth share if available, fallback to prop
    const rawUser = auth?.user || propUser || {};
    const user = {
        ...rawUser,
        avatar: getAvatarUrl(rawUser),
        rank_name: rawUser.rank_name || 'Novice',
        next_level_exp: rawUser.next_level_exp || (Math.pow(rawUser.level || 1, 2) * 100)
    };

    // Onboarding guide state: auto-open if student hasn't completed onboarding
    const shouldShowInitialOnboarding = rawUser.role === 'student' && rawUser.nisn && !rawUser.has_completed_onboarding;
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (shouldShowInitialOnboarding) {
            setShowOnboarding(true);
        }
    }, [shouldShowInitialOnboarding]);

    // Listen for manual onboarding trigger event from any page/component
    useEffect(() => {
        const handleOpenTour = () => setShowOnboarding(true);
        window.addEventListener('open-onboarding-tour', handleOpenTour);
        return () => window.removeEventListener('open-onboarding-tour', handleOpenTour);
    }, []);

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: pathname === '/dashboard' },
        { name: 'Quests', href: '/quests', icon: ListBulletIcon, active: pathname === '/quests' },
        { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon, active: pathname === '/leaderboard' },
        { name: 'Profile', href: '/profile', icon: UserIcon, active: pathname === '/profile' },
    ];

    return (
        <div className="flex h-screen h-dvh bg-bg-primary overflow-hidden text-gray-300 font-body">
            {/* Sidebar */}
            <Sidebar links={links} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} role="student" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative z-0 overflow-hidden w-full">
                <Navbar user={user} onMenuToggle={() => setSidebarOpen(prev => !prev)} />

                <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            {/* Onboarding Guide Modal for First-time Login */}
            <OnboardingModal 
                isOpen={showOnboarding} 
                onClose={() => setShowOnboarding(false)} 
            />

            {/* Flash Messages */}
            {flash?.success && <Toast type="success" message={flash.success} />}
            {flash?.error && <Toast type="error" message={flash.error} />}
            {flash?.level_up && <Toast type="levelup" message={`Level Up! Selamat kamu naik ke Level ${flash.new_level || user.level}`} />}
        </div>
    );
}
