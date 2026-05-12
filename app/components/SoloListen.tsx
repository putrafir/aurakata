"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, MicOff, Waves } from 'lucide-react';
import { DynamicText } from './DynamicText';

interface SoloListenProps {
    onExit: () => void;
}

export function SoloListen({ onExit }: SoloListenProps) {
    const [isListening, setIsListening] = React.useState(false);
    const [transcripts, setTranscripts] = React.useState<{ id: number; text: string }[]>([]);
    const [interimText, setInterimText] = React.useState('');
    const recognitionRef = React.useRef<any>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll ke bawah saat ada teks baru
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts, interimText]);

    // Setup Web Speech API
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true; // Tangkap teks selagi orangnya masih ngomong
                recognition.lang = 'id-ID';

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);

                recognition.onresult = (event: any) => {
                    let final = '';
                    let interim = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            final += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }

                    if (final.trim()) {
                        setTranscripts(prev => [...prev, { id: Date.now(), text: final.trim() }]);
                    }
                    setInterimText(interim);
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 max-w-2xl mx-auto shadow-sm border-x border-slate-200 relative">
            {/* HEADER */}
            <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
                <button onClick={onExit} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <h2 className="font-black text-slate-800 text-sm tracking-tight">Mode Mendengarkan</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transkripsi Live</p>
                </div>
                <div className="w-9" /> {/* Spacer untuk keseimbangan flex */}
            </header>

            {/* AREA TEKS */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-40 scroll-smooth">
                {transcripts.length === 0 && !interimText && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                        <Waves size={48} className="mb-4 text-sky-400" />
                        <p className="font-bold">Ketuk mikrofon untuk mulai mendengarkan...</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {transcripts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] rounded-bl-sm shadow-sm border-2 border-slate-100"
                        >
                            <DynamicText text={t.text} sentiment="neutral" className="text-xl md:text-2xl font-bold text-slate-800" />
                        </motion.div>
                    ))}

                    {/* Teks Sementara (Selagi orang bicara) */}
                    {interimText && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-sky-50 p-6 rounded-[2rem] rounded-bl-sm border-2 border-sky-100"
                        >
                            <p className="text-xl md:text-2xl font-bold text-sky-600 italic opacity-70">
                                {interimText}...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TOMBOL MIC BESAR DI BAWAH */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30">
                <div className="relative">
                    {isListening && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-[#006FFF] rounded-full -z-10"
                        />
                    )}
                    <button
                        onClick={toggleListen}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white border-b-8 active:border-b-0 active:translate-y-2 transition-all shadow-xl ${isListening ? 'bg-[#006FFF] border-blue-900' : 'bg-slate-300 border-slate-400 text-slate-500'
                            }`}
                    >
                        {isListening ? <Mic size={32} /> : <MicOff size={32} />}
                    </button>
                </div>
            </div>
        </div>
    );
}