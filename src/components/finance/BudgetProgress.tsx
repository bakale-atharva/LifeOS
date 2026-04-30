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
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-sm font-bold text-zinc-100">{category}</h4>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
            ${spent.toFixed(2)} of ${limit.toFixed(2)}
          </p>
        </div>
        <div className={cn(
          "text-xs font-bold",
          isOver ? "text-red-500" : isWarning ? "text-yellow-500" : "text-accent-blue"
        )}>
          {Math.round(percentage)}%
        </div>
      </div>
      
      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
            isOver ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" : 
            isWarning ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]" : 
            "bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.4)]"
          )}
        />
      </div>
    </div>
  );
}
