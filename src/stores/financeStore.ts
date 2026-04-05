import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FinanceState, Transaction } from '../types';

const generateMockTransactions = (): Transaction[] => {
  const categories = ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Salary', 'Freelance', 'Dining', 'Transport'];
  const transactions: Transaction[] = [];
  const today = new Date();

  // Generate 50 mock transactions spread over the last 3 months
  for (let i = 0; i < 50; i++) {
    const isIncome = Math.random() > 0.8; 
    const category = isIncome 
      ? (Math.random() > 0.5 ? 'Salary' : 'Freelance')
      : categories[Math.floor(Math.random() * 8)];
      
    // Skip putting expense categories on income
    if (isIncome && category !== 'Salary' && category !== 'Freelance') continue;
    if (!isIncome && (category === 'Salary' || category === 'Freelance')) continue;

    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      date,
      amount: isIncome ? Math.floor(Math.random() * 3000) + 500 : Math.floor(Math.random() * 200) + 10,
      category,
      type: isIncome ? 'Income' : 'Expense',
      description: `Mock ${category} transaction`,
    });
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockTransactions(),
      role: 'Viewer',
      theme: 'dark',
      isAuthenticated: false,
      user: null,
      adminPassword: 'admin123',
      setRole: (role) => set({ role }),
      setAdminPassword: (password) => set({ adminPassword: password }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          { ...transaction, id: Math.random().toString(36).substr(2, 9) },
          ...state.transactions
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      updateTransaction: (id, updatedTx) => set((state) => ({
        transactions: state.transactions.map((tx) => 
          tx.id === id ? { ...tx, ...updatedTx } : tx
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id)
      })),
      login: (email, name = 'User') => 
        set({ isAuthenticated: true, user: { name, email } }),
      register: (name, email) => 
        set({ isAuthenticated: true, user: { name, email } }),
      logout: () => 
        set({ isAuthenticated: false, user: null })
    }),
    {
      name: 'finance-storage',
    }
  )
);
