'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { SKILL_TREE, SkillNodeData } from '@/lib/skillTreeData';
import { cn } from '@/lib/utils';
import { Lock, Unlock, Sparkles, ChevronRight, Info } from 'lucide-react';

export default function SpiderSkillTree() {
  const { skillPoints, unlockedSkills, setProfile } = useStore();
  const [selectedNode, setSelectedSkill] = useState<SkillNodeData | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const isUnlocked = (id: string) => unlockedSkills.includes(id);
  const isUnlockable = (node: SkillNodeData) => {
    if (isUnlocked(node.id)) return false;
    if (!node.parentId) return true; // Root nodes are unlockable
    return isUnlocked(node.parentId);
  };

  const handleStartHold = (node: SkillNodeData) => {
    if (!isUnlockable(node) || (skillPoints[node.category] || 0) < 1) return;
    
    setSelectedSkill(node);
    let start = Date.now();
    holdTimer.current = setInterval(() => {
      let elapsed = Date.now() - start;
      let progress = Math.min(100, (elapsed / 1500) * 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        clearInterval(holdTimer.current!);
        unlockSkill(node);
      }
    }, 16);
  };

  const handleEndHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHoldProgress(0);
  };

  const unlockSkill = (node: SkillNodeData) => {
    const newUnlocked = [...unlockedSkills, node.id];
    const newPoints = { ...skillPoints, [node.category]: (skillPoints[node.category] || 0) - 1 };
    
    setProfile({
      unlockedSkills: newUnlocked,
      skillPoints: newPoints
    });
    setHoldProgress(0);
    // Play sound or show effect here
  };

  return (
    <div className="relative w-full h-[600px] bg-[#0B0B0B]/40 rounded-[40px] border border-white/[0.05] overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Connection Lines (SVG) */}
      <div className="absolute inset-0 p-20 overflow-auto cyber-scrollbar">
        <div className="relative min-w-[2000px] h-full">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {SKILL_TREE.map(node => {
              if (!node.parentId) return null;
              const parent = SKILL_TREE.find(n => n.id === node.parentId);
              if (!parent) return null;
              
              const unlocked = isUnlocked(node.id);
              return (
                <line
                  key={`line-${node.id}`}
                  x1={parent.x + 48}
                  y1={parent.y + 48}
                  x2={node.x + 48}
                  y2={node.y + 48}
                  stroke={unlocked ? '#6366F1' : '#1E293B'}
                  strokeWidth={unlocked ? "3" : "1"}
                  strokeDasharray={unlocked ? "0" : "4,4"}
                  className="transition-all duration-1000"
                />
              );
            })}
          </svg>

          {/* Skill Nodes */}
          {SKILL_TREE.map(node => {
            const unlocked = isUnlocked(node.id);
            const unlockable = isUnlockable(node);
            const parent = node.parentId ? SKILL_TREE.find(n => n.id === node.parentId) : null;
            const parentUnlocked = parent ? isUnlocked(parent.id) : true;

            return (
              <motion.div
                key={node.id}
                initial={false}
                animate={{
                  opacity: parentUnlocked ? 1 : 0.1,
                  scale: unlocked ? 1.1 : 1,
                }}
                className="absolute"
                style={{ left: node.x, top: node.y }}
              >
                <div 
                  className="relative group"
                  onMouseDown={() => handleStartHold(node)}
                  onMouseUp={handleEndHold}
                  onMouseLeave={handleEndHold}
                  onClick={() => setSelectedSkill(node)}
                >
                  {/* Progress Ring (Hold to Unlock) */}
                  {selectedNode?.id === node.id && holdProgress > 0 && (
                    <svg className="absolute -inset-6 w-40 h-40 transform -rotate-90 pointer-events-none z-20">
                      <circle
                        cx="80"
                        cy="80"
                        r="54"
                        fill="transparent"
                        stroke="#6366F1"
                        strokeWidth="4"
                        strokeDasharray="339.29"
                        strokeDashoffset={339.29 - (339.29 * holdProgress) / 100}
                        className="transition-all duration-75"
                      />
                    </svg>
                  )}

                  <div className={cn(
                    "w-24 h-24 rounded-[32px] border-2 flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10",
                    unlocked ? "bg-brand-primary border-brand-primary shadow-brand-primary/20" :
                    unlockable ? "bg-[#1E293B] border-white/[0.1] hover:border-brand-primary/50" :
                    "bg-[#0F172A] border-white/[0.02] text-zinc-800"
                  )}>
                    {unlocked ? (
                      <Unlock className="w-8 h-8 text-white animate-pulse" />
                    ) : (
                      <Lock className={cn("w-8 h-8 transition-colors", unlockable ? "text-zinc-400 group-hover:text-brand-primary" : "text-zinc-800")} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={cn(
                    "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                    unlocked ? "text-brand-primary" : "text-zinc-600 group-hover:text-zinc-300"
                  )}>
                    {node.name}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Sidebar */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-0 right-0 h-full w-[380px] glass-card border-l border-white/[0.05] bg-[#0B0B0B]/90 p-12 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary">{selectedNode.category.split(' ')[0]}</div>
              <button onClick={() => setSelectedSkill(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-zinc-500" /></button>
            </div>
            
            <h3 className="text-3xl font-black text-zinc-100 mb-4 tracking-tighter leading-tight">{selectedNode.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-12 font-medium">{selectedNode.description}</p>
            
            <div className="mt-auto space-y-6">
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Node Status</span>
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border", 
                  isUnlocked(selectedNode.id) ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-rose-400 border-rose-500/20 bg-rose-500/5")}>
                  {isUnlocked(selectedNode.id) ? "Operational" : "Offline"}
                </span>
              </div>
              
              {!isUnlocked(selectedNode.id) && (
                <div className="p-8 rounded-[32px] bg-brand-primary/[0.03] border border-brand-primary/20">
                  <div className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">Requirement: 01 Unit</div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-bold text-zinc-100 uppercase tracking-widest">Wallet</span>
                    <div className={cn(
                      "text-xs font-black px-3 py-1 rounded-lg",
                      (skillPoints[selectedNode.category] || 0) >= 1 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {(skillPoints[selectedNode.category] || 0)} Units Available
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em] animate-pulse">Long-press to initialize</div>
                    <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div className="h-full bg-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.6)]" initial={{ width: 0 }} animate={{ width: `${holdProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  );
}
