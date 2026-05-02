'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Swords, Plus, Loader2, Sparkles, X, Target, Trophy, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';

interface Quest {
  id: string;
  title: string;
  description: string;
  rewardCategory: string;
  rewardPoints: number;
  isBossFight: boolean;
  completed: boolean;
}

const CATEGORIES = ['Engineering', 'Physical Fitness', 'Content Creation', 'Mental Fortitude'];

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    rewardCategory: 'Engineering',
    rewardPoints: 1,
    isBossFight: false
  });

  const { addXP, skillPoints, setProfile } = useStore();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const data = await getDocuments('quests');
      setQuests(data as Quest[]);
    } catch (error) {
      console.error("Error fetching quests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuest = async () => {
    if (!newQuest.title) return;
    try {
      await addDocument('quests', { ...newQuest, completed: false });
      setIsAdding(false);
      setNewQuest({ title: '', description: '', rewardCategory: 'Engineering', rewardPoints: 1, isBossFight: false });
      fetchQuests();
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  const completeQuest = async (quest: Quest) => {
    if (quest.completed) return;

    try {
      // 1. Update Quest Status
      await updateDocument('quests', quest.id, { completed: true });
      
      // 2. Award XP (+500 for Boss, +100 for normal)
      const xpReward = quest.isBossFight ? 500 : 100;
      addXP(xpReward);

      // 3. Award Skill Point
      const currentPoints = skillPoints[quest.rewardCategory] || 0;
      setProfile({
        skillPoints: {
          ...skillPoints,
          [quest.rewardCategory]: currentPoints + quest.rewardPoints
        }
      });

      fetchQuests();
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  const deleteQuest = async (id: string) => {
    try {
      await deleteDocument('quests', id);
      fetchQuests();
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-5xl mx-auto"
    >
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-100 flex items-center gap-4">
            <Swords className="text-brand-primary w-10 h-10" />
            QUEST_LOG
          </h2>
          <p className="text-zinc-500 mt-2 text-[10px] font-mono uppercase tracking-[0.3em]">Conquer challenges to earn specialized Skill Points.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus className="w-4 h-4" />
          Initialize
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-12 p-10 glass-card rounded-[40px] border-brand-primary/20 bg-brand-primary/[0.02]"
          >
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight">
              <Flame className="text-brand-primary w-5 h-5" />
              QUEST_PARAMETERS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Designation</label>
                  <input 
                    type="text" 
                    value={newQuest.title}
                    onChange={e => setNewQuest({...newQuest, title: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors text-zinc-100 text-sm"
                    placeholder="e.g., Master Indeed Clone"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Operational Objective</label>
                  <textarea 
                    value={newQuest.description}
                    onChange={e => setNewQuest({...newQuest, description: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors text-zinc-100 text-sm h-24"
                    placeholder="What specific outcome defines success?"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Reward Sector</label>
                  <select 
                    value={newQuest.rewardCategory}
                    onChange={e => setNewQuest({...newQuest, rewardCategory: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors text-zinc-100 text-sm appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">XP Multiplier</label>
                    <input 
                      type="number" 
                      value={newQuest.rewardPoints}
                      onChange={e => setNewQuest({...newQuest, rewardPoints: parseInt(e.target.value) || 1})}
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 focus:outline-none focus:border-brand-primary transition-colors text-zinc-100 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => setNewQuest({...newQuest, isBossFight: !newQuest.isBossFight})}
                      className={cn(
                        "w-full p-4 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all",
                        newQuest.isBossFight ? "bg-brand-primary/20 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10" : "bg-white/[0.02] border-white/[0.05] text-zinc-600"
                      )}
                    >
                      {newQuest.isBossFight ? "🔥 Boss Encounter" : "Tactical Side"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleAddQuest}
                className="flex-1 bg-brand-primary py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/30"
              >
                Launch Quest
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-10 bg-white/[0.03] border border-white/[0.05] py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/[0.05] transition-all"
              >
                Abort
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-6">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] animate-pulse">Accessing operational history...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {quests.map((quest, i) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={quest.id}
              className={cn(
                "p-8 glass-card rounded-[32px] border transition-all flex items-center gap-8 group",
                quest.completed ? "opacity-40 border-white/[0.02] bg-white/[0.01]" : 
                quest.isBossFight ? "border-brand-primary/30 bg-brand-primary/[0.02] shadow-[0_0_30px_rgba(99,102,241,0.05)]" : "border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-2xl",
                quest.completed ? "bg-white/[0.02] text-zinc-700" :
                quest.isBossFight ? "bg-brand-primary/10 text-brand-primary shadow-brand-primary/10" : "bg-white/[0.03] text-zinc-500"
              )}>
                {quest.completed ? <Trophy className="w-7 h-7" /> : 
                 quest.isBossFight ? <Flame className="w-7 h-7 animate-pulse" /> : <Target className="w-7 h-7" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border",
                    quest.isBossFight ? "border-brand-primary/40 text-brand-primary" : "border-white/[0.05] text-zinc-600"
                  )}>
                    {quest.isBossFight ? "High Value" : "Standard"}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600">• {quest.rewardCategory}</span>
                </div>
                <h3 className={cn("text-xl font-bold text-zinc-100 tracking-tight transition-all", quest.completed && "line-through text-zinc-600")}>{quest.title}</h3>
                <p className="text-zinc-500 text-xs mt-1.5 line-clamp-1">{quest.description}</p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right hidden sm:block">
                  <div className="text-[8px] font-bold uppercase text-zinc-700 mb-1.5 tracking-widest">Yield</div>
                  <div className="flex items-center gap-2 font-black text-brand-primary text-sm">
                    <Zap className="w-4 h-4" />
                    +{quest.rewardPoints} SP
                  </div>
                </div>
                
                {!quest.completed && (
                  <button 
                    onClick={() => completeQuest(quest)}
                    className="bg-zinc-900/50 border border-white/[0.05] hover:border-brand-primary hover:text-brand-primary px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl hover:scale-[1.05]"
                  >
                    Finalize
                  </button>
                )}
                
                <button 
                  onClick={() => deleteQuest(quest.id)}
                  className="p-2.5 rounded-xl bg-white/[0.03] text-zinc-800 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {quests.length === 0 && (
            <div className="h-64 border border-dashed border-white/[0.05] rounded-[40px] flex flex-col items-center justify-center text-zinc-700 gap-6 opacity-40">
              <Swords className="w-12 h-12" />
              <p className="font-bold uppercase tracking-[0.3em] text-[9px]">No operational objectives detected</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
