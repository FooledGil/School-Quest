import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-black">
            <div className="stars"></div>
            <div className="twinkling"></div>
            
            <div className="z-10 w-full max-w-md p-6">
                <div className="text-center mb-8 animate-float">
                    <h1 className="text-3xl md:text-4xl text-gradient font-game mb-4 leading-relaxed">
                        SchoolQuest
                    </h1>
                    <p className="text-accent-cyan font-bold tracking-widest text-sm">
                        LEVEL UP YOUR SCHOOL LIFE!
                    </p>
                </div>
                
                <div className="glass-card p-8 animate-slide-up relative">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-cyan rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-purple rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-purple rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-cyan rounded-br-lg"></div>
                    
                    {children}
                </div>
            </div>
        </div>
    );
}
