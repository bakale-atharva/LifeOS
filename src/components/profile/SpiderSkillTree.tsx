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
    <div className="relative w-full h-[600px] bg-zinc-950/50 rounded-3xl border border-zinc-800 overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="absolute inset-0 p-20 overflow-auto scrollbar-hide">
        <div className="relative min-w-[2000px] h-full">
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {SKILL_TREE.map(node => {
              if (!node.parentId) return null;
              const parent = SKILL_TREE.find(n => n.id === node.parentId);
              if (!parent) return null;
              
              const unlocked = isUnlocked(node.id);
              const parentUnlocked = isUnlocked(parent.id);

              return (
                <line
                  key={`line-${node.id}`}
                  x1={parent.x + 48}
                  y1={parent.y + 48}
                  x2={node.x + 48}
                  y2={node.y + 48}
                  stroke={unlocked ? '#a855f7' : '#27272a'}
                  strokeWidth="2"
                  strokeDasharray={unlocked ? "0" : "5,5"}
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
                  opacity: parentUnlocked ? 1 : 0.2,
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
                    <svg className="absolute -inset-4 w-32 h-32 transform -rotate-90 pointer-events-none">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="transparent"
                        stroke="#a855f7"
                        strokeWidth="4"
                        strokeDasharray="364.4"
                        strokeDashoffset={364.4 - (364.4 * holdProgress) / 100}
                        className="transition-all duration-75"
                      />
                    </svg>
                  )}

                  <div className={cn(
                    "w-24 h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg cursor-pointer",
                    unlocked ? "bg-accent-purple/20 border-accent-purple shadow-accent-purple/20" :
                    unlockable ? "bg-zinc-900 border-zinc-700 hover:border-zinc-500" :
                    "bg-zinc-950 border-zinc-900 text-zinc-800"
                  )}>
                    {unlocked ? (
                      <Unlock className="w-8 h-8 text-accent-purple animate-pulse" />
                    ) : (
                      <Lock className="w-8 h-8" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-tighter text-zinc-500 group-hover:text-zinc-100 transition-colors">
                    {node.name}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Sidebar (Spiderman Style) */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-8 right-8 w-80 glass-card bg-zinc-900/90 border-accent-purple/30 p-8 rounded-3xl shadow-2xl z-50"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-accent-purple">{selectedNode.category}</div>
              <button onClick={() => setSelectedSkill(null)}><X className="w-4 h-4 text-zinc-500" /></button>
            </div>
            
            <h3 className="text-2xl font-black text-zinc-100 mb-2">{selectedNode.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">{selectedNode.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 uppercase font-bold tracking-widest">Status</span>
                <span className={cn("font-black uppercase", isUnlocked(selectedNode.id) ? "text-accent-green" : "text-red-500")}>
                  {isUnlocked(selectedNode.id) ? "Active" : "Locked"}
                </span>
              </div>
              
              {!isUnlocked(selectedNode.id) && (
                <div className="pt-4 border-t border-zinc-800">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest">Requirement</div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-100">1 Skill Point</span>
                    <div className={cn(
                      "px-2 py-1 rounded text-[8px] font-black uppercase",
                      (skillPoints[selectedNode.category] || 0) >= 1 ? "bg-accent-green/20 text-accent-green" : "bg-red-500/20 text-red-500"
                    )}>
                      {(skillPoints[selectedNode.category] || 0)} Available
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="text-[10px] text-zinc-500 font-bold uppercase animate-bounce">Hold to Acquire</div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-accent-purple" initial={{ width: 0 }} animate={{ width: `${holdProgress}%` }} />
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
