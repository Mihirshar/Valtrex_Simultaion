'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StockState, ChoiceRecord } from '@/lib/types';
import { LEVELS } from '@/lib/gameData';

interface TickerSidebarProps {
  stockState: StockState;
  choiceRecords: ChoiceRecord[];
  currentLevelIndex: number;
}

function StockChart({ data, height = 140 }: { data: number[]; height?: number }) {
  if (data.length < 2) {
    return (
      <div 
        className="flex items-center justify-center bg-white/5 rounded-lg border border-white/10"
        style={{ height }}
      >
        <p className="text-white/30 text-[10px] font-mono">Awaiting market data...</p>
      </div>
    );
  }

  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  
  const padding = { top: 15, right: 8, bottom: 25, left: 40 };

  const points = data.map((value, index) => {
    const x = padding.left + (index / (data.length - 1)) * (100 - padding.left - padding.right);
    const y = padding.top + (height - padding.top - padding.bottom) - ((value - min) / range) * (height - padding.top - padding.bottom);
    return { x, y, value };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}`).join(' ');
  
  const lastPoint = points[points.length - 1];
  const isPositive = data[data.length - 1] >= data[0];
  const color = isPositive ? '#00FF88' : '#FF3B3B';

  const gridLines = [0, 0.5, 1].map(pct => {
    const y = padding.top + (height - padding.top - padding.bottom) * (1 - pct);
    const value = min + range * pct;
    return { y, value };
  });

  return (
    <svg width="100%" height={height} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <g key={i}>
          <line
            x1={`${padding.left}%`}
            y1={line.y}
            x2={`${100 - padding.right}%`}
            y2={line.y}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="2,4"
          />
          <text
            x={`${padding.left - 2}%`}
            y={line.y + 3}
            textAnchor="end"
            className="fill-white/40 text-[8px] font-mono"
          >
            ${line.value.toFixed(0)}
          </text>
        </g>
      ))}

      {/* Baseline at $100 */}
      <line
        x1={`${padding.left}%`}
        y1={padding.top + (height - padding.top - padding.bottom) - ((100 - min) / range) * (height - padding.top - padding.bottom)}
        x2={`${100 - padding.right}%`}
        y2={padding.top + (height - padding.top - padding.bottom) - ((100 - min) / range) * (height - padding.top - padding.bottom)}
        stroke="rgba(255,255,255,0.3)"
        strokeDasharray="4,4"
      />

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        vectorEffect="non-scaling-stroke"
      />

      {/* Data points */}
      {points.map((point, i) => (
        <motion.circle
          key={i}
          cx={`${point.x}%`}
          cy={point.y}
          r={i === points.length - 1 ? 4 : 2.5}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08 }}
        />
      ))}

      {/* Current price pulse */}
      <circle
        cx={`${lastPoint.x}%`}
        cy={lastPoint.y}
        r="6"
        fill={color}
        opacity="0.3"
      >
        <animate
          attributeName="r"
          values="6;10;6"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

function MarketSentiment({ price }: { price: number }) {
  const change = ((price - 100) / 100) * 100;
  
  let sentiment: { label: string; color: string; icon: string };
  if (change >= 20) {
    sentiment = { label: 'EUPHORIC', color: '#00FF88', icon: '🚀' };
  } else if (change >= 10) {
    sentiment = { label: 'BULLISH', color: '#00FF88', icon: '📈' };
  } else if (change >= 0) {
    sentiment = { label: 'CAUTIOUS', color: '#FFB800', icon: '📊' };
  } else if (change >= -10) {
    sentiment = { label: 'NERVOUS', color: '#FFB800', icon: '😰' };
  } else {
    sentiment = { label: 'PANIC', color: '#FF3B3B', icon: '📉' };
  }

  return (
    <div className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-base md:text-lg">{sentiment.icon}</span>
        <div>
          <p className="text-white/50 text-[8px] md:text-[9px] font-mono uppercase">Sentiment</p>
          <p className="font-mono text-xs md:text-sm font-bold" style={{ color: sentiment.color }}>
            {sentiment.label}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white/50 text-[8px] md:text-[9px] font-mono">vs $100</p>
        <p 
          className="font-mono text-xs md:text-sm font-bold"
          style={{ color: change >= 0 ? '#00FF88' : '#FF3B3B' }}
        >
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}

export default function TickerSidebar({ stockState, choiceRecords, currentLevelIndex }: TickerSidebarProps) {
  const tickerColors = {
    gain: { text: 'text-ticker-gain', bg: 'bg-ticker-gain/10', icon: '🟢', color: '#00FF88' },
    loss: { text: 'text-ticker-loss', bg: 'bg-ticker-loss/10', icon: '🔴', color: '#FF3B3B' },
    volatile: { text: 'text-ticker-volatile', bg: 'bg-ticker-volatile/10', icon: '🟡', color: '#FFB800' },
  };

  return (
    <div className="h-full w-full flex flex-col p-2 md:p-3 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-ticker-gain"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono text-xs md:text-sm font-bold text-white">EXLS</span>
          <span className="text-white/40 text-[10px] font-mono">NYSE</span>
        </div>
        <span className="text-white/30 text-[9px] font-mono">LIVE</span>
      </div>

      {/* Current Price - Compact */}
      <div className="mb-2 md:mb-3 p-2 md:p-3 bg-surface rounded-lg border border-border">
        <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1">Current Price</p>
        <div className="flex items-end justify-between">
          <motion.p
            key={stockState.price}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-mono text-xl md:text-2xl font-bold text-white"
          >
            ${stockState.price.toFixed(2)}
          </motion.p>
          <div className={`
            px-1.5 md:px-2 py-0.5 md:py-1 rounded font-mono text-[10px] md:text-xs font-bold
            ${stockState.change >= 0 ? 'bg-ticker-gain/20 text-ticker-gain' : 'bg-ticker-loss/20 text-ticker-loss'}
          `}>
            {stockState.change >= 0 ? '▲' : '▼'} {stockState.change >= 0 ? '+' : ''}{stockState.changePercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart - Responsive height */}
      <div className="mb-2 md:mb-3">
        <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1">Price History</p>
        <div className="bg-surface rounded-lg border border-border p-1.5 md:p-2">
          <StockChart data={stockState.history} height={100} />
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="mb-2 md:mb-3">
        <MarketSentiment price={stockState.price} />
      </div>

      {/* Decision History - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <p className="text-white/50 text-[9px] font-mono uppercase tracking-wider mb-1.5">
          Decisions ({choiceRecords.length}/5)
        </p>
        
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          <AnimatePresence>
            {choiceRecords.map((record, index) => {
              const level = LEVELS[index];
              const tc = tickerColors[record.tickerResult.type];

              return (
                <motion.div
                  key={record.level}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-2 rounded-lg border ${tc.bg} border-white/10`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs flex-shrink-0">{tc.icon}</span>
                      <div className="min-w-0">
                        <p className="text-white text-[10px] md:text-xs font-medium truncate">
                          L{level.id}: {level.title}
                        </p>
                        <p className="text-white/50 text-[9px] font-mono truncate">
                          {record.choiceLabel}
                        </p>
                      </div>
                    </div>
                    <p className={`font-mono text-[10px] md:text-xs font-bold flex-shrink-0 ${tc.text}`}>
                      {record.tickerResult.percent >= 0 ? '+' : ''}{record.tickerResult.percent.toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-white/40 text-[9px] italic leading-tight mt-1 line-clamp-2">
                    &ldquo;{record.tickerResult.analystNote}&rdquo;
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pending levels - Compact */}
          {Array.from({ length: 5 - choiceRecords.length }).map((_, i) => {
            const levelIndex = choiceRecords.length + i;
            const level = LEVELS[levelIndex];
            const isCurrent = levelIndex === currentLevelIndex;

            return (
              <div
                key={`pending-${levelIndex}`}
                className={`
                  p-2 rounded-lg border border-dashed
                  ${isCurrent ? 'border-exl-orange/40 bg-exl-orange/5' : 'border-white/10 bg-white/5'}
                `}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs opacity-40">⏳</span>
                  <div className="min-w-0">
                    <p className={`text-[10px] md:text-xs font-medium truncate ${isCurrent ? 'text-exl-orange' : 'text-white/40'}`}>
                      L{level.id}: {level.title}
                    </p>
                    <p className="text-white/30 text-[9px] font-mono">
                      {isCurrent ? 'In Progress' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 mt-2 border-t border-white/10">
        <p className="text-white/20 text-[8px] text-center font-mono">
          Real-time market simulation
        </p>
      </div>
    </div>
  );
}
