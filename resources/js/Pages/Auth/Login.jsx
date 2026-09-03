import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import gsap from 'gsap';
import LoginForm from '@/Components/Login/LoginForm';
import FantasyPanel from '@/Components/Login/FantasyPanel';
import CastleIntroModal from '@/Components/Login/CastleIntroModal';

/**
 * Login Page with Post-Login Castle Intro Cinematic Animation
 */
export default function Login() {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const leftPanelRef = useRef(null);
    const rightPanelRef = useRef(null);
    const fantasyPanelRef = useRef(null);

    const [introState, setIntroState] = useState({
        active: false,
        rect: null,
        redirectUrl: '/dashboard',
    });

    // ─── Initial Page Entrance Animation ───
    useLayoutEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            gsap.set([cardRef.current, leftPanelRef.current, rightPanelRef.current], {
                opacity: 1,
                scale: 1,
                y: 0,
            });
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
            });

            // Main Card Entrance
            tl.fromTo(
                cardRef.current,
                { opacity: 0, scale: 0.94, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8 }
            )
            // Right Fantasy Panel Entrance
            .fromTo(
                rightPanelRef.current,
                { opacity: 0, scale: 1.08 },
                { opacity: 1, scale: 1, duration: 0.8 },
                '-=0.5'
            )
            // Left Content Stagger
            .fromTo(
                leftPanelRef.current?.children || [],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
                '-=0.6'
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // ─── Login Success Trigger ───
    const handleLoginSuccess = useCallback((redirectUrl) => {
        const destination = redirectUrl || '/dashboard';

        // Bypass animation if reduced motion preferred
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            router.visit(destination);
            return;
        }

        // Stop ambient floating animations on the card panel
        fantasyPanelRef.current?.stopAmbient?.();

        // Capture exact bounding box of the fantasy panel on screen
        const panelEl = rightPanelRef.current;
        const rect = panelEl ? panelEl.getBoundingClientRect() : null;

        // Smoothly dissolve the login card as the intro takes over
        if (cardRef.current) {
            gsap.to(cardRef.current, {
                opacity: 0,
                x: -30,
                duration: 0.4,
                ease: 'power2.in',
            });
        }

        // Activate fullscreen cinematic intro
        setIntroState({
            active: true,
            rect,
            redirectUrl: destination,
        });
    }, []);

    return (
        <main
            ref={containerRef}
            className="min-h-screen min-h-dvh w-full flex items-center justify-center relative overflow-hidden bg-[#070b14] text-slate-100 font-body p-3 sm:p-5 md:p-8 selection:bg-blue-500 selection:text-white"
            role="main"
        >
            <Head title="Welcome Back - SchoolQuest" />

            {/* Ambient Background Glows */}
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#131c31_0%,#070b14_75%)] pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1100px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"
                aria-hidden="true"
            />

            {/* Subtle background pixel dot pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]"
                aria-hidden="true"
            />

            {/* Main Center Card */}
            <div
                ref={cardRef}
                className="relative z-10 w-full max-w-[1150px] bg-[#141b2b] border-[3px] border-[#222e46] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-stretch overflow-hidden"
                style={{ opacity: 0 }}
            >
                {/* Left Section: Login Form */}
                <div
                    ref={leftPanelRef}
                    className="w-full lg:w-[52%] flex flex-col justify-center py-2 px-1 sm:px-3 lg:px-4"
                >
                    <LoginForm
                        onLoginSuccess={handleLoginSuccess}
                        animating={introState.active}
                    />
                </div>

                {/* Right Section: Fantasy Pixel Art Illustration */}
                <div
                    ref={rightPanelRef}
                    className="w-full lg:w-[48%] flex items-center justify-center"
                    style={{ opacity: 0 }}
                >
                    <FantasyPanel ref={fantasyPanelRef} />
                </div>
            </div>

            {/* Post-Login Cinematic Intro Modal (Portal directly into document.body) */}
            {introState.active && (
                <CastleIntroModal
                    initialRect={introState.rect}
                    redirectUrl={introState.redirectUrl}
                />
            )}
        </main>
    );
}
