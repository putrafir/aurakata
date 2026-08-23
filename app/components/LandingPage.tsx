"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Smile,
    Heart,
    Sparkles,
    MessageSquare,
    Zap,
    ShieldCheck,
    ChevronRight,
    Mic,
    QrCode,
    Menu,
    X,
    LogOut,
    Ear,
    Activity,
    Wind
} from "lucide-react";
import Image from 'next/image';

interface LandingPageProps {
    onCreateRoom?: () => void;
    onStartSolo?: () => void;
    onOpenJoinModal?: () => void;
    onLoginClick?: () => void;
    onLogoutClick?: () => void;
    onProfileClick?: () => void;
    currentUser?: any;
}

export function LandingPage({ onCreateRoom, onOpenJoinModal, onLoginClick, onLogoutClick, onProfileClick, currentUser, onStartSolo, }: LandingPageProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const scrollToTop = () => {
        setIsMobileMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Navigation - Fixed & Responsive */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-200/50 transition-all">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/images/aurakata-logo.png"
                            alt="Logo AuraKata"
                            width={36}
                            height={36}
                            className="object-contain"
                            priority
                        />
                        <span className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                            AuraKata
                        </span>
                    </div>

                    <div className="hidden md:flex gap-8 items-center">
                        <a href="#misi" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Visi Kita</a>
                        <a href="#fitur" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Teknologi Inti</a>

                        <button
                            onClick={scrollToTop}
                            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                            Mulai Sesi
                        </button>

                        {currentUser ? (
                            <div className="flex items-center gap-3 border-l-2 border-slate-200 pl-6 ml-2">
                                <button onClick={onProfileClick} className="hover:scale-105 hover:shadow-md transition-all rounded-full">
                                    <img
                                        src={currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                                        alt="Profile"
                                        width={28}
                                        height={28}
                                        className="rounded-full border-2 border-emerald-200 object-cover"
                                    />
                                </button>
                                <button
                                    onClick={onLogoutClick}
                                    className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onLoginClick}
                                className="px-5 py-2 bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-lg"
                        >
                            <div className="flex flex-col px-6 py-4 gap-4">
                                <a
                                    href="#misi"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs font-black uppercase tracking-widest text-slate-500 py-2 border-b border-slate-100"
                                >
                                    Visi Kita
                                </a>
                                <a
                                    href="#fitur"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-xs font-black uppercase tracking-widest text-slate-500 py-2 border-b border-slate-100"
                                >
                                    Teknologi Inti
                                </a>
                                <button
                                    onClick={scrollToTop}
                                    className="text-left text-xs font-black uppercase tracking-widest text-slate-500 py-2 border-b border-slate-100"
                                >
                                    Mulai Sesi
                                </button>

                                {currentUser ? (
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <button onClick={onProfileClick} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                                            <img
                                                src={currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}
                                                alt="Profile"
                                                width={24}
                                                height={24}
                                                className="rounded-full object-cover"
                                            />
                                            <span className="text-xs font-bold text-slate-700">{currentUser.displayName}</span>
                                        </button>
                                        <button onClick={onLogoutClick} className="text-rose-400">
                                            <LogOut size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={onLoginClick}
                                        className="mt-2 px-5 py-3 bg-sky-100 text-sky-700 rounded-xl text-xs font-black uppercase tracking-widest text-center"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center md:text-left grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* <div className="inline-block px-4 py-1.5 mb-6 bg-emerald-100 border-2 border-emerald-200 rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Visual Typography AI
                        </span>
                    </div> */}

                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight mb-6">
                        Menerjemahkan <span className="text-emerald-500">Kata</span>,<br />
                        Memvisualkan <span className="text-sky-500 underline decoration-8 decoration-sky-100 underline-offset-8">Rasa</span>.
                    </h1>

                    <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
                        AuraKata menjembatani <b className="text-slate-800">Teman Tuli</b> dan masyarakat luas dengan teks yang hidup. Emosi, volume, dan nada suara diubah menjadi visual yang dapat dilihat secara real-time.
                    </p>

                    <div className="flex flex-col gap-4 justify-center md:justify-start w-full max-w-xl">
                        {/* Mode Mendengarkan (Orange) - Dipindah ke atas karena ini fitur SoloListen terbaru */}
                        <button
                            onClick={onStartSolo}
                            className="group relative bg-orange-500 text-white border-b-8 border-orange-700 active:border-b-0 active:translate-y-2 rounded-2xl px-8 py-5 transition-all duration-75 flex items-center justify-center gap-3 w-full"
                        >
                            <span className="font-bold text-lg">Mode Dengarkan</span>
                            <Ear className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
                            <button
                                onClick={onCreateRoom}
                                className="group relative bg-emerald-500 text-white border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2 rounded-2xl px-6 py-4 transition-all duration-75 flex flex-1 items-center justify-center gap-2"
                            >
                                <span className="font-bold text-base">Buat Ruang Grup</span>
                                <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>

                            <button
                                onClick={onOpenJoinModal}
                                className="group relative bg-sky-500 text-white border-b-8 border-sky-700 active:border-b-0 active:translate-y-2 rounded-2xl px-6 py-4 transition-all duration-75 flex flex-1 items-center justify-center gap-2"
                            >
                                <span className="font-bold text-base">Gabung via PIN / QR</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden md:block"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-sky-100 rounded-[48px] blur-3xl -z-10 opacity-60"></div>
                    <div className="bg-white border-2 border-slate-200 rounded-[40px] shadow-2xl relative overflow-hidden group">
                        {/* Browser Header Chrome */}
                        <div className="bg-slate-50 border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                            </div>
                            <div className="bg-slate-200/50 px-4 py-1 rounded-lg">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">aurakata.app</span>
                            </div>
                            <div className="w-12 h-1 bg-slate-200 rounded-full" />
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Voice Waves Decoration */}
                            <div className="flex items-center gap-1 mb-8 opacity-40">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                        className="w-1 bg-emerald-500 rounded-full"
                                    />
                                ))}
                                <span className="text-[10px] font-black text-slate-300 ml-2 uppercase tracking-wide">Audio Input Active</span>
                            </div>

                            {/* Simulated Chat Interface */}
                            <div className="space-y-6">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-200">
                                        <span className="text-white font-black text-xs">HT</span>
                                    </div>
                                    <div className="bg-slate-100 p-5 rounded-[24px] rounded-tl-none max-w-[85%] border border-slate-200/50">
                                        <p className="font-bold text-slate-800 leading-tight">"Besok jadi nongkrong di cafe?"</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-2xl bg-sky-500 flex-shrink-0 flex items-center justify-center shadow-lg shadow-sky-200">
                                        <span className="text-white font-black text-xs">TM</span>
                                    </div>
                                    <div className="bg-sky-500 p-5 rounded-[24px] rounded-tr-none max-w-[85%] shadow-lg shadow-sky-100">
                                        <motion.p
                                            animate={{
                                                scale: [1, 1.03, 1],
                                                rotate: [0, 0.5, 0, -0.5, 0]
                                            }}
                                            transition={{ repeat: Infinity, duration: 2.5 }}
                                            className="font-black text-white italic text-lg leading-tight tracking-tight"
                                        >
                                            "JADI DONG! GAK SABAR! ✨"
                                        </motion.p>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col items-center gap-2">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600 tracking-tighter uppercase">NLP: Happy</span>
                                        <span className="px-3 py-1 bg-sky-50 border border-sky-100 rounded-full text-[9px] font-black text-sky-600 tracking-tighter uppercase">Hybrid: Calibrated</span>
                                    </div>
                                    <div className="italic text-[10px] font-bold text-slate-400 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        Visual Aura: Sangat Ceria (Positif)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating UI Elements Overlays */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -top-6 -right-6 bg-white border-2 border-emerald-500/20 p-4 rounded-3xl shadow-xl z-20 flex flex-col items-center gap-1"
                        >
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Smile className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-600">POSY</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
                            className="absolute bottom-12 -left-8 bg-white border-2 border-slate-200 p-3 rounded-2xl shadow-lg z-20 flex gap-3 items-center"
                        >
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stability</span>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-sky-500 w-[90%]" />
                                </div>
                            </div>
                            <Heart className="w-4 h-4 text-rose-400 animate-pulse" />
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Why AuraKata */}
            <section id="misi" className="bg-white border-y-2 border-slate-200 py-24 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Misi Kami</span>
                        <h2 className="text-4xl font-black text-slate-800 mt-2 tracking-tight">Meruntuhkan Tembok Komunikasi</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Smile className="w-8 h-8 text-emerald-500" />,
                                title: "Kembalikan Konteks Emosi",
                                desc: "Teks yang datar seringkali salah diartikan. AuraKata memvisualisasikan nada suara dan intensitas volume ke dalam estetika balon obrolan yang dinamis."
                            },
                            {
                                icon: <Zap className="w-8 h-8 text-sky-500" />,
                                title: "Respons Akurat & Mengalir",
                                desc: "Dilengkapi Sensor Jeda Napas (Smart Silence) yang menunggu lawan bicara selesai bercerita sebelum menerjemahkannya menjadi satu kalimat utuh."
                            },
                            {
                                icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
                                title: "Inklusif Tanpa Hambatan",
                                desc: "Mode Solo untuk interaksi langsung di kasir atau kafe, dan Mode Ruangan berbasis QR Code untuk rapat jarak jauh. Semuanya tanpa perlu instal aplikasi."
                            }
                        ].map((card, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white border-2 border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="mb-6 p-4 bg-slate-50 rounded-2xl inline-block border border-slate-100">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-4">{card.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="fitur" className="py-24 bg-slate-50 overflow-hidden scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="bg-white border-2 border-emerald-200 p-6 rounded-[32px] shadow-sm">
                                        <Activity className="text-emerald-500 mb-3" />
                                        <div className="h-2 w-full bg-emerald-100 rounded-full mb-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "80%" }}
                                                transition={{ repeat: Infinity, duration: 3 }}
                                                className="h-full bg-emerald-500"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400">RELATIVE LOUDNESS</p>
                                    </div>
                                    <div className="bg-white border-2 border-slate-200 p-6 rounded-[32px] shadow-sm">
                                        <QrCode className="text-slate-400 mb-3" />
                                        <p className="text-sm font-bold text-slate-800">Ruang Inklusif</p>
                                        <p className="text-xs text-slate-400">Scan QR & Ngobrol</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white border-2 border-orange-200 p-6 rounded-[32px] shadow-sm">
                                        <Wind className="text-orange-500 mb-3" />
                                        <p className="text-sm font-bold text-slate-800">Buffer Dinamis</p>
                                        <p className="text-xs text-slate-400 italic">Deteksi jeda 1.2 detik</p>
                                    </div>
                                    <div className="bg-white border-2 border-sky-200 p-6 rounded-[32px] shadow-sm translate-y-8">
                                        <Sparkles className="text-sky-500 mb-3" />
                                        <p className="text-sm font-bold text-slate-800">IndoBERT AI</p>
                                        <p className="text-xs text-slate-400">Analisis Sentimen Kata</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <span className="text-xs font-black uppercase tracking-widest text-sky-600">Arsitektur Tingkat Lanjut</span>
                            <h2 className="text-4xl font-black text-slate-800 mt-2 mb-8 tracking-tight">Lebih dari Sekadar Transkrip Biasa</h2>

                            <ul className="space-y-8">
                                <li className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="font-black text-emerald-500">01</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">Hybrid Logic Engine</h4>
                                        <p className="text-slate-500 text-sm">Menggabungkan kecerdasan linguistik NLP dari *microservice* AI dengan sensor fisika (lonjakan volume) untuk mencegah misinterpretasi pada bahasa santai/gaul.</p>
                                    </div>
                                </li>
                                <li className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="font-black text-orange-500">02</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">Smart Sentence Accumulator</h4>
                                        <p className="text-slate-500 text-sm">Tidak memotong kalimat di tengah jalan. Sistem dengan sabar menampung ucapan dan baru memprosesnya saat mendeteksi jeda napas yang natural.</p>
                                    </div>
                                </li>
                                <li className="flex gap-5">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                                        <span className="font-black text-sky-500">03</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1">Kalibrasi Ruangan (Ambient)</h4>
                                        <p className="text-slate-500 text-sm">Secara otomatis menyesuaikan standar kebisingan ruangan. Berbicara di perpustakaan atau di kafe yang ramai, akurasi deteksi emosi tetap terjaga.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t-2 border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Image
                            src="/images/aurakata-logo.png"
                            alt="Logo AuraKata"
                            width={36}
                            height={36}
                            className="object-contain"
                            priority
                        />
                        <span className="text-xl font-black text-slate-800 tracking-tight">AuraKata</span>
                    </div>

                    <p className="text-slate-500 font-medium mb-8">
                        Membangun dunia di mana suara bisa dirasakan melalui pandangan mata.
                    </p>

                    <div className="flex items-center justify-center gap-6 mb-12">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Data Diproses Real-time & Tidak Disimpan</span>
                        </div>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        &copy; 2026 Ahmad Putra Firdaus. Crafted for Humanity.
                    </div>
                </div>
            </footer>
        </div>
    );
}