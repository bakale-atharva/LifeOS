"use client";

import { useGameStore } from "@/store/useGameStore";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Zap, Shield, Swords, Brain } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { level, overallScore, gold } = useGameStore();

  return (
    <nav className="border-b bg-background/40 backdrop-blur-xl sticky top-0 z-50 overflow-hidden">
      {/* HUD line animation */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-4 group cursor-help"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-primary/40 transition-all" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary shadow-[0_0_15px_oklch(0.65_0.2_260_/_0.3)]">
                <span className="font-mono text-xl font-black text-primary italic">L{level}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-primary/70 uppercase">Soul Rating</span>
                <span className="text-xs font-mono font-bold">{overallScore}/100</span>
              </div>
              <div className="relative h-2 w-40 bg-secondary rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallScore}%` }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_8px_oklch(0.65_0.2_260_/_0.5)]"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-8 pr-4">
            <StatItem icon={Coins} value={gold} label="GOLD" color="text-yellow-400" />
            <StatItem icon={Zap} value="100" label="ENRG" color="text-cyan-400" />
          </div>
          
          <div className="h-10 w-[1px] bg-border mx-2" />
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 group hover:bg-primary/20 transition-all cursor-pointer">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-primary italic leading-none">RANK</span>
              <span className="text-sm font-black tracking-tighter">PATHFINDER</span>
            </div>
            <Shield className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function StatItem({ icon: Icon, value, label, color }: any) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
        <span className="text-sm font-mono font-black tracking-tighter">{value}</span>
      </div>
      <span className="text-[9px] font-bold text-muted-foreground tracking-widest">{label}</span>
    </div>
  );
}
