"use client";

import * as React from 'react';
import { motion } from 'motion/react';
import { UserCircle2, ArrowRight } from 'lucide-react';

interface GuestLobbyProps {
    roomPin: string;
    onJoin: (name: string, color: string) => void;
}

// Daftar warna ceria untuk identitas Tamu
const GUEST_COLORS = [
    '#0ea5e9', // Sky Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#f97316', // Orange
    '#14b8a6', // Teal
];

export function GuestLobby({ roomPin, onJoin }: GuestLobbyProps) {
    const [name, setName] = React.useState('');

    const handleJoin = () => {
        if (name.trim()) {
            // Pilih warna acak dari daftar saat tamu bergabung
            const randomColor = GUEST_COLORS[Math.floor(Math.random() * GUEST_COLORS.length)];
            onJoin(name.trim(), randomColor);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 max-w-md mx-auto relative overflow-hidden"
        >
            {/* Dekorasi Background */}
            <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-sky-200/50 rounded-full blur-3xl" />
            <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-emerald-200/50 rounded-full blur-3xl" />

            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border-b-8 border-slate-200 mb-8 rotate-3 z-10">
                <UserCircle2 className="text-sky-500" size={48} />
            </div>

            <h1 className="text-3xl font-black text-slate-800 mb-2 font-heading text-center z-10">
                Selamat Datang!
            </h1>
            <p className="text-slate-500 mb-10 text-center font-medium z-10">
                Anda akan bergabung ke ruang obrolan <span className="font-bold text-sky-600">PIN: {roomPin}</span>
            </p>

            <div className="w-full space-y-4 z-10">
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                        placeholder="Ketik nama panggilanmu..."
                        className="w-full bg-white border-4 border-slate-200 rounded-2xl p-5 text-xl font-bold text-slate-700 outline-none focus:border-sky-400 transition-all text-center placeholder:text-slate-300 shadow-sm"
                        autoFocus
                    />
                </div>

                <button
                    onClick={handleJoin}
                    disabled={!name.trim()}
                    className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-xl font-bold transition-all ${name.trim()
                            ? 'bg-sky-500 text-white border-b-8 border-sky-700 active:border-b-0 active:translate-y-2 shadow-lg'
                            : 'bg-slate-200 text-slate-400 border-b-8 border-slate-300'
                        }`}
                >
                    Masuk Obrolan
                    <ArrowRight size={24} />
                </button>
            </div>
        </motion.div>
    );
}