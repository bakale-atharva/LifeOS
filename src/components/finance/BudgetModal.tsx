'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Tag, Save, AlertCircle } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category: string, limit: number }) => void;
  categories: string[];
}

export default function BudgetModal({ isOpen, onClose, onSave, categories }: BudgetModalProps) {
  const [category, setCategory] = useState(categories[0] || 'Other');
  const [limit, setLimit] = useState('');

  const handleSubmit = () => {
    if (!limit || parseFloat(limit) <= 0) return;
    onSave({
      category,
      limit: parseFloat(limit)
    });
    setLimit('');
    onClose();
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
              <div className="glass-card p-8 rounded-3xl border-zinc-800 bg-zinc-900/90 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Wallet className="text-accent-blue w-6 h-6" />
                    Set Budget
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-accent-blue transition-colors text-zinc-100 appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Monthly Limit</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-100 transition-colors">$</span>
                      <input
                        type="number"
                        value={limit}
                        onChange={e => setLimit(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-10 pr-6 focus:outline-none focus:border-accent-blue transition-colors text-2xl font-black text-zinc-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-accent-blue/5 border border-accent-blue/20">
                    <AlertCircle className="w-5 h-5 text-accent-blue mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Setting a budget helps you track your financial health. Stay under your limit to earn **XP for Saving** at the end of the month.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-accent-blue py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20 mt-4"
                  >
                    <Save className="w-4 h-4" />
                    Initialize Budget
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
