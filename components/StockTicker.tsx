'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { StockState } from '@/lib/types';

interface StockTickerProps {
  stockState: StockState;
  onFlash?: (type: 'gain' | 'loss' | 'volatile') => void;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const width = 80;
  const height = 24;
  const padding = 2;
  
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="opacity-60">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <motion.circle
        cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
        cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
        r="3"
        fill={color}
        animate={{
          r: [3, 4, 3],
          opacity: [1, 0.7, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
}

export default function StockTicker({ stockState, onFlash }: StockTickerProps) {
  const [showFlash, setShowFlash] = useState(false);
  const [flashType, setFlashType] = useState<'gain' | 'loss' | 'volatile'>('gain');
  const [displayPrice, setDisplayPrice] = useState(stockState.price);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPriceRef = useRef(stockState.price);

  useEffect(() => {
    if (stockState.price !== prevPriceRef.current) {
      const change = stockState.price - prevPriceRef.current;
      const type = change > 0 ? 'gain' : change < 0 ? 'loss' : 'volatile';
      
      setFlashType(type);
      setShowFlash(true);
      setIsAnimating(true);
      
      if (onFlash) {
        onFlash(type);
      }

      const startPrice = prevPriceRef.current;
      const endPrice = stockState.price;
      const duration = 1500;
      const startTime = Date.now();

      const animatePrice = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentPrice = startPrice + (endPrice - startPrice) * eased;
        setDisplayPrice(currentPrice);

        if (progress < 1) {
          requestAnimationFrame(animatePrice);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animatePrice);
      prevPriceRef.current = stockState.price;

      const flashTimer = setTimeout(() => setShowFlash(false), 2000);
      return () => clearTimeout(flashTimer);
    }
  }, [stockState.price, onFlash]);

  const isPositive = stockState.change >= 0;
  const color = flashType === 'gain' ? '#00FF88' : flashType === 'loss' ? '#FF3B3B' : '#FFB800';
  const colorClass = flashType === 'gain' ? 'text-ticker-gain' : flashType === 'loss' ? 'text-ticker-loss' : 'text-ticker-volatile';

  return (
    <div className="relative">
      {/* Flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 70%)`,
              boxShadow: `inset 0 0 20px ${color}30`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-2 md:gap-4 px-2 md:px-3 py-1.5 md:py-2 bg-surface/80 backdrop-blur-sm border border-border rounded-lg">
        {/* Ticker Symbol */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <motion.div
            className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
            style={{ backgroundColor: color }}
            animate={{
              boxShadow: [
                `0 0 2px ${color}`,
                `0 0 8px ${color}`,
                `0 0 2px ${color}`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-xs md:text-sm font-bold text-white">EXLS</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 md:gap-3">
          <motion.div
            className="text-right"
            animate={isAnimating ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className="font-mono text-base md:text-xl font-bold text-white"
              style={{ textShadow: showFlash ? `0 0 10px ${color}` : 'none' }}
            >
              ${displayPrice.toFixed(2)}
            </motion.p>
          </motion.div>

          {/* Change indicator */}
          <motion.div
            className={`flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 rounded font-mono text-[10px] md:text-xs font-bold ${
              flashType === 'gain' ? 'bg-ticker-gain/20' : 
              flashType === 'loss' ? 'bg-ticker-loss/20' : 
              'bg-ticker-volatile/20'
            } ${colorClass}`}
            animate={showFlash ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <span>{isPositive ? '▲' : '▼'}</span>
            <span>{isPositive ? '+' : ''}{stockState.changePercent.toFixed(1)}%</span>
          </motion.div>
        </div>

        {/* Sparkline - Hidden on very small screens */}
        <div className="hidden sm:block">
          <Sparkline data={stockState.history} color={color} />
        </div>
      </div>
    </div>
  );
}
