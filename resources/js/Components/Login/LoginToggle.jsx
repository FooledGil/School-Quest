import React from 'react';

export default function LoginToggle({ activeMode, onToggle }) {
    return (
        <div className="w-full flex flex-col items-center mb-5 sm:mb-6">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold mb-2.5 text-center flex items-center justify-center gap-1.5">
                <span className="text-blue-400">▶</span>
                <span>CHOOSE CLASS / ROLE</span>
                <span className="text-blue-400">◀</span>
            </p>
            
            <div className="w-full max-w-xs sm:max-w-sm bg-[#0e1424] border-2 border-[#222f49] p-1.5 rounded-full flex items-center shadow-inner relative select-none">
                {/* Siswa Option */}
                <button
                    type="button"
                    onClick={() => onToggle('student')}
                    className={`flex-1 py-2.5 px-3 rounded-full font-game text-[9px] sm:text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer text-center relative z-10 ${
                        activeMode === 'student'
                            ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/40'
                            : 'text-slate-400 hover:text-slate-200 bg-transparent'
                    }`}
                >
                    ⚔️ SISWA
                </button>

                {/* Admin Option */}
                <button
                    type="button"
                    onClick={() => onToggle('admin')}
                    className={`flex-1 py-2.5 px-3 rounded-full font-game text-[9px] sm:text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer text-center relative z-10 ${
                        activeMode === 'admin'
                            ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-600/40'
                            : 'text-slate-400 hover:text-slate-200 bg-transparent'
                    }`}
                >
                    🛡️ ADMIN
                </button>
            </div>
        </div>
    );
}
