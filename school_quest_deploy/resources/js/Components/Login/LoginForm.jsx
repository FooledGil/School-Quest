import React, { useRef, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import LoginInput from './LoginInput';
import RealmNotice from './RealmNotice';

export default function LoginForm({ onLoginSuccess, animating = false }) {
    const [data, setData] = useState({ login: '', password: '' });
    const [processing, setProcessing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    // Forgot password state
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotIdentifier, setForgotIdentifier] = useState('');
    const [forgotNotes, setForgotNotes] = useState('');
    const [forgotSubmitting, setForgotSubmitting] = useState(false);
    const [forgotResult, setForgotResult] = useState(null);
    const [forgotError, setForgotError] = useState(null);
    
    const identityInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const passwordInputInnerRef = useRef(null);
    const submitBtnRef = useRef(null);

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotIdentifier.trim()) {
            setForgotError('Harap masukkan Nama Lengkap, NISN, atau Email Anda.');
            return;
        }

        setForgotSubmitting(true);
        setForgotError(null);
        setForgotResult(null);

        try {
            const res = await axios.post('/forgot-password-report', {
                identifier: forgotIdentifier.trim(),
                notes: forgotNotes.trim(),
            });
            if (res.data?.success || res.data?.status === 'success') {
                setForgotResult(res.data.message || 'Laporan berhasil dikirim ke Admin/Wali Kelas.');
                setForgotIdentifier('');
                setForgotNotes('');
            }
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Gagal mengirim laporan. Silakan coba lagi.');
        } finally {
            setForgotSubmitting(false);
        }
    };

    // Update a single field in the form data
    const updateField = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Don't allow submission during animation
        if (animating) return;

        const newErrors = {};
        if (!data.login.trim()) {
            newErrors.login = 'NISN, Nama, atau Email harus diisi!';
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
        setProcessing(true);

        try {
            const loginUrl = window.location.pathname.includes('index.php') ? '/index.php/login' : '/login';
            const response = await axios.post(loginUrl, data, {
                baseURL: '/',
                headers: { 'X-Login-Animation': 'true' }
            });

            if (response.data.success && onLoginSuccess) {
                onLoginSuccess(response.data.redirect);
            }
        } catch (err) {
            if (err.response?.status === 422) {
                const serverErrors = err.response.data.errors || {};
                setValidationErrors(serverErrors);
                if (identityInputRef.current) triggerShakeAnimation(identityInputRef.current);
                if (passwordInputRef.current) triggerShakeAnimation(passwordInputRef.current);
            }
        } finally {
            setProcessing(false);
        }
    };

    const isDisabled = processing || animating;

    return (
        <div className="w-full flex flex-col justify-center max-w-md mx-auto">
            {/* Header: Centered Welcome Back with Retro Game Styling (No AI-slop portal badge) */}
            <div className="text-center mb-3 sm:mb-5">
                <h1 className="font-game text-base sm:text-xl md:text-2xl text-white tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] leading-snug">
                    Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-body">
                    Masuk ke realm untuk melanjutkan petualanganmu
                </p>
            </div>

            {/* Main Unified Form (Single Gateway for All Users) */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Identity Input */}
                <LoginInput
                    ref={identityInputRef}
                    id="identity-input"
                    label="IDENTIFIER / NAMA / NISN / EMAIL"
                    type="text"
                    value={data.login}
                    onChange={(e) => {
                        updateField('login', e.target.value);
                        if (validationErrors.login) {
                            setValidationErrors(prev => ({ ...prev, login: null }));
                        }
                    }}
                    onKeyDown={handleIdentityKeyDown}
                    placeholder="Contoh: [nama lengkap/nisn]"
                    icon={<span role="img" aria-label="id-card">🪪</span>}
                    error={validationErrors.login}
                    autoFocus
                    disabled={isDisabled}
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
                        updateField('password', e.target.value);
                        if (validationErrors.password) {
                            setValidationErrors(prev => ({ ...prev, password: null }));
                        }
                    }}
                    placeholder="Default: NISN"
                    icon={<span role="img" aria-label="key">🔑</span>}
                    error={validationErrors.password}
                    allowPasswordToggle={true}
                    disabled={isDisabled}
                />

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end -mt-1">
                    <button
                        type="button"
                        onClick={() => {
                            setForgotIdentifier(data.login || '');
                            setForgotError(null);
                            setForgotResult(null);
                            setShowForgotModal(true);
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer hover:underline font-body"
                    >
                        Lupa Kata Sandi?
                    </button>
                </div>

                {/* Primary CTA Button: ENTER THE REALM with Game Font */}
                <button
                    ref={submitBtnRef}
                    type="submit"
                    disabled={isDisabled}
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

            {/* Login Format Information Banner */}
            <div className="mt-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#090e1a]/95 border border-[#1e2d4a] shadow-inner select-none">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🔑</span>
                    <span className="font-game text-[9px] sm:text-[10px] text-sky-400 tracking-wider font-bold">
                        PANDUAN FORMAT LOGIN
                    </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0d1424] border border-[#1b263b] space-y-1.5 font-mono text-[11px] sm:text-xs">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Identitas:</span>
                        <span className="text-amber-400 font-bold tracking-wide">[nama lengkap/nisn]</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Password:</span>
                        <span className="text-emerald-400 font-bold tracking-wide">NISN <span className="text-[10px] text-emerald-500/80 font-normal font-sans">(default)</span></span>
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center font-body">
                    Masukkan NISN atau Nama Lengkap Anda. Kata sandi default adalah NISN. Guru & Admin login dengan email.
                </p>
            </div>

            {/* Realm Server & Adventurer Tips Widget */}
            <RealmNotice />

            {/* Forgot Password Report Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="w-full max-w-md bg-[#0f172a] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-left">
                        <button
                            type="button"
                            onClick={() => setShowForgotModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-xl">🔑</span>
                            <div>
                                <h3 className="font-game text-xs sm:text-sm text-white tracking-wider">
                                    Lapor Lupa Kata Sandi
                                </h3>
                                <p className="text-[11px] text-slate-400 font-body">
                                    Laporan ini akan langsung diteruskan ke Admin / Wali Kelas
                                </p>
                            </div>
                        </div>

                        {forgotResult ? (
                            <div className="my-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs leading-relaxed space-y-2">
                                <p className="font-bold flex items-center gap-1.5">
                                    <span>✅</span>
                                    <span>Laporan Terkirim!</span>
                                </p>
                                <p>{forgotResult}</p>
                                <p className="text-[10.5px] text-emerald-300/80">
                                    Setelah admin mengonfirmasi, akun Anda dapat login kembali menggunakan kata sandi default: <span className="font-mono font-bold text-amber-300">NISN Anda</span>.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(false)}
                                    className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                                >
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotSubmit} className="space-y-3.5 mt-4">
                                {forgotError && (
                                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                                        {forgotError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-game text-slate-300 uppercase tracking-wider mb-1">
                                        Identitas (Nama Lengkap / NISN / Email) *
                                    </label>
                                    <input
                                        type="text"
                                        value={forgotIdentifier}
                                        onChange={(e) => setForgotIdentifier(e.target.value)}
                                        placeholder="Contoh: MITA atau 0084169869"
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-game text-slate-300 uppercase tracking-wider mb-1">
                                        Catatan Tambahan (Opsional)
                                    </label>
                                    <textarea
                                        value={forgotNotes}
                                        onChange={(e) => setForgotNotes(e.target.value)}
                                        placeholder="Contoh: Lupa password akun, mohon diresetkan ke NISN."
                                        rows={2}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none"
                                    />
                                </div>

                                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[10.5px] text-slate-400 space-y-1">
                                    <p className="flex items-center gap-1 text-amber-300 font-semibold">
                                        <span>💡</span> Informasi:
                                    </p>
                                    <p>
                                        Ketika disetujui Admin, kata sandi Anda akan direset ke NISN Anda (kata sandi default).
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotModal(false)}
                                        className="flex-1 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={forgotSubmitting}
                                        className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs text-white font-semibold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        {forgotSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
