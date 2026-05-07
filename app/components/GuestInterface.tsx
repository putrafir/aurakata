"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, MessageSquare } from 'lucide-react';

interface GuestInterfaceProps {
  onSendMessage: (text: string) => void;
}

export function GuestInterface({ onSendMessage }: GuestInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcribedText, setTranscribedText] = React.useState('');

  const handleMicDown = () => {
    setIsListening(true);
    // Mock transcription starting
    const mockPhrases = [
      "Halo, apa kabar?",
      "Senang bertemu denganmu!",
      "Ayo kita pesan makan sekarang.",
      "Cuacanya bagus ya hari ini."
    ];
    const phrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
    setTranscribedText(phrase);
  };

  const handleMicUp = () => {
    if (isListening) {
      setIsListening(false);
      if (transcribedText) {
        onSendMessage(transcribedText);
        setTranscribedText('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-100 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-black text-sky-600 font-heading">AuraKata</h1>
        <p className="text-slate-400 text-sm font-medium">Guest Mode • Connected</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center scrollbar-hide overflow-y-auto">
        <AnimatePresence mode="wait">
          {!isListening ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-12"
            >
              <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="text-sky-500" size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 font-heading leading-tight">
                Tahan tombol untuk bicara
              </h2>
              <p className="text-slate-500 text-lg">
                Suaramu akan berubah jadi teks ajaib di layar Host!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12 w-full"
            >
              <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-200 mb-8 min-h-[120px] flex items-center justify-center">
                <p className="text-2xl font-bold text-sky-700 italic">
                  "{transcribedText || 'Mendengarkan...'}"
                </p>
              </div>
              <div className="flex justify-center items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: [16, 48, 16],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5, 
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                    className="w-2 bg-sky-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone Button */}
        <div className="relative mt-auto mb-12">
          {/* Ripples */}
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-sky-400 rounded-full -z-10"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 bg-sky-300 rounded-full -z-10"
                />
              </>
            )}
          </AnimatePresence>

          <motion.button
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, backgroundColor: '#0284c7' }}
            animate={isListening ? { scale: 1.2 } : { scale: 1 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-colors ${
              isListening ? 'bg-sky-600' : 'bg-sky-500'
            } border-b-8 border-sky-800`}
          >
            <Mic size={56} className="text-white" />
          </motion.button>
        </div>
      </main>

      <footer className="p-4 text-center">
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
          Transcribed by AuraKata AI
        </p>
      </footer>
    </div>
  );
}
