"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Send, LayoutGrid, Heart, Angry, Clock, HelpCircle, Sparkles, User } from 'lucide-react';
import { Message, Sentiment } from '../../types';
import { DynamicText } from './DynamicText';

interface HostDashboardProps {
  messages: Message[];
  onReply: (text: string, sentiment: Sentiment) => void;
  openQR: () => void;
  smartTemplates: string[];
  customTemplates: string[];
}

const EMOTIONS: { label: Sentiment; icon: any; color: string }[] = [
  { label: 'happy', icon: Heart, color: 'bg-emerald-500' },
  { label: 'neutral', icon: Smile, color: 'bg-sky-500' },
  { label: 'angry', icon: Angry, color: 'bg-rose-500' },
  { label: 'doubt', icon: HelpCircle, color: 'bg-amber-400' },
  { label: 'hurry', icon: Clock, color: 'bg-slate-500' },
];

export function HostDashboard({ messages, onReply, openQR, smartTemplates, customTemplates }: HostDashboardProps) {
  const [inputText, setInputText] = React.useState('');
  const [selectedSentiment, setSelectedSentiment] = React.useState<Sentiment>('neutral');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onReply(inputText, selectedSentiment);
      setInputText('');
      setSelectedSentiment('neutral');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-2xl mx-auto shadow-sm border-x border-slate-200 pt-16 md:pt-0">
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 ml-12 md:ml-0">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <LayoutGrid className="text-emerald-500" size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 font-heading">Layar Host</h2>
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Sesi Aktif</p>
          </div>
        </div>
        <button
          onClick={openQR}
          className="btn-3d-blue px-4 py-2 rounded-xl text-sm flex items-center gap-2 font-bold bg-[#006FFF] text-white border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          Lihat QR
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-8 scroll-smooth pb-8">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
              <Sparkles size={48} className="mb-4" />
              <p className="font-bold">Ruangan siap! Menunggu pesan...</p>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'host' ? 50 : -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`flex flex-col ${msg.sender === 'host' ? 'items-end' : 'items-start'}`}
            >
              {/* Nama Pengirim untuk Guest */}
              {msg.sender === 'guest' && (
                <div className="flex items-center gap-1 mb-1 ml-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: msg.senderColor || '#94a3b8' }}
                  />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {msg.senderName || 'Tamu'}
                  </span>
                </div>
              )}

              <div
                className={`max-w-[85%] px-6 py-4 rounded-[32px] shadow-sm relative overflow-visible ${msg.sender === 'host'
                  ? 'bg-emerald-500 text-white rounded-tr-none border-b-4 border-emerald-700'
                  : 'bg-white text-slate-800 rounded-tl-none border-b-4 border-slate-200'
                  }`}
              >
                <DynamicText
                  text={msg.text}
                  sentiment={msg.sentiment}
                  className={`text-lg md:text-xl font-bold ${msg.sender === 'host' ? '!text-white drop-shadow-md' : ''}`}
                />

                {msg.sentiment && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce border-2 border-slate-100">
                    {React.createElement(EMOTIONS.find(e => e.label === msg.sentiment)?.icon || Smile, {
                      size: 16,
                      className: msg.sender === 'host' ? "text-emerald-500" : "text-sky-500"
                    })}
                  </div>
                )}
              </div>

              <span className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-widest px-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t-2 border-slate-200 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-30">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {smartTemplates.length > 0 && smartTemplates.map((text, i) => (
            <motion.button
              key={`ai-${i}`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              onClick={() => setInputText(text)}
              className="whitespace-nowrap px-4 py-2 bg-amber-50 border-b-4 border-amber-200 rounded-full font-bold text-amber-700 flex items-center gap-2 shadow-sm"
            >
              <Sparkles size={16} className="text-amber-500" />
              {text}
            </motion.button>
          ))}

          {customTemplates.map((text, i) => (
            <motion.button
              key={`custom-${i}`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              onClick={() => setInputText(text)}
              className="whitespace-nowrap px-4 py-2 bg-slate-100 border-b-4 border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-200 flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">📌</span>
              {text}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border-2 border-slate-100">
          <div className="flex gap-2">
            {EMOTIONS.map((emo) => {
              const Icon = emo.icon;
              return (
                <button
                  key={emo.label}
                  onClick={() => setSelectedSentiment(emo.label)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedSentiment === emo.label
                    ? `${emo.color} text-white shadow-lg scale-110 -translate-y-1 font-bold`
                    : 'bg-white text-slate-400 hover:text-slate-600 border-b-2 border-slate-200'
                    }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Pilih Aura</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik balasan..."
            className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-emerald-400 focus:bg-white transition-all placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`${inputText.trim()
              ? 'bg-emerald-500 text-white border-b-8 border-emerald-700 active:border-b-0 active:translate-y-2'
              : 'bg-slate-200 text-slate-400 border-b-8 border-slate-300'
              } w-16 h-16 rounded-2xl flex items-center justify-center transition-all`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}