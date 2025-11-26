import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Upload, Plus, Trash2, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Search, LogOut, User, Loader2, Home, CreditCard, PiggyBank, X, ChevronRight, Bell, Wallet, Calculator, FileText, Settings, HelpCircle, Link2, BarChart3, Flame, AlertCircle, CheckCircle, Lightbulb, Menu, Clock, Receipt, ArrowUpRight, ArrowDownRight, Zap, Award, Sparkles, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './contexts/AuthContext';
import { useUserData } from './hooks/useUserData';

// ============================================
// PREMIUM DASHBOARD COMPONENTS
// ============================================

// Animated Number Counter
const AnimatedNumber = ({ value, prefix = '$', suffix = '', className = '' }) => {
  return (
    <span className={className}>
      {prefix}{value?.toLocaleString() || '0'}{suffix}
    </span>
  );
};

// Circular Progress Ring
const ProgressRing = ({ progress, size = 120, strokeWidth = 10, color = '#8B5CF6' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// Trend Badge Component
const TrendBadge = ({ value, positive }) => {
  const isUp = value > 0;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
      isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}>
      {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {Math.abs(value).toFixed(1)}%
    </div>
  );
};

// ============================================
// TOP SECTION - Hero Stats
// ============================================
const HeroStats = ({ netWorth, netWorthChange, cashFlow, income, expenses, budgetProgress }) => {
  const [showNetWorth, setShowNetWorth] = useState(true);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Net Worth Card */}
      <div className="bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-300 font-medium flex items-center gap-2">
              💰 Total Net Worth
            </span>
            <button onClick={() => setShowNetWorth(!showNetWorth)} className="text-slate-400 hover:text-white">
              {showNetWorth ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl md:text-5xl font-bold text-white">
              {showNetWorth ? `$${netWorth.toLocaleString()}` : '••••••'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendBadge value={netWorthChange} positive={netWorthChange > 0} />
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Card */}
      <div className="bg-gradient-to-br from-emerald-600/20 via-green-600/20 to-teal-600/20 border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <span className="text-sm text-green-300 font-medium flex items-center gap-2">
            📊 Cash Flow This Month
          </span>
          <div className="flex items-end gap-3 mt-2 mb-3">
            <span className={`text-4xl md:text-5xl font-bold ${cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {cashFlow >= 0 ? '+' : ''}{cashFlow.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-slate-300">In: ${income.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-300">Out: ${expenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Ring Card */}
      <div className="bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-sky-600/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <ProgressRing 
            progress={budgetProgress} 
            size={100} 
            strokeWidth={8}
            color={budgetProgress > 90 ? '#EF4444' : budgetProgress > 75 ? '#F59E0B' : '#10B981'}
          />
          <div>
            <span className="text-sm text-blue-300 font-medium flex items-center gap-2">
              🎯 Budget Used
            </span>
            <p className="text-2xl font-bold text-white mt-1">
              {budgetProgress > 100 ? 'Over Budget!' : `${(100 - budgetProgress).toFixed(0)}% left`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {budgetProgress <= 75 ? '✨ On track!' : budgetProgress <= 90 ? '⚠️ Watch spending' : '🚨 Slow down!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MIDDLE SECTION - Activity Cards
// ============================================

// Upcoming Bills Widget
const UpcomingBillsCard = ({ bills, onViewAll }) => {
  const sortedBills = useMemo(() => {
    if (!bills || bills.length === 0) return [];
    const today = new Date();
    return bills
      .map(b => ({ ...b, daysUntil: Math.ceil((new Date(b.dueDate) - today) / (1000 * 60 * 60 * 24)) }))
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 4);
  }, [bills]);

  const overdueCount = sortedBills.filter(b => b.daysUntil < 0).length;
  const upcomingTotal = sortedBills.filter(b => b.daysUntil >= 0 && b.daysUntil <= 7).reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          📅 Upcoming Bills
        </h3>
        <button onClick={onViewAll} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
          View All →
        </button>
      </div>

      {overdueCount > 0 && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 animate-pulse">
          <span className="text-lg">🚨</span>
          <span className="text-sm text-red-300 font-medium">{overdueCount} overdue!</span>
        </div>
      )}

      {upcomingTotal > 0 && (
        <div className="mb-3 p-2 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-between">
          <span className="text-sm text-orange-300">Due this week</span>
          <span className="font-bold text-orange-400">${upcomingTotal.toLocaleString()}</span>
        </div>
      )}

      {sortedBills.length > 0 ? (
        <div className="space-y-2">
          {sortedBills.map(bill => (
            <div key={bill.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  bill.daysUntil < 0 ? 'bg-red-500/20' :
                  bill.daysUntil <= 3 ? 'bg-orange-500/20' :
                  'bg-slate-600/50'
                }`}>
                  {bill.daysUntil < 0 ? '⚠️' : bill.daysUntil <= 3 ? '⏰' : '📄'}
                </div>
                <div>
                  <p className="font-medium text-sm">{bill.name}</p>
                  <p className={`text-xs ${
                    bill.daysUntil < 0 ? 'text-red-400' : 
                    bill.daysUntil <= 3 ? 'text-orange-400' : 
                    'text-slate-400'
                  }`}>
                    {bill.daysUntil < 0 ? `${Math.abs(bill.daysUntil)}d overdue` :
                     bill.daysUntil === 0 ? 'Due today!' :
                     bill.daysUntil === 1 ? 'Due tomorrow' :
                     `Due in ${bill.daysUntil} days`}
                  </p>
                </div>
              </div>
              <span className="font-bold text-white">${bill.amount?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-4xl mb-2 block">🎉</span>
          <p className="text-slate-400 text-sm">No upcoming bills!</p>
        </div>
      )}
    </div>
  );
};

