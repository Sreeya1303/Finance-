import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinanceStore } from '../stores/financeStore';
import type { Transaction, TransactionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

const TransactionModal = ({ isOpen, onClose, transactionToEdit }: Props) => {
  const { addTransaction, updateTransaction } = useFinanceStore();

  const [type, setType] = useState<TransactionType>('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date.split('T')[0]);
      setDescription(transactionToEdit.description);
    } else {
      setType('Expense');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    const txData = {
      type,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      description,
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, txData);
    } else {
      addTransaction(txData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl shadow-xl border border-border bg-surface">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text">
            {transactionToEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text rounded-full hover:bg-border/50 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Expense')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'Expense' ? 'bg-expense text-white' : 'bg-surface border border-border text-text hover:bg-surface/80'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('Income')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  type === 'Income' ? 'bg-income text-white' : 'bg-surface border border-border text-text hover:bg-surface/80'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Groceries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Detailed description"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-text hover:bg-border/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              {transactionToEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
