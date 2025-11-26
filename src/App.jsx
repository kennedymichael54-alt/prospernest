import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ============================================
// ERROR BOUNDARY - Prevents blank page crashes
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
            <p className="text-purple-200 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
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
// AUTH CONTEXT (Simplified for demo)
// ============================================
const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  return context || { user: null, loading: false };
};

// ============================================
// MAIN APP COMPONENT
// ============================================
function FamilyFinanceApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Demo User', email: 'demo@example.com' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Simulate auth check and prevent blank page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Loading state with animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-300/30 rounded-full animate-spin border-t-purple-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">💜</span>
            </div>
          </div>
          <p className="text-purple-200 mt-4 font-medium">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: isLoading }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* AI Chatbot Sidebar */}
        <AIChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

        {/* Chat Toggle Button - Desktop */}
        <button
          onClick={() => setShowChatbot(true)}
          className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 px-3 py-4 bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105 border border-purple-400/30"
        >
          <span className="text-2xl">🤖</span>
          <span className="text-xs font-semibold writing-mode-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>AI Help</span>
        </button>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 lg:pb-8">
          {/* Header */}
          <header className="pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
                  💜
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Family Finance
                  </h1>
                  <p className="text-purple-300/70 text-sm">Welcome back, {user?.name?.split(' ')[0] || 'Friend'}!</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Chat Button */}
                <button
                  onClick={() => setShowChatbot(true)}
                  className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-xl">🤖</span>
                </button>
                <button
                  onClick={() => setShowMoreMenu(true)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
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

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'networth' && <PlaceholderPage title="Net Worth" icon="📈" />}
          {activeTab === 'reports' && <PlaceholderPage title="Reports" icon="📊" />}
          {activeTab === 'retirement' && <PlaceholderPage title="Retirement & FIRE" icon="🎯" />}
          {activeTab === 'settings' && <PlaceholderPage title="Settings" icon="⚙️" />}
        </div>

        {/* Quick Action FAB */}
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="fixed right-4 bottom-24 lg:bottom-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/40 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          {showQuickActions ? '✕' : '+'}
        </button>

        {/* Quick Actions Menu */}
        {showQuickActions && (
          <div className="fixed right-4 bottom-44 lg:bottom-28 z-50 flex flex-col gap-3 items-end">
            {[
              { icon: '💰', label: 'Add Income', color: 'from-emerald-500 to-emerald-600' },
              { icon: '🛒', label: 'Add Expense', color: 'from-rose-500 to-rose-600' },
              { icon: '🔄', label: 'Transfer', color: 'from-blue-500 to-blue-600' },
              { icon: '📋', label: 'Add Bill', color: 'from-amber-500 to-amber-600' },
            ].map((action, i) => (
              <button
                key={action.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${action.color} shadow-lg hover:scale-105 transition-transform animate-fade-in`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
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
              { id: 'retirement', label: 'Goals', icon: '🎯' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all min-w-[64px] ${
                  activeTab === tab.id
                    ? 'text-purple-400'
                    : 'text-purple-300/50 hover:text-purple-200'
                }`}
              >
                <span className="text-2xl mb-0.5">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* More Menu Overlay */}
        {showMoreMenu && (
          <MoreMenu onClose={() => setShowMoreMenu(false)} />
        )}
      </div>
    </AuthContext.Provider>
  );
}

// ============================================
// AI CHATBOT COMPONENT
// ============================================
function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm your AI finance assistant. I can help you:\n\n• Navigate the app features\n• Explain financial concepts\n• Analyze your spending patterns\n• Suggest budgeting tips\n• Answer any questions!\n\nWhat would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (in production, this would call the Claude API)
    setTimeout(() => {
      const responses = getSmartResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: responses }]);
      setIsTyping(false);
    }, 1000);
  };

  const getSmartResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('budget') || q.includes('spending')) {
      return "📊 **Budgeting Tips**\n\nBased on your dashboard, here's how to optimize:\n\n1. **50/30/20 Rule**: Needs (50%), Wants (30%), Savings (20%)\n2. Your current savings rate shows on the dashboard\n3. Click the '+' button to track expenses\n\nWant me to explain any specific budgeting strategy?";
    }
    if (q.includes('bill') || q.includes('payment')) {
      return "📋 **Bills & Payments**\n\nYour upcoming bills are shown in the dashboard widget. Here's how to manage them:\n\n1. Bills due within 3 days show warning alerts\n2. Use Quick Actions (+) → 'Add Bill' to add new recurring bills\n3. Mark bills as paid to track your cash flow\n\nNeed help setting up bill reminders?";
    }
    if (q.includes('net worth') || q.includes('assets')) {
      return "💎 **Net Worth Tracking**\n\nYour net worth = Assets - Liabilities\n\n• Go to the 'Net Worth' tab for detailed breakdown\n• Track accounts, investments, property values\n• Monitor debt payoff progress\n\nWould you like tips on growing your net worth?";
    }
    if (q.includes('retire') || q.includes('fire')) {
      return "🎯 **Retirement & FIRE**\n\nFIRE = Financial Independence, Retire Early\n\n• Your FIRE number is typically 25x annual expenses\n• Check the Retirement tab for projections\n• Savings rate is key - yours is shown on dashboard\n\nWant me to explain different FIRE strategies?";
    }
    if (q.includes('help') || q.includes('how')) {
      return "🚀 **Quick Navigation Guide**\n\n• **Dashboard**: Overview of finances, quick stats\n• **Net Worth**: Track assets & liabilities\n• **Reports**: Spending analysis & trends\n• **Goals**: Retirement & FIRE planning\n• **+ Button**: Quick add transactions/bills\n\nWhat feature would you like to explore?";
    }
    if (q.includes('save') || q.includes('saving')) {
      return "💰 **Saving Strategies**\n\n1. **Pay yourself first**: Automate savings transfers\n2. **Track every expense**: Use the + button\n3. **Review weekly**: Check Reports tab\n4. **Emergency fund**: Aim for 3-6 months expenses\n\nYour current savings rate is shown on the dashboard!";
    }
    
    return "I'd be happy to help with that! 🤔\n\nFor the best experience, try asking about:\n• Budgeting strategies\n• Bill management\n• Net worth tracking\n• Retirement planning\n• Saving tips\n• App navigation\n\nWhat would you like to explore?";
  };

  const quickPrompts = [
    "How do I add a bill?",
    "Explain budgeting",
    "FIRE strategy tips",
    "Navigate the app"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Backdrop for mobile */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-96 bg-slate-900/98 backdrop-blur-xl border-r border-purple-500/20 flex flex-col shadow-2xl shadow-purple-500/10 animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <h2 className="font-bold text-white">AI Assistant</h2>
                <p className="text-xs text-purple-300">Powered by Claude</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-purple-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-br-sm'
                    : 'bg-white/10 text-purple-100 rounded-bl-sm border border-white/5'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-200 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD COMPONENT
// ============================================
function Dashboard() {
  const financialData = {
    netWorth: 285420,
    netWorthChange: 12.4,
    monthlyIncome: 8500,
    monthlyExpenses: 5200,
    savingsRate: 38.8,
    fireNumber: 1250000,
    fireProgress: 22.8,
    budgetUsed: 68,
    retirementBalance: 142000,
    cashBalance: 24500,
    investmentBalance: 118920,
  };

  const upcomingBills = [
    { name: 'Mortgage', amount: 2100, dueDate: '2024-12-01', icon: '🏠', status: 'due-soon' },
    { name: 'Electric', amount: 145, dueDate: '2024-12-03', icon: '⚡', status: 'due-soon' },
    { name: 'Internet', amount: 79, dueDate: '2024-12-05', icon: '📶', status: 'upcoming' },
    { name: 'Car Insurance', amount: 185, dueDate: '2024-12-15', icon: '🚗', status: 'upcoming' },
  ];

  const recentTransactions = [
    { name: 'Grocery Store', amount: -127.43, date: 'Today', category: '🛒', type: 'expense' },
    { name: 'Salary Deposit', amount: 4250.00, date: 'Yesterday', category: '💼', type: 'income' },
    { name: 'Netflix', amount: -15.99, date: 'Nov 22', category: '📺', type: 'expense' },
    { name: 'Gas Station', amount: -52.30, date: 'Nov 21', category: '⛽', type: 'expense' },
    { name: 'Freelance Pay', amount: 800.00, date: 'Nov 20', category: '💻', type: 'income' },
  ];

  const aiInsights = [
    { icon: '💡', text: 'Your savings rate of 38.8% is excellent! You\'re on track for early retirement.', type: 'positive' },
    { icon: '⚠️', text: '2 bills due in the next 3 days totaling $2,245', type: 'warning' },
    { icon: '📈', text: 'Net worth up 12.4% this year - great progress!', type: 'positive' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Net Worth Card */}
        <div className="bg-gradient-to-br from-purple-600/90 to-purple-700/90 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/20 shadow-xl shadow-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-purple-200 font-medium">Net Worth</span>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            ${financialData.netWorth.toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-300 text-sm font-semibold">↑ {financialData.netWorthChange}%</span>
            <span className="text-purple-200/70 text-sm">this year</span>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="bg-gradient-to-br from-indigo-600/80 to-indigo-700/80 backdrop-blur-xl rounded-3xl p-6 border border-indigo-400/20 shadow-xl shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-200 font-medium">Monthly Cash Flow</span>
            <span className="text-2xl">💵</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-indigo-200/80 text-sm">Income</span>
              <span className="text-emerald-300 font-semibold">+${financialData.monthlyIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-200/80 text-sm">Expenses</span>
              <span className="text-rose-300 font-semibold">-${financialData.monthlyExpenses.toLocaleString()}</span>
            </div>
            <div className="h-px bg-white/20"></div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-200 text-sm font-medium">Net</span>
              <span className="text-2xl font-bold text-white">+${(financialData.monthlyIncome - financialData.monthlyExpenses).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Budget Ring Card */}
        <div className="bg-gradient-to-br from-fuchsia-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-6 border border-pink-400/20 shadow-xl shadow-pink-500/20 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-pink-200 font-medium">Monthly Budget</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#budgetGradient)" strokeWidth="12"
                  strokeDasharray={`${financialData.budgetUsed * 2.51} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{financialData.budgetUsed}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-white">${financialData.monthlyExpenses.toLocaleString()}</div>
              <div className="text-pink-200/70 text-sm">of $7,600 budget</div>
              <div className="text-emerald-300 text-sm font-medium mt-1">$2,400 remaining</div>
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
          {aiInsights.map((insight, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                insight.type === 'positive' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                insight.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' :
                'bg-white/5 border border-white/10'
              }`}
            >
              <span className="text-lg">{insight.icon}</span>
              <p className="text-sm text-purple-100">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Bills */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h3 className="font-semibold text-white">Upcoming Bills</h3>
            </div>
            <button className="text-purple-400 text-sm font-medium hover:text-purple-300">View All</button>
          </div>
          <div className="space-y-3">
            {upcomingBills.map((bill, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  bill.status === 'due-soon' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5 border border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bill.icon}</span>
                  <div>
                    <p className="font-medium text-white">{bill.name}</p>
                    <p className="text-xs text-purple-300/70">{bill.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">${bill.amount.toLocaleString()}</p>
                  {bill.status === 'due-soon' && (
                    <p className="text-xs text-amber-400">Due soon</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💳</span>
              <h3 className="font-semibold text-white">Recent Transactions</h3>
            </div>
            <button className="text-purple-400 text-sm font-medium hover:text-purple-300">View All</button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tx.category}</span>
                  <div>
                    <p className="font-medium text-white">{tx.name}</p>
                    <p className="text-xs text-purple-300/70">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Savings Rate */}
        <div className="bg-gradient-to-br from-emerald-600/70 to-teal-600/70 backdrop-blur-xl rounded-3xl p-5 border border-emerald-400/20 shadow-xl shadow-emerald-500/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-emerald-200 font-medium">Savings Rate</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{financialData.savingsRate}%</div>
          <p className="text-emerald-200/70 text-sm">Excellent! Above 35% target</p>
        </div>

        {/* FIRE Progress */}
        <div className="bg-gradient-to-br from-orange-600/70 to-amber-600/70 backdrop-blur-xl rounded-3xl p-5 border border-orange-400/20 shadow-xl shadow-orange-500/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-200 font-medium">FIRE Progress</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{financialData.fireProgress}%</div>
          <p className="text-orange-200/70 text-sm">${financialData.netWorth.toLocaleString()} / ${financialData.fireNumber.toLocaleString()}</p>
        </div>

        {/* Retirement */}
        <div className="bg-gradient-to-br from-cyan-600/70 to-blue-600/70 backdrop-blur-xl rounded-3xl p-5 border border-cyan-400/20 shadow-xl shadow-cyan-500/10 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-200 font-medium">Retirement</span>
            <span className="text-2xl">🏖️</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">${(financialData.retirementBalance / 1000).toFixed(0)}K</div>
          <p className="text-cyan-200/70 text-sm">401(k) + IRA combined</p>
        </div>
      </div>

      {/* Account Balances */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🏦</span>
          <h3 className="font-semibold text-white">Account Balances</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Checking', amount: 8500, icon: '💳', color: 'from-slate-600 to-slate-700' },
            { name: 'Savings', amount: 16000, icon: '🏦', color: 'from-purple-600 to-purple-700' },
            { name: 'Investment', amount: 118920, icon: '📈', color: 'from-indigo-600 to-indigo-700' },
            { name: 'Retirement', amount: 142000, icon: '🎯', color: 'from-emerald-600 to-emerald-700' },
          ].map((account, i) => (
            <div key={i} className={`bg-gradient-to-br ${account.color} rounded-2xl p-4 border border-white/10`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">{account.name}</span>
                <span className="text-lg">{account.icon}</span>
              </div>
              <div className="text-xl font-bold text-white">${account.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PLACEHOLDER PAGE COMPONENT
// ============================================
function PlaceholderPage({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="text-8xl mb-6">{icon}</div>
      <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
      <p className="text-purple-300/70 text-center max-w-md">
        This section is coming soon! We're working hard to bring you powerful tools for managing your {title.toLowerCase()}.
      </p>
      <button className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 transition-opacity">
        Get Notified When Ready
      </button>
    </div>
  );
}

// ============================================
// MORE MENU COMPONENT
// ============================================
function MoreMenu({ onClose }) {
  const menuItems = [
    { icon: '👤', label: 'Profile', desc: 'Manage your account' },
    { icon: '🔗', label: 'Link Accounts', desc: 'Connect bank accounts' },
    { icon: '📤', label: 'Export Data', desc: 'Download your data' },
    { icon: '🌙', label: 'Dark Mode', desc: 'Toggle theme' },
    { icon: '🔔', label: 'Notifications', desc: 'Manage alerts' },
    { icon: '🔒', label: 'Security', desc: 'Password & 2FA' },
    { icon: '❓', label: 'Help & Support', desc: 'Get assistance' },
    { icon: '🚪', label: 'Sign Out', desc: 'Log out of account' },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900/98 backdrop-blur-xl border-l border-purple-500/20 animate-slide-in-right">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              ✕
            </button>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-medium text-white">{item.label}</p>
                <p className="text-sm text-purple-300/70">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STYLES (Add to index.css or include inline)
// ============================================
const styles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================
// EXPORT WITH ERROR BOUNDARY
// ============================================
export default function App() {
  return (
    <ErrorBoundary>
      <FamilyFinanceApp />
    </ErrorBoundary>
  );
}
