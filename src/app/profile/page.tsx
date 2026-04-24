"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp,
  collection,
  getDocs,
  writeBatch
} from "firebase/firestore";
import { 
  User, 
  Camera, 
  ShieldCheck, 
  Trophy, 
  Save,
  Loader2,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Julian Dubois",
    title: "Master Admin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
    bio: "Optimizing life via the Nexus GPS framework."
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [purging, setPurging] = useState(false);

  useEffect(() => {
    // For now, we use a single hardcoded 'default' profile ID
    const unsub = onSnapshot(doc(db, "profiles", "default"), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data() as any);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "profiles", "default"), {
        ...profile,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert("Profile Optimized Successfully.");
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  const purgeData = async () => {
    if (!confirm("CRITICAL WARNING: This will permanently delete ALL goals, projects, tasks, sleep logs, and test data. This action cannot be undone. Proceed with system purge?")) return;
    
    setPurging(true);
    try {
      const collectionsToPurge = ["goals", "projects", "tasks", "sleep_logs", "dummy_data"];
      
      for (const colName of collectionsToPurge) {
        const querySnapshot = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
      
      alert("System Purge Complete. All user data has been eliminated.");
    } catch (error) {
      console.error("Purge Failed:", error);
      alert("Purge failed. Check console for details.");
    }
    setPurging(false);
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center text-teal-400">
      <Loader2 className="animate-spin mr-2" /> Initializing Core...
    </div>
  );

  return (
    <main className="flex-1 flex flex-col p-8 space-y-8 overflow-y-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">IDENTITY_MANAGEMENT</h1>
      </header>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-4 nexus-panel p-8 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-teal-500/30 overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.2)]">
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-teal-500 rounded-lg text-gray-900 hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <div className="text-xs text-teal-400 font-bold uppercase tracking-widest mt-1">{profile.title}</div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Status</div>
              <ShieldCheck className="mx-auto text-teal-400" size={20} />
            </div>
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Rank</div>
              <Trophy className="mx-auto text-amber-500" size={20} />
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8 nexus-panel p-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="nexus-subtext">Display Name</label>
                <input 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="nexus-input w-full" 
                />
              </div>
              <div className="space-y-2">
                <label className="nexus-subtext">Core Title</label>
                <input 
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="nexus-input w-full" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="nexus-subtext">Avatar Seed (Dicebear)</label>
              <input 
                value={profile.avatarUrl.split('seed=')[1] || ""}
                onChange={(e) => setProfile({...profile, avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.target.value}`})}
                className="nexus-input w-full" 
                placeholder="Enter seed for avatar..."
              />
            </div>

            <div className="space-y-2">
              <label className="nexus-subtext">Biography</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="nexus-input w-full h-32 resize-none" 
              />
            </div>

            <button 
              onClick={saveProfile}
              disabled={saving}
              className="nexus-btn w-full flex items-center justify-center space-x-2"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> <span>Synchronize Profile</span></>}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-red-500/20 space-y-4">
            <div className="flex items-center space-x-2 text-red-500 font-bold uppercase text-xs tracking-[0.2em]">
              <AlertTriangle size={16} /> <span>Danger Zone</span>
            </div>
            <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                Executing a system purge will remove all personalized data streams. This operation is irreversible and will reset your progress tracking to zero.
              </p>
              <button 
                onClick={purgeData}
                disabled={purging}
                className="w-full py-3 rounded-xl border border-red-500/50 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {purging ? <Loader2 className="animate-spin" size={16} /> : <><Trash2 size={16} /> <span>Purge System Data</span></>}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
