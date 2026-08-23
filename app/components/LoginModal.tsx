"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Fingerprint, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginGoogle: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginGoogle }: LoginModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl text-center relative overflow-hidden"
                    >
                        {/* Dekorasi Background */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-100 rounded-full blur-3xl opacity-50" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 border border-emerald-200">
                            <Fingerprint className="text-emerald-500" size={32} />
                            <motion.div
                                animate={{ rotate: 180, scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -top-2 -right-2 text-amber-400"
                            >
                                <Sparkles size={16} />
                            </motion.div>
                        </div>

                        <h2 className="text-2xl font-black mb-2 text-slate-800 tracking-tight z-10 relative">
                            Selamat Datang
                        </h2>
                        <p className="text-slate-500 mb-8 font-medium text-sm leading-relaxed z-10 relative">
                            Masuk untuk menyimpan <span className="text-emerald-600 font-bold">Custom Template</span> percakapan Anda secara permanen.
                        </p>

                        <button
                            onClick={onLoginGoogle}
                            className="w-full relative group bg-white border-2 border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-3 hover:border-emerald-400 hover:bg-emerald-50 transition-all z-10 active:scale-95"
                        >
                            <Image
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google Logo"
                                width={24}
                                height={24}
                            />
                            <span className="font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                                Lanjutkan dengan Google
                            </span>
                        </button>

                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6 z-10 relative">
                            Sistem Login Aman oleh Firebase
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}