'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Dumbbell, Package, Zap, Save, Trash2 } from 'lucide-react';

interface Gear {
  id?: string;
  name: string;
  category: string;
  isEquipped: boolean;
  synergySkill: string;
  synergyBonus: number;
}

interface GearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Gear>) => void;
  onDelete?: (id: string) => void;
  initialData?: Gear | null;
  skills: string[];
}

const CATEGORIES = ['Tech', 'Fitness', 'Utility', 'Other'];

export default function GearModal({ isOpen, onClose, onSave, onDelete, initialData, skills }: GearModalProps) {
  const [formData, setFormData] = useState<Partial<Gear>>({
    name: '',
    category: 'Tech',
    isEquipped: false,
    synergySkill: skills[0] || 'None',
    synergyBonus: 5
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        category: 'Tech',
        isEquipped: false,
        synergySkill: skills[0] || 'None',
        synergyBonus: 5
      });
    }
  }, [initialData, skills]);

  const handleSubmit = () => {
    if (!formData.name) return;
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[120] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <div className="glass-card p-8 rounded-3xl border-accent-blue/30 bg-zinc-900/90 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Cpu className="text-accent-blue w-6 h-6" />
                    {initialData ? 'Modify Gear' : 'New Gear'}
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Gear Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100"
                      placeholder="e.g., MacBook Pro"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            formData.category === cat 
                              ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Synergy Skill</label>
                      <select
                        value={formData.synergySkill}
                        onChange={e => setFormData({ ...formData, synergySkill: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100 text-xs appearance-none"
                      >
                        <option value="None">None</option>
                        {skills.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Bonus (%)</label>
                      <input
                        type="number"
                        value={formData.synergyBonus}
                        onChange={e => setFormData({ ...formData, synergyBonus: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-accent-blue py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20"
                    >
                      <Save className="w-4 h-4" />
                      Save Gear
                    </button>
                    {initialData?.id && onDelete && (
                      <button
                        onClick={() => onDelete(initialData.id!)}
                        className="p-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
