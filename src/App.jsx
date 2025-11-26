import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CLIENT
// ============================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md text-center border border-white/20">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-purple-200 mb-6">Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// AUTH PAGE (Login/Signup)
// ============================================
function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!supabase) {
        // Demo mode - no Supabase configured
        const demoUser = {
          id: 'demo-user',
          email: email,
          user_metadata: { full_name: name || email.split('@')[0] }
        };
        localStorage.setItem('ff_demo_user', JSON.stringify(demoUser));
        onAuth(demoUser);
        return;
      }

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuth(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setMessage('Check your email to confirm your account!');
        } else {
          onAuth(data.user);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold shadow-2xl shadow-purple-500/30 mb-4">
            FF
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Family Finance</h1>
          <p className="text-purple-300/70">Take control of your financial future</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="John Smith"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/25"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
              className="text-purple-300 hover:text-white transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {!supabase && (
          <p className="text-center text-purple-300/50 text-sm mt-4">
            Demo mode - enter any email/password to continue
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function FamilyFinanceApp() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Shared data state
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      // Check demo user first
      const demoUser = localStorage.getItem('ff_demo_user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
        loadDemoData();
        setIsLoading(false);
        return;
      }

      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Load user data from Supabase here
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const loadDemoData = () => {
    // Load demo transactions
    setTransactions([
      { id: 1, name: 'Grocery Store', amount: -127.43, date: '2024-11-26', category: 'Food', icon: '🛒' },
      { id: 2, name: 'Salary Deposit', amount: 4250.00, date: '2024-11-25', category: 'Income', icon: '💼' },
      { id: 3, name: 'Netflix', amount: -15.99, date: '2024-11-22', category: 'Entertainment', icon: '📺' },
      { id: 4, name: 'Gas Station', amount: -52.30, date: '2024-11-21', category: 'Transportation', icon: '⛽' },
      { id: 5, name: 'Freelance Pay', amount: 800.00, date: '2024-11-20', category: 'Income', icon: '💻' },
      { id: 6, name: 'Electric Bill', amount: -145.00, date: '2024-11-18', category: 'Utilities', icon: '⚡' },
      { id: 7, name: 'Amazon', amount: -67.99, date: '2024-11-17', category: 'Shopping', icon: '📦' },
      { id: 8, name: 'Restaurant', amount: -45.50, date: '2024-11-15', category: 'Food', icon: '🍽️' },
    ]);

    setBills([
      { id: 1, name: 'Mortgage', amount: 2100, dueDate: '2024-12-01', icon: '🏠', paid: false },
      { id: 2, name: 'Electric', amount: 145, dueDate: '2024-12-03', icon: '⚡', paid: false },
      { id: 3, name: 'Internet', amount: 79, dueDate: '2024-12-05', icon: '📶', paid: false },
      { id: 4, name: 'Car Insurance', amount: 185, dueDate: '2024-12-15', icon: '🚗', paid: false },
      { id: 5, name: 'Phone', amount: 85, dueDate: '2024-12-20', icon: '📱', paid: false },
    ]);

    setAccounts([
      { id: 1, name: 'Checking', balance: 8500, type: 'bank', icon: '💳' },
      { id: 2, name: 'Savings', balance: 16000, type: 'bank', icon: '🏦' },
      { id: 3, name: 'Investment', balance: 118920, type: 'investment', icon: '📈' },
      { id: 4, name: '401(k)', balance: 98000, type: 'retirement', icon: '🎯' },
      { id: 5, name: 'Roth IRA', balance: 44000, type: 'retirement', icon: '🏖️' },
      { id: 6, name: 'Credit Card', balance: -2450, type: 'debt', icon: '💳' },
      { id: 7, name: 'Car Loan', balance: -12500, type: 'debt', icon: '🚗' },
    ]);
  };

  const handleAuth = (authUser) => {
    setUser(authUser);
    loadDemoData();
  };

  const handleSignOut = () => {
    localStorage.removeItem('ff_demo_user');
    if (supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    setTransactions([]);
    setBills([]);
    setAccounts([]);
  };

  const getUserName = () => {
    if (!user) return 'Friend';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-purple-500/30 mx-auto mb-4 animate-pulse">
            FF
          </div>
          <p className="text-purple-200 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onAuth={handleAuth} />;
  }

  // Calculate financial data from state
  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalDebt = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));
  const netWorth = totalAssets - totalDebt;
  
  const monthlyIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : 0;

  const sharedData = {
    transactions,
    setTransactions,
    bills,
    setBills,
    accounts,
    setAccounts,
    netWorth,
    totalAssets,
    totalDebt,
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
  };

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
        </div>

        {/* AI Chatbot */}
        <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

        {/* Chat Toggle - Desktop */}
        <button
          onClick={() => setShowChatbot(true)}
          className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 px-3 py-4 bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 border border-purple-400/30"
        >
          <span className="text-2xl">🤖</span>
          <span className="text-xs font-semibold" style={{ writingMode: 'vertical-rl' }}>AI Help</span>
        </button>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 lg:pb-8">
          {/* Header */}
          <header className="pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/30">
                  FF
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Family Finance
                  </h1>
                  <p className="text-purple-300/70 text-sm">Welcome back, {getUserName()}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowChatbot(true)} className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <span className="text-xl">🤖</span>
                </button>
                <button onClick={() => setShowMoreMenu(true)} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <span className="text-xl">⚙️</span>
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex mt-6 gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm w-fit">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                { id: 'networth', label: 'Net Worth', icon: '📈' },
                { id: 'reports', label: 'Reports', icon: '📊' },
                { id: 'retirement', label: 'Retirement', icon: '🎯' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </header>

          {/* Tab Content */}
          {activeTab === 'dashboard' && <Dashboard {...sharedData} />}
          {activeTab === 'networth' && <NetWorthTab {...sharedData} />}
          {activeTab === 'reports' && <ReportsTab {...sharedData} />}
          {activeTab === 'retirement' && <RetirementTab {...sharedData} />}
          {activeTab === 'settings' && <SettingsTab {...sharedData} onSignOut={handleSignOut} />}
        </div>

        {/* Quick Action FAB */}
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="fixed right-4 bottom-24 lg:bottom-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          {showQuickActions ? '✕' : '+'}
        </button>

        {showQuickActions && (
          <div className="fixed right-4 bottom-44 lg:bottom-28 z-50 flex flex-col gap-3 items-end">
            {[
              { icon: '💰', label: 'Add Income', color: 'from-emerald-500 to-emerald-600' },
              { icon: '🛒', label: 'Add Expense', color: 'from-rose-500 to-rose-600' },
              { icon: '🔄', label: 'Transfer', color: 'from-blue-500 to-blue-600' },
              { icon: '📋', label: 'Add Bill', color: 'from-amber-500 to-amber-600' },
            ].map((action) => (
              <button key={action.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${action.color} shadow-lg hover:scale-105 transition-transform`}>
                <span className="text-xl">{action.icon}</span>
                <span className="font-semibold text-sm whitespace-nowrap">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
          <div className="flex justify-around items-center py-2 px-4">
            {[
              { id: 'dashboard', label: 'Home', icon: '🏠' },
              { id: 'networth', label: 'Worth', icon: '📈' },
              { id: 'reports', label: 'Reports', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all min-w-[64px] ${
                  activeTab === tab.id ? 'text-purple-400' : 'text-purple-300/50 hover:text-purple-200'
                }`}
              >
                <span className="text-2xl mb-0.5">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* More Menu */}
        {showMoreMenu && <MoreMenu onClose={() => setShowMoreMenu(false)} onSignOut={handleSignOut} setActiveTab={setActiveTab} />}
      </div>
    </AuthContext.Provider>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
function Dashboard({ transactions, bills, accounts, netWorth, monthlyIncome, monthlyExpenses, savingsRate }) {
  const budgetTotal = 7600;
  const budgetUsed = Math.round((monthlyExpenses / budgetTotal) * 100);
  const fireNumber = 1250000;
  const fireProgress = ((netWorth / fireNumber) * 100).toFixed(1);
  const retirementBalance = accounts.filter(a => a.type === 'retirement').reduce((sum, a) => sum + a.balance, 0);

  const upcomingBills = bills.filter(b => !b.paid).slice(0, 4);
  const recentTransactions = transactions.slice(0, 5);

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Net Worth */}
        <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-xl shadow-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-200 font-medium">Net Worth</span>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">${netWorth.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-300 text-sm font-semibold">↑ 12.4%</span>
            <span className="text-purple-200/70 text-sm">this year</span>
          </div>
        </div>

        {/* Cash Flow */}
        <div className="bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 backdrop-blur-xl rounded-3xl p-6 border border-indigo-400/20 shadow-xl shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-200 font-medium">Monthly Cash Flow</span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-indigo-200/80 text-sm">Income</span>
              <span className="text-emerald-300 font-semibold">+${monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-200/80 text-sm">Expenses</span>
              <span className="text-rose-300 font-semibold">-${monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/20"></div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-200 text-sm font-medium">Net</span>
              <span className="text-2xl font-bold text-white">+${(monthlyIncome - monthlyExpenses).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Budget Ring */}
        <div className="bg-gradient-to-br from-fuchsia-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-400/20 shadow-xl shadow-pink-500/20 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-pink-200 font-medium">Monthly Budget</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#budgetGradient)" strokeWidth="12" strokeDasharray={`${Math.min(budgetUsed, 100) * 2.51} 251`} strokeLinecap="round" />
                <defs>
                  <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{budgetUsed}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">${monthlyExpenses.toLocaleString()}</div>
              <div className="text-pink-200/70 text-sm">of ${budgetTotal.toLocaleString()} budget</div>
              <div className="text-emerald-300 text-sm font-medium mt-1">${(budgetTotal - monthlyExpenses).toLocaleString()} remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-600/50 to-purple-600/50 backdrop-blur-xl rounded-3xl p-5 border border-violet-400/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤖</span>
          <h3 className="font-semibold text-white">AI Insights</h3>
        </div>
        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-lg">💡</span>
            <p className="text-sm text-purple-100">Your savings rate of {savingsRate}% is {parseFloat(savingsRate) >= 20 ? 'excellent' : 'good'}! {parseFloat(savingsRate) >= 35 ? "You're on track for early retirement." : 'Try to increase to 30%+ for faster wealth building.'}</p>
          </div>
          {upcomingBills.filter(b => getDaysUntilDue(b.dueDate) <= 3).length > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-purple-100">
                {upcomingBills.filter(b => getDaysUntilDue(b.dueDate) <= 3).length} bills due soon totaling ${upcomingBills.filter(b => getDaysUntilDue(b.dueDate) <= 3).reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-lg">📈</span>
            <p className="text-sm text-purple-100">You're {fireProgress}% of the way to financial independence!</p>
          </div>
        </div>
      </div>

      {/* Bills & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Bills */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="font-semibold text-white">Upcoming Bills</h3>
            </div>
            <span className="text-purple-400 text-sm">{bills.length} total</span>
          </div>
          <div className="space-y-3">
            {upcomingBills.length > 0 ? upcomingBills.map((bill) => {
              const daysUntil = getDaysUntilDue(bill.dueDate);
              const isDueSoon = daysUntil <= 3;
              return (
                <div key={bill.id} className={`flex items-center justify-between p-3 rounded-xl ${isDueSoon ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5 border border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bill.icon}</span>
                    <div>
                      <p className="font-medium text-white">{bill.name}</p>
                      <p className="text-xs text-purple-300/70">{new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${bill.amount.toLocaleString()}</p>
                    {isDueSoon && <p className="text-xs text-amber-400">{daysUntil === 0 ? 'Due today!' : `${daysUntil} days`}</p>}
                  </div>
                </div>
              );
            }) : (
              <p className="text-purple-300/50 text-center py-4">No upcoming bills</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <h3 className="font-semibold text-white">Recent Transactions</h3>
            </div>
            <span className="text-purple-400 text-sm">{transactions.length} total</span>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tx.icon}</span>
                  <div>
                    <p className="font-medium text-white">{tx.name}</p>
                    <p className="text-xs text-purple-300/70">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            )) : (
              <p className="text-purple-300/50 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/70 to-teal-600/70 backdrop-blur-xl rounded-3xl p-5 border border-emerald-400/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-200 font-medium">Savings Rate</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{savingsRate}%</div>
          <p className="text-emerald-200/70 text-sm">{parseFloat(savingsRate) >= 35 ? 'Excellent!' : parseFloat(savingsRate) >= 20 ? 'Good progress' : 'Room to improve'}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-600/70 to-amber-600/70 backdrop-blur-xl rounded-3xl p-5 border border-orange-400/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-200 font-medium">FIRE Progress</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{fireProgress}%</div>
          <p className="text-orange-200/70 text-sm">${netWorth.toLocaleString()} / ${fireNumber.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600/70 to-blue-600/70 backdrop-blur-xl rounded-3xl p-5 border border-cyan-400/20 md:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-200 font-medium">Retirement</span>
            <span className="text-2xl">🏖️</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">${(retirementBalance / 1000).toFixed(0)}K</div>
          <p className="text-cyan-200/70 text-sm">401(k) + IRA combined</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NET WORTH TAB
// ============================================
function NetWorthTab({ accounts, netWorth, totalAssets, totalDebt }) {
  const assetAccounts = accounts.filter(a => a.balance > 0);
  const debtAccounts = accounts.filter(a => a.balance < 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-3xl p-6 border border-purple-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200">Net Worth</span>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-4xl font-bold text-white">${netWorth.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 rounded-3xl p-6 border border-emerald-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-200">Total Assets</span>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-4xl font-bold text-white">${totalAssets.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-rose-600/80 to-rose-700/80 rounded-3xl p-6 border border-rose-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-200">Total Debt</span>
            <span className="text-2xl">💳</span>
          </div>
          <div className="text-4xl font-bold text-white">${totalDebt.toLocaleString()}</div>
        </div>
      </div>

      {/* Assets */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📈</span> Assets
        </h3>
        <div className="space-y-3">
          {assetAccounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{account.icon}</span>
                <div>
                  <p className="font-medium text-white">{account.name}</p>
                  <p className="text-xs text-emerald-300/70 capitalize">{account.type}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-emerald-400">${account.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Debts */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💳</span> Debts
        </h3>
        <div className="space-y-3">
          {debtAccounts.length > 0 ? debtAccounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{account.icon}</span>
                <div>
                  <p className="font-medium text-white">{account.name}</p>
                  <p className="text-xs text-rose-300/70 capitalize">{account.type}</p>
                </div>
              </div>
              <span className="text-xl font-bold text-rose-400">${Math.abs(account.balance).toLocaleString()}</span>
            </div>
          )) : (
            <p className="text-purple-300/50 text-center py-4">No debts - great job! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPORTS TAB
// ============================================
function ReportsTab({ transactions, monthlyIncome, monthlyExpenses }) {
  // Group transactions by category
  const expensesByCategory = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const categories = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({ name, amount, percent: ((amount / monthlyExpenses) * 100).toFixed(1) }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors = {
    'Food': 'from-orange-500 to-orange-600',
    'Transportation': 'from-blue-500 to-blue-600',
    'Entertainment': 'from-purple-500 to-purple-600',
    'Utilities': 'from-yellow-500 to-yellow-600',
    'Shopping': 'from-pink-500 to-pink-600',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 rounded-3xl p-6 border border-emerald-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-200">Total Income</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-4xl font-bold text-white">${monthlyIncome.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-rose-600/80 to-rose-700/80 rounded-3xl p-6 border border-rose-400/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-rose-200">Total Expenses</span>
            <span className="text-2xl">🛒</span>
          </div>
          <div className="text-4xl font-bold text-white">${monthlyExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Spending by Category
        </h3>
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.name}>
              <div className="flex justify-between mb-1">
                <span className="text-purple-200">{cat.name}</span>
                <span className="text-white font-semibold">${cat.amount.toLocaleString()} ({cat.percent}%)</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${categoryColors[cat.name] || 'from-purple-500 to-purple-600'} rounded-full transition-all`}
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Transactions */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📜</span> All Transactions
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xl">{tx.icon}</span>
                <div>
                  <p className="font-medium text-white">{tx.name}</p>
                  <p className="text-xs text-purple-300/70">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// RETIREMENT TAB
// ============================================
function RetirementTab({ accounts, netWorth, savingsRate }) {
  const retirementAccounts = accounts.filter(a => a.type === 'retirement');
  const retirementTotal = retirementAccounts.reduce((sum, a) => sum + a.balance, 0);
  
  const fireNumber = 1250000;
  const fireProgress = ((netWorth / fireNumber) * 100).toFixed(1);
  const yearsToFire = savingsRate > 0 ? Math.ceil((fireNumber - netWorth) / (netWorth * (parseFloat(savingsRate) / 100))) : 99;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* FIRE Progress */}
      <div className="bg-gradient-to-br from-orange-600/80 to-amber-600/80 rounded-3xl p-6 border border-orange-400/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">🔥 FIRE Progress</h3>
            <p className="text-orange-200/70">Financial Independence, Retire Early</p>
          </div>
          <span className="text-4xl font-bold text-white">{fireProgress}%</span>
        </div>
        <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: `${Math.min(parseFloat(fireProgress), 100)}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-orange-200">Current: ${netWorth.toLocaleString()}</span>
          <span className="text-orange-200">Goal: ${fireNumber.toLocaleString()}</span>
        </div>
        <p className="text-center text-white mt-4 font-medium">
          ~{yearsToFire} years to FIRE at current rate
        </p>
      </div>

      {/* Retirement Accounts */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏖️</span> Retirement Accounts
          </h3>
          <span className="text-2xl font-bold text-emerald-400">${retirementTotal.toLocaleString()}</span>
        </div>
        <div className="space-y-3">
          {retirementAccounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{account.icon}</span>
                <p className="font-medium text-white">{account.name}</p>
              </div>
              <span className="text-xl font-bold text-cyan-400">${account.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projections */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📈</span> Retirement Projections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-purple-200 text-sm mb-1">At Age 55</p>
            <p className="text-2xl font-bold text-white">$890K</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-purple-200 text-sm mb-1">At Age 60</p>
            <p className="text-2xl font-bold text-white">$1.4M</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-purple-200 text-sm mb-1">At Age 65</p>
            <p className="text-2xl font-bold text-white">$2.1M</p>
          </div>
        </div>
        <p className="text-purple-300/50 text-xs mt-4 text-center">*Projections assume 7% annual return and current contribution rate</p>
      </div>
    </div>
  );
}

// ============================================
// SETTINGS TAB (with CSV/PDF Upload)
// ============================================
function SettingsTab({ setTransactions, setBills, setAccounts, onSignOut }) {
  const { user } = useAuth();
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('Processing...');

    try {
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const newTransactions = [];
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const tx = {
            id: Date.now() + i,
            date: values[headers.indexOf('date')] || new Date().toISOString().split('T')[0],
            name: values[headers.indexOf('description')] || values[headers.indexOf('name')] || 'Unknown',
            amount: parseFloat(values[headers.indexOf('amount')]) || 0,
            category: values[headers.indexOf('category')] || 'Other',
            icon: '📝',
          };
          newTransactions.push(tx);
        }
        
        setTransactions(prev => [...newTransactions, ...prev]);
        setUploadStatus(`✅ Imported ${newTransactions.length} transactions!`);
      } else if (file.name.endsWith('.pdf')) {
        setUploadStatus('⚠️ PDF parsing coming soon! For now, please use CSV format.');
      } else {
        setUploadStatus('❌ Please upload a CSV or PDF file');
      }
    } catch (error) {
      setUploadStatus('❌ Error processing file: ' + error.message);
    }

    // Clear status after 5 seconds
    setTimeout(() => setUploadStatus(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>👤</span> Profile
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
            {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xl font-bold text-white">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-purple-300/70">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Import Data - THIS IS THE KEY FEATURE */}
      <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>📤</span> Import Transactions
        </h3>
        <p className="text-purple-200/70 mb-4">Upload your bank statements to automatically import transactions</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            <span className="text-2xl">📄</span>
            <div className="text-left">
              <p className="font-semibold text-white">Upload CSV</p>
              <p className="text-xs text-purple-300/70">Bank export, spreadsheet</p>
            </div>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            <span className="text-2xl">📑</span>
            <div className="text-left">
              <p className="font-semibold text-white">Upload PDF</p>
              <p className="text-xs text-purple-300/70">Bank statements</p>
            </div>
          </button>
        </div>

        {uploadStatus && (
          <div className={`p-3 rounded-xl text-sm ${uploadStatus.includes('✅') ? 'bg-emerald-500/20 text-emerald-200' : uploadStatus.includes('❌') ? 'bg-red-500/20 text-red-200' : 'bg-amber-500/20 text-amber-200'}`}>
            {uploadStatus}
          </div>
        )}

        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-purple-200 font-medium mb-2">CSV Format Expected:</p>
          <code className="text-xs text-purple-300/70 block">date,description,amount,category</code>
          <code className="text-xs text-purple-300/70 block">2024-11-26,Grocery Store,-127.43,Food</code>
          <code className="text-xs text-purple-300/70 block">2024-11-25,Salary,4250.00,Income</code>
        </div>
      </div>

      {/* Link Bank Accounts */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <span>🔗</span> Link Bank Accounts
        </h3>
        <p className="text-purple-200/70 mb-4">Connect your bank for automatic syncing (coming soon)</p>
        <button className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-purple-300 font-medium opacity-50 cursor-not-allowed">
          Coming Soon - Plaid Integration
        </button>
      </div>

      {/* Other Settings */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>⚙️</span> Preferences
        </h3>
        <div className="space-y-3">
          {[
            { icon: '🌙', label: 'Dark Mode', value: 'Always On' },
            { icon: '🔔', label: 'Bill Reminders', value: '3 days before' },
            { icon: '💰', label: 'Currency', value: 'USD ($)' },
            { icon: '📊', label: 'Budget Period', value: 'Monthly' },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xl">{setting.icon}</span>
                <span className="text-white">{setting.label}</span>
              </div>
              <span className="text-purple-300/70">{setting.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={onSignOut}
        className="w-full py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/30 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}

// ============================================
// AI CHATBOT
// ============================================
function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm your AI finance assistant. I can help you navigate the app, explain features, or answer questions. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const q = input.toLowerCase();
      let response = "I'd be happy to help! Try asking about budgeting, importing data, net worth, or retirement planning.";
      
      if (q.includes('import') || q.includes('upload') || q.includes('csv')) {
        response = "📤 **Importing Data**\n\nGo to Settings → Import Transactions:\n\n1. Click 'Upload CSV'\n2. Select your bank export file\n3. Transactions will be added automatically\n\nCSV format: date,description,amount,category";
      } else if (q.includes('budget')) {
        response = "📊 **Budgeting**\n\nYour budget ring on the Dashboard shows spending vs. your monthly budget. Use the + button to add expenses and track spending by category in Reports.";
      } else if (q.includes('net worth')) {
        response = "💎 **Net Worth**\n\nGo to the Net Worth tab to see:\n• All your assets (bank, investments, retirement)\n• All debts\n• Total net worth calculation";
      } else if (q.includes('fire') || q.includes('retire')) {
        response = "🔥 **FIRE & Retirement**\n\nCheck the Retirement tab for:\n• FIRE progress tracker\n• Retirement account totals\n• Future projections\n\nFIRE Number = 25x annual expenses";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-slate-900/98 backdrop-blur-xl border-r border-purple-500/20 flex flex-col shadow-2xl">
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">🤖</div>
              <div>
                <h2 className="font-bold text-white">AI Assistant</h2>
                <p className="text-xs text-purple-300">Here to help</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-purple-200">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-sm' : 'bg-white/10 text-purple-100 rounded-bl-sm border border-white/5'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50"
            />
            <button onClick={handleSend} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MORE MENU
// ============================================
function MoreMenu({ onClose, onSignOut, setActiveTab }) {
  const menuItems = [
    { icon: '👤', label: 'Profile', action: () => { setActiveTab('settings'); onClose(); } },
    { icon: '📤', label: 'Import Data', action: () => { setActiveTab('settings'); onClose(); } },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '❓', label: 'Help', action: () => {} },
    { icon: '🚪', label: 'Sign Out', action: onSignOut },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900/98 backdrop-blur-xl border-l border-purple-500/20">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">✕</button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-left">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-white">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES
// ============================================
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================
// EXPORT
// ============================================
export default function App() {
  return (
    <ErrorBoundary>
      <FamilyFinanceApp />
    </ErrorBoundary>
  );
}
