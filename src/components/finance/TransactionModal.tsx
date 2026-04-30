'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Tag, Calendar, Send, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (data: { type: 'income' | 'expense', amount: number, category: string, description: string, date: Date }) => void;
}

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Rent', 'Entertainment', 'Shopping', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
};

export default function TransactionModal({ isOpen, onClose, onLog }: TransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onLog({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date()
    });
    // Reset form
    setAmount('');
    setDescription('');
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
                    <DollarSign className="text-accent-purple w-6 h-6" />
                    New Transaction
                  </h3>
                  <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <div className="flex p-1 bg-zinc-950 rounded-2xl mb-8 border border-zinc-800">
                  <button
                    onClick={() => { setType('expense'); setCategory('Other'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      type === 'expense' 
                        ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4" />
                    Expense
                  </button>
                  <button
                    onClick={() => { setType('income'); setCategory('Other'); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      type === 'income' 
                        ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    Income
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Amount</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-100 transition-colors">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-10 pr-6 focus:outline-none focus:border-accent-purple transition-colors text-2xl font-black text-zinc-100"
                        placeholder="0.00"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES[type].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                            category === cat 
                              ? 'bg-zinc-800 border-accent-purple text-accent-purple' 
                              : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-accent-purple transition-colors text-zinc-100 text-sm"
                      placeholder="What was this for?"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-accent-purple py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-accent-purple/90 transition-all shadow-lg shadow-accent-purple/20 mt-4"
                  >
                    <Send className="w-4 h-4" />
                    Log {type.charAt(0).toUpperCase() + type.slice(1)}
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
