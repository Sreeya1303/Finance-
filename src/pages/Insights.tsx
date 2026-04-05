import { useMemo } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import { Lightbulb, TrendingUp, TrendingDown, Info, Award } from 'lucide-react';
import { parseISO, isSameMonth, subMonths } from 'date-fns';

const Insights = () => {
  const { transactions } = useFinanceStore();

  const insightsData = useMemo(() => {
    const today = new Date();
    const lastMonthDate = subMonths(today, 1);

    let currentMonthSpend = 0;
    let lastMonthSpend = 0;
    const categorySpend: Record<string, number> = {};

    transactions.forEach(tx => {
      if (tx.type === 'Expense') {
        const d = parseISO(tx.date);
        
        // Track category spend for all time (or current month)
        categorySpend[tx.category] = (categorySpend[tx.category] || 0) + tx.amount;

        if (isSameMonth(d, today)) {
          currentMonthSpend += tx.amount;
        } else if (isSameMonth(d, lastMonthDate)) {
          lastMonthSpend += tx.amount;
        }
      }
    });

    const highestCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0];
    
    let spendComparison = 0;
    if (lastMonthSpend > 0) {
       spendComparison = ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
    }

    return {
      currentMonthSpend,
      lastMonthSpend,
      spendComparison,
      highestCategory: highestCategory ? { name: highestCategory[0], amount: highestCategory[1] } : null
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-1">Financial Insights</h1>
        <p className="text-text-muted">AI-powered (simulated) observations based on your data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Comparison Insight */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             {insightsData.spendComparison > 0 ? <TrendingUp size={100} /> : <TrendingDown size={100} />}
          </div>
          <div className="flex items-center gap-3 mb-4 text-primary">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lightbulb size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Monthly Spending</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-text-muted">
              You've spent <strong className="text-text">₹{insightsData.currentMonthSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> this month.
            </p>
            
            {insightsData.lastMonthSpend > 0 && (
              <div className={`p-4 rounded-xl border ${insightsData.spendComparison > 0 ? 'bg-expense/10 border-expense/20 text-expense' : 'bg-income/10 border-income/20 text-income'}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {insightsData.spendComparison > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {Math.abs(insightsData.spendComparison).toFixed(1)}% {insightsData.spendComparison > 0 ? 'Higher' : 'Lower'} than last month
                    </h3>
                    <p className="text-sm opacity-90">
                      Last month's spending was ₹{insightsData.lastMonthSpend.toLocaleString()}. 
                      {insightsData.spendComparison > 0 
                        ? " Keep an eye on your budget for the rest of the month!" 
                        : " Great job keeping your expenses down!"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Category Insight */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
             <Award size={100} />
          </div>
          <div className="flex items-center gap-3 mb-4 text-rose-500">
            <div className="p-2 bg-rose-500/10 rounded-lg">
              <Info size={24} />
            </div>
            <h2 className="text-xl font-semibold text-text">Highest Expense Area</h2>
          </div>
          
          {insightsData.highestCategory ? (
            <div className="space-y-4">
              <p className="text-text-muted">
                Your highest spending category overall is <strong className="text-text">{insightsData.highestCategory.name}</strong>.
              </p>
              
              <div className="p-4 rounded-xl bg-surface border border-border">
                <div className="flex items-center justify-between mb-2">
                   <span className="font-medium text-text">{insightsData.highestCategory.name} Total</span>
                   <span className="font-bold text-lg">₹{insightsData.highestCategory.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-sm text-text-muted mt-3">
                  Consider reviewing subscriptions or frequent purchases in <strong>{insightsData.highestCategory.name}</strong> to find potential savings.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-text-muted">Not enough data to determine largest expense category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
