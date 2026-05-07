"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, MessageSquare, Volume2 } from 'lucide-react';
import { Message } from '../../types'; // Pastikan import Message

interface GuestInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function GuestInterface({ messages, onSendMessage }: GuestInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcribedText, setTranscribedText] = React.useState('');
  const [isSupported, setIsSupported] = React.useState(true);

  // State untuk melacak pesan mana yang sudah dibacakan
  const [lastReadMessageId, setLastReadMessageId] = React.useState<string | null>(null);

  const recognitionRef = React.useRef<any>(null);

  // Ambil pesan terakhir dari Host
  const lastHostMessage = [...messages].reverse().find(m => m.sender === 'host');

  // LOGIKA TEXT-TO-SPEECH (Membacakan balasan Tuli secara otomatis)
  React.useEffect(() => {
    if (lastHostMessage && lastHostMessage.id !== lastReadMessageId) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(lastHostMessage.text);
        utterance.lang = 'id-ID';

        // Sesuaikan nada/kecepatan suara robot berdasarkan 'Aura/Mood' dari Host!
        if (lastHostMessage.sentiment === 'hurry') {
          utterance.rate = 1.5; // Bicara cepat
        } else if (lastHostMessage.sentiment === 'angry') {
          utterance.pitch = 0.5; // Nada rendah/tegas
          utterance.rate = 1.2;
        } else if (lastHostMessage.sentiment === 'happy') {
          utterance.pitch = 1.5; // Nada tinggi/ceria
        }

        window.speechSynthesis.speak(utterance);
        setLastReadMessageId(lastHostMessage.id);
      }
    }
  }, [lastHostMessage, lastReadMessageId]);

  // Inisialisasi Mic (Tetap sama seperti sebelumnya)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscribedText(currentTranscript);
        };

        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const handleMicDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isSupported || !recognitionRef.current) return;
    setIsListening(true);
    setTranscribedText('');
    try { recognitionRef.current.start(); } catch (e) { }
  };

  const handleMicUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isSupported || !recognitionRef.current) return;
    setIsListening(false);
    recognitionRef.current.stop();
    setTimeout(() => {
      setTranscribedText((finalText) => {
        if (finalText.trim()) onSendMessage(finalText.trim());
        return '';
      });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto relative overflow-hidden select-none">
      <header className="p-6 text-center border-b border-slate-100 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-black text-sky-500 font-heading">AuraKata</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Layar Tamu</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center scrollbar-hide overflow-y-auto">

        {/* AREA BALASAN HOST (Tampil jika ada pesan dari Host) */}
        <AnimatePresence mode="wait">
          {lastHostMessage ? (
            <motion.div
              key="host-reply"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mb-8 w-full"
            >
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1">
                <Volume2 size={14} className="text-emerald-500" /> Balasan Host
              </p>
              <div className="bg-emerald-50 p-6 rounded-[2rem] border-4 border-emerald-200 shadow-sm relative">
                <p className="text-2xl font-black text-emerald-700 leading-tight">
                  "{lastHostMessage.text}"
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* AREA STATUS MIC & INSTRUKSI */}
        <AnimatePresence mode="wait">
          {!isListening ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full ${lastHostMessage ? 'mt-4' : 'mb-12'}`}
            >
              {!lastHostMessage && (
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-sky-500" size={32} />
                </div>
              )}
              <h2 className="text-xl font-extrabold text-slate-800 mb-2 font-heading">
                Giliranmu bicara
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Tahan tombol biru di bawah.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8 w-full mt-4"
            >
              <div className="bg-sky-50 p-4 rounded-3xl border-2 border-sky-200 min-h-[100px] flex items-center justify-center">
                <p className="text-xl font-bold text-sky-700 italic">
                  "{transcribedText || 'Mendengarkan...'}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOMBOL MIC */}
        <div className="relative mt-auto mb-8">
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-sky-400 rounded-full -z-10"
              />
            )}
          </AnimatePresence>

          <button
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            onPointerCancel={handleMicUp}
            onContextMenu={(e) => e.preventDefault()}
            disabled={!isSupported}
            className={`w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all duration-100 ${isListening
              ? 'bg-sky-500 translate-y-3 border-b-0 shadow-[0_0_40px_rgba(14,165,233,0.5)]'
              : 'bg-sky-400 border-b-[12px] border-sky-600 shadow-xl'
              }`}
            style={{ touchAction: 'none' }}
          >
            <Mic size={56} className="text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}