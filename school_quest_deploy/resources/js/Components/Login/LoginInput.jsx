import React, { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginInput = forwardRef(function LoginInput({
    label,
    id,
    type = 'text',
    value,
    onChange,
    onKeyDown,
    inputRef,
    placeholder,
    icon,
    error,
    autoFocus = false,
    className = '',
    allowPasswordToggle = false,
}, ref) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const computedType = isPassword && showPassword ? 'text' : type;

    return (
        <div className={`w-full ${className}`} ref={ref}>
            {label && (
                <label 
                    htmlFor={id} 
                    className="block font-game text-[9px] text-slate-300 tracking-wider uppercase mb-2 flex items-center gap-1.5 select-none"
                >
                    <span className="text-amber-400 text-[8px]">◆</span>
                    <span>{label}</span>
                </label>
            )}

            <div className={`relative flex items-center h-[52px] bg-[#0e1424] border-2 rounded-xl px-3.5 transition-all duration-200 ${
                error 
                    ? 'border-rose-500 ring-2 ring-rose-500/20' 
                    : 'border-[#25334d] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30'
            }`}>
                {/* Left Icon */}
                {icon && (
                    <div className="shrink-0 mr-3 text-lg flex items-center justify-center select-none">
                        {icon}
                    </div>
                )}

                {/* Input element */}
                <input
                    ref={inputRef}
                    id={id}
                    type={computedType}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full h-full bg-transparent text-white font-mono font-medium text-sm focus:outline-none placeholder:text-slate-600 placeholder:font-mono"
                />

                {/* Password Toggle Button */}
                {isPassword && allowPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer ml-2"
                        tabIndex="-1"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="w-4 h-4" />
                        ) : (
                            <EyeIcon className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-rose-400 font-mono font-bold text-xs mt-1.5 animate-pulse flex items-center gap-1">
                    <span>⚠️</span> {error}
                </p>
            )}
        </div>
    );
});

export default LoginInput;
