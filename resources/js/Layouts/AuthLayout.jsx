import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#0a0e17] text-gray-200 font-body px-4 py-8" role="main">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#152033_0%,#0a0e17_70%)] pointer-events-none" aria-hidden="true" />

            {/* Pixel Particles Decoration with Subtle Floating Animations */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px]" aria-hidden="true" />
            <div className="absolute top-12 left-1/4 w-1.5 h-1.5 bg-blue-500/40 rounded-xs pixel-pulse" style={{ animationDelay: '0s' }} aria-hidden="true" />
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-amber-500/30 rounded-xs pixel-pulse" style={{ animationDelay: '1s' }} aria-hidden="true" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-xs pixel-pulse" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
            <div className="absolute top-20 right-1/3 w-1 h-1 bg-white/40 pixel-pulse" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
            <div className="absolute bottom-16 right-1/4 w-2 h-2 bg-indigo-500/30 pixel-pulse" style={{ animationDelay: '2s' }} aria-hidden="true" />

            <div className="z-10 w-full max-w-md auth-card-anim">
                {/* Header Logo */}
                <div className="text-center mb-6 flex flex-col items-center">
                    <img src="/images/logo.png" alt="SchoolQuest Logo" className="w-24 h-auto mb-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
                    <h1 className="text-2xl md:text-3xl font-game text-white tracking-wider mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Schoolquest
                    </h1>
                    <p className="text-slate-400 font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-1">
                        Leveling up<span className="inline-block w-1.5 h-1.5 bg-slate-500 mb-0.5 animate-pulse" />education
                    </p>
                </div>

                {/* Main Auth Card Container */}
                <div className="bg-[#161922] border border-[#262b3a] shadow-2xl rounded-md p-6 md:p-8 relative transition-all duration-300">
                    {children}
                </div>

                {/* Footer Links */}
                <div className="flex justify-between items-center text-[11px] font-mono tracking-wider text-slate-500 mt-5 px-1 uppercase">
                    <button type="button" onClick={() => alert('Fitur ini belum tersedia untuk mode demo.')} className="hover:text-slate-300 transition-colors">
                        FORGOT KEY?
                    </button>
                    <div>
                        <span>NEW RECRUIT? </span>
                        <button type="button" onClick={() => alert('Mode pendaftaran akun dikelola oleh Admin Sekolah.')} className="text-white font-bold hover:underline transition-colors">
                            JOIN GUILD
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
