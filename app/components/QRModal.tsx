"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import QRCode from 'react-qr-code';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: string;
  fullUrl?: string;
}

export function QRModal({ isOpen, onClose, pin, fullUrl = "" }: QRModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[20px] md:rounded-[32px] w-[95%] sm:max-w-sm md:max-w-md overflow-hidden shadow-2xl relative"
            >
              {/* Bagian Atas - Area QR & Instruksi */}
              <div className="bg-sky-400 p-4 pt-10 sm:p-6 sm:pt-12 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative circles - Diperkecil di mobile */}
                <div className="absolute top-[-20px] left-[-20px] w-16 h-16 sm:w-24 sm:h-24 bg-sky-300/50 rounded-full" />
                <div className="absolute bottom-[-10px] right-[-10px] w-12 h-12 sm:w-16 sm:h-16 bg-sky-300/50 rounded-full" />
                
                <button 
                  onClick={onClose}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-white z-20"
                >
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Speech Bubble Instruksi */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 mb-4 sm:mb-5 bg-white text-slate-800 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-xl w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] text-center"
                >
                  <p className="font-bold text-[13px] sm:text-sm md:text-base leading-snug">
                    "Halo! 👋 Maaf, saya Teman Tuli.
                    <br />
                    <span className="text-sky-500">Scan QR ini</span> untuk ngobrol yuk!"
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rotate-45 rounded-sm" />
                </motion.div>

                {/* Render QR Code */}
                <div className="bg-white p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-lg transform rotate-2 md:rotate-3 flex items-center justify-center relative z-10 w-[130px] sm:w-[160px]">
                  {fullUrl ? (
                    <QRCode 
                      value={fullUrl} 
                      size={256} // Value besar, tapi di-scale oleh width container
                      level="H" 
                      bgColor="#ffffff"
                      fgColor="#1e293b" 
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  ) : (
                    <div className="w-full aspect-square bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400 text-xs sm:text-sm font-bold">
                      Memuat...
                    </div>
                  )}
                </div>
              </div>

              {/* Bagian Bawah - Area PIN */}
              <div className="p-4 sm:p-6 md:p-8 text-center bg-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-1 sm:mb-1.5 md:mb-2 font-heading">
                  Siap Ngobrol?
                </h3>
                <p className="text-[13px] sm:text-sm md:text-base text-slate-500 mb-4 sm:mb-5 md:mb-6 leading-tight">
                  Atau masukkan PIN ini di perangkat Anda:
                </p>
                
                {/* Kotak PIN sangat diperkecil ukurannya untuk layar HP 320px */}
                <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mb-5 sm:mb-6 md:mb-8">
                  {pin.split('').map((char, i) => (
                    <div 
                      key={i} 
                      className="w-9 h-11 sm:w-12 sm:h-14 md:w-14 md:h-16 bg-slate-100 border-b-[3px] sm:border-b-4 border-slate-300 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black text-sky-600 font-heading"
                    >
                      {char}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onClose}
                  className="w-full btn-3d-green py-3 sm:py-3.5 md:py-4 rounded-xl md:rounded-2xl text-base sm:text-lg md:text-xl font-bold bg-green-500 text-white border-b-4 sm:border-b-[6px] md:border-b-8 border-green-700 active:border-b-0 active:translate-y-1 sm:active:translate-y-2 transition-all"
                >
                  OK, GAS!
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}