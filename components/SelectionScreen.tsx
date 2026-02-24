'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EXLLogo from './EXLLogo';
import { IndustryKey, CrisisKey, INDUSTRIES_META, CRISES_META } from '@/lib/types';

interface SelectionScreenProps {
  onSelect: (industry: IndustryKey, crisis: CrisisKey) => void;
}

type Step = 'industry' | 'crisis';

const INDUSTRY_KEYS: IndustryKey[] = ['financial', 'healthcare', 'retail', 'tech'];
const CRISIS_KEYS: CrisisKey[] = ['competitor', 'breach', 'market', 'product'];

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  const [step, setStep] = useState<Step>('industry');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey | null>(null);

  const handleIndustrySelect = (industry: IndustryKey) => {
    setSelectedIndustry(industry);
    setStep('crisis');
  };

  const handleCrisisSelect = (crisis: CrisisKey) => {
    if (selectedIndustry) {
      onSelect(selectedIndustry, crisis);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12"
    >
      <div className="max-w-2xl w-full">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <EXLLogo size="lg" />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-8">
          <p className="text-exl-orange font-mono text-xs tracking-[0.3em] uppercase mb-2">
            AI Comeback Simulation
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {step === 'industry' ? 'Choose Your Industry' : 'Choose Your Crisis'}
          </h1>
          <p className="text-white/50">
            {step === 'industry'
              ? 'Select the sector you will lead through transformation'
              : `Leading ${INDUSTRIES_META[selectedIndustry!].name} — now choose the crisis you must overcome`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'industry' && (
            <motion.div
              key="industry"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {INDUSTRY_KEYS.map((key, i) => {
                const meta = INDUSTRIES_META[key];
                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -4, boxShadow: '0 8px 30px rgba(242,101,34,0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleIndustrySelect(key)}
                    className="bg-surface border border-border rounded-xl p-5 text-left hover:border-exl-orange/50 transition-colors group"
                  >
                    <span className="text-3xl mb-3 block">{meta.icon}</span>
                    <h3 className="text-white font-bold text-lg group-hover:text-exl-orange transition-colors">
                      {meta.name}
                    </h3>
                    <p className="text-white/40 text-xs mt-1 font-mono uppercase tracking-wider">
                      Select &rarr;
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {step === 'crisis' && (
            <motion.div
              key="crisis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {CRISIS_KEYS.map((key, i) => {
                const meta = CRISES_META[key];
                return (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(242,101,34,0.15)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCrisisSelect(key)}
                    className="w-full bg-surface border border-border rounded-xl p-4 text-left hover:border-exl-orange/50 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{meta.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base group-hover:text-exl-orange transition-colors">
                          {meta.name}
                        </h3>
                        <p className="text-white/50 text-sm mt-1 leading-relaxed">
                          {meta.desc}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              <button
                onClick={() => { setStep('industry'); setSelectedIndustry(null); }}
                className="w-full text-center text-white/40 hover:text-white/60 text-sm transition-colors mt-4"
              >
                &larr; Change industry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
