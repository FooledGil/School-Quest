import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import { HomeIcon, ListBulletIcon, TrophyIcon, UserIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Toast from '@/Components/Toast';
import OnboardingModal from '@/Components/OnboardingModal';
import LevelUpModal from '@/Components/LevelUpModal';
import SanctionAlertModal from '@/Components/SanctionAlertModal';
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
        next_level_exp: rawUser.next_level_exp || 150,
        current_level_base_exp: rawUser.current_level_base_exp || 0,
        exp_in_level: rawUser.exp_in_level || (rawUser.exp || 0),
        exp_needed_in_level: rawUser.exp_needed_in_level || 150,
        exp_percentage: rawUser.exp_percentage || 0,
        exp_remaining: rawUser.exp_remaining || 150,
    };

    // Unacknowledged sanctions from admin
    const unacknowledgedSanctions = auth?.unacknowledged_sanctions || [];

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

    // Level Up Modal Detection
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const [levelUpData, setLevelUpData] = useState({ level: user.level || 1, rankName: user.rank_name || 'Novice' });
    const prevLevelRef = useRef(user.level || 1);

    // 1. Check flash message from backend
    useEffect(() => {
        if (flash?.level_up) {
            setLevelUpData({
                level: flash.new_level || user.level,
                rankName: user.rank_name || 'Novice'
            });
            setShowLevelUpModal(true);
        }
    }, [flash?.level_up, flash?.new_level]);

    // 2. Check client-side level progression changes
    useEffect(() => {
        if (user.id && user.level) {
            const storageKey = `sq_last_level_${user.id}`;
            const lastKnownLevel = parseInt(localStorage.getItem(storageKey), 10);

            if (!isNaN(lastKnownLevel) && user.level > lastKnownLevel) {
                setLevelUpData({
                    level: user.level,
                    rankName: user.rank_name || 'Novice'
                });
                setShowLevelUpModal(true);
            }

            localStorage.setItem(storageKey, user.level.toString());
            prevLevelRef.current = user.level;
        }
    }, [user.level, user.id, user.rank_name]);

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, active: pathname === '/dashboard' },
        { name: 'Quests', href: '/quests', icon: ListBulletIcon, active: pathname === '/quests' },
        { name: 'Leaderboard', href: '/leaderboard', icon: TrophyIcon, active: pathname === '/leaderboard' },
        { name: 'The Realm', href: '/community', icon: ChatBubbleLeftRightIcon, active: pathname.startsWith('/community') },
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

            {/* Epic Level Up Celebration Modal */}
            <LevelUpModal
                show={showLevelUpModal}
                newLevel={levelUpData.level}
                rankName={levelUpData.rankName}
                onClose={() => setShowLevelUpModal(false)}
            />

            {/* Official Sanction Alert Modal */}
            <SanctionAlertModal 
                sanctions={unacknowledgedSanctions} 
            />

            {/* Flash Messages */}
            {flash?.success && <Toast type="success" message={flash.success} />}
            {flash?.error && <Toast type="error" message={flash.error} />}
            {flash?.level_up && <Toast type="levelup" message={`Level Up! Selamat kamu naik ke Level ${flash.new_level || user.level}`} />}
        </div>
    );
}
