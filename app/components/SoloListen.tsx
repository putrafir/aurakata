"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, MicOff, Waves, Smile, Angry, Clock, Heart, HelpCircle } from 'lucide-react';
import { DynamicText } from './DynamicText';
import { Sentiment } from '../../types';

interface SoloListenProps {
    onExit: () => void;
}

// Mapping Emosi berdasarkan Volume
// 1. Pastikan Heart dan HelpCircle ikut di-import

// 2. Pastikan array ini punya 5 emosi lengkap
const EMOTIONS: { label: Sentiment; icon: any; color: string }[] = [
    { label: 'happy', icon: Heart, color: 'text-emerald-500' },
    { label: 'neutral', icon: Smile, color: 'text-sky-500' },
    { label: 'doubt', icon: HelpCircle, color: 'text-amber-400' },
    { label: 'hurry', icon: Clock, color: 'text-amber-500' },
    { label: 'angry', icon: Angry, color: 'text-rose-500' },
];

export function SoloListen({ onExit }: SoloListenProps) {
    const [isListening, setIsListening] = React.useState(false);
    const [transcripts, setTranscripts] = React.useState<{ id: string; text: string; sentiment: Sentiment }[]>([]);
    const [interimText, setInterimText] = React.useState(''); // Teks sementara sebelum jeda napas

    const recognitionRef = React.useRef<any>(null);
    const isIntentionalStopRef = React.useRef(false); // Penjaga nyawa mic
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Sensor Volume (Web Audio API)
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const analyserRef = React.useRef<AnalyserNode | null>(null);
    const maxVolumeRef = React.useRef<number>(0); // Mencatat volume tertinggi dalam 1 kalimat
    const animationFrameRef = React.useRef<number>(0);
    const ambientVolumeRef = React.useRef<number>(20);
    const sentenceBufferRef = React.useRef<string>('');
    const silenceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-scroll ke bawah saat ada teks baru
    React.useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [transcripts, interimText]);

    // Fungsi mengukur volume secara real-time
    const measureVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;


        if (average < ambientVolumeRef.current + 15) {
            ambientVolumeRef.current = (ambientVolumeRef.current * 0.95) + (average * 0.05);
        }

        if (average > maxVolumeRef.current) {
            maxVolumeRef.current = average;
        }

        animationFrameRef.current = requestAnimationFrame(measureVolume);
    };

    const startListening = async () => {
        setIsListening(true);
        isIntentionalStopRef.current = false;
        maxVolumeRef.current = 0; // Reset sensor volume

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: false,
                    noiseSuppression: false,
                    echoCancellation: true
                }
            });
            const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            measureVolume();

            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Browser ini tidak mendukung Web Speech API. Gunakan Google Chrome.");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'id-ID';

            recognition.onresult = (event: any) => {
                let currentInterim = '';
                let newFinalWords = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        newFinalWords += event.results[i][0].transcript + ' ';
                    } else {
                        currentInterim += event.results[i][0].transcript;
                    }
                }

                if (newFinalWords.trim().length > 0) {
                    sentenceBufferRef.current += newFinalWords;
                }

                const fullTypingText = sentenceBufferRef.current + currentInterim;
                setInterimText(fullTypingText);

                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

                silenceTimerRef.current = setTimeout(() => {
                    const finalCompleteSentence = sentenceBufferRef.current.trim();

                    if (finalCompleteSentence.length > 0) {
                        const currentVol = maxVolumeRef.current;
                        const ambient = ambientVolumeRef.current;
                        const messageId = Date.now().toString();

                        setTranscripts(prev => [...prev, {
                            id: messageId,
                            text: finalCompleteSentence,
                            sentiment: 'neutral'
                        }]);

                        // 2. Kosongkan Karung & Reset Sensor
                        sentenceBufferRef.current = '';
                        setInterimText('');
                        maxVolumeRef.current = 0;

                        // 3. Tembak AI Python dengan SATU KALIMAT UTUH
                        (async () => {
                            try {
                                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: finalCompleteSentence })
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    let nlpSentiment = data.sentiment;
                                    const relativeLoudness = currentVol - ambient;

                                    console.log(`🎤 Teks Utuh: "${finalCompleteSentence}" | 🚀 LONJAKAN: ${relativeLoudness.toFixed(1)} | 🧠 NLP: ${nlpSentiment}`);

                                    let finalSentiment: Sentiment = 'neutral';

                                    if (relativeLoudness > 85) {
                                        finalSentiment = nlpSentiment === 'happy' ? 'happy' : 'angry';
                                    } else if (relativeLoudness > 65) {
                                        if (nlpSentiment === 'happy') finalSentiment = 'happy';
                                        else if (nlpSentiment === 'angry') finalSentiment = 'angry';
                                        else finalSentiment = 'hurry';
                                    } else {
                                        if (relativeLoudness < 15) {
                                            finalSentiment = 'doubt';
                                        } else if (nlpSentiment === 'angry') {
                                            finalSentiment = 'neutral';
                                        } else {
                                            finalSentiment = nlpSentiment as Sentiment;
                                        }
                                    }

                                    setTranscripts(prev => prev.map(msg =>
                                        msg.id === messageId ? { ...msg, sentiment: finalSentiment } : msg
                                    ));
                                }
                            } catch (error) {
                                console.error("Gagal menghubungi Microservice NLP:", error);
                            }
                        })();
                    }
                }, 1200); // 1.2 detik adalah waktu jeda napas yang paling natural
            };

            recognition.onend = () => {
                // PENJAGA NYAWA: Kalau mati sendiri, langsung nyalakan lagi!
                if (!isIntentionalStopRef.current) {
                    recognition.start();
                }
            };

            recognitionRef.current = recognition;
            recognition.start();

        } catch (err) {
            console.error("Gagal memulai mikrofon:", err);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        setIsListening(false);
        isIntentionalStopRef.current = true; // Tandai bahwa user yang sengaja mematikan

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        cancelAnimationFrame(animationFrameRef.current);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        sentenceBufferRef.current = '';
        setInterimText('');
    };

    const toggleListen = () => {
        isListening ? stopListening() : startListening();
    };

    // Bersihkan memori saat keluar halaman
    React.useEffect(() => {
        return () => {
            stopListening();
        };
    }, []);

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 max-w-2xl mx-auto shadow-sm border-x border-slate-200 relative">
            {/* HEADER: Desain Konsisten dengan HostDashboard */}
            <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-black text-slate-800 text-sm tracking-tight leading-none mb-1">Mendengarkan Saja</h2>
                        <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-1">
                            {isListening && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />}
                            {isListening ? 'Sistem Aktif' : 'Standby'}
                        </p>
                    </div>
                </div>
            </header>

            {/* AREA TEKS */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-40">
                <AnimatePresence initial={false}>
                    {transcripts.length === 0 && !interimText && !isListening && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                            <Waves size={48} className="mb-4 text-orange-400" />
                            <p className="font-bold text-center px-8">Taruh HP di meja, tekan tombol mic,<br />dan biarkan sistem mencatat semua obrolan.</p>
                        </div>
                    )}

                    {/* Render Bubble Kalimat yang Sudah Selesai (Final) */}
                    {transcripts.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="flex flex-col items-start"
                        >
                            <div className="flex items-center gap-1 mb-1 ml-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    Lingkungan
                                </span>
                            </div>

                            <div className="max-w-[85%] px-6 py-4 bg-white text-slate-800 rounded-[32px] rounded-tl-none shadow-sm border-b-4 border-slate-200 relative overflow-visible">
                                <DynamicText text={msg.text} sentiment={msg.sentiment} className="text-lg md:text-xl font-bold" />

                                {/* Ikon Emosi (Membaca Volume) */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce border-2 border-slate-100">
                                    {React.createElement(EMOTIONS.find(e => e.label === msg.sentiment)?.icon || Smile, {
                                        size: 16,
                                        className: EMOTIONS.find(e => e.label === msg.sentiment)?.color
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Render Bubble Teks yang Sedang Diketik (Real-time) */}
                    {interimText && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-start opacity-70"
                        >
                            <div className="max-w-[85%] px-6 py-4 bg-slate-100 text-slate-500 rounded-[32px] rounded-tl-none shadow-inner border-2 border-slate-200 border-dashed">
                                <p className="text-lg md:text-xl font-bold italic">{interimText}</p>
                                <div className="flex gap-1 mt-2">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TOMBOL MIC BESAR DI BAWAH */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
                <div className="relative">
                    {isListening && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-orange-500 rounded-full -z-10"
                        />
                    )}
                    <button
                        onClick={toggleListen}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white border-b-8 active:border-b-0 active:translate-y-2 transition-all shadow-xl ${isListening ? 'bg-orange-500 border-orange-700' : 'bg-slate-300 border-slate-400 text-slate-500'
                            }`}
                    >
                        {isListening ? <Mic size={32} /> : <MicOff size={32} />}
                    </button>
                </div>
            </div>
        </div>
    );
}