'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BudgetProgressProps {
  category: string;
  spent: number;
  limit: number;
}

export default function BudgetProgress({ category, spent, limit }: BudgetProgressProps) {
  const percentage = Math.min(100, (spent / limit) * 100);
  const isOver = spent > limit;
  const isWarning = percentage > 80;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <div>
          <h4 className="text-sm font-bold text-zinc-100 tracking-tight">{category}</h4>
          <p className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-1.5">
            <span className="text-zinc-300 font-black">${spent.toFixed(0)}</span> <span className="opacity-40">/</span> ${limit.toFixed(0)}
          </p>
        </div>
        <div className={cn(
          "text-[10px] font-black tracking-widest",
          isOver ? "text-rose-500" : isWarning ? "text-amber-500" : "text-brand-primary"
        )}>
          {Math.round(percentage)}%
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isOver ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]" : 
            isWarning ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" : 
            "bg-brand-primary shadow-[0_0_12px_rgba(99,102,241,0.5)]"
          )}
        />
      </div>
    </div>
  );
}
