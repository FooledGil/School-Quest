import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ApiIcon from '@/Components/ApiIcon';
import { ICON_API } from '@/Utils/iconApi';

const STEPS = [
    {
        id: 1,
        title: 'Selamat Datang di SchoolQuest!',
        titleIcon: ICON_API.guideStep1,
        subtitle: 'Petualangan Belajarmu Dimulai Di Sini',
        icon: ICON_API.guideStep1,
        badgeColor: 'from-blue-500 to-indigo-600',
        content: 'SchoolQuest mengubah rutinitas sekolah di SMKN 2 Purwakarta menjadi petualangan gamifikasi yang seru dan memotivasi!',
        highlights: [
            { icon: ICON_API.questTarget, title: 'Belajar Berbasis Quest', desc: 'Ubah tugas harian & pelajaran menjadi misi berhadiah EXP' },
            { icon: ICON_API.levelUp, title: 'Tingkatkan Level', desc: 'Raih level tertinggi dari Novice hingga Mythic Legend' },
            { icon: ICON_API.medal, title: 'Koleksi Achievement', desc: 'Buka badge pencapaian prestasi belajar & keaktifanmu' },
        ]
    },
    {
        id: 2,
        title: 'Main Quest & Jadwal Pelajaran',
        titleIcon: ICON_API.guideStep2,
        subtitle: 'Misi Harian Sesuai Jadwal Kelas',
        icon: ICON_API.guideStep2,
        badgeColor: 'from-amber-500 to-orange-600',
        content: 'Setiap hari sistem otomatis menyiapkan Main Quest sesuai jadwal pelajaran dan kegiatan khusus kelasmu.',
        highlights: [
            { icon: ICON_API.laptop, title: 'Ikuti Pembelajaran', desc: 'Selesaikan instruksi dan tugas praktikum dari guru pengampu' },
            { icon: ICON_API.memo, title: 'Kirim Laporan Bukti', desc: 'Submit catatan / bukti pengerjaan tugas untuk diverifikasi' },
            { icon: ICON_API.lightning, title: 'Validasi & Reward', desc: 'Dapatkan guyuran bonus EXP setelah diverifikasi guru' },
        ]
    },
    {
        id: 3,
        title: 'Jadwal Piket & Additional Quest',
        titleIcon: ICON_API.guideStep3,
        subtitle: 'Kebersihan Kelas & Kegiatan Ekstra',
        icon: ICON_API.guideStep3,
        badgeColor: 'from-emerald-500 to-teal-600',
        content: 'Jaga kebersihan kelas bersama kelompok piketmu serta ambil berbagai quest tambahan yang menantang.',
        highlights: [
            { icon: ICON_API.sparkles, title: 'Jadwal Piket Otomatis', desc: 'Cek giliran kelompok piket harian langsung di dashboard' },
            { icon: ICON_API.runner, title: 'Additional Quest', desc: 'Ambil misi ekstrakurikuler, sosial, dan kegiatan sekolah' },
            { icon: ICON_API.fire, title: 'Daily Streak', desc: 'Pertahankan keaktifan harianmu untuk multiplier bonus EXP' },
        ]
    },
    {
        id: 4,
        title: 'Level, EXP & Leaderboard',
        titleIcon: ICON_API.guideStep4,
        subtitle: 'Peringkat & Prestasi Seluruh Siswa',
        icon: ICON_API.guideStep4,
        badgeColor: 'from-purple-500 to-pink-600',
        content: 'Bersaing secara sehat dan sportif dengan teman sekelas dan seluruh sekolah di tangga peringkat juara.',
        highlights: [
            { icon: ICON_API.podium, title: 'Podium Kejuaraan', desc: 'Raih posisi Top 3 untuk tampil megah di panggung kehormatan' },
            { icon: ICON_API.chart, title: 'Live Ranking', desc: 'Pantau posisi peringkatmu yang terupdate secara real-time' },
            { icon: ICON_API.star, title: 'Gelar Kehormatan', desc: 'Buka pangkat Apprentice, Adept, Elite, hingga Grandmaster' },
        ]
    },
    {
        id: 5,
        title: 'Kustomisasi Karakter & Profil',
        titleIcon: ICON_API.guideStep5,
        subtitle: 'Ekspresikan Karakter Unikmu',
        icon: ICON_API.guideStep5,
        badgeColor: 'from-cyan-500 to-blue-600',
        content: 'Avatar awalmu adalah siluet misterius. Kamu bebas mengkreasikan identitas visualmu kapan saja di menu Profile!',
        highlights: [
            { icon: ICON_API.guideStep5, title: 'Karakter Pixel Bot', desc: 'Pilih dari puluhan bot pixel universal yang keren & futuristik' },
            { icon: ICON_API.camera, title: 'Upload Foto Sendiri', desc: 'Unggah foto lokalmu langsung ke sistem penyimpanan server' },
            { icon: ICON_API.lock, title: 'Keamanan Akun', desc: 'Ganti password akunmu secara mandiri kapan saja dibutuhkan' },
        ]
    }
];

