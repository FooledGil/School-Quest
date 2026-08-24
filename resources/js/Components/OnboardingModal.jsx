import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ApiIcon from '@/Components/ApiIcon';
import { ICON_API } from '@/Utils/iconApi';
import QuestPathProgress from '@/Components/Guide/QuestPathProgress';

const STEPS = [
    {
        id: 1,
        chapter: 'CHAPTER 01',
        title: 'SELAMAT DATANG DI REALM!',
        titleIcon: ICON_API.guideStep1,
        subtitle: 'Awal Petualangan Baru di SMKN 2 Purwakarta',
        icon: ICON_API.guideStep1,
        themeColor: 'blue',
        accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
        badgeColor: 'border-blue-500/50 bg-blue-500/15 text-blue-300',
        dialogue: 'Selamat datang, Hero! SchoolQuest menyulap seluruh rutinitas sekolah menjadi petualangan RPG yang menantang dan penuh reward.',
        perks: [
            { icon: ICON_API.questTarget, title: 'Quest-Based Learning', desc: 'Ubah tugas harian & pelajaran menjadi misi berhadiah EXP melimpah.', badge: 'CORE MISI' },
            { icon: ICON_API.levelUp, title: 'Level & Title Rank', desc: 'Kumpulkan EXP dan tingkatkan level dari Novice hingga Mythic Legend.', badge: 'TIER UP' },
            { icon: ICON_API.medal, title: 'Achievement Gallery', desc: 'Buka koleksi trophy dan badge prestasi atas keaktifan belajarmu.', badge: 'BADGES' },
        ]
    },
    {
        id: 2,
        chapter: 'CHAPTER 02',
        title: 'MAIN QUEST & EXPEDISI',
        titleIcon: ICON_API.guideStep2,
        subtitle: 'Misi Harian Sesuai Jadwal Pelajaran',
        icon: ICON_API.guideStep2,
        themeColor: 'amber',
        accentGradient: 'from-amber-600 via-orange-600 to-yellow-500',
        badgeColor: 'border-amber-500/50 bg-amber-500/15 text-amber-300',
        dialogue: 'Setiap hari sistem otomatis menyiapkan Main Quest sesuai jadwal mata pelajaran aktif kelasmu.',
        perks: [
            { icon: ICON_API.laptop, title: 'Tugas & Praktikum Guru', desc: 'Selesaikan instruksi pembelajaran langsung dari guru pengampu.', badge: 'ACADEMIC' },
            { icon: ICON_API.camera, title: 'Submit Bukti & Foto', desc: 'Kirimkan catatan atau foto bukti pengerjaan untuk dinilai.', badge: 'EVIDENCE' },
            { icon: ICON_API.lightning, title: 'Validasi & Guyuran EXP', desc: 'Setelah diverifikasi oleh guru, EXP instan langsung masuk ke karaktermu.', badge: 'REWARD' },
        ]
    },
    {
        id: 3,
        chapter: 'CHAPTER 03',
        title: 'PIKET & SIDE QUESTS',
        titleIcon: ICON_API.guideStep3,
        subtitle: 'Kebersihan Kelas & Misi Tambahan',
        icon: ICON_API.guideStep3,
        themeColor: 'emerald',
        accentGradient: 'from-emerald-600 via-teal-600 to-green-500',
        badgeColor: 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300',
        dialogue: 'Jaga kebersihan kelas bersama kelompok piketmu serta ambil berbagai quest tambahan yang menguji keterampilanmu.',
        perks: [
            { icon: ICON_API.sparkles, title: 'Jadwal Piket Otomatis', desc: 'Cek rotasi giliran piket kelompokmu langsung di papan dashboard.', badge: 'TEAM WORK' },
            { icon: ICON_API.runner, title: 'Additional Quest', desc: 'Kerjakan misi ekskul, sosial, dan kegiatan positif sekolah.', badge: 'SIDE QUEST' },
            { icon: ICON_API.fire, title: 'Daily Streak Multiplier', desc: 'Jaga keaktifan harianmu tanpa putus untuk bonus multiplier EXP!', badge: 'COMBO' },
        ]
    },
    {
        id: 4,
        chapter: 'CHAPTER 04',
        title: 'HALL OF FAME & PODIUM',
        titleIcon: ICON_API.guideStep4,
        subtitle: 'Peringkat & Prestasi Seluruh Siswa',
        icon: ICON_API.guideStep4,
        themeColor: 'purple',
        accentGradient: 'from-purple-600 via-pink-600 to-indigo-500',
        badgeColor: 'border-purple-500/50 bg-purple-500/15 text-purple-300',
        dialogue: 'Bersaing secara sehat dan sportif dengan rekan sekelas maupun satu sekolah di papan peringkat juara!',
        perks: [
            { icon: ICON_API.podium, title: 'Podium Top 3 Kehormatan', desc: 'Raih posisi tiga teratas untuk tampil megah di panggung podium.', badge: 'VICTORY' },
            { icon: ICON_API.chart, title: 'Live Ranking Leaderboard', desc: 'Pantau posisi rank yang selalu terupdate secara real-time.', badge: 'REALTIME' },
            { icon: ICON_API.star, title: 'Gelar Kehormatan Guild', desc: 'Buka gelar Apprentice, Adept, Elite, hingga Grandmaster.', badge: 'HONOR' },
        ]
    },
    {
        id: 5,
        chapter: 'CHAPTER 05',
        title: 'CUSTOM AVATAR STUDIO',
        titleIcon: ICON_API.guideStep5,
        subtitle: 'Kreasikan Karakter Hero Unikmu',
        icon: ICON_API.guideStep5,
        themeColor: 'cyan',
        accentGradient: 'from-cyan-600 via-blue-600 to-indigo-500',
        badgeColor: 'border-cyan-500/50 bg-cyan-500/15 text-cyan-300',
        dialogue: 'Avatar awalmu adalah siluet misterius. Kamu bebas mengkreasikan identitas visualmu kapan saja di menu Profile!',
        perks: [
            { icon: ICON_API.guideStep5, title: 'Koleksi Pixel Bot', desc: 'Pilih dari puluhan bot pixel universal yang keren & futuristik.', badge: 'PIXEL ART' },
            { icon: ICON_API.uploadPhoto, title: 'Upload Foto Pribadi', desc: 'Unggah foto terbaikmu langsung ke sistem penyimpanan server.', badge: 'CUSTOM' },
            { icon: ICON_API.lock, title: 'Keamanan Akun Hero', desc: 'Ganti password secara mandiri kapan pun kamu butuhkan.', badge: 'SECURITY' },
        ]
    }
];

