export type Role = 'Viewer' | 'Admin';
export type Theme = 'light' | 'dark';
export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export interface User {
  name: string;
  email: string;
}

export interface FinanceState {
  transactions: Transaction[];
  isAuthenticated: boolean;
  user: User | null;
  role: Role;
  theme: Theme;
  adminPassword?: string;
  setRole: (role: Role) => void;
  setTheme: (theme: Theme) => void;
  setAdminPassword: (password: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}
