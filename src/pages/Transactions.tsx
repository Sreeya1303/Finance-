import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { useFinanceStore } from '../stores/financeStore';
import { format, parseISO } from 'date-fns';
import TransactionModal from '../components/TransactionModal';
import type { Transaction } from '../types';

const Transactions = () => {
  const { transactions, role, deleteTransaction } = useFinanceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'All' || tx.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  const handleEdit = (tx: Transaction) => {
    setTransactionToEdit(tx);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setTransactionToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-1">Transactions</h1>
          <p className="text-text-muted">Manage and review your financial history.</p>
        </div>
        
        {role === 'Admin' && (
          <button 
            onClick={handleAddNew}
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} /> Add Transaction
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search by category or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-2">
          <Filter className="text-text-muted" size={18} />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-auto bg-background border border-border rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel overflow-hidden bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Description</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Amount</th>
                {role === 'Admin' && <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-background/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text font-medium">
                      {format(parseISO(tx.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-text">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted hidden sm:table-cell max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right">
                      <span className={tx.type === 'Income' ? 'text-income' : 'text-text'}>
                        {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    {role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEdit(tx)} className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/10">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-text-muted hover:text-expense transition-colors rounded-md hover:bg-expense/10">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="px-6 py-12 text-center text-text-muted">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
};

export default Transactions;
