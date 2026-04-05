import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FinanceState, Transaction, Role, Theme } from '../types/index';


export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      role: 'Viewer',
      theme: 'dark',
      isAuthenticated: false,
      user: null,
      adminPassword: 'admin123',
      setRole: (role: Role) => set({ role }),
      setAdminPassword: (password: string) => set({ adminPassword: password }),
      setTheme: (theme: Theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      addTransaction: (transaction: Omit<Transaction, 'id'>) => set((state: FinanceState) => ({
        transactions: [
          { ...transaction, id: Math.random().toString(36).substr(2, 9) } as Transaction,
          ...state.transactions
        ].sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      updateTransaction: (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => set((state: FinanceState) => ({
        transactions: state.transactions.map((tx: Transaction) => 
          tx.id === id ? { ...tx, ...updatedTx } : tx
        ).sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
      })),
      deleteTransaction: (id: string) => set((state: FinanceState) => ({
        transactions: state.transactions.filter((tx: Transaction) => tx.id !== id)
      })),
      login: (email: string, name: string = 'User') => 
        set({ isAuthenticated: true, user: { name, email } }),
      register: (name: string, email: string) => 
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


