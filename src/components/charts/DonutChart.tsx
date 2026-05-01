'use client';

import { motion } from 'framer-motion';

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
}

export default function DonutChart({ data, size = 200, thickness = 20 }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(63, 63, 70, 0.2)"
          strokeWidth={thickness}
        />
        {data.map((item, i) => {
          const percentage = (item.value / total) * 100;
          const strokeDashoffset = circumference - (circumference * percentage) / 100;
          const offset = (currentOffset / 100) * circumference;
          currentOffset += percentage;

          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={thickness}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: i * 0.1 }}
              style={{ strokeDashoffset: offset }} // This logic is slightly flawed for strokeDashoffset based segments, usually done with stroke-dasharray
              strokeDashoffset={strokeDashoffset}
              // Correct approach for offset in stroke circles:
              transform={`rotate(${(currentOffset - percentage) * 3.6} ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-4 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">{item.label}</span>
              <span className="text-xs font-bold text-zinc-100">${item.value.toFixed(0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
