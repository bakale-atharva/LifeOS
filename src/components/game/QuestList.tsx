"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Skull, 
  Target, 
  Sword, 
  CheckCircle2, 
  AlertTriangle,
  ScrollText,
  ChevronDown
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

export function QuestList() {
  const { quests, setQuests, updateQuest, updateScore, addGold } = useGameStore();

  useEffect(() => {
    async function fetchQuests() {
      const response = await fetch("/api/quests");
      if (response.ok) {
        const data = await response.json();
        setQuests(data);
      }
    }
    fetchQuests();
  }, [setQuests]);

  const handleDealDamage = async (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    const dmg = 5; // Fixed damage per action for now
    const newHp = Math.max(0, quest.currentHp - dmg);
    
    try {
      const response = await fetch("/api/quests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, currentHp: newHp }),
      });

      if (response.ok) {
        const updated = await response.json();
        updateQuest(id, updated);
        
        // Reward gold for the hit
        addGold(10);

        if (newHp === 0) {
          // Trigger a global UI refresh of scores would be better, 
          // but for now the API handles profile updates
          const profileRes = await fetch("/api/profile");
          const profile = await profileRes.json();
          useGameStore.getState().syncProfile(profile);
        }
      }
    } catch (error) {
      console.error("Failed to update quest progress:", error);
    }
  };

  const activeQuests = quests.filter(q => q.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Active Encounters</h2>
      </div>

      {activeQuests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-muted-foreground font-medium italic">No active threats detected. Declare a new Boss Fight to begin.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {activeQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="game-card border-white/5 overflow-hidden">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Skull className="h-4 w-4 text-primary animate-pulse" />
                          <span className="text-[10px] font-black text-primary tracking-widest uppercase italic">Class: Boss</span>
                        </div>
                        <CardTitle className="text-2xl font-black italic tracking-tighter group-hover:text-primary transition-colors uppercase">
                          {quest.title}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-muted-foreground block uppercase">Reward</span>
                        <span className="text-sm font-mono font-black text-yellow-500 italic">+500G / +10 SR</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-2 space-y-6">
                    {/* HP Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-black tracking-widest uppercase italic text-primary/70">Health Points</span>
                        <span className="text-lg font-mono font-black tracking-tighter">{quest.currentHp} <span className="text-[10px] text-muted-foreground font-normal italic">/ {quest.totalHp} HP</span></span>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(quest.currentHp / quest.totalHp) * 100}%` }}
                          className="h-full bg-gradient-to-r from-red-600 via-red-400 to-primary shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between group">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">System Attack Pattern</p>
                        <p className="text-sm font-bold italic">{quest.dailyAction}</p>
                      </div>
                      <Button 
                        onClick={() => handleDealDamage(quest.id)}
                        className="bg-primary hover:bg-primary/80 text-primary-foreground font-black italic gap-2 group-hover:scale-105 transition-transform"
                      >
                        <Sword className="h-4 w-4" />
                        DEAL DAMAGE
                      </Button>
                    </div>

                    {/* GPS Details Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details" className="border-none">
                        <AccordionTrigger className="hover:no-underline py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                          Intelligence & Strategy
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase">
                                <ScrollText className="h-3 w-3" />
                                Encounter Lore
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed italic">{quest.description || "No lore provided."}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase">
                                <AlertTriangle className="h-3 w-3" />
                                System Curses (Anti-Goals)
                              </div>
                              <p className="text-xs text-red-400/80 leading-relaxed font-bold italic">{quest.antiGoals || "None."}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 pt-2">
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strategy Milestones</div>
                            <div className="grid gap-2">
                              {(quest.milestones as any[] || []).map((m, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                                  <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs font-medium italic">{m.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
