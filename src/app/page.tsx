"use client";

import { useGameStore } from "@/store/useGameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Swords, 
  Timer, 
  HeartPulse, 
  Users, 
  Wallet,
  Zap,
  ChevronRight,
  Flame
} from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  const { 
    goalsScore, 
    timeScore, 
    healthScore, 
    relationScore, 
    financeScore,
    overallScore,
    level 
  } = useGameStore();

  const areas = [
    { name: "Combat", label: "Goals", score: goalsScore, icon: Swords, color: "text-red-400", shadow: "shadow-red-500/20" },
    { name: "Alchemy", label: "Time", score: timeScore, icon: Timer, color: "text-blue-400", shadow: "shadow-blue-500/20" },
    { name: "Vitality", label: "Health", score: healthScore, icon: HeartPulse, color: "text-green-400", shadow: "shadow-green-500/20" },
    { name: "Charisma", label: "Social", score: relationScore, icon: Users, color: "text-purple-400", shadow: "shadow-purple-500/20" },
    { name: "Wealth", label: "Finance", score: financeScore, icon: Wallet, color: "text-yellow-400", shadow: "shadow-yellow-500/20" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Flame className="h-40 w-40 text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">Player Status: Online</h2>
            <h1 className="text-4xl font-black tracking-tighter italic">WELCOME BACK, OPERATOR.</h1>
            <p className="text-muted-foreground font-medium max-w-md">Your system is operating at {(overallScore/100 * 100).toFixed(1)}% efficiency. Several quests require your attention.</p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global SR</p>
              <p className="text-3xl font-mono font-black text-primary italic">{overallScore}<span className="text-xs text-muted-foreground not-italic">/100</span></p>
            </div>
            <div className="h-12 w-[1px] bg-white/10" />
            <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-black italic shadow-[0_0_20px_rgba(var(--primary),0.4)]">
              LEVEL {level}
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {areas.map((area) => (
          <motion.div key={area.name} variants={item}>
            <Card className="game-card group cursor-pointer border-white/5">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{area.label}</p>
                      <h3 className="text-xl font-black tracking-tight italic group-hover:text-primary transition-colors">{area.name}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-secondary border border-white/5 shadow-inner ${area.shadow} transition-all group-hover:-translate-y-1`}>
                      <area.icon className={`h-6 w-6 ${area.color}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-3xl font-mono font-black tracking-tighter">{area.score}</span>
                      <span className="text-[10px] font-bold text-muted-foreground mb-1">STABILITY</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${area.score}%` }}
                        className={`h-full ${area.color.replace('text', 'bg')} opacity-80`}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 px-6 py-3 flex items-center justify-between group-hover:bg-primary/5 transition-colors">
                  <span className="text-[10px] font-bold tracking-widest uppercase">View Module</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Special Activity Card */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
          <Card className="h-full bg-primary relative overflow-hidden group cursor-pointer border-none shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
              <Zap className="h-32 w-32 text-black" />
            </div>
            
            <CardContent className="relative z-10 p-8 flex flex-col h-full justify-between gap-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-black italic leading-none tracking-tighter">DAILY OVERDRIVE</h3>
                <p className="text-black/70 text-xs font-bold font-mono">X2 MULTIPLIER ACTIVE</p>
              </div>
              <button className="w-fit bg-black text-white px-6 py-2 rounded-full text-xs font-black italic tracking-widest hover:scale-105 transition-transform">
                START QUEST
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
