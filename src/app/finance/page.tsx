'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Wallet, Plus, Loader2, Sparkles, X, TrendingUp, TrendingDown, History, BarChart3, PiggyBank, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { addDocument, getDocuments, updateDocument, deleteDocument } from '@/lib/firestoreUtils';
import TransactionModal from '@/components/finance/TransactionModal';
import BudgetModal from '@/components/finance/BudgetModal';
import BudgetProgress from '@/components/finance/BudgetProgress';
import DonutChart from '@/components/charts/DonutChart';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: any; // Firestore Timestamp
}

interface Budget {
  id: string;
  category: string;
  limit: number;
}

interface Toast {
  id: string;
  message: string;
  xp?: number;
}

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Rent', 'Entertainment', 'Shopping', 'Health', 'Other'];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F87171',
  Transport: '#60A5FA',
  Rent: '#A855F7',
  Entertainment: '#FBBF24',
  Shopping: '#34D399',
  Health: '#10B981',
  Other: '#94A3B8',
};

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const { addXP, dealDamage } = useStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transData, budgetData] = await Promise.all([
        getDocuments('transactions'),
        getDocuments('budgets')
      ]);
      // Sort transactions by date descending
      const sortedTrans = (transData as Transaction[]).sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
        const dateB = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
        return dateB - dateA;
      });
      setTransactions(sortedTrans);
      setBudgets(budgetData as Budget[]);
    } catch (error) {
      console.error("Error fetching finance data:", error);
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

  const handleLogTransaction = async (data: any) => {
    try {
      await addDocument('transactions', data);
      await fetchData();
      showToast(`Logged ${data.type}: $${data.amount}`);
      dealDamage(10, 'Fiscal Beam');
    } catch (error) {
      console.error("Error logging transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDocument('transactions', id);
      await fetchData();
      showToast("Transaction deleted");
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSaveBudget = async (data: any) => {
    try {
      const existing = budgets.find(b => b.category === data.category);
      if (existing) {
        await updateDocument('budgets', existing.id, data);
      } else {
        await addDocument('budgets', data);
      }
      await fetchData();
      showToast(`Budget set for ${data.category}`);
      dealDamage(20, 'Resource Allocation');
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const claimSavingsXP = () => {
    // Simplified logic: Check if total expenses this month are under total budget
    const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    if (totalBudget > 0 && totalExpenses < totalBudget) {
      addXP(200);
      showToast("Financial Discipline Awarded!", 200);
      dealDamage(100, 'Economic Singularity');
    } else if (totalBudget === 0) {
      showToast("Set your budgets first!");
    } else {
      showToast("Budget exceeded. No XP available.");
    }
  };

  // Calculations
  const monthlyIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const netFlow = monthlyIncome - monthlyExpenses;

  const getSpentForCategory = (category: string) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const donutData = EXPENSE_CATEGORIES.map(cat => ({
    label: cat,
    value: getSpentForCategory(cat),
    color: CATEGORY_COLORS[cat] || '#94A3B8'
  })).filter(item => item.value > 0);

  // Weekly Vitals Data
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getWeeklyData = () => {
    const data = new Array(7).fill(0);
    const now = new Date();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const tDate = t.date.toDate ? t.date.toDate() : new Date(t.date);
      const diffDays = Math.floor((now.getTime() - tDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        data[6 - diffDays] += t.amount;
      }
    });
    return data;
  };

  const weeklyVitals = getWeeklyData();
  const maxWeekly = Math.max(...weeklyVitals, 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-8 max-w-7xl mx-auto relative min-h-screen"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[200] glass-card px-6 py-4 rounded-2xl border-brand-primary/30 bg-[#1E293B]/80 shadow-2xl flex items-center gap-4 min-w-[300px]"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-100">{toast.message}</p>
              {toast.xp && <p className="text-[10px] font-bold text-brand-primary uppercase">+{toast.xp} XP Earned</p>}
            </div>
            <button onClick={() => setToasts(toasts.filter(t => t.id !== toast.id))}>
              <X className="w-4 h-4 text-zinc-500 hover:text-zinc-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-100 flex items-center gap-4">
            <Wallet className="text-brand-primary w-10 h-10" />
            FINANCE_VITALS.SYS
          </h2>
          <p className="text-zinc-500 mt-2 text-[10px] font-mono uppercase tracking-[0.3em]">Resource management and liquidity tracking.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsBudgetModalOpen(true)}
            className="bg-white/[0.03] hover:bg-white/[0.05] text-zinc-300 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all border border-white/[0.05]"
          >
            <BarChart3 className="w-4 h-4" />
            Allocations
          </button>
          <button 
            onClick={() => setIsTransactionModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Ledger
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Syncing financial ledgers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-[32px] border-white/[0.05]">
                <div className="flex items-center gap-3 text-emerald-400 mb-6">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Inflow</span>
                </div>
                <div className="text-3xl font-black text-zinc-100 tracking-tighter">${monthlyIncome.toFixed(2)}</div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-[32px] border-white/[0.05]">
                <div className="flex items-center gap-3 text-rose-400 mb-6">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Outflow</span>
                </div>
                <div className="text-3xl font-black text-zinc-100 tracking-tighter">${monthlyExpenses.toFixed(2)}</div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="glass-card p-8 rounded-[32px] border-white/[0.05] relative overflow-hidden">
                <div className="flex items-center gap-3 text-brand-primary mb-6">
                  <PiggyBank className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Net liquidity</span>
                </div>
                <div className={cn("text-3xl font-black tracking-tighter relative z-10", netFlow >= 0 ? "text-brand-primary" : "text-rose-500")}>
                  {netFlow >= 0 ? '+' : ''}${netFlow.toFixed(2)}
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-[0.02] rotate-12">
                  <Wallet className="w-32 h-32" />
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Weekly Chart */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-10 rounded-[40px] border-white/[0.05]">
                <h3 className="text-xl font-bold mb-10 flex items-center justify-between tracking-tight">
                    BURN_RATE.LOG
                    <span className="text-[9px] font-mono text-zinc-600 tracking-[0.2em] uppercase">Last 7 days</span>
                </h3>
                <div className="flex items-end justify-between gap-4 h-48 px-2">
                    {weeklyVitals.map((amount, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4">
                        <div className="w-full relative group">
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${(amount / maxWeekly) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={cn(
                            "w-full rounded-xl transition-all duration-500 relative bg-white/[0.03] group-hover:bg-brand-primary group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
                            amount > 0 && "bg-white/[0.1]"
                            )}
                        />
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/[0.05] px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-2xl">
                            ${amount.toFixed(2)}
                        </div>
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                        {days[idx]}
                        </div>
                    </div>
                    ))}
                </div>
                </motion.div>

                {/* Category Donut */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-10 rounded-[40px] border-white/[0.05] flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-10 self-start tracking-tight">SECTOR_EXPENSE.DIST</h3>
                    {donutData.length > 0 ? (
                        <div className="relative">
                          <DonutChart data={donutData} size={180} thickness={12} />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Total Spent</div>
                              <div className="text-xl font-black tracking-tighter">${monthlyExpenses.toFixed(0)}</div>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-zinc-700 text-[10px] font-mono uppercase tracking-widest">Insufficient Data</div>
                    )}
                </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-10 rounded-[40px] border-white/[0.05]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold flex items-center gap-4 tracking-tight">
                  <History className="w-5 h-5 text-brand-primary" />
                  TRANSACTION_LEDGER
                </h3>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 10).map((t, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    key={t.id} 
                    className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "p-3 rounded-xl border",
                        t.type === 'income' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
                      )}>
                        {t.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-100 text-sm tracking-tight">{t.description || t.category}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1">{t.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={cn("font-black tracking-tight", t.type === 'income' ? "text-emerald-400" : "text-zinc-100")}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </div>
                      <button 
                        onClick={() => handleDeleteTransaction(t.id)}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-zinc-600 hover:text-rose-500 hover:border-rose-500/30 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-20 text-zinc-600 text-[10px] font-mono uppercase tracking-[0.3em]">No data records found</div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            {/* Budget Progress */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-card p-10 rounded-[40px] border-white/[0.05] sticky top-8">
              <h3 className="text-xl font-bold mb-10 tracking-tight">OPERATIONAL_LIMITS</h3>
              <div className="space-y-10 mb-12">
                {budgets.map(budget => (
                  <BudgetProgress 
                    key={budget.id}
                    category={budget.category}
                    spent={getSpentForCategory(budget.category)}
                    limit={budget.limit}
                  />
                ))}
                {budgets.length === 0 && (
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-700 text-center py-10">
                    No active allocations
                  </div>
                )}
              </div>
              
              <button
                onClick={claimSavingsXP}
                className="w-full py-5 rounded-[24px] bg-brand-primary text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
              >
                <Sparkles className="w-5 h-5" />
                Claim Yield (+200 XP)
              </button>
            </motion.div>
          </div>

        </div>
      )}

      {/* Modals */}
      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onLog={handleLogTransaction}
      />
      
      <BudgetModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        categories={EXPENSE_CATEGORIES}
      />
    </motion.div>
  );
}