export default function OnboardingModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);
    const stepContentRef = useRef(null);

    // GSAP Step Transition
    useGSAP(() => {
        if (isOpen && stepContentRef.current) {
            gsap.fromTo(
                stepContentRef.current,
                { opacity: 0, y: 15, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
            );
        }
    }, { dependencies: [currentStep, isOpen] });

    if (!isOpen) return null;

    const step = STEPS[currentStep];
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === STEPS.length - 1;

    const handleFinish = (isSkipped = false) => {
        setIsSubmitting(true);
        router.post('/onboarding/complete', {}, {
            preserveScroll: true,
            onFinish: () => {
                setIsSubmitting(false);
                if (onClose) onClose();
            }
        });
    };

    const handleNext = () => {
        if (isLastStep) {
            handleFinish(false);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (!isFirstStep) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div 
                ref={modalRef}
                className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col max-h-[92vh]"
            >
                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />

                {/* Header */}
                <div className="p-4 sm:p-6 pb-2 flex items-center justify-between border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${step.badgeColor} flex items-center justify-center p-1.5 shadow-lg shrink-0`}>
                            <ApiIcon icon={step.icon} className="w-6 h-6 object-contain drop-shadow" />
                        </div>
                        <div>
                            <span className="text-[10px] sm:text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                                Panduan Siswa • Langkah {currentStep + 1} dari {STEPS.length}
                            </span>
                            <h2 className="text-sm sm:text-base font-bold text-white leading-tight truncate max-w-[220px] sm:max-w-none">
                                {step.subtitle}
                            </h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleFinish(true)}
                        disabled={isSubmitting}
                        className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    >
                        Lewati
                    </button>
                </div>

                {/* Step Progress Dots & Bar */}
                <div className="px-4 sm:px-6 pt-3">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        {STEPS.map((s, idx) => (
                            <button
                                key={s.id}
                                onClick={() => setCurrentStep(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                                    idx === currentStep 
                                        ? 'bg-blue-400 scale-125 shadow-sm shadow-blue-400' 
                                        : idx < currentStep 
                                            ? 'bg-blue-600/70' 
                                            : 'bg-slate-700'
                                }`}
                                title={s.subtitle}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Body */}
                <div ref={stepContentRef} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 min-h-0">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                            <ApiIcon icon={step.titleIcon} className="w-5 h-5" />
                            <span>{step.title}</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {step.content}
                        </p>
                    </div>

                    {/* Highlight Cards */}
                    <div className="space-y-2.5">
                        {step.highlights.map((h, i) => (
                            <div 
                                key={i}
                                className="flex items-start gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-colors"
                            >
                                <span className="shrink-0 p-1.5 bg-slate-900/80 rounded-lg border border-slate-700/50 flex items-center justify-center">
                                    <ApiIcon icon={h.icon} className="w-5 h-5 object-contain" />
                                </span>
                                <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-white">{h.title}</h4>
                                    <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">{h.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 pt-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={isFirstStep || isSubmitting}
                        className={`px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isFirstStep
                                ? 'opacity-0 pointer-events-none'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                    >
                        ⬅ Sebelumnya
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 ${
                                isLastStep
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/25'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
                            }`}
                        >
                            {isSubmitting ? (
                                <span>⏳ Memproses...</span>
                            ) : isLastStep ? (
                                <span>Mulai Petualangan! 🚀</span>
                            ) : (
                                <span>Lanjut ➜</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
