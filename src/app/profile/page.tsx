'use client';

import { useStore } from '@/store/useStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Zap, Sparkles, BookOpen, Dumbbell, Cpu, Camera, Edit2, Check, X } from 'lucide-react';
import SpiderSkillTree from '@/components/profile/SpiderSkillTree';

export default function ProfilePage() {
  const { level, xp, skillPoints, displayName, profileImage, setProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(displayName);
  const [newImage, setNewImage] = useState(profileImage);

  const nextLevelXP = level * 1000;
  const progress = (xp / nextLevelXP) * 100;

  const handleSaveIdentity = () => {
    setProfile({ displayName: newName, profileImage: newImage });
    setIsEditing(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header / Identity Section */}
      <header className="flex flex-col md:flex-row gap-8 items-center md:items-end">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl bg-zinc-900 border-2 border-accent-purple flex items-center justify-center relative overflow-hidden shadow-2xl shadow-accent-purple/20">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-zinc-700" />
            )}
            <div 
              onClick={() => setIsEditing(true)}
              className="absolute inset-0 bg-accent-purple/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
            >
              <Camera className="w-6 h-6 text-accent-purple" />
            </div>
          </div>
          <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-zinc-950 border-2 border-accent-purple flex items-center justify-center font-black text-xl text-accent-purple shadow-xl">
            {level}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-purple mb-2">Agent Identity</div>
          
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div 
                key="display"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center md:justify-start gap-3 mb-4"
              >
                <h2 className="text-4xl font-black text-zinc-100 tracking-tight">{displayName}</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-accent-purple transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 mb-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Agent Name"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:border-accent-purple"
                  />
                  <input 
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Profile Image URL"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-100 focus:outline-none focus:border-accent-purple"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveIdentity}
                      className="p-2 bg-accent-purple rounded-lg text-white"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="max-w-md">
            <div className="flex justify-between text-[10px] font-bold uppercase mb-2 tracking-widest text-zinc-500">
              <span>Experience Points</span>
              <span className="text-zinc-300">{xp} / {nextLevelXP} XP</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent-purple shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              />
            </div>
          </div>
        </div>

        {/* Currency Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(skillPoints).map(([category, points]) => (
            <div key={category} className="glass-card px-6 py-4 rounded-2xl border-zinc-800 flex flex-col items-center">
              <div className="text-[8px] font-black uppercase text-zinc-500 mb-1 whitespace-nowrap">{category}</div>
              <div className="text-xl font-black text-accent-purple">{points}</div>
              <div className="text-[8px] font-bold text-zinc-600 uppercase">Points</div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Skill Tree Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-zinc-100 flex items-center gap-3">
              <BookOpen className="text-accent-purple w-6 h-6" />
              Skill Tree
            </h3>
            <p className="text-zinc-500 text-sm">Master specialized nodes to unlock passive buffs and system enhancements.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase text-zinc-400">
              <Zap className="w-3 h-3 text-accent-purple" />
              Hold to Unlock
            </div>
          </div>
        </div>

        <SpiderSkillTree />
      </section>
    </div>
  );
}
