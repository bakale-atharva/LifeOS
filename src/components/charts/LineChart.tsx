'use client';

import { motion } from 'framer-motion';

interface LineChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  width?: number;
}

export default function LineChart({ data, labels, color = "#10B981", height = 150, width = 300 }: LineChartProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Horizontal Grid Lines */}
        {[0, 0.5, 1].map((p) => (
          <line
            key={p}
            x1="0"
            y1={height * p}
            x2={width}
            y2={height * p}
            stroke="rgba(63, 63, 70, 0.2)"
            strokeWidth="1"
          />
        ))}

        {/* The Line */}
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
        />

        {/* Gradient Fill under the line */}
        <path
          d={`M 0,${height} ${points} L ${width},${height} Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          className="opacity-20"
        />

        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Data Points */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((val - min) / range) * height;
          return (
            <motion.circle
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
            />
          );
        })}
      </svg>
      
      <div className="flex justify-between mt-4">
        {labels.map((label, i) => (
          <span key={i} className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
