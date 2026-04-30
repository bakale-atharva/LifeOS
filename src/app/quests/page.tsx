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
    <div className="p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-4 text-zinc-100">
            <Swords className="text-red-500 w-10 h-10" />
            Active Quests
          </h2>
          <p className="text-zinc-500 mt-2 text-lg">Conquer challenges to earn specialized Skill Points.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all shadow-lg shadow-red-500/20"
        >
          <Plus className="w-5 h-5" />
          Initialize Quest
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-12 p-8 glass-card rounded-3xl border-red-500/30 bg-zinc-900/80"
          >
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Flame className="text-red-500 w-5 h-5" />
              Quest Parameters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Quest Title</label>
                  <input 
                    type="text" 
                    value={newQuest.title}
                    onChange={e => setNewQuest({...newQuest, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-red-500 transition-colors text-zinc-100"
                    placeholder="e.g., Master Indeed Clone"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Objective Description</label>
                  <textarea 
                    value={newQuest.description}
                    onChange={e => setNewQuest({...newQuest, description: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-red-500 transition-colors text-zinc-100 h-24"
                    placeholder="What specific outcome defines success?"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Reward Category</label>
                  <select 
                    value={newQuest.rewardCategory}
                    onChange={e => setNewQuest({...newQuest, rewardCategory: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-red-500 transition-colors text-zinc-100 appearance-none"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2">Skill Points</label>
                    <input 
                      type="number" 
                      value={newQuest.rewardPoints}
                      onChange={e => setNewQuest({...newQuest, rewardPoints: parseInt(e.target.value) || 1})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-red-500 transition-colors text-zinc-100"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => setNewQuest({...newQuest, isBossFight: !newQuest.isBossFight})}
                      className={cn(
                        "w-full p-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all",
                        newQuest.isBossFight ? "bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/10" : "bg-zinc-950 border-zinc-800 text-zinc-500"
                      )}
                    >
                      {newQuest.isBossFight ? "🔥 Boss Fight" : "Side Quest"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleAddQuest}
                className="flex-1 bg-red-500 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Launch Quest
              </button>
              <button 
                onClick={() => setIsAdding(false)}
                className="px-8 bg-zinc-800 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-zinc-700 transition-all"
              >
                Abort
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Syncing Battle Logs...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {quests.map(quest => (
            <motion.div 
              layout
              key={quest.id}
              className={cn(
                "p-8 glass-card rounded-3xl border transition-all flex items-center gap-8 group",
                quest.completed ? "opacity-50 border-zinc-900 bg-zinc-950/20" : 
                quest.isBossFight ? "border-red-500/30 bg-red-500/5" : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl",
                quest.completed ? "bg-zinc-900 text-zinc-700" :
                quest.isBossFight ? "bg-red-500/20 text-red-500" : "bg-zinc-900 text-zinc-400"
              )}>
                {quest.completed ? <Trophy className="w-8 h-8" /> : 
                 quest.isBossFight ? <Flame className="w-8 h-8 animate-pulse" /> : <Target className="w-8 h-8" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border",
                    quest.isBossFight ? "border-red-500/50 text-red-500" : "border-zinc-800 text-zinc-500"
                  )}>
                    {quest.isBossFight ? "Boss Fight" : "Side Quest"}
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">• {quest.rewardCategory}</span>
                </div>
                <h3 className={cn("text-xl font-black text-zinc-100 truncate", quest.completed && "line-through text-zinc-600")}>{quest.title}</h3>
                <p className="text-zinc-500 text-sm truncate mt-1">{quest.description}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-black uppercase text-zinc-600 mb-1 tracking-widest">Reward</div>
                  <div className="flex items-center gap-2 font-black text-accent-purple">
                    <Zap className="w-4 h-4" />
                    +{quest.rewardPoints} SP
                  </div>
                </div>
                
                {!quest.completed && (
                  <button 
                    onClick={() => completeQuest(quest)}
                    className="bg-zinc-950 border border-zinc-800 hover:border-red-500 hover:text-red-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
                  >
                    Complete
                  </button>
                )}
                
                <button 
                  onClick={() => deleteQuest(quest.id)}
                  className="p-2 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {quests.length === 0 && (
            <div className="h-64 border-2 border-dashed border-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-700 gap-4">
              <Swords className="w-12 h-12 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No active threats detected. Initialize a quest.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
