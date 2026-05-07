"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HostDashboard } from './components/HostDashboard';
import { GuestInterface } from './components/GuestInterface';
import { QRModal } from './components/QRModal';
import { Message, Sentiment, AppState } from './types';
import { Sparkles, Users, MessageSquareText } from 'lucide-react';

export default function Home() {
  const [state, setState] = React.useState<AppState>({
    phase: 'init',
    role: 'host',
    roomPin: '8812',
  });

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Selamat datang di AuraKata.',
      sender: 'host',
      sentiment: 'happy',
      timestamp: Date.now() - 60000,
    },
    {
      id: '2',
      text: 'Bisa dengar saya bicara?',
      sender: 'guest',
      sentiment: 'neutral',
      timestamp: Date.now() - 30000,
    }
  ]);

  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);

  const handleGuestMessage = (text: string) => {
    let sentiment: Sentiment = 'neutral';
    if (text.toLowerCase().includes('senang') || text.toLowerCase().includes('bagus')) sentiment = 'happy';
    if (text.toLowerCase().includes('marah') || text.toLowerCase().includes('kesal')) sentiment = 'angry';
    if (text.toLowerCase().includes('?')) sentiment = 'doubt';
    if (text.toLowerCase().includes('cepat')) sentiment = 'hurry';

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender: 'guest',
      sentiment,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleHostReply = (text: string, sentiment: Sentiment) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      sender: 'host',
      sentiment,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-sky-500 rounded-[2rem] flex items-center justify-center shadow-xl border-b-8 border-sky-700 mb-8 rotate-3"
            >
              <Sparkles className="text-white" size={48} />
            </motion.div>

            <h1 className="text-5xl font-black text-slate-800 mb-2 font-heading leading-tight tracking-tight">
              AuraKata
            </h1>
            <p className="text-xl text-slate-500 mb-12 font-medium">Bicara jadi warna, teks jadi rasa.</p>

            <div className="w-full space-y-4">
              <button
                onClick={() => {
                  setState(prev => ({ ...prev, phase: 'chat', role: 'host' }));
                  setIsQRModalOpen(true);
                }}
                className="w-full btn-3d-green py-5 px-8 rounded-2xl flex items-center justify-center gap-3 text-xl group"
              >
                <MessageSquareText size={28} className="group-hover:scale-110 transition-transform" />
                SAYA HOST (TULI)
              </button>

              <button
                onClick={() => setState(prev => ({ ...prev, phase: 'chat', role: 'guest' }))}
                className="w-full btn-3d-blue py-5 px-8 rounded-2xl flex items-center justify-center gap-3 text-xl group"
              >
                <Users size={28} className="group-hover:scale-110 transition-transform" />
                SAYA TAMU (DENGAR)
              </button>
            </div>

            <p className="mt-12 text-sm text-slate-400 font-bold uppercase tracking-widest">
              Game-like Accessibility Experience
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="chat-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[100dvh]"
          >
            {state.role === 'host' ? (
              <HostDashboard 
                messages={messages} 
                onReply={handleHostReply} 
                openQR={() => setIsQRModalOpen(true)}
              />
            ) : (
              <GuestInterface onSendMessage={handleGuestMessage} />
            )}

            <div className="fixed bottom-4 left-4 z-50">
              <button 
                onClick={() => setState(prev => ({ ...prev, role: prev.role === 'host' ? 'guest' : 'host' }))}
                className="bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider"
              >
                <Users size={14} />
                Switch: {state.role === 'host' ? 'Guest' : 'Host'}
              </button>
            </div>
            
            <div className="fixed bottom-4 right-4 z-50">
              <button 
                onClick={() => setState(prev => ({ ...prev, phase: 'init' }))}
                className="bg-slate-200/80 backdrop-blur-sm text-slate-600 px-4 py-2 rounded-full hover:bg-slate-300 transition-all text-xs font-black uppercase tracking-wider"
              >
                Keluar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        pin={state.roomPin}
      />
    </div>
  );
}
