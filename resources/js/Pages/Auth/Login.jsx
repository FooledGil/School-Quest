import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { IdentificationIcon, KeyIcon, EnvelopeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const [tab, setTab] = useState('student');

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
    });

    const switchTab = (newTab) => {
        setTab(newTab);
        reset();
        setData({ login: '', password: '' });
    };

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout>
            <Head title="Login - Enter The Realm" />

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 mb-6 bg-[#0f1118] p-1 rounded border border-[#242836]">
                <button
                    type="button"
                    onClick={() => switchTab('student')}
                    className={`py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 rounded-xs ${
                        tab === 'student'
                            ? 'bg-[#2563eb] text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                >
                    SISWA (NISN)
                </button>
                <button
                    type="button"
                    onClick={() => switchTab('admin')}
                    className={`py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 rounded-xs ${
                        tab === 'admin'
                            ? 'bg-[#2563eb] text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                >
                    ADMIN (EMAIL)
                </button>
            </div>

            <form onSubmit={submit} className="space-y-4 tab-fade-in" key={tab}>
                {tab === 'student' ? (
                    <div>
                        <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1.5 block">
                            IDENTITY ID / NISN
                        </label>
                        <div className="flex items-center bg-[#0d0f15] border border-[#272b38] rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 px-3 py-2">
                            <IdentificationIcon className="w-5 h-5 text-slate-500 mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-400" />
                            <input
                                id="nisn-input"
                                type="text"
                                value={data.login}
                                onChange={e => setData('login', e.target.value)}
                                className="bg-transparent w-full text-white font-mono text-sm focus:outline-none placeholder-slate-600"
                                placeholder="Masukkan NISN siswa"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.login && <p className="text-rose-400 font-mono text-xs mt-1 animate-pulse">{errors.login}</p>}
                    </div>
                ) : (
                    <div>
                        <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-1.5 block">
                            IDENTITY ID / EMAIL
                        </label>
                        <div className="flex items-center bg-[#0d0f15] border border-[#272b38] rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 px-3 py-2">
                            <EnvelopeIcon className="w-5 h-5 text-slate-500 mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-400" />
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
                    <div className="flex items-center bg-[#0d0f15] border border-[#272b38] rounded focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 px-3 py-2">
                        <KeyIcon className="w-5 h-5 text-slate-500 mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-400" />
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
                    className="w-full py-3.5 px-4 rounded bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold font-mono tracking-wider text-sm uppercase transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 active:translate-y-0 shadow-md flex items-center justify-center gap-2 mt-6 cursor-pointer"
                >
                    {processing ? (
                        'ENTERING REALM...'
                    ) : (
                        <>
                            ENTER THE REALM <span className="text-lg transition-transform group-hover:scale-110">⚔</span>
                        </>
                    )}
                </button>
            </form>

            {/* Scroll of Access / Demo Info */}
            <div className="bg-[#0d1017] border border-[#222634] rounded p-3 text-xs font-mono text-slate-300 mt-5 transition-all duration-200 hover:border-amber-500/30">
                <div className="text-[10px] font-bold text-amber-500 tracking-wider uppercase flex items-center gap-1.5 mb-1">
                    <InformationCircleIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    SCROLL OF ACCESS
                </div>
                {tab === 'student' ? (
                    <p className="text-slate-300">
                        Demo Access: <span className="text-white font-bold">NISN 0012345001</span> | Pass: <span className="text-white font-bold">password</span>
                    </p>
                ) : (
                    <p className="text-slate-300">
                        Demo Access: <span className="text-white font-bold">admin@schoolquest.id</span> | Pass: <span className="text-white font-bold">admin123</span>
                    </p>
                )}
            </div>
        </AuthLayout>
    );
}
