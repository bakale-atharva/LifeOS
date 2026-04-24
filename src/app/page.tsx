"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  limit,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Trophy,
  Zap,
  BookOpen,
  Dumbbell,
  Coffee,
  Smartphone,
  ShieldAlert,
  ShoppingBag,
  TrendingUp,
  Circle
} from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    name: "Julian Dubois",
    level: 7,
    title: "Pathfinder",
    xp: 6850,
    maxXp: 10000,
    streak: 14,
    questsComplete: 89,
    ascensionPoints: 1250,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
  });

  // Fetch Profile
  useEffect(() => {
    return onSnapshot(doc(db, "profiles", "default"), (doc) => {
      if (doc.exists()) setProfile(prev => ({ ...prev, ...doc.data() }));
    });
  }, []);

  // Fetch incomplete tasks for "The Journey"
  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      where("completed", "==", false),
      limit(4)
    );
    return onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const toggleTask = async (taskId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "tasks", taskId), { completed: !currentStatus });
  };

  const xpPercentage = (profile.xp / profile.maxXp) * 100;

  return (
    <main className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 animate-in fade-in duration-700">
      
      {/* COLUMN 1: OVERVIEW */}
      <div className="md:col-span-3 space-y-6">
        <div className="ascend-panel p-8 flex flex-col items-center">
          <div className="ascend-card-header w-full text-center">Overview</div>
          
          <div className="text-center mb-8">
            <p className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-1">The Path: Level {profile.level}</p>
            <p className="text-xs tracking-widest text-ascend-gold font-bold uppercase">{profile.title}</p>
          </div>

          <div 
            className="circular-progress mb-8" 
            style={{ "--progress": xpPercentage } as any}
          >
            <div className="circular-progress-inner">
              <p className="text-3xl font-bold tracking-tighter text-white">{profile.xp.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">/ {profile.maxXp.toLocaleString()} XP</p>
            </div>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Streak:</span>
              <span className="text-sm font-bold text-white uppercase">{profile.streak} Days</span>
            </div>
            <div className="progress-bg h-1">
                <div className="progress-fill" style={{ width: '70%' }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quests Complete:</span>
              <span className="text-sm font-bold text-white uppercase">{profile.questsComplete}</span>
            </div>
          </div>
        </div>

        <div className="ascend-panel p-6 flex items-center space-x-4">
           <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Zap size={20} className="text-blue-400" fill="currentColor" />
           </div>
           <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Current Focus:</p>
              <p className="text-sm font-bold text-white uppercase tracking-wider">Deep Work <span className="text-[10px] text-gray-500 font-normal ml-2">(1 hr remaining)</span></p>
           </div>
        </div>
      </div>

      {/* COLUMN 2: THE JOURNEY */}
      <div className="md:col-span-6 space-y-6">
        <div className="ascend-panel p-8 h-full">
          <div className="ascend-card-header">The Journey</div>
          <h3 className="text-sm font-bold tracking-[0.1em] text-gray-300 uppercase mb-8">Daily Quests & Habits</h3>
          
          <div className="space-y-8">
            {/* Hardcoded placeholders to match the image exactly for UI feel */}
            {[
              { id: '1', title: 'Morning Mindfulness (15min)', progress: 100, icon: Coffee, color: 'text-ascend-gold' },
              { id: '2', title: 'Strength Training Session', progress: 45, icon: Dumbbell, color: 'text-blue-400' },
              { id: '3', title: 'Read 20 Pages (Current: Meditations)', progress: 10, icon: BookOpen, color: 'text-gray-400' },
              { id: '4', title: 'Connect with Mentor', progress: 0, icon: Smartphone, color: 'text-rose-400', pending: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center space-x-6 group cursor-pointer">
                <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white tracking-wide">{item.title}</span>
                    <span className="text-xs font-bold text-gray-400">{item.pending ? 'Pending' : `${item.progress}%`}</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${item.progress}%`, backgroundColor: item.progress === 100 ? 'var(--ascend-gold)' : item.progress > 0 ? '#3b82f6' : 'transparent' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-ascend-gold/10 border border-ascend-gold/20 flex items-center justify-center">
                 <ShieldAlert size={24} className="text-ascend-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Weekly Boss Challenge:</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Conquer Procrastination Project</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 3: REWARDS & STATS */}
      <div className="md:col-span-3 space-y-6">
        <div className="ascend-panel p-8">
          <div className="ascend-card-header">Rewards & Stats</div>
          <h3 className="text-sm font-bold tracking-[0.1em] text-gray-300 uppercase mb-6">Inventory & Achievements</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group hover:border-ascend-gold/40 transition-all cursor-pointer">
                  <Trophy size={20} className={i < 3 ? 'text-ascend-gold opacity-80 group-hover:opacity-100' : 'text-gray-700'} />
               </div>
             ))}
          </div>

          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-white hover:bg-white/10 transition-all mb-8">
            <div className="flex items-center justify-center space-x-2">
               <ShoppingBag size={14} />
               <span>Shop</span>
            </div>
          </button>

          <div className="space-y-4">
             <div className="flex justify-between items-end mb-2">
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Energy Flow</p>
                   <p className="text-xs text-gray-400">(Last 7 Days)</p>
                </div>
                <TrendingUp size={16} className="text-blue-400" />
             </div>
             
             {/* Simple SVG Chart placeholder */}
             <div className="h-16 w-full relative">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <path 
                    d="M0,35 Q10,30 20,32 T40,20 T60,25 T80,10 T100,28 L100,40 L0,40 Z" 
                    fill="url(#gradient)" 
                    className="opacity-30"
                  />
                  <path 
                    d="M0,35 Q10,30 20,32 T40,20 T60,25 T80,10 T100,28" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
             <div className="flex items-center space-x-3 bg-ascend-gold/10 border border-ascend-gold/20 px-4 py-2 rounded-full">
                <Circle size={10} className="text-ascend-gold" fill="currentColor" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ascend-gold">Ascension Points: <span className="text-white ml-2">{profile.ascensionPoints.toLocaleString()}</span></p>
             </div>
          </div>
        </div>
      </div>

    </main>
  );
}
