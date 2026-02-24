'use client';

import { motion } from 'framer-motion';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 py-6 md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4">
            The AI Strategy Boardroom
          </h1>
          <p className="text-white/60 text-sm md:text-lg font-mono">
            5-Level Interactive Decision Game
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-surface border border-border rounded-xl p-4 md:p-6 mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-ticker-gain animate-pulse" />
            <span className="font-mono text-white/50 text-[10px] md:text-sm uppercase tracking-widest">
              Your Mission
            </span>
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-ticker-gain animate-pulse" />
          </div>
          
          <p className="text-white/80 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
            You are the CEO guiding your company through <span className="text-exl-orange font-semibold">5 critical AI transformation decisions</span> across 12 months. Every choice you make will be immediately validated — or punished — by the market.
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-4 text-left">
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <div className="text-lg md:text-2xl mb-1 md:mb-2">📈</div>
              <p className="text-white/70 text-[10px] md:text-sm">
                <span className="text-ticker-gain font-semibold">Stock Ticker</span>
                <span className="hidden md:inline"> tracks your every move</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <div className="text-lg md:text-2xl mb-1 md:mb-2">⚡</div>
              <p className="text-white/70 text-[10px] md:text-sm">
                <span className="text-exl-orange font-semibold">5 Levels</span>
                <span className="hidden md:inline"> of strategic decisions</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-2 md:p-3 border border-white/10">
              <div className="text-lg md:text-2xl mb-1 md:mb-2">🎯</div>
              <p className="text-white/70 text-[10px] md:text-sm">
                <span className="text-ticker-volatile font-semibold">Final Verdict</span>
                <span className="hidden md:inline"> determines your legacy</span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-sm font-mono flex-wrap">
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-white/40">Start:</span>
              <span className="text-ticker-gain font-bold">$100.00</span>
            </div>
            <div className="w-px h-3 md:h-4 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-white/40">Timeline:</span>
              <span className="text-white/70">12 Months</span>
            </div>
            <div className="w-px h-3 md:h-4 bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-white/40">Decisions:</span>
              <span className="text-white/70">5 Critical</span>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          onClick={onStart}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
        >
          Enter the Boardroom
          <span className="ml-2 md:ml-3">→</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="mt-4 md:mt-6 text-white/30 text-[10px] md:text-xs font-mono"
        >
          Every choice has consequences. The Street is watching.
        </motion.p>
      </motion.div>
    </div>
  );
}
