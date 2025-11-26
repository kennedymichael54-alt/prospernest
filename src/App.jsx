import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Upload, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Search, LogOut, User, Loader2, Home, CreditCard, PiggyBank, X, ChevronRight, Bell, Wallet, Calculator, FileText, Settings, HelpCircle, Link2, BarChart3, Flame, AlertCircle, CheckCircle, Lightbulb, Menu, Clock, Receipt } from 'lucide-react';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { useUserData } from './hooks/useUserData';

// AI Insights Component
const AIInsights = ({ transactions, budgetData, investments, goals }) => {
  const insights = useMemo(() => {
    const result = [];
    
    // Spending analysis
    if (transactions && transactions.length > 0) {
      const thisMonth = transactions.filter(t => {
        const d = new Date(t.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
      });
      
      const lastMonth = transactions.filter(t => {
        const d = new Date(t.date);
        const now = new Date();
        const lastM = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const lastY = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastM && d.getFullYear() === lastY && t.type === 'expense';
      });
      
      const thisTotal = thisMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const lastTotal = lastMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      if (lastTotal > 0) {
        const change = ((thisTotal - lastTotal) / lastTotal * 100).toFixed(0);
        if (change > 10) {
          result.push({ type: 'warning', icon: TrendingUp, text: `Spending is up ${change}% compared to last month. Consider reviewing your expenses.` });
        } else if (change < -10) {
          result.push({ type: 'success', icon: TrendingDown, text: `Great job! You've reduced spending by ${Math.abs(change)}% this month.` });
        }
      }
      
      // Category analysis
      const categorySpending = {};
      thisMonth.forEach(t => {
        const cat = t.category || 'Other';
        categorySpending[cat] = (categorySpending[cat] || 0) + Math.abs(t.amount);
      });
      
      const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
      if (topCategory && topCategory[1] > 500) {
        result.push({ type: 'info', icon: Lightbulb, text: `Your biggest expense category is ${topCategory[0]} at $${topCategory[1].toLocaleString()}.` });
      }
    }
    
    // Savings rate
    if (budgetData && budgetData.income && budgetData.expenses) {
      const totalIncome = budgetData.income.reduce((sum, i) => sum + (i.amount || 0), 0);
      const totalExpenses = budgetData.expenses.reduce((sum, i) => sum + (i.amount || 0), 0);
      if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(0);
        if (savingsRate >= 20) {
          result.push({ type: 'success', icon: CheckCircle, text: `Your savings rate is ${savingsRate}%. You're on track for financial independence!` });
        } else if (savingsRate > 0) {
          result.push({ type: 'info', icon: PiggyBank, text: `Your savings rate is ${savingsRate}%. Aim for 20%+ to accelerate wealth building.` });
        }
      }
    }
    
    // Investment growth
    if (investments && investments.length > 0) {
      const totalInvested = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
      if (totalInvested > 100000) {
        result.push({ type: 'success', icon: Target, text: `Congratulations! Your investments have crossed $${(totalInvested / 1000).toFixed(0)}k!` });
      }
    }
    
    // Default insight if none generated
    if (result.length === 0) {
      result.push({ type: 'info', icon: Lightbulb, text: 'Add more transactions to get personalized financial insights.' });
    }
    
    return result.slice(0, 3);
  }, [transactions, budgetData, investments, goals]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-400" size={24} />
        <h3 className="text-xl font-semibold">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
            insight.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
            insight.type === 'warning' ? 'bg-orange-500/10 border border-orange-500/30' :
            'bg-blue-500/10 border border-blue-500/30'
          }`}>
            <insight.icon className={`mt-0.5 ${
              insight.type === 'success' ? 'text-green-400' :
              insight.type === 'warning' ? 'text-orange-400' :
              'text-blue-400'
            }`} size={20} />
            <p className="text-sm text-slate-200">{insight.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Upcoming Bills Widget for Dashboard
const UpcomingBillsWidget = ({ billDates, onViewAll }) => {
  const sortedBills = useMemo(() => {
    if (!billDates) return [];
    const today = new Date();
    return billDates
      .map(b => ({ ...b, daysUntil: Math.ceil((new Date(b.dueDate) - today) / (1000 * 60 * 60 * 24)) }))
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3);
  }, [billDates]);

  const overdueCount = sortedBills.filter(b => b.daysUntil < 0).length;
  const thisMonthTotal = sortedBills.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="text-orange-400" size={24} />
          <h3 className="text-lg font-semibold">Upcoming Bills</h3>
        </div>
        <button onClick={onViewAll} className="text-sm text-purple-400 hover:text-purple-300">View All →</button>
      </div>
      
      {overdueCount > 0 && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
          <AlertCircle className="text-red-400" size={16} />
          <span className="text-sm text-red-300">{overdueCount} overdue bill{overdueCount > 1 ? 's' : ''}</span>
        </div>
      )}
      
      {sortedBills.length > 0 ? (
        <div className="space-y-2">
          {sortedBills.map(bill => (
            <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className={`text-xs ${bill.daysUntil < 0 ? 'text-red-400' : bill.daysUntil <= 3 ? 'text-orange-400' : 'text-slate-400'}`}>
                  {bill.daysUntil < 0 ? `${Math.abs(bill.daysUntil)} days overdue` : 
                   bill.daysUntil === 0 ? 'Due today' : 
                   `Due in ${bill.daysUntil} days`}
                </p>
              </div>
              <span className="font-semibold text-orange-400">${bill.amount?.toLocaleString()}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-600 flex justify-between">
            <span className="text-slate-400 text-sm">This month total</span>
            <span className="font-semibold">${thisMonthTotal.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-center py-4">No upcoming bills</p>
      )}
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ onAddTransaction, onAddGoal, onAddBill }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-24 right-6 z-40 md:bottom-8">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 min-w-[180px]">
          <button onClick={() => { onAddTransaction(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-lg transition-colors">
            <CreditCard size={20} className="text-green-400" />
            <span>Add Transaction</span>
          </button>
          <button onClick={() => { onAddGoal(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-lg transition-colors">
            <Target size={20} className="text-purple-400" />
            <span>Add Goal</span>
          </button>
          <button onClick={() => { onAddBill(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-lg transition-colors">
            <Receipt size={20} className="text-orange-400" />
            <span>Add Bill</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg flex items-center justify-center transition-transform ${isOpen ? 'rotate-45' : ''}`}
      >
        <Plus size={28} className="text-white" />
      </button>
    </div>
  );
};

