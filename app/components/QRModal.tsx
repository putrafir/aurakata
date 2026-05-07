"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import QRCode from 'react-qr-code'; // <-- Menggunakan library QR Code asli

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  pin: string;
  fullUrl?: string; // <-- Menambahkan properti fullUrl dari page.tsx
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <div className="bg-sky-400 p-8 flex justify-center items-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-sky-300/50 rounded-full" />
                <div className="absolute bottom-[-10px] right-[-10px] w-16 h-16 bg-sky-300/50 rounded-full" />
                
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-white"
                >
                  <X size={20} />
                </button>

                {/* Render QR Code Asli */}
                <div className="bg-white p-4 rounded-3xl shadow-lg transform rotate-3 flex items-center justify-center">
                  {fullUrl ? (
                    <QRCode 
                      value={fullUrl} 
                      size={180} 
                      level="H" // Error correction level tinggi agar tetap bisa di-scan meski sudutnya miring
                      bgColor="#ffffff"
                      fgColor="#1e293b" // Menggunakan warna slate-800 agar senada dengan UI
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] bg-slate-200 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">
                      Memuat QR...
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 text-center bg-white">
                <h3 className="text-2xl font-bold text-slate-800 mb-2 font-heading">Siap Ngobrol?</h3>
                <p className="text-slate-500 mb-6">Minta Teman Dengar scan QR ini atau masukkan PIN:</p>
                
                <div className="flex justify-center gap-2 mb-8">
                  {pin.split('').map((char, i) => (
                    <div 
                      key={i} 
                      className="w-14 h-16 bg-slate-100 border-b-4 border-slate-300 rounded-2xl flex items-center justify-center text-3xl font-black text-sky-600 font-heading"
                    >
                      {char}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onClose}
                  className="w-full btn-3d-green py-4 rounded-2xl text-xl font-bold bg-green-500 text-white border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all"
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