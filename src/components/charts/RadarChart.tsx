'use client';

import { motion } from 'framer-motion';

interface RadarChartProps {
  data: Record<string, number>;
  maxValue?: number;
  size?: number;
}

export default function RadarChart({ data, maxValue = 10, size = 200 }: RadarChartProps) {
  const categories = Object.keys(data);
  const numCategories = categories.length;
  const center = size / 2;
  const radius = (size / 2) * 0.8;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numCategories - Math.PI / 2;
    const distance = (value / maxValue) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  // Generate background polygons (grid)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map((level) => {
    return categories
      .map((_, i) => {
        const coords = getCoordinates(i, maxValue * level);
        return `${coords.x},${coords.y}`;
      })
      .join(' ');
  });

  // Generate data polygon
  const dataPoints = categories.map((cat, i) => {
    const coords = getCoordinates(i, data[cat]);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="transparent"
            stroke="rgba(63, 63, 70, 0.5)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {categories.map((_, i) => {
          const coords = getCoordinates(i, maxValue);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke="rgba(63, 63, 70, 0.5)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          points={dataPoints}
          fill="rgba(168, 85, 247, 0.2)"
          stroke="#a855f7"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        />

        {/* Labels */}
        {categories.map((cat, i) => {
          const coords = getCoordinates(i, maxValue * 1.2);
          return (
            <text
              key={i}
              x={coords.x}
              y={coords.y}
              textAnchor="middle"
              className="text-[8px] font-black uppercase tracking-widest fill-zinc-500"
            >
              {cat.split(' ').map((word, j) => (
                <tspan key={j} x={coords.x} dy={j === 0 ? 0 : 10}>{word}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
