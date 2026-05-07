"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Send, ChevronRight, LayoutGrid, Heart, Angry, Clock, HelpCircle } from 'lucide-react';
import { Message, Sentiment } from '../types';
import { DynamicText } from './DynamicText';

interface HostDashboardProps {
  messages: Message[];
  onReply: (text: string, sentiment: Sentiment) => void;
  openQR: () => void;
}

const SMART_TEMPLATES = [
  { text: "Berapa harganya?", icon: "💰" },
  { text: "Sama-sama!", icon: "😊" },
  { text: "Tunggu sebentar ya.", icon: "⏳" },
  { text: "OK, saya mengerti.", icon: "👍" },
];

const EMOTIONS: { label: Sentiment; icon: any; color: string }[] = [
  { label: 'happy', icon: Heart, color: 'bg-emerald-500' },
  { label: 'neutral', icon: Smile, color: 'bg-sky-500' },
  { label: 'angry', icon: Angry, color: 'bg-rose-500' },
  { label: 'doubt', icon: HelpCircle, color: 'bg-amber-400' },
  { label: 'hurry', icon: Clock, color: 'bg-slate-500' },
];

export function HostDashboard({ messages, onReply, openQR }: HostDashboardProps) {
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
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-2xl mx-auto shadow-sm border-x border-slate-200">
      {/* Header */}
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
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
          className="btn-3d-blue px-4 py-2 rounded-xl text-sm flex items-center gap-2"
        >
          Lihat QR
        </button>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.sender === 'host' ? 50 : -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={`flex flex-col ${msg.sender === 'host' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] px-6 py-4 rounded-[32px] shadow-sm relative overflow-visible ${
                  msg.sender === 'host' 
                    ? 'bg-emerald-500 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border-b-4 border-slate-200'
                }`}
              >
                {msg.sender === 'guest' ? (
                  <DynamicText 
                    text={msg.text} 
                    sentiment={msg.sentiment}
                    className="text-lg md:text-xl" 
                  />
                ) : (
                  <p className="text-lg font-bold font-heading">{msg.text}</p>
                )}
                
                {msg.sender === 'host' && msg.sentiment && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {EMOTIONS.find(e => e.label === msg.sentiment)?.icon && React.createElement(EMOTIONS.find(e => e.label === msg.sentiment)!.icon, { size: 16, className: "text-emerald-500" })}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest px-2">
                {msg.sender === 'guest' ? 'Suara Orang Dengar' : 'Balasan Anda'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-4">
        {/* Smart Templates */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SMART_TEMPLATES.map((tpl, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -2 }}
              whileTap={{ y: 2 }}
              onClick={() => {
                setInputText(tpl.text);
                setSelectedSentiment('happy');
              }}
              className="whitespace-nowrap px-4 py-2 bg-slate-100 border-b-4 border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">{tpl.icon}</span>
              {tpl.text}
            </motion.button>
          ))}
        </div>

        {/* Emotion Selector */}
        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border-4 border-slate-100">
          <div className="flex gap-2">
            {EMOTIONS.map((emo) => {
              const Icon = emo.icon;
              return (
                <button
                  key={emo.label}
                  onClick={() => setSelectedSentiment(emo.label)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    selectedSentiment === emo.label 
                      ? `${emo.color} text-white shadow-lg scale-110 -translate-y-1` 
                      : 'bg-white text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mr-2">Pilih Aura</p>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik balasan..."
            className="flex-1 bg-slate-100 border-none rounded-2xl p-4 font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`${inputText.trim() ? 'btn-3d-green' : 'btn-3d-gray'} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
