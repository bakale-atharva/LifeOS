'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Zap, Sparkles, BookOpen, Dumbbell, Cpu, Camera, Edit2, Check, X, Loader2 } from 'lucide-react';
import SpiderSkillTree from '@/components/profile/SpiderSkillTree';
import { setDocument } from '@/lib/firestoreUtils';

export default function ProfilePage() {
  const { level, xp, xpToNextLevel, skillPoints, displayName, profileImage, streak, unlockedSkills, setProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState(displayName);
  const [newImage, setNewImage] = useState(profileImage);

  const progress = (xp / xpToNextLevel) * 100;

  const handleSaveIdentity = async () => {
    setIsSaving(true);
    try {
      await setDocument('user', 'profile', {
        displayName: newName,
        profileImage: newImage,
        xp, level, streak, skillPoints, unlockedSkills
      });
      setProfile({ displayName: newName, profileImage: newImage });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save identity:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto space-y-16"
    >
      {/* Header / Identity Section */}
      <header className="flex flex-col md:flex-row gap-12 items-center md:items-end">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[40px] bg-white/[0.02] border-2 border-brand-primary/30 flex items-center justify-center relative overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-brand-primary/60">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-20 h-20 text-zinc-800" />
            )}
            <div 
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
            >
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-[24px] bg-brand-primary border-4 border-[#0B0B0B] flex items-center justify-center font-black text-2xl text-white shadow-2xl">
            {level}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-primary mb-3">AGENT_IDENTIFICATION.SYS</div>
          
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div 
                key="display"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-center md:justify-start gap-5 mb-6"
              >
                <h2 className="text-5xl font-black text-zinc-100 tracking-tighter truncate">{displayName}</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-zinc-500 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-5 mb-6"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Agent Name"
                    className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-3 text-zinc-100 focus:outline-none focus:border-brand-primary transition-colors font-bold"
                  />
                  <input 
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Profile Image URL"
                    className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-5 py-3 text-zinc-100 focus:outline-none focus:border-brand-primary transition-colors text-sm"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveIdentity}
                      disabled={isSaving}
                      className="p-3 bg-brand-primary rounded-2xl text-white disabled:opacity-50 shadow-lg shadow-brand-primary/20"
                    >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-zinc-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="max-w-md">
            <div className="flex justify-between text-[10px] font-bold uppercase mb-3 tracking-widest text-zinc-500 px-1">
              <span>Sync Progress</span>
              <span className="text-zinc-300 font-mono">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Currency Display */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(skillPoints).map(([category, points], i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              key={category} 
              className="glass-card px-8 py-5 rounded-[28px] border-white/[0.05] flex flex-col items-center min-w-[140px]"
            >
              <div className="text-[8px] font-black uppercase text-zinc-500 mb-2 tracking-[0.2em]">{category.split(' ')[0]}</div>
              <div className="text-2xl font-black text-brand-primary tracking-tighter">{points}</div>
              <div className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Skill Units</div>
            </motion.div>
          ))}
        </div>
      </header>

      {/* Main Skill Tree Section */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-zinc-100 flex items-center gap-4 tracking-tight">
              <BookOpen className="text-brand-primary w-8 h-8" />
              NEURAL_TREE.MAP
            </h3>
            <p className="text-zinc-500 text-sm mt-1">Master specialized nodes to unlock passive buffs and system enhancements.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <Zap className="w-4 h-4 text-brand-primary fill-brand-primary/20" />
              Long-press to Unlock
            </div>
          </div>
        </div>

        <div className="p-10 glass-card rounded-[48px] border-white/[0.05] bg-white/[0.01] relative overflow-hidden">
          <SpiderSkillTree />
          {/* Subtle Background Detail */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
      </section>
    </motion.div>
  );
}
