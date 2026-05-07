"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HostDashboard } from './components/HostDashboard';
import { GuestInterface } from './components/GuestInterface';
import { QRModal } from './components/QRModal';
import Image from 'next/image';
import { Message, Sentiment, AppState } from '../types';
import { Sparkles, Users, MessageSquareText, Settings } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';

export default function Home() {
  const [state, setState] = React.useState<AppState>({
    phase: 'init',
    role: 'host',
    roomPin: '',
  });

  const { messages, sendMessage, destroyRoom } = useRoom(state.phase === 'chat' ? state.roomPin : null);
  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);

  // STATE BARU: AI & Custom Templates
  const [smartTemplates, setSmartTemplates] = React.useState<string[]>([]);
  const [customTemplates, setCustomTemplates] = React.useState<string[]>([]);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = React.useState(false);
  const [newTemplateText, setNewTemplateText] = React.useState('');

  // 1. LOGIKA INISIASI & BACA QR CODE URL
  React.useEffect(() => {
    // Membaca localStorage untuk Custom Templates
    const savedTemplates = localStorage.getItem('aurakata_templates');
    if (savedTemplates) {
      setCustomTemplates(JSON.parse(savedTemplates));
    } else {
      setCustomTemplates(["Berapa totalnya?", "Bisa bicara lebih lambat?"]);
    }

    // Membaca URL Query (Jika Guest masuk dari scan QR Code)
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromUrl = urlParams.get('room');

    if (roomFromUrl) {
      setState({ phase: 'chat', role: 'guest', roomPin: roomFromUrl });
      // TODO: Panggil fungsi Firebase listener untuk roomFromUrl di sini
    }
  }, []);

  // 2. LOGIKA GENERATE ROOM & QR URL
  const handleCreateRoom = () => {
    // Generate 4 digit PIN acak
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setState({ phase: 'chat', role: 'host', roomPin: newPin });
    setIsQRModalOpen(true);

    // TODO: Inisialisasi Firebase Node `/rooms/${newPin}` di sini
  };

  // 3. LOGIKA GEMINI API (Rekomendasi Pintar)
  const generateSmartTemplates = async (chatHistory: Message[]) => {
    // Jangan panggil API jika chat masih kosong
    if (chatHistory.length === 0) return;

    try {
      // TODO: Ganti endpoint ini dengan Route API Next.js Anda (misal: /api/gemini)
      // fetch('/api/gemini', { method: 'POST', body: JSON.stringify({ messages: chatHistory }) })

      // Simulasi balasan Gemini API:
      console.log("Meminta Gemini menganalisis konteks percakapan...");
      setTimeout(() => {
        setSmartTemplates(["Ya, setuju!", "Saya kurang paham", "Bisa diulang?"]);
      }, 1000);
    } catch (error) {
      console.error("Gagal mendapatkan rekomendasi AI", error);
    }
  };

  // 4. LOGIKA PENGIRIMAN PESAN & FIREBASE SYNC
  // Di page.tsx bagian handleGuestMessage ubah parameternya:
  const handleGuestMessage = (text: string, sentiment: Sentiment) => {
    sendMessage({
      text,
      sender: 'guest',
      sentiment: sentiment, // Gunakan sentiment yang dipilih tamu
      timestamp: Date.now(),
    });
  };

  const handleHostReply = (text: string, sentiment: Sentiment) => {
    sendMessage({
      text,
      sender: 'host',
      sentiment,
      timestamp: Date.now(),
    });
  };



  // 5. LOGIKA CUSTOM TEMPLATE (Menyimpan ke localStorage)
  const saveNewCustomTemplate = () => {
    if (!newTemplateText.trim()) return;
    const updated = [...customTemplates, newTemplateText];
    setCustomTemplates(updated);
    localStorage.setItem('aurakata_templates', JSON.stringify(updated));
    setNewTemplateText('');
  };

  const fullQRUrl = typeof window !== 'undefined' ? `${window.location.origin}?room=${state.roomPin}` : '';

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state.phase === 'init' ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-8 text-center"
          >
            {/* ... Bagian UI Landing Page Tetap Sama ... */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 "
            >
              <Image
                src="/images/aurakata-logo.png"
                alt="Logo AuraKata"
                width={200}
                height={200}
                className="object-contain"
                priority // Tambahkan ini agar logo di-load pertama kali tanpa delay
              />
            </motion.div>

            <h1 className="text-5xl font-black text-slate-800 mb-2 font-heading leading-tight tracking-tight">
              AuraKata
            </h1>
            <p className="text-xl text-slate-500 mb-12 font-medium">Bicara jadi warna, teks jadi rasa.</p>

            <div className="w-full space-y-4">
              <button
                onClick={handleCreateRoom}
                className="w-full btn-3d-green py-5 px-8 rounded-2xl flex items-center justify-center gap-3 text-xl font-bold bg-green-500 text-white border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all group"
              >
                <MessageSquareText size={28} className="group-hover:scale-110 transition-transform" />
                BUAT OBROLAN (HOST)
              </button>
            </div>
            {/* ... */}
          </motion.div>
        ) : (
          <motion.div
            key="chat-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[100dvh]"
          >
            {state.role === 'host' ? (
              <div className="relative h-full">
                {/* Tombol Kelola Template (Pojok Kiri Atas) */}
                <button
                  onClick={() => setIsTemplateManagerOpen(true)}
                  className="absolute top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <Settings size={20} />
                </button>

                <HostDashboard
                  messages={messages}
                  onReply={handleHostReply}
                  openQR={() => setIsQRModalOpen(true)}
                  smartTemplates={smartTemplates}     // Passing state ke Component
                  customTemplates={customTemplates}   // Passing state ke Component
                />
              </div>
            ) : (
              <GuestInterface
                messages={messages}
                onSendMessage={handleGuestMessage}
              />
            )}

            {/* Tombol Keluar / Hancurkan Sesi */}
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => {
                  destroyRoom(); // Data obrolan langsung lenyap dari Firebase!
                  setState({ phase: 'init', role: 'host', roomPin: '' });
                  window.history.pushState({}, '', '/');
                }}
              // ... className tetap
              >
                Akhiri Sesi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal QR Code - Lempar URL Lengkap */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        pin={state.roomPin}
        fullUrl={fullQRUrl} // Component QRModal harus merender URL ini ke dalam gambar QR
      />

      {/* Modal Kelola Custom Template */}
      <AnimatePresence>
        {isTemplateManagerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Kelola Template</h2>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTemplateText}
                  onChange={(e) => setNewTemplateText(e.target.value)}
                  placeholder="Ketik kalimat sering dipakai..."
                  className="flex-1 px-4 py-3 bg-slate-100 rounded-xl border-2 border-slate-200 focus:border-sky-500 outline-none"
                />
                <button
                  onClick={saveNewCustomTemplate}
                  className="bg-sky-500 text-white font-bold px-4 rounded-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1"
                >
                  Simpan
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customTemplates.map((tpl, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">{tpl}</span>
                    <button
                      onClick={() => {
                        const updated = customTemplates.filter((_, i) => i !== idx);
                        setCustomTemplates(updated);
                        localStorage.setItem('aurakata_templates', JSON.stringify(updated));
                      }}
                      className="text-red-500 text-sm font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsTemplateManagerOpen(false)}
                className="w-full mt-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}