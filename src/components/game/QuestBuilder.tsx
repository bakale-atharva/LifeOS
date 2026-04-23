"use client";

import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, Map, Settings2, Plus, Skull } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function QuestBuilder() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("goal");
  const addQuest = useGameStore((state) => state.addQuest);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    antiGoals: "",
    milestones: [{ title: "", completed: false }],
    preMortem: "",
    dailyAction: "",
    totalHp: 100,
    type: "BOSS"
  });

  const handleAddMilestone = () => {
    setFormData({
      ...formData,
      milestones: [...formData.milestones, { title: "", completed: false }]
    });
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index].title = value;
    setFormData({ ...formData, milestones: newMilestones });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newQuest = await response.json();
        addQuest(newQuest);
        setOpen(false);
        // Reset form
        setFormData({
          title: "",
          description: "",
          antiGoals: "",
          milestones: [{ title: "", completed: false }],
          preMortem: "",
          dailyAction: "",
          totalHp: 100,
          type: "BOSS"
        });
      }
    } catch (error) {
      console.error("Failed to create quest:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-primary hover:bg-primary/80 text-primary-foreground font-black italic tracking-widest gap-2">
          <Plus className="h-4 w-4" />
          DECLARE BOSS FIGHT
        </Button>
      } />
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <Skull className="h-6 w-6 text-primary" />
            WAR ROOM: ENCOUNTER INITIALIZATION
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} onValueChange={setStep} className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="goal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold italic">[G] GOAL</TabsTrigger>
            <TabsTrigger value="plan" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold italic">[P] PLAN</TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold italic">[S] SYSTEM</TabsTrigger>
          </TabsList>

          <div className="mt-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === "goal" && (
                <motion.div
                  key="goal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Target Designation</Label>
                    <Input 
                      placeholder="e.g., Master the Next.js Arts" 
                      className="bg-secondary/50 font-bold"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Lore / Intrinsic Motivation</Label>
                    <Textarea 
                      placeholder="Why must you defeat this foe? What is at stake?" 
                      className="bg-secondary/50 min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Curses / Anti-Goals</Label>
                    <Input 
                      placeholder="Boundaries you will NOT cross (e.g., No Sunday work)" 
                      className="bg-secondary/50 border-red-500/20"
                      value={formData.antiGoals}
                      onChange={(e) => setFormData({...formData, antiGoals: e.target.value})}
                    />
                  </div>
                  <Button onClick={() => setStep("plan")} className="w-full mt-4 font-black italic uppercase tracking-widest">Next: Strategy Mapping</Button>
                </motion.div>
              )}

              {step === "plan" && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">The Strategy (Milestones)</Label>
                    <div className="space-y-2">
                      {formData.milestones.map((m, idx) => (
                        <Input 
                          key={idx}
                          placeholder={`Milestone ${idx + 1}`} 
                          className="bg-secondary/50"
                          value={m.title}
                          onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                        />
                      ))}
                      <Button variant="outline" size="sm" onClick={handleAddMilestone} className="w-full border-dashed">
                        + ADD MILESTONE
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Pre-Mortem (Failure Analysis)</Label>
                    <Textarea 
                      placeholder="Imagine you failed 90 days from now. Why did it happen? How will you prevent it?" 
                      className="bg-secondary/50 min-h-[100px]"
                      value={formData.preMortem}
                      onChange={(e) => setFormData({...formData, preMortem: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep("goal")} className="flex-1 font-black italic uppercase tracking-widest">Back</Button>
                    <Button onClick={() => setStep("system")} className="flex-[2] font-black italic uppercase tracking-widest">Next: Arming System</Button>
                  </div>
                </motion.div>
              )}

              {step === "system" && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Daily Attack Pattern (The System)</Label>
                    <Input 
                      placeholder="e.g., Code for 2 hours every morning" 
                      className="bg-secondary/50 font-bold"
                      value={formData.dailyAction}
                      onChange={(e) => setFormData({...formData, dailyAction: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black tracking-widest uppercase text-primary">Total Encounter HP (Effort Units)</Label>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number"
                        className="bg-secondary/50 w-24 font-mono text-xl"
                        value={formData.totalHp}
                        onChange={(e) => setFormData({...formData, totalHp: parseInt(e.target.value)})}
                      />
                      <span className="text-xs text-muted-foreground font-medium italic">Higher HP means a longer, tougher boss fight with more rewards.</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mt-8">
                    <h4 className="text-xs font-black text-primary uppercase mb-2">Encounter Preview</h4>
                    <p className="text-sm font-medium italic">"Defeat {formData.title || 'the target'} by performing '{formData.dailyAction || 'daily actions'}' until {formData.totalHp} HP is depleted."</p>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setStep("plan")} className="flex-1 font-black italic uppercase tracking-widest">Back</Button>
                    <Button onClick={handleSubmit} className="flex-[2] bg-primary text-primary-foreground font-black italic uppercase tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.4)]">ENGAGE TARGET</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
