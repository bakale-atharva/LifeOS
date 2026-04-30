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
      className={cn(
        "glass-card p-4 rounded-2xl border transition-all group relative",
        gear.isEquipped ? "border-accent-blue/50 bg-accent-blue/5" : "border-zinc-800"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-3 rounded-xl border",
          gear.isEquipped ? "bg-accent-blue/20 border-accent-blue/30 text-accent-blue" : "bg-zinc-950 border-zinc-800 text-zinc-500"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-zinc-100 truncate group-hover:text-accent-blue transition-colors cursor-pointer" onClick={() => onEdit(gear)}>
            {gear.name}
          </h4>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{gear.category}</p>
          
          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-accent-green">
            <Zap className="w-3 h-3" />
            SYNERGY: {gear.synergySkill} (+{gear.synergyBonus}%)
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onToggleEquip(gear.id, !gear.isEquipped)}
          className={cn(
            "flex-1 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all",
            gear.isEquipped 
              ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" 
              : "bg-accent-blue/10 text-accent-blue border border-accent-blue/20 hover:bg-accent-blue hover:text-white"
          )}
        >
          {gear.isEquipped ? 'Unequip' : 'Equip Gear'}
        </button>
      </div>
    </motion.div>
  );
}
