import { useMemo } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';

const QUOTES = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "Never spend your money before you have earned it.", author: "Thomas Jefferson" },
  { text: "The habit of saving is itself an education; it fosters every virtue.", author: "Theodore T. Munger" },
  { text: "Someone's sitting in the shade today because someone planted a tree a long time ago.", author: "Warren Buffett" },
  { text: "A simple fact that is hard to learn is that the time to save money is when you have some.", author: "Joe Moore" },
];

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ec4899', '#84cc16'];

const Dashboard = () => {
  const { transactions } = useFinanceStore();
  const randomQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'Income') income += tx.amount;
      else expenses += tx.amount;
    });

    return {
      balance: income - expenses,
      income,
      expenses
    };
  }, [transactions]);

  const trendData = useMemo(() => {
    // Group transactions by month-year
    const monthlyData: Record<string, { name: string, income: number, expense: number, dateObj: Date }> = {};
    
    transactions.forEach(tx => {
      const d = parseISO(tx.date);
      const key = format(d, 'MMM yyyy');
      if (!monthlyData[key]) {
        monthlyData[key] = { name: key, income: 0, expense: 0, dateObj: d };
      }
      if (tx.type === 'Income') {
        monthlyData[key].income += tx.amount;
      } else {
        monthlyData[key].expense += tx.amount;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .map(d => ({ name: d.name, Income: d.income, Expense: d.expense }));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expensesMap: Record<string, number> = {};
    
    transactions.forEach(tx => {
      if (tx.type === 'Expense') {
        expensesMap[tx.category] = (expensesMap[tx.category] || 0) + tx.amount;
      }
    });

    return Object.entries(expensesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">Your financial overview mapped out below.</p>
        </div>
        
        {/* Inspirational Quote */}
        <div className="p-3 border-l-2 border-primary bg-primary/5 md:max-w-md rounded-r-lg">
          <p className="text-sm text-text-muted italic leading-relaxed">
             "{randomQuote.text}"
          </p>
          <p className="text-xs text-text font-medium mt-1 text-right">
             — {randomQuote.author}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-muted">Total Balance</h3>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-text">
            ₹{stats.balance.toLocaleString()}
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-muted">Income</h3>
            <div className="p-2 bg-income/10 text-income rounded-lg">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-text">
            ₹{stats.income.toLocaleString()}
          </p>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-text-muted">Expenses</h3>
            <div className="p-2 bg-expense/10 text-expense rounded-lg">
              <ArrowDownRight size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-text">
            ₹{stats.expenses.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="glass-panel p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold text-text mb-4">Cash Flow Trend</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--border))" />
                <XAxis dataKey="name" stroke="rgb(var(--text-muted))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--text-muted))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))', color: 'rgb(var(--text))', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="Income" stroke="rgb(var(--income))" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} activeDot={{ r: 4, fill: 'rgb(var(--income))', stroke: 'rgb(var(--surface))', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="Expense" stroke="rgb(var(--expense))" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} activeDot={{ r: 4, fill: 'rgb(var(--expense))', stroke: 'rgb(var(--surface))', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="glass-panel p-6 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold text-text mb-4">Expenses Breakdown</h3>
          <div className="flex-1 min-h-0 relative">
             {categoryData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgb(var(--surface))" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)', borderRadius: '8px' }}
                    formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                 No expense data available.
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
