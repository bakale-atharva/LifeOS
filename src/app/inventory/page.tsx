'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Package, Plus, Loader2, Sparkles, X, Shield, Cpu, Zap, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';
import GearCard from '@/components/inventory/GearCard';
import GearModal from '@/components/inventory/GearModal';

interface Gear {
  id: string;
  name: string;
  category: string;
  isEquipped: boolean;
  synergySkill: string;
  synergyBonus: number;
}

interface Toast {
  id: string;
  message: string;
  xp?: number;
}

export default function InventoryPage() {
  const [gear, setGear] = useState<Gear[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modal states
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [editingGear, setEditingGear] = useState<Gear | null>(null);

  // Get skills for the gear modal
  const { unlockedSkills } = useStore();
  const availableSkills = ['Engineering', 'Physical Fitness', 'Content Creation', 'Mental Fortitude'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getDocuments('gear');
      setGear(data as Gear[]);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, xp?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, xp }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSaveGear = async (data: Partial<Gear>) => {
    try {
      if (editingGear) {
        await updateDocument('gear', editingGear.id, data);
        showToast(`Updated ${data.name}`);
      } else {
        await addDocument('gear', { ...data, isEquipped: false });
        showToast(`Added ${data.name} to Armory`);
      }
      await fetchData();
      setIsGearModalOpen(false);
      setEditingGear(null);
    } catch (error) {
      console.error("Error saving gear:", error);
    }
  };

  const handleToggleEquip = async (id: string, isEquipped: boolean) => {
    try {
      // Optimistic update
      setGear(prev => prev.map(g => g.id === id ? { ...g, isEquipped } : g));
      await updateDocument('gear', id, { isEquipped });
      showToast(isEquipped ? "Gear equipped" : "Gear stored in armory");
    } catch (error) {
      console.error("Error toggling gear:", error);
      fetchData();
    }
  };

  const handleDeleteGear = async (id: string) => {
    if (!window.confirm("Disassemble this gear?")) return;
    try {
      await deleteDocument('gear', id);
      showToast("Gear disassembled");
      await fetchData();
      setIsGearModalOpen(false);
      setEditingGear(null);
    } catch (error) {
      console.error("Error deleting gear:", error);
    }
  };

  const equippedGear = gear.filter(g => g.isEquipped);
  const storedGear = gear.filter(g => !g.isEquipped);

  return (
    <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] glass-card px-6 py-4 rounded-2xl border-accent-blue/30 bg-zinc-900/90 shadow-2xl flex items-center gap-4 min-w-[300px]"
          >
            <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-100">{toast.message}</p>
              {toast.xp && <p className="text-xs text-accent-blue">+{toast.xp} XP Earned</p>}
            </div>
            <button onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}>
              <X className="w-4 h-4 text-zinc-500 hover:text-zinc-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black flex items-center gap-4 tracking-tight text-zinc-100">
            <Shield className="text-accent-blue w-10 h-10" />
            Armory Stash
          </h2>
          <p className="text-zinc-400 mt-2 text-lg">Manage and equip your tactical gear for passive skill boosts.</p>
        </div>
        
        <button 
          onClick={() => { setEditingGear(null); setIsGearModalOpen(true); }}
          className="bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold transition-all shadow-lg shadow-accent-blue/20"
        >
          <Plus className="w-5 h-5" />
          Add New Gear
        </button>
      </header>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Accessing secure storage...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-blue" />
              Active Loadout
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {equippedGear.map(g => (
                <GearCard 
                  key={g.id} 
                  gear={g} 
                  onToggleEquip={handleToggleEquip}
                  onEdit={(g) => { setEditingGear(g); setIsGearModalOpen(true); }}
                />
              ))}
              {equippedGear.length === 0 && (
                <div className="border border-dashed border-zinc-800 rounded-3xl py-12 text-center text-zinc-600 text-xs">
                  Loadout is empty. Equip gear from your armory.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Available Gear
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storedGear.map(g => (
                <GearCard 
                  key={g.id} 
                  gear={g} 
                  onToggleEquip={handleToggleEquip}
                  onEdit={(g) => { setEditingGear(g); setIsGearModalOpen(true); }}
                />
              ))}
              {storedGear.length === 0 && (
                <div className="col-span-full border border-dashed border-zinc-800 rounded-3xl py-12 text-center text-zinc-600 text-xs">
                  No stored gear found.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Modals */}
      <GearModal 
        isOpen={isGearModalOpen}
        onClose={() => setIsGearModalOpen(false)}
        onSave={handleSaveGear}
        onDelete={handleDeleteGear}
        initialData={editingGear}
        skills={availableSkills}
      />
    </div>
  );
}
