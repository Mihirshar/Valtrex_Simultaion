'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archetype, ARCHETYPES } from '@/lib/archetypes';
import { useConfetti } from '@/lib/useConfetti';

interface ArchetypeRevealProps {
  archetype: Archetype;
  onComplete: () => void;
}

type RevealPhase = 
  | 'calculating' 
  | 'scanning' 
  | 'showing-archetypes' 
  | 'highlighting' 
  | 'stepping-forward'
  | 'final-reveal'
  | 'complete';

const PHASE_DURATIONS: Record<Exclude<RevealPhase, 'complete'>, number> = {
  calculating: 2000,
  scanning: 1500,
  'showing-archetypes': 1200,
  highlighting: 1000,
  'stepping-forward': 1500,
  'final-reveal': 2500,
};

export default function ArchetypeReveal({ archetype, onComplete }: ArchetypeRevealProps) {
  const [phase, setPhase] = useState<RevealPhase>('calculating');
  const [scanProgress, setScanProgress] = useState(0);
  const { fireArchetypeReveal, fireSideCanons } = useConfetti();

  useEffect(() => {
    if (phase === 'final-reveal') {
      fireArchetypeReveal(archetype.color);
      setTimeout(() => fireSideCanons(), 500);
    }
  }, [phase, archetype.color, fireArchetypeReveal, fireSideCanons]);

  useEffect(() => {
    const phases: RevealPhase[] = [
      'calculating', 'scanning', 'showing-archetypes', 
      'highlighting', 'stepping-forward', 'final-reveal', 'complete'
    ];
    let currentIndex = 0;

    const advancePhase = () => {
      currentIndex++;
      if (currentIndex < phases.length) {
        const nextPhase = phases[currentIndex];
        setPhase(nextPhase);
        if (nextPhase === 'complete') {
          setTimeout(onComplete, 300);
        } else {
          setTimeout(advancePhase, PHASE_DURATIONS[nextPhase]);
        }
      }
    };

    const initialTimeout = setTimeout(advancePhase, PHASE_DURATIONS.calculating);
    return () => clearTimeout(initialTimeout);
  }, [onComplete]);

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(p => Math.min(p + 5, 100));
      }, 70);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const isDominant = (a: Archetype) => a.id === archetype.id;

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
      <div className="max-w-5xl w-full">
        <AnimatePresence mode="wait">
          {phase === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div className="relative w-24 h-24 mx-auto mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-exl-orange/20"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-dashed border-exl-orange/30"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-5xl">{'\uD83E\uDDE0'}</span>
                </motion.div>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-exl-orange"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.12 }}
                    style={{
                      top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                      left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-bold text-white mb-2"
              >
                AI is calculating your leadership profile...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/50 text-sm"
              >
                Analyzing your strategic decisions
              </motion.p>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div className="relative w-28 h-28 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(242,101,34,0.2)" strokeWidth="6" />
                  <motion.circle
                    cx="56" cy="56" r="50" fill="none"
                    stroke="url(#scanGradient)" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={314}
                    animate={{ strokeDashoffset: 314 - (314 * scanProgress) / 100 }}
                    transition={{ duration: 0.1 }}
                  />
                  <defs>
                    <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F26522" />
                      <stop offset="100%" stopColor="#FF8C4B" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={scanProgress}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-exl-orange font-mono"
                  >
                    {scanProgress}%
                  </motion.span>
                </div>
              </motion.div>
              <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                Scanning Leadership Profile
              </h2>
              <p className="text-white/40 font-mono text-xs">
                {scanProgress < 40 ? 'Processing decision patterns...' : 
                 scanProgress < 70 ? 'Matching archetype signatures...' : 
                 'Finalizing analysis...'}
              </p>
            </motion.div>
          )}

          {phase !== 'calculating' && phase !== 'scanning' && phase !== 'complete' && (
            <motion.div
              key="archetypes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.p 
                  className="font-mono text-xs text-exl-orange tracking-[0.3em] uppercase mb-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Leadership Profile Identified
                </motion.p>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl md:text-2xl font-bold text-white"
                  >
                    {phase === 'showing-archetypes' && 'Analyzing 5 Leadership Profiles...'}
                    {phase === 'highlighting' && 'Match Found!'}
                    {phase === 'stepping-forward' && `${archetype.name}`}
                    {phase === 'final-reveal' && (
                      <>You are <span className="text-exl-orange">{archetype.name}</span></>
                    )}
                  </motion.h2>
                </AnimatePresence>
              </motion.div>

              <div className="relative flex justify-center items-end gap-2 md:gap-3 min-h-[200px] px-2 flex-wrap">
                {ARCHETYPES.map((a, index) => {
                  const isWinner = isDominant(a);
                  const phaseIndex = ['showing-archetypes', 'highlighting', 'stepping-forward', 'final-reveal'].indexOf(phase);
                  
                  const shouldHighlight = phaseIndex >= 1 && isWinner;
                  const shouldStepForward = phaseIndex >= 2 && isWinner;
                  const shouldDim = phaseIndex >= 1 && !isWinner;
                  const shouldMoveBack = phaseIndex >= 2 && !isWinner;

                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ 
                        opacity: shouldDim ? 0.35 : 1,
                        y: shouldStepForward ? -30 : shouldMoveBack ? 20 : 0,
                        scale: shouldStepForward ? 1.15 : shouldMoveBack ? 0.85 : 1,
                        filter: shouldDim ? 'grayscale(80%)' : 'grayscale(0%)',
                      }}
                      transition={{ 
                        delay: phase === 'showing-archetypes' ? index * 0.15 : 0,
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 150,
                      }}
                      className={`
                        relative p-3 md:p-4 rounded-xl border-2 text-center w-full max-w-[120px]
                        transition-colors duration-500
                        ${shouldHighlight 
                          ? 'bg-gradient-to-b from-exl-orange/20 to-background border-exl-orange' 
                          : 'bg-surface/80 border-border/50'
                        }
                      `}
                      style={{ zIndex: isWinner ? 10 : 1 }}
                    >
                      <motion.div
                        animate={shouldHighlight ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ repeat: shouldHighlight ? Infinity : 0, duration: 2 }}
                        className={`
                          w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full flex items-center justify-center
                          ${shouldHighlight 
                            ? 'bg-gradient-to-br from-exl-orange to-exl-orange-light shadow-[0_0_30px_rgba(242,101,34,0.6)]' 
                            : 'bg-surface'
                          }
                        `}
                      >
                        <span className="text-2xl md:text-3xl">{a.icon}</span>
                      </motion.div>

                      <h3 className={`font-bold text-xs md:text-sm mb-0.5 ${shouldHighlight ? 'text-white' : 'text-white/60'}`}>
                        {a.name.replace('The ', '')}
                      </h3>
                      
                      <p className={`text-[9px] md:text-[10px] leading-tight ${shouldHighlight ? 'text-exl-orange' : 'text-white/30'}`}>
                        {a.subtitle}
                      </p>

                      {shouldStepForward && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -inset-1 rounded-2xl bg-exl-orange/20 blur-xl -z-10"
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-3 left-1/2 -translate-x-1/2"
                          >
                            <span className="text-2xl">{'\uD83D\uDC51'}</span>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {phase === 'final-reveal' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-6 space-y-2"
                >
                  <p className="text-white/60 text-sm max-w-md mx-auto">
                    {archetype.diagnosis}
                  </p>
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-white/40 text-xs font-mono"
                  >
                    Preparing your detailed results...
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
