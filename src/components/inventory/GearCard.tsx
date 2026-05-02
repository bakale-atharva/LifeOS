'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Shield, Cpu, Dumbbell, Package, Zap } from 'lucide-react';

interface Gear {
  id: string;
  name: string;
  category: string;
  isEquipped: boolean;
  synergySkill: string;
  synergyBonus: number;
}

interface GearCardProps {
  gear: Gear;
  onToggleEquip: (id: string, isEquipped: boolean) => void;
  onEdit: (gear: Gear) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Tech: Cpu,
  Fitness: Dumbbell,
  Utility: Package,
  Other: Zap
};

export default function GearCard({ gear, onToggleEquip, onEdit }: GearCardProps) {
  const Icon = CATEGORY_ICONS[gear.category] || Zap;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-card p-6 rounded-[28px] border transition-all group relative overflow-hidden",
        gear.isEquipped ? "border-brand-primary/40 bg-brand-primary/[0.03] shadow-lg shadow-brand-primary/5" : "border-white/[0.05]"
      )}
    >
      <div className="flex items-start gap-5">
        <div className={cn(
          "p-4 rounded-2xl border transition-colors duration-500",
          gear.isEquipped ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" : "bg-white/[0.02] border-white/[0.05] text-zinc-500"
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-zinc-100 truncate group-hover:text-brand-primary transition-colors cursor-pointer tracking-tight" onClick={() => onEdit(gear)}>
            {gear.name}
          </h4>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mt-0.5">{gear.category}</p>
          
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-emerald-400/20" />
            Synergy: {gear.synergySkill} <span className="text-white">+{gear.synergyBonus}%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onToggleEquip(gear.id, !gear.isEquipped)}
          className={cn(
            "flex-1 py-3 rounded-[16px] font-bold text-[10px] uppercase tracking-[0.2em] transition-all",
            gear.isEquipped 
              ? "bg-white/[0.03] text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300" 
              : "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {gear.isEquipped ? 'Unequip Unit' : 'Initialize Link'}
        </button>
      </div>
      
      {/* Visual Accent */}
      {gear.isEquipped && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      )}
    </motion.div>
  );
}