// Recent Transactions Widget
const RecentTransactionsCard = ({ transactions, onViewAll }) => {
  const recentTx = useMemo(() => {
    if (!transactions) return [];
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const getCategoryEmoji = (category, type) => {
    if (type === 'income') return '💵';
    const emojis = {
      'Housing': '🏠', 'Food': '🍔', 'Utilities': '💡', 'Transportation': '🚗',
      'Insurance': '🛡️', 'Healthcare': '🏥', 'Entertainment': '🎬', 'Shopping': '🛒',
      'Salary': '💰', 'Freelance': '💻', 'Investment': '📈'
    };
    return emojis[category] || '💳';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          💳 Recent Activity
        </h3>
        <button onClick={onViewAll} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
          View All →
        </button>
      </div>

      {recentTx.length > 0 ? (
        <div className="space-y-2">
          {recentTx.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-600/50 flex items-center justify-center text-lg">
                  {getCategoryEmoji(tx.category, tx.type)}
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[120px] md:max-w-[180px]">{tx.description}</p>
                  <p className="text-xs text-slate-400">{tx.date}</p>
                </div>
              </div>
              <span className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-white'}`}>
                {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-4xl mb-2 block">📝</span>
          <p className="text-slate-400 text-sm">No transactions yet</p>
          <button onClick={onViewAll} className="mt-2 text-purple-400 text-sm font-medium">
            Add your first →
          </button>
        </div>
      )}
    </div>
  );
};

// AI Insights Card
const InsightsCard = ({ transactions, budgetData, investments, savingsRate }) => {
  const insights = useMemo(() => {
    const result = [];
    
    // Spending insight
    if (transactions && transactions.length > 5) {
      const thisMonth = transactions.filter(t => {
        const d = new Date(t.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      
      const categories = {};
      thisMonth.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category || 'Other'] = (categories[t.category || 'Other'] || 0) + Math.abs(t.amount);
      });
      
      const topCat = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
      if (topCat) {
        result.push({
          emoji: '📊',
          title: 'Top Spending',
          text: `${topCat[0]} is your biggest expense at $${topCat[1].toLocaleString()}`,
          type: 'info'
        });
      }
    }
    
    // Savings rate insight
    if (savingsRate !== undefined) {
      if (savingsRate >= 20) {
        result.push({
          emoji: '🏆',
          title: 'Amazing Saver!',
          text: `${savingsRate.toFixed(0)}% savings rate - you're crushing it!`,
          type: 'success'
        });
      } else if (savingsRate > 0) {
        result.push({
          emoji: '💪',
          title: 'Keep Going',
          text: `${savingsRate.toFixed(0)}% savings rate - aim for 20%+`,
          type: 'warning'
        });
      }
    }
    
    // Investment milestone
    if (investments && investments.length > 0) {
      const total = investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
      if (total >= 100000) {
        result.push({
          emoji: '🎯',
          title: 'Six Figures!',
          text: `Your investments crossed $${(total / 1000).toFixed(0)}k!`,
          type: 'success'
        });
      }
    }
    
    // Default if no insights
    if (result.length === 0) {
      result.push({
        emoji: '✨',
        title: 'Get Started',
        text: 'Add transactions to unlock personalized insights',
        type: 'info'
      });
    }
    
    return result.slice(0, 3);
  }, [transactions, budgetData, investments, savingsRate]);

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-amber-400" size={20} />
        <h3 className="font-semibold">AI Insights</h3>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Smart</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className={`p-3 rounded-xl border ${
            insight.type === 'success' ? 'bg-green-500/10 border-green-500/30' :
            insight.type === 'warning' ? 'bg-orange-500/10 border-orange-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{insight.emoji}</span>
              <div>
                <p className="font-semibold text-sm">{insight.title}</p>
                <p className="text-xs text-slate-300 mt-0.5">{insight.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// BOTTOM SECTION - Snapshots
// ============================================

// Retirement Snapshot
const RetirementSnapshot = ({ investments, onViewMore }) => {
  const totalValue = useMemo(() => {
    if (!investments) return 0;
    return investments.reduce((sum, i) => sum + (i.currentValue || 0), 0);
  }, [investments]);

  const targetValue = 1000000; // Example FIRE target
  const progress = Math.min((totalValue / targetValue) * 100, 100);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          🔥 Retirement
        </h3>
        <button onClick={onViewMore} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
          Details →
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">of ${targetValue.toLocaleString()} goal</p>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="text-center">
          <span className="text-4xl">🎯</span>
          <p className="text-xs text-slate-400 mt-1">{progress.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};

// Goals Snapshot
const GoalsSnapshot = ({ onViewMore }) => {
  // Placeholder goals - would come from props
  const goals = [
    { name: 'Emergency Fund', current: 8500, target: 10000, emoji: '🛡️' },
    { name: 'Vacation', current: 2400, target: 5000, emoji: '✈️' },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          🎯 Goals
        </h3>
        <button onClick={onViewMore} className="text-xs text-purple-400 hover:text-purple-300 font-medium">
          All Goals →
        </button>
      </div>

      <div className="space-y-3">
        {goals.map((goal, i) => (
          <div key={i}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <span>{goal.emoji}</span>
                <span>{goal.name}</span>
              </span>
              <span className="text-slate-400">
                ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Savings Rate Card
const SavingsRateCard = ({ rate, fireYears }) => {
  const getMessage = () => {
    if (rate >= 50) return { emoji: '🚀', text: 'FIRE in sight!', color: 'text-green-400' };
    if (rate >= 30) return { emoji: '💪', text: 'Excellent!', color: 'text-green-400' };
    if (rate >= 20) return { emoji: '👍', text: 'On track', color: 'text-blue-400' };
    if (rate >= 10) return { emoji: '📈', text: 'Building momentum', color: 'text-yellow-400' };
    return { emoji: '🌱', text: 'Room to grow', color: 'text-orange-400' };
  };

  const msg = getMessage();

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold flex items-center gap-2">
          💎 Savings Rate
        </h3>
        <span className="text-3xl">{msg.emoji}</span>
      </div>

      <div className="flex items-end gap-2">
        <span className={`text-5xl font-bold ${msg.color}`}>{rate.toFixed(0)}</span>
        <span className="text-2xl text-slate-400 mb-1">%</span>
      </div>
      
      <p className={`text-sm ${msg.color} mt-1`}>{msg.text}</p>
      
      {fireYears && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-400">Estimated FIRE timeline</p>
          <p className="text-lg font-bold text-white">{fireYears} years</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// QUICK ACTIONS & NAVIGATION
// ============================================

const QuickActionButton = ({ onAddTransaction, onAddGoal, onAddBill }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-2 min-w-[200px] animate-in slide-in-from-bottom-2">
          <button onClick={() => { onAddTransaction(); setIsOpen(false); }} 
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-xl transition-colors">
            <span className="text-xl">💳</span>
            <span className="font-medium">Add Transaction</span>
          </button>
          <button onClick={() => { onAddGoal(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-xl transition-colors">
            <span className="text-xl">🎯</span>
            <span className="font-medium">New Goal</span>
          </button>
          <button onClick={() => { onAddBill(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 rounded-xl transition-colors">
            <span className="text-xl">📅</span>
            <span className="font-medium">Add Bill</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isOpen ? 'rotate-45' : ''}`}
      >
        <Plus size={28} className="text-white" />
      </button>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, onMoreClick }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'transactions', label: 'Activity', icon: '💳' },
    { id: 'budget', label: 'Budget', icon: '📊' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'more', label: 'More', icon: '☰' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-40 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => item.id === 'more' ? onMoreClick() : setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
              activeTab === item.id ? 'text-purple-400 scale-105' : 'text-slate-500'
            }`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const MoreMenu = ({ isOpen, onClose, onNavigate, user, onSignOut }) => {
  const menuSections = [
    {
      title: 'Money',
      items: [
        { id: 'bills', label: 'Bills & Subscriptions', icon: '📅', desc: 'Track due dates' },
        { id: 'accounts', label: 'Accounts', icon: '🏦', desc: 'Linked accounts' },
        { id: 'netWorth', label: 'Net Worth', icon: '📈', desc: 'Assets & liabilities' },
      ]
    },
    {
      title: 'Planning',
      items: [
        { id: 'retirement', label: 'Retirement & FIRE', icon: '🔥', desc: 'Plan your freedom' },
        { id: 'reports', label: 'Reports', icon: '📊', desc: 'Deep insights' },
        { id: 'cpa', label: 'Tax Center', icon: '📋', desc: 'CPA exports' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'integrations', label: 'Integrations', icon: '🔗', desc: 'Connect services' },
        { id: 'settings', label: 'Settings', icon: '⚙️', desc: 'Preferences' },
        { id: 'help', label: 'Help & Support', icon: '💬', desc: 'Get assistance' },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">More</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl">
              <X size={24} />
            </button>
          </div>

          {/* User Card */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user?.email}</p>
                <p className="text-xs text-purple-300">Free Plan ✨</p>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, i) => (
            <div key={i} className="mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-2">{section.title}</p>
              <div className="space-y-1">
                {section.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-400"
          >
            <span className="text-2xl">👋</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

const Dashboard = ({ user, signOut }) => {
  const {
    budgetData, billDates, transactions, investments,
    loading: dataLoading, saving, error,
    addTransaction, deleteTransaction, addBillDate, deleteBillDate, addInvestment,
  } = useUserData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('');
  const [transactionSort, setTransactionSort] = useState('date-desc');
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });
  const [newTransaction, setNewTransaction] = useState({
    date: '', description: '', vendor: '', amount: '', type: 'expense',
    category: '', source: '', recurring: false
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment Income', 'Other Income'],
    expense: ['Housing', 'Food', 'Utilities', 'Transportation', 'Insurance', 'Healthcare', 'Entertainment', 'Shopping', 'Other']
  };

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const thisMonth = (transactions || []).filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const income = thisMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = thisMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    const cashFlow = income - expenses;

    const budgetIncome = budgetData?.income?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
    const budgetExpenses = budgetData?.expenses?.reduce((sum, i) => sum + (i.amount || 0), 0) || 0;
    const budgetProgress = budgetExpenses > 0 ? (expenses / budgetExpenses) * 100 : 0;
    const savingsRate = budgetIncome > 0 ? ((budgetIncome - budgetExpenses) / budgetIncome) * 100 : 0;

    const totalInvestments = (investments || []).reduce((sum, i) => sum + (i.currentValue || 0), 0);
    const netWorth = totalInvestments + 50000; // Placeholder for assets

    return { income, expenses, cashFlow, budgetProgress, savingsRate, netWorth, netWorthChange: 3.2 };
  }, [transactions, budgetData, investments]);

  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    let filtered = transactions.filter(t => {
      if (!transactionFilter) return true;
      return (t.description || '').toLowerCase().includes(transactionFilter.toLowerCase());
    });
    return filtered.sort((a, b) => {
      if (transactionSort === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (transactionSort === 'date-asc') return new Date(a.date) - new Date(b.date);
      return Math.abs(b.amount) - Math.abs(a.amount);
    });
  }, [transactions, transactionFilter, transactionSort]);

  // Handlers
  const handleAddTransaction = async () => {
    if (newTransaction.date && newTransaction.description && newTransaction.amount) {
      await addTransaction({
        ...newTransaction,
        amount: parseFloat(newTransaction.amount) * (newTransaction.type === 'expense' ? -1 : 1)
      });
      setNewTransaction({ date: '', description: '', vendor: '', amount: '', type: 'expense', category: '', source: '', recurring: false });
    }
  };

  const handleAddBill = async () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      await addBillDate({ name: newBill.name, amount: parseFloat(newBill.amount), dueDate: newBill.dueDate });
      setNewBill({ name: '', amount: '', dueDate: '' });
      setShowAddBillModal(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 text-white pb-20 md:pb-6">
      {/* Saving Indicator */}
      {saving && (
        <div className="fixed top-4 right-4 bg-purple-600/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 z-50 shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Saving...</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                HomeBudget Hub
              </h1>
              <p className="text-xs text-slate-400 hidden md:block">Your financial command center</p>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {['dashboard', 'transactions', 'budget', 'goals'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              <button onClick={() => setShowMoreMenu(true)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800">
                More →
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMoreMenu(true)} className="md:hidden p-2 hover:bg-slate-800 rounded-xl">
              <User size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* ============ DASHBOARD TAB ============ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Stats */}
            <HeroStats 
              netWorth={metrics.netWorth}
              netWorthChange={metrics.netWorthChange}
              cashFlow={metrics.cashFlow}
              income={metrics.income}
              expenses={metrics.expenses}
              budgetProgress={metrics.budgetProgress}
            />

            {/* Middle Section - 3 Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <UpcomingBillsCard bills={billDates} onViewAll={() => setActiveTab('bills')} />
              <RecentTransactionsCard transactions={transactions} onViewAll={() => setActiveTab('transactions')} />
              <InsightsCard 
                transactions={transactions} 
                budgetData={budgetData} 
                investments={investments}
                savingsRate={metrics.savingsRate}
              />
            </div>

            {/* Bottom Section - Snapshots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RetirementSnapshot investments={investments} onViewMore={() => setActiveTab('retirement')} />
              <GoalsSnapshot onViewMore={() => setActiveTab('goals')} />
              <SavingsRateCard rate={metrics.savingsRate} fireYears={25} />
            </div>
          </div>
        )}

        {/* ============ TRANSACTIONS TAB ============ */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Add Transaction */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">💳 Add Transaction</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                <input placeholder="Description" value={newTransaction.description} onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                <input placeholder="Vendor" value={newTransaction.vendor} onChange={(e) => setNewTransaction({...newTransaction, vendor: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                <input type="number" placeholder="Amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                <select value={newTransaction.type} onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={newTransaction.category} onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl">
                  <option value="">Category</option>
                  {categories[newTransaction.type].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Source" value={newTransaction.source} onChange={(e) => setNewTransaction({...newTransaction, source: e.target.value})} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                <button onClick={handleAddTransaction} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-medium">
                  Add
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="font-semibold">📜 All Transactions</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input placeholder="Search..." value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl" />
                  </div>
                  <select value={transactionSort} onChange={(e) => setTransactionSort(e.target.value)} className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-xl">
                    <option value="date-desc">Newest</option>
                    <option value="date-asc">Oldest</option>
                    <option value="amount-desc">Highest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {sortedTransactions.slice(0, 20).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-600/50 flex items-center justify-center shrink-0">
                        {tx.type === 'income' ? '💵' : '💳'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{tx.description}</p>
                        <p className="text-xs text-slate-400">{tx.date} • {tx.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-white'}`}>
                        {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                      </span>
                      <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {sortedTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-5xl mb-4 block">📝</span>
                    <p className="text-slate-400">No transactions yet</p>
                    <p className="text-sm text-slate-500">Add your first transaction above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ BUDGET TAB ============ */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">📊 Monthly Budget</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">💰 Income</h3>
                {budgetData?.income?.map(item => (
                  <div key={item.id} className="flex justify-between py-3 border-b border-slate-700/50">
                    <span>{item.name}</span>
                    <span className="font-bold">${item.amount?.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-400">${budgetData?.income?.reduce((s, i) => s + (i.amount || 0), 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">💸 Expenses</h3>
                {budgetData?.expenses?.map(item => (
                  <div key={item.id} className="flex justify-between py-3 border-b border-slate-700/50">
                    <span>{item.name}</span>
                    <span className="font-bold">${item.amount?.toLocaleString()}</span>
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

        {/* ============ GOALS TAB ============ */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">🎯 Financial Goals</h2>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium flex items-center gap-2">
                <Plus size={18} /> New Goal
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-xl font-semibold mb-2">Set Your First Goal</h3>
              <p className="text-slate-400 mb-4 max-w-md mx-auto">Track progress towards emergency funds, dream vacations, or big purchases.</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium">Create Goal</button>
            </div>
          </div>
        )}

        {/* ============ BILLS TAB ============ */}
        {activeTab === 'bills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">📅 Bills & Subscriptions</h2>
              <button onClick={() => setShowAddBillModal(true)} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium flex items-center gap-2">
                <Plus size={18} /> Add Bill
              </button>
            </div>
            {billDates && billDates.length > 0 ? (
              <div className="space-y-3">
                {billDates.map(bill => (
                  <div key={bill.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">📄</div>
                      <div>
                        <p className="font-semibold">{bill.name}</p>
                        <p className="text-sm text-slate-400">Due: {bill.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-orange-400">${bill.amount?.toLocaleString()}</span>
                      <button onClick={() => deleteBillDate(bill.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                <span className="text-6xl mb-4 block">📅</span>
                <p className="text-slate-400">No bills yet. Add recurring bills to never miss a payment!</p>
              </div>
            )}
          </div>
        )}

        {/* ============ RETIREMENT TAB ============ */}
        {activeTab === 'retirement' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">🔥 Retirement & FIRE</h2>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">FIRE Calculator</h3>
              <p className="text-slate-400">Coming soon - full FIRE planning tools!</p>
            </div>
          </div>
        )}

        {/* ============ OTHER TABS ============ */}
        {['netWorth', 'reports', 'cpa', 'accounts', 'integrations', 'settings', 'help'].includes(activeTab) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h2>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
              <span className="text-6xl mb-4 block">🚧</span>
              <p className="text-slate-400">This feature is coming soon!</p>
            </div>
          </div>
        )}
      </main>

      {/* Add Bill Modal */}
      {showAddBillModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">📅 Add Bill</h3>
            <div className="space-y-4">
              <input placeholder="Bill name (e.g., Netflix)" value={newBill.name} onChange={(e) => setNewBill({...newBill, name: e.target.value})} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl" />
              <input type="number" placeholder="Amount" value={newBill.amount} onChange={(e) => setNewBill({...newBill, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl" />
              <input type="date" value={newBill.dueDate} onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddBillModal(false)} className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium">Cancel</button>
                <button onClick={handleAddBill} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium">Add Bill</button>
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

      {/* Bottom Nav (Mobile) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onMoreClick={() => setShowMoreMenu(true)} />

      {/* More Menu */}
      <MoreMenu isOpen={showMoreMenu} onClose={() => setShowMoreMenu(false)} onNavigate={setActiveTab} user={user} onSignOut={signOut} />
    </div>
  );
};

// ============================================
// APP ENTRY
// ============================================
const FinanceDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return <Dashboard user={user} signOut={signOut} />;
};

export default FinanceDashboard;
