"use client";

import * as React from 'react';
import { motion, Variants } from 'motion/react';
import { Sentiment } from '../types';

interface DynamicTextProps {
  text: string;
  sentiment?: Sentiment;
  className?: string;
}

export function DynamicText({ text, sentiment = 'neutral', className = '' }: DynamicTextProps) {
  const words = text.split(' ');

  // Animasi masuk awal (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Dipercepat sedikit agar terasa lebih responsif
      },
    },
  };

  // Objek Variants dengan properti function untuk menerima parameter 'idx'
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    // Efek gelombang mengalir (Wave Effect)
    happy: (idx: number) => ({
      y: [0, -12, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        delay: idx * 0.1, // Jeda per kata menciptakan efek gelombang
        ease: "easeInOut"
      }
    }),
    // Efek gemetar tajam layaknya orang marah
    angry: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        repeat: Infinity,
        duration: 0.3,
      }
    },
    // Efek memudar perlahan layaknya orang ragu/suara pelan
    doubt: {
      opacity: [1, 0.4, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    },
    // Efek miring dan bergetar cepat (terburu-buru)
    hurry: {
      skewX: -15,
      x: [0, 3, 0],
      transition: {
        repeat: Infinity,
        duration: 0.2,
      }
    },
    neutral: {
      y: 0,
    }
  };

  // Penyempurnaan tipografi agar perbedaan antar emosi sangat kontras
  const getSentimentStyles = () => {
    switch (sentiment) {
      case 'happy':
        return 'text-emerald-500 font-black tracking-wide';
      case 'angry':
        return 'text-rose-600 font-black italic uppercase tracking-tighter drop-shadow-sm';
      case 'doubt':
        return 'text-amber-500 font-bold tracking-widest opacity-90';
      case 'hurry':
        return 'text-[#006FFF] font-black italic tracking-tighter'; // Menggunakan warna biru cerah khas desain aplikasi Anda
      default:
        return 'text-slate-700 font-bold';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap gap-x-2 gap-y-1 ${getSentimentStyles()} ${className}`}
    >
      {words.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          custom={idx} // Melempar index ke variant agar animasi bisa berurutan
          variants={wordVariants as Variants}
          animate={['visible', sentiment]} // Menjalankan animasi masuk, lalu disambung animasi emosi
          className="inline-block origin-bottom" // Origin bottom agar saat miring (skew), pijakan bawahnya tetap rata
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}