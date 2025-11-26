import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ============================================
// AUTH CONTEXT
// ============================================
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext) || { user: null };

// ============================================
// ERROR BOUNDARY
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#1e1b4b,#312e81)',padding:'20px'}}>
          <div style={{background:'rgba(255,255,255,0.1)',borderRadius:'24px',padding:'32px',maxWidth:'400px',textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>😔</div>
            <h2 style={{color:'white',marginBottom:'8px'}}>Something went wrong</h2>
            <button onClick={()=>window.location.reload()} style={{background:'linear-gradient(135deg,#8b5cf6,#ec4899)',color:'white',border:'none',padding:'12px 24px',borderRadius:'12px',fontWeight:'600',cursor:'pointer'}}>Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================
// AUTH PAGE
// ============================================
function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!email) return;
    const user = { id: '1', email, user_metadata: { full_name: name || email.split('@')[0] } };
    localStorage.setItem('ff_user', JSON.stringify(user));
    onAuth(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold shadow-2xl mb-4">FF</div>
          <h1 className="text-3xl font-bold text-white mb-2">Family Finance</h1>
          <p className="text-purple-300/70">Take control of your financial future</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50" placeholder="John Smith" />
              </div>
            )}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50" placeholder="••••••••" />
            </div>
            <button onClick={handleSubmit} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-purple-500/25">{isLogin ? 'Sign In' : 'Create Account'}</button>
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-purple-300 hover:text-white transition-colors text-sm">{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
          </div>
        </div>
        <p className="text-center text-purple-300/50 text-sm mt-4">Demo mode - enter any email to continue</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
function FamilyFinanceApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ff_user');
      if (saved) {
        setUser(JSON.parse(saved));
        loadDemoData();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  const loadDemoData = () => {
    setTransactions([
      { id: 1, name: 'Grocery Store', amount: -127.43, date: '2024-11-26', category: 'Food', icon: '🛒' },
      { id: 2, name: 'Salary Deposit', amount: 4250.00, date: '2024-11-25', category: 'Income', icon: '💼' },
      { id: 3, name: 'Netflix', amount: -15.99, date: '2024-11-22', category: 'Entertainment', icon: '📺' },
      { id: 4, name: 'Gas Station', amount: -52.30, date: '2024-11-21', category: 'Transportation', icon: '⛽' },
      { id: 5, name: 'Freelance Pay', amount: 800.00, date: '2024-11-20', category: 'Income', icon: '💻' },
    ]);
    setBills([
      { id: 1, name: 'Mortgage', amount: 2100, dueDate: '2024-12-01', icon: '🏠' },
      { id: 2, name: 'Electric', amount: 145, dueDate: '2024-12-03', icon: '⚡' },
      { id: 3, name: 'Internet', amount: 79, dueDate: '2024-12-05', icon: '📶' },
    ]);
    setAccounts([
      { id: 1, name: 'Checking', balance: 8500, type: 'bank', icon: '💳' },
      { id: 2, name: 'Savings', balance: 16000, type: 'bank', icon: '🏦' },
      { id: 3, name: 'Investment', balance: 118920, type: 'investment', icon: '📈' },
      { id: 4, name: '401(k)', balance: 98000, type: 'retirement', icon: '🎯' },
      { id: 5, name: 'Roth IRA', balance: 44000, type: 'retirement', icon: '🏖️' },
    ]);
  };

  const handleAuth = (u) => { setUser(u); loadDemoData(); };
  const handleSignOut = () => { localStorage.removeItem('ff_user'); setUser(null); };
  const getUserName = () => user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  const netWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
  const monthlyIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-pulse">FF</div>
          <p className="text-purple-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage onAuth={handleAuth} />;

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white relative overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
        </div>

        {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}

        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 lg:pb-8">
          <header className="pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/30">FF</div>
                <div>
                  <h1 className="text-xl font-bold text-white">Family Finance</h1>
                  <p className="text-purple-300/70 text-sm">Welcome back, {getUserName()}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowChatbot(true)} className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-xl">🤖</span></button>
                <button onClick={handleSignOut} className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-xl">🚪</span></button>
              </div>
            </div>

            <nav className="mt-6 flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                { id: 'networth', label: 'Net Worth', icon: '📈' },
                { id: 'reports', label: 'Reports', icon: '📊' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg' : 'text-purple-200 hover:bg-white/5'}`}>
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </header>

          {activeTab === 'dashboard' && <Dashboard transactions={transactions} bills={bills} accounts={accounts} netWorth={netWorth} monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} savingsRate={savingsRate} />}
          {activeTab === 'networth' && <NetWorth accounts={accounts} netWorth={netWorth} />}
          {activeTab === 'reports' && <Reports transactions={transactions} monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />}
          {activeTab === 'settings' && <Settings user={user} setTransactions={setTransactions} onSignOut={handleSignOut} />}
        </div>

        <button onClick={() => setShowQuickActions(!showQuickActions)} className="fixed right-4 bottom-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg flex items-center justify-center text-2xl">{showQuickActions ? '✕' : '+'}</button>
        
        {showQuickActions && (
          <div className="fixed right-4 bottom-28 z-50 flex flex-col gap-3 items-end">
            {[{ icon: '💰', label: 'Income', color: 'from-emerald-500 to-emerald-600' }, { icon: '🛒', label: 'Expense', color: 'from-rose-500 to-rose-600' }].map((a) => (
              <button key={a.label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${a.color} shadow-lg`}>
                <span>{a.icon}</span><span className="font-semibold text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ transactions, bills, accounts, netWorth, monthlyIncome, monthlyExpenses, savingsRate }) {
  const budgetUsed = Math.round((monthlyExpenses / 7600) * 100);
  const fireProgress = ((netWorth / 1250000) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-3xl p-6 border border-purple-400/20">
          <div className="flex justify-between mb-4"><span className="text-purple-200">Net Worth</span><span className="text-2xl">💎</span></div>
          <div className="text-4xl font-bold text-white">${netWorth.toLocaleString()}</div>
          <div className="text-emerald-300 text-sm mt-2">↑ 12.4% this year</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 rounded-3xl p-6 border border-indigo-400/20">
          <div className="flex justify-between mb-4"><span className="text-indigo-200">Cash Flow</span><span className="text-2xl">💵</span></div>
          <div className="text-emerald-300">+${monthlyIncome.toLocaleString()}</div>
          <div className="text-rose-300">-${monthlyExpenses.toLocaleString()}</div>
          <div className="text-2xl font-bold text-white mt-2">+${(monthlyIncome - monthlyExpenses).toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-fuchsia-600/80 to-pink-600/80 rounded-3xl p-6 border border-pink-400/20">
          <div className="flex justify-between mb-4"><span className="text-pink-200">Budget</span><span className="text-2xl">🎯</span></div>
          <div className="text-4xl font-bold text-white">{budgetUsed}%</div>
          <div className="text-pink-200/70 text-sm">of $7,600 budget</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-violet-600/50 to-purple-600/50 rounded-3xl p-5 border border-violet-400/20">
        <div className="flex items-center gap-2 mb-4"><span className="text-xl">🤖</span><h3 className="font-semibold">AI Insights</h3></div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><span>💡</span> Savings rate of {savingsRate}% is excellent!</div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><span>⚠️</span> 2 bills due soon</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><span>📋</span>Upcoming Bills</h3>
          <div className="space-y-3">
            {bills.map((b) => (
              <div key={b.id} className="flex justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3"><span className="text-2xl">{b.icon}</span><div><p className="font-medium">{b.name}</p><p className="text-xs text-purple-300/70">{b.dueDate}</p></div></div>
                <span className="font-semibold">${b.amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><span>💳</span>Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 4).map((t) => (
              <div key={t.id} className="flex justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3"><span className="text-2xl">{t.icon}</span><div><p className="font-medium">{t.name}</p><p className="text-xs text-purple-300/70">{t.category}</p></div></div>
                <span className={t.amount > 0 ? 'text-emerald-400' : ''}>{t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/70 to-teal-600/70 rounded-3xl p-5 border border-emerald-400/20">
          <div className="flex justify-between mb-2"><span className="text-emerald-200">Savings Rate</span><span>💰</span></div>
          <div className="text-4xl font-bold">{savingsRate}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-600/70 to-amber-600/70 rounded-3xl p-5 border border-orange-400/20">
          <div className="flex justify-between mb-2"><span className="text-orange-200">FIRE Progress</span><span>🔥</span></div>
          <div className="text-4xl font-bold">{fireProgress}%</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-600/70 to-blue-600/70 rounded-3xl p-5 border border-cyan-400/20">
          <div className="flex justify-between mb-2"><span className="text-cyan-200">Retirement</span><span>🏖️</span></div>
          <div className="text-4xl font-bold">$142K</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NET WORTH
// ============================================
function NetWorth({ accounts, netWorth }) {
  const assets = accounts.filter(a => a.balance > 0);
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 rounded-3xl p-6 border border-purple-400/20">
        <div className="flex justify-between mb-2"><span className="text-purple-200">Total Net Worth</span><span>💎</span></div>
        <div className="text-5xl font-bold">${netWorth.toLocaleString()}</div>
      </div>
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">📈 Assets (${totalAssets.toLocaleString()})</h3>
        <div className="space-y-3">
          {assets.map((a) => (
            <div key={a.id} className="flex justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3"><span className="text-2xl">{a.icon}</span><div><p className="font-medium">{a.name}</p><p className="text-xs text-emerald-300/70 capitalize">{a.type}</p></div></div>
              <span className="text-xl font-bold text-emerald-400">${a.balance.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPORTS
// ============================================
function Reports({ transactions, monthlyIncome, monthlyExpenses }) {
  const expenses = transactions.filter(t => t.amount < 0);
  const byCategory = expenses.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount); return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 rounded-3xl p-6 border border-emerald-400/20">
          <div className="text-emerald-200 mb-2">Income</div>
          <div className="text-3xl font-bold">${monthlyIncome.toLocaleString()}</div>
        </div>
        <div className="bg-gradient-to-br from-rose-600/80 to-rose-700/80 rounded-3xl p-6 border border-rose-400/20">
          <div className="text-rose-200 mb-2">Expenses</div>
          <div className="text-3xl font-bold">${monthlyExpenses.toLocaleString()}</div>
        </div>
      </div>
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">📊 By Category</h3>
        <div className="space-y-4">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div key={cat}>
              <div className="flex justify-between mb-1"><span>{cat}</span><span>${amt.toLocaleString()}</span></div>
              <div className="h-3 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${(amt / monthlyExpenses) * 100}%` }}></div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">📜 All Transactions</h3>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="flex justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3"><span>{t.icon}</span><div><p className="font-medium">{t.name}</p><p className="text-xs text-purple-300/70">{t.date}</p></div></div>
              <span className={t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}>{t.amount > 0 ? '+' : ''}{t.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SETTINGS
// ============================================
function Settings({ user, setTransactions, onSignOut }) {
  const [status, setStatus] = useState('');
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Processing...');
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const newTx = [];
      for (let i = 1; i < lines.length; i++) {
        const [date, name, amount, category] = lines[i].split(',');
        if (date && name && amount) {
          newTx.push({ id: Date.now() + i, date: date.trim(), name: name.trim(), amount: parseFloat(amount), category: category?.trim() || 'Other', icon: '📝' });
        }
      }
      setTransactions(prev => [...newTx, ...prev]);
      setStatus(`✅ Imported ${newTx.length} transactions!`);
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold mb-4">👤 Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">{user?.user_metadata?.full_name?.[0] || 'U'}</div>
          <div>
            <p className="text-xl font-bold">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-purple-300/70">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-3xl p-6 border border-purple-400/30">
        <h3 className="text-xl font-bold mb-2">📤 Import Transactions</h3>
        <p className="text-purple-200/70 mb-4">Upload CSV files from your bank</p>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
        <button onClick={() => fileRef.current?.click()} className="w-full py-4 rounded-xl bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-all">📄 Upload CSV File</button>
        {status && <div className={`mt-4 p-3 rounded-xl ${status.includes('✅') ? 'bg-emerald-500/20 text-emerald-200' : status.includes('❌') ? 'bg-red-500/20 text-red-200' : 'bg-amber-500/20 text-amber-200'}`}>{status}</div>}
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-purple-200 font-medium mb-2">CSV Format:</p>
          <code className="text-xs text-purple-300/70">date,description,amount,category<br/>2024-11-26,Grocery,-127.43,Food</code>
        </div>
      </div>

      <button onClick={onSignOut} className="w-full py-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-semibold hover:bg-red-500/30">Sign Out</button>
    </div>
  );
}

// ============================================
// CHATBOT
// ============================================
function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi! 👋 I can help you navigate the app. Ask about importing data, budgeting, or any feature!" }]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', content: input }]);
    const q = input.toLowerCase();
    let r = "Try asking about importing CSV files, budgeting, or net worth tracking!";
    if (q.includes('import') || q.includes('csv')) r = "📤 Go to Settings → Upload CSV File. Format: date,description,amount,category";
    else if (q.includes('budget')) r = "📊 Your budget shows on Dashboard. Track spending by category in Reports.";
    setTimeout(() => setMessages(p => [...p, { role: 'assistant', content: r }]), 500);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-slate-900/98 border-r border-purple-500/20 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">🤖</div><span className="font-bold">AI Assistant</span></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-purple-600' : 'bg-white/10'}`}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask anything..." className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none" />
          <button onClick={send} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold">Send</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXPORT
// ============================================
export default function App() {
  return <ErrorBoundary><FamilyFinanceApp /></ErrorBoundary>;
}
