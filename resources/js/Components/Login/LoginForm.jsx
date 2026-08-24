import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import gsap from 'gsap';
import LoginToggle from './LoginToggle';
import LoginInput from './LoginInput';
import RealmNotice from './RealmNotice';

export default function LoginForm({ onLoginSuccess }) {
    const [activeMode, setActiveMode] = useState('student');
    const [validationErrors, setValidationErrors] = useState({});
    
    const identityInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordInputInnerRef = useRef(null);
    const submitBtnRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
    });

    const handleModeToggle = (mode) => {
        setActiveMode(mode);
        setValidationErrors({});
        reset();
        setData({ login: '', password: '' });
    };

    // When pressing Enter on identity input, jump to password input if password is empty
    const handleIdentityKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (!data.password || data.password.trim() === '') {
                e.preventDefault();
                passwordInputInnerRef.current?.focus();
            }
        }
    };

    // Shake animation for validation errors
    const triggerShakeAnimation = (element) => {
        if (!element) return;
        gsap.fromTo(element, 
            { x: 0 },
            { 
                x: -8, 
                duration: 0.06, 
                repeat: 5, 
                yoyo: true, 
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.set(element, { x: 0 });
                }
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!data.login.trim()) {
            newErrors.login = activeMode === 'student' 
                ? 'NISN / Nama harus diisi!' 
                : 'Email staf harus diisi!';
        }
        if (!data.password) {
            newErrors.password = 'Password harus diisi!';
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            if (newErrors.login && identityInputRef.current) {
                triggerShakeAnimation(identityInputRef.current);
            }
            if (newErrors.password && passwordInputRef.current) {
                triggerShakeAnimation(passwordInputRef.current);
            }
            return;
        }

        setValidationErrors({});

        // Submit to Laravel backend
        post('/login', {
            onError: () => {
                if (identityInputRef.current) triggerShakeAnimation(identityInputRef.current);
            }
        });
    };

    const isStudent = activeMode === 'student';

    return (
        <div className="w-full flex flex-col justify-center max-w-md mx-auto">
            {/* Header: Centered Welcome Back with Retro Game Styling */}
            <div className="text-center mb-4 sm:mb-5">
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-[9px] font-mono text-blue-300 font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SCHOOLQUEST REALM</span>
                </div>
                <h1 className="font-game text-lg sm:text-xl md:text-2xl text-white tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-snug">
                    Welcome Back
                </h1>
            </div>

            {/* Pill Toggle for SISWA / ADMIN */}
            <LoginToggle 
                activeMode={activeMode} 
                onToggle={handleModeToggle} 
            />

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identity Input */}
                <LoginInput
                    ref={identityInputRef}
                    id="identity-input"
                    label={isStudent ? "IDENTITY ID / NISN" : "EMAIL ADDRESS"}
                    type={isStudent ? "text" : "email"}
                    value={data.login}
                    onChange={(e) => {
                        setData('login', e.target.value);
                        if (validationErrors.login) {
                            setValidationErrors(prev => ({ ...prev, login: null }));
                        }
                    }}
                    onKeyDown={handleIdentityKeyDown}
                    placeholder={isStudent ? "Masukkan NISN atau Nama" : "admin@schoolquest.id"}
                    icon={<span role="img" aria-label="id-card">🪪</span>}
                    error={validationErrors.login || errors.login}
                    autoFocus
                />

                {/* Password Input */}
                <LoginInput
                    ref={passwordInputRef}
                    inputRef={passwordInputInnerRef}
                    id="password-input"
                    label="ACCESS KEY / PASSWORD"
                    type="password"
                    value={data.password}
                    onChange={(e) => {
                        setData('password', e.target.value);
                        if (validationErrors.password) {
                            setValidationErrors(prev => ({ ...prev, password: null }));
                        }
                    }}
                    placeholder="••••••••"
                    icon={<span role="img" aria-label="key">🔑</span>}
                    error={validationErrors.password || errors.password}
                    allowPasswordToggle={true}
                />

                {/* Primary CTA Button: ENTER THE REALM with Game Font */}
                <button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={processing}
                    className="w-full h-[54px] sm:h-[58px] rounded-xl sm:rounded-2xl font-game tracking-wider text-[11px] sm:text-xs text-slate-950 uppercase bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:from-[#fde68a] hover:to-[#f59e0b] active:from-[#d97706] active:to-[#b45309] shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 border-2 border-amber-300/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] select-none mt-5"
                >
                    {processing ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            ENTERING REALM...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span>ENTER THE REALM</span>
                            <span className="text-sm">⚔️</span>
                        </span>
                    )}
                </button>
            </form>

            {/* Realm Server & Adventurer Tips Widget */}
            <RealmNotice activeMode={activeMode} />
        </div>
    );
}
