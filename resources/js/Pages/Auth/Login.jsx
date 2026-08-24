import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { IdentificationIcon, KeyIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const [isAdminMode, setIsAdminMode] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
    });

    const toggleAdminMode = (toAdmin) => {
        setIsAdminMode(toAdmin);
        reset();
        setData({ login: '', password: '' });
    };

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout>
            <Head title={isAdminMode ? "Admin Access - SchoolQuest" : "Login - Enter The Realm"} />

            {/* Admin Mode Badge & Back Button (Only shown if admin mode is activated) */}
            {isAdminMode && (
                <div className="mb-4 flex items-center justify-between bg-indigo-950/60 border border-indigo-500/30 px-3 py-2 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2">
                        <LockClosedIcon className="w-4 h-4 text-indigo-400" />
                        <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase tracking-wider">
                            Staff / Admin Portal
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleAdminMode(false)}
                        className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-3 h-3" />
                        Mode Siswa
                    </button>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4 tab-fade-in" key={isAdminMode ? 'admin' : 'student'}>
                {!isAdminMode ? (
                    <div>
                        <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1.5 block">
                            IDENTITY ID / NISN
                        </label>
                        <div className="flex items-center bg-[#0d0f15] border border-[#272b38] rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 px-3 py-2 sm:py-2.5">
                            <IdentificationIcon className="w-5 h-5 text-slate-500 mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-400" />
                            <input
                                id="nisn-input"
                                type="text"
                                value={data.login}
                                onChange={e => setData('login', e.target.value)}
                                className="bg-transparent w-full text-white font-mono text-sm focus:outline-none placeholder-slate-600"
                                placeholder="Masukkan NISN atau Nama"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.login && <p className="text-rose-400 font-mono text-xs mt-1 animate-pulse">{errors.login}</p>}
                    </div>
                ) : (
                    <div>
                        <label className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase font-semibold mb-1.5 block">
                            STAFF CREDENTIAL / EMAIL
                        </label>
                        <div className="flex items-center bg-[#0d0f15] border border-indigo-900/50 rounded-lg focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200 px-3 py-2 sm:py-2.5">
                            <EnvelopeIcon className="w-5 h-5 text-indigo-400 mr-2.5 shrink-0" />
                            <input
                                id="email-input"
                                type="email"
                                value={data.login}
                                onChange={e => setData('login', e.target.value)}
                                className="bg-transparent w-full text-white font-mono text-sm focus:outline-none placeholder-slate-600"
                                placeholder="admin@schoolquest.id"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.login && <p className="text-rose-400 font-mono text-xs mt-1 animate-pulse">{errors.login}</p>}
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1.5 block">
                        ACCESS KEY / PASSWORD
                    </label>
                    <div className={`flex items-center bg-[#0d0f15] border rounded-lg transition-all duration-200 px-3 py-2 sm:py-2.5 ${
                        isAdminMode 
                            ? 'border-indigo-900/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20' 
                            : 'border-[#272b38] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
                    }`}>
                        <KeyIcon className={`w-5 h-5 mr-2.5 shrink-0 transition-colors ${isAdminMode ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <input
                            id="password-input"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="bg-transparent w-full text-white font-mono text-sm focus:outline-none placeholder-slate-600 tracking-widest"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {errors.password && <p className="text-rose-400 font-mono text-xs mt-1 animate-pulse">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 sm:py-3.5 px-4 rounded-lg font-extrabold font-mono tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 mt-5 sm:mt-6 cursor-pointer active:translate-y-0 ${
                        isAdminMode
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                            : 'bg-[#f59e0b] hover:bg-[#d97706] text-black hover:shadow-lg hover:shadow-amber-500/20'
                    }`}
                >
                    {processing ? (
                        'ENTERING REALM...'
                    ) : isAdminMode ? (
                        'ACCESS ADMIN PORTAL 🔒'
                    ) : (
                        <>
                            ENTER THE REALM <span className="text-lg transition-transform group-hover:scale-110">⚔</span>
                        </>
                    )}
                </button>
            </form>

            {/* Discreet Admin / Staff Portal Toggle Button at bottom */}
            {!isAdminMode && (
                <div className="mt-5 pt-3 border-t border-slate-800/40 flex justify-center">
                    <button
                        type="button"
                        onClick={() => toggleAdminMode(true)}
                        className="text-[10px] text-slate-600 hover:text-slate-400 font-mono transition-colors flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer group"
                        title="Staff Portal Access"
                    >
                        <LockClosedIcon className="w-3 h-3 text-slate-700 group-hover:text-slate-400 transition-colors" />
                        <span>Staff Access</span>
                    </button>
                </div>
            )}
        </AuthLayout>
    );
}
