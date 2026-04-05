import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FinanceState, Transaction } from '../types';


export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
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
        set({ isAuthenticated: false, user: null }),
      clearTransactions: () => set({ transactions: [] })
    }),
    {
      name: 'finance-storage',
    }
  )
);