// More Menu Slide-out
const MoreMenu = ({ isOpen, onClose, onNavigate, user, onSignOut }) => {
  const menuItems = [
    { id: 'bills', label: 'Bills', icon: Receipt, description: 'Manage recurring bills' },
    { id: 'accounts', label: 'Accounts', icon: Wallet, description: 'Link bank accounts' },
    { id: 'netWorth', label: 'Net Worth', icon: BarChart3, description: 'Track assets & liabilities' },
    { id: 'retirement', label: 'Retirement & FIRE', icon: Flame, description: 'Plan your financial future' },
    { id: 'cpa', label: 'CPA Export / Tax Center', icon: FileText, description: 'Export for your accountant' },
    { id: 'reports', label: 'Reports', icon: BarChart3, description: 'Detailed financial reports' },
    { id: 'integrations', label: 'Integrations', icon: Link2, description: 'Connect apps & services' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'App preferences' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, description: 'Get assistance' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">More</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg">
              <X size={24} />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user?.email}</p>
                <p className="text-sm text-slate-400">Free Plan</p>
              </div>
              <button onClick={() => { onNavigate('profile'); onClose(); }} className="text-purple-400 text-sm">Edit</button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className="w-full flex items-center gap-4 p-4 hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <item.icon size={20} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="w-full mt-6 flex items-center gap-4 p-4 hover:bg-red-500/10 rounded-xl transition-colors text-left text-red-400"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <LogOut size={20} />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNav = ({ activeTab, setActiveTab, onMoreClick }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'more', label: 'More', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => item.id === 'more' ? onMoreClick() : setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === item.id ? 'text-purple-400' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Reports Component
const ReportsSection = ({ transactions, budgetData, investments }) => {
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = new Date().getFullYear();
    
    return months.map((month, i) => {
      const monthTrans = (transactions || []).filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === i && d.getFullYear() === year;
      });
      
      const income = monthTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
      const expenses = monthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
      
      return { month, income, expenses, net: income - expenses };
    });
  }, [transactions]);

  const savingsRate = useMemo(() => {
    if (!budgetData) return 0;
    const income = budgetData.income?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
    const expenses = budgetData.expenses?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
    return income > 0 ? ((income - expenses) / income * 100) : 0;
  }, [budgetData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Reports</h2>
      
      {/* Cash Flow Chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Monthly Cash Flow</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Income" />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-sm text-slate-400 mb-2">Savings Rate</h4>
          <p className={`text-3xl font-bold ${savingsRate >= 20 ? 'text-green-400' : 'text-orange-400'}`}>
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">Target: 20%+</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-sm text-slate-400 mb-2">Total Invested</h4>
          <p className="text-3xl font-bold text-purple-400">
            ${investments?.reduce((sum, i) => sum + (i.currentValue || 0), 0).toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-sm text-slate-400 mb-2">Avg Monthly Spending</h4>
          <p className="text-3xl font-bold text-red-400">
            ${(monthlyData.reduce((sum, m) => sum + m.expenses, 0) / 12).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Category Trends */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Net Income Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Line type="monotone" dataKey="net" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6' }} name="Net Income" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Retirement & FIRE Combined Component
const RetirementFIRE = ({ investments, addInvestment, budgetData }) => {
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [fireInputs, setFireInputs] = useState({
    currentAge: 30,
    retirementAge: 55,
    annualExpenses: 50000,
    currentSavings: investments?.reduce((sum, i) => sum + (i.currentValue || 0), 0) || 0,
    annualContribution: 20000,
    expectedReturn: 7
  });

  const accountTypes = ['401k', 'Roth IRA', 'Traditional IRA', 'Brokerage', 'HSA'];

  const fireCalc = useMemo(() => {
    const { currentAge, retirementAge, annualExpenses, currentSavings, annualContribution, expectedReturn } = fireInputs;
    const yearsToRetirement = retirementAge - currentAge;
    const fireNumber = annualExpenses * 25;
    const rate = expectedReturn / 100;
    
    let projected = currentSavings;
    for (let i = 0; i < yearsToRetirement; i++) {
      projected = projected * (1 + rate) + annualContribution;
    }
    
    const onTrack = projected >= fireNumber;
    const percentToGoal = Math.min((projected / fireNumber) * 100, 100);
    
    return { fireNumber, projected, yearsToRetirement, onTrack, percentToGoal };
  }, [fireInputs]);

  const handleFileUpload = async (e) => {
    // Simplified upload handler
    alert('Upload feature - integrate with your CSV parser');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Flame className="text-orange-400" />
        Retirement & FIRE Planning
      </h2>

      {/* FIRE Calculator */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">FIRE Calculator</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Current Age</label>
            <input type="number" value={fireInputs.currentAge} onChange={(e) => setFireInputs({...fireInputs, currentAge: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Retirement Age</label>
            <input type="number" value={fireInputs.retirementAge} onChange={(e) => setFireInputs({...fireInputs, retirementAge: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Annual Expenses</label>
            <input type="number" value={fireInputs.annualExpenses} onChange={(e) => setFireInputs({...fireInputs, annualExpenses: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Current Savings</label>
            <input type="number" value={fireInputs.currentSavings} onChange={(e) => setFireInputs({...fireInputs, currentSavings: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Annual Contribution</label>
            <input type="number" value={fireInputs.annualContribution} onChange={(e) => setFireInputs({...fireInputs, annualContribution: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Expected Return %</label>
            <input type="number" value={fireInputs.expectedReturn} onChange={(e) => setFireInputs({...fireInputs, expectedReturn: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">FIRE Number</p>
            <p className="text-2xl font-bold text-orange-400">${fireCalc.fireNumber.toLocaleString()}</p>
            <p className="text-xs text-slate-500">25x annual expenses</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Projected at Retirement</p>
            <p className={`text-2xl font-bold ${fireCalc.onTrack ? 'text-green-400' : 'text-orange-400'}`}>${fireCalc.projected.toLocaleString()}</p>
            <p className="text-xs text-slate-500">In {fireCalc.yearsToRetirement} years</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-400 mb-1">Progress</p>
            <p className={`text-2xl font-bold ${fireCalc.onTrack ? 'text-green-400' : 'text-orange-400'}`}>{fireCalc.percentToGoal.toFixed(0)}%</p>
            <p className="text-xs text-slate-500">{fireCalc.onTrack ? '✓ On track!' : 'Need to save more'}</p>
          </div>
        </div>
      </div>

      {/* Investment Accounts */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Retirement Accounts</h3>
        <div className="flex gap-4 mb-4">
          <select value={selectedAccountType} onChange={(e) => setSelectedAccountType(e.target.value)} className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg">
            <option value="">Select account type...</option>
            {accountTypes.map(type => (<option key={type} value={type}>{type}</option>))}
          </select>
          <label className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer">
            <Upload size={20} />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {investments && investments.length > 0 ? (
          <div className="space-y-3">
            {investments.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Wallet className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{inv.type}</p>
                    <p className="text-sm text-slate-400">{inv.accountType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${inv.currentValue?.toLocaleString()}</p>
                  <div className="w-32 bg-slate-600 rounded-full h-2 mt-1">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min((inv.currentValue / inv.targetValue) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-600 flex justify-between items-center">
              <span className="text-lg font-semibold">Total Portfolio</span>
              <span className="text-2xl font-bold text-purple-400">${investments.reduce((sum, i) => sum + (i.currentValue || 0), 0).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No retirement accounts yet. Import a statement above!</p>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ user, signOut }) => {
  const {
    budgetData,
    billDates,
    transactions,
    investments,
    loading: dataLoading,
    saving,
    error,
    setBudgetData,
    addTransaction,
    deleteTransaction,
    bulkImportTransactions,
    addBillDate,
    deleteBillDate,
    addInvestment,
  } = useUserData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactionFilter, setTransactionFilter] = useState('');
  const [transactionSort, setTransactionSort] = useState('date-desc');
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });

  const [newTransaction, setNewTransaction] = useState({
    date: '', description: '', vendor: '', amount: '', type: 'expense',
    category: '', source: '', recurring: false, frequency: 'monthly'
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Income', 'Other Income'],
    expense: ['Housing', 'Food', 'Utilities', 'Transportation', 'Insurance', 'Healthcare', 'Entertainment', 'Other']
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (selectedMonth === -1) return d.getFullYear() === selectedYear;
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    return { income, expenses, netIncome: income - expenses };
  }, [filteredTransactions]);

  const incomeBySource = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'income').forEach(t => {
      const source = t.source || 'Other';
      grouped[source] = (grouped[source] || 0) + (t.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const expensesByCategory = useMemo(() => {
    const grouped = {};
    filteredTransactions.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Other';
      grouped[cat] = (grouped[cat] || 0) + Math.abs(t.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions.filter(t => {
      if (!transactionFilter) return true;
      const term = transactionFilter.toLowerCase();
      return (t.description || '').toLowerCase().includes(term) || (t.vendor || '').toLowerCase().includes(term);
    });
    return filtered.sort((a, b) => {
      if (transactionSort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (transactionSort === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (transactionSort === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
      return Math.abs(a.amount) - Math.abs(b.amount);
    });
  }, [transactions, transactionFilter, transactionSort]);

  // Handlers
  const handleAddTransaction = async () => {
    if (newTransaction.date && newTransaction.description && newTransaction.amount) {
      await addTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1)
      });
      setNewTransaction({ date: '', description: '', vendor: '', amount: '', type: 'expense', category: '', source: '', recurring: false, frequency: 'monthly' });
    }
  };

  const handleAddBill = async () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      await addBillDate({ name: newBill.name, amount: parseFloat(newBill.amount), dueDate: newBill.dueDate });
      setNewBill({ name: '', amount: '', dueDate: '' });
      setShowAddBillModal(false);
    }
  };

  const handleMoreNavigate = (id) => {
    setActiveTab(id);
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pb-20 md:pb-6">
      {saving && (
        <div className="fixed top-4 right-4 bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2 z-50">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </div>
      )}

      {/* Desktop Header */}
      <header className="hidden md:block border-b border-slate-700 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HomeBudget Hub</h1>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full text-xs font-bold">BETA</span>
            </div>
            <nav className="flex items-center gap-1">
              {['dashboard', 'transactions', 'budget', 'goals'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button onClick={() => setShowMoreMenu(true)} className="px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-white flex items-center gap-1">
                More <ChevronRight size={16} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden border-b border-slate-700 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">HomeBudget Hub</h1>
          <button onClick={() => setShowMoreMenu(true)} className="p-2 hover:bg-slate-700 rounded-lg">
            <User size={24} />
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex gap-4">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value={-1}>All Months</option>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  {[2023, 2024, 2025].map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-300 font-medium">Income</span>
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <p className="text-3xl font-bold">${totals.income.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-300 font-medium">Expenses</span>
                  <TrendingDown className="text-red-400" size={20} />
                </div>
                <p className="text-3xl font-bold">${totals.expenses.toLocaleString()}</p>
              </div>
              <div className={`bg-gradient-to-br ${totals.netIncome >= 0 ? 'from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'from-orange-500/20 to-orange-600/20 border-orange-500/30'} border rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={totals.netIncome >= 0 ? 'text-blue-300' : 'text-orange-300'}>Net</span>
                  <DollarSign className={totals.netIncome >= 0 ? 'text-blue-400' : 'text-orange-400'} size={20} />
                </div>
                <p className="text-3xl font-bold">${totals.netIncome.toLocaleString()}</p>
              </div>
            </div>

            {/* AI Insights */}
            <AIInsights transactions={transactions} budgetData={budgetData} investments={investments} />

            {/* Bills Widget + Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UpcomingBillsWidget billDates={billDates} onViewAll={() => setActiveTab('bills')} />
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Income Sources</h3>
                {incomeBySource.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={incomeBySource} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name }) => name}>
                        {incomeBySource.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                      </Pie>
                      <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-slate-400 text-center py-8">No data</p>}
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Top Expenses</h3>
                {expensesByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={expensesByCategory.slice(0, 5)} layout="vertical">
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={80} />
                      <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-slate-400 text-center py-8">No data</p>}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
              <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input placeholder="Description" value={newTransaction.description} onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input placeholder="Vendor" value={newTransaction.vendor} onChange={(e) => setNewTransaction({...newTransaction, vendor: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <input type="number" placeholder="Amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <select value={newTransaction.type} onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={newTransaction.category} onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                  <option value="">Category</option>
                  {categories[newTransaction.type].map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
                <input placeholder="Source" value={newTransaction.source} onChange={(e) => setNewTransaction({...newTransaction, source: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                <button onClick={handleAddTransaction} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium">Add</button>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold">Transactions</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input placeholder="Search..." value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
                  </div>
                  <select value={transactionSort} onChange={(e) => setTransactionSort(e.target.value)} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg">
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="amount-desc">Highest</option>
                    <option value="amount-asc">Lowest</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600 text-left">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Description</th>
                      <th className="py-3 px-3 hidden md:table-cell">Category</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.slice(0, 20).map(t => (
                      <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-3 px-3 text-sm">{t.date}</td>
                        <td className="py-3 px-3">
                          <p className="font-medium">{t.description}</p>
                          <p className="text-xs text-slate-400 md:hidden">{t.category}</p>
                        </td>
                        <td className="py-3 px-3 hidden md:table-cell text-slate-400">{t.category}</td>
                        <td className={`py-3 px-3 text-right font-semibold ${t.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {t.amount >= 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <button onClick={() => deleteTransaction(t.id)} className="p-1 text-red-400 hover:bg-red-500/20 rounded">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedTransactions.length === 0 && <p className="text-center text-slate-400 py-8">No transactions yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Monthly Budget</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">Income</h3>
                {budgetData?.income?.map(item => (
                  <div key={item.id} className="flex justify-between py-3 border-b border-slate-700">
                    <span>{item.name}</span>
                    <span className="font-semibold">${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-400">${budgetData?.income?.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-4">Expenses</h3>
                {budgetData?.expenses?.map(item => (
                  <div key={item.id} className="flex justify-between py-3 border-b border-slate-700">
                    <span>{item.name}</span>
                    <span className="font-semibold">${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-400">${budgetData?.expenses?.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Financial Goals</h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2">
                <Plus size={20} /> Add Goal
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <Target className="mx-auto mb-4 text-purple-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">Set Your First Goal</h3>
              <p className="text-slate-400 mb-4">Track progress towards emergency funds, vacations, or big purchases.</p>
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">Create Goal</button>
            </div>
          </div>
        )}

        {/* Bills Tab (from More menu) */}
        {activeTab === 'bills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bills & Recurring</h2>
              <button onClick={() => setShowAddBillModal(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2">
                <Plus size={20} /> Add Bill
              </button>
            </div>
            {billDates && billDates.length > 0 ? (
              <div className="space-y-3">
                {billDates.map(bill => (
                  <div key={bill.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{bill.name}</p>
                      <p className="text-sm text-slate-400">Due: {bill.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-orange-400">${bill.amount?.toLocaleString()}</span>
                      <button onClick={() => deleteBillDate(bill.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                <Receipt className="mx-auto mb-4 text-orange-400" size={48} />
                <p className="text-slate-400">No bills yet. Add recurring bills to track due dates.</p>
              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <ReportsSection transactions={transactions} budgetData={budgetData} investments={investments} />
        )}

        {/* Retirement & FIRE Tab */}
        {activeTab === 'retirement' && (
          <RetirementFIRE investments={investments} addInvestment={addInvestment} budgetData={budgetData} />
        )}

        {/* Net Worth Tab */}
        {activeTab === 'netWorth' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Net Worth Tracker</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <BarChart3 className="mx-auto mb-4 text-blue-400" size={48} />
              <p className="text-slate-400">Net worth tracking coming soon. Track your assets and liabilities.</p>
            </div>
          </div>
        )}

        {/* CPA Export Tab */}
        {activeTab === 'cpa' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">CPA Export / Tax Center</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-300 mb-4">Export your transactions for your accountant or tax software.</p>
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
                <Download size={20} /> Export CSV
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400">Settings and preferences coming soon.</p>
            </div>
          </div>
        )}

        {/* Other placeholder tabs */}
        {['accounts', 'integrations', 'help', 'profile'].includes(activeTab) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
              <Settings className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-slate-400">This feature is coming soon.</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Bill</h3>
            <div className="space-y-4">
              <input placeholder="Bill name" value={newBill.name} onChange={(e) => setNewBill({...newBill, name: e.target.value})} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
              <input type="number" placeholder="Amount" value={newBill.amount} onChange={(e) => setNewBill({...newBill, amount: e.target.value})} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
              <input type="date" value={newBill.dueDate} onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg" />
              <div className="flex gap-3">
                <button onClick={() => setShowAddBillModal(false)} className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg">Cancel</button>
                <button onClick={handleAddBill} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg">Add Bill</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action FAB */}
      <QuickActionButton
        onAddTransaction={() => setActiveTab('transactions')}
        onAddGoal={() => setActiveTab('goals')}
        onAddBill={() => { setActiveTab('bills'); setShowAddBillModal(true); }}
      />

      {/* Bottom Navigation (Mobile) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onMoreClick={() => setShowMoreMenu(true)} />

      {/* More Menu Slide-out */}
      <MoreMenu isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} onNavigate={handleMoreNavigate} user={user} onSignOut={signOut} />
    </div>
  );
};

// Main App Component
const FinanceDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard user={user} signOut={signOut} />;
};

export default FinanceDashboard;
