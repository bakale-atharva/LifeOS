'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Save, Trash2, BookOpen } from 'lucide-react';

interface Skill {
  id?: string;
  name: string;
  level: number;
  xp: number;
  description: string;
}

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Skill>) => void;
  onDelete?: (id: string) => void;
  initialData?: Skill | null;
}

export default function SkillModal({ isOpen, onClose, onSave, onDelete, initialData }: SkillModalProps) {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    level: 1,
    xp: 0,
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        level: 1,
        xp: 0,
        description: ''
      });
    }
  }, [initialData]);

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
              <div className="glass-card p-8 rounded-3xl border-accent-purple/30 bg-zinc-900/90 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <BookOpen className="text-accent-purple w-6 h-6" />
                    {initialData ? 'Refine Skill' : 'New Skill'}
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-purple transition-colors text-zinc-100"
                      placeholder="e.g., Coding, Fitness, Archery"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-purple transition-colors text-zinc-100 text-sm h-24"
                      placeholder="What does this skill represent?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Base Level</label>
                      <input
                        type="number"
                        value={formData.level}
                        onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-purple transition-colors text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Current XP</label>
                      <input
                        type="number"
                        value={formData.xp}
                        onChange={e => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:outline-none focus:border-accent-purple transition-colors text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-accent-purple py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent-purple/90 transition-all shadow-lg shadow-accent-purple/20"
                    >
                      <Save className="w-4 h-4" />
                      Save Skill
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
