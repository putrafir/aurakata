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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    happy: {
      y: [0, -15, 0],
      rotate: [0, -5, 5, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.6,
          ease: "easeOut"
        },
        rotate: {
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut"
        }
      }
    },
    angry: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        repeat: Infinity,
        duration: 0.1,
      }
    },
    doubt: {
      opacity: [1, 0.5, 1],
      scale: [1, 0.98, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
      }
    },
    hurry: {
      skewX: [-10, -10],
      x: [0, 5, 0],
      transition: {
        repeat: Infinity,
        duration: 0.2,
      }
    },
    neutral: {
      y: 0,
    }
  };

  const getSentimentStyles = () => {
    switch (sentiment) {
      case 'happy':
        return 'text-emerald-600 font-extrabold';
      case 'angry':
        return 'text-rose-600 font-bold italic uppercase tracking-tighter';
      case 'doubt':
        return 'text-amber-500 font-medium';
      case 'hurry':
        return 'text-sky-600 font-black italic';
      default:
        return 'text-slate-700 font-semibold';
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
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            },
            ...wordVariants
          }}
          animate={['visible', sentiment]}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
