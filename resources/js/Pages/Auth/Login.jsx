import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login() {
    const [tab, setTab] = useState('student');

    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: 'password',
    });

    const switchTab = (newTab) => {
        setTab(newTab);
        reset();
        if (newTab === 'student') {
            setData({ login: '', password: 'password' });
        } else {
            setData({ login: '', password: '' });
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <AuthLayout>
            <Head title="Login" />

            {/* Tab Switcher */}
            <div className="flex mb-8 bg-black/50 p-1 rounded-lg border border-gray-700">
                <button
                    type="button"
                    onClick={() => switchTab('student')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all duration-300 ${
                        tab === 'student'
                            ? 'bg-accent-cyan text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    🎮 Student
                </button>
                <button
                    type="button"
                    onClick={() => switchTab('admin')}
                    className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all duration-300 ${
                        tab === 'admin'
                            ? 'bg-accent-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    🛡️ Admin
                </button>
            </div>

            <form onSubmit={submit} className="space-y-5">

                {tab === 'student' ? (
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-accent-cyan tracking-wider block">NISN</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent-cyan transition-colors">
                                <span className="text-lg">🪪</span>
                            </div>
                            <input
                                id="nisn-input"
                                type="text"
                                value={data.login}
                                onChange={e => setData('login', e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all"
                                placeholder="Masukkan NISN kamu"
                                required
                                autoFocus
                            />
                        </div>
                        <p className="text-gray-600 text-[10px]">Contoh: 0012345001</p>
                        {errors.login && <p className="text-accent-red text-xs animate-shake mt-1">{errors.login}</p>}
                    </div>
                ) : (
                    <>
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-accent-purple tracking-wider block">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent-purple transition-colors">
                                    <span className="text-lg">📧</span>
                                </div>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={data.login}
                                    onChange={e => setData('login', e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                                    placeholder="admin@schoolquest.id"
                                    required
                                />
                            </div>
                            {errors.login && <p className="text-accent-red text-xs animate-shake mt-1">{errors.login}</p>}
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-accent-purple tracking-wider block">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent-purple transition-colors">
                                    <span className="text-lg">🔒</span>
                                </div>
                                <input
                                    id="password-input"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <p className="text-accent-red text-xs animate-shake mt-1">{errors.password}</p>}
                        </div>
                    </>
                )}

                {/* Student auto-password info */}
                {tab === 'student' && (
                    <input type="hidden" name="password" value="password" />
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className={`w-full py-3 rounded-lg font-game text-sm mt-6 transition-all duration-300 flex justify-center items-center gap-2 ${
                        tab === 'student'
                            ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan hover:bg-accent-cyan hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]'
                            : 'bg-accent-purple/20 text-accent-purple border border-accent-purple hover:bg-accent-purple hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                    }`}
                >
                    {processing ? (
                        <span className="animate-pulse">Connecting...</span>
                    ) : (
                        <>⚔️ ENTER GAME</>
                    )}
                </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-gray-600 text-[10px] text-center mb-2">Demo Accounts:</p>
                <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500">
                    <div className="bg-black/30 rounded p-2">
                        <p className="text-accent-cyan font-bold">Student</p>
                        <p>NISN: 0012345001</p>
                        <p>Pass: password</p>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                        <p className="text-accent-purple font-bold">Admin</p>
                        <p>admin@schoolquest.id</p>
                        <p>Pass: admin123</p>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
