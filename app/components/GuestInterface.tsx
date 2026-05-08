"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Send, Smile, Heart, Angry, Clock, HelpCircle, MessageCircle } from 'lucide-react';
import { Message, Sentiment } from '../../types';
import { DynamicText } from './DynamicText';

interface GuestInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string, sentiment: Sentiment) => void;
  currentGuestName?: string; // Prop baru untuk membedakan "Saya" vs "Tamu Lain"
}

const EMOTIONS: { label: Sentiment; icon: any; color: string }[] = [
  { label: 'happy', icon: Heart, color: 'bg-emerald-500' },
  { label: 'neutral', icon: Smile, color: 'bg-sky-500' },
  { label: 'angry', icon: Angry, color: 'bg-rose-500' },
  { label: 'doubt', icon: HelpCircle, color: 'bg-amber-400' },
  { label: 'hurry', icon: Clock, color: 'bg-slate-500' },
];

export function GuestInterface({ messages, onSendMessage, currentGuestName }: GuestInterfaceProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const [selectedSentiment, setSelectedSentiment] = React.useState<Sentiment>('neutral');
  const [isSupported, setIsSupported] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);

  // Text-To-Speech: Melacak pesan terakhir Host agar bisa dibacakan
  const [lastReadMessageId, setLastReadMessageId] = React.useState<string | null>(null);
  const lastHostMessage = [...messages].reverse().find(m => m.sender === 'host');

  React.useEffect(() => {
    if (lastHostMessage && lastHostMessage.id !== lastReadMessageId) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(lastHostMessage.text);
        utterance.lang = 'id-ID';

        // Modifikasi intonasi suara robot sesuai Aura/Mood!
        if (lastHostMessage.sentiment === 'hurry') utterance.rate = 1.5;
        else if (lastHostMessage.sentiment === 'angry') { utterance.pitch = 0.5; utterance.rate = 1.2; }
        else if (lastHostMessage.sentiment === 'happy') utterance.pitch = 1.5;

        window.speechSynthesis.speak(utterance);
        setLastReadMessageId(lastHostMessage.id);
      }
    }
  }, [lastHostMessage, lastReadMessageId]);

  // Auto-scroll chat
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Web Speech API Setup
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';
        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setInputText(current);
        };
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
      }
    }
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText, selectedSentiment);
      setInputText('');
      setSelectedSentiment('neutral');
    }
  };

  const handleMicDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isSupported || !recognitionRef.current) return;
    setIsListening(true);
    try { recognitionRef.current.start(); } catch (e) { }
  };

  const handleMicUp = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsListening(false);
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-2xl mx-auto shadow-sm border-x border-slate-200">
      {/* Header */}
      <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center">
            <MessageCircle className="text-sky-500" size={20} />
          </div>
          <div>
            <h2 className="font-black text-slate-800 font-heading text-sm">Layar Tamu</h2>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Login sbg: {currentGuestName}</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            // Logika Pembagian 3 Kondisi Pengguna
            const isHost = msg.sender === 'host';
            const isMe = msg.sender === 'guest' && msg.senderName === currentGuestName;
            const isOtherGuest = msg.sender === 'guest' && !isMe;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMe ? 50 : -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Tampilkan Label Nama Jika Itu Adalah Tamu Lain */}
                {isOtherGuest && (
                  <div className="flex items-center gap-1 mb-1 ml-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: msg.senderColor || '#94a3b8' }}
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {msg.senderName}
                    </span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] px-6 py-4 rounded-[32px] shadow-sm relative ${isMe
                    ? 'bg-sky-500 text-white rounded-tr-none border-b-4 border-sky-700'
                    : isOtherGuest
                      ? 'bg-slate-200 text-slate-800 rounded-tl-none border-b-4 border-slate-300'
                      : 'bg-white text-slate-800 rounded-tl-none border-b-4 border-slate-200'
                    }`}
                >
                  <DynamicText
                    text={msg.text}
                    sentiment={msg.sentiment}
                    className={`text-lg md:text-xl font-bold ${isMe ? '!text-white' : ''}`}
                  />

                  {msg.sentiment && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100">
                      {React.createElement(EMOTIONS.find(e => e.label === msg.sentiment)?.icon || Smile, {
                        size: 12,
                        className: isMe ? 'text-sky-500' : isOtherGuest ? 'text-slate-500' : 'text-emerald-500'
                      })}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-widest px-2">
                  {isHost ? 'Balasan Host' : isMe ? 'Suara Anda' : `Suara ${msg.senderName}`}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Area Kontrol Bawah (Input & Mic) - Tetap Sama */}
      <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto p-4 bg-white border-t-2 border-slate-200 space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40">

        {/* Emotion Selector */}
        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl border-2 border-slate-100">
          <div className="flex gap-2">
            {EMOTIONS.map((emo) => {
              const Icon = emo.icon;
              return (
                <button
                  key={emo.label}
                  onClick={() => setSelectedSentiment(emo.label)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${selectedSentiment === emo.label
                    ? `${emo.color} text-white shadow-lg -translate-y-1`
                    : 'bg-white text-slate-400 border-b-2 border-slate-200'
                    }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Pilih Aura Anda</p>
        </div>

        {/* Input & Mic Area */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {isListening && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 1.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 bg-sky-400 rounded-2xl -z-10"
              />
            )}
            <button
              onPointerDown={handleMicDown}
              onPointerUp={handleMicUp}
              onPointerCancel={handleMicUp}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-sky-600 translate-y-1 border-b-0' : 'bg-sky-500 border-b-4 border-sky-700'
                } text-white`}
            >
              <Mic size={24} />
            </button>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Mendengarkan..." : "Bicara atau ketik..."}
            className="flex-1 bg-slate-100 border-2 border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-sky-400 focus:bg-white transition-all"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`${inputText.trim() ? 'bg-emerald-500 border-emerald-700' : 'bg-slate-200 border-slate-300'
              } w-14 h-14 rounded-2xl flex items-center justify-center text-white border-b-4 active:border-b-0 active:translate-y-1 transition-all`}
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}