export default function OnboardingModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);
    const stepContentRef = useRef(null);
    const perksContainerRef = useRef(null);
    const titleRef = useRef(null);

    // GSAP Step Transition & Entrance Animation
    useGSAP(() => {
        if (isOpen && stepContentRef.current) {
            const tl = gsap.timeline();

            // Animate dialogue and title
            tl.fromTo(
                titleRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
            );

            // Stagger animate perk cards
            if (perksContainerRef.current) {
                const cards = perksContainerRef.current.querySelectorAll('.perk-card');
                tl.fromTo(
                    cards,
                    { y: 20, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
                    '-=0.15'
                );
            }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none">
            {/* Modal Container with Retro Arcade Frame */}
            <div 
                ref={modalRef}
                className="relative w-full max-w-2xl bg-[#090d16] border-2 border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden flex flex-col max-h-[94vh]"
            >
                {/* Top Glowing Pixel Accent Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${step.accentGradient} shadow-md`} />

                {/* Arcade Frame Header */}
                <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-slate-800/90 bg-slate-950/90">
                    <div className="flex items-center gap-2.5 min-w-0">
                        {/* Retro Step Emblem */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600/20 border-2 border-blue-500/60 flex items-center justify-center shrink-0 shadow-inner">
                            <span className="font-game text-xs text-blue-400">0{currentStep + 1}</span>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-game text-[8px] sm:text-[9px] text-amber-400 tracking-wider">
                                    {step.chapter}
                                </span>
                                <span className="text-[10px] text-slate-500">•</span>
                                <span className="font-mono text-[9px] sm:text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                                    TUTORIAL ARCHIVES
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                                {step.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Skip Button */}
                    <button
                        type="button"
                        onClick={() => handleFinish(true)}
                        disabled={isSubmitting}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white font-game text-[8px] sm:text-[9px] tracking-wider transition-colors cursor-pointer shrink-0"
                    >
                        SKIP ⏩
                    </button>
                </div>

                {/* RPG Dungeon Quest Path Progress Bar */}
                <div className="bg-[#0b101d] border-b-2 border-slate-800/80">
                    <QuestPathProgress 
                        steps={STEPS}
                        currentStep={currentStep}
                        onStepClick={(idx) => setCurrentStep(idx)}
                    />
                </div>

                {/* Content Body */}
                <div 
                    ref={stepContentRef} 
                    className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 min-h-0 bg-gradient-to-b from-[#090d16] to-[#0d1322]"
                >
                    {/* RPG Dialogue Box */}
                    <div 
                        ref={titleRef}
                        className="relative p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border-2 border-blue-500/40 shadow-lg"
                    >
                        {/* Dialogue Speaker Tag */}
                        <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-blue-600 border border-blue-400 font-game text-[7px] sm:text-[8px] text-white tracking-wider flex items-center gap-1 shadow-md">
                            <span>💬</span>
                            <span>GUILD INSTRUCTOR</span>
                        </div>

                        <div className="flex items-center gap-2.5 mb-1.5 mt-0.5">
                            <ApiIcon icon={step.titleIcon} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            <h3 className="font-game text-xs sm:text-sm text-white tracking-wider text-gradient drop-shadow-sm">
                                {step.title}
                            </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body pl-0.5">
                            "{step.dialogue}"
                        </p>
                    </div>

                    {/* RPG Perk / Item Cards */}
                    <div ref={perksContainerRef} className="space-y-2.5">
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-game text-slate-400 px-1">
                            <span className="flex items-center gap-1 text-slate-300">
                                <span>⚔️</span>
                                <span>FITUR & PERK AKTIF</span>
                            </span>
                            <span className="text-blue-400 font-mono">UNLOCKABLE SYSTEM</span>
                        </div>

                        {step.perks.map((perk, i) => (
                            <div 
                                key={i}
                                className="perk-card group relative flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border-2 border-slate-800/90 hover:border-blue-500/60 transition-all duration-200 shadow-md"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    {/* Perk Icon Box */}
                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-950 border-2 border-slate-700/80 group-hover:border-blue-400 flex items-center justify-center p-1.5 shadow-inner transition-colors">
                                        <ApiIcon icon={perk.icon} className="w-6 h-6 object-contain drop-shadow" />
                                    </div>

                                    {/* Perk Description */}
                                    <div className="min-w-0">
                                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                                            <span>{perk.title}</span>
                                        </h4>
                                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal mt-0.5">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Perk Badge */}
                                <span className="hidden sm:inline-block shrink-0 font-game text-[7px] text-blue-300 bg-blue-950/80 border border-blue-600/40 px-2 py-1 rounded">
                                    {perk.badge}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-4 sm:px-6 py-3.5 border-t-2 border-slate-800/90 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handlePrev}
                        disabled={isFirstStep || isSubmitting}
                        className={`px-3.5 sm:px-4 py-2.5 rounded-xl font-game text-[9px] sm:text-[10px] tracking-wider transition-all cursor-pointer ${
                            isFirstStep
                                ? 'opacity-0 pointer-events-none'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-2 border-slate-700 active:scale-95'
                        }`}
                    >
                        ◀ KEMBALI
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-game text-[9px] sm:text-[11px] tracking-wider uppercase shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 ${
                            isLastStep
                                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border-2 border-emerald-400 shadow-emerald-600/40'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-2 border-blue-400 shadow-blue-600/30'
                        }`}
                    >
                        {isSubmitting ? (
                            <span>⏳ PROSES...</span>
                        ) : isLastStep ? (
                            <span>🚀 MULAI PETUALANGAN!</span>
                        ) : (
                            <span>LANJUTKAN MISI ➜</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
