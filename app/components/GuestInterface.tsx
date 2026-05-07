"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, MessageSquare } from 'lucide-react';

interface GuestInterfaceProps {
  onSendMessage: (text: string) => void;
}

export function GuestInterface({ onSendMessage }: GuestInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcribedText, setTranscribedText] = React.useState('');
  const [isSupported, setIsSupported] = React.useState(true);
  
  // Referensi untuk menyimpan instance pengenal suara
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Inisialisasi Web Speech API saat komponen dimuat (Client-side only)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Merekam terus menerus selama ditahan
        recognition.interimResults = true; // Menampilkan hasil sementara secara real-time
        recognition.lang = 'id-ID'; // Menggunakan bahasa Indonesia

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscribedText(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const handleMicDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Mencegah perilaku default browser pada mobile
    if (!isSupported || !recognitionRef.current) return;

    setIsListening(true);
    setTranscribedText(''); // Bersihkan teks sebelumnya
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Abaikan error jika sudah berjalan
    }
  };

  const handleMicUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isSupported || !recognitionRef.current) return;

    setIsListening(false);
    recognitionRef.current.stop();

    // Jeda sedikit untuk memastikan hasil akhir teks tertangkap
    setTimeout(() => {
      setTranscribedText((finalText) => {
        if (finalText.trim()) {
          onSendMessage(finalText.trim());
        }
        return ''; // Reset teks di layar Guest setelah dikirim
      });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-white max-w-md mx-auto relative overflow-hidden select-none">
      {/* Header */}
      <header className="p-6 text-center border-b border-slate-100 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-black text-sky-500 font-heading">AuraKata</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Layar Tamu • Terhubung</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center scrollbar-hide overflow-y-auto">
        
        {!isSupported ? (
          <div className="bg-rose-50 text-rose-500 p-6 rounded-3xl border-2 border-rose-200 mb-8">
            <MicOff size={48} className="mx-auto mb-4 text-rose-400" />
            <h2 className="text-xl font-bold mb-2">Browser Tidak Mendukung</h2>
            <p className="text-sm">Gunakan Google Chrome atau Safari versi terbaru untuk menggunakan fitur suara.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {!isListening ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mb-12 w-full"
              >
                <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <MessageSquare className="text-sky-500" size={40} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4 font-heading leading-tight">
                  Tahan tombol untuk bicara
                </h2>
                <p className="text-slate-500 font-medium">
                  Suaramu akan muncul di layar Host dengan animasi sesuai intonasi!
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
                <div className="bg-sky-50 p-6 rounded-3xl border-4 border-sky-200 mb-8 min-h-[160px] flex items-center justify-center shadow-inner relative">
                  <p className="text-2xl font-black text-sky-700 italic tracking-tight">
                    "{transcribedText || 'Mendengarkan...'}"
                  </p>
                  
                  {/* Animasi Equalizer saat merekam */}
                  <div className="absolute bottom-4 flex justify-center items-center gap-1 opacity-50">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.5, 
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 bg-sky-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Microphone Button - 3D Push-to-Talk */}
        <div className="relative mt-auto mb-12">
          {/* Ripples Effect */}
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

          {/* Tombol dengan pencegahan Context Menu agar aman di Mobile */}
          <button
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            onPointerCancel={handleMicUp} // Berhenti merekam jika jari meleset keluar layar
            onContextMenu={(e) => e.preventDefault()} // MENCEGAH POP-UP KLIK KANAN DI MOBILE
            disabled={!isSupported}
            className={`w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all duration-100 ${
              isListening 
                ? 'bg-sky-500 translate-y-3 border-b-0 shadow-[0_0_40px_rgba(14,165,233,0.5)]' 
                : 'bg-sky-400 border-b-[12px] border-sky-600 shadow-xl hover:bg-sky-300'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            style={{ touchAction: 'none' }} // Mencegah scrolling browser saat menahan tombol
          >
            <Mic size={56} className="text-white" />
          </button>
        </div>
      </main>
    </div>
  );
}