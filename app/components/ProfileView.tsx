"use client";

import * as React from 'react';
import { motion } from 'motion/react';
import {
    User,
    Plus,
    Trash2,
    ArrowLeft,
    LayoutGrid,
    LogOut,
    StickyNote
} from 'lucide-react';
import Image from 'next/image';

interface ProfileViewProps {
    user: any;
    templates: string[];
    onAddTemplate: (text: string) => void;
    onDeleteTemplate: (index: number) => void;
    onLogout: () => void;
    onBack: () => void;
}

export function ProfileView({
    user,
    templates,
    onAddTemplate,
    onDeleteTemplate,
    onLogout,
    onBack
}: ProfileViewProps) {
    const [newTpl, setNewTpl] = React.useState('');

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header Profil */}
            <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </button>
                    <h1 className="font-black text-xl text-slate-800 tracking-tight">Profil Saya</h1>
                    <button onClick={onLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                        <LogOut size={22} />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-2xl w-full mx-auto p-6 space-y-8">
                {/* Card Identitas */}
                <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Image
                            src={user?.photoURL || ''}
                            alt="Avatar"
                            width={100}
                            height={100}
                            className="rounded-[2rem] border-4 border-emerald-100 shadow-inner"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                            <User size={16} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">{user?.displayName}</h2>
                    <p className="text-slate-400 font-medium text-sm">{user?.email}</p>
                </section>

                {/* Manajemen Template */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <StickyNote className="text-sky-500" size={20} />
                        <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest">Template Kustom</h3>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTpl}
                                onChange={(e) => setNewTpl(e.target.value)}
                                placeholder="Tambahkan kalimat baru..."
                                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-sky-400 transition-all"
                            />
                            <button
                                onClick={() => { if (newTpl) { onAddTemplate(newTpl); setNewTpl(''); } }}
                                className="bg-sky-500 text-white p-4 rounded-2xl shadow-lg shadow-sky-100 active:scale-95 transition-transform"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {templates.map((tpl, idx) => (
                                <motion.div
                                    layout
                                    key={idx}
                                    className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors"
                                >
                                    <span className="font-bold text-slate-600">{tpl}</span>
                                    <button
                                        onClick={() => onDeleteTemplate(idx)}
                                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